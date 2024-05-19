import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Drawer, CssBaseline } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import SupervisorSidebar from './sidebar';

const EditKaryawan = () => {
  const navigate = useNavigate('');
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [nomorwa, setNomorwa] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const updateCrew = location.state.updateCrew;

  const validate = () => {
    let tempErrors = {};
    if (!username || username.length > 25) {
      tempErrors.username = 'Username harus diisi dan maksimal 25 karakter';
    }
    if (!fullname || fullname.length > 255) {
      tempErrors.fullname = 'Fullname harus diisi dan maksimal 255 karakter';
    }
    if (!age || isNaN(age) || age <= 0) {
      tempErrors.age = 'Age harus diisi dengan angka yang valid';
    }
    if (!nomorwa || nomorwa.length > 20) {
      tempErrors.nomorwa = 'Nomor WA harus diisi dan maksimal 20 karakter';
    }
    if (!email || email.length > 255 || !/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email harus diisi dengan format yang benar dan maksimal 255 karakter';
    }
    if (!password || fullname.length > 10) {
      tempErrors.password = 'Password harus diisi dan maksimal 10 karakter';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (validate()) {
      try {
        const response = await axios.post('http://localhost:8080/editKaryawan', { username, fullname, age, email, nomorwa, password });
        console.log(response.data);
        redirectBack();
      } catch (error) {
        setErrors(error.response);
      }
    } else {
      console.log("Validation failed");
    }
  };

  const redirectBack = () => {
    navigate('/supervisor/karyawan/dataKaryawan');
  };
  const drawerWidth = 300;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'black', color: 'white' },
          }}
          open
        >
          <SupervisorSidebar />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <form>
          <Grid container spacing={3} marginTop={5}>
            <Grid item xs={12}>
              <Typography>Username *</Typography>
              <TextField
                fullWidth
                name="username"
                value={updateCrew.username !== null ? updateCrew.username : ''}
                error={!!errors.username}
                helperText={errors.username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Fullname *</Typography>
              <TextField
                fullWidth
                name="fullname"
                value={updateCrew.fullname}
                error={!!errors.fullname}
                helperText={errors.fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography>Age *</Typography>
              <TextField
                fullWidth
                type='number'
                name="age"
                value={updateCrew.age}
                error={!!errors.age}
                helperText={errors.age}
                onChange={(e) => setAge(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography>Nomor WA *</Typography>
              <TextField
                fullWidth
                type='tel'
                inputMode='tel'
                name="nomorwa"
                value={updateCrew.nomorwa}
                error={!!errors.nomorwa}
                helperText={errors.nomorwa}
                onChange={(e) => setNomorwa(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Email *</Typography>
              <TextField
                fullWidth
                type='email'
                name="email"
                value={updateCrew.email}
                error={!!errors.email}
                helperText={errors.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <Typography>Jabatan *</Typography>
              <Autocomplete
                fullWidth
                options={options}
                renderInput={(params) => <TextField {...params} />}
                name="accessrightid"
                value={accessrightid}
                error={!!errors.accessrightid}
                helperText={errors.accessrightid}
              />
            </Grid> */}
            <Grid item xs={12}>
              <Typography>Password *</Typography>
              <TextField
                fullWidth
                name="password"
                type='password'
                value={updateCrew.password}
                error={!!errors.password}
                helperText={errors.password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSubmit} fullWidth style={{ backgroundColor: 'black', color: 'white' }}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default EditKaryawan;
