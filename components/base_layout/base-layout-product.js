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

export default function BaseLayoutProduct(props) {
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

    const materialUrl = getRoute("material")
    const productUrl = getRoute("product")
    const vendorUrl = getRoute("vendor")

    var currentMenu = ""
    if(router.pathname.includes("material/vendor")) {
        currentMenu = "vendor"
    } else if(router.pathname.includes("product")) {
        currentMenu = "product"
    } else if(router.pathname.includes("material")) {
        currentMenu = "material"
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
                <Link href={materialUrl} onClick={(e) => toOtherMenu(e, materialUrl)} className={"tci-navbar-item " + (currentMenu == "material" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">category</Icon> Material</div>
                </Link>
                <Link href={productUrl} onClick={(e) => toOtherMenu(e, productUrl)} className={"tci-navbar-item " + (currentMenu == "product" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">layers</Icon> Product</div>
                </Link>
                <Link href={vendorUrl} onClick={(e) => toOtherMenu(e, vendorUrl)} className={"tci-navbar-item " + (currentMenu == "vendor" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">contact_phone</Icon> Vendor</div>
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