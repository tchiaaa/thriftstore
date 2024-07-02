import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import styled from 'styled-components';
import { Alert, Backdrop, Button, CssBaseline, Drawer, FormHelperText, Grid, IconButton, InputAdornment, Modal, TextField, Typography } from '@mui/material';
import AdminSidebar from './sidebar';
import { useSpring, animated } from '@react-spring/web';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from '../authContext';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { NumericFormat } from 'react-number-format';

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
  const [rows, setRows] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [msgSuccess, setmsgSuccess] = useState('');
  const [showError, setShowError] = useState(false);
  const [msgError, setMsgError] = useState();
  const [nama, setnama] = useState('');
  const [varian, setvarian] = useState('');
  const [weight, setweight] = useState('');
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
  const getusername = auth.user ? auth.user.username : '';

  const validate = () => {
    let tempErrors = {};

  // Validasi Nama
  if (!nama) {
    tempErrors.nama = 'Jenis barang harus diisi';
  } else if (nama.length > 255){
    tempErrors.nama = 'Jenis barang maksimal 255 karakter'
  }

  // Validasi Varian
  if (!varian) {
    tempErrors.varian = 'varian barang harus diisi';
  } else if (varian.length > 255){
    tempErrors.varian = 'varian barang maksimal 255 karakter'
  }

  // Validasi Weight
  if (!weight) {
    tempErrors.weight = 'Berat barang harus diisi';
  } else if (weight.length > 10) { // contoh panjang maksimal 10 karakter
    tempErrors.weight = 'Berat barang maksimal 10 karakter';
  }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const fetchDataInventori = async () => {
    try {
      const response = await axios.get('http://localhost:8080/admin/dataTipe');
      console.log(response.data);
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataInventori();
  }, []);

  const handleCloseTambah = () => {
    setOpenTambah(false);
    setErrors({});
    setnama('');
    setvarian('');
    setweight('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post('http://localhost:8080/admin/tambahTipe', { nama, varian, weight });
        console.log(response.data);
        setOpenTambah(false);
        setShowSuccess(true);
        setmsgSuccess("Berhasil Menambah Tipe Barang");
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
        fetchDataInventori();
        setnama('');
        setvarian('');
        setweight('');
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
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setErrors({});
    setnama('');
    setvarian('');
    setweight('');
  };

  const handleConfirmEdit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const id = updatedId;
      try {
        const response = await axios.post('http://localhost:8080/admin/editTipe', { id, nama, varian, weight });
        console.log(response.data);
        setShowSuccess(true);
        setmsgSuccess("Berhasil Mengubah Tipe Barang");
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
        fetchDataInventori();
        setnama('');
        setvarian('');
        setweight('');
      } catch (error) {
        setShowError(true);
        setMsgError("Gagal Mengubah Tipe Barang");
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }
      setOpenEdit(false);
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
      const response = await axios.delete(`http://localhost:8080/admin/deleteTipe/${id}`);
      console.log(response.data);
      setShowSuccess(true);
      setmsgSuccess("Berhasil Hapus Tipe Barang");
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      fetchDataInventori();
    } catch (error) {
      console.error(error);
      setMsgError("Gagal Hapus Tipe Barang");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
    setOpenDelete(false);
  };

  const handleLogout = () => {
    setOpenLogout(false);
    logout();
  };

  const columns = [
    {
      field: 'typecode',
      headerName: 'Kode Barang',
      flex: 1,
      editable: true,
    },
    {
      field: 'nama',
      headerName: 'Jenis Barang',
      flex: 1,
      editable: true,
    },
    {
      field: 'varian',
      headerName: 'Varian',
      flex: 1,
      editable: true,
    },
    {
      field: 'weight',
      headerName: 'Berat (g)',
      type: 'number',
      flex: 1,
      editable: true,
      valueFormatter: (weight) => `${weight} g`,
    },
    {
      field: 'lastupdate',
      headerName: 'Last Update',
      type: 'date',
      flex: 1,
      editable: true,
      valueGetter: (lastupdate) => {
        console.log(lastupdate);
        return lastupdate;
      },
      valueFormatter: (lastupdate) => {
        const formdate = dayjs(lastupdate).format('DD/MM/YYYY');
        console.log(formdate);
        return dayjs(lastupdate).format('DD/MM/YYYY');
      }
    },
    {
      field: 'actions',
      headerName: '',
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleOpenEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleOpenDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </div>
      )
    }
  ];

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
        <RootContainer>
          {showSuccess && (
            <Alert variant="filled" severity="success" style={{ marginBottom: 3 }}>
              { msgSuccess }
            </Alert>
          )}
          {showError && (
            <Alert variant="filled" severity="error" style={{ marginBottom: 3 }}>
              { msgError }
            </Alert>
          )}
          <Typography variant='h3' marginBottom={5}>
            Tipe Barang
          </Typography>
          <Box sx={{ width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
            />
            <br></br>
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
                      <Typography>Berat Barang *</Typography>
                      <NumericFormat
                        fullWidth
                        autoComplete='off'
                        value={weight}
                        onValueChange={(values) => setweight(values.floatValue)}
                        thousandSeparator='.'
                        decimalSeparator=','
                        customInput={TextField}
                        error={!!errors.weight}
                        InputProps={{
                          endAdornment: <InputAdornment position="start">g</InputAdornment>,
                        }}
                        variant="outlined"
                      />
                      {!!errors.weight && (
                        <FormHelperText error sx={{ color: 'red' }}>
                          {errors.weight}
                        </FormHelperText>
                      )}
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
                    <Typography>Berat Barang *</Typography>
                    <NumericFormat
                      fullWidth
                      autoComplete='off'
                      value={weight}
                      onValueChange={(values) => setweight(values.floatValue)}
                      thousandSeparator='.'
                      decimalSeparator=','
                      customInput={TextField}
                      error={!!errors.weight}
                      InputProps={{
                        endAdornment: <InputAdornment position="start">g</InputAdornment>,
                      }}
                      variant="outlined"
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
