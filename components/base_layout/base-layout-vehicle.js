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

export default function BaseLayoutVehicle(props) {
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

    const vehicleUrl = getRoute("vehicle")
    const checklistUrl = getRoute("vehicle.checklist")

    var currentMenu = ""
    if(router.pathname.includes("vehicle/checklist")) {
        currentMenu = "vehicle.checklist"
    } else {
        currentMenu = "vehicle"
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
                <Link href={vehicleUrl} onClick={(e) => toOtherMenu(e, vehicleUrl)} className={"tci-navbar-item " + (currentMenu == "vehicle" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">agriculture</Icon> Vehicle</div>
                </Link>
                <Link href={checklistUrl} onClick={(e) => toOtherMenu(e, checklistUrl)} className={"tci-navbar-item " + (currentMenu == "vehicle.checklist" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">checklist</Icon> Checklist</div>
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