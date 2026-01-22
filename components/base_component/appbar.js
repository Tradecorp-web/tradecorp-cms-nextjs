import React, { useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { Icon, Link, Tooltip, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import getRoute from "../../helpers/router";
import { logoutAccount } from "../../services/api/auth.api";
import { accountSwr } from "../../services/swr/account.swr";
import { isPermit } from "../../helpers/general";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  grow: {
    flexGrow: 1,
  },
  mainMenu: {
    flexGrow: 1,
    display: "flex",
    marginLeft: "24px",
    alignItems: "center",
  },
  mainMenuButton: {
    background: "#00000026",
    padding: "6px 8px 6px 16px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    "&:hover": {
      color: "#FFF",
      background: "#0000001F",
    },
  },
  menuItem: {
    color: "#FFF",
    padding: "12px 20px",
    marginRight: "8px",
    borderRadius: "8px",
    "&:hover": {
      color: "#FFF",
      background: "#dddddd0a",
    },
  },
  menuActive: {
    background: "#ffffff12",
  },
  menuItemImage: {
    width: 20,
  },
  accent: {
    width: 2,
    height: 24,
    background: "#FCC616",
    marginLeft: 32,
    borderRadius: 8,
  },
  profilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 50,
    verticalAlign: "middle",
    position: "absolute",
    top: 32,
    right: 80,
    border: "1px solid #e5e5e5",
    cursor: "pointer",
    boxShadow: "0px 0px 10px -6px #333",
    background: "#EFEFEF",
    objectFit: "cover",
    "&:hover": {
      background: "#EFEFEF",
    },
  },
}));

