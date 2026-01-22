import { Divider, Grid, Icon, Typography, Link, Box, Backdrop, makeStyles, Snackbar, ButtonGroup, Button } from "@material-ui/core"
import { Alert, SpeedDial, SpeedDialIcon, SpeedDialAction } from "@material-ui/lab"
import { Delete, Edit, MoreVert, KeyboardArrowDown } from '@material-ui/icons'
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import getRoute from "../../../helpers/router"
import { isPermit } from "../../../helpers/general"
import { CircularProgressCustom } from "../../base_component/spinner"
import BaseLayoutDepoLocation from "../../base_layout/base-layout-depo-location"
import { getListDepoGroupApi, deleteDepoGroupApi } from "../../../services/api/depo-group.api"
import { LOCAL_STORAGE_USER_ID, LOCAL_STORAGE_DEPO_GROUP } from "../../../helpers/consts"
import DepoGroupForm from './group-form'
import AlertDialog from "../../../components/base_component/dialog"
import { getDepoNewsSwr } from "../../../services/swr/depo.swr"
import { Scrollbars } from "react-custom-scrollbars"

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
    wrapper: {
        position: 'relative',
    },
    speedDial: {
        position: 'absolute',
                '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
                bottom: theme.spacing(0),
                right: theme.spacing(0),
            },
                '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
                top: theme.spacing(0),
                left: theme.spacing(0),
            },
    },
    newsSection: {
        color: "#000",
        height: "calc(100vh - 150px)",
    },
}));

