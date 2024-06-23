import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import styled from 'styled-components';
import { Alert, Backdrop, Button, CssBaseline, Drawer, Grid, IconButton, Modal, TextField, Tooltip, Typography } from '@mui/material';
import AdminSidebar from './sidebar';
import { useSpring, animated } from '@react-spring/web';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from '../authContext';

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const btnTambahKaryawan = {
    justifyContent: 'center',
    width: '15vw',
    borderRadius: '10px',
    backgroundColor: '#FE8A01',
    color: 'black',
    border: '3px solid black'
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
  { id: 'name', numeric: false, disablePadding: false, label: 'Jenis Barang' },
  { id: 'varian', numeric: true, disablePadding: false, label: 'Varian' },
  { id: 'weight', numeric: true, disablePadding: false, label: 'Berat' },
  { id: 'capitalPrice', numeric: true, disablePadding: false, label: 'Harga Modal' },
  { id: 'defaultPrice', numeric: true, disablePadding: false, label: 'Harga Jual' },
  { id: 'lastupdate', numeric: false, disablePadding: false, label: 'Last Update Date' },
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

const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
  textAlign: 'center'
};

const styleModalTambah = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
};

export default function ReviewStok() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [showSuccessInsert, setShowSuccessInsert] = useState(false);
  const [messageInsert, setMessageInsert] = useState('');
  const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
  const [messageUpdate, setMessageUpdate] = useState('');
  const [showSuccessDelete, setShowSuccessDelete] = useState(false);
  const [messageDelete, setMessageDelete] = useState('');
  const [showError, setShowError] = useState(false);
  const [msgError, setMsgError] = useState();
  const [nama, setnama] = useState('');
  const [varian, setvarian] = useState('');
  const [weight, setweight] = useState('');
  const [capitalprice, setcapitalprice] = useState('');
  const [defaultprice, setdefaultprice] = useState('');
  const [errors, setErrors] = useState({});
  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const handleOpenTambah = () => setOpenTambah(true);
  const [updatedId, setUpdatedId] = useState('');
  const handleCloseDelete = () => setOpenDelete(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);
  const { auth, logout } = useAuth();
  const getFullname = auth.user ? auth.user.fullname : '';
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const validate = () => {
    let tempErrors = {};

  // Validasi Nama
  if (!nama) {
    tempErrors.nama = 'Jenis barang harus diisi';
  } else if (nama.length >= 255){
    tempErrors.nama = 'Jenis barang maksimal 255 karakter'
  }

  // Validasi Varian
  if (!varian) {
    tempErrors.varian = 'varian barang harus diisi';
  } else if (varian.length >= 255){
    tempErrors.varian = 'varian barang maksimal 255 karakter'
  }

  // Validasi Weight
  if (!weight) {
    tempErrors.weight = 'Berat barang harus diisi';
  } else if (weight.length >= 10) { // contoh panjang maksimal 10 karakter
    tempErrors.weight = 'Berat barang maksimal 10 karakter';
  }

  // Validasi Capital Price
  if (!capitalprice) {
    tempErrors.capitalprice = 'Harga modal barang harus diisi';
  } else if (capitalprice.length >= 15) { // contoh panjang maksimal 15 karakter
    tempErrors.capitalprice = 'Harga modal barang maksimal 15 karakter';
  }

  // Validasi Default Price
  if (!defaultprice) {
    tempErrors.defaultprice = 'Harga jual barang harus diisi';
  } else if (defaultprice.length >= 15) { // contoh panjang maksimal 15 karakter
    tempErrors.defaultprice = 'Harga jual barang maksimal 15 karakter';
  }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const fetchDataInventori = async () => {
    try {
      const response = await axios.get('http://localhost:8080/supervisor/dataTipe');
      console.log(response.data);
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataInventori();
  }, []);

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

  const handleCloseTambah = () => {
    setOpenTambah(false);
    setErrors({});
    setnama('');
    setvarian('');
    setweight('');
    setcapitalprice('');
    setdefaultprice('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post('http://localhost:8080/supervisor/tambahTipe', { nama, varian, weight, capitalprice, defaultprice });
        console.log(response.data);
        setOpenTambah(false);
        setShowSuccessInsert(true);
        setMessageInsert("Berhasil Menambah Tipe Barang");
        setTimeout(() => {
          setShowSuccessInsert(false);
        }, 5000);
        fetchDataInventori();
        setnama('');
        setvarian('');
        setweight('');
        setcapitalprice('');
        setdefaultprice('');
      } catch (error) {
        setErrors(error.response);
        setShowError(true);
        setMsgError("Gagal Menambah Tipe Barang");
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }
    } else {
      console.log("Validation failed");
    }
  };

  const handleOpenEdit = (row) => {
    setUpdatedId(row.id);
    setnama(row.nama);
    setvarian(row.varian);
    setweight(row.weight);
    setcapitalprice(row.capitalPrice);
    setdefaultprice(row.defaultPrice);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setErrors({});
    setnama('');
    setvarian('');
    setweight('');
    setcapitalprice('');
    setdefaultprice('');
  };

  const handleConfirmEdit = async (e) => {
    e.preventDefault();
    if (validate()) {
      console.log(varian);
      console.log(weight);
      console.log(capitalprice);
      console.log(defaultprice);
      const id = updatedId;
      try {
        const response = await axios.post('http://localhost:8080/supervisor/editTipe', { id, nama, varian, weight, capitalprice, defaultprice });
        console.log(response.data);
        setOpenEdit(false);
        setShowSuccessUpdate(true);
        setMessageUpdate("Berhasil Mengubah Tipe Barang");
        setTimeout(() => {
          setShowSuccessUpdate(false);
        }, 5000);
        fetchDataInventori();
        setnama('');
        setvarian('');
        setweight('');
        setcapitalprice('');
        setdefaultprice('');
      } catch (error) {
        setShowError(true);
        setMessageUpdate("Gagal Mengubah Tipe Barang");
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }
    } else {
      console.log("Validation failed");
    }
  };

  const handleOpenDelete = (row) => {
    setUpdatedId(row.id);
    console.log(row.id)
    setOpenDelete(true);
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    try {
      const id = updatedId;
      const response = await axios.delete(`http://localhost:8080/supervisor/deleteTipe/${id}`);
      console.log(response.data);
      setShowSuccessDelete(true);
      setMessageDelete("Berhasil Hapus Karyawan");
      setTimeout(() => {
        setShowSuccessDelete(false);
      }, 5000);
      fetchDataInventori();
      setOpenDelete(false);
      setnama('');
      setweight('');
      setcapitalprice('');
      setdefaultprice('');
    } catch (error) {
      console.error(error);
      setMsgError("Gagal Hapus Karyawan");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  const handleLogout = () => {
    setOpenLogout(false);
    logout();
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
          {getFullname}
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
        <br></br>
        <Toolbar />
        <RootContainer>
          {showSuccessInsert && (
            <Alert variant="filled" severity="success" style={{ marginTop: 20 }}>
              { messageInsert }
            </Alert>
          )}
          {showSuccessUpdate && (
            <Alert variant="filled" severity="success" style={{ marginTop: 20 }}>
              { messageUpdate }
            </Alert>
          )}
          {showSuccessDelete && (
            <Alert variant="filled" severity="success" style={{ marginTop: 20 }}>
              { messageDelete }
            </Alert>
          )}
          {showError && (
            <Alert variant="filled" severity="danger" style={{ marginTop: 20 }}>
              { msgError }
            </Alert>
          )}
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <TableContainer>
                  <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  >
                  <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={rows.length}
                  />
                  <TableBody>
                      {visibleRows.map((row) => {
                      return (
                        <>
                        <TableRow
                        hover
                        tabIndex={-1}
                        key={row.id}
                        sx={{ cursor: 'pointer' }}
                        >
                          <TableCell align="center">{row.nama}</TableCell>
                          <TableCell align="center">{row.varian}</TableCell>
                          <TableCell align="right">{row.weight} g</TableCell>
                          <TableCell align="right">{formatCurrency(row.capitalPrice)}</TableCell>
                          <TableCell align="right">{formatCurrency(row.defaultPrice)}</TableCell>
                          <TableCell align="center">{row.lastupdate}</TableCell>
                          <TableCell sx={{display: 'flex'}}>
                            <Tooltip title="edit">
                              <IconButton onClick={() => handleOpenEdit(row)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton onClick={() => handleOpenDelete(row)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>

                        {/* ini modal edit data */}
                        <Modal
                          aria-labelledby="spring-modal-title"
                          aria-describedby="spring-modal-description"
                          open={openEdit}
                          onClose={handleCloseEdit}
                          closeAfterTransition
                          slots={{ backdrop: Backdrop }}
                          slotProps={{
                            backdrop: {
                              TransitionComponent: Fade,
                            },
                          }}
                        >
                          <Fade in={openEdit}>
                            <Box sx={styleModalTambah}>
                            <form>
                              <Grid container spacing={3}>
                                <Grid item xs={12}>
                                  <Typography>Jenis Barang *</Typography>
                                  <TextField
                                    fullWidth
                                    autoComplete='off'
                                    value={nama}
                                    error={!!errors.nama}
                                    helperText={errors.nama}
                                    FormHelperTextProps={{ sx: { color: 'red' } }}
                                    onChange={(e) => setnama(e.target.value)}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography>Varian Barang *</Typography>
                                  <TextField
                                    fullWidth
                                    autoComplete='off'
                                    value={varian}
                                    error={!!errors.varian}
                                    helperText={errors.varian}
                                    FormHelperTextProps={{ sx: { color: 'red' } }}
                                    onChange={(e) => setvarian(e.target.value)}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography>Berat Barang (g) *</Typography>
                                  <TextField
                                    fullWidth
                                    type='number'
                                    autoComplete='off'
                                    value={weight}
                                    error={!!errors.weight}
                                    helperText={errors.weight}
                                    FormHelperTextProps={{ sx: { color: 'red' } }}
                                    onChange={(e) => setweight(e.target.value)}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography>Harga Modal Barang (Rp.) *</Typography>
                                  <TextField
                                    fullWidth
                                    type='number'
                                    autoComplete='off'
                                    value={capitalprice}
                                    error={!!errors.capitalprice}
                                    helperText={errors.capitalprice}
                                    FormHelperTextProps={{ sx: { color: 'red' } }}
                                    onChange={(e) => setcapitalprice(e.target.value)}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography>Harga Jual Barang (Rp.) *</Typography>
                                  <TextField
                                    fullWidth
                                    type='number'
                                    autoComplete='off'
                                    value={defaultprice}
                                    error={!!errors.defaultprice}
                                    helperText={errors.defaultprice}
                                    FormHelperTextProps={{ sx: { color: 'red' } }}
                                    onChange={(e) => setdefaultprice(e.target.value)}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <Button variant="contained" onClick={handleConfirmEdit} fullWidth style={{ backgroundColor: 'black', color: 'white' }}>
                                    Submit
                                  </Button>
                                </Grid>
                              </Grid>
                            </form>
                            </Box>
                          </Fade>
                        </Modal>

                        {/* ini modal delete tipe */}
                        <Modal
                          aria-labelledby="spring-modal-title"
                          aria-describedby="spring-modal-description"
                          open={openDelete}
                          onClose={handleCloseDelete}
                          closeAfterTransition
                          slots={{ backdrop: Backdrop }}
                          slotProps={{
                            backdrop: {
                              TransitionComponent: Fade,
                            },
                          }}
                          >
                          <Fade in={openDelete}>
                            <Box sx={styleModal}>
                              <Typography id="spring-modal-title" variant="h6" component="h2">
                                Apakah kamu yakin ingin membuang data ini?
                              </Typography>
                              <Box sx={{ mt: 2 }}>
                                <Button variant="outlined" onClick={handleConfirmDelete} sx={{ mr: 2, backgroundColor: '#FE8A01', color: 'white' }}>
                                  Ya
                                </Button>
                                <Button variant="outlined" onClick={handleCloseDelete}>
                                  Tidak
                                </Button>
                              </Box>
                            </Box>
                          </Fade>
                        </Modal>
                        </>
                      );
                      })}
                      {emptyRows > 0 && (
                      <TableRow>
                        <TableCell colSpan={10} />
                      </TableRow>
                      )}
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
              </Paper>
          </Box>
          <Button style={btnTambahKaryawan} onClick={handleOpenTambah}>+ Tambah Jenis Barang</Button>
          
          {/* ini modal tambah tipe */}
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
                    <Typography>Jenis Barang *</Typography>
                    <TextField
                      fullWidth
                      autoComplete='off'
                      value={nama}
                      error={!!errors.nama}
                      helperText={errors.nama}
                      FormHelperTextProps={{ sx: { color: 'red' } }}
                      onChange={(e) => setnama(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>Varian Barang *</Typography>
                    <TextField
                      fullWidth
                      autoComplete='off'
                      value={varian}
                      error={!!errors.varian}
                      helperText={errors.varian}
                      FormHelperTextProps={{ sx: { color: 'red' } }}
                      onChange={(e) => setvarian(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>Berat Barang (g) *</Typography>
                    <TextField
                      fullWidth
                      type='number'
                      autoComplete='off'
                      value={weight}
                      error={!!errors.weight}
                      helperText={errors.weight}
                      FormHelperTextProps={{ sx: { color: 'red' } }}
                      onChange={(e) => setweight(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>Harga Modal Barang (Rp.) *</Typography>
                    <TextField
                      fullWidth
                      type='number'
                      autoComplete='off'
                      value={capitalprice}
                      error={!!errors.capitalprice}
                      helperText={errors.capitalprice}
                      FormHelperTextProps={{ sx: { color: 'red' } }}
                      onChange={(e) => setcapitalprice(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>Harga Jual Barang (Rp.) *</Typography>
                    <TextField
                      fullWidth
                      type='number'
                      autoComplete='off'
                      value={defaultprice}
                      error={!!errors.defaultprice}
                      helperText={errors.defaultprice}
                      FormHelperTextProps={{ sx: { color: 'red' } }}
                      onChange={(e) => setdefaultprice(e.target.value)}
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
            </Fade>
          </Modal>
        </RootContainer>
      </Box>
    </Box>
  );
}
