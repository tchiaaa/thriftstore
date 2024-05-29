import { LocalShippingOutlined, ShoppingBagOutlined } from '@mui/icons-material';
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
        <ListItem button component={Link} to="/admin/stok">
          <ShoppingBagOutlined />&nbsp;&nbsp;&nbsp;
          <ListItemText primary="Stok" />
        </ListItem>
        <ListItem button component={Link} to="/admin/pemesanan">
          <LocalShippingOutlined />&nbsp;&nbsp;&nbsp;
          <ListItemText primary="Pemesanan dan pengiriman" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AdminSidebar;
