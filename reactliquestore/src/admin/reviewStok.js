import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import axios from 'axios';
import styled from 'styled-components';
import { Alert, Autocomplete, Backdrop, Button, CssBaseline, Drawer, FormHelperText, Grid, IconButton, InputAdornment, Modal, TextField, Typography } from '@mui/material';
import AdminSidebar from './sidebar';
import { useSpring, animated } from '@react-spring/web';
import { useDropzone } from 'react-dropzone';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from '../authContext';
import { DataGrid, GridHeader } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
};

const StyledHeader = styled(GridHeader)`
  background-color: #f0f0f0;
  color: blue;
`;

export default function ReviewStok() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [rows, setRows] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [msgSuccess, setmsgSuccess] = useState('');
  const [showError, setShowError] = useState(false);
  const [msgError, setMsgError] = useState();
  const [showMsgImage, setShowMsgImage] = useState(false);
  const [msgImageError, setMsgImageError] = useState();
  const [open, setOpen] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);
  const [name, setname] = useState('');
  const [tipeBarang, settipeBarang] = useState('');
  const [typeData, setTypeData] = useState([]);
  const [employeeId, setemployeeId] = useState('');
  const [customWeight, setcustomWeight] = useState('');
  const [customCapitalPrice, setcustomCapitalPrice] = useState('');
  const [customDefaultPrice, setcustomDefaultPrice] = useState('');
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [updatedId, setUpdatedId] = useState('');
  const handleCloseDelete = () => setOpenDelete(false);
  const { auth, logout } = useAuth();
  const getusername = auth.user ? auth.user.username : '';
  const getId = auth.user ? auth.user.id : '';

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
    if (!name) {
      tempErrors.name = 'Nama barang harus diisi';
    }
    else if (name.length > 255) {
      tempErrors.name = 'Nama barang maksimal 25 karakter';
    }
    if (!tipeBarang) {
      tempErrors.tipeBarang = 'Tipe barang harus diisi';
    }
    if (!customWeight) {
      tempErrors.customWeight = 'Berat barang harus diisi';
    }
    else if (customWeight.length > 5) {
      tempErrors.customWeight = 'Jenis barang maksimal 25 karakter';
    }
    if (!customCapitalPrice) {
      tempErrors.customCapitalPrice = 'Harga modal barang harus diisi';
    }
    else if (customCapitalPrice.length > 15) {
      tempErrors.customCapitalPrice = 'Jenis barang maksimal 25 karakter';
    }
    if (!customDefaultPrice) {
      tempErrors.customDefaultPrice = 'Harga jual barang harus diisi';
    }
    else if (customDefaultPrice.length > 15) {
      tempErrors.customDefaultPrice = 'Jenis barang maksimal 25 karakter';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  
  const onDrop = useCallback((acceptedFiles) => {
    // Handle the files
    const validFiles = acceptedFiles.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file.name));
    console.log(acceptedFiles);
    if (validFiles.length > 0) {
      setShowMsgImage(false);
      // const details = acceptedFiles.map(file => ({
      //     path: file.path || ""
      // }));
      // const fileNames = details.map(file => file.path);
      // setFiles(fileNames);
      const filePreviews = validFiles.map(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise(resolve => {
          reader.onload = () => {
            resolve({ path: file.name, preview: reader.result, originalFile: file });
          };
        });
      });

      Promise.all(filePreviews).then(images => {
        setFiles(images);
      })
      .catch(error => {
        console.error('Error reading files:', error);
      });
    } else {
      setShowMsgImage(true);
      setMsgImageError('Invalid file types detected. Please upload only image files.');
      console.error('Invalid file types detected. Please upload only image files.');
    }
  }, [setFiles]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const fetchDataInventori = async () => {
    try {
      const response = await axios.get(`${backendUrl}/admin/dataInventori`);
      console.log(response.data);
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchDataTipeBarang = async () => {
    try {
      const response = await axios.get(`${backendUrl}/admin/daftarTipe`);
      console.log(response.data);
      setTypeData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    setemployeeId(getId);
    fetchDataTipeBarang();
    fetchDataInventori();
  }, [getId]);

  const optionsTipe = typeData.map(item => ({
    label: item.nama,
    value: item.id,
    berat: item.weight,
  }));

  const handleAutocompleteChange = (event, newValue) => {
    console.log(newValue);
    settipeBarang(newValue); // Mengatur nilai item yang dipilih
    if (newValue) {
      // Mengatur nilai TextField berdasarkan item yang dipilih
      setcustomWeight(newValue.berat.toString());
    } else {
      // Reset nilai TextField jika tidak ada yang dipilih
      setcustomWeight('');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setname('');
    settipeBarang('');
    setcustomWeight('');
    setcustomCapitalPrice('');
    setcustomDefaultPrice('');
    setFiles([]);
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
  
      if (files && files.length > 0) {
        Array.from(files).forEach(file => {
          formData.append('files', file.originalFile);
        });
      }
      console.log([...formData]);

      try {
        const response = await axios.post(`${backendUrl}/admin/tambahInventori`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response.data);
        setShowSuccess(true);
        setmsgSuccess("Berhasil Menambah Item Barang");
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
        fetchDataInventori();
        setErrors({});
        setname('');
        settipeBarang('');
        setcustomWeight('');
        setcustomCapitalPrice('');
        setcustomDefaultPrice('');
        setFiles([]);
      } catch (error) {
        setErrors(error.response);
        setShowError(true);
        setMsgError("Gagal Menambah Item Barang");
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }
      setOpen(false);
    } else {
      console.log("Validation failed");
    }
  };

  
  const handleOpenEdit = (row) => {
    console.log(row);
    setUpdatedId(row.id);
    setname(row.nama);
    settipeBarang(row.id);
    setcustomWeight(row.customWeight);
    setcustomCapitalPrice(row.customCapitalPrice);
    setcustomDefaultPrice(row.customDefaultPrice);
    setFiles(row.files);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setErrors({});
    setname('');
    settipeBarang('');
    setcustomWeight('');
    setcustomCapitalPrice('');
    setcustomDefaultPrice('');
  };

  const handleConfirmEdit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const typeId = tipeBarang.value;
        const formData = new FormData();
        formData.append('name', name);
        formData.append('id', updatedId);
        formData.append('typeId', typeId);
        formData.append('customWeight', customWeight);
        formData.append('customCapitalPrice', customCapitalPrice);
        formData.append('customDefaultPrice', customDefaultPrice);
    
        Array.from(files).forEach(file => {
          formData.append('files', file.originalFile);
        });
        console.log([...formData]);
        const response = await axios.post(`${backendUrl}/admin/editInventori`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response.data);
        setShowSuccess(true);
        setmsgSuccess("Berhasil Mengubah Data Barang");
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
        fetchDataInventori();
        setname('');
        settipeBarang('');
        setcustomWeight('');
        setcustomCapitalPrice('');
        setcustomDefaultPrice('');
      } catch (error) {
        setShowError(true);
        setMsgError("Gagal Mengubah Data Barang");
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
      // const id = updatedId;
      const response = await axios.delete(`${backendUrl}/admin/deleteInventori/${updatedId}`);
      console.log(response.data);
      fetchDataInventori();
      setShowSuccess(true);
      setmsgSuccess("Berhasil Hapus Data Barang");
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error(error);
      setMsgError("Gagal Hapus Data Barang");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
    setOpenDelete(false);
  };

  const columns = [
    {
      field: 'itemcode',
      headerName: 'Kode Barang',
      flex: 1,
      editable: true,
    },
    {
      field: 'nama',
      headerName: 'Nama Barang',
      flex: 1,
      editable: true,
    },
    {
      field: 'jenisBarang',
      headerName: 'Jenis Barang',
      flex: 1,
      editable: true,
    },
    {
      field: 'customWeight',
      headerName: 'Berat (g)',
      type: 'number',
      flex: 1,
      editable: true,
      valueFormatter: (weight) => `${weight} g`,
    },
    {
      field: 'customCapitalPrice',
      headerName: 'Harga Modal',
      type: 'number',
      flex: 1,
      editable: true,
      valueFormatter: (customCapitalPrice) => formatCurrency(customCapitalPrice),
    },
    {
      field: 'customDefaultPrice',
      headerName: 'Harga Jual',
      type: 'number',
      flex: 1,
      editable: true,
      valueFormatter: (customDefaultPrice) => formatCurrency(customDefaultPrice),
    },
    {
      field: 'lastupdate',
      headerName: 'Last Update',
      type: 'date',
      flex: 1,
      editable: true,
      valueGetter: (lastupdate) => {
        return lastupdate;
      },
      valueFormatter: (lastupdate) => {
        return dayjs(lastupdate).format('DD/MM/YYYY');
      }
    },
    {
      field: 'status',
      headerName: 'Status Barang',
      flex: 1,
      renderCell: (params) => {
        const { row } = params;
        return (
          <>
            {row.status === "available" && (
              <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: '#4caf50'}}>
                Available
              </Button>
            )}
            {row.status === "checkout" && (
              <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: '#757575' }}>
                Checkout
              </Button>
            )}
            {row.status === "payment" && (
              <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: '#d32f2f' }}>
                Payment
              </Button>
            )}
            {row.status === "sold" && (
              <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: 'darkgreen' }}>
                Sold
              </Button>
            )}
          </>
        );
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
            Review Stok
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
              components={{ Header: StyledHeader }}
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
                        <Typography>Nama Barang *</Typography>
                        <TextField
                          fullWidth
                          value={name}
                          error={!!errors.name}
                          helperText={errors.name}
                          FormHelperTextProps={{ sx: { color: 'red' } }}
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
                          helperText={errors.tipeBarang}
                          FormHelperTextProps={{ sx: { color: 'red' } }}
                          onChange={handleAutocompleteChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>Berat Barang (g) *</Typography>
                        <NumericFormat
                          fullWidth
                          autoComplete='off'
                          value={customWeight}
                          onValueChange={(values) => setcustomWeight(values.floatValue)}
                          thousandSeparator='.'
                          decimalSeparator=','
                          customInput={TextField}
                          error={!!errors.customWeight}
                          InputProps={{
                            endAdornment: <InputAdornment position="start">g</InputAdornment>,
                          }}
                          variant="outlined"
                        />
                        {!!errors.customWeight && (
                          <FormHelperText error sx={{ color: 'red' }}>
                            {errors.customWeight}
                          </FormHelperText>
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>Harga Modal Barang (Rp.) *</Typography>
                        <NumericFormat
                          fullWidth
                          autoComplete='off'
                          value={customCapitalPrice}
                          onValueChange={(values) => setcustomCapitalPrice(values.floatValue)}
                          thousandSeparator='.'
                          decimalSeparator=','
                          customInput={TextField}
                          error={!!errors.customCapitalPrice}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">Rp </InputAdornment>,
                          }}
                          variant="outlined"
                        />
                        {!!errors.customCapitalPrice && (
                          <FormHelperText error sx={{ color: 'red' }}>
                            {errors.customCapitalPrice}
                          </FormHelperText>
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>Harga Jual Barang (Rp.) *</Typography>
                        <NumericFormat
                          fullWidth
                          autoComplete='off'
                          value={customDefaultPrice}
                          onValueChange={(values) => setcustomDefaultPrice(values.floatValue)}
                          thousandSeparator='.'
                          decimalSeparator=','
                          customInput={TextField}
                          error={!!errors.customDefaultPrice}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">Rp </InputAdornment>,
                          }}
                          variant="outlined"
                        />
                        {!!errors.customDefaultPrice && (
                          <FormHelperText error sx={{ color: 'red' }}>
                            {errors.customDefaultPrice}
                          </FormHelperText>
                        )}
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
                        <Box mt={2} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                          {files.map((file, index) => (
                            <Box key={index} mb={2} mr={2}>
                              <Typography>{file.path}</Typography>
                              <img src={file.preview} alt={file.path} style={{ maxWidth: '70%', maxHeight: '100px' }} />
                            </Box>
                          ))}
                        </Box>
                        {showMsgImage && (
                          <Typography sx={{color: 'red'}}>
                            { msgImageError }
                          </Typography>
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
                      helperText={errors.name}
                      FormHelperTextProps={{ sx: { color: 'red' } }}
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
                      helperText={errors.tipeBarang}
                      FormHelperTextProps={{ sx: { color: 'red' } }}
                      onChange={handleAutocompleteChange} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>Berat Barang (g) *</Typography>
                    <NumericFormat
                      fullWidth
                      autoComplete='off'
                      value={customWeight}
                      onValueChange={(values) => setcustomWeight(values.floatValue)}
                      thousandSeparator='.'
                      decimalSeparator=','
                      customInput={TextField}
                      error={!!errors.customWeight}
                      InputProps={{
                        endAdornment: <InputAdornment position="start">g</InputAdornment>,
                      }}
                      variant="outlined"
                    />
                     {!!errors.customWeight && (
                      <FormHelperText error sx={{ color: 'red' }}>
                        {errors.customWeight}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Harga Modal Barang (Rp.) *</Typography>
                    <NumericFormat
                      fullWidth
                      autoComplete='off'
                      value={customCapitalPrice}
                      onValueChange={(values) => setcustomCapitalPrice(values.floatValue)}
                      thousandSeparator='.'
                      decimalSeparator=','
                      customInput={TextField}
                      error={!!errors.customCapitalPrice}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">Rp </InputAdornment>,
                      }}
                      variant="outlined"
                    />
                     {!!errors.customCapitalPrice && (
                      <FormHelperText error sx={{ color: 'red' }}>
                        {errors.customCapitalPrice}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Harga Jual Barang (Rp.) *</Typography>
                    <NumericFormat
                      fullWidth
                      autoComplete='off'
                      value={customDefaultPrice}
                      onValueChange={(values) => setcustomDefaultPrice(values.floatValue)}
                      thousandSeparator='.'
                      decimalSeparator=','
                      customInput={TextField}
                      error={!!errors.customDefaultPrice}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">Rp </InputAdornment>,
                      }}
                      variant="outlined"
                    />
                     {!!errors.customDefaultPrice && (
                      <FormHelperText error sx={{ color: 'red' }}>
                        {errors.customDefaultPrice}
                      </FormHelperText>
                    )}
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
                    {!showMsgImage && (
                      <Box mt={2} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        {files.map((file, index) => (
                          <Box key={index} mb={2} mr={2}>
                            <Typography>{file.path}</Typography>
                            <img src={file.preview} alt={file.path} style={{ maxWidth: '70%', maxHeight: '100px' }} />
                          </Box>
                        ))}
                      </Box>
                    )}
                    {showMsgImage && (
                      <Typography sx={{color: 'red'}}>
                        { msgImageError }
                      </Typography>
                    )}
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
