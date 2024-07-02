import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import axios from 'axios';
import styled from 'styled-components';
import { Backdrop, Button, CssBaseline, Drawer, Modal, Typography } from '@mui/material';
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

export default function ReviewOrderDelivery() {
  const [rows, setRows] = useState([]);
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
        return dayjs(checkoutdate).format('DD/MM/YYYY');
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
        </RootContainer>
      </Box>
    </Box>
  );
}
