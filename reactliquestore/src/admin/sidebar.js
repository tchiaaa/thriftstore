import { Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  const drawerWidth = 300;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      PaperProps={{
        style: {
          backgroundColor: 'black',
          width: drawerWidth,
          color: 'white',
        },
      }}
    >
      <List>
        <Typography fontSize={50} color={'#ffd600'}>Lique Admin
        </Typography>
        <ListItem button component={Link} to="/admin/pemesanan">
          <ListItemText primary="Pemesanan" />
        </ListItem>
        <ListItem button component={Link} to="/admin/penyimpanan">
          <ListItemText primary="Penyimpanan" />
        </ListItem>
        <ListItem button component={Link} to="/admin/pemesanan">
          <ListItemText primary="Pemesanan dan pengiriman" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AdminSidebar;
