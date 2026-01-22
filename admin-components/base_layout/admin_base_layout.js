import {
  Avatar,
  Collapse,
  Divider,
  Icon,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  makeStyles,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import getRoute from "../../helpers/router";
import { logoutAccount } from "../../services/api/auth.api";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  icon: {
    color: "#FFF",
  },
  submenuItem: {
    paddingLeft: "72px",
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 14,
    color: "#CCC",
    "&:hover": {
      color: "#FFF",
    },
  },
  menu: {
    borderLeft: "2px solid transparent",
  },
  active: {
    borderLeft: "2px solid #fff",
  },
}));

export default function AdminBaseLayout(props) {
  const classes = useStyles();

  const router = useRouter();

  function isMenuActive(slug) {
    if (router.pathname.includes(slug)) {
      return true;
    } else {
      false;
    }
  }

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  const [companyToggleMenu, setCompanyToggleMenu] = useState(false);
  const [settingToggleMenu, setSettingToggleMenu] = useState(false);
  const [staffToggleMenu, setStaffToggleMenu] = useState(false);
  const [masterToggleMenu, setMasterToggleMenu] = useState(false);

  useEffect(() => {
    setCompanyToggleMenu(isMenuActive("company"));
    setSettingToggleMenu(isMenuActive("setting"));
    setStaffToggleMenu(isMenuActive("staff"));
    setMasterToggleMenu(isMenuActive("master"));
  }, []);

  function logout() {
    logoutAccount();
    setAnchorEl(null);
  }
  const [anchorEl, setAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      width={200}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  );

  return (
    <div className="admin-app">
      <Head>
        <title>
          {props?.title ? props?.title + ` | Tradecorp CMS` : "Tradecorp CMS"}
        </title>
        <link
          rel="icon"
          href="https://kontainerindonesia.co.id/wp-content/uploads/2021/02/cropped-favicon-tradecorp-32x32.png"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <div className="admin-page-container">
        <div className="admin-sidebar">
          <div className="admin-sidebar-header">
            <Link
              href="/"
              onClick={() => router.push("/")}
              style={{ color: "#FFF" }}
            >
              <img style={{ height: 52 }} src="/images/tradecorp-logo-w.png" />
            </Link>
          </div>
          <div className="admin-sidebar-menu">
            <List component="nav" aria-labelledby="nested-list-subheader">
              <ListItem
                button
                onClick={(e) => openPage(e, getRoute("admin"))}
                className={`${
                  isMenuActive("dashboard") ? classes.active : ""
                } ${classes.menu}`}
              >
                <ListItemIcon>
                  <Icon className={classes.icon}>home</Icon>
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>

              <ListItem
                button
                onClick={() => setCompanyToggleMenu(!companyToggleMenu)}
                className={`${isMenuActive("company") ? classes.active : ""} ${
                  classes.menu
                }`}
              >
                <ListItemIcon>
                  <Icon className={classes.icon}>domain</Icon>
                </ListItemIcon>
                <ListItemText primary="Company" />
                {companyToggleMenu ? (
                  <Icon>expand_less</Icon>
                ) : (
                  <Icon>expand_more</Icon>
                )}
              </ListItem>
              <Collapse in={companyToggleMenu} timeout="auto" unmountOnExit>
                <List component="div">
                  <ListItem
                    button
                    className={classes.submenuItem}
                    onClick={(e) => openPage(e, getRoute("admin.company"))}
                  >
                    <span>Company Information</span>
                  </ListItem>
                  <ListItem
                    button
                    className={classes.submenuItem}
                    onClick={(e) =>
                      openPage(e, getRoute("admin.company.office"))
                    }
                  >
                    <span>Offices</span>
                  </ListItem>
                  <ListItem
                    button
                    className={classes.submenuItem}
                    onClick={(e) => openPage(e, getRoute("admin.company.depo"))}
                  >
                    <span>Depo</span>
                  </ListItem>
                  <ListItem
                    button
                    className={classes.submenuItem}
                    onClick={(e) =>
                      openPage(e, getRoute("admin.company.warehouse"))
                    }
                  >
                    <span>Warehouse</span>
                  </ListItem>
                </List>
              </Collapse>

              <ListItem
                button
                onClick={() => setStaffToggleMenu(!staffToggleMenu)}
              >
                <ListItemIcon>
                  <Icon className={classes.icon}>people_alt</Icon>
                </ListItemIcon>
                <ListItemText primary="Manage Staff" />
                {staffToggleMenu ? (
                  <Icon>expand_less</Icon>
                ) : (
                  <Icon>expand_more</Icon>
                )}
              </ListItem>
              <Collapse in={staffToggleMenu} timeout="auto" unmountOnExit>
                <List component="div">
                  <ListItem
                    button
                    className={classes.submenuItem}
                    onClick={(e) => openPage(e, getRoute("admin.position"))}
                  >
                    <span>Positions</span>
                  </ListItem>
                  <ListItem
                    button
                    className={classes.submenuItem}
                    onClick={(e) => openPage(e, getRoute("admin.team"))}
                  >
                    <span>Team</span>
                  </ListItem>
                  <ListItem
                    button
                    className={classes.submenuItem}
                    onClick={(e) => openPage(e, getRoute("admin.user.list"))}
                  >
                    <span>Staff</span>
                  </ListItem>
                </List>
              </Collapse>

              {/*<ListItem 
                            button 
                            onClick={(e) => openPage(e, getRoute("admin.folder"))}
                            className={`${(isMenuActive("folder") ? classes.active : "")} ${classes.menu}`}>
                            <ListItemIcon>
                                <Icon className={classes.icon}>folder</Icon>
                            </ListItemIcon>
                            <ListItemText primary="Manage Folders" />
                        </ListItem>*/}

              <ListItem
                button
                onClick={() => setMasterToggleMenu(!masterToggleMenu)}
                className={`${isMenuActive("master") ? classes.active : ""} ${
                  classes.menu
                }`}
              >
                <ListItemIcon>
                  <Icon className={classes.icon}>data_exploration</Icon>
                </ListItemIcon>
                <ListItemText primary="Master Data" />
                {masterToggleMenu ? (
                  <Icon>expand_less</Icon>
                ) : (
                  <Icon>expand_more</Icon>
                )}
              </ListItem>
              <Collapse in={masterToggleMenu} timeout="auto" unmountOnExit>
                <List component="div">
                  <ListItem
                    button
                    className={classes.submenuItem}
                    onClick={(e) => openPage(e, getRoute("admin.master.data.list"))}
                  >
                    <span>Master Data</span>
                  </ListItem>
                  <ListItem
                    button
                    className={classes.submenuItem}
                    onClick={(e) => openPage(e, getRoute("admin.company_type"))}
                  >
                    <span>Master Company Type</span>
                  </ListItem>
                  <ListItem
                    button
                    className={classes.submenuItem}
                    onClick={(e) => openPage(e, getRoute("admin.master.color"))}
                  >
                    <span>Master Color Codes</span>
                  </ListItem>
                  <ListItem
                    button
                    className={classes.submenuItem}
                    onClick={(e) => openPage(e, getRoute("admin.flowmaster"))}
                  >
                    <span>Flow Master</span>
                  </ListItem>
                  <ListItem
                    button
                    className={classes.submenuItem}
                    onClick={(e) => openPage(e, getRoute("admin.permission.template"))}
                  >
                    <span>Permission Template</span>
                  </ListItem>
                </List>
              </Collapse>

              <ListItem
                button
                onClick={() => setSettingToggleMenu(!settingToggleMenu)}
                className={`${isMenuActive("setting") ? classes.active : ""} ${
                  classes.menu
                }`}
              >
                <ListItemIcon>
                  <Icon className={classes.icon}>settings</Icon>
                </ListItemIcon>
                <ListItemText primary="Setting" />
                {settingToggleMenu ? (
                  <Icon>expand_less</Icon>
                ) : (
                  <Icon>expand_more</Icon>
                )}
              </ListItem>
              <Collapse in={settingToggleMenu} timeout="auto" unmountOnExit>
                <List component="div">
                  <ListItem
                    button
                    className={classes.submenuItem}
                    onClick={(e) =>
                      openPage(e, getRoute("admin.setting.config"))
                    }
                  >
                    <span>Configuration</span>
                  </ListItem>
                  <ListItem
                    button
                    className={classes.submenuItem}
                    onClick={(e) =>
                      openPage(e, getRoute("admin.setting.device"))
                    }
                  >
                    <span>Permitted Devices</span>
                  </ListItem>

                  <ListItem button className={classes.submenuItem}>
                    <span>General Information</span>
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </div>
          <div className="admin-sidebar-footer">
            <p className="dashboard-name">Tradecorp CMS Admin Dashboard</p>
            <p className="copyright">&copy; All Right Reserved</p>
          </div>
        </div>
        <div className="admin-content-wrapper">
          <div className="admin-panel-bar">
            <h1>{props?.title ?? "Admin Dashboard"}</h1>
            <div className="admin-panel-item">
              <Avatar
                onClick={handleProfileMenuOpen}
                className="account-button"
                alt="Admin"
                src="https://tradecorp-bucket.s3-ap-southeast-1.amazonaws.com/test/2ceee68afd1c98c04434552bba961ad1202110152810tradecorp-logo.jpeg"
              />
            </div>
          </div>
          <div className="admin-content-padding">{props?.children}</div>
        </div>
      </div>
      {renderMenu}
    </div>
  );
}
