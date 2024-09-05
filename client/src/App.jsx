import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import { ChatContextProvider } from "./context/ChatContext";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

export default function App() {
  const {user} = useContext(AuthContext)
  return (
    <ChatContextProvider user={user}>
    <NavBar classname=" bg-dark"/>
    <div className="body p-3">
    <Container>     
      <Outlet/>
    </Container>
    </div>

    </ChatContextProvider>
  )
}
