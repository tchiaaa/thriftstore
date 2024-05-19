import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Autocomplete, Toolbar, Box, Drawer, CssBaseline } from '@mui/material';
import AdminSidebar from './sidebar';

const DashboardAdmin = () => {
  const drawerWidth = 300;
  const options = ['Option 1', 'Option 2', 'Option 3'];
  const [formData, setFormData] = useState({
    namapembeli: '',
    namabarang: '',
    harga: '',
    berat: '',
    nomorwa: '',
    username: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    // Kirim data ke server atau lakukan sesuatu dengan data
    console.log(formData);
  };

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
          <AdminSidebar />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <form>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography>Nama Pembeli *</Typography>
              <TextField
                fullWidth
                name="namapembeli"
                value={formData.namapembeli}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Nama Barang *</Typography>
              <Autocomplete
                fullWidth
                options={options}
                renderInput={(params) => <TextField {...params} />}
                name="namabarang"
                value={formData.namabarang}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography>Harga *</Typography>
              <TextField
                fullWidth
                placeholder="IDR"
                type='number'
                name="harga"
                value={formData.harga}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography>Berat *</Typography>
              <TextField
                fullWidth
                placeholder="g"
                type='number'
                name="berat"
                value={formData.berat}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Nomor WA *</Typography>
              <TextField
                fullWidth
                type='tel'
                inputMode='tel'
                name="nomorwa"
                value={formData.nomorwa}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Username IG/Tiktok *</Typography>
              <TextField
                fullWidth
                name="username"
                value={formData.username}
                onChange={handleChange}
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

export default DashboardAdmin;
