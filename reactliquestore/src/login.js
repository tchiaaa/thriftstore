import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { API_BASE_URL } from './constants';
import { Alert, Box, Grid } from '@mui/material';
import { useAuth } from './authContext';
import { useLocation } from 'react-router-dom';

const containerStyle = {
  backgroundColor: 'black',
  color: 'white',
  borderRadius: 25,
  boxShadow: '24px 24px 28px rgba(0, 0, 0, 0.22',
};

const textfieldStyle = {
  input: {
    color: 'white',
    border: '1px solid white',
    borderRadius: '10px',
    '&:hover': {
      color: 'white',
      border: '1px solid white',
      borderRadius: '10px',
    },
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [msgSuccess, setmsgSuccess] = useState('');
  const [showError, setShowError] = useState(false);
  const [msgError, setMsgError] = useState();
  const [param, setParam] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderidFromQuery = params.get('orderid');

  useEffect(() => {
    if (orderidFromQuery != null){
      setParam(orderidFromQuery);
    }
    else{
      setParam('');
    }
  }, [orderidFromQuery]);

  useEffect(() => {
    const storedMessage = localStorage.getItem('berhasilRegister');
    if (storedMessage) {
      setShowSuccess(true);
      setmsgSuccess(storedMessage);
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      localStorage.removeItem('berhasilRegister')
    }
  }, []);

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
      formData.append("orderid", orderidFromQuery);
      try {
        const response = await axios.post(`http://localhost:8080/login`, formData);
        console.log(response.data);
        if (response.data.customer) {
          console.log("ini customer");
          if (orderidFromQuery != null && response.data.cekPhoneOrder) {
            console.log("ini customer punya orderid");
            localStorage.setItem('orderid', orderidFromQuery);
          }
          console.log("ini customer");
          login(response.data.customer);
          console.log("ini customer");
        }
        else{
          console.log("ini employee");
          login(response.data);
        }
      } catch (error) {
        console.error("error fetching data: ", error);
        setShowError(true);
        setMsgError("Invalid Username or Password");
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }
    }
  };

  return (
    <>
      <Container component="main" maxWidth="sm" sx={{marginTop: 10}}>
        {showSuccess && (
          <Alert variant="filled" severity="success" sx={{marginBottom: 5}}>
            { msgSuccess }
          </Alert>
        )}
        {showError && (
          <Alert variant="filled" severity="error" sx={{marginBottom: 5}}>
            { msgError }
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: 5, borderRadius: 5}} style={containerStyle}>
          <Typography component="h1" variant="h4">Login</Typography>
          <Box sx={{display: 'flex'}}>
            <Typography>Don't have an account?</Typography>&nbsp;&nbsp;&nbsp;
            <Typography sx={{ color: '#FE8A01' }}>
              {param ? (
                <a href={`/register?orderid=${orderidFromQuery}`} style={{ color: '#FE8A01', textDecoration: 'none' }}>
                  Sign up here
                </a>
              ) : (
                <a href="/register" style={{ color: '#FE8A01', textDecoration: 'none' }}>
                  Sign up here
                </a>
              )}
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
            <Grid item xs={12}>
              <Button style={btnLogin} fullWidth onClick={handleSubmit}>Login</Button>
            </Grid>
          </Grid>
          <Typography sx={{ color: '#FE8A01', marginTop: 3, textAlign: 'left', cursor: 'pointer' }}><a href='/forgot' style={{ color: '#FE8A01', textDecoration: 'none' }}>Forgot Password?</a></Typography>
        </Box>
    </Container>
  </>
  );
}

export default LoginPage;
