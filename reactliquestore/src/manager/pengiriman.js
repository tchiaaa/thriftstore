import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import styled from 'styled-components';
import { Alert, Backdrop, Button, Checkbox, CssBaseline, Drawer, Modal, TextField, Typography } from '@mui/material';
import AdminSidebar from './sidebar';
import { useSpring, animated } from '@react-spring/web';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from '../authContext';

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'orderID', numeric: false, disablePadding: false, label: 'Order ID' },
  { id: 'namaBarang', numeric: false, disablePadding: false, label: 'Nama Barang' },
  { id: 'namaCust', numeric: false, disablePadding: false, label: 'Nama Customer' },
  { id: 'orderDate', numeric: false, disablePadding: false, label: 'Order Date' },
  { id: 'packing', numeric: false, disablePadding: false, label: 'Packing' },
  { id: 'delivery', numeric: false, disablePadding: false, label: 'Delivery' },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            // align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
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

export default function Pengiriman() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows);
  const [showSuccess, setShowSuccess] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState();
  const [showError, setShowError] = useState(false);
  const [msgError, setMsgError] = useState();
  const [openLogout, setOpenLogout] = useState(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);
  const { auth, logout } = useAuth();
  const getFullname = auth.user ? auth.user.fullname : '';

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/manager/dataOrder');
      console.log(response.data);
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter(row =>
        row.orderid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.namabarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.namacust.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.checkoutdate.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRows(filtered);
    }
  }, [searchTerm, rows]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(filteredRows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, filteredRows],
  );

  const handleLogout = () => {
    setOpenLogout(false);
    logout();
  };

  const handlePackingdateChange = async (rowId) => {
    console.log();
    try {
      const response = await axios.post(`http://localhost:8080/manager/updatePackingdate?rowId=${rowId}`);
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
    try {
      const response = await axios.post(`http://localhost:8080/manager/updateDeliverydate?rowId=${rowId}`);
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
          {getFullname}
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
            <Alert variant="filled" severity="success" style={{ marginTop: 20 }}>
              { msgSuccess }
            </Alert>
          )}
          {showError && (
            <Alert variant="filled" severity="danger" style={{ marginTop: 20 }}>
              { msgError }
            </Alert>
          )}
          <Box sx={{ width: '100%' }}>
            <TextField
              label="Search"
              value={searchTerm}
              onChange={handleSearch}
              margin="normal"
            />
            <Paper sx={{ width: '100%', mb: 2 }}>
              <TableContainer>
                  <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  >
                  <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={rows.length}
                  />
                  <TableBody>
                      {visibleRows.map((row) => {
                      return (
                        <TableRow
                        hover
                        tabIndex={-1}
                        key={row.id}
                        sx={{ cursor: 'pointer' }}
                        >
                          <TableCell align="center">{row.orderid}</TableCell>
                          <TableCell align="center">{row.namabarang}</TableCell>
                          <TableCell align="center">{row.namacust}</TableCell>
                          <TableCell align="center">{row.checkoutdate}</TableCell>
                          <TableCell align="center">
                            <Checkbox checked={row.packingdate !== null} onChange={() => handlePackingdateChange(row.id)} />
                          </TableCell>
                          <TableCell align="center">
                            <Checkbox checked={row.deliverypickupdate !== null} onChange={() => handleDeliverydateChange(row.id)} />
                          </TableCell>
                        </TableRow>
                      );
                      })}
                      {emptyRows > 0 && (
                      <TableRow>
                        <TableCell colSpan={10} />
                      </TableRow>
                      )}
                  </TableBody>
                  </Table>
              </TableContainer>
              <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
              />
              </Paper>
          </Box>
        </RootContainer>
      </Box>
    </Box>
  );
}
