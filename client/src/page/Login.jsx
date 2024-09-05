import { useContext } from 'react'
import {Alert, Button, Form, Row, Col, Stack} from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const {loginUser, updateLoginInfo,loginError,loginLoading, loginInfo} = useContext(AuthContext)
  const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await loginUser(e);
        navigate('/');  // Redirect after login
    }
  return (
    <Form onSubmit={handleSubmit}>
      <Row style={{height:"100vh",justifyContent:'center',paddingTop:"20%"}}>
        <Col xs={6}>
          <Stack gap={3}>
            <h2>Login</h2>
            <Form.Control type="email" placeholder="Email" onChange={(e)=>updateLoginInfo({...loginInfo,email:e.target.value})}/>
            <Form.Control type="password" placeholder="Password" onChange={(e)=>updateLoginInfo({...loginInfo,password:e.target.value})}/>
            <Button variant="primary" type='submit'>
              {loginLoading ? "Loading..." : "Login"}
            </Button>
            {
              loginError?.error &&
              <Alert variant="danger"><p className=' bg-transparent text-black'>{loginError?.message}</p></Alert>
              }
          </Stack>
        </Col>
      </Row>
    </Form>
  )
}
