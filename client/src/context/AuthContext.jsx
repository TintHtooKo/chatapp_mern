import { createContext, useCallback, useEffect, useState } from "react";
import { baseURL, postRequest } from "../utils/service";


export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    
    const [user,setUser] = useState(null);
    const [registerError,setRegisterError] = useState(null);
    const [registerLoading,setRegisterLoading] = useState(false)
    const [registerInfo,setRegisterInfo] = useState({
        name : "",
        email : "",
        password : ""
    });   
    const [loginError,setLoginError] = useState(null);
    const [loginLoading,setLoginLoading] = useState(false)
    const [loginInfo,setLoginInfo] = useState({
        email : "",
        password : ""
    });

    useEffect(()=>{
        const user = localStorage.getItem("user")
        setUser(JSON.parse(user))
    },[])

    const updateRegisterInfo = useCallback((info)=>{
        setRegisterInfo(info);  
    },[]);

    const RegisterUser = useCallback(async(e)=>{
        e.preventDefault()
        setRegisterLoading(true)
        setRegisterError(null)

        const response = await postRequest(`${baseURL}/user/register`, JSON.stringify(registerInfo))

        setRegisterLoading(false)

        if(response.error){
            return setRegisterError(response)
        }

        localStorage.setItem("user",JSON.stringify(response))
        setUser(response)
    },[registerInfo])

    const loginUser = useCallback(async(e)=>{
        e.preventDefault()
        setLoginLoading(true)
        setLoginError(null)

        const response = await postRequest(`${baseURL}/user/login`, JSON.stringify(loginInfo))

        setLoginLoading(false)
        if(response.error){
            return setLoginError(response)
        }

        localStorage.setItem("user",JSON.stringify(response))
        setUser(response)
        
    },[loginInfo])

    const updateLoginInfo = useCallback((info)=>{
        setLoginInfo(info);  
    },[]);

    const logoutUser = useCallback(()=>{
        localStorage.removeItem("user")
        setUser(null)
    },[])

    return (
        <AuthContext.Provider value={{
            user,
            registerInfo,
            updateRegisterInfo,
            RegisterUser,
            registerError,
            registerLoading ,
            loginInfo,
            loginUser,
            updateLoginInfo,
            loginError,
            loginLoading,
            logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
}

