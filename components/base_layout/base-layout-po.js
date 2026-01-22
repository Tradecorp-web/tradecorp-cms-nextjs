import { Icon, Link, Menu, MenuItem, Snackbar, Slide } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import getRoute from "../../helpers/router";
import AppBarComponent from "../base_component/appbar";
import { isSafari } from "react-device-detect";
import { messageListener } from "../../helpers/firebase";

const useStyles = makeStyles((theme) => ({
  alertTitle: {
    textTransform: "capitalize",
  },
  alertContainer: {
    minWidth: "250px",
  },
}));

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function BaseLayoutPo(props) {
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

  const handleClose = () => {
    setState({ ...state, open: false });
  };

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

  const router = useRouter();

  const poUrl = getRoute("po");
  const poRequestUrl = getRoute("po.po-history");
  const poRequestWoUrl = getRoute("po.request.wo");

  var currentMenu = "";
  if (router.pathname.includes("po/wo")) {
    currentMenu = "wo";
  } else if (router.pathname.includes("po/po-history")) {
    currentMenu = "porequest";
  } else if (router.pathname.includes("po")) {
    currentMenu = "po";
  }

  function toOtherMenu(e, slug) {
    e.preventDefault();
    router.push(slug);
  }

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
      <div>
        <AppBarComponent />
        <div className="tci-navbar">
          <Link
            href={poUrl}
            onClick={(e) => toOtherMenu(e, poUrl)}
            className={
              "tci-navbar-item " + (currentMenu == "po" ? "active" : "")
            }
          >
            <div className="flex-center">
              <Icon className="me-2">inventory</Icon> Purchase Orders
            </div>
          </Link>
          <Link
            href={poRequestWoUrl}
            onClick={(e) => toOtherMenu(e, poRequestWoUrl)}
            className={
              "tci-navbar-item " + (currentMenu == "wo" ? "active" : "")
            }
          >
            <div className="flex-center">
              <Icon className="me-2">storage</Icon> WO Request
            </div>
          </Link>
          <Link
            href={poRequestUrl}
            onClick={(e) => toOtherMenu(e, poRequestUrl)}
            className={
              "tci-navbar-item " + (currentMenu == "porequest" ? "active" : "")
            }
          >
            <div className="flex-center">
              <Icon className="me-2">shop</Icon> PO History
            </div>
          </Link>
        </div>
        <div className="container-content">{props?.children}</div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={state.open}
        onClose={handleClose}
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
