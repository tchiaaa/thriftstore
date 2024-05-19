import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { ListSubheader } from '@mui/material';
import { Link } from 'react-router-dom';
import { PaidOutlined, PersonOutlined, TimelineOutlined } from '@mui/icons-material';

function Sidebar() {
  return (
    <div>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader" style={{ color: 'white', backgroundColor: 'black' }}>
            <Typography fontSize={50} color={'#FFA500'}>Lique Manager</Typography>
          </ListSubheader>
        }
      >
        <ListItem button component={Link} to="/manager/absen">
          <PersonOutlined />&nbsp;&nbsp;&nbsp;
          <ListItemText primary="Absen" />
        </ListItem>
        <ListItem button component={Link} to="/manager/dataKaryawan">
          <TimelineOutlined />&nbsp;&nbsp;&nbsp;
          <ListItemText primary="Data Karyawan" />
        </ListItem>
        <ListItem button component={Link} to="/manager/gajiKaryawan">
          <PaidOutlined />&nbsp;&nbsp;&nbsp;
          <ListItemText primary="Gaji Karyawan" />
        </ListItem>
      </List>
    </div>
  );
}

export default Sidebar;
