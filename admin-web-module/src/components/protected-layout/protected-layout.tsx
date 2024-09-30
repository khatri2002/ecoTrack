import { useAuth } from "../../context/AuthProvider";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import Logo from "../../assets/images/ecoTrack_logo.png";
import styles from "./protected-layout.module.scss";
import navItems from "./nav-items";
import classNames from "classnames";

const ProtectedLayout = () => {
  const { loading, loggedIn } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const location = useLocation();
  if (loading) return <h1>loading......</h1>;
  if (!loggedIn) return <Navigate to="/sign-in" replace={true} />;

  const currentItem = navItems.find((item) => item.path === location.pathname);
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div className={styles.drawer}>
      <Toolbar>
        <div className={styles.logoContainer}>
          <img src={Logo} alt="ecoTrack logo" />
          <span>EcoTrack</span>
        </div>
      </Toolbar>
      <Divider className={styles.divider} />
      <List>
        {navItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                classNames(styles.navLink, { [styles.active]: isActive })
              }
            >
              <ListItemButton>
                <ListItemIcon className={styles.icon}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box className={styles.container}>
      <AppBar position="fixed" className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={styles.iconButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {currentItem?.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" aria-label="mailbox folders" className={styles.nav}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          className={styles.drawerTemporary}
        >
          {drawer}
        </Drawer>
        <Drawer variant="permanent" className={styles.drawerPermanent} open>
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" className={styles.main}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default ProtectedLayout;
