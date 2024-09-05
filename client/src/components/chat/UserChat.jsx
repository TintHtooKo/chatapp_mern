import { Stack } from "react-bootstrap"
import { useFetchHook } from "../../hook/useFetchHook"
import Avater from '../../assets/avatar.svg'
import { useContext } from "react"
import { ChatContext } from "../../context/ChatContext"
import { unreadNotificationFunc } from "../../utils/unreadNotification"
import { useFetchLatestMsg } from "../../hook/useFetchLatestMsg"
import moment from "moment"


export default function UserChat({chat,user}) {
    const {recipeUser} = useFetchHook(chat,user)
    const {onlineUsers,notification,markThisUserNotiAsRead} = useContext(ChatContext)
    const {latestMsg} = useFetchLatestMsg(chat)
    const unreadNoti = unreadNotificationFunc(notification)
    const thisUserNoti = unreadNoti?.filter(n=>n.senderId === recipeUser?._id)
    const isOnline =  onlineUsers?.some((user)=> user?.userId === recipeUser?._id)
    const truncateText = (text) =>{
        let shortText = text.substring(0,20)
        if(text.length > 20){
            shortText += '...'
        }
        return shortText
    }
    
  return (
    <Stack direction="horizontal" role="button" gap={3} className="user-card align-items-center p-2 justify-content-between"
    onClick={()=>{
        if(thisUserNoti?.length !== 0){
            markThisUserNotiAsRead(thisUserNoti,notification)
        }
    }}
    >
        <div className="d-flex">
            <div className="me-2">
                <img src={Avater} alt="" height="40px"/>
            </div>
            <div className="text-content">
                <div className="name">{recipeUser?.name}</div>
                <div className="text">{latestMsg?.text && <span>{truncateText(latestMsg?.text)}</span> }</div>
            </div>
        </div>
        <div className="d-flex flex-column align-items-end">
            <div className="data">
                {moment(latestMsg?.createdAt).calendar()}
            </div>
            <div className={thisUserNoti?.length > 0 ? "this-user-notifications" : ""}>
                {thisUserNoti?.length > 0 ? thisUserNoti?.length : ''}
            </div>
            <span className={isOnline ? "user-online" : ""}></span>
        </div>
    </Stack>
  )
}
