import { Icon, Link, Menu, MenuItem, Snackbar, Slide, Box } from '@material-ui/core'
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
    
}))

function SlideTransition(props) {
    return <Slide {...props} direction="up" />
}

export default function BaseLayoutDepoLocation(props) {
    const classes = useStyles()

    const router = useRouter()

    const locationUrl = getRoute("depo.group")
    const schedularUrl = getRoute("depo.schedular")

    var currentMenu = ""
    if(router.pathname.includes("group")) {
        currentMenu = "group"
    } else if(router.pathname.includes("schedular")) {
        currentMenu = "schedular"
    } else {
        currentMenu = ""
    }

    function toOtherMenu(e, slug) {
        e.preventDefault()
        router.push(slug)
    }

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
                <Link href={locationUrl} onClick={(e) => toOtherMenu(e, locationUrl)} className={"tci-navbar-item " + (currentMenu != "schedular" ? "active" : "")}>
                    <Box className="flex-center"><Icon className="me-2">view_quilt</Icon> Location</Box>
                </Link>
                <Link href={schedularUrl} onClick={(e) => toOtherMenu(e, schedularUrl)} className={"tci-navbar-item " + (currentMenu == "schedular" ? "active" : "")}>
                    <Box className="flex-center"><Icon className="me-2">schedule</Icon> Schedular</Box>
                </Link>
            </Box>
            <Box className="container-content">
                {props?.children}
            </Box>
        </Box>
    </Box>
}