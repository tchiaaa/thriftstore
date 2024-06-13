import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Container, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logoBCA from '../assets/bca.png';
import logoShopeePay from '../assets/shopeepay.png';
import logoQRIS from '../assets/qris.png';
import logoOVO from '../assets/ovo.png';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(3),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(2),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'black'
}));

const liqueText = {
    backgroundColor: 'black',
    width: 'auto',
    textAlign: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: '25vw'
}

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'black',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const btnCancelStyle = {
    borderRadius: '10px',
    width: '5vw',
    backgroundColor: 'black',
    color: 'white',
    marginLeft: 'auto',
    padding: 12
  };

export default function PaymentPage() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const navigate = useNavigate('');

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  
  const handleCancel = async (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      style={{backgroundColor: '#FE8A01'}}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{backgroundColor: '#FE8A01'}}>
        <Toolbar>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Type any products here..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Typography
            variant="h6"
            noWrap
            component="div"
            style={liqueText}
          >
            LIQUE STORE
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Typography style={{color: 'black', paddingRight: 20}}>Your Cart</Typography>
            <Typography style={{color: 'black', paddingRight: 20}}>Login</Typography>
            <Typography style={{color: 'black', paddingRight: 20}}>Register</Typography>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>

    <Container component="main">
      <Box sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: '10px 10px 5px gray', height: 'auto'}}>
        <Box sx={{display: 'flex', backgroundColor: '#FE8A01', borderRadius: 3, padding: 5}}>
            <Typography variant='h5'>
                Select Payment Method
            </Typography>
            <Button onClick={handleCancel} style={btnCancelStyle}>Cancel</Button>
        </Box>
        <Box sx={{padding: 10, borderRadius: 3}}>
          <Grid container spacing={3}>
            <Grid item xs={6} style={{display: 'flex', border: '1px solid black', borderRadius: 10, padding: 35, boxSizing: 'border-box', alignItems: 'center'}}>
              <Typography style={{color: 'black', fontSize: 25}}>BCA Virtual Account</Typography>
              <img src={logoBCA} alt="BCA Logo" style={{ marginLeft: 'auto', width: 150 }} />
            </Grid>
            <Grid item xs={6} style={{display: 'flex', border: '1px solid black', borderRadius: 10, padding: 35, boxSizing: 'border-box', alignItems: 'center'}}>
              <Typography style={{color: 'black', fontSize: 25}}>Shopee Pay Later</Typography>
              <img src={logoShopeePay} alt="ShopeePay Logo" style={{ marginLeft: 'auto', width: 150 }} />
            </Grid>
            <Grid item xs={6} style={{display: 'flex', border: '1px solid black', borderRadius: 10, padding: 35, boxSizing: 'border-box', alignItems: 'center'}}>
              <Typography style={{color: 'black', fontSize: 25}}>QRIS</Typography>
              <img src={logoQRIS} alt="QRIS Logo" style={{ marginLeft: 'auto', width: 150 }} />
            </Grid>
            <Grid item xs={6} style={{display: 'flex', border: '1px solid black', borderRadius: 10, padding: 35, boxSizing: 'border-box', alignItems: 'center'}}>
              <Typography style={{color: 'black', fontSize: 25}}>OVO</Typography>
              <img src={logoOVO} alt="OVO Logo" style={{ marginLeft: 'auto', width: 150 }} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
    </>
  );
}
