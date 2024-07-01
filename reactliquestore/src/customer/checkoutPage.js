import React, { useContext, useEffect, useState } from 'react';
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
import { Backdrop, Container, Fade, Grid, Modal, Button, TextField, Autocomplete, Alert, RadioGroup, FormControl, FormControlLabel, Radio } from '@mui/material';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import logoSmile from '../assets/smile.png'
import axios from 'axios';
import { useAuth } from '../authContext';
import { CreateOutlined } from '@mui/icons-material';
import Edit from '@mui/icons-material/Edit';
import logoToko from '../assets/logo_copy.png';

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
    marginLeft: '25vw',
    transform: 'rotate(-3deg)',
    display: 'inline-block',
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

const btnAddLocationStyle = {
  borderRadius: 5,
  padding: 10,
  boxShadow: 24,
  color: 'black',
  fontWeight: 'bold',
  backgroundColor: '#FE8A01',
  textTransform: 'none'
};

const btnNewAddress = {
  borderRadius: 5,
  padding: 10,
  boxShadow: 24,
  backgroundColor: 'white',
  color: '#FE8A01',
  fontWeight: 'bold',
  border: '1px solid #FE8A01',
  textTransform: 'none'
};

const btnPaymentStyle = {
  borderRadius: '10px',
  width: '20vw',
  backgroundColor: '#FE8A01',
  color: 'black',
  border: '1px solid black',
  padding: 5,
  marginRight: 25,
  textTransform: 'none'
};

const btnBackStyle = {
  borderRadius: '10px',
  color: 'white',
  width: '10vw',
  backgroundColor: 'black',
  border: '1px solid white',
  padding: 5,
  textTransform: 'none'
};

const styleModal = {
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
  borderRadius: 5,
  textAlign: 'center',
  overflowY: 'auto'
};

const styleModalLogout = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
  textAlign: 'center',
  overflowY: 'auto'
};

const styleModalAddLocation = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: 5,
  p: 4,
  overflowY: 'auto'
};

