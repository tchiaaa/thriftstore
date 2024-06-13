import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Drawer, CssBaseline, Autocomplete, Fade, Modal, Backdrop } from '@mui/material';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import AdminSidebar from './sidebar';
import { EmployeeContext } from '../employeeContext';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
};

const Inventori = () => {
  const [name, setname] = useState('');
  const [tipeBarang, settipeBarang] = useState('');
  const [typeData, setTypeData] = useState([]);
  const [employeeId, setemployeeId] = useState('');
  const [customWeight, setcustomWeight] = useState('');
  const [customCapitalPrice, setcustomCapitalPrice] = useState('');
  const [customDefaultPrice, setcustomDefaultPrice] = useState('');
  const [size, setSize] = useState('');
  const [files, setFiles] = useState([]);
  const navigate = useNavigate('');
  const [errors, setErrors] = useState({});
  const { employeeData } = useContext(EmployeeContext);
  const { clearEmployeeData } = useContext(EmployeeContext);
  const [openLogout, setOpenLogout] = useState(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);

  const validate = () => {
    let tempErrors = {};
    if (!name || name.length > 255) {
      tempErrors.name = 'Nama barang harus diisi dan maksimal 25 karakter';
    }
    if (!tipeBarang) {
      tempErrors.tipeBarang = 'Tipe barang harus diisi';
    }
    if (!customWeight) {
      tempErrors.birthdate = 'Berat barang harus diisi';
    }
    if (!customCapitalPrice) {
      tempErrors.customCapitalPrice = 'Harga modal barang harus diisi';
    }
    if (!customDefaultPrice) {
      tempErrors.customDefaultPrice = 'Harga jual barang harus diisi';
    }
    if (!size) {
      tempErrors.size = 'Ukuran barang harus diisi';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const onDrop = useCallback((acceptedFiles) => {
    // Handle the files
    const validFiles = acceptedFiles.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file.name));
    console.log(acceptedFiles);
    if (validFiles.length > 0) {
      // const details = acceptedFiles.map(file => ({
      //     path: file.path || ""
      // }));
      // const fileNames = details.map(file => file.path);
      // setFiles(fileNames);
      setFiles(validFiles);
    } else {
      console.error('Invalid file types detected. Please upload only image files.');
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ accept: 'image/*', onDrop  });

  useEffect(() => {
    if (employeeData) {
      console.log(employeeData);
      setemployeeId(employeeData.id);
      // Fetch data from the backend
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:8080/daftarTipe');
          console.log(response.data);
          setTypeData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [employeeData]);

  const optionsTipe = typeData.map(item => ({
    label: item.nama,
    value: item.id,
    capital_price: item.capitalprice,
    default_price: item.defaultprice,
    berat: item.weight,
  }));

  const handleAutocompleteChange = (event, newValue) => {
    console.log(newValue);
    settipeBarang(newValue); // Mengatur nilai item yang dipilih
    if (newValue) {
      // Mengatur nilai TextField berdasarkan item yang dipilih
      setcustomWeight(newValue.berat.toString());
      setcustomCapitalPrice(newValue.capital_price.toString());
      setcustomDefaultPrice(newValue.default_price.toString());
    } else {
      // Reset nilai TextField jika tidak ada yang dipilih
      setcustomWeight('');
      setcustomCapitalPrice('');
      setcustomDefaultPrice('');
    }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (validate()) {
        const typeId = tipeBarang.value;
        console.log(employeeId);
        console.log(typeId);
        console.log(customWeight);
        console.log(customCapitalPrice);
        console.log(customDefaultPrice);
        console.log(files);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('typeId', typeId);
        formData.append('employeeId', employeeId);
        formData.append('customWeight', customWeight);
        formData.append('customCapitalPrice', customCapitalPrice);
        formData.append('customDefaultPrice', customDefaultPrice);
        formData.append('size', size);
    
        Array.from(files).forEach(file => {
          formData.append('files', file);
        });
        console.log([...formData]);

        try {
          const response = await axios.post('http://localhost:8080/tambahInventori', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log(response.data);
        } catch (error) {
          setErrors(error.response);
        }
    } else {
      console.log("Validation failed");
    }
  };
  const handleLogout = () => {
    clearEmployeeData();
    setOpenLogout(false);
    navigate('/login');
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
        <Button style={{float: 'right'}} color="inherit" onClick={handleOpenLogout} startIcon={<AccountCircle />}>
            {employeeData ? (
                <pre>{employeeData.fullname}</pre>
            ) : (
              <p>No employee data found</p>
            )}
        </Button>
        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          open={openLogout}
          onClose={handleCloseLogout}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              TransitionComponent: Fade,
            },
          }}
          >
          <Fade in={openLogout}>
            <Box sx={styleModal}>
              <AccountCircle style={{ fontSize: 100 }} />
              <Typography id="spring-modal-title" variant="h6" component="h2">
                Apakah anda yakin ingin keluar?
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={handleLogout}>
                  Ya
                </Button>
                <Button variant="outlined" onClick={handleCloseLogout} sx={{ ml: 2, backgroundColor: '#FE8A01', color: 'white' }}>
                  Tidak
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
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
              <Autocomplete
                fullWidth
                options={optionsTipe}
                getOptionLabel={(option) => option.label}
                getOptionSelected={(option, value) => option.value === value} 
                renderInput={(params) => <TextField {...params} />}
                value={optionsTipe.find((option) => option.value === tipeBarang)}
                error={!!errors.tipeBarang}
                onChange={handleAutocompleteChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Berat Barang *</Typography>
              <TextField
                fullWidth
                type='number'
                value={customWeight}
                error={!!errors.customWeight}
                onChange={(e) => setcustomWeight(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Harga Modal Barang *</Typography>
              <TextField
                fullWidth
                type='number'
                value={customCapitalPrice}
                error={!!errors.customCapitalPrice}
                onChange={(e) => setcustomCapitalPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Harga Jual Barang *</Typography>
              <TextField
                fullWidth
                type='number'
                value={customDefaultPrice}
                error={!!errors.customDefaultPrice}
                onChange={(e) => setcustomDefaultPrice(e.target.value)}
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
