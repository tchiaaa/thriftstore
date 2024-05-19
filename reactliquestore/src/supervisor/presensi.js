import { useState } from 'react';
import { styled } from 'styled-components';
import { Alert, Box, Button, CssBaseline, Drawer, Grid, Toolbar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SupervisorSidebar from './sidebar';

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const buttonStyle = {
  marginTop: '10px',
  width: '70px',
  height: '70px',
  color: 'black',
  border: '1px solid black',
  borderRadius: "50%",
  fontSize: "20px"
};

const buttonStyleBackspace = {
  marginTop: '10px',
  width: '70px',
  height: '70px',
  color: 'black',
  borderRadius: "50%",
  fontSize: "20px"
};

const CircleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Circle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => (props.filled ? 'black' : 'white')};
  border: 1px solid black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin: 5px;
`;

const Presensi = () => {
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState('');
  const [digitCount, setDigitCount] = useState(0);
  const [showCircles, setShowCircles] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState();
  const [msgError, setMsgError] = useState();

  const handleNumberClick = async (number) => {
    if (!showCircles) setShowCircles(true);
    console.log(digitCount);
    if (digitCount < 4) {
      setPasscode(passcode + number);
      setDigitCount(prevCount => prevCount + 1);
    }
    else {
      try {
        const response = await axios.post('http://localhost:8080/passcode', { passcode });
        console.log(response.data);
        setMsgSuccess(response.data.message);
        setShowSuccess(true);
        localStorage.setItem('berhasilClockIn', response.data.message);
        redirectBack();
      } catch (error) {
        setMsgError(error.response.data.message);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }
      setDigitCount(0);
      setPasscode('');
    }
  };

  const handleBackspaceClick = () => {
    if (passcode.length > 0) {
      setPasscode(passcode.slice(0, -1));
      setDigitCount(prevCount => prevCount - 1);
    }
  };

  const redirectBack = () => {
    navigate('/supervisor/karyawan/presensi');
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
        <center><RootContainer>
          {showSuccess && (
            <Alert variant="filled" severity="success" style={{ marginTop: 20 }}>
              { msgSuccess }
            </Alert>
          )}
          {showError && (
            <Alert variant="filled" severity="error" style={{ marginTop: 20 }}>
              { msgError }
            </Alert>
          )}
          {!showCircles && <Title>Enter passcode</Title>}
          {showCircles && (
            <CircleContainer>
              {[...Array(4)].map((_, index) => (
                <Circle key={index} filled={index < digitCount}>
                  {/* {index < digitCount ? passcode[index] : ''} */}
                </Circle>
              ))}
            </CircleContainer>
          )}
          <InputContainer>
            <Grid container>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
                <Grid item xs={4} key={number}>
                  <Button style={buttonStyle} onClick={() => handleNumberClick(number)}>{number}</Button>
                </Grid>
              ))}
              <Grid item xs={4}>
                <Button style={buttonStyleBackspace} onClick={handleBackspaceClick}>←</Button>
              </Grid>
            </Grid>
          </InputContainer>
        </RootContainer></center>
      </Box>
    </Box>
  );
};

export default Presensi;
