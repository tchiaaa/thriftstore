import React, { useContext, useEffect, useState } from 'react';
import { TextField, Button, Grid, Typography, Autocomplete, Toolbar, Box, Drawer, CssBaseline, Modal, Backdrop, Fade, Select, InputLabel, MenuItem, FormControl, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Container, Alert } from '@mui/material';
import AdminSidebar from './sidebar';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { EmployeeContext } from '../employeeContext';
import axios from 'axios';
import styled from 'styled-components';

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

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

const btnTambahColour = {
  justifyContent: 'center',
  width: '15vw',
  borderRadius: '10px',
  backgroundColor: 'orange',
  color: 'black',
  border: '3px solid black'
};

const styleModalTambah = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Pemesanan = () => {
  const drawerWidth = 300;
  const [errors, setErrors] = useState({});
  const navigate = useNavigate('');
  const [username, setusername] = useState('');
  const [colourData, setColourData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [price, setPrice] = useState('');
  const [nomorwa, setNomorwa] = useState('');
  const [weight, setWeight] = useState('');
  const [usernamepembeli, setUsernamepembeli] = useState('');
  const [openLogout, setOpenLogout] = useState(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);
  const [showError, setShowError] = useState(false);
  const [msgError, setMsgError] = useState();

  // bagian add colour
  const [openTambah, setOpenTambah] = useState(false);
  const handleOpenTambah = () => setOpenTambah(true);
  const handleCloseTambah = () => setOpenTambah(false);
  const [namaColour, setNamaColour] = useState('');
  const [showSuccessInsertColour, setShowSuccessInsertColour] = useState(false);
  const [messageInsertColour, setMessageInsertColour] = useState('');
  const [colourOrder, setColourOrder] = useState('');
  
  const { employeeData } = useContext(EmployeeContext);
  const { clearEmployeeData } = useContext(EmployeeContext);
  const [rows, setRows] = useState([
    { id: 1, username: '', phonenumber: '', selecteditems: [], totalprice: '', totalweight: '', waitinglist: '' },
  ]);
  
  const validate = () => {
    let tempErrors = {};
    if (!username || username.length > 255) {
      tempErrors.username = 'Nama barang harus diisi dan maksimal 25 karakter';
    }
    if (!selectedItem) {
      tempErrors.selectedItem = 'Nama barang harus dipilih';
    }
    if (!price) {
      tempErrors.price = 'Berat barang harus diisi';
    }
    if (!weight) {
      tempErrors.weight = 'Harga modal barang harus diisi';
    }
    if (!nomorwa) {
      tempErrors.nomorwa = 'Harga jual barang harus diisi';
    }
    if (!usernamepembeli) {
      tempErrors.usernamepembeli = 'Ukuran barang harus diisi';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const fetchDataColour = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getColour');
      console.log(response.data);
      setColourData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataItem = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getItem');
      console.log(response.data);
      setItemData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (employeeData) {
      console.log(employeeData);
      fetchDataColour();
      fetchDataItem();
    }
  }, [employeeData]);

  const optColour = colourData.map(item => ({
    label: item.name,
    value: item.id,
    colourcode: item.colourcode,
  }));

  const handleAutocompleteColourChange = async (event, newValue) => {
    console.log(newValue);
    setColourOrder(newValue);
    try {
      const response = await axios.get(`http://localhost:8080/pilihWarna/${newValue}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleChangeColour = async (id) => {
  //   try {
  //     const response = await axios.get(`http://localhost:8080/pilihWarna/${id}`);
  //     console.log(response.data);
  //     // setChoosenEmployee(response.data);
  //     // setJamMasuk(response.data[0].jam_masuk);
  //     // setJadwalLibur(response.data[0].jadwal_libur);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  const handleInputChange = (id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleAddRow = () => {
    const newRow = { id: rows.length + 1, username: '', phonenumber: '', selecteditems: [], totalprice: '', totalweight: '', waitinglist: '' };
    setRows([...rows, newRow]);
  };

  const optionsItem = itemData.map(item => ({
    label: item.name,
    value: item.id,
    price: item.customdefaultprice,
    weight: item.customweight,
    itemcode: item.itemcode,
  }));

  const handleAutocompleteItemChange = (event, newValue, rowId) => {
    // Jika newValue null atau undefined, atur selectedItems menjadi array kosong
    const selectedItems = newValue || [];
    console.log(selectedItems);
    // Inisialisasi total price dan total weight
    let totalPrice = 0;
    let totalWeight = 0;
  
    // Iterasi melalui selectedItems dan jumlahkan price dan weight
    selectedItems.forEach(item => {
      totalPrice += item.price || 0;
      totalWeight += item.weight || 0;
    });
    console.log(totalPrice);
    console.log(totalWeight);

    setRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId
          ? {
              ...row,
              selectedItems: selectedItems,
              totalprice: totalPrice.toString(),
              totalweight: totalWeight.toString(),
            }
          : row
      )
    );
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    rows.forEach((row, index) => {
      formData.append(`rows[${index}][id]`, row.id);
      formData.append(`rows[${index}][username]`, row.username);
      formData.append(`rows[${index}][varian]`, row.varian);
      formData.append(`rows[${index}][itemid]`, row.selectedItem);
      formData.append(`rows[${index}][weight]`, parseInt(row.weight, 10));
      formData.append(`rows[${index}][capitalPrice]`, parseFloat(row.capitalPrice));
      formData.append(`rows[${index}][defaultPrice]`, parseFloat(row.defaultPrice));
    });

    // Display FormData content for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const response = await axios.post('http://localhost:8080/tambahOrder', formData);
      console.log(response.data);
    } catch (error) {
      setErrors(error.response);
    }
  };

  const handleAddColour = async (e) => {
    e.preventDefault();
    try {
      const name = namaColour;
      const response = await axios.post('http://localhost:8080/tambahWarna', { name });
      console.log(response.data);
      setOpenTambah(false);
      setShowSuccessInsertColour(true);
      setMessageInsertColour("Berhasil Menambah Warna");
      setTimeout(() => {
        setShowSuccessInsertColour(false);
      }, 5000);
      fetchDataColour();
      setNamaColour('');
    } catch (error) {
      setErrors(error.response);
    }
  };

  const handleLogout = () => {
    clearEmployeeData();
    setOpenLogout(false);
    navigate('/login');
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
                <Button variant="outlined" onClick={handleCloseLogout} sx={{ ml: 2, backgroundColor: 'orange', color: 'white' }}>
                  Tidak
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
        <Toolbar />
        <RootContainer>
          {showSuccessInsertColour && (
            <Alert variant="filled" severity="success" style={{ marginTop: 20 }}>
              { messageInsertColour }
            </Alert>
          )}
          {showError && (
            <Alert variant="filled" severity="danger" style={{ marginTop: 20 }}>
              { msgError }
            </Alert>
          )}
          <Box sx={{ minWidth: 300 }}>
            <FormControl fullWidth>
              {/* <InputLabel id="demo-simple-select-label">Pilih Warna</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Pilih Karyawan"
                // value={idAbsensi}
                onChange={handleChangeColour}
              >
                {rows.map(item => (
                  <MenuItem key={item.id} value={item.id}>{item.username}</MenuItem>
                ))}
              </Select> */}
              <Typography>Pilih Warna *</Typography>
              <Autocomplete
                fullWidth
                options={optColour}
                getOptionLabel={(option) => option.label}
                getOptionSelected={(option, value) => option.value === value} 
                renderInput={(params) => <TextField {...params} />}
                value={optColour.find((option) => option.value === colourOrder)}
                error={!!errors.colourOrder}
                onChange={handleAutocompleteColourChange}
              />
            </FormControl>
          </Box>
        </RootContainer>
        <TableContainer component={Paper} style={{ overflowX: 'auto'}}>
          <Table style={{width: '150%'}}>
            <TableHead>
              <TableRow>
              <TableCell style={{ width: '1%' }}>Nomor</TableCell>
            <TableCell style={{ width: '10%' }}>Username Pembeli</TableCell>
            <TableCell style={{ width: '10%' }}>Nomor WA</TableCell>
            <TableCell style={{ width: '25%' }}>Kode Barang</TableCell>
            <TableCell style={{ width: '10%' }}>Harga</TableCell>
            <TableCell style={{ width: '9%' }}>Berat</TableCell>
            <TableCell style={{ width: '25%' }}>Username Waiting List</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={row.id}
                      onChange={(e) => handleInputChange(row.id, 'id', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={row.username}
                      onChange={(e) => handleInputChange(row.id, 'username', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      type="tel"
                      value={row.phonenumber}
                      onChange={(e) => handleInputChange(row.id, 'phonenumber', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Autocomplete
                      fullWidth
                      multiple
                      options={optionsItem}
                      getOptionLabel={(option) => option.itemcode}
                      renderInput={(params) => <TextField {...params} />}
                      value={optionsItem.filter((option) => (row.selecteditems || []).includes(option.value))}
                      onChange={(event, newValue) => handleAutocompleteItemChange(row.id, newValue.map(item => item.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      type="number"
                      value={row.totalprice}
                      onChange={(e) => handleInputChange(row.id, 'totalprice', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      type="number"
                      value={row.totalweight}
                      onChange={(e) => handleInputChange(row.id, 'totalweight', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={row.waitinglist}
                      onChange={(e) => handleInputChange(row.id, 'waitinglist', e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        <Button onClick={handleAddRow} variant="contained" style={{ margin: '16px 0' }}>
          Add Row
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
        <Button style={btnTambahColour} onClick={handleOpenTambah}>+ Tambah Warna</Button>
          
          {/* ini modal tambah warna */}
          <Modal
            aria-labelledby="spring-modal-title"
            aria-describedby="spring-modal-description"
            open={openTambah}
            onClose={handleCloseTambah}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                TransitionComponent: Fade,
              },
            }}
          >
            <Fade in={openTambah}>
              <Box sx={styleModalTambah}>
                <form>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography>Nama Warna *</Typography>
                      <TextField
                        fullWidth
                        value={namaColour}
                        error={!!errors.namaColour}
                        onChange={(e) => setNamaColour(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="contained" onClick={handleAddColour} fullWidth style={{ backgroundColor: 'black', color: 'white' }}>
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Fade>
          </Modal>
      </TableContainer>
      </Box>
    </Box>
    );
  };

export default Pemesanan;
