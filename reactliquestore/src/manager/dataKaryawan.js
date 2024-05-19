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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import styled from 'styled-components';
import { Button, CssBaseline, Drawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SupervisorSidebar from './sidebar';

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
    backgroundColor: 'orange',
    color: 'black',
    border: '3px solid black'
};

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
  { id: 'fullname', numeric: false, disablePadding: false, label: 'Nama Lengkap' },
  { id: 'jabatan', numeric: false, disablePadding: false, label: 'Posisi' },
  { id: 'tanggallahir', numeric: false, disablePadding: false, label: 'Tanggal Lahir' },
  { id: 'age', numeric: true, disablePadding: false, label: 'Umur' },
  { id: 'nomorwa', numeric: true, disablePadding: false, label: 'Nomor HP' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'username', numeric: false, disablePadding: false, label: 'Username' },
  { id: 'firstjoindate', numeric: false, disablePadding: false, label: 'Tanggal Pertama Bekerja' },
  { id: 'lastupdate', numeric: false, disablePadding: false, label: 'Last Update' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'aksi', numeric: false, disablePadding: false, }
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

export default function DataKaryawan() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/dataKaryawan');
        console.log(response.data);
        setRows(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  const handleRedirectClick = () => {
    navigate('/manager/dataKaryawan/tambahKaryawan')
  };
  const drawerWidth = 300;

  const handleEdit = (rowData) => {
    console.log(rowData);
    navigate('/manager/dataKaryawan/editKaryawan', { state: { updateCrew: rowData } });
  };
  const handleDelete = () => {
  };

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
        <RootContainer>
          <Box sx={{ width: '100%' }}>
              <Paper sx={{ width: '100%', mb: 2 }}>
              <TableContainer>
                  <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={dense ? 'small' : 'medium'}
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
                          <TableCell align="center">{row.fullname}</TableCell>
                          <TableCell align="center">{row.jabatan}</TableCell>
                          <TableCell align="center">{row.tanggallahir}</TableCell>
                          <TableCell align="center">{row.umur}</TableCell>
                          <TableCell align="center">{row.nomorwa}</TableCell>
                          <TableCell align="center">{row.email}</TableCell>
                          <TableCell align="center">{row.username}</TableCell>
                          <TableCell align="center">{row.firstjoindate}</TableCell>
                          <TableCell align="center">{row.lastupdate}</TableCell>
                          <TableCell align="center">
                          {row.status === "bekerja" && (
                            <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: '#4caf50'}}>
                              Bekerja
                            </Button>
                          )}
                          {row.status === "cuti" && (
                            <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: '#757575' }}>
                              Cuti
                            </Button>
                          )}
                          {row.status === "berhenti" && (
                            <Button style={{ borderRadius: '10px', border: '3px solid black', color: 'white', backgroundColor: '#d32f2f' }}>
                              Berhenti
                            </Button>
                          )}  
                          </TableCell>
                          <TableCell sx={{display: 'flex'}}>
                            <Tooltip title="edit">
                              <IconButton onClick={() => handleEdit(row)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton onClick={handleDelete}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                          </TableRow>
                      );
                      })}
                      {emptyRows > 0 && (
                      <TableRow
                          style={{
                          height: (dense ? 33 : 53) * emptyRows,
                          }}
                      >
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
              <FormControlLabel
              control={<Switch checked={dense} onChange={handleChangeDense} />}
              label="Dense padding"
              />
          </Box>
          <Button style={btnTambahKaryawan} onClick={handleRedirectClick}>+ Tambah Karyawan</Button>
        </RootContainer>
      </Box>
    </Box>
  );
}
