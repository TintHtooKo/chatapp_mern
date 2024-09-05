
import { useContext } from 'react'
import {Alert, Button, Form, Row, Col, Stack} from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';


export default function Register() {
  const {registerInfo,updateRegisterInfo,RegisterUser, registerError, registerLoading} = useContext(AuthContext)
  const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await RegisterUser(e);
        navigate('/');  // Redirect after login
    }
  return (
    <Form onSubmit={handleSubmit}>
      <Row style={{height:"100vh",justifyContent:'center',paddingTop:"20%"}}>
        <Col xs={6}>
          <Stack gap={3}>
            <h2>Register</h2>
            <Form.Control type="text" placeholder="Name" onChange={(e)=>updateRegisterInfo({...registerInfo,name:e.target.value})}/>
            <Form.Control type="email" placeholder="Email" onChange={(e)=>updateRegisterInfo({...registerInfo,email:e.target.value})}/>
            <Form.Control type="password" placeholder="Password" onChange={(e)=>updateRegisterInfo({...registerInfo,password:e.target.value})} />
            <Button variant="primary" type='submit'>
              {registerLoading ? "Loading..." : "Register"}
            </Button>
            {
              registerError?.error &&
              <Alert variant="danger">
                <p className=' bg-transparent text-black'>{registerError?.message}</p>
              </Alert>
            }
          </Stack>
        </Col>
      </Row>
    </Form>
  )
}
