import React, { useContext, useEffect, useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Drawer, CssBaseline, Autocomplete, Alert } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import SupervisorSidebar from './sidebar';
import { EmployeeContext } from '../employeeContext';
import { format } from 'date-fns';

const EditKaryawan = () => {
  const navigate = useNavigate('');
  const optHarilibur = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
  const optid = [
    { label: 'admin', value: '1' },
    { label: 'supervisor', value: '2' },
  ];
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [firstjoindate, setFirstjoindate] = useState('');
  const [entryhour, setEntryhour] = useState('');
  const [jadwal_libur, setJadwal_libur] = useState('');
  const [accessRight, setAccessRight] = useState('');
  const [errors, setErrors] = useState({});
  // const { employeeData } = useContext(EmployeeContext);
  // const { clearEmployeeData } = useContext(EmployeeContext);
  const location = useLocation();
  const updateCrew = location.state.updateCrew;
  const [showError, setShowError] = useState(false);
  const [msgError, setMsgError] = useState();

  const removeSeconds = (timeString) => {
    if (timeString) {
      const timeParts = timeString.split(':');
      return `${timeParts[0]}:${timeParts[1]}`;
    }
    return '';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getEditDataKaryawan?idEmployee=${updateCrew.id}`);
        console.log(response.data);
        setId(response.data.id);
        setFullname(response.data.fullname);
        setAccessRight(response.data.accessRight.id);
        const formattedBirthDate = format(new Date(response.data.birthdate), 'yyyy-MM-dd');
        setBirthdate(formattedBirthDate);
        setPhonenumber(response.data.phonenumber);
        setEmail(response.data.email);
        setUsername(response.data.username);
        const formattedFirstJoinDate = format(new Date(response.data.firstjoindate), 'yyyy-MM-dd');
        setFirstjoindate(formattedFirstJoinDate);
        const formattedEntryhour = removeSeconds(response.data.jam_masuk);
        setEntryhour(formattedEntryhour);
        setJadwal_libur(response.data.jadwal_libur);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [updateCrew.id]);
  

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
    if (!accessRight) {
      tempErrors.id = 'posisi harus diisi';
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
      const jam_masuk = `${entryhour}:00`;

      console.log(id);
      console.log(fullname);
      console.log(accessRight);
      console.log(birthdate);
      console.log(phonenumber);
      console.log(email);
      console.log(username);
      console.log(firstjoindate);
      console.log(jam_masuk);
      console.log(jadwal_libur);
      try {
        const response = await axios.post('http://localhost:8080/editKaryawan', { fullname, accessRight, birthdate, phonenumber, email, username, firstjoindate, jam_masuk, jadwal_libur, id });
        console.log(response.data);
        localStorage.setItem('berhasilUpdateKaryawan', "Berhasil Ubah Data Karyawan");
        redirectBack();
      } catch (error) {
        setErrors(error.response);
        setMsgError("Gagal Ubah Data Karyawan");
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }
    } else {
      console.log("Validation failed");
    }
  };

  const redirectBack = () => {
    navigate('/manager/dataKaryawan');
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
            {showError && (
              <Alert variant="filled" severity="error" style={{ marginTop: 20 }}>
                { msgError }
              </Alert>
            )}
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
              <Typography>Posisi *</Typography>
              <Autocomplete
                fullWidth
                options={optid}
                getOptionLabel={(option) => option.label}
                getOptionSelected={(option, value) => option.value === value} 
                renderInput={(params) => <TextField {...params} />}
                value={optid.find((option) => option.value === accessRight)}
                error={!!errors.accessRight}
                onChange={(e, value) => setAccessRight(value ? value.value : '')} 
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

export default EditKaryawan;
