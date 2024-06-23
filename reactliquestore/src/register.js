import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Alert, Box, Grid } from '@mui/material';

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

const btnRegister = {
  marginTop: 5,
  justifyContent: 'center',
  borderRadius: '10px',
  backgroundColor: '#FE8A01',
  color: 'black',
  border: '3px solid black'
};

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [usernameIG, setUsernameIG] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [showSuccessInsert, setShowSuccessInsert] = useState(false);
  const [message, setMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};

    if (!name){
      tempErrors.name = 'nama harus diisi';
    }
    else if (name.length > 255) {
      tempErrors.name = 'nama maksimal berjumlah 255 karakter';
    }
    else if (typeof name !== 'string') {
      tempErrors.name = 'nama harus berisikan huruf';
    }
    if (!username){
      tempErrors.username = 'username harus diisi';
    }
    else if (username.length > 50) {
      tempErrors.username = 'username maksimal berjumlah 50 karakter';
    }
    if (!password){
      tempErrors.password = 'password harus diisi';
    }
    else if (password.length > 255) {
      tempErrors.password = 'password barang maksimal berjumlah 255 karakter';
    }
    if (!konfirmasiPassword){
      tempErrors.konfirmasiPassword = 'konfirmasiPassword harus diisi';
    }
    else if (konfirmasiPassword.length > 255) {
      tempErrors.konfirmasiPassword = 'konfirmasi password barang maksimal berjumlah 255 karakter';
    }
    if (!email){
      tempErrors.email = 'email harus diisi';
    }
    else if (email.length > 255) {
      tempErrors.email = 'email barang maksimal berjumlah 255 karakter';
    }
    if (!usernameIG){
      tempErrors.usernameIG = 'usernameIG harus diisi';
    }
    else if (usernameIG.length > 50) {
      tempErrors.usernameIG = 'usernameIG barang maksimal berjumlah 50 karakter';
    }
    if (!phonenumber){
      tempErrors.phonenumber = 'phonenumber harus diisi';
    }
    else if (phonenumber.length > 15) {
      tempErrors.phonenumber = 'phonenumber barang maksimal berjumlah 15 karakter';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()){
      if (password !== konfirmasiPassword) {
        setMessage("password harus sama dengan konfirmasi password");
      }
      else {
        try {
          const formData = new FormData();
          formData.append('username', username);
          formData.append('password', password);
          formData.append('name', name);
          formData.append('email', email);
          formData.append('usernameIG', usernameIG);
          formData.append('phonenumber', phonenumber);
          formData.append('birthdate', birthdate);
          console.log([...formData]);
          const response = await axios.post('http://localhost:8080/register', formData);
          console.log(response.data);
          setShowSuccessInsert(true);
          setMessage(response.data.message);
          if (response.data.message === 'berhasil register') {
            setUsername('');
            setPassword('');
            setName('');
            setEmail('');
            setBirthdate('');
            setPhonenumber('');
            setUsernameIG('');
          }
          setTimeout(() => {
            setShowSuccessInsert(false);
          }, 5000);
        } catch (error) {
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 5000);
        }
      }
    }
  };

  return (
    <Container component="main" maxWidth="sm" style={containerStyle}>
      {/* {showSuccessInsert && (
        <Alert variant="filled" severity="success" style={{ marginTop: 20 }}>
          { msgInsert }
        </Alert>
      )}
      {showError && (
        <Alert variant="filled" severity="danger" style={{ marginTop: 20 }}>
          { msgError }
        </Alert>
      )} */}
      <Box sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', padding: 5, borderRadius: 5}}>
        <Typography component="h1" variant="h4">Register</Typography>
        <Box sx={{display: 'flex'}}>
          <Typography>Already have an account?</Typography>&nbsp;&nbsp;&nbsp;
          <Typography sx={{ color: '#FE8A01' }}>
            <a href="/login" style={{ color: '#FE8A01', textDecoration: 'none' }}>
              Sign in here
            </a>
          </Typography>
        </Box>
        <Grid container spacing={3} marginTop={1}>
          <Grid item xs={12}>
            <TextField
              sx={textfieldStyle}
              placeholder="Username"
              value={username}
              helperText={errors.username}
              FormHelperTextProps={{ sx: { color: 'red' } }}
              autoComplete='off'
              fullWidth
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={textfieldStyle}
              placeholder="Name"
              value={name}
              helperText={errors.name}
              FormHelperTextProps={{ sx: { color: 'red' } }}
              autoComplete='off'
              fullWidth
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={textfieldStyle}
              type='email'
              placeholder="Email"
              value={email}
              helperText={errors.email}
              FormHelperTextProps={{ sx: { color: 'red' } }}
              autoComplete='off'
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={textfieldStyle}
              placeholder="Phonenumber"
              value={phonenumber}
              helperText={errors.phonenumber}
              FormHelperTextProps={{ sx: { color: 'red' } }}
              autoComplete='off'
              fullWidth
              onChange={(e) => setPhonenumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={textfieldStyle}
              type='date'
              placeholder="Birthdate"
              value={birthdate}
              autoComplete='off'
              fullWidth
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={textfieldStyle}
              placeholder="UsernameIG"
              value={usernameIG}
              helperText={errors.usernameIG}
              FormHelperTextProps={{ sx: { color: 'red' } }}
              autoComplete='off'
              fullWidth
              onChange={(e) => setUsernameIG(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={textfieldStyle}
              placeholder="Password"
              type="password"
              value={password}
              helperText={errors.password}
              FormHelperTextProps={{ sx: { color: 'red' } }}
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={textfieldStyle}
              placeholder="Konfirmasi Password"
              type="password"
              value={konfirmasiPassword}
              helperText={errors.konfirmasiPassword}
              FormHelperTextProps={{ sx: { color: 'red' } }}
              fullWidth
              onChange={(e) => setKonfirmasiPassword(e.target.value)}
            />
          </Grid>
          {message && <Typography color="error">{message}</Typography>}
          <Grid item xs={12}>
            <Button style={btnRegister} fullWidth onClick={handleSubmit}>Register</Button>
          </Grid>
        </Grid>
      </Box>
  </Container>
  );
}

export default RegisterPage;