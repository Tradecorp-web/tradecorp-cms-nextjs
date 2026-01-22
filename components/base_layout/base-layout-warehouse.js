import { Icon, Link, Menu, MenuItem, Snackbar, Slide } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import getRoute from '../../helpers/router'
import AppBarComponent from '../base_component/appbar'
import { isSafari } from 'react-device-detect'
import { messageListener } from '../../helpers/firebase'

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

export default function BaseLayoutWarehouse(props) {
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

    const warehouseUrl = getRoute("warehouse.list")
    const stockUrl = getRoute("warehouse.stock")
    const materialInUrl = getRoute("warehouse.material.in")
    const materialOutUrl = getRoute("warehouse.material.out")

    var currentMenu = ""
    if(router.pathname.includes("material-in")) {
        currentMenu = "material-in"
    } else if(router.pathname.includes("material-out")) {
        currentMenu = "material-out"
    } else if(router.pathname.includes("list")) {
        currentMenu = "list"
    } else if(router.pathname.includes("stock")) {
        currentMenu = "stock"
    } else {
        currentMenu = "warehouse"
    }

    function toOtherMenu(e, slug) {
        e.preventDefault()
        router.push(slug)
    }

    return <div>
        <Head>
            <title>{props?.title ? props?.title + ` | Tradecorp CMS` : "Tradecorp CMS"}</title>
            <link rel="icon" href="https://kontainerindonesia.co.id/wp-content/uploads/2021/02/cropped-favicon-tradecorp-32x32.png" />            
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet"/>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        </Head>
        <div>
            <AppBarComponent />
            <div className="tci-navbar">
                <Link href={warehouseUrl} onClick={(e) => toOtherMenu(e, warehouseUrl)} className={"tci-navbar-item " + (currentMenu == "list" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">holiday_village</Icon> Manage</div>
                </Link>
                <Link href={stockUrl} onClick={(e) => toOtherMenu(e, stockUrl)} className={"tci-navbar-item " + (currentMenu == "stock" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">inventory_2</Icon> Stock Material</div>
                </Link>
                <Link href={materialInUrl} onClick={(e) => toOtherMenu(e, materialInUrl)} className={"tci-navbar-item " + (currentMenu == "material-in" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">vertical_align_bottom</Icon> Material IN</div>
                </Link>
                <Link href={materialOutUrl} onClick={(e) => toOtherMenu(e, materialOutUrl)} className={"tci-navbar-item " + (currentMenu == "material-out" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">upgrade</Icon> Material OUT</div>
                </Link>
            </div>
            <div className="container-content">
                {props?.children}
            </div>
        </div>
        <Snackbar anchorOrigin={{vertical,horizontal}} open={state.open} onClose={handleClose} TransitionComponent={state.transition} message={state.message} autoHideDuration={state.hide} key={Math.random()}>
            <Alert variant="filled" severity={state.type} className={classes.alertContainer}>
                <AlertTitle className={classes.alertTitle}>{state.title}</AlertTitle>
                {state.message}
            </Alert>
        </Snackbar>
    </div>
}