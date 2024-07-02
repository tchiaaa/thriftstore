import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styled from 'styled-components';
import { Alert, Autocomplete, Backdrop, Button, CssBaseline, Drawer, Grid, IconButton, Modal, TextField, Typography } from '@mui/material';
import AdminSidebar from './sidebar';
import { useSpring, animated } from '@react-spring/web';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from '../authContext';
import dayjs from 'dayjs';
import { DataGrid } from '@mui/x-data-grid';

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

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
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
};

export default function ReviewOrderDelivery() {
  const [rows, setRows] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [msgSuccess, setmsgSuccess] = useState('');
  const [showError, setShowError] = useState(false);
  const [msgError, setMsgError] = useState();
  const [updatedId, setUpdatedId] = useState('');
  const [checkoutdate, setcheckoutdate] = useState('');
  const [paymentdate, setpaymentdate] = useState('');
  const [packingdate, setpackingdate] = useState('');
  const [status, setstatus] = useState('');
  const [deliverypickupdate, setdeliverypickupdate] = useState('');
  const [deliverydonedate, setdeliverydonedate] = useState('');
  const listStatus = ['Payment Not Done', 'On Packing', 'On Pickup', 'On Delivery', 'Done'];
  const [openEdit, setOpenEdit] = useState(false);
  const handleCloseEdit = () => setOpenEdit(false);
  const [openDelete, setOpenDelete] = useState(false);
  const handleCloseDelete = () => setOpenDelete(false);
  const [openLogout, setOpenLogout] = useState(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);
  const { auth, logout } = useAuth();
  const getusername = auth.user ? auth.user.username : '';

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/admin/getAllOrders');
      console.log(response.data);
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenEdit = (row) => {
    console.log(row);
    setUpdatedId(row.id);
    setcheckoutdate(dayjs(row.checkoutdate, 'DD MMMM YYYY HH:mm').format('YYYY-MM-DDTHH:mm'));
    setpaymentdate(row.paymentdate ? dayjs(row.paymentdate, 'DD MMMM YYYY HH:mm').format('YYYY-MM-DDTHH:mm') : '');
    setpackingdate(row.packingdate ? dayjs(row.packingdate, 'DD MMMM YYYY HH:mm').format('YYYY-MM-DDTHH:mm') : '');
    setdeliverypickupdate(row.deliverypickupdate ? dayjs(row.deliverypickupdate, 'DD MMMM YYYY HH:mm').format('YYYY-MM-DDTHH:mm') : '');
    setdeliverydonedate(row.deliverydonedate ? dayjs(row.deliverydonedate, 'DD MMMM YYYY HH:mm').format('YYYY-MM-DDTHH:mm') : '');
    setstatus(row.status);
    setOpenEdit(true);
  };

  const handleConfirmEdit = async (e) => {
    e.preventDefault();
    const orderid = updatedId;
      try {
        const response = await axios.post('http://localhost:8080/admin/editOrderDelivery', { orderid, checkoutdate, paymentdate, packingdate, deliverypickupdate, deliverydonedate, status });
        console.log(response.data);
        setShowSuccess(true);
        setmsgSuccess("Berhasil Mengubah Order");
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
        fetchData();
      } catch (error) {
        setShowError(true);
        setMsgError("Gagal Mengubah Order");
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }
      setOpenEdit(false);
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
      const response = await axios.delete(`http://localhost:8080/admin/deleteOrderDelivery/${id}`);
      console.log(response.data);
      setShowSuccess(true);
      setmsgSuccess("Berhasil Hapus Order");
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      fetchData();
    } catch (error) {
      console.error(error);
      setMsgError("Gagal Hapus Order");
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
      field: 'orderid',
      headerName: 'Order ID',
      flex: 1,
      editable: true,
    },
    {
      field: 'namabarang',
      headerName: 'Nama Barang',
      flex: 1,
      editable: true,
    },
    {
      field: 'namapembeli',
      headerName: 'Nama Pembeli',
      flex: 1,
      editable: true,
    },
    {
      field: 'jenisbarang',
      headerName: 'Jenis Barang',
      type: 'number',
      flex: 1,
      editable: true,
    },
    {
      field: 'checkoutdate',
      headerName: 'Checkout Date',
      type: 'date',
      flex: 1,
      editable: true,
      valueGetter: (checkoutdate) => {
        return checkoutdate;
      },
      valueFormatter: (checkoutdate) => {
        return dayjs(checkoutdate).format('DD/MM/YYYY HH:mm');
      }
    },
    {
      field: 'paymentdate',
      headerName: 'Payment Date',
      type: 'date',
      flex: 1,
      editable: true,
      valueGetter: (paymentdate) => {
        return paymentdate ? paymentdate : '-';
      },
      valueFormatter: (paymentdate) => {
        return paymentdate !== '-' ? dayjs(paymentdate).format('DD/MM/YYYY HH:mm') : '-';
      }
    },
    {
      field: 'packingdate',
      headerName: 'Packing Date',
      type: 'date',
      flex: 1,
      editable: true,
      valueGetter: (packingdate) => {
        return packingdate ? packingdate : '-';
      },
      valueFormatter: (packingdate) => {
        return packingdate !== '-' ? dayjs(packingdate).format('DD/MM/YYYY HH:mm') : '-';
      }
    },
    {
      field: 'deliverypickupdate',
      headerName: 'Delivery Pickup Date',
      type: 'date',
      flex: 1,
      editable: true,
      valueGetter: (deliverypickupdate) => {
        return deliverypickupdate ? deliverypickupdate : '-';
      },
      valueFormatter: (deliverypickupdate) => {
        return deliverypickupdate !== '-' ? dayjs(deliverypickupdate).format('DD/MM/YYYY HH:mm') : '-';
      }
    },
    {
      field: 'deliverydonedate',
      headerName: 'Delivery Done Date',
      type: 'date',
      flex: 1,
      editable: true,
      valueGetter: (deliverydonedate) => {
        return deliverydonedate ? deliverydonedate : '-';
      },
      valueFormatter: (deliverydonedate) => {
        return deliverydonedate !== '-' ? dayjs(deliverydonedate).format('DD/MM/YYYY HH:mm') : '-';
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        const { row } = params;
        return (
          <>
          {row.status === "Payment Not Done" && (
            <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: 'red', textTransform: 'capitalize'}}>
              Payment Not Done
            </Button>
          )}
          {row.status === "On Packing" && (
            <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: 'orange', textTransform: 'capitalize'}}>
              On Packing
            </Button>
          )}
          {row.status === "On Pick Up" && (
            <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: 'brown', textTransform: 'capitalize'}}>
              On Pick Up
            </Button>
          )}
          {row.status === "On Delivery" && (
            <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: 'darkcyan', textTransform: 'capitalize'}}>
              On Delivery
            </Button>
          )}
          {row.status === "Done" && (
            <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: 'green', textTransform: 'capitalize'}}>
              Done
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
            Review Pemesanan & Pengiriman
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
              getRowId={(row) => row.orderid}
              disableRowSelectionOnClick
            />
          </Box>
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
                      <Typography>Checkout Date</Typography>
                      <TextField
                        fullWidth
                        type='datetime-local'
                        autoComplete='off'
                        value={checkoutdate}
                        onChange={(e) => setcheckoutdate(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>Payment Date</Typography>
                      <TextField
                        fullWidth
                        autoComplete='off'
                        type='datetime-local'
                        value={paymentdate}
                        onChange={(e) => setpaymentdate(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>Packing Date</Typography>
                      <TextField
                        fullWidth
                        autoComplete='off'
                        type='datetime-local'
                        value={packingdate}
                        onChange={(e) => setpackingdate(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>Delivery Pickup Date</Typography>
                      <TextField
                        fullWidth
                        autoComplete='off'
                        type='datetime-local'
                        value={deliverypickupdate}
                        onChange={(e) => setdeliverypickupdate(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>Delivery Done Date</Typography>
                      <TextField
                        fullWidth
                        autoComplete='off'
                        type='datetime-local'
                        value={deliverydonedate}
                        onChange={(e) => setdeliverydonedate(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>Status *</Typography>
                      <Autocomplete
                        fullWidth
                        value={status}
                        onChange={(event, newValue) => {
                          setstatus(newValue)
                        }}
                        options={listStatus}
                        renderInput={(params) => <TextField {...params} />}
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
        </RootContainer>
      </Box>
    </Box>
  );
}
