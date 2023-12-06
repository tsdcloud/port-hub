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

import BusinessIcon from '@mui/icons-material/Business';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';

import Dashboard from "./Dashboard";
import EntityPage from './pages/EntityPage';
import ArticlePage from './pages/ArticlePage';
import CareerPage from './pages/CareerPage';
import TransfertPage from './pages/TransfertPage';
import LocalitePage from './pages/LocalitePage';

const drawerWidth = 240;

function Menu(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Logo />
      <Divider />
      <List>
        <Link to="/">
          <ListItem key="dashboard" disablePadding>
              <ListItemButton>
                  <ListItemIcon>
                      <AddHomeWorkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tableau de bord" />
              </ListItemButton>
          </ListItem>
        </Link>
        <Divider />
        <Link to="/entity">
          <ListItem key="entity" disablePadding>
              <ListItemButton>
                  <ListItemIcon>
                      <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary="Gestion des entreprises" />
              </ListItemButton>
          </ListItem>
        </Link>
        <Link to="/localization">
          <ListItem key="localization" disablePadding>
              <ListItemButton>
                  <ListItemIcon>
                      <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary="Localités" />
              </ListItemButton>
          </ListItem>
        </Link>
        <Divider />
        <ListItem key="employee" disablePadding>
            <ListItemButton>
                <ListItemIcon>
                    <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Gestion des employés" />
            </ListItemButton>
        </ListItem>
        <Divider />
        <Link to="/article">
          <ListItem key="article" disablePadding>
              <ListItemButton>
                  <ListItemIcon>
                      <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary="Gestion des articles" />
              </ListItemButton>
          </ListItem>
        </Link>
        <Divider />
        <Link to="/career">
          <ListItem key="career" disablePadding>
              <ListItemButton>
                  <ListItemIcon>
                      <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary="Gestion des carrières" />
              </ListItemButton>
          </ListItem>
        </Link>
        <Divider />
        <Link to="/operation">
          <ListItem key="operation" disablePadding>
              <ListItemButton>
                  <ListItemIcon>
                      <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary="Gestion des opérations" />
              </ListItemButton>
          </ListItem>
        </Link>
        <Divider />
        <ListItem key="vente" disablePadding>
            <ListItemButton>
                <ListItemIcon>
                    <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Gestion des ventes" />
            </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem key="redevances" disablePadding>
            <ListItemButton>
                <ListItemIcon>
                    <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Gestion des redevances" />
            </ListItemButton>
        </ListItem>
        <Divider />
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
            MINING FLOW
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
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/home" element={<Dashboard />} />
            <Route exact path="/operation" element={<TransfertPage />} />
            <Route exact path="/entity" element={<EntityPage />} />
            <Route exact path="/article" element={<ArticlePage />} />
            <Route exact path="/career" element={<CareerPage />} />
            <Route exact path="/localization" element={<LocalitePage />} />
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
