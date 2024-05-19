import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/login', { username, password });
      console.log(response.data[0]);
      redirectBasedOnRole(response.data[0]);
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  const redirectBasedOnRole = (getEmployee) => {
    switch (getEmployee.accessRight.id) {
      case 1:
        navigate('/admin/dashboard', { state: { employeeData: getEmployee } });
        break;
      case 2:
        navigate('/supervisor/karyawan/presensi', { state: { employeeData: getEmployee } });
        break;
      case 3:
        navigate('/manager/dashboard', { state: { employeeData: getEmployee } });
        break;
      case 4:
        navigate('/customer/dashboard', { state: { employeeData: getEmployee } });
        break;
      default:
        navigate('/login');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Login</Typography>
        <form sx={{ width: '100%', marginTop: 2 }}onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            margin="normal"
            required
            autoComplete='off'
            fullWidth
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            margin="normal"
            required
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" color="primary">Login</Button>
        </form>
      </div>
  </Container>
  );
}

export default LoginPage;
