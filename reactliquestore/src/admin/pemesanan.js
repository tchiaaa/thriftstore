import React, { useContext, useEffect, useMemo, useState } from 'react';
import { TextField, Button, Grid, Typography, Autocomplete, Toolbar, Box, Drawer, CssBaseline, Modal, Backdrop, Fade, Select, InputLabel, MenuItem, FormControl, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Container, Alert, TableSortLabel, TablePagination } from '@mui/material';
import AdminSidebar from './sidebar';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { EmployeeContext } from '../employeeContext';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import axios from 'axios';

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
  backgroundColor: '#FE8A01',
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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'pembeli', numeric: false, disablePadding: false, label: 'Username Pembeli' },
  { id: 'phonenumber', numeric: true, disablePadding: false, label: 'Nomor WA' },
  { id: 'kodebarang', numeric: false, disablePadding: false, label: 'Kode Barang' },
  { id: 'harga', numeric: true, disablePadding: false, label: 'Harga' },
  { id: 'berat', numeric: true, disablePadding: false, label: 'Berat' },
  { id: 'waitinglist', numeric: false, disablePadding: false, label: 'Username Waiting List' },
  { id: 'aksi', numeric: false, disablePadding: false, }
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            // align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const Pemesanan = () => {
  const drawerWidth = 300;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate('');
  const [colourData, setColourData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [openLogout, setOpenLogout] = useState(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);
  const [showError, setShowError] = useState(false);
  const [msgError, setMsgError] = useState();
  const [tempPrice, settempPrice] = useState('');

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
  // const [rows, setRows] = useState([
  //   { id: 1, username: '', phonenumber: '', itemcode: [], totalprice: 0, totalweight: 0, waitinglist: '' },
  // ]);
  const [rows, setRows] = useState(
    Array.from({ length: 10 }, (_, index) => ({
      id: index,
      username: '',
      phonenumber: '',
      itemcode: [],
      totalprice: 0,
      totalweight: 0,
      waitinglist: '',
    }))
  );
  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  // const validate = () => {
  //   let tempErrors = {};
  //   if (!username || username.length > 255) {
  //     tempErrors.username = 'Nama barang harus diisi dan maksimal 25 karakter';
  //   }
  //   if (!selectedItem) {
  //     tempErrors.selectedItem = 'Nama barang harus dipilih';
  //   }
  //   if (!price) {
  //     tempErrors.price = 'Berat barang harus diisi';
  //   }
  //   if (!weight) {
  //     tempErrors.weight = 'Harga modal barang harus diisi';
  //   }
  //   if (!nomorwa) {
  //     tempErrors.nomorwa = 'Harga jual barang harus diisi';
  //   }
  //   if (!usernamepembeli) {
  //     tempErrors.usernamepembeli = 'Ukuran barang harus diisi';
  //   }

  //   setErrors(tempErrors);
  //   return Object.keys(tempErrors).length === 0;
  // };

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
    name: item.name,
    id: item.id,
    colourcode: item.colourcode,
  }));

  const handleAutocompleteColourChange = async (event, newValue) => {
    console.log(newValue.id);
    setColourOrder(newValue.id);
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

  const optionsItem = itemData.map(item => ({
    label: item.name,
    value: item.id,
    price: item.customdefaultprice,
    weight: item.customweight,
    itemcode: item.itemcode,
  }));

  const handleAutocompleteItemChange = (event, newValue, rowId) => {
    // Jika newValue null atau undefined, atur arrItem menjadi array kosong
    const arrItem = newValue || [];
    console.log(arrItem);
    console.log(event);
    console.log(rowId);
    // Inisialisasi total price dan total weight
    let tempPrice = 0;
    let tempWeight = 0;
    const itemcodes = arrItem.map(item => item.itemcode);
    console.log(itemcodes);
    // Iterasi melalui arrItem dan jumlahkan price dan weight
    arrItem.forEach(item => {
      tempPrice += item.price || 0;
      tempWeight += item.weight || 0;
    });
    console.log(tempPrice);
    console.log(tempWeight);
    setRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId
          ? {
              ...row,
              itemcode: itemcodes,
              totalprice: tempPrice,
              totalweight: tempWeight,
            }
          : row
      )
    );
  };

  const handleSubmit = async (id) => {
    console.log(id);
    const row = rows.find(row => row.id === id);
    const formData = new FormData();
    formData.append(`id`, row.id+1);
    formData.append(`username`, row.username);
    formData.append(`phonenumber`, row.phonenumber);
    formData.append(`itemidall`, row.itemcode);
    formData.append(`totalweight`, row.totalweight);
    formData.append(`totalprice`, row.totalprice);
    formData.append(`waitinglist`, row.waitinglist);
    formData.append('colourid', colourOrder);

    // Display FormData content for debugging
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ': ' + pair[1]);
    // }
    console.log([...formData]);
    let dataOrderId = '';
    try {
      const response = await axios.post('http://localhost:8080/inputTemporaryOrder', formData);
      console.log(response.data);
      dataOrderId = response.data.orderid;
    } catch (error) {
      setErrors(error.response);
    }
    
    if (row.phonenumber !== '') {
      const formattedPhoneNumber = `+${row.phoneNumber}`; // Format to international format

      // Replace YOUR_ACCESS_TOKEN with your actual WhatsApp Business API access token
      const accessToken = 'EAAMhTEZCSFbQBOwoCo6N6dEIZA5EZCiPNndO6kiGbVS2ko5kCDzkDm978ZABG2WimDoGGmMDVlwlHPZAwe6EsKGnuyqHZAieGCQ31eUJSjkZANXx10fn8KEKasfZBETogWsRH0FkIPBgrIwZAjJtKW8ey4eZCt1UrJaBUtb6UcJrsfyrwqOwxDFDv0mIc3t33oPcfE';

      // Construct the WhatsApp API request URL
      const apiUrl = `https://graph.facebook.com/v13.0/messages?access_token=${accessToken}`;
      const checkoutPageURL = encodeURIComponent(`http://localhost:3000/customer/checkoutPage/${dataOrderId}`); // URL-encode the checkout page URL
      // Construct the WhatsApp message
      const whatsappMessage = `Hi there,\n\nYou can continue your checkout process here:\n ${checkoutPageURL}`;
      // Prepare the request body
      const requestBody = {
        messaging_product: 'whatsapp',
        to: formattedPhoneNumber,
        text: {
          body: `${whatsappMessage}`,
        },
      };
      

      try {
        const response = await axios.post(apiUrl, requestBody);
        console.log(response.data); // Display the response
      } catch (error) {
        console.error('Error sending message:', error.message);
      }
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
                <Button variant="outlined" onClick={handleCloseLogout} sx={{ ml: 2, backgroundColor: '#FE8A01', color: 'white' }}>
                  Tidak
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
        <Toolbar />
        <Container>
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
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option, value) => option.id === value} 
                renderInput={(params) => <TextField {...params} />}
                value={optColour.find((option) => option.id === colourOrder)}
                error={!!errors.colourOrder}
                onChange={handleAutocompleteColourChange}
              />
            </FormControl>
          </Box>
          <Box sx={{ width: '100%', marginTop: 5 }}>
            <TableContainer component={Paper}>
              <Table style={{width: '150%'}}>
                <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                />
                {/* <TableHead>
                  <TableRow>
                  <TableCell style={{ width: '1%' }}>Nomor</TableCell>
                <TableCell style={{ width: '10%' }}>Username Pembeli</TableCell>
                <TableCell style={{ width: '10%' }}>Nomor WA</TableCell>
                <TableCell style={{ width: '25%' }}>Kode Barang</TableCell>
                <TableCell style={{ width: '10%' }}>Harga</TableCell>
                <TableCell style={{ width: '9%' }}>Berat</TableCell>
                <TableCell style={{ width: '25%' }}>Username Waiting List</TableCell>
                  </TableRow>
                </TableHead> */}
                <TableBody>
                  {visibleRows.map((row) => (
                    <TableRow key={row.id}>
                      {/* <TableCell>
                        <TextField
                          fullWidth
                          value={row.id}
                          onChange={(e) => handleInputChange(row.id, 'id', e.target.value)}
                        />
                      </TableCell> */}
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
                      <TableCell width={200}>
                        <Autocomplete
                          fullWidth
                          multiple
                          options={optionsItem}
                          getOptionLabel={(option) => option.itemcode}
                          renderInput={(params) => <TextField {...params} />}
                          filterSelectedOptions
                          onChange={(event, newValue) => handleAutocompleteItemChange(event, newValue, row.id)}
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
                      <TableCell>
                        <Button onClick={() => handleSubmit(row.id)} variant="contained">
                          Submit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
          
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
        </Container>
      </Box>
    </Box>
    );
  };

export default Pemesanan;
