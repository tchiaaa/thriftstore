import React, { useCallback, useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Drawer, CssBaseline, Autocomplete } from '@mui/material';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import AdminSidebar from './sidebar';

const Inventori = () => {
  const [name, setname] = useState('');
  const [typeid, setTypeid] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');

  const [errors, setErrors] = useState({});
  
  const validate = () => {
    let tempErrors = {};
    if (!name || name.length > 25) {
      tempErrors.name = 'Nama barang harus diisi dan maksimal 25 karakter';
    }
    if (!name || name.length > 255) {
      tempErrors.name = 'name harus diisi dan maksimal 255 karakter';
    }
    if (!typeid) {
      tempErrors.typeid = 'typeid harus diisi';
    }
    if (!weight) {
      tempErrors.birthdate = 'Berat barang harus diisi';
    }
    if (!price) {
      tempErrors.price = 'Tanggal pertama bekerja harus diisi';
    }
    if (!size) {
      tempErrors.size = 'Tanggal pertama bekerja harus diisi';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const onDrop = useCallback((acceptedFiles) => {
    // Handle the files
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (validate()) {
        try {
          const response = await axios.post('http://localhost:8080/inventori', {  });
          console.log(response.data);
        } catch (error) {
          setErrors(error.response);
        }
    } else {
      console.log("Validation failed");
    }
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
          <AdminSidebar />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <form>
          <Grid container spacing={3} marginTop={5}>
            <Grid item xs={12}>
              <Typography>Nama Barang *</Typography>
              <TextField
                fullWidth
                value={name}
                error={!!errors.name}
                onChange={(e) => setname(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Jenis Barang *</Typography>
              {/* <Autocomplete
                fullWidth
                options={optid}
                getOptionLabel={(option) => option.label}
                getOptionSelected={(option, value) => option.value === value} 
                renderInput={(params) => <TextField {...params} />}
                value={optid.find((option) => option.value === id)}
                error={!!errors.id}
                onChange={(e, value) => setid(value ? value.value : '')} 
              /> */}
            </Grid>
            <Grid item xs={12}>
              <Typography>Berat Barang *</Typography>
              <TextField
                fullWidth
                type='number'
                value={weight}
                error={!!errors.weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Harga Modal Barang *</Typography>
              <TextField
                fullWidth
                type='number'
                value={price}
                error={!!errors.price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Harga Jual Barang *</Typography>
              <TextField
                fullWidth
                type='number'
                value={price}
                error={!!errors.price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Ukuran Barang *</Typography>
              <TextField
                fullWidth
                type='number'
                value={size}
                error={!!errors.size}
                onChange={(e) => setSize(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed #aaa',
                  borderRadius: '4px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDragActive ? '#f0f0f0' : '#fafafa',
                  transition: 'background-color 0.2s',
                }}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <Typography>Drop the files here...</Typography>
                ) : (
                  <Typography>Drag 'n' drop some files here, or click to select files</Typography>
                )}
              </Box>
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

export default Inventori;
