import { Button, Form, Grid, Message, Segment } from "semantic-ui-react";
import { Navigate, NavLink } from "react-router-dom";
import { api } from "../api/api";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const Auth = useAuth();
  const isLoggedIn = Auth.userIsAuthenticated()

  const [companyName, setCompanyName] = useState('')
  const [password, setPassword] = useState('')
  const [industry, setIndustry] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e, { name, value }) => {
    if (name === 'companyName') {
      setCompanyName(value)
    } else if (name === 'password') {
      setPassword(value)
    } else if (name === 'industry') {
      setIndustry(value)
    } else if (name === 'email') {
      setEmail(value)
    } else if (name === 'address') {
      setAddress(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!(companyName && password && industry && email && address)) {
      setIsError(true)
      setErrorMessage('Please, inform all fields!')
      return
    }

    const client = { companyName, address, industry, user: {email, password, roles: ["ADMIN"]} }

    try {
      await api.createClient(client)
      setCompanyName('')
      setPassword('')
      setIndustry('')
      setEmail('')
      setIsError(false)
      setErrorMessage('')
      return <Navigate to='/login' />
    } catch (error) {
      setIsError(true)
      setErrorMessage(errorMessage)
    }
  }

  if (isLoggedIn) {
    return <Navigate to='/' />
  }

  return (
          <Grid textAlign='center'>
            <Grid.Column style={{ maxWidth: 450 }}>
              <Form size='large' onSubmit={handleSubmit}>
                <Segment>
                  <Form.Input
                          fluid
                          autoFocus
                          name='email'
                          icon='user'
                          iconPosition='left'
                          placeholder='Email'
                          value={email}
                          onChange={handleInputChange}
                  />
                  <Form.Input
                          fluid
                          name='password'
                          icon='lock'
                          iconPosition='left'
                          placeholder='Password'
                          type='password'
                          value={password}
                          onChange={handleInputChange}
                  />
                  <Form.Input
                          fluid
                          name='companyName'
                          icon='address card'
                          iconPosition='left'
                          placeholder='Company name'
                          value={companyName}
                          onChange={handleInputChange}
                  />
                  <Form.Input
                          fluid
                          name='industry'
                          icon='at'
                          iconPosition='left'
                          placeholder='Industry'
                          value={industry}
                          onChange={handleInputChange}
                  />
                  <Form.Input
                          fluid
                          name='address'
                          icon='at'
                          iconPosition='left'
                          placeholder='Address'
                          value={address}
                          onChange={handleInputChange}
                  />
                  <Button color='blue' fluid size='large'>Signup</Button>
                </Segment>
              </Form>
              <Message>{`Already have an account? `}
                <NavLink to="/login" color='teal'>Login</NavLink>
              </Message>
              {isError && <Message negative>{errorMessage}</Message>}
            </Grid.Column>
          </Grid>
  )
}

export default Signup