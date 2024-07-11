import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import axios from 'axios';
import styled from 'styled-components';
import { Alert, Backdrop, Button, Checkbox, CssBaseline, Drawer, Modal, Typography } from '@mui/material';
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

export default function Pengiriman() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [rows, setRows] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState();
  const [showError, setShowError] = useState(false);
  const [msgError, setMsgError] = useState();
  const [openLogout, setOpenLogout] = useState(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);
  const { auth, logout } = useAuth();
  const getusername = auth.user ? auth.user.username : '';

  const fetchData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/admin/dataOrder`);
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

  const handlePackingdateChange = async (rowId) => {
    try {
      const response = await axios.post(`${backendUrl}/admin/updatePackingdate?rowId=${rowId}`);
      console.log(response.data);
      fetchData();
      setShowSuccess(true);
      setMsgSuccess("Berhasil melakukan update packing date");
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      setShowError(true);
      setMsgError("Gagal melakukan update packing date");
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  const handleDeliverydateChange = async (rowId) => {
    // Fetch the row data to check packingdate
    const row = rows.find(row => row.id === rowId);
    if (!row || row.packingdate === null) {
      // Show error message because packingdate is null
      setShowError(true);
      setMsgError("Packing harus diisi terlebih dahulu sebelum dapat mengatur delivery");
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      return;
    }
    try {
      const response = await axios.post(`${backendUrl}/admin/updateDeliverydate?rowId=${rowId}`);
      console.log(response.data);
      fetchData();
      setShowSuccess(true);
      setMsgSuccess("Berhasil melakukan update delivery date");
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      setShowError(true);
      setMsgError("Gagal melakukan update delivery date");
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Kode Pemesanan',
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
      field: 'namacust',
      headerName: 'Nama Customer',
      flex: 1,
      editable: true,
    },
    {
      field: 'checkoutdate',
      headerName: 'Tanggal Checkout',
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
      field: 'packingdate',
      headerName: 'Packing',
      flex: 1,
      renderCell: (params) => (
        <Checkbox
          checked={params.row.packingdate !== null}
          onChange={() => handlePackingdateChange(params.row.id)}
          disabled={params.row.packingdate !== null}
        />
      ),
    },
    {
      field: 'deliverydate',
      headerName: 'Delivery',
      flex: 1,
      renderCell: (params) => (
        <Checkbox
          checked={params.row.deliverypickupdate !== null}
          onChange={() => handleDeliverydateChange(params.row.id)}
          disabled={params.row.deliverypickupdate !== null}
        />
      ),
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
        <br></br>
        <Toolbar />
        <RootContainer>
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
          <Typography variant='h3' marginBottom={5}>
            Pengiriman
          </Typography>
          <Box sx={{ width: '100%' }}>
            {/* <TextField
              label="Search"
              value={searchTerm}
              onChange={handleSearch}
              margin="normal"
            /> */}
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
          </Box>
        </RootContainer>
      </Box>
    </Box>
  );
}
