import axios from 'axios';
import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Alert, Container, Title } from '@mantine/core'

import { BACKEND_ROOT } from '../Root'

function Register () {
  const navigate = useNavigate();
  const [, setUser] = useOutletContext();
  const [error, setError] = useState(null);

  const handleRegister = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const object = {};
    formData.forEach((value, key) => { object[key] = value });

    if (object.password && object.password !== object.confirm_password) {
      setError('Passwords do not match');
    } else {
      axios.post(BACKEND_ROOT + 'user/auth/register', object, { timeout: 10000 })
        .then(res => {
          setUser({ ...res.data, email: object.email });
          localStorage.setItem('user', JSON.stringify({ ...res.data, email: object.email }));
          setError(null);
          navigate('/listing/my')
        }).catch(err => {
          console.log(err.response.data.error);
          setError(err.response.data.error);
        });
    }
  }

  return (
    <Container>
    <Title>Register</Title>
    <form onSubmit={handleRegister}>
        {error && <Alert
          color='violet'
          title='Error'
        >{error}</Alert>}
        <TextInput id='name' name='name' label='Name' placeholder='Conrad Hilton' />
        <TextInput id='email' name='email' label='Email' placeholder='conrad@hilton.com' type='email' />
        <PasswordInput id='password' name='password' label='Password' placeholder='Tr0ub4dor!' />
        <PasswordInput id='confirm_password' name='confirm_password' label='Confirm Password' placeholder='Tr0ub4dor!'mb={16} />
    <Button type='submit' >Register</Button>
    </form>
    </Container>
  );
}

export default Register;
