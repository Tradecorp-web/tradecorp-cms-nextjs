import React, { useState, useEffect } from "react";
import {
  Container,
  Snackbar,
  Slide,
  Icon,
  Menu,
  Button,
  MenuItem,
} from "@material-ui/core";

import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import Head from "next/head";
import AppBarComponent from "../base_component/appbar";
import { isSafari } from "react-device-detect";
import { messageListener } from "../../helpers/firebase";
import { useRouter } from "next/router";
import getRoute from "../../helpers/router";
const useStyles = makeStyles((theme) => ({
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

export default function BaseLayoutDealBuilder(props) {
  const router = useRouter();

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
          if (payload.notification != undefined) {
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
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>

      <AppBarComponent> </AppBarComponent>
      <div className="tci-navbar">
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          className={"tci-navbar-item "}
          onClick={(e) => openPage(e, getRoute("deal_builder"))}
        >
          <div className="flex-center">
            <Icon className="me-2">dashboard</Icon> Dashboard
          </div>
        </Button>

        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          className={"tci-navbar-item "}
        >
          <div className="flex-center">
            <Icon className="me-2">factory</Icon>Buy
          </div>
        </Button>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          className={"tci-navbar-item "}
        >
          <div className="flex-center">
            <Icon className="me-2">group</Icon>Sell
          </div>
        </Button>

        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          className={"tci-navbar-item "}
        >
          <div className="flex-center">
            <Icon className="me-2">assessment</Icon>Buy/Sell
          </div>
        </Button>
      </div>

      <Container>{props?.children}</Container>
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
