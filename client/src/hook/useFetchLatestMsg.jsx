import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatContext'
import { baseURL, getRequest } from '../utils/service'

export const useFetchLatestMsg = (chat) => {
    const {newMessage, notification} = useContext(ChatContext)
    const [latestMsg,setLatestMsg] = useState(null)

    useEffect(()=>{
        const getMessage = async() =>{
            const res = await getRequest(`${baseURL}/message/${chat?._id}`)
            if(res?.error){
                return console.log(error)
            }
            const lastMessage = res[res?.length - 1]
            setLatestMsg(lastMessage)
        }
        getMessage()
    },[newMessage,notification])
  return {latestMsg}
}
