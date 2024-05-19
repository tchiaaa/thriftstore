import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Drawer, CssBaseline, Autocomplete } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SupervisorSidebar from '../supervisor/sidebar';

const TambahKaryawan = () => {
  const navigate = useNavigate('');
  const optHarilibur = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
  const optid = [
    { label: 'admin', value: '1' },
    { label: 'supervisor', value: '2' },
  ];
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [firstjoindate, setFirstjoindate] = useState('');
  const [entryhour, setEntryhour] = useState('');
  const [jadwal_libur, setJadwal_libur] = useState('');
  const [id, setid] = useState('');
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    let tempErrors = {};
    if (!username || username.length > 25) {
      tempErrors.username = 'Username harus diisi dan maksimal 25 karakter';
    }
    if (!fullname || fullname.length > 255) {
      tempErrors.fullname = 'Fullname harus diisi dan maksimal 255 karakter';
    }
    if (!phonenumber || phonenumber.length > 20) {
      tempErrors.phonenumber = 'Nomor WA harus diisi dan maksimal 20 karakter';
    }
    if (!email || email.length > 255 || !/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email harus diisi dengan format yang benar dan maksimal 255 karakter';
    }
    if (!id) {
      tempErrors.id = 'id harus diisi';
    }
    if (!birthdate) {
      tempErrors.birthdate = 'Tanggal lahir harus diisi';
    }
    if (!firstjoindate) {
      tempErrors.firstjoindate = 'Tanggal pertama bekerja harus diisi';
    }
    if (!entryhour) {
      tempErrors.entryhour = 'Jam masuk harian harus diisi';
    }
    if (!jadwal_libur || jadwal_libur.length > 10) {
      tempErrors.jadwal_libur = '=Jadwal libur harus diisi dan maksimal 20 karakter';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (validate()) {
        console.log(phonenumber);
        console.log(id);
        console.log(birthdate);
        console.log(entryhour);
        console.log(jadwal_libur);
        const jam_masuk = `${entryhour}:00`;
        try {
          const response = await axios.post('http://localhost:8080/tambahKaryawan', { fullname, accessright: id?.value, birthdate, phonenumber, email, username, firstjoindate, jam_masuk, jadwal_libur });
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
              <Typography>Nama Lengkap *</Typography>
              <TextField
                fullWidth
                value={fullname}
                error={!!errors.fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>id *</Typography>
              <Autocomplete
                fullWidth
                options={optid}
                getOptionLabel={(option) => option.label}
                getOptionSelected={(option, value) => option.value === value} 
                renderInput={(params) => <TextField {...params} />}
                value={optid.find((option) => option.value === id)}
                error={!!errors.id}
                onChange={(e, value) => setid(value ? value.value : '')} 
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Tanggal Lahir *</Typography>
              <TextField
                fullWidth
                type='date'
                value={birthdate}
                error={!!errors.birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
            </Grid>
            {/* <Grid item xs={6}>
              <Typography>Age *</Typography>
              <TextField
                fullWidth
                type='number'
                name="age"
                value={age}
                error={!!errors.age}
                onChange={(e) => setAge(e.target.value)}
              />
            </Grid> */}
            <Grid item xs={12}>
              <Typography>Nomor HP *</Typography>
              <TextField
                fullWidth
                type='tel'
                inputMode='tel'
                value={phonenumber}
                error={!!errors.phonenumber}
                onChange={(e) => setPhonenumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Email *</Typography>
              <TextField
                fullWidth
                type='email'
                value={email}
                error={!!errors.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Username *</Typography>
              <TextField
                fullWidth
                value={username}
                error={!!errors.username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Tanggal Pertama Bekerja *</Typography>
              <TextField
                fullWidth
                type='date'
                value={firstjoindate}
                error={!!errors.firstjoindate}
                onChange={(e) => setFirstjoindate(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography>Jam Masuk Harian *</Typography>
              <TextField
                fullWidth
                type='time'
                value={entryhour}
                error={!!errors.entryhour}
                onChange={(e) => setEntryhour(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography>Jadwal Libur *</Typography>
              <Autocomplete
                fullWidth
                options={optHarilibur}
                value={jadwal_libur}
                renderInput={(params) => <TextField {...params} />}
                error={!!errors.jadwal_libur}
                onChange={(event, value) => setJadwal_libur(value)}
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

export default TambahKaryawan;
