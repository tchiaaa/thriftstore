import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Collapse, ListSubheader } from '@mui/material';
import { ExpandLess, ExpandMore, LocalShippingOutlined, PersonOutlined, ShoppingBagOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [openKaryawan, setOpenKaryawan] = React.useState(false);
  const [openStok, setOpenStok] = React.useState(false);

  const handleKaryawanClick = () => {
    setOpenKaryawan(!openKaryawan);
  };
  const handleStokClick = () => {
    setOpenStok(!openStok);
  };

  return (
    <div>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader" style={{ color: 'white', backgroundColor: 'black' }}>
            <Typography fontSize={50} color={'#FFA500'}>Supervisor</Typography>
          </ListSubheader>
        }
      >
        <ListItem button onClick={handleKaryawanClick}>
          <PersonOutlined />&nbsp;&nbsp;&nbsp;
          <ListItemText primary="Karyawan" />
          {openKaryawan ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openKaryawan} timeout="auto" unmountOnExit>
          <List component="div" disablePadding style={{ paddingLeft: 20 }}>
            <ListItem button component={Link} to="/supervisor/karyawan/presensi">
              <ListItemText primary="Absen" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={handleStokClick}>
          <ShoppingBagOutlined />&nbsp;&nbsp;&nbsp;
          <ListItemText primary="Stok" />
          {openStok ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openStok} timeout="auto" unmountOnExit>
          <List component="div" disablePadding style={{ paddingLeft: 20 }}>
            <ListItem button component={Link} to="/supervisor/stok/reviewStok">
              <ListItemText primary="Review Stok" />
            </ListItem>
            <ListItem button component={Link} to="/supervisor/stok/tipeStok">
              <ListItemText primary="Tipe Stok" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button component={Link} to="/supervisor/pemesanan">
          <LocalShippingOutlined />&nbsp;&nbsp;&nbsp;
          <ListItemText primary="pemesanan dan pengiriman" />
        </ListItem>
      </List>
    </div>
  );
}

export default Sidebar;
