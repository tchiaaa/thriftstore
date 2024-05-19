import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Collapse, ListSubheader } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [openKaryawan, setOpenKaryawan] = React.useState(false);

  const handlePresensiClick = () => {
    setOpenKaryawan(!openKaryawan);
  };

  return (
    <div>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader" style={{ color: 'white', backgroundColor: 'black' }}>
            <Typography fontSize={50} color={'#FFA500'}>Lique Crew</Typography>
          </ListSubheader>
        }
      >
        <ListItem button onClick={handlePresensiClick}>
          <ListItemText primary="Karyawan" />
          {openKaryawan ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openKaryawan} timeout="auto" unmountOnExit>
          <List component="div" disablePadding style={{ paddingLeft: 20 }}>
            <ListItem button component={Link} to="/supervisor/karyawan/presensi">
              <ListItemText primary="Presensi" />
            </ListItem>
            <ListItem button component={Link} to="/supervisor/karyawan/dataKaryawan">
              <ListItemText primary="Data Karyawan" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button component={Link} to="/supervisor/penyimpanan">
          <ListItemText primary="Penyimpanan" />
        </ListItem>
        <ListItem button component={Link} to="/supervisor/pemesanan">
          <ListItemText primary="pemesanan dan pengiriman" />
        </ListItem>
      </List>
    </div>
  );
}

export default Sidebar;
