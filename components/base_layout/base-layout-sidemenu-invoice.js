import React, { useState, useEffect } from "react";
import {
  Container,
  Snackbar,
  Slide,
} from "@material-ui/core";

import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import Head from "next/head";
import AppBarComponent from "../base_component/appbar";
import { isSafari } from "react-device-detect";
import { messageListener } from "../../helpers/firebase";
import { useRouter } from "next/router";

//side menu
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import clsx from "clsx";
import AppMenuInvoice from "../page/invoice/app-menu-invoice";
//==side menu
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    background: "#3B0B28",
    color: "#fff",
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },

  alertTitle: {
    textTransform: "capitalize",
  },
  alertContainer: {
    minWidth: "250px",
  },
  paper: {
    marginTop: theme.spacing(5),
  },
}));

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function BaseLayoutSideMenuInvoice(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [anchorEl3, setAnchorEl3] = React.useState(null);
  const [anchorEl4, setAnchorEl4] = React.useState(null);
  const router = useRouter();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleClick3 = (event) => {
    setAnchorEl3(event.currentTarget);
  };

  const handleClose3 = () => {
    setAnchorEl3(null);
  };
  const handleClick4 = (event) => {
    setAnchorEl4(event.currentTarget);
  };

  const handleClose4 = () => {
    setAnchorEl4(null);
  };
  const classes = useStyles();

  const [state, setState] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    transition: SlideTransition,
    type: "success",
    title: null,
    message: null,
    hide: null,
  });
  const { vertical, horizontal } = state;
  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }
  useEffect(() => {
    if (!isSafari) {
      messageListener()
        .then((payload) => {
          //console.log(payload)
          if (payload.notification !== undefined) {
            setState({
              ...state,
              open: true,
              title: payload.notification.title,
              message: payload.notification.body,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [state]);

  return (
    <div>
      <AppBarComponent> </AppBarComponent>
      <div className="tci-navbar">
        <div className={clsx("App", classes.root)}>
          <CssBaseline />
          <Head>
            <title>
              {props?.title
                ? props?.title + ` | Tradecorp CMS`
                : "Tradecorp CMS"}
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
              rel="stylesheet"
              href="https://fonts.googleapis.com/icon?family=Material+Icons"
            />
          </Head>

          <Drawer
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <AppMenuInvoice></AppMenuInvoice>
          </Drawer>
          <main className={classes.content}>
            <Container maxWidth="xl" className={classes.container}>
              {props?.children}
            </Container>
          </main>
        </div>
      </div>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        // open={state.open}
        // onClose={handleClose}
        TransitionComponent={state.transition}
        message={state.message}
        autoHideDuration={state.hide}
        key={Math.random()}
      >
        <Alert
          variant="filled"
          severity={state.type}
          className={classes.alertContainer}
        >
          <AlertTitle className={classes.alertTitle}>{state.title}</AlertTitle>
          {state.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
