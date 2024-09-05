import { createContext, useCallback, useEffect, useState } from "react"
import { baseURL, getRequest, postRequest } from "../utils/service"
import { io } from 'socket.io-client'

export const ChatContext = createContext()

export const ChatContextProvider = ({ children ,user }) => {
    const [userChat,setUserChat] = useState(null)
    const [userChatLoading,setUserChatLoading] = useState(false)
    const [userChatError,setUserChatError] = useState(null)
    const [potentialChat,setPotentialChat] = useState([])
    const [currentChat,setCurrentChat] = useState(null)
    const [message,setMessage] = useState(null)
    const [messageLoading,setMessageLoading] = useState(false)
    const [messageError,setMessageError] = useState(null)
    const [sendTextError,setSendTextError] = useState(null)
    const [newMessage,setNewMessage] = useState(null)
    const [socket,setSocket] = useState(null)
    const [onlineUsers,setOnlineUsers] = useState([])
    const [notification,setNotification] = useState([])
    const [allUsers,setAllUsers] = useState([])
    
    
    useEffect(()=>{
        const getUsers = async()=>{
            const res = await getRequest(`${baseURL}/user`)    
            if(res.error){
                return console.log(res);               
            }
            const pChat = res.filter((u)=>{
                let isChatCreated = false
                if(user?._id === u._id){
                    return false
                }
                if(userChat){
                    userChat?.some((chat)=>{
                        return chat.members[0] === u._id || chat.members[1] === u._id
                    })
                }
                return !isChatCreated
            })
            setPotentialChat(pChat)
            setAllUsers(res)
        }
        getUsers()
    },[userChat])

    useEffect(()=>{
        const getUserChat = async()=>{

            if(user?._id){

                setUserChatLoading(true)
                setUserChatError(null)

                const res = await getRequest(`${baseURL}/chat/${user?._id}`)
                setUserChatLoading(false)

                if(res?.error){
                    setUserChatError(res)
                }
                setUserChat(res)
            }
        }
        getUserChat() 
    },[user])

    const createChat = useCallback(async(firstId,secondId)=>{
        const res = await postRequest(`${baseURL}/chat/`,JSON.stringify({firstId,secondId}))
        if(res.error){
            return res
        }
        setUserChat((prev)=>[...prev,res])
    },[])

    const updateCurrentChat = useCallback((chat)=>{
        setCurrentChat(chat)
    },[])

    useEffect(()=>{
        const getMessage = async()=>{
                setMessageLoading(true)
                setMessageError(null)

                const res = await getRequest(`${baseURL}/message/${currentChat?._id}`)
                setMessageLoading(false)

                if(res?.error){
                    setMessageError(res)
                }
                setMessage(res)
        }
        getMessage() 
    },[currentChat])

    const sendMessage = useCallback(async(textMessage, sender, currentChatId, setTextMessage)=>{
        if(!textMessage){
            return console.log('type something');        
        }
        const res = await postRequest(`${baseURL}/message/`,JSON.stringify({
            text : textMessage,
            senderId : sender._id, 
            chatId : currentChatId}))
        if(res.error){
            return setSendTextError(res)
        }
        setNewMessage(res)
        setMessage((prev)=>[...prev,res])
        setTextMessage('')
    },[])

    // inalize socket
    useEffect(()=>{
        const newSocket = io("http://localhost:3000")
        setSocket(newSocket)
        return () => {
            newSocket.disconnect()
        }
    },[user])

    // add online users
    useEffect(()=>{
        if(socket === null) return;
        socket.emit("addNewUser", user?._id)
        socket.on("getOnlineUsers", (res)=>{
            setOnlineUsers(res)
        })
        return ()=>{
            socket.off("getOnlineUsers")
        }
    },[socket])


    // send message
    useEffect(()=>{
        if(socket === null) return;

        const reciptId = currentChat?.members?.find((id) => id !== user?._id)

        socket.emit("sendMessage",{...newMessage,reciptId})      
    },[newMessage])

    // receive message and notification
    useEffect(()=>{
        if(socket === null) return;
        socket.on("getMessage", res => {
            if(currentChat?._id !== res.chatId) return
            setMessage((prev)=>[...prev,res])
        })  

        socket.on("getNotification", res => {
            const isChatOpen = currentChat?.members.some(id => id === res.senderId)
            if(isChatOpen){
                setNotification(prev => [{...res, isRead:true},...prev])
            }else{
                setNotification(prev => [res, ...prev])
            }
        })
        return () => {
            socket.off("getMessage")
            socket.off("getNotification")
        }
    },[socket,currentChat])

    const markAsRead = useCallback((notification)=>{
        const mNotification = notification.map(n=>{
            return {...n,isRead:true}
        })
        setNotification(mNotification)
    },[])

    const markNotiAsRead = useCallback((n,userChat,user,notification)=>{
        // find chat to open
        const desiredChat = userChat.find(chat=>{
            const chatMembers =  [user._id,n.senderId]
            const isDesiredChat = chat?.members.every((member)=>{
                return chatMembers.includes(member)
            })
            return isDesiredChat
        })
        //  mark noti as read
        const mNoti = notification.map(el=>{
            if(n.senderId === el.senderId){
                return {...n,isRead:true}
            }else{
                return el
            }
            
        })
        updateCurrentChat(desiredChat)
        setNotification(mNoti)
    },[])

    const markThisUserNotiAsRead = useCallback((thisUserNoti,notification)=>{
        const mNotification = notification.map(el =>{
            let notification
            thisUserNoti.forEach(n =>{
                if(n.senderId === el.senderId){
                    notification = {...n,isRead:true}
                }else{
                    notification = el
                }
            })
            return notification
        })
        setNotification(mNotification)
    })

    return (
        <ChatContext.Provider
        value={{
            userChat,
            userChatError,
            userChatLoading,
            potentialChat,
            createChat,
            currentChat,
            updateCurrentChat,
            message,
            messageLoading,
            messageError,
            sendMessage,
            onlineUsers,
            notification,
            allUsers,
            markAsRead,
            markNotiAsRead,
            markThisUserNotiAsRead
        }}
        >
            {children}
        </ChatContext.Provider>
    )
}