export default function CheckoutPage() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedData, setSelectedData] = useState(null);
  const [DataCust, setDataCust] = useState([]);
  const [DataOrder, setDataOrder] = useState([]);
  const [AddressData, setAddressData] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cost, setCost] = useState(null);
  const [weight, setWeight] = useState(0); // example weight in grams
  const [originCityId, setOriginCityId] = useState(152); // example: Jakarta
  const [IdAddress, setIdAddress] = useState('');
  const [addressName, setaddressName] = useState('');
  const [address, setaddress] = useState('');
  const [city, setcity] = useState('');
  const [state, setstate] = useState('');
  const [country, setcountry] = useState('');
  const [zipcode, setzipcode] = useState('');
  const [note, setnote] = useState('');
  const [errors, setErrors] = useState('');
  const [openAddress, setOpenAddress] = useState(false);
  const [OpenAddLocation, setopenAddLocation] = useState(false);
  const handleCloseAddress = () => setOpenAddress(false);
  const handleCloseAddLocation = () => setopenAddLocation(false);
  const [selectedShippingCost, setSelectedShippingCost] = useState(null);
  const [selectedShippingIndex, setSelectedShippingIndex] = useState(-1);
  const [selectedShippingCostValue, setSelectedShippingCostValue] = useState(0);
  const [productDeliveryPrice, setProductDeliveryPrice] = useState(0);
  const [ShowSuccess, setShowSuccess] = useState(false);
  const [MsgSuccess, setMsgSuccess] = useState('');
  const [showError, setShowError] = useState(false);
  const [msgError, setMsgError] = useState();
  const [openLogout, setOpenLogout] = useState(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);
  const { auth, logout } = useAuth();
  const getUsername = auth.user ? auth.user.username : '';
  const getId = auth.user ? auth.user.id : '';
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const storedOrderId = localStorage.getItem('orderid');

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

  // Validasi Nama
  if (!addressName) {
    tempErrors.addressName = 'Nama address harus diisi';
  } else if (addressName.length > 25){
    tempErrors.addressName = 'Nama address maksimal 25 karakter'
  }

  // Validasi Varian
  if (!address) {
    tempErrors.address = 'address harus diisi';
  } else if (address.length > 255){
    tempErrors.address = 'address maksimal 255 karakter'
  }

  // Validasi Weight
  if (!selectedCity) {
    tempErrors.city = 'Kota harus diisi';
  }

  // Validasi Capital Price
  if (!selectedProvince) {
    tempErrors.state = 'Provinsi harus diisi';
  }

  if (!zipcode) {
    tempErrors.zipcode = 'zipcode harus diisi';
  } else if (zipcode.length > 6) { // contoh panjang maksimal 6 karakter
    tempErrors.zipcode = 'zipcode maksimal 6 karakter';
  }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const fetchProvinces = () => {
    axios.get('http://localhost:8080/customer/api/rajaongkir/provinces')
      .then(response => {
        setProvinces(response.data.rajaongkir.results);
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  };

  const fetchCities = (provinceId) => {
    console.log(provinceId);
    axios.get(`http://localhost:8080/customer/api/rajaongkir/cities/${provinceId}`)
      .then(response => {
        setCities(response.data.rajaongkir.results);
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the cities!', error);
      });
  };

  const calculateShippingCost = () => {
    axios.get(`http://localhost:8080/customer/api/rajaongkir/cost?origin=${originCityId}&destination=${selectedCity}&weight=${weight}`)
      .then(response => {
        setCost(response.data.rajaongkir.results);
      })
      .catch(error => {
        console.error('There was an error calculating the shipping cost!', error);
      });
  };

  useEffect(() => {
    // Load Snap.js script
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', 'YOUR_CLIENT_KEY'); // Replace with your client key
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchDataCust = async () => {
    if (getId !== '') {
      try {
        const response = await axios.get(`http://localhost:8080/customer/getCustData?id=${getId}`);
        console.log(response.data);
        setDataCust(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  const fetchDataOrder = async () => {
    if (getId !== '') {
      try {
        const response = await axios.get(`http://localhost:8080/customer/getOrderData?id=${storedOrderId}`);
        console.log(response.data);
        setDataOrder(response.data);
        setWeight(response.data.totalWeight);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  const fetchDataAddress = async () => {
    if (getId !== '') {
      try {
        const response = await axios.get(`http://localhost:8080/customer/getAddressData?id=${getId}`);
        console.log(response.data);
        setAddressData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  useEffect(() => {
    fetchDataCust();
    fetchDataOrder();
    fetchDataAddress();
    if (selectedProvince) {
      console.log(selectedProvince);
      fetchCities(selectedProvince.province_id);
    }
  }, [selectedProvince]);

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

  const handleOpenAddress = () => {
    setOpenAddress(true);
  };

  const handleOpenAddLocation = () => {
    fetchProvinces();
    setopenAddLocation(true);
    setOpenAddress(false);
  };
  
  const handleOpenEdit = (row) => {
    fetchProvinces();
    setIdAddress(row.id);
    setaddress(row.addressdetail);
    setaddressName(row.addressname);
    setSelectedCity(row.selectedCity);
    setSelectedProvince(row.selectedProvince);
    setcountry(row.country);
    setzipcode(row.zipcode);
    setnote(row.note);
    setopenAddLocation(true);
  };

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
    console.log(selectedValue);
  };

  const handleSaveAddress = () => {
    const selected = AddressData.find(option => option.id === parseInt(selectedValue));
    console.log(selected);
    setSelectedData(selected);
    setSelectedCity(selected.cityid);
    if (originCityId && selectedCity && weight) {
      calculateShippingCost();
    } else {
      console.error('One or more parameters (originCityId, selectedCity, weight) are missing or invalid.');
    }
    setOpenAddress(false);
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const formData = new FormData();
        formData.append('id', IdAddress ? parseInt(IdAddress, 10) : '');
        formData.append('addressname', addressName);
        formData.append('addressdetail', address);
        formData.append('cityId', selectedCity ? selectedCity.city_id : '');
        formData.append('city', selectedCity ? selectedCity.city_name : '');
        formData.append('state', selectedProvince ? selectedProvince.province : '');
        formData.append('country', country);
        formData.append('zipcode', zipcode);
        formData.append('note', note);
        formData.append('customerid', getId);

        console.log([...formData]);
        const response = await axios.post('http://localhost:8080/customer/tambahAddress', formData);
        console.log(response.data);
        setopenAddLocation(false);
        setOpenAddress(false);
        setShowSuccess(true);
        setMsgSuccess(response.data);
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
        fetchDataAddress();
        setaddressName('');
        setaddress('');
        setcity('');
        setstate('');
        setcountry('');
        setnote('');
      } catch (error) {
        setErrors(error.response);
        setShowError(true);
        setMsgError("Gagal Menambah Address");
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }
    } else {
      console.log("Validation failed");
    }
  };

  const handleSelectShippingCost = (selectedCost, index) => {
    setSelectedShippingCost(selectedCost);
    setSelectedShippingIndex(index);
  };


  useEffect(() => {
    // Contoh: menghitung total price berdasarkan DataOrder dan selectedShippingCost
    const calculateTotalPrice = () => {
      let totalPrice = parseInt(DataOrder.totalPrice) + 2000;
      if (selectedShippingCost) {
        totalPrice += parseInt(selectedShippingCost.cost[0].value);
        setSelectedShippingCostValue(selectedShippingCost.cost[0].value);
      }
  
      setProductDeliveryPrice(totalPrice);
    };
  
    calculateTotalPrice();
  }, [DataOrder, selectedShippingCost]);

  const handlePayment = async () => {
    console.log(getId);
    if (getId === ''){
      setShowError(true);
      setMsgError("login terlebih dahulu");
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
    else if (selectedData == null) {
      setShowError(true);
      setMsgError("Pilih alamat terlebih dahulu");
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
    else{
      const formData = new FormData();
      formData.append('masterorderid', DataOrder.listTempOrder[0].masterorderid);
      formData.append('totalprice', productDeliveryPrice);
      formData.append('customerid', getId);
      formData.append('address', selectedData.addressdetail);
      formData.append('city', selectedData.city);
      formData.append('zipcode', selectedData.zipcode);
      formData.append('weight', weight);
      formData.append('deliveryprice', selectedShippingCostValue);

      console.log([...formData])
      try {
        const response = await axios.post('http://localhost:8080/customer/api/payment', formData);
        const token = response.data.token;
        console.log(token);
  
        if (window.snap && window.snap.pay) {
          window.snap.pay(token, {
            onSuccess: function(result) {
              console.log("Payment success!", result);
            },
            onPending: function(result) {
              console.log("Waiting for payment!", result);
            },
            onError: function(result) {
              console.log("Payment failed!", result);
            },
            onClose: function() {
              console.log("You closed the popup without finishing the payment");
              // Additional precaution to prevent any navigation:
              window.history.pushState(null, '', window.location.href);
            },
          });
        } else {
          console.error('Snap.js failed to load or is not properly initialized');
        }
      } catch (error) {
        console.error('Payment error: ', error);
      }
    }
  };

  const handleBack = async (e) => {
    e.preventDefault();
  };

  const handleLogout = () => {
    setOpenLogout(false);
    logout();
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
        <Grid container alignItems="center">
          <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Type any products here..."
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <img src={logoToko} alt="Lique Store Logo" style={{ width: 200 }} />
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ color: 'black', paddingRight: 2 }}>Your Cart</Typography>
              <Button style={{ color: 'black' }} onClick={handleOpenLogout} startIcon={<AccountCircle />}>
                {getUsername}
              </Button>
              <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                open={openLogout}
                onClose={handleCloseLogout}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <Fade in={openLogout}>
                  <Box sx={styleModalLogout}>
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
                    {/* Isi modal logout */}
                </Fade>
              </Modal>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
                sx={{ display: { xs: 'flex', md: 'none' } }}
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
   
    <Container component="main">
      {ShowSuccess && (
        <Alert variant="filled" severity="success" style={{ marginTop: 20 }}>
          { MsgSuccess }
        </Alert>
      )}
      {showError && (
        <Alert variant="filled" severity="error" style={{ marginTop: 20 }}>
          { msgError }
        </Alert>
      )}
      <Box sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: '10px 10px 5px gray', backgroundColor: 'black', height: 'auto'}}>
        <Grid container spacing={0}>
          <Grid item xs={12} sx={{ position: 'relative' }}>
            <Box sx={{ backgroundColor: '#FE8A01', height: 'auto', padding: 5 }}>
              <Typography variant='h3' fontWeight={'bolder'}>
                Checkout
              </Typography>
            </Box>
            <img src={logoToko} alt="Lique Store" style={{ width: 500, position: 'absolute', top: 60, zIndex: 1 }} />
          </Grid>
          <Grid item xs={12} marginTop={10}>
            <Box sx={{padding: 2}}>
              <Box sx={{ padding: 2, margin: 4, backgroundColor: '#FE8A01', borderRadius: 3, cursor: 'pointer' }} onClick={handleOpenAddress}>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography>Deliver to</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    {selectedData ? (
                      <>
                        <Typography variant='h5'>
                          {selectedData.addressname} - {selectedData.customer.username}
                        </Typography>
                        <Typography>{selectedData.addressdetail}</Typography>
                      </>
                    ) : (
                      <>
                        <Typography variant='h5'>
                          You haven't added any address yet
                        </Typography>
                        <Typography>
                          Add your shipping address to continue
                        </Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Box>
              <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                open={openAddress}
                onClose={handleCloseAddress}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                  backdrop: {
                    TransitionComponent: Fade,
                  },
                }}
                >
                <Fade in={openAddress}>
                  <Box sx={styleModal}>
                  {AddressData.length > 0 ? (
                    <>
                    <RadioGroup value={selectedValue} onChange={handleRadioChange}>
                      {AddressData.map((row, index) => (
                        <Box key={index} sx={{ backgroundColor: 'black', color: 'white', borderRadius: 10, padding: 5, marginTop: 2, marginBottom: 2 }}>
                          <Grid container spacing={2} textAlign={'left'}>
                            <Grid item xs={7} textAlign={'left'}>
                              <Typography variant='h4' color={'#FE8A01'}>
                                {row.addressname} - {row.customer.username}
                              </Typography>
                            </Grid>
                            <Grid item xs={7}>
                              <Typography component='h6'>
                                {row.customer.phonenumber}
                              </Typography>
                            </Grid>
                            <Grid item xs={7}>
                              <Typography component='h6'>
                                {row.addressdetail}
                              </Typography>
                            </Grid>
                            <Grid item xs={7}>
                              <Typography component='h6'>
                                {row.city}, {row.state}, {row.zipcode}
                              </Typography>
                            </Grid>
                            <Grid item xs={5} textAlign={'right'}>
                              <IconButton onClick={() => handleOpenEdit(row)}>
                                <Edit />
                              </IconButton>
                              <CreateOutlined />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <FormControlLabel
                                value={row.id.toString()}
                                control={<Radio sx={{ color: 'white' }} />}
                                sx={{marginBottom: 2}}
                              />
                            </Grid>
                            <Grid item xs={7}>
                              <Typography component='h6'>
                                {row.country}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                      </RadioGroup>
                      <Box>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Button variant="contained" onClick={handleSaveAddress} disabled={!selectedValue} style={btnAddLocationStyle}>
                              Save Address
                            </Button>
                          </Grid>
                          <Grid item xs={6}>
                            <Button variant="contained" onClick={handleOpenAddLocation} style={btnNewAddress}>
                              New Address
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </>
                    ) : (
                      <Box>
                        <img src={logoSmile} alt="Smile Logo" width={100} />
                        <Typography id="spring-modal-title" variant="h6" component="h3">
                          You haven't added any address yet.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Button variant="contained" onClick={handleOpenAddLocation} style={btnAddLocationStyle}>
                            Add Your Location
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Fade>
              </Modal>
              <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                open={OpenAddLocation}
                onClose={handleCloseAddLocation}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                  backdrop: {
                    TransitionComponent: Fade,
                  },
                }}
              >
                <Fade in={OpenAddLocation}>
                  <Box sx={styleModalAddLocation}>
                  <form>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography>Save Address As *</Typography>
                        <TextField
                          fullWidth
                          autoComplete='off'
                          value={addressName}
                          error={!!errors.addressName}
                          helperText={errors.addressName}
                          FormHelperTextProps={{ sx: { color: 'red' } }}
                          onChange={(e) => setaddressName(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>Address *</Typography>
                        <TextField
                          fullWidth
                          autoComplete='off'
                          value={address}
                          error={!!errors.address}
                          helperText={errors.address}
                          FormHelperTextProps={{ sx: { color: 'red' } }}
                          onChange={(e) => setaddress(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>State / Province *</Typography>
                        <Autocomplete
                          options={provinces}
                          getOptionLabel={(option) => option.province}
                          value={selectedProvince}
                          onChange={(event, newValue) => {
                            console.log('Selected Province:', newValue);
                            setSelectedProvince(newValue);
                            // Lakukan tindakan tambahan di sini setelah mengatur selectedProvince
                          }}
                          helperText={errors.selectedProvince}
                          FormHelperTextProps={{ sx: { color: 'red' } }}
                          renderInput={(params) => <TextField {...params} margin="normal" fullWidth />}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>City *</Typography>
                        <Autocomplete
                          options={cities}
                          getOptionLabel={(option) => option.city_name}
                          value={selectedCity}
                          onChange={(event, newValue) => setSelectedCity(newValue)}
                          helperText={errors.selectedCity}
                          FormHelperTextProps={{ sx: { color: 'red' } }}
                          renderInput={(params) => <TextField {...params} margin="normal" fullWidth />}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>Zip Code *</Typography>
                        <TextField
                          fullWidth
                          type='number'
                          value={zipcode}
                          error={!!errors.zipcode}
                          helperText={errors.zipcode}
                          FormHelperTextProps={{ sx: { color: 'red' } }}
                          onChange={(e) => setzipcode(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>Note</Typography>
                        <TextField
                          id="outlined-multiline-static"
                          multiline
                          fullWidth
                          rows={4}
                          value={note}
                          error={!!errors.note}
                          onChange={(e) => setnote(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button variant="contained" onClick={handleSubmitAddress} fullWidth style={{ backgroundColor: 'black', color: 'white' }}>
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                  </Box>
                </Fade>
              </Modal>
              <Box sx={{padding: 2, margin: 4, color: 'white'}}>
                <Typography variant="h4">Payment Summary</Typography>
                <Grid container spacing={3} marginTop={3}>
                    <Grid item xs={6}>
                        <Typography variant="h5">Product price</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5" style={{textAlign: 'right'}}>{formatCurrency(DataOrder.totalPrice)}</Typography>
                    </Grid>
                    {cost ? (
                      <Grid item xs={12}>
                        <Box marginY={2}>
                          <Typography variant="h5">Shipping Cost</Typography>
                          {cost.map((result, index) => (
                            <Box key={index} marginY={1}>
                              <Typography variant="h6">{result.name}</Typography>
                              {result.costs.map((costDetail, idx) => (
                                <Box
                                  key={idx}
                                  padding={1}
                                  border={1}
                                  borderRadius={2}
                                  marginY={1}
                                  style={{ 
                                    cursor: 'pointer', 
                                    backgroundColor: selectedShippingIndex === idx ? '#f0f0f0' : 'transparent',
                                    color: selectedShippingIndex === idx ? 'black' : 'white'
                                  }}
                                  onClick={() => handleSelectShippingCost(costDetail, idx)}
                                >
                                  <Typography>Service: {costDetail.service}</Typography>
                                  <Typography>Description: {costDetail.description}</Typography>
                                  <Typography>Cost: {costDetail.cost[0].value}</Typography>
                                  <Typography>ETD: {costDetail.cost[0].etd} hari</Typography>
                                </Box>
                              ))}
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    ) : (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="h5">Shipping Cost</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="h5" style={{ textAlign: 'right' }}>No shipping cost calculated</Typography>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={6}>
                      <Typography variant="h5">Admin fee</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h5" style={{textAlign: 'right'}}>Rp 2.000,00</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5" fontWeight={'bolder'}>Total</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5" style={{textAlign: 'right', fontWeight: 'bolder'}}>{formatCurrency(productDeliveryPrice)}</Typography>
                    </Grid>
                    <Grid item xs={12} display={'flex'} justifyContent={'flex-end'}>
                      <Button style={btnPaymentStyle} onClick={handlePayment}>Choose Payment</Button>
                      <Button style={btnBackStyle} onClick={handleBack}>Back</Button>
                    </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
    </>
  );
}