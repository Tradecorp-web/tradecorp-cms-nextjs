import { Divider, Grid, Icon, Typography, Link, Box, Button, ButtonGroup, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, IconButton, Card, Tooltip, makeStyles, Modal, List, ListItem, ListItemAvatar, ListItemText, Avatar } from "@material-ui/core"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import getRoute from "../../../helpers/router"
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@material-ui/lab"
import { Edit, Delete, Close, MoreVert, KeyboardArrowDown, Person, Group, DesktopWindows, SettingsApplications } from "@material-ui/icons"
import { getListFolderUserApi,deleteFolderUserApi,getDetailFolderUserApi } from "../../../services/api/folder-user.api"
import BaseLayout from "../../base_layout/base-layout"
import { CircularProgressCustom } from "../../base_component/spinner"
import { switchView } from "../../../helpers/general"
import AlertDialog from "../../base_component/dialog"
import FolderForm from "./folder-form"
import Moment from 'moment'
import { LOCAL_STORAGE_USER_ID } from "../../../helpers/consts"

const useStyles = makeStyles((theme) => ({
    wrapper: {
        position: 'relative',
    },
    customWidth: {
        minWidth: 150,
        fontSize: 14,
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
}))

function Tooltiplist(props) {
    var list = []
    props.data.map((row,key) => {
        list.push(row.name)
    })
    var lists = list.join(", ")
    return <React.Fragment>{lists}</React.Fragment>
}

export default function Page() {
    const classes = useStyles()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [view, setView] = useState("")
    const [search, setSearch] = useState("")
    const [openDialog, setOpenDialog] = useState(false)
    const [idData, setIdData] = useState(null)
    const [data, setData] = useState(null)
    const [listData, setListData] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [rowCount, setRowCount] = useState(0)
    const [openForm, setOpenForm] = useState(false)
    const [hidden, setHidden] = useState([])
    const [openDial, setOpenDial] = useState([])
    const [openDl, setOpenDl] = useState(false)

    const userId = localStorage.getItem(LOCAL_STORAGE_USER_ID)

    function openPage(e, url) {
        //e.preventDefault()
        router.push(url)
    }

    const changeView = (vw) => {
        switchView(vw)
        setView(vw)
    }

    const confirmDelete = (id) => {
        setIdData(id)
        setOpenDialog(true)
    }

    const deleteFolder = async () => {
        setOpenDialog(false)
        try {
            setOpen(true)
            var res = await deleteFolderUserApi(idData)
            var data = await getListFolderUserApi("",0,999,"")
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
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    useEffect(async () => {
        try {
            setOpen(true)
            var vw = switchView()
            setView(vw)
            var data = await getListFolderUserApi("",0,999,"")
            var dialState = []
            var hiddenState = []
            for (var i=0; i<data.total; i++) {
                dialState[i] = false
                hiddenState[i] = true
            }
            setOpenDial(dialState)
            setHidden(hiddenState)
            setRowCount(data.total)
            setListData(data.result)
            setPage(0)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }, []);

    const handleChangePage = async (event, newPage) => {
        try {
            setOpen(true)
            var data = await getListFolderUserApi(search,newPage,rowsPerPage)
            var dialState = []
            var hiddenState = []
            for (var i=0; i<data.total; i++) {
                dialState[i] = false
                hiddenState[i] = true
            }
            setOpenDial(dialState)
            setHidden(hiddenState)
            setRowCount(data.total)
            setListData(data.result)
            setPage(newPage)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    const handleChangeRowsPerPage = async (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        try {
            setOpen(true)
            var data = await getListFolderUserApi(search,0,parseInt(event.target.value, 10))
            var dialState = []
            var hiddenState = []
            for (var i=0; i<data.total; i++) {
                dialState[i] = false
                hiddenState[i] = true
            }
            setOpenDial(dialState)
            setHidden(hiddenState)
            setRowCount(data.total)
            setListData(data.result)
            setPage(0)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    const doSearch = async () => {
        try {
            setOpen(true)
            var data = await getListFolderUserApi(search,0,rowsPerPage)
            var dialState = []
            var hiddenState = []
            for (var i=0; i<data.total; i++) {
                dialState[i] = false
                hiddenState[i] = true
            }
            setOpenDial(dialState)
            setHidden(hiddenState)
            setRowCount(data.total)
            setListData(data.result)
            setPage(0)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    const refreshListFolder = async () => {
        setOpenForm(false)
        try {
            setOpen(true)
            var data = await getListFolderUserApi("",0,999,"")
            var dialState = []
            var hiddenState = []
            for (var i=0; i<data.total; i++) {
                dialState[i] = false
                hiddenState[i] = true
            }
            setOpenDial(dialState)
            setHidden(hiddenState)
            setRowCount(data.total)
            setListData(data.result)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    const editForm = async (id) => {
        setOpen(true)
        var result = await getDetailFolderUserApi(id)
        setData({id:id,folder_name:result.folder_name,parent_id:result.parent_id,parent_tree:result.parent_tree,teams:result.teams,users:result.users,locked:result.locked,created_by:result.created_by})
        setOpen(false)
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

    const checkUpdate = (update,create) => {
        if (update == undefined) {
            return Moment(create).format("LLL")
        } else {
            if (update.startsWith("0001")) {
                return Moment(create).format("LLL")
            } else {
                return Moment(update).format("LLL")
            }
        }
    }

    const downloadWinApp = () => {
        router.push("/file/TradecorpCMS_Sync.exe")
    }

    const openExternalPage = () => {
        window.open("https://dotnet.microsoft.com/en-us/download/dotnet","_blank","noopener noreferrer")
    }

    const openTrash = () => {
        router.push(getRoute("files.trash"))
    }

    return <BaseLayout title="My Files">
        <Box className="p-5">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={12} xl={8}>
                    <Box className="p-3 display-space-between">
                        <h1 className="mb-5">My Files</h1>
                        <Box>
                            <ButtonGroup variant="outlined" color="default" aria-label="split button">
                                <Tooltip title="List View" placement="top">
                                    <Button onClick={() => changeView("list") }>
                                        <Icon>view_list</Icon>
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Grid View" placement="top">
                                    <Button onClick={() => changeView("grid") }>
                                        <Icon>grid_view</Icon>
                                    </Button>
                                </Tooltip>
                            </ButtonGroup>
                            <ButtonGroup variant="outlined" color="default" aria-label="split button">
                                <Tooltip title="Create New Folder" placement="top">
                                    <Button onClick={() => {
                                                        setData(null)
                                                        setOpenForm(true)
                                                    }}>
                                        <Icon>create_new_folder</Icon>
                                    </Button>
                                </Tooltip>
                            </ButtonGroup>
                            <ButtonGroup variant="outlined" color="default" aria-label="split button">
                                <Tooltip title="Download Sync App" placement="top">
                                    <Button onClick={() => setOpenDl(true)}>
                                        <Icon>cloud_sync</Icon>
                                    </Button>
                                </Tooltip>
                            </ButtonGroup>
                            <ButtonGroup variant="outlined" color="default" aria-label="split button">
                                <Tooltip title="Trashcan" placement="top">
                                    <Button onClick={openTrash}>
                                        <Icon>restore_from_trash</Icon>
                                    </Button>
                                </Tooltip>
                            </ButtonGroup>
                        </Box>
                    </Box>
                    <Divider />
                    {view == "list" &&
                    <TableContainer component={Card}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell width={12}></TableCell>
                                    <TableCell>File Name</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell>Modified</TableCell>
                                    <TableCell>Owner</TableCell>
                                    <TableCell>Shares</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {listData?.map((row, key) => (
                                <TableRow>
                                    <TableCell>
                                        <Tooltip title={`Go to ${row.folder_name}`} placement="top">
                                            <Link href={getRoute("files")+"/"+row.id}><Icon>folder_open</Icon></Link>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={`Go to ${row.folder_name}`} placement="top">
                                            <Link href={getRoute("files")+"/"+row.id}>{row.folder_name}</Link>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{Moment(row.created_at).format("LLL")}</TableCell>
                                    <TableCell>{checkUpdate(row.updated_at,row.created_at)}</TableCell>
                                    <TableCell>{row.created.name}</TableCell>
                                    <TableCell>
                                        {row.team_list != null &&
                                        <Tooltip title={
                                            <Tooltiplist data={row.team_list} />
                                        } placement="bottom" classes={{tooltip:classes.customWidth}}>
                                            <Icon>
                                                <Group></Group>
                                            </Icon>
                                        </Tooltip>}
                                        {row.user_list != null &&
                                        <Tooltip title={
                                            <Tooltiplist data={row.user_list} />
                                        } placement="bottom" classes={{tooltip:classes.customWidth}}>
                                            <Icon>
                                                <Person></Person>
                                            </Icon>
                                        </Tooltip>}
                                    </TableCell>
                                    <TableCell>
                                        {userId == row.created_by &&
                                        <React.Fragment>
                                            <Tooltip title="Edit" placement="top">
                                                <IconButton>
                                                    <Edit onClick={() => editForm(row.id)} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete" placement="top">
                                                <IconButton>
                                                    <Delete onClick={() => confirmDelete(row.id)} />
                                                </IconButton>
                                            </Tooltip>
                                        </React.Fragment>}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {listData?.length == 0 && 
                                <TableRow>
                                    <TableCell colspan={7} className="text-center text-muted" align="center">No folder to show</TableCell>
                                </TableRow>
                            }
                            </TableBody>
                        </Table>
                    </TableContainer>}
                    {view == "grid" &&
                    <Grid container className="page-container mt-5" spacing={5}>
                        {listData?.map((row, key) => (
                            <Grid item xs={12} md={2} 
                                className={classes.wrapper}
                            >
                                <Box className="card-small" onMouseEnter={() => handleHidden(key,false)} onMouseLeave={() => handleHidden(key,true)}>
                                    <Link href={"/files/"+row.id} onClick={(e) => openPage(e, "/files/"+row.id)}>
                                        <Box className="text-center" justifyContent="center" alignItems="center">
                                            <Icon color="secondary" style={{fontSize: 50}}>folder</Icon>
                                            <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{row.folder_name}</Typography>
                                        </Box>
                                    </Link>
                                    {userId == row.created_by &&
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
                                            onClick={() => editForm(row.id)}
                                        />
                                        <SpeedDialAction
                                            key="Delete"
                                            icon={<Close />}
                                            tooltipTitle="Delete"
                                            onClick={() => confirmDelete(row.id)}
                                        />
                                    </SpeedDial>}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>}
                    <AlertDialog open={openDialog} cancelAction={() => setOpenDialog(false)} okAction={() => deleteFolder()} title="Delete confirmation" body="Are you sure want to delete this folder?" />
                    <FolderForm open={openForm} closeModal={refreshListFolder} folder={data} />
                    <Modal open={openDl} onClose={() => setOpenDl(false)}>
                        <Box className="modal-wrapper" bgcolor="white" style={{width: "500px"}}>
                            <List>
                                <ListItem button onClick={downloadWinApp}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <DesktopWindows />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Windows Sync App" />
                                </ListItem>
                                <ListItem button onClick={openExternalPage}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <SettingsApplications />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Windows .Net Core 3 Desktop Runtime" />
                                </ListItem>
                            </List>
                        </Box>
                    </Modal>
                </Grid>
            </Grid>
        </Box>
    </BaseLayout>
}