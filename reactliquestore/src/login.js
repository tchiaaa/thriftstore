import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Box, Grid } from '@mui/material';
import { useAuth } from './authContext';
import { Link } from 'react-router-dom';

const containerStyle = {
  backgroundColor: 'black',
  color: 'white',
  borderRadius: 25,
  boxShadow: '10px 10px 5px grey',
};

const textfieldStyle = {
  input: {
    color: 'white',
    border: '1px solid white',
    borderRadius: '10px',
  },
  placeholder: {
    color: 'lightgray',
  }
};

const btnLogin = {
  marginTop: 5,
  justifyContent: 'center',
  borderRadius: '10px',
  backgroundColor: '#FE8A01',
  color: 'black',
  border: '3px solid black'
};

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  const validate = () => {
    let tempErrors = {};
    if (!username){
      tempErrors.username = "Username harus diisi";
    }
    if (!password){
      tempErrors.password = "password harus diisi";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()){
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      try {
        const response = await axios.post('http://localhost:8080/login', formData);
        console.log(response.data[0]);
        login(response.data[0]);
      } catch (error) {
        setError("invalid username or password");
      }
    }
  };

  return (
    <Container component="main" maxWidth="sm" style={containerStyle}>
      <Box sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', padding: 5, borderRadius: 5}}>
        <Typography component="h1" variant="h4">Login</Typography>
        <Box sx={{display: 'flex'}}>
          <Typography>Don't have an account?</Typography>&nbsp;&nbsp;&nbsp;
          <Typography sx={{ color: '#FE8A01' }}>
            <a href="/register" style={{ color: '#FE8A01', textDecoration: 'none' }}>
              Sign up here
            </a>
          </Typography>
        </Box>
        <Grid container spacing={3} marginTop={1}>
          <Grid item xs={12}>
            <TextField
              sx={textfieldStyle}
              className='input'
              placeholder="Username"
              value={username}
              autoComplete='off'
              fullWidth
              helperText={errors.username}
              FormHelperTextProps={{ sx: { color: 'red' } }}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={textfieldStyle}
              placeholder="Password"
              type="password"
              value={password}
              fullWidth
              helperText={errors.password}
              FormHelperTextProps={{ sx: { color: 'red' } }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          {error && <Typography color="error">{error}</Typography>}
          <Grid item xs={12}>
            <Button style={btnLogin} fullWidth onClick={handleSubmit}>Login</Button>
          </Grid>
        </Grid>
        <Typography sx={{ color: '#FE8A01', marginTop: 3, textAlign: 'center' }}>Forgot Password ?</Typography>
      </Box>
  </Container>
  );
}

export default LoginPage;
