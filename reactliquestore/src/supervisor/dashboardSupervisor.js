import React, { useContext, useEffect, useState } from 'react';
import { Alert, Backdrop, Box, Button, Container, CssBaseline, Drawer, Fade, Modal, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SupervisorSidebar from './sidebar';
import { AccountCircle } from '@mui/icons-material';
import { EmployeeContext } from '../employeeContext';

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

const formatDate = (date) => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

const DashboardSupervisor = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [time, setTime] = useState(new Date());
  const [message, setMessage] = useState('');
  const now = new Date();
  const formattedDate = formatDate(now);
  const [openLogout, setOpenLogout] = useState(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);
  const { employeeData } = useContext(EmployeeContext);
  const { clearEmployeeData } = useContext(EmployeeContext);

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    const storedMessage = localStorage.getItem('berhasilClockIn');
    if (storedMessage) {
      setShowSuccess(true);
      setMessage(storedMessage);
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      localStorage.removeItem('berhasilClockIn')
    }
    return () => {
      clearInterval(timerID);
    };
  }, []);
  const tick = () => {
    setTime(new Date());
  };
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  const handleClick = () => {
    // Pindah ke halaman yang diinginkan
    navigate('/supervisor/karyawan/presensi/passcode');
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
                <Button variant="outlined" onClick={handleCloseLogout} sx={{ ml: 2, backgroundColor: 'orange', color: 'white' }}>
                  Tidak
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
        <Toolbar />
        <center><Container>
          {showSuccess && (
            <Alert variant="filled" severity="success" style={{ marginTop: 20 }}>
              { message }
            </Alert>
          )}
          <Typography fontSize={30} paddingTop={20}>{formattedDate}</Typography>
          <Typography fontSize={100}>{`${hours}:${minutes}`}</Typography>
          <form sx={{ width: '100%' }}>
              <Button type="submit" color="inherit" style={{ backgroundColor: 'black', color: 'white', margin: '3vw', width: '10vw' }}onClick={handleClick}>Clock In</Button>
              <Button type="submit" color="inherit" style={{ backgroundColor: 'black', color: 'white', margin: '3vw', width: '10vw' }}onClick={handleClick}>Clock Out</Button>
          </form>
        </Container></center>
      </Box>
    </Box>
  );
};

export default DashboardSupervisor;
