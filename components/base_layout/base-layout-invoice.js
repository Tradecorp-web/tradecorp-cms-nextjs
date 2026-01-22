import React, { useState, useEffect } from "react";
import {
    Container,
    Snackbar,
    Slide,
    Icon,
    Menu,
    Button,
    MenuItem,
    Link,
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

export default function BaseLayoutAccounting(props) {
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
                    onClick={(e) => openPage(e, getRoute("accounting"))}
                >
                    <div className="flex-center">
                        <Icon className="me-2">dashboard</Icon> Dashboard
                    </div>
                </Button>

                <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    className={"tci-navbar-item "}
                    onClick={handleClick2}
                >
                    <div className="flex-center">
                        <Icon className="me-2">assignment</Icon> Master Data
                    </div>
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl2}
                    keepMounted
                    open={Boolean(anchorEl2)}
                    onClose={handleClose2}
                    className={classes.paper}
                >
                    <MenuItem
                        onClick={(e) => openPage(e, getRoute("accounting.master.coa"))}
                    >
                        COA
                    </MenuItem>

                    <MenuItem
                        onClick={(e) =>
                            openPage(e, getRoute("accounting.master.bankaccount"))
                        }
                    >
                        Bank Account
                    </MenuItem>
                    <MenuItem
                        onClick={(e) => openPage(e, getRoute("accounting.master.assets"))}
                    >
                        Assets
                    </MenuItem>
                    <MenuItem
                        onClick={(e) => openPage(e, getRoute("accounting.master.customer"))}
                    >
                        Customers
                    </MenuItem>
                    <MenuItem
                        onClick={(e) => openPage(e, getRoute("accounting.master.supplier"))}
                    >
                        Supplier
                    </MenuItem>
                </Menu>

                <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    className={"tci-navbar-item "}
                    // onClick={handleClick3}
                    onClick={(e) => openPage(e, getRoute("accounting.transaction"))}
                >
                    <div className="flex-center">
                        <Icon className="me-2">book</Icon>Transaction
                    </div>
                </Button>
                <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    className={"tci-navbar-item "}
                    onClick={handleClick4}
                >
                    <div className="flex-center">
                        <Icon className="me-2">assessment</Icon>Report
                    </div>
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl4}
                    keepMounted
                    open={Boolean(anchorEl4)}
                    onClose={handleClose4}
                    className={classes.paper}
                >
                    <MenuItem
                        onClick={(e) => openPage(e, getRoute("accounting.report.cashflow"))}
                    >
                        Cash Flow
                    </MenuItem>
                    <MenuItem
                        onClick={(e) =>
                            openPage(e, getRoute("accounting.report.generalledger"))
                        }
                    >
                        General Ledger
                    </MenuItem>
                    <MenuItem
                        onClick={(e) =>
                            openPage(e, getRoute("accounting.report.trialbalance"))
                        }
                    >
                        Trial Balance
                    </MenuItem>
                    <MenuItem
                        onClick={(e) =>
                            openPage(e, getRoute("accounting.report.balancesheet"))
                        }
                    >
                        Balance Sheet
                    </MenuItem>
                    <MenuItem
                        onClick={(e) =>
                            openPage(e, getRoute("accounting.report.profitandloss"))
                        }
                    >
                        Profit and Loss
                    </MenuItem>
                </Menu>
            </div>

            <Container>{props?.children}</Container>
            <Snackbar
                anchorOrigin={{vertical, horizontal}}
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
