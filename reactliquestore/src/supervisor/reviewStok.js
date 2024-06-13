import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import styled from 'styled-components';
import { Alert, Autocomplete, Backdrop, Button, CssBaseline, Drawer, Grid, Modal, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SupervisorSidebar from './sidebar';
import { useSpring, animated } from '@react-spring/web';
import { useDropzone } from 'react-dropzone';
import { EmployeeContext } from '../employeeContext';
import { AccountCircle } from '@mui/icons-material';

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
  { id: 'id', numeric: false, disablePadding: false, label: 'ID Barang' },
  { id: 'nama', numeric: false, disablePadding: false, label: 'Nama Barang' },
  { id: 'jenis', numeric: false, disablePadding: false, label: 'Jenis Barang' },
  { id: 'berat', numeric: true, disablePadding: false, label: 'Berat Barang' },
  { id: 'hargaModal', numeric: true, disablePadding: false, label: 'Harga Modal Barang' },
  { id: 'hargaJual', numeric: true, disablePadding: false, label: 'Harga Jual Barang' },
  { id: 'ukuran', numeric: true, disablePadding: false, label: 'Ukuran Barang' },
  { id: 'lastupdate', numeric: false, disablePadding: false, label: 'Last Update Time' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status Barang' },
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
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
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

export default function ReviewStok() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [showSuccessInsert, setShowSuccessInsert] = useState(false);
  const [messageInsert, setMessageInsert] = useState('');
  const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
  const [messageUpdate, setMessageUpdate] = useState('');
  const [showSuccessDelete, setShowSuccessDelete] = useState(false);
  const [messageDelete, setMessageDelete] = useState('');
  const [showError, setShowError] = useState(false);
  const [msgError, setMsgError] = useState();
  const [open, setOpen] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);
  const [name, setname] = useState('');
  const [tipeBarang, settipeBarang] = useState('');
  const [typeData, setTypeData] = useState([]);
  const [employeeId, setemployeeId] = useState('');
  const [customWeight, setcustomWeight] = useState('');
  const [customCapitalPrice, setcustomCapitalPrice] = useState('');
  const [customDefaultPrice, setcustomDefaultPrice] = useState('');
  const [size, setSize] = useState('');
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const { employeeData } = useContext(EmployeeContext);
  const { clearEmployeeData } = useContext(EmployeeContext);
  
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
      const details = acceptedFiles.map(file => ({
          path: file.path || ""
      }));
      const fileNames = details.map(file => file.path);
      setFiles(fileNames);
    } else {
      console.error('Invalid file types detected. Please upload only image files.');
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    // const storedMessageInsert = localStorage.getItem('berhasilInsertKaryawan');
    // const storedMessageUpdate = localStorage.getItem('berhasilUpdateKaryawan');
    // if (storedMessageInsert) {
    //   setShowSuccessInsert(true);
    //   setMessageInsert(storedMessageInsert);
    //   setTimeout(() => {
    //     setShowSuccessInsert(false);
    //   }, 5000);
    //   localStorage.removeItem('berhasilInsertKaryawan')
    // }
    // else if (storedMessageUpdate) {
    //   setShowSuccessUpdate(true);
    //   setMessageUpdate(storedMessageUpdate);
    //   setTimeout(() => {
    //     setShowSuccessUpdate(false);
    //   }, 5000);
    //   localStorage.removeItem('berhasilUpdateKaryawan')
    // }

    // Fetch data from the backend
    const fetchDataInventori = async () => {
      try {
        const response = await axios.get('http://localhost:8080/dataInventori');
        console.log(response.data);
        setRows(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (employeeData) {
      console.log(employeeData);
      setemployeeId(employeeData.id);
      // Fetch data from the backend
      const fetchDataTipeBarang = async () => {
        try {
          const response = await axios.get('http://localhost:8080/daftarTipe');
          console.log(response.data);
          setTypeData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchDataTipeBarang();
    }

    fetchDataInventori();
    
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

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
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
      // try {
      //   const response = await axios.post('http://localhost:8080/tambahInventori', { name, typeId, employeeId, customWeight, customCapitalPrice, customDefaultPrice, size, files }, {
      //     headers: {
      //       'Content-Type': 'application/json'
      //     }
      //   });
      //   console.log(response.data);
      //   // setOpen(false);
      //   setShowSuccessInsert(true);
      //   setMessageInsert("Berhasil Menambah Katalog Barang");
      //   setTimeout(() => {
      //     setShowSuccessInsert(false);
      //   }, 5000);
      // } catch (error) {
      //   setErrors(error.response);
      // }
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
          <SupervisorSidebar />
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
        <br></br>
        <Toolbar />
        <RootContainer>
          {/* {showSuccessInsert && (
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
          )} */}
          <Box sx={{ width: '100%' }}>
              <Paper sx={{ width: '100%', mb: 2 }}>
              <TableContainer>
                  <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={dense ? 'small' : 'medium'}
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
                        <TableRow
                        hover
                        tabIndex={-1}
                        key={row.id}
                        sx={{ cursor: 'pointer' }}
                        >
                          <TableCell align="center">{row.id}</TableCell>
                          <TableCell align="center">{row.nama}</TableCell>
                          <TableCell align="center">{row.typeId.id}</TableCell>
                          <TableCell align="center">{row.customWeight}</TableCell>
                          <TableCell align="center">{row.customCapitalPrice}</TableCell>
                          <TableCell align="center">{row.customDefaultPrice}</TableCell>
                          <TableCell align="center">{row.size}</TableCell>
                          <TableCell align="center">{row.lastupdate}</TableCell>
                          <TableCell align="center">
                          {row.status === "bekerja" && (
                            <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: '#4caf50'}}>
                              Bekerja
                            </Button>
                          )}
                          {row.status === "cuti" && (
                            <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: '#757575' }}>
                              Cuti
                            </Button>
                          )}
                          {row.status === "berhenti" && (
                            <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: '#d32f2f' }}>
                              Berhenti
                            </Button>
                          )}  
                          </TableCell>
                        </TableRow>
                      );
                      })}
                      {emptyRows > 0 && (
                      <TableRow
                          style={{
                          height: (dense ? 33 : 53) * emptyRows,
                          }}
                      >
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
              <FormControlLabel
              control={<Switch checked={dense} onChange={handleChangeDense} />}
              label="Dense padding"
              />
          </Box>
          <Button style={btnTambahKaryawan} onClick={handleOpen}>+ Tambah Katalog</Button>
          <Modal
            aria-labelledby="spring-modal-title"
            aria-describedby="spring-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                TransitionComponent: Fade,
              },
            }}
          >
            <Fade in={open}>
              <Box sx={styleModalTambah}>
              <form>
                <Grid container spacing={3}>
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
                  <Grid item xs={6}>
                    <Typography>Berat Barang *</Typography>
                    <TextField
                      fullWidth
                      type='number'
                      value={customWeight}
                      error={!!errors.customWeight}
                      onChange={(e) => setcustomWeight(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Harga Modal Barang *</Typography>
                    <TextField
                      fullWidth
                      type='number'
                      value={customCapitalPrice}
                      error={!!errors.customCapitalPrice}
                      onChange={(e) => setcustomCapitalPrice(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Harga Jual Barang *</Typography>
                    <TextField
                      fullWidth
                      type='number'
                      value={customDefaultPrice}
                      error={!!errors.customDefaultPrice}
                      onChange={(e) => setcustomDefaultPrice(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
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
            </Fade>
          </Modal>
        </RootContainer>
      </Box>
    </Box>
  );
}
