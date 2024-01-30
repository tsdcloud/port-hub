import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Logo from './utils/Logo';

import {Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';

import GlobalSetting from './pages/GlobaLSetting';
import Import from './pages/Import';
import Notification from './pages/Notification';

import { useContext } from 'react';
import { AUTHCONTEXT } from './context/AuthContext';

const drawerWidth = 240;

function Menu(props) {
  const {user, permissions} = useContext(AUTHCONTEXT)

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Divider />
      <List>
        {
          (user.member.is_superuser | permissions.includes('view_global_setting') ) ?
            <>
              <Link to="/">
                <ListItem key="globalsetting" disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <AddHomeWorkIcon />
                        </ListItemIcon>
                        <ListItemText primary="Configuration Globale" />
                    </ListItemButton>
                </ListItem>
              </Link>
              <Divider />
            </>
          :null
        }
        
        { 
          (user.member.is_superuser | permissions.includes('view_pesee_container') | permissions.includes('view_declare_container') ) ?
            <>
              <Link to="/import">
                <ListItem key="import" disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <AddHomeWorkIcon />
                    </ListItemIcon>
                    <ListItemText primary="Import excel file" />
                  </ListItemButton>
                </ListItem>
              </Link>
            </>
          :null
        }

        { 
          (user.member.is_superuser | permissions.includes('view_pesee_notification_account') | permissions.includes('view_notification') ) ?
            <>
              <Link to="/notification">
                <ListItem key="import" disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <AddHomeWorkIcon />
                    </ListItemIcon>
                    <ListItemText primary="Notification" />
                  </ListItemButton>
                </ListItem>
              </Link>
            </>
          :null
        }
      </List>
      <Divider />
    </div>
  );

  

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            PORT HUB
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
          <Routes>
            {
              (user.member.is_superuser | permissions.includes('view_global_setting') ) ?
                <Route exact path="/" element={<GlobalSetting />} />
              :null
            }
            { 
              (user.member.is_superuser | permissions.includes('view_pesee_container') | permissions.includes('view_declare_container') ) ?
                <Route exact path="/import" element={<Import />} />
              :null
            }
            { 
              (user.member.is_superuser | permissions.includes('view_pesee_notification_account') | permissions.includes('view_notification') ) ?
                <Route exact path="/notification" element={<Notification />} />
              :null
            }
          </Routes>
      </Box>
    </Box>
  );
}

Menu.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Menu;
