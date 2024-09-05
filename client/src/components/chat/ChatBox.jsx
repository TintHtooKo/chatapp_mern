import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { ChatContext } from "../../context/ChatContext"
import { useFetchHook } from "../../hook/useFetchHook"
import { Stack } from "react-bootstrap"
import moment from 'moment'
import InputEmoji from 'react-input-emoji'


export default function ChatBox() {
    const {user} = useContext(AuthContext)
    const {currentChat, message, messageLoading, sendMessage} = useContext(ChatContext)
    const {recipeUser} = useFetchHook(currentChat,user)
    const [textMessage,setTextMessage] = useState('')
    const scroll = useRef()

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:"smooth"})
    },[message])
    if(!recipeUser){
        return (
            <p style={{textAlign:"center", width : "100%"}}>
                No conversation seleted yet...
            </p>
        )
    }
    if(messageLoading){
        return (
            <p style={{textAlign:"center", width : "100%"}}>
                Loading...
            </p>
        )
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Check if Enter is pressed without Shift key
            e.preventDefault(); // Prevent newline
            sendMessage(textMessage, user, currentChat._id, setTextMessage); // Send the message
        }
    }
  return (
    <Stack gap={4} className="chat-box">
        <div className="chat-header">
            <strong className=" bg-transparent">{recipeUser?.name}</strong>
        </div>
        <Stack gap={3} className="messages bg-transparent" >
            {
                message && message.map((msg,index)=>(
                    <Stack key={index} className={
                        `${msg?.senderId === user?._id ? "message self align-self-end flex-grow-0" :
                         "message align-self-start flex-grow-0"}`
                         }
                         ref={scroll}
                        >
                        <span className="bg-transparent">{msg.text}</span>
                        <span className="bg-transparent message-footer">{moment(msg.createdAt).calendar()}</span>
                    </Stack>
                ))
            }
        </Stack>
        <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0 bg-transparent" >
            <InputEmoji className="bg-white" value={textMessage} onChange={setTextMessage} fontFamily="nunito" borderColor="rgba(72,112,223,0.2)" />
            <button className="send-btn" onClick={()=>sendMessage(textMessage, user, currentChat._id, setTextMessage)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
            </svg>
            </button>
        </Stack>
    </Stack>
  )
}
