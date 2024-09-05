import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import App from '../App'
import Chat from '../page/Chat'
import Register from '../page/Register'
import Login from '../page/Login'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Route() {
    const {user} = useContext(AuthContext)
    const router = createBrowserRouter([
        {
          path: "/",
          element : <App/>,
          children: [
            {
              path : '*',
              element : <Navigate to={'/'}/>
            },
            {
                path : '/',
                element : user && <Chat/> 
            },
            {
                path : '/register',
                element : !user ? <Register/> : <Navigate to={'/'}/>
            },
            {
                path : '/login',
                element : !user ? <Login/> : <Navigate to={'/'}/>
            },
          ]
        }
    ])
  return (
    <RouterProvider router={router} />
  )
}
