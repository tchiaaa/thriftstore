import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
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
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import styled from 'styled-components';
import { CssBaseline, Drawer, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import SupervisorSidebar from './sidebar';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { addMonths, eachDayOfInterval, endOfMonth, format, startOfMonth, subMonths } from 'date-fns';

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const headCells = [
  { id: 'tanggal', numeric: false, disablePadding: false, label: 'Tanggal' },
  { id: 'clockin', numeric: false, disablePadding: false, label: 'Clock-In' },
  { id: 'clockout', numeric: false, disablePadding: false, label: 'Clock-Out' },
  { id: 'jamKerja', numeric: true, disablePadding: false, label: 'Jam Kerja' },
  { id: 'gajiPokok', numeric: true, disablePadding: false, label: 'Gaji Pokok' },
  { id: 'uangMakan', numeric: false, disablePadding: false, label: 'Uang Makan' },
  { id: 'uangLembur', numeric: false, disablePadding: false, label: 'Uang Lembur' },
  { id: 'gajiLibur', numeric: false, disablePadding: false, label: 'Gaji Libur' },
  { id: 'terlambat', numeric: false, disablePadding: false, label: 'Terlambat' },
  { id: 'keteranganTelat', numeric: false, disablePadding: false, label: 'Keterangan Telat' },
  { id: 'keteranganLibur', numeric: false, disablePadding: false, label: 'Keterangan Libur' },
  { id: 'totalGaji', numeric: false, disablePadding: false, label: 'Total Gaji' },
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
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Employee Data
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
const timeToSeconds = (time) => {
  if (!time) return NaN;
  const parts = time.split(':').map(Number);
  if (parts.length === 2) {
    const [hours, minutes] = parts;
    return hours * 3600 + minutes * 60;
  } else if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  } else {
    return NaN; // Invalid time format
  }
};

export default function GajiKaryawan() {
  let idAbsensi = '';
  const totalMonthlySalary = useRef(0);
  const daysWithoutLateness = useRef(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [choosenEmployee, setChoosenEmployee] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jamMasuk, setJamMasuk] = useState('');
  const [jadwalLibur, setJadwalLibur] = useState('');

  const months = [
    'Januari', 'Februari', 'Maret', 'April',
    'Mei', 'Juni', 'Juli', 'Agustus',
    'September', 'Oktober', 'November', 'Desember'
  ];

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  const currentMonthName = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/daftarSelectKaryawan`);
        setRows(response.data);
        // console.log(response.data);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - choosenEmployee.length) : 0;

  const drawerWidth = 300;
  const handleChange = async (event) => {
    idAbsensi = event.target.value;
    try {
      const response = await axios.get(`http://localhost:8080/pilihKaryawan?idAbsensi=${idAbsensi}`);
      console.log(response.data);
      setChoosenEmployee(response.data);
      setJamMasuk(response.data[0].jam_masuk);
      setJadwalLibur(response.data[0].jadwal_libur);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const Holiday = (date, jadwalLibur) => {
    const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
  
    // Check if the dayOfWeek matches any day in jadwalLibur
    return jadwalLibur.includes(days[dayOfWeek]);
  };
  
  const calculateSalarySlip = (employee) => {
    if (!employee) {
      return {
        total_jam_kerja: '-',
        gaji_pokok: '-',
        uang_makan: '-',
        uang_lembur: '-',
        gaji_libur: '-',
        keterlambatan: '-',
        keterangan_telat: '-',
        keterangan_libur: '-',
        total_gaji: '-',
      };
    }

    const clockInTime = timeToSeconds(employee.clockIn);
    const clockOutTime = timeToSeconds(employee.clockOut);
    const totalWorkSeconds = clockOutTime - clockInTime;
    const totalWorkHours = totalWorkSeconds / 3600;

    const basicSalary = totalWorkHours > 8 ? 64000 : totalWorkHours * 8000;
    const mealAllowance = totalWorkHours > 8 ? 10000 : 0;
    const overtimePay = totalWorkHours > 8 ? Math.floor((totalWorkHours - 8) * 10000) : 0;
    const isHolidayDays = Holiday(new Date(employee.tanggal), employee.jadwal_libur);
    const isHoliday = isHolidayDays ? 'Libur' : '-';
    
    const holidayPay = isHolidayDays ? 64000 : 0;

    let latenessPenalty = 0;
    if (clockInTime > timeToSeconds('10:00:00')) {
      const lateMinutes = (clockInTime - timeToSeconds('10:00:00')) / 60;
      if (lateMinutes >= 1 && lateMinutes <= 5) latenessPenalty = -10000;
      else if (lateMinutes > 5 && lateMinutes <= 15) latenessPenalty = -15000;
      else if (lateMinutes > 15 && lateMinutes <= 30) latenessPenalty = -20000;
      else if (lateMinutes > 30 && lateMinutes <= 60) latenessPenalty = -30000;
    }

    const isLate = clockInTime > timeToSeconds('10:00:00') ? 'telat' : 'tidak telat';
    const totalSalary = holidayPay + basicSalary + mealAllowance + overtimePay + latenessPenalty;
    if (totalSalary !== '-') {
      totalMonthlySalary.current += totalSalary;
      if (isLate === 'tidak telat') {
        daysWithoutLateness.current++;
      }
    }

    return {
      total_jam_kerja: totalWorkHours.toFixed(2),
      gaji_pokok: basicSalary,
      uang_makan: mealAllowance,
      uang_lembur: overtimePay,
      gaji_libur: holidayPay,
      keterlambatan: latenessPenalty,
      keterangan_telat: isLate,
      keterangan_libur: isHoliday,
      total_gaji: totalSalary,
    };
  };

  const bonusTidakTelat = (daysWithoutLateness === dates.length) ? 100000 : 0;
  const totalMonthlySalaryWithBonus = totalMonthlySalary.current + bonusTidakTelat;
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
          <Box sx={{ minWidth: 300 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Pilih Karyawan</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Pilih Karyawan"
                value={idAbsensi}
                onChange={handleChange}
              >
                {rows.map(item => (
                  <MenuItem key={item.id} value={item.id}>{item.username}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Grid container alignItems="center" justifyContent="center">
            <Grid item>
              <IconButton onClick={handlePreviousMonth}>
                <ChevronLeft />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography variant="h6">{`${currentMonthName} ${currentYear}`}</Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={handleNextMonth}>
                <ChevronRight />
              </IconButton>
            </Grid>
          </Grid>
          <Box sx={{ width: '100%' }}>
            {jamMasuk !== '' && jadwalLibur !== '' && (
              <Typography>Jam masuk: {jamMasuk} &nbsp;&nbsp;&nbsp; Jadwal Libur: Setiap {jadwalLibur}</Typography>
            )}
            <Paper sx={{ width: '100%', mb: 2 }}>
              <TableContainer sx={{maxHeight: 400}}>
                  <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={dense ? 'small' : 'medium'}
                  stickyHeader
                  >
                  <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={rows.length}
                  />
                  <TableBody>
                    {dates.map((date, idx) => {
                      const formattedDate = format(date, 'dd-MM-yyyy');
                      const employee = choosenEmployee.find((emp) => emp.tanggal === formattedDate);
                      const salarySlip = calculateSalarySlip(employee);
                      return (
                        <TableRow hover tabIndex={-1} key={date} sx={{ cursor: 'pointer' }}>
                          <TableCell align="center">{formattedDate}</TableCell>
                          <TableCell align="center">{employee?.clockIn || '-'}</TableCell>
                          <TableCell align="center">{employee?.clockOut || '-'}</TableCell>
                          <TableCell align="center">{salarySlip.total_jam_kerja}</TableCell>
                          <TableCell align="center">{salarySlip.gaji_pokok}</TableCell>
                          <TableCell align="center">{salarySlip.uang_makan}</TableCell>
                          <TableCell align="center">{salarySlip.uang_lembur}</TableCell>
                          <TableCell align="center">{salarySlip.gaji_libur}</TableCell>
                          <TableCell align="center">{salarySlip.keterlambatan}</TableCell>
                          <TableCell align="center">{salarySlip.keterangan_telat}</TableCell>
                          <TableCell align="center">{salarySlip.keterangan_libur}</TableCell>
                          <TableCell align="center">{salarySlip.total_gaji}</TableCell>
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
              <Table>
                <TableRow>
                  <TableCell colSpan={10} align="right">Total Gaji Bulanan</TableCell>
                  <TableCell align="center">{totalMonthlySalary.current}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={10} align="right">Bonus Tidak Telat</TableCell>
                  <TableCell align="center">{bonusTidakTelat}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={10} align="right">Total Gaji + Bonus</TableCell>
                  <TableCell align="center">{totalMonthlySalaryWithBonus}</TableCell>
                </TableRow>
              </Table>
            </Paper>
              {/* <FormControlLabel
              control={<Switch checked={dense} onChange={handleChangeDense} />}
              label="Dense padding"
              /> */}
          </Box>
        </RootContainer>
      </Box>
    </Box>
  );
}
