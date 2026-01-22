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

export default function BaseLayoutCompanyDirectory(props) {
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
    const companyId = router.query.companyId

    const companyDirectoryUrl = getRoute("company.directory")
    const companyOfficeUrl = getRoute("company.directory.detail", {companyId: companyId})
    const mailGroupUrl = getRoute("mail.group", {companyId: companyId})
    const manageUserUrl = getRoute("company.directory.users", {companyId: companyId})

    var currentMenu = ""
    if(router.pathname.includes("company-directory")) {
        currentMenu = "company-directory"
    }
    if(router.pathname.includes("mail-group")) {
        currentMenu = "mail-group"
    }
    if(router.pathname.includes("users")) {
        currentMenu = "users"
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
                {companyId == null && <Link href={companyDirectoryUrl} onClick={(e) => toOtherMenu(e, companyDirectoryUrl)} className={"tci-navbar-item " + (currentMenu == "company-directory" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">groups</Icon> Company Directory</div>
                </Link>}
                {companyId != null && <Link href={companyOfficeUrl} onClick={(e) => toOtherMenu(e, companyOfficeUrl)} className={"tci-navbar-item " + (currentMenu == "company-directory" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">groups</Icon> Company Office</div>
                </Link>}
                {companyId != null && <Link href={mailGroupUrl} onClick={(e) => toOtherMenu(e, mailGroupUrl)} className={"tci-navbar-item " + (currentMenu == "mail-group" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">mail</Icon> Mail Groups</div>
                </Link>}
                {companyId != null && isPermit("component", "company_directory_manage_user") && <Link href={manageUserUrl} onClick={(e) => toOtherMenu(e, manageUserUrl)} className={"tci-navbar-item " + (currentMenu == "users" ? "active" : "")}>
                    <div className="flex-center"><Icon className="me-2">groups</Icon> Manage Users</div>
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