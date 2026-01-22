import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import IconAssignment from "@material-ui/icons/Assignment";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import ListAltOutlinedIcon from "@material-ui/icons/ListAltOutlined";
import AccountBoxOutlinedIcon from "@material-ui/icons/AccountBoxOutlined";

const drawerWidth = 240;

const useStyles = makeStyles((theme) =>
  createStyles({
    appMenu: {
      width: "100%",
    },
    navList: {
      width: drawerWidth,
    },
    menuItem: {
      width: drawerWidth,
    },
    menuItemIcon: {
      color: "#97c05c",
    },
  })
);

export default function AppMenuInvoice(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  function handleClick() {
    setOpen(!open);
  }

  return (
    <List
      component="nav"
      className={classes.appMenu}
      disablePadding
      sx={{ width: "100%", maxWidth: 360 }}
      aria-labelledby="Manage invoice menu"
    >
      <ListItem button onClick={handleClick} className={classes.menuItem}>
        <ListItemIcon className={classes.menuItemIcon}>
          <IconAssignment />
        </ListItemIcon>
        <ListItemText primary="Invoice" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <div style={{ paddingLeft: 8 }}>
            {/*<ListItem*/}
            {/*  button*/}
            {/*  onClick={(e) => openPage(e, getRoute("invoice.form"))}*/}
            {/*>*/}
            {/*  <ListItemIcon className={classes.menuItemIcon}>*/}
            {/*    <AddBoxOutlinedIcon />*/}
            {/*  </ListItemIcon>*/}
            {/*  <ListItemText primary="New Invoice" />*/}
            {/*</ListItem>*/}
            <ListItem button onClick={(e) => openPage(e, getRoute("invoice"))}>
              <ListItemIcon className={classes.menuItemIcon}>
                <ListAltOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="List Transaction" />
            </ListItem>
            <ListItem
              button
              onClick={(e) => openPage(e, getRoute("invoice.customer"))}
            >
              <ListItemIcon className={classes.menuItemIcon}>
                <AccountBoxOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Customer Invoice" />
            </ListItem>
          </div>
        </List>
      </Collapse>
    </List>
  );
}