export default function AppBarComponent() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  function openPage(e, url) {
    e.preventDefault();
    router.push(url);
    setAnchorEl(null);
  }

  function logout() {
    logoutAccount();
    setAnchorEl(null);
  }

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
      <MenuItem onClick={(e) => openPage(e, getRoute("profile"))}>
        <Link href={getRoute("profile")}> My Profile</Link>
      </MenuItem>
      <MenuItem onClick={(e) => openPage(e, getRoute("profile.edit.profile"))}>
        <Link href={getRoute("profile.edit.profile")}> Edit Profile</Link>
      </MenuItem>
      <MenuItem onClick={(e) => openPage(e, getRoute("profile.edit.password"))}>
        <Link href={getRoute("profile.edit.password")}> Edit Password</Link>
      </MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  );

  const router = useRouter();
  const { data, error, mutate } = accountSwr();

  // ---------<Main Menu>--------
  const mainMenuList = [];
  if (isPermit("menu", "admin")) {
    mainMenuList.push({
      name: "Administration",
      url: getRoute("admin"),
      icon: "admin_panel_settings",
    });
  }
  mainMenuList.push({
    name: "Company Directory",
    url: getRoute("company.directory"),
    icon: "groups",
  });
  if (isPermit("menu", "container")) {
    mainMenuList.push({
      name: "Container",
      url: getRoute("container"),
      icon: "corporate_fare",
    });
  }
  if (isPermit("menu", "depo")) {
    mainMenuList.push({
      name: "Depot",
      url: getRoute("depo.group"),
      icon: "view_quilt",
    });
  }
  if (isPermit("menu", "quote_in")) {
    mainMenuList.push({
      name: "New Build Quotes",
      url: getRoute("quotein"),
      icon: "request_quote",
    });
  }
  if (isPermit("menu", "quote_in")) {
    mainMenuList.push({
      name: "Container in Production",
      url: getRoute("quotein-production"),
      icon: "settings",
    });
  }
  if (isPermit("menu", "quote_in")) {
    mainMenuList.push({
      name: "Completed Production Data",
      url: getRoute("quotein-completed"),
      icon: "view_column",
    });
  }
  if (isPermit("menu", "lease_container")) {
    mainMenuList.push({
      name: "Lease Container",
      url: getRoute("container.lease"),
      icon: "text_snippet",
    });
  }
  if (isPermit("menu", "3d")) {
    mainMenuList.push({
      name: "3D Design",
      url: getRoute("3d"),
      icon: "view_in_ar",
    });
  }
  if (isPermit("menu", "product")) {
    mainMenuList.push({
      name: "Product & Material",
      url: getRoute("material"),
      icon: "layers",
    });
  }
  if (isPermit("menu", "purchase_order")) {
    mainMenuList.push({
      name: "Purchase Order",
      url: getRoute("po"),
      icon: "inventory",
    });
  }
  if (isPermit("menu", "wo")) {
    mainMenuList.push({
      name: "Work Order",
      url: getRoute("wo"),
      icon: "assignment",
    });
  }
  if (isPermit("menu", "trucking")) {
    mainMenuList.push({ name: "Trucking", url: null, icon: "local_shipping" });
  }
  if (isPermit("menu", "task_manager")) {
    mainMenuList.push({
      name: "Task Manager",
      url: getRoute("task"),
      icon: "task",
    });
  }
  if (isPermit("menu", "warehouse")) {
    mainMenuList.push({
      name: "Warehouse",
      url: getRoute("warehouse"),
      icon: "precision_manufacturing",
    });
  }
  if (isPermit("menu", "market_research")) {
    mainMenuList.push({ name: "Market Research", url: null, icon: "insights" });
  }
  if (isPermit("menu", "accounting")) {
    mainMenuList.push({ name: "Accounting", url: null, icon: "calculate" });
  }
  if (isPermit("menu", "customer")) {
    mainMenuList.push({
      name: "Customer",
      url: getRoute("customer"),
      icon: "people_alt",
    });
  }
  if (isPermit("menu", "invoicing")) {
    mainMenuList.push({ name: "Invoicing", url: null, icon: "receipt" });
  }
  if (isPermit("menu", "driver")) {
    mainMenuList.push({
      name: "Driver",
      url: getRoute("driver"),
      icon: "person_pin",
    });
  }
  if (isPermit("menu", "machinery")) {
    mainMenuList.push({
      name: "Machinery Fleet Management",
      url: getRoute("vehicle"),
      icon: "agriculture",
    });
  }
  if (isPermit("menu", "document")) {
    mainMenuList.push({
      name: "Authorized Document for Distribution",
      url: getRoute("document"),
      icon: "picture_as_pdf",
    });
  }
  if (isPermit("menu", "files")) {
    mainMenuList.push({
      name: "My Files",
      url: getRoute("files"),
      icon: "cloud",
    });
  }
  if (isPermit("menu", "password")) {
    mainMenuList.push({
      name: "HSAM",
      url: getRoute("pwdman"),
      icon: "psychology",
    });
  }

  var pathMenu = escape(router?.pathname)?.split("/")[1];
  const mainMenuSelected = mainMenuList?.find((i) =>
    i?.url?.includes(`/${pathMenu}`)
  );
  const [anchorMainMenu, setAnchorMainMenu] = React.useState(null);
  const isMainMenuOpen = Boolean(anchorMainMenu);
  const mainMenuId = "primary-search-account-menu";
  function selectMainMenu(e, index) {
    e.preventDefault();
    setAnchorEl(null);
    router.push(mainMenuList[index].url);
  }
  const openMainMenu = (e) => {
    setAnchorMainMenu(e.currentTarget);
  };
  const closeMainMenu = () => {
    setAnchorMainMenu(null);
  };
  const renderMainMenu = (
    <Menu
      anchorEl={anchorMainMenu}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      id={mainMenuId}
      keepMounted
      width={200}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={isMainMenuOpen}
      onClose={closeMainMenu}
    >
      {mainMenuList?.map((item, index) => {
        return (
          <MenuItem
            key={index}
            onClick={
              item.url == null ? () => {} : (e) => selectMainMenu(e, index)
            }
          >
            <Link href={item.url} className="flex-center">
              <Icon className="me-2">{item.icon}</Icon>{" "}
              <span className={item.url == null ? "text-muted" : ""}>
                {item.name}
              </span>
            </Link>
          </MenuItem>
        );
      })}
    </Menu>
  );
  // ---------<Main Menu>--------

  return (
    <div className={classes.grow}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Link
            href="/"
            onClick={() => router.push("/")}
            style={{ color: "#FFF" }}
          >
            <img style={{ height: 34 }} src="/images/tradecorp-logo-w.png" />
          </Link>
          <div className={classes.accent}></div>
          <div className={classes.mainMenu}>
            <Typography
              className={"flex-center " + classes.mainMenuButton}
              onClick={(e) => openMainMenu(e)}
            >
              <Icon className="me-2">{mainMenuSelected?.icon ?? "menu"}</Icon>
              <span>{mainMenuSelected?.name ?? "Select Menu"}</span>
              <Icon className="ms-2">arrow_drop_down</Icon>
            </Typography>
          </div>
          <div>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Tooltip title={`Hi, ${data?.name}`}>
              {data?.photo ? (
                <img
                  className={classes.profilePhoto}
                  aria-label={data?.name}
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  src={data?.photo}
                />
              ) : (
                <IconButton
                  edge="end"
                  aria-label={data?.name}
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  className={[classes.profileMenu, classes.profilePhoto]}
                  color="inherit"
                >
                  <AccountCircle style={{ color: "#333", fontSize: 40 }} />
                </IconButton>
              )}
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
      {renderMainMenu}
    </div>
  );
}
