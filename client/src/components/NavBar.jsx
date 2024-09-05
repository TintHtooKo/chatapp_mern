import { useContext } from "react"
import { Container, Navbar, Nav, Stack } from "react-bootstrap"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import Notification from "./chat/Notification"

export default function NavBar() {
    const {user,logoutUser} = useContext(AuthContext)
  return (
    <>
    <Navbar bg="dark" style={{height:"3rem"}} >
        <Container>
            <h2>
                <Link to="/" className=" link-light text-decoration-none">CHAT APP</Link>
            </h2>
            {user && <span className=" text-warning">Loggin in as {user?.name}</span>}
            <Nav>
                <Stack direction="horizontal" gap={3}>
                    {
                        user ? (      
                           <>
                            <Notification/>                     
                            <Link to={'/login'} onClick={()=>logoutUser()} className=" link-light text-decoration-none">Logout</Link>
                           </>
                        ) : (
                            <>
                                <Link to="/login" className=" link-light text-decoration-none">Login</Link>
                                <Link to="/register" className=" link-light text-decoration-none">Register</Link>
                            </>
                        )
                    }
                </Stack>
            </Nav>
        </Container>
    </Navbar>
    </>
  )
}
