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
import { isPermit } from '../../helpers/general'

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

export default function BaseLayoutStockContainer(props) {
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

    const containerUrl = getRoute("container")
    const leaseAgreementUrl = getRoute("lease.agreement")
    const oneWayUrl = getRoute("one.way")
    const priceGeneratorUrl = getRoute("container.price.generator")

    var currentMenu = ""
    if(router.pathname.includes("container")) {
        currentMenu = "container"
    }
    if(router.pathname.includes("lease-agreement")) {
        currentMenu = "lease-agreement"
    }
    if(router.pathname.includes("one-way")) {
        currentMenu = "one-way"
    }
    if(router.pathname.includes("price-generator")) {
        currentMenu = "price-generator"
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
                <Link href={containerUrl} onClick={(e) => toOtherMenu(e, containerUrl)} className={"tci-navbar-item " + (currentMenu == "container" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">corporate_fare</Icon> Container</div>
                </Link>
                {isPermit("component","lease_agreement") && <Link href={leaseAgreementUrl} onClick={(e) => toOtherMenu(e, leaseAgreementUrl)} className={"tci-navbar-item " + (currentMenu == "lease-agreement" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">assignment_turned_in</Icon> Lease Agreements</div>
                </Link>}
                <Link href={oneWayUrl} onClick={(e) => toOtherMenu(e, oneWayUrl)} className={"tci-navbar-item " + (currentMenu == "one-way" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">rv_hookup</Icon> One Way</div>
                </Link>
                {isPermit("component","generate_container_price") && <Link href={priceGeneratorUrl} onClick={(e) => toOtherMenu(e, priceGeneratorUrl)} className={"tci-navbar-item " + (currentMenu == "price-generator" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">monetization_on</Icon> Stock Price Generator</div>
                </Link>}
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