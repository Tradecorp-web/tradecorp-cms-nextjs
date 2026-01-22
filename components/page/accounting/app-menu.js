import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import { Icon, Link, Tooltip, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";

import InboxIcon from "@material-ui/icons/MoveToInbox";
import StarBorder from "@material-ui/icons/StarBorder";
import IconExpandLess from "@material-ui/icons/ExpandLess";
import IconExpandMore from "@material-ui/icons/ExpandMore";
import IconDashboard from "@material-ui/icons/Dashboard";
import IconShoppingCart from "@material-ui/icons/ShoppingCart";
import IconPeople from "@material-ui/icons/People";
import IconBarChart from "@material-ui/icons/BarChart";
import IconApartment from "@material-ui/icons/Apartment";
import IconLibraryBooks from "@material-ui/icons/LibraryBooks";
import IconPriceCheck from "@material-ui/icons/RateReview";

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

export default function AppMenu(props) {
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
    <List component="nav" className={classes.appMenu} disablePadding>
      <ListItem
        button
        onClick={(e) => openPage(e, getRoute("accounting"))}
        className={classes.menuItem}
      >
        <ListItemIcon className={classes.menuItemIcon}>
          <IconDashboard />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>

      <ListItem
        button
        onClick={(e) => openPage(e, getRoute("accounting.master"))}
        className={classes.menuItem}
      >
        <ListItemIcon className={classes.menuItemIcon}>
          <IconShoppingCart />
        </ListItemIcon>
        <ListItemText primary="Master" />
      </ListItem>

      <ListItem
        button
        onClick={(e) =>
          openPage(e, getRoute("accounting.transaction.purchase"))
        }
        className={classes.menuItem}
      >
        <ListItemIcon className={classes.menuItemIcon}>
          <IconShoppingCart />
        </ListItemIcon>
        <ListItemText primary="Purchases" />
      </ListItem>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Transaction" />
        {open ? <IconExpandLess /> : <IconExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            button
            className={classes.nested}
            onClick={(e) => openPage(e, getRoute("invoice"))}
          >
            <ListItemIcon></ListItemIcon>
            <ListItemText primary="Invoice" />
          </ListItem>
        </List>
        <List component="div" disablePadding>
          <ListItem
            button
            className={classes.nested}
            onClick={(e) => openPage(e, getRoute("payment"))}
          >
            <ListItemIcon></ListItemIcon>
            <ListItemText primary="Payment" />
          </ListItem>
        </List>
      </Collapse>
      <ListItem
        button
        onClick={(e) => openPage(e, getRoute("accounting.transaction.sales"))}
        className={classes.menuItem}
      >
        <ListItemIcon className={classes.menuItemIcon}>
          <IconPeople />
        </ListItemIcon>
        <ListItemText primary="Sales" />
      </ListItem>
      <ListItem
        button
        onClick={(e) =>
          openPage(e, getRoute("accounting.transaction.expenses"))
        }
        className={classes.menuItem}
      >
        <ListItemIcon className={classes.menuItemIcon}>
          <IconPriceCheck />
        </ListItemIcon>
        <ListItemText primary="Expenses" />
      </ListItem>

      <ListItem button className={classes.menuItem}>
        <ListItemIcon className={classes.menuItemIcon}>
          <IconApartment />
        </ListItemIcon>
        <ListItemText primary="Banking" />
      </ListItem>
      <ListItem
        button
        onClick={(e) => openPage(e, getRoute("accounting.transaction.journal"))}
        className={classes.menuItem}
      >
        <ListItemIcon className={classes.menuItemIcon}>
          <IconBarChart />
        </ListItemIcon>
        <ListItemText primary="Journal" />
      </ListItem>
      <ListItem
        button
        onClick={(e) => openPage(e, getRoute("accounting.setting"))}
        className={classes.menuItem}
      >
        <ListItemIcon className={classes.menuItemIcon}>
          <IconBarChart />
        </ListItemIcon>
        <ListItemText primary="Setup" />
      </ListItem>
      <ListItem
        button
        onClick={(e) => openPage(e, getRoute("accounting.report"))}
        className={classes.menuItem}
      >
        <ListItemIcon className={classes.menuItemIcon}>
          <IconBarChart />
        </ListItemIcon>
        <ListItemText primary="Report" />
      </ListItem>
      <ListItem button onClick={handleClick} className={classes.menuItem}>
        <ListItemIcon className={classes.menuItemIcon}>
          <IconLibraryBooks />
        </ListItemIcon>
        <ListItemText primary="Library" />
      </ListItem>
      {/*<Collapse in={open} timeout="auto" unmountOnExit>
        <Divider />
        <List component="div" disablePadding>
          <ListItem button className={classes.menuItem}>
            <ListItemText inset primary="Cash Flow" />
          </ListItem>
          <ListItem button className={classes.menuItem}>
            <ListItemText inset primary="Financial Statement" />
          </ListItem>
          <ListItem button className={classes.menuItem}>
            <ListItemText inset primary="General Ledger" />
          </ListItem>
          <ListItem button className={classes.menuItem}>
            <ListItemText inset primary="General Ledger" />
          </ListItem>
        </List>
      </Collapse> */}
    </List>
  );
}
