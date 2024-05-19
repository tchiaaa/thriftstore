import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Container, CssBaseline, Drawer, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SupervisorSidebar from './sidebar';

const DashboardSupervisor = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [time, setTime] = useState(new Date());
  const [message, setMessage] = useState('');

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
        <Toolbar />
        <center><Container>
          {showSuccess && (
            <Alert variant="filled" severity="success" style={{ marginTop: 20 }}>
              { message }
            </Alert>
          )}
          <Typography fontSize={100} paddingTop={20}>{`${hours}:${minutes}`}</Typography>
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
