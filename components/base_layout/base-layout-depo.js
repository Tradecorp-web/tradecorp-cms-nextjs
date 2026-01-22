import { Icon, Link, Menu, MenuItem, Snackbar, Slide, Box } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { depoData } from '../../helpers/data-dummy'
import getRoute from '../../helpers/router'
import { getDetailDepoSwr, getListDepoGSwr } from '../../services/swr/depo.swr'
import { getListDepoGApi } from "../../services/api/depo.api"
import AppBarComponent from '../base_component/appbar'
import { isSafari } from 'react-device-detect'
import { messageListener } from '../../helpers/firebase'
import { LOCAL_STORAGE_DEPO_GROUP } from "../../helpers/consts"
import { isPermit } from "../../helpers/general"

const useStyles = makeStyles((theme) => ({
    alertTitle: {
        textTransform: 'capitalize'
    },
    alertContainer: {
        minWidth: '250px'
    }
}))

function SlideTransition(props) {
    return <Slide {...props} direction="up" />
}

export default function BaseLayoutDepo(props) {
    const classes = useStyles()

    const [state, setState] = useState({
        open:false,
        vertical:"bottom",
        horizontal:"right",
        transition:SlideTransition,
        type:"success",
        title:null,
        message:null,
        hide:null
    })
    const { vertical, horizontal } = state

    const isAdmin = isPermit("menu","admin")

    const handleClose = () => {
        setState({...state, open:false})
    }

    useEffect(() => {
        if (!isSafari) {
            messageListener().then((payload) => {
                //console.log(payload)
                if (payload.notification != undefined) {
                    setState({...state, open:true, title:payload.notification.title, message:payload.notification.body})
                }
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }, [state])

    const router = useRouter()
    function linkToPage(e, routerSlug) {
        e.preventDefault()
        router.push(routerSlug)
    }

    const [depo, setDepo] = useState(null)
    const depoSwr = getDetailDepoSwr(router.query.depoSlug)
    useEffect(() => {
        setDepo(depoSwr.data)
    }, [depoSwr])

    const [depoList, setDepoList] = useState([])
    // const group = localStorage.getItem(LOCAL_STORAGE_DEPO_GROUP)
    
    // const depoSwrList = getListDepoGSwr({
    //     page: 1, 
    //     limit: 100,
    //     // isOwn: true
    // }, group)
    // useEffect(() => {
    //     if(depoSwrList?.data?.result) {
    //         setDepoList(depoSwrList?.data?.result ?? [])
    //     }
    // }, depoSwrList.data)
    useEffect(async () => {
        try {
            var group = localStorage.getItem(LOCAL_STORAGE_DEPO_GROUP)
            var data = await getListDepoGApi({
                    page: 1, 
                    limit: 100,
                }, group)
            setDepoList(data?.result ?? [])
        } catch(err) {
            console.log(err)
        }
    }, [])

    const depoSlug = router.query.depoSlug
    const depoUrl = getRoute("depo.detail", {depoSlug: depoSlug})
    const depoPartnerUrl = getRoute("depo.partner", {depoSlug: depoSlug})
    const stockUrl = getRoute("depo.stock", {depoSlug: depoSlug})
    const doAcceptanceUrl = getRoute("depo.do.accept", {depoSlug: depoSlug})
    const doReleaseUrl = getRoute("depo.do.release", {depoSlug: depoSlug})
    const eirInUrl = getRoute("depo.eir.in", {depoSlug: depoSlug})
    const eirOutUrl = getRoute("depo.eir.out", {depoSlug: depoSlug})
    const settingUrl = getRoute("depo.settings", {depoSlug: depoSlug})

    var currentMenu = ""
    if(router.pathname.includes("depot-partner")) {
        currentMenu = "depot-partner"
    } else if(router.pathname.includes("stock")) {
        currentMenu = "stock"
    } else if(router.pathname.includes("do-acceptance")) {
        currentMenu = "do-acceptance"
    } else if(router.pathname.includes("do-release")) {
        currentMenu = "do-release"
    } else if(router.pathname.includes("eir-in")) {
        currentMenu = "eir-in"
    } else if(router.pathname.includes("eir-out")) {
        currentMenu = "eir-out"
    } else if (router.pathname.includes("schedular")) {
        currentMenu = "schedular"
    } else if(router.pathname.includes("settings")) {
        currentMenu = "settings"
    } else {
        currentMenu = "depo"
    }

    function toOtherMenu(e, slug) {
        console.log(slug)
        e.preventDefault()
        setAnchorEl(null);
        router.push(slug)
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    };
    const handleMenuClose = () => {
        setAnchorEl(null)
    };
    const menuId = 'menu-item';
    const renderMenu = (
        <Menu
            className="container-item-menu"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}>
            {depoList?.map((val, id) => {
                return <MenuItem key={id} onClick={(e) => toOtherMenu(e, getRoute("depo.detail", {depoSlug: val.id}))}>{val?.name}</MenuItem>
            })}
        </Menu>
    );

    return <Box>
        <Head>
            <title>{props?.title ? props?.title + ` | Tradecorp CMS` : "Tradecorp CMS"}</title>
            <link rel="icon" href="https://kontainerindonesia.co.id/wp-content/uploads/2021/02/cropped-favicon-tradecorp-32x32.png" />            
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet"/>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        </Head>
        <Box>
            <AppBarComponent />
            <Box className="tci-navbar">
                <Box className="tci-navbar-menu-label" onClick={handleProfileMenuOpen}>
                    <Box className="display-space-between">
                        <Box className="flex-center">
                            <Icon className="me-2" color="secondary">fiber_manual_record</Icon> <h4>{depoSwr?.data?.name}</h4> 
                        </Box>
                        <Icon className="ms-3" style={{fontSize: 14}}>unfold_more</Icon>
                    </Box>
                </Box>
                <Link href={depoUrl} onClick={(e) => toOtherMenu(e, depoUrl)} className={"tci-navbar-item " + (currentMenu == "depo" ? "active" : "")}>
                    <Box className="flex-center"><Icon className="me-2">home</Icon> Dashboard</Box>
                </Link>
                {/* <Link href={depoPartnerUrl} onClick={(e) => toOtherMenu(e, depoPartnerUrl)} className={"tci-navbar-item " + (currentMenu == "depot-partner" ? "active" : "")}>
                    <Box className="flex-center"><Icon className="me-2">business</Icon> Depot 3rd Party</Box>
                </Link> */}
                <Link href={stockUrl} onClick={(e) => toOtherMenu(e, stockUrl)} className={"tci-navbar-item " + (currentMenu == "stock" ? "active" : "")}>
                    <Box className="flex-center"><Icon className="me-2">layers</Icon> Container Stocks</Box>
                </Link>
                {isAdmin &&
                <React.Fragment>
                    <Link href={doAcceptanceUrl} onClick={(e) => toOtherMenu(e, doAcceptanceUrl)} className={"tci-navbar-item " + (currentMenu == "do-acceptance" ? "active" : "")}>
                        <Box className="flex-center"><Icon className="me-2">local_shipping</Icon> DO Acceptance</Box>
                    </Link>
                    <Link href={doReleaseUrl} onClick={(e) => toOtherMenu(e, doReleaseUrl)} className={"tci-navbar-item " + (currentMenu == "do-release" ? "active" : "")}>
                        <Box className="flex-center"><Icon className="me-2">local_shipping</Icon> DO Release</Box>
                    </Link>
                    <Link href={eirInUrl} onClick={(e) => toOtherMenu(e, eirInUrl)} className={"tci-navbar-item " + (currentMenu == "eir-in" ? "active" : "")}>
                        <Box className="flex-center"><Icon className="me-2">receipt</Icon> EIR IN</Box>
                    </Link>
                    <Link href={eirOutUrl} onClick={(e) => toOtherMenu(e, eirOutUrl)} className={"tci-navbar-item " + (currentMenu == "eir-out" ? "active" : "")}>
                        <Box className="flex-center"><Icon className="me-2">receipt</Icon> EIR OUT</Box>
                    </Link>
                </React.Fragment>}
                <Link href={settingUrl} onClick={(e) => toOtherMenu(e, settingUrl)} className={"tci-navbar-item " + (currentMenu == "settings" ? "active" : "")}>
                    <Box className="flex-center"><Icon className="me-2">settings</Icon> Settings</Box>
                </Link>
            </Box>
            <Box className="container-content">
                {props?.children}
            </Box>
        </Box>
        {renderMenu}
        <Snackbar anchorOrigin={{vertical,horizontal}} open={state.open} onClose={handleClose} TransitionComponent={state.transition} message={state.message} autoHideDuration={state.hide} key={Math.random()}>
            <Alert variant="filled" severity={state.type} className={classes.alertContainer}>
                <AlertTitle className={classes.alertTitle}>{state.title}</AlertTitle>
                {state.message}
            </Alert>
        </Snackbar>
    </Box>
}