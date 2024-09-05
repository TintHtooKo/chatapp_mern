import { useEffect, useState } from "react"
import { baseURL, getRequest } from "../utils/service"

export const useFetchHook = (chat , user) =>{
    const [recipeUser,setReciptUser] = useState(null)
    const [error,setError] = useState(null)

    const reciptId = chat?.members?.find((id) => id !== user?._id)

    useEffect(()=>{
        const getUser = async() =>{
            if(!reciptId){
                return null
            }
            const res = await getRequest(`${baseURL}/user/find/${reciptId}`)

            if(res?.error){
                setError(res)
            }
            setReciptUser(res)
        }
        getUser()
    },[reciptId])

    return {recipeUser}
}