import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { TextField, Button, Grid, Typography, Autocomplete, Toolbar, Box, Drawer, CssBaseline, Modal, Backdrop, Fade, Select, InputLabel, MenuItem, FormControl, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Container, Alert, TableSortLabel, TablePagination, Chip, InputAdornment } from '@mui/material';
import AdminSidebar from './sidebar';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAuth } from '../authContext';
import { NumericFormat } from 'react-number-format';

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
  { id: 'id', numeric: false, disablePadding: false, label: 'No' },
  { id: 'pembeli', numeric: false, disablePadding: false, label: 'Username Pembeli' },
  { id: 'phonenumber', numeric: true, disablePadding: false, label: 'Nomor WA' },
  { id: 'kodebarang', numeric: false, disablePadding: false, label: 'Kode Barang' },
  { id: 'harga', numeric: true, disablePadding: false, label: 'Harga' },
  { id: 'berat', numeric: true, disablePadding: false, label: 'Berat' },
  { id: 'waitinglist', numeric: false, disablePadding: false, label: 'Username Waiting List' },
  { id: 'link', numeric: false, disablePadding: false, label: 'Checkout Link' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'aksi', numeric: false, disablePadding: false, label: '' },
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
            sx={{ backgroundColor: props.tableColour, color: props.tableColour === '#000000' ? '#FFFFFF' : 'inherit' }}
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [errors, setErrors] = useState({});
  const [colourData, setColourData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [openLogout, setOpenLogout] = useState(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState('');
  const [showError, setShowError] = useState(false);
  const [msgError, setMsgError] = useState();
  const [openClearAll, setOpenClearAll] = useState(false);
  const handleOpenClearAll = () => setOpenClearAll(true);
  const handleCloseClearAll = () => setOpenClearAll(false);
  const [openSubmitAll, setOpenSubmitAll] = useState(false);
  const handleOpenSubmitAll = () => setOpenSubmitAll(true);
  const handleCloseSubmitAll = () => setOpenSubmitAll(false);
  const { auth, logout } = useAuth();
  const getusername = auth.user ? auth.user.username : '';
  // bagian add colour
  const [openTambah, setOpenTambah] = useState(false);
  const handleOpenTambah = () => setOpenTambah(true);
  const handleCloseTambah = () => setOpenTambah(false);
  const [namaColour, setNamaColour] = useState('');
  const [hexColour, setHexColour] = useState('#FFFFFF');
  const [colourOrder, setColourOrder] = useState('');
  const [tableColour, setTableColour] = useState('#FFFFFF');
  const [orderData, setOrderData] = useState([]);
  // const [rows, setRows] = useState([
  //   { id: 1, username: '', phonenumber: '', itemcode: [], totalprice: 0, totalweight: 0, waitinglist: '' },
  // ]);
  const [rows, setRows] = useState(
    Array.from({ length: 100 }, (_, index) => ({
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

  const updateRows = (data) => {
    // Fungsi untuk membuat baris kosong
    const createEmptyRow = (index) => ({
      id: index,
      kodepemesanan: '',
      username: '',
      phonenumber: '',
      itemcode: [],
      totalprice: 0,
      totalweight: 0,
      waitinglist: '',
    });

    // Inisialisasi array untuk menampung baris yang akan diperbarui
    let updatedRows = Array.from({ length: 100 }, (_, index) => {
      if (data && index < data.length && data[index]) {
        // Jika ada data dan indeks masih dalam rentang data yang ada
        const rowData = data[index];
        return {
          id: rowData.id,
          kodepemesanan: rowData.kodepemesanan || '',
          username: rowData.username || '',
          phonenumber: rowData.phonenumber || '',
          itemcode: rowData.itemidall || [],
          totalprice: rowData.totalprice || 0,
          totalweight: rowData.totalweight || 0,
          waitinglist: rowData.waitinglist || '',
          link: rowData.link || '',
          status: rowData.status || '',
        };
      } else {
        // Jika tidak ada data atau indeks di luar rentang data yang ada, buat baris kosong
        return createEmptyRow(index);
      }
    });
    setRows(updatedRows);
  };
  
  // useEffect untuk memantau perubahan orderData
  useEffect(() => {
    console.log(orderData);
    updateRows(orderData);
  }, [orderData]);

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
      const response = await axios.get('http://localhost:8080/admin/getColour');
      console.log(response.data);
      setColourData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataItem = async () => {
    try {
      const response = await axios.get('http://localhost:8080/admin/getItem');
      console.log(response.data);
      setItemData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataColour();
    fetchDataItem();
  }, []);

  const optColour = colourData.map(item => ({
    name: item.name,
    id: item.id,
    colourcode: item.colourcode,
    colourhex: item.colourhex,
  }));

  const handleAutocompleteColourChange = async (event, newValue) => {
    console.log(newValue);
    if (newValue == null){
      setColourOrder('');
      setTableColour('#FFFFFF');
    }
    else {
      setColourOrder(newValue.id);
      setTableColour(newValue.colourhex);
      setOrderData([]);
      try {
        const response = await axios.get(`http://localhost:8080/admin/getSelectedColour/${newValue.id}`);
        console.log(response.data);
        getStatus(response.data);
        setOrderData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setOrderData([]);
      }
    }
  };

  const getStatus = async (data) => {
    try {
        console.log(data);
        const response = await axios.post('http://localhost:8080/admin/checkUpdateTransaction', data);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching transaction status", error);
    }
  };

  const handleInputChange = useCallback((id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  }, []);

  const optionsItem = itemData.map(item => ({
    label: item.name,
    value: item.id,
    price: item.customdefaultprice,
    weight: item.customweight,
    itemcode: item.itemcode,
  }));

  const handleAutocompleteItemChange = (event, newValue, rowId) => {
    // Jika newValue null atau undefined, atur arrItem menjadi array kosong
    const itemcodes = newValue.map(item => item.itemcode);
    setRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId
          ? {
              ...row,
              itemcode: itemcodes,
            }
          : row
      )
    );
  };

  const handleSubmit = async (id) => {
    console.log(id);
    const row = rows.find(row => row.id === id);
    const formData = new FormData();
    formData.append(`id`, row.id);
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
      const response = await axios.post('http://localhost:8080/admin/inputTemporaryOrder', formData);
      console.log(response.data);
      dataOrderId = response.data.orderid;
      setShowSuccess(true);
      setMsgSuccess("Berhasil Menyimpan Order Sementara");
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      setShowError(false);
      setMsgError("Gagal Menyimpan Order Sementara");
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  const handleConfirmClearAll = async (e) => {
    e.preventDefault();
    console.log(orderData);
    try {
      const response = await axios.post('http://localhost:8080/admin/deleteTemporaryOrder', orderData);
      console.log(response.data);
      setOpenClearAll(false);
      setOrderData([]);
      setShowSuccess(true);
      setMsgSuccess("Berhasil Membersihkan Semua Data Temporary Order");
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error fetching data:', error);
      setOpenClearAll(false);
      setShowError(true);
      setMsgError("Gagal Membersihkan Semua Data Temporary Order");
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  const handleConfirmSubmitAll = async (e) => {
    e.preventDefault();
    console.log(orderData);
    try {
      const response = await axios.post('http://localhost:8080/admin/inputOrder', orderData);
      console.log(response.data);
      setOpenSubmitAll(false);
      setOrderData([]);
      setShowSuccess(true);
      setMsgSuccess("Berhasil Menambah Order");
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error fetching data:', error);
      setOpenSubmitAll(false);
      setShowError(true);
      setMsgError("Gagal Menambah Order");
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  const handleAddColour = async (e) => {
    e.preventDefault();
    try {
      const name = namaColour;
      const colourhex = hexColour;
      const response = await axios.post('http://localhost:8080/admin/tambahWarna', { name, colourhex });
      console.log(response.data);
      setOpenTambah(false);
      setShowSuccess(true);
      setMsgSuccess("Berhasil Menambah Warna");
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      fetchDataColour();
      setNamaColour('');
      setHexColour('');
    } catch (error) {
      setOpenTambah(false);
      setShowError(false);
      setMsgError("Gagal Menambah Order");
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      setNamaColour('');
    }
  };

  const handleLogout = () => {
    setOpenLogout(false);
    logout();
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
          {getusername}
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
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {showSuccess && (
            <Alert variant="filled" severity="success" sx={{marginBottom: 3}}>
              { msgSuccess }
            </Alert>
          )}
          {showError && (
            <Alert variant="filled" severity="error" sx={{marginBottom: 3}}>
              { msgError }
            </Alert>
          )}
          <Box sx={{ minWidth: 300 }}>
            <FormControl fullWidth>
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
            <TableContainer component={Paper} sx={{maxHeight: 370, overflow: 'auto'}}>
              <Table stickyHeader sx={{ width: '135%'}}>
                <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                    tableColour={tableColour}
                />
                {colourOrder ? (
                <TableBody>
                  {visibleRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell width={'5%'}>
                        <TextField
                          disabled
                          fullWidth
                          value={row.kodepemesanan}
                        />
                      </TableCell>
                      <TableCell width={'10%'}>
                        <TextField
                          disabled
                          fullWidth
                          value={row.username}
                          onChange={(e) => handleInputChange(row.id, 'username', e.target.value)}
                        />
                      </TableCell>
                      <TableCell width={'10%'}>
                        <TextField
                          disabled
                          fullWidth
                          type="tel"
                          value={row.phonenumber}
                          onChange={(e) => handleInputChange(row.id, 'phonenumber', e.target.value)}
                        />
                      </TableCell>
                      <TableCell width={'15%'}>
                        <Autocomplete
                          fullWidth
                          multiple
                          options={optionsItem}
                          getOptionLabel={(option) => option.itemcode}
                          renderInput={(params) => <TextField {...params} />}
                          value={row.itemidall}
                          // value={optionsItem.find((option) => option.itemcode === row.itemidall)}
                          onChange={(event, newValue) => handleAutocompleteItemChange(event, newValue, row.id)}
                        />
                      </TableCell>
                      <TableCell width={'9%'}>
                        <NumericFormat
                          disabled
                          fullWidth
                          autoComplete='off'
                          value={row.totalprice}
                          onValueChange={(e) => handleInputChange(row.id, 'totalprice', e.target.value)}
                          thousandSeparator='.'
                          decimalSeparator=','
                          customInput={TextField}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell width={'7%'}>
                        <NumericFormat
                          disabled
                          fullWidth
                          autoComplete='off'
                          value={row.totalweight}
                          onValueChange={(e) => handleInputChange(row.id, 'totalweight', e.target.value)}
                          customInput={TextField}
                          InputProps={{
                            endAdornment: <InputAdornment position="start">g</InputAdornment>,
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell width={'12%'}>
                        <TextField
                          fullWidth
                          value={row.waitinglist}
                          onChange={(e) => handleInputChange(row.id, 'waitinglist', e.target.value)}
                        />
                      </TableCell>
                      <TableCell width={'10%'}>
                        <TextField
                          InputProps={{
                            readOnly: true,
                          }}
                          aria-readonly
                          fullWidth
                          value={row.link}
                        />
                      </TableCell>
                      <TableCell width={'8%'}>
                        {row.status === "Payment Not Done" && (
                          <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: 'red', textTransform: 'capitalize', maxHeight: 50}}>
                            Payment Not Done
                          </Button>
                        )}
                        {row.status === "On Packing" && (
                          <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: 'orange', textTransform: 'capitalize', maxHeight: 50}}>
                            On Packing
                          </Button>
                        )}
                        {row.status === "On Pick Up" && (
                          <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: 'brown', textTransform: 'capitalize', maxHeight: 50}}>
                            On Pick Up
                          </Button>
                        )}
                        {row.status === "On Delivery" && (
                          <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: 'yellow', textTransform: 'capitalize', maxHeight: 50}}>
                            On Delivery
                          </Button>
                        )}
                        {row.status === "Done" && (
                          <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: 'green', textTransform: 'capitalize', maxHeight: 50}}>
                            Done
                          </Button>
                        )}
                      </TableCell>
                      <TableCell width={'5%'}>
                        <Button variant="contained" onClick={() => handleSubmit(row.id)} >
                          Save
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell rowSpan={10}>Pilih warna terlebih dahulu untuk menampilkan isi tabel</TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            {colourOrder ? (
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Button onClick={handleOpenClearAll} variant="contained" color="warning">
                    Clear All
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button onClick={handleOpenSubmitAll} variant="contained" color="success">
                    Submit All
                  </Button>
                </Box>
                {/* ini modal konfirmasi clear all */}
                <Modal
                  aria-labelledby="spring-modal-title"
                  aria-describedby="spring-modal-description"
                  open={openClearAll}
                  onClose={handleCloseClearAll}
                  closeAfterTransition
                  slots={{ backdrop: Backdrop }}
                  slotProps={{
                    backdrop: {
                      TransitionComponent: Fade,
                    },
                  }}
                >
                  <Fade in={openClearAll}>
                    <Box sx={styleModal}>
                      <Typography id="spring-modal-title" variant="h6" component="h2">
                        Apakah anda yakin ingin menghapus semua data di tabel?
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Button variant="outlined" onClick={handleConfirmClearAll} sx={{ mr: 2, backgroundColor: '#FE8A01', color: 'white' }}>
                          Ya
                        </Button>
                        <Button variant="outlined" onClick={handleCloseClearAll}>
                          Tidak
                        </Button>
                      </Box>
                    </Box>
                  </Fade>
                </Modal>

                {/* ini modal konfirmasi submit all */}
                <Modal
                  aria-labelledby="spring-modal-title"
                  aria-describedby="spring-modal-description"
                  open={openSubmitAll}
                  onClose={handleCloseSubmitAll}
                  closeAfterTransition
                  slots={{ backdrop: Backdrop }}
                  slotProps={{
                    backdrop: {
                      TransitionComponent: Fade,
                    },
                  }}
                >
                  <Fade in={openSubmitAll}>
                    <Box sx={styleModal}>
                      <Typography id="spring-modal-title" variant="h6" component="h2">
                      Apakah anda yakin ingin menambahkan semua data di tabel?
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Button variant="outlined" onClick={handleConfirmSubmitAll} sx={{ mr: 2, backgroundColor: '#FE8A01', color: 'white' }}>
                          Ya
                        </Button>
                        <Button variant="outlined" onClick={handleCloseSubmitAll}>
                          Tidak
                        </Button>
                      </Box>
                    </Box>
                  </Fade>
                </Modal>
                <TablePagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  labelRowsPerPage=""
                />
              </Box>
            ) : (
              <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                labelRowsPerPage=""
              />
            )}
            
          </Box>
          <br></br>
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
                      <Grid item xs={10}>
                        <Typography>Nama Warna *</Typography>
                        <TextField
                          fullWidth
                          value={namaColour}
                          error={!!errors.namaColour}
                          onChange={(e) => setNamaColour(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Typography>&nbsp;</Typography>
                        <TextField
                          type='color'
                          value={hexColour}
                          onChange={(e) => setHexColour(e.target.value)}
                          fullWidth
                          InputProps={{
                            sx: {
                              padding: 0,
                              '& input[type="color"]': {
                                height: 60,
                                padding: 0,
                                border: 'none',
                                cursor: 'pointer',
                              },
                            },
                          }}
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
