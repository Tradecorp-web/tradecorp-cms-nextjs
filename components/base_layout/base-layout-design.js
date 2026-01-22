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

export default function BaseLayoutDesign(props) {
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

    const isApproval = isPermit("menu","quote-approve")

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

    const design3dUrl = getRoute("3d")
    const quoteUrl = getRoute("quote")
    const approveUrl = getRoute("quote.approval")

    var currentMenu = ""
    if(router.pathname.includes("3d")) {
        currentMenu = "3d"
    } else if(router.pathname.includes("approval")) {
        currentMenu = "approval"
    } else if(router.pathname.includes("quote")) {
        currentMenu = "quote"
    } else {
        currentMenu = ""
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
                <Link href={design3dUrl} onClick={(e) => toOtherMenu(e, design3dUrl)} className={"tci-navbar-item " + (currentMenu == "3d" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">view_in_ar</Icon> 3D Design</div>
                </Link>
                <Link href={quoteUrl} onClick={(e) => toOtherMenu(e, quoteUrl)} className={"tci-navbar-item " + (currentMenu == "quote" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">request_quote</Icon> Quotation</div>
                </Link>
                { isApproval &&
                    <Link href={approveUrl} onClick={(e) => toOtherMenu(e, approveUrl)} className={"tci-navbar-item " + (currentMenu == "approval" ? "active" : "")}>
                        <div className="flex-center"><Icon className="me-2">approval</Icon> Quotation Approval</div>
                    </Link>
                }
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