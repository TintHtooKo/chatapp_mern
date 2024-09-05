import { useContext } from "react"
import { ChatContext } from "../../context/ChatContext"
import { AuthContext } from "../../context/AuthContext"


export default function PotentialChat() {
    const {user} = useContext(AuthContext)
    const {potentialChat,createChat, onlineUsers} = useContext(ChatContext)   

  return (
    <>
        <div className="all-users" >
            {potentialChat && potentialChat?.map((u,index)=>(
                <div className="single-user" key={index} onClick={()=>createChat(user._id,u._id)}>
                    {u.name}
                    <span className={onlineUsers?.some((user)=> user?.userId === u?._id) ? "user-online" : ""}></span>
                </div>
            ))}
        </div>
    </>
  )
}
