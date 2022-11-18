import axios from 'axios';
import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Alert, Container, Title } from '@mantine/core'

import { BACKEND_ROOT } from '../Root'

function Login () {
  const navigate = useNavigate();
  const [, setUser] = useOutletContext();
  const [error, setError] = useState(null);

  const handleRegister = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const object = {};
    formData.forEach((value, key) => { object[key] = value });

    axios.post(BACKEND_ROOT + 'user/auth/login', object, { timeout: 10000 })
      .then(res => {
        setUser({ ...res.data, email: object.email });
        localStorage.setItem('user', JSON.stringify({ ...res.data, email: object.email }));
        navigate('/listing/my')
      }).catch(err => {
        console.log(err.response.data.error);
        setError(err.response.data.error);
      });
  }

  return (
    <Container>
    <Title>Login</Title>
    <form onSubmit={handleRegister}>
        {error && <Alert
          color='violet'
          title='Error'
        >{error}</Alert>}
        <TextInput id='email' name='email' label='Email' placeholder='conrad@hilton.com' type='email' />
        <PasswordInput id='password' name='password' label='Password' placeholder='Tr0ub4dor!' mb={16} />
        <Button type='submit' >Login</Button>
    </form>
    </Container>
  );
}

export default Login;