export default function Page() {
    const router = useRouter();
    const classes = useStyles()

    const [open, setOpen] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [listData, setListData] = useState([])
    const [idData, setIdData] = useState(null)
    const [data, setData] = useState(null)
    const [openForm, setOpenForm] = useState(false)
    const [hidden, setHidden] = useState([])
    const [openDial, setOpenDial] = useState([])

    const uid = localStorage.getItem(LOCAL_STORAGE_USER_ID);
    const isAdmin = isPermit("menu","admin")

    function openPage(e, url) {
        e.preventDefault()
        router.push(url)
    }

    const confirmDelete = (code) => {
        setIdData(code)
        setOpenDialog(true)
    }
    
    const deleteGroup = async () => {
        setOpenDialog(false)
        try {
            setOpen(true);
            var res = await deleteDepoGroupApi(idData)
            var data = await getListDepoGroupApi("", 0, 999)
            var dialState = [...openDial]
            var hiddenState = [...hidden]
            for (var i=0; i<data.total; i++) {
                dialState[i] = false
                hiddenState[i] = true
            }
            setOpenDial(dialState)
            setHidden(hiddenState)
            setListData(data.result)
            setOpen(false)
        } catch (err) {
            console.log(err)
            setOpen(false)
        }
    }

    useEffect(async () => {
        try {
            setOpen(true)
            localStorage.removeItem(LOCAL_STORAGE_DEPO_GROUP)
            var data = await getListDepoGroupApi("", 0, 999)
            var dialState = []
            var hiddenState = []
            for (var i=0; i<data.total; i++) {
                dialState[i] = false
                hiddenState[i] = true
            }
            setOpenDial(dialState)
            setHidden(hiddenState)
            setListData(data.result)
            setOpen(false)
        } catch (err) {
            console.log(err)
            setOpen(false)
        }
    }, [])

    const refreshListGroup = async () => {
        setOpenForm(false)
        try {
            setOpen(true)
            var data = await getListDepoGroupApi("", 0, 999)
            var dialState = [...openDial]
            var hiddenState = [...hidden]
            for (var i=0; i<data.total; i++) {
                dialState[i] = false
                hiddenState[i] = true
            }
            setOpenDial(dialState)
            setHidden(hiddenState)
            setListData(data.result)
            setOpen(false)
        } catch (err) {
            console.log(err)
            setOpen(false)
        }
    }

    const editForm = async (row) => {
        setData({id:row.id, group_name:row.group_name, country_id:row.country_id, not_include_country:row.not_include_country, default:row.default, users:row.users})
        setOpenForm(true)
    }

    const handleHidden = (key, state) => {
        var hiddenState = []
        for (var i=0; i<hidden.length; i++) {
            hiddenState[i] = true
        }
        hiddenState[key] = state
        setHidden(hiddenState)
    }

    const handleOpen = (key) => {
        var dialState = [...openDial]
        dialState[key] = true
        setOpenDial(dialState)
    }
    
    const handleClose = (key) => {
        var dialState = [...openDial]
        dialState[key] = false
        setOpenDial(dialState)
    }

    const [toast, setToast] = useState({show:false,message:""})

    const showToast = (message) => {
        setToast({show:true, message:message})
    }

    const closeToast = (event, reason) => {
        if (reason === "clickaway") {
            return
        }
        setToast({...toast, show:false})
    }

    const [depoNews, setDepoNews] = useState(null)
    const depoNewsSwr = getDepoNewsSwr()
    useEffect(() => {
        setDepoNews(depoNewsSwr.data)
    }, [depoNewsSwr.data])

    return <BaseLayoutDepoLocation title="Depot Location">
        <Box className="p-5">
            <Grid container className="page-container" alignItems="baseline" justify="center">
                <Grid item xs={12} md={2} lg={2} xl={2}>
                    
                </Grid>
                <Grid item xs={12} md={7} lg={7} xl={7}>
                    <Box className="display-space-between">
                        <h1 className="mb-5">Location</h1>
                        {isAdmin &&
                        <ButtonGroup variant="outlined" color="default" aria-label="split button">
                            <Button onClick={() => {
                                setData(null)
                                setOpenForm(true)
                            }}>
                                <Icon>add</Icon>Add New Location
                            </Button>
                        </ButtonGroup>}
                    </Box>
                    <Divider />
                    <Grid container className="page-container mt-5" spacing={5}>
                        {listData?.map((row, key) => (
                        <React.Fragment>
                            {(row.default || row.users.some(item => item == uid) || isAdmin) &&
                            <Grid item xs={12} md={4} className={classes.wrapper}>
                                <Box className="card text-center" justifyContent="center" alignItems="baseline" onMouseEnter={() => handleHidden(key,false)} onMouseLeave={() => handleHidden(key,true)}>
                                    <Link href={getRoute("depo", {depoSlug: row.id})} onClick={(e) => openPage(e, getRoute("depo", {depoSlug: row.id}))}>
                                        <h2 className="mb-2">{row.group_name}</h2>   
                                    </Link>
                                    {isAdmin &&
                                    <SpeedDial
                                        ariaLabel="Action"
                                        className={classes.speedDial}
                                        icon={<SpeedDialIcon icon={<MoreVert />} openIcon={<KeyboardArrowDown />} />}
                                        FabProps={{ size: "small" }}
                                        hidden={hidden[key]}
                                        direction="up"
                                        open={openDial[key]}
                                        onOpen={() => handleOpen(key)}
                                        onClose={() => handleClose(key)}
                                    >
                                        <SpeedDialAction
                                            key="Edit"
                                            icon={<Edit />}
                                            tooltipTitle="Edit"
                                            onClick={() => editForm(row)}
                                        />
                                        <SpeedDialAction
                                            key="Delete"
                                            icon={<Delete />}
                                            tooltipTitle="Delete"
                                            onClick={() => confirmDelete(row.id)}
                                        />
                                    </SpeedDial>}
                                </Box>
                            </Grid>}
                        </React.Fragment>
                        ))}
                    </Grid>
                    <Backdrop className={classes.backdrop} open={open}></Backdrop>
                    <AlertDialog open={openDialog} cancelAction={() => setOpenDialog(false)} okAction={() => deleteGroup()} title="Delete confirmation" body="Are you sure want to delete this record?" />
                    <Snackbar open={toast.show} autoHideDuration={2000} onClose={closeToast}>
                        <Alert onClose={closeToast} severity="error">{toast.message}</Alert>
                    </Snackbar>
                    <DepoGroupForm 
                        open={openForm} 
                        data={data}
                        closeModal={() => refreshListGroup()} 
                        alert={(msg) => showToast(msg)} />
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <Box className="ms-5" style={{background:"#fefefe", padding: "24px"}}>
                        <h2 className="mb-3">News</h2>
                        <Divider />
                        <Scrollbars
                            autoHide
                            autoHeight
                            autoHeightMin={600}
                            renderView={(props) => (
                                <Box {...props} className={classes.newsSection} />
                            )}
                        >
                            
                            {depoNews?.map((news) => (
                                <Box className="mt-3">
                                    <Box className="pb-3">
                                        <a href={news?.link} target="_blank">
                                        <Box className="text-hover">
                                            {news?.title?.rendered}
                                        </Box>
                                        <Box className="mb-1">
                                            <small>{news?.uagb_excerpt}</small>
                                        </Box>
                                        </a>
                                    </Box>
                                    <Divider />
                                </Box>
                            ))}
                        </Scrollbars>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    </BaseLayoutDepoLocation>
}