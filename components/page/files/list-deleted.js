import { Button, ButtonGroup, Card, makeStyles, Divider, Grid, Icon, IconButton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography, Box, TextField, Backdrop, CircularProgress, Collapse, Tooltip, Link, LinearProgress, Modal, CardActions, CardMedia } from "@material-ui/core"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import getRoute from "../../../helpers/router"
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@material-ui/lab"
import { DeleteForever, MoreVert, KeyboardArrowDown, GetApp, RestoreFromTrash } from '@material-ui/icons'
import { getListDeletedFileUserApi,purgeFileUserApi,downloadFileUserApi,undeleteFileUserApi } from "../../../services/api/file-user.api"
import BaseLayout from "../../base_layout/base-layout"
import AlertDialog from "../../base_component/dialog"
import { CircularProgressCustom } from "../../base_component/spinner"
import Moment from 'moment'
import { LOCAL_STORAGE_USER_ID } from "../../../helpers/consts"
import { isPermit,switchView } from "../../../helpers/general"

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
          borderBottom: 'unset',
        },
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    margin: {
        margin: theme.spacing(1),
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
    card: {
        height: "90vh",
        width: "70vw",
        margin: "40px auto",
        backgroundColor: "#121212",
    },
    media: {
        objectFit: "contain",
        height: "80vh",
        marginBottom: "20px",
    },
}))

function Breadcrumb(props) {
    var section = props.row.split("|")
    return (
        <React.Fragment>/&nbsp;<Link href={getRoute("files")+"/"+section[1]}>{section[0]}</Link>&nbsp;</React.Fragment>
    )
}

export default function Page() {
    const router = useRouter()
    const classes = useStyles()
    const [view, setView] = useState("")
    const [tree, setTree] = useState(null)
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [openDialog, setOpenDialog] = useState(false)
    const [idData, setIdData] = useState(null)
    const [listData, setListData] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [rowCount, setRowCount] = useState(0)
    const [hidden, setHidden] = useState([])
    const [openDial, setOpenDial] = useState([])
    const [progress, setProgress] = useState([])
    // const [bar, setBar] = useState([])
    const [blob, setBlob] = useState([])
    const [selView, setSelView] = useState({key:null, name:""})
    const [openView, setOpenView] = useState(false)
    const [openRestore, setOpenRestore] = useState(false)

    const isAdmin = isPermit("menu","admin")
    const userId = localStorage.getItem(LOCAL_STORAGE_USER_ID)

    var bar = []

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

    const deleteDoc = async () => {
        setOpenDialog(false)
        try {
            setOpen(true)
            var res = await purgeFileUserApi(idData)
            var data = await getListDeletedFileUserApi()
            var dialState = [...openDial]
            var hiddenState = [...hidden]
            var pos = 0
            for (var i=0; i<data.total; i++) {
                dialState[pos] = false
                hiddenState[pos] = true
                pos++
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

    const confirmRestore = (id) => {
        setIdData(id)
        setOpenRestore(true)
    }

    const restoreDoc = async () => {
        setOpenRestore(false)
        try {
            setOpen(true)
            var res = await undeleteFileUserApi(idData)
            var data = await getListDeletedFileUserApi()
            var dialState = [...openDial]
            var hiddenState = [...hidden]
            var pos = 0
            for (var i=0; i<data.total; i++) {
                dialState[pos] = false
                hiddenState[pos] = true
                pos++
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
            var section = []
            section.unshift("Home|")
            section.push("Trashcan|trash")
            setTree(section)
            var data = await getListDeletedFileUserApi()
            var dialState = []
            var hiddenState = []
            var prog = []
            // var br = []
            var bl = []
            var pos = 0
            for (var i=0; i<data.total; i++) {
                dialState[pos] = false
                hiddenState[pos] = true
                prog[i] = 0
                bar[i] = 0
                bl[i] = new Blob()
                pos++
            }
            console.log(prog)
            setOpenDial(dialState)
            setHidden(hiddenState)
            setProgress(prog)
            // setBar(br)
            setBlob(bl)
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
            var data = await getListDeletedFileUserApi(search,"",newPage,rowsPerPage)
            var dialState = [...openDial]
            var hiddenState = [...hidden]
            var pos = 0
            for (var i=0; i<data.total; i++) {
                dialState[pos] = false
                hiddenState[pos] = true
                pos++
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
            var data = await getListDeletedFileUserApi(search,"",0,parseInt(event.target.value, 10))
            var dialState = [...openDial]
            var hiddenState = [...hidden]
            var pos = 0
            for (var i=0; i<data.total; i++) {
                dialState[pos] = false
                hiddenState[pos] = true
                pos++
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
            var data = await getListDeletedFileUserApi(search,"",0,rowsPerPage)
            var dialState = [...openDial]
            var hiddenState = [...hidden]
            var pos = 0
            for (var i=0; i<data.total; i++) {
                dialState[pos] = false
                hiddenState[pos] = true
                pos++
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

    const refreshListDoc = async () => {
        setOpenForm(false)
        try {
            setOpen(true)
            var data2 = await getListDeletedFileUserApi(search,"",page,rowsPerPage)
            setListData(data2.result)
            setRowCount(data2.total)
            var dialState = [...openDial]
            var hiddenState = [...hidden]
            var pos = 0
            var prog = []
            for (var i=0; i<data2.total; i++) {
                dialState[pos] = false
                hiddenState[pos] = true
                prog[i] = 0
                pos++
            }
            setOpenDial(dialState)
            setHidden(hiddenState)
            setProgress(prog)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
        //location.reload()
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

    const downloadFile = async (key,id,type,name) => {
        if (blob[key].size > 0) {
            if (type.includes("image/")) {
                setSelView({key:key, name:name})
                setOpenView(true)
            }
            
        } else {
            var prog = [...progress]
            prog[key] = 1
            setProgress(prog)
            try {
                var response = await downloadFileUserApi(id)
                if (response.status == 200) {
                    var reader = response.body.getReader()
                    var len = parseInt(response.headers.get("Content-Length"))
                    var receiveLen = 0
                    var chunks = []
                    while (true) {
                        const {done, value} = await reader.read()
                        if (done) {
                            break
                        }
                        chunks.push(value)
                        receiveLen += value.length
                        // var br = [...bar]
                        bar[key] = parseInt(receiveLen / len * 100)
                        // setBar(br)
                        // console.log(bar)
                    }
                    var bl = [...blob]
                    bl[key] = new Blob(chunks, {type:type})
                    setBlob(bl)
                    var prog = [...progress]
                    if (type.includes("image/")) {
                        prog[key] = 0
                        setSelView({key:key, name:name})
                        setOpenView(true)
                    } else {
                        prog[key] = 2
                    }
                    setProgress(prog)
                } else {
                    var prog = [...progress]
                    prog[key] = 0
                    setProgress(prog)
                }
            } catch(err) {
                console.log(err)
            }
        }
    }

    const closeForm = () => {
        setOpenView(false)
    }

    const openFile = () => {
        var bl = [...blob]
        var data = bl[selView.key]
        var url = window.URL.createObjectURL(data)
        var tmpLink = document.createElement("a")
        tmpLink.href = url
        tmpLink.setAttribute('download',selView.name)
        tmpLink.click()
    }

    const openFile2 = (key,name) => {
        var bl = [...blob]
        var data = bl[key]
        var url = window.URL.createObjectURL(data)
        var tmpLink = document.createElement("a")
        tmpLink.href = url
        tmpLink.setAttribute('download',name)
        tmpLink.click()
    }

    return <BaseLayout title="My Files">
        <Box className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={12} xl={8}>
                        <h1 className="mb-3">
                            {tree?.map((row,key) => (
                                <Breadcrumb row={row} />
                            ))}
                        </h1>
                        {view == "list" &&
                        <Box className="card no-padding">
                            <Box className="p-3 display-space-between">
                                <Box className="search-bar me-3" style={{width: "25%"}}>
                                    <TextField
                                        variant="standard"
                                        placeholder="Search File Name…"
                                        className="search-input"
                                        readOnly={open}
                                        defaultValue={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        InputProps={{ 
                                            'aria-label': 'search',
                                            'endAdornment': (
                                                <IconButton onClick={doSearch} size="small"><Icon>search</Icon></IconButton>
                                            )
                                        }}/>
                                </Box>
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
                                </Box>
                            </Box>
                            <Divider/>
                            <TableContainer component={Card}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={12}></TableCell>
                                            <TableCell>File Name</TableCell>
                                            <TableCell>Modified</TableCell>
                                            <TableCell>Owner</TableCell>
                                            <TableCell>Deleted</TableCell>
                                            <TableCell>Deleted by</TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <Tooltip title="Up to parent folder" placement="top">
                                                    <Link href={getRoute("files")}><Icon>drive_folder_upload</Icon></Link>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell colspan={6}>
                                                <Tooltip title="Up to parent folder" placement="top">
                                                    <Link href={getRoute("files")}>..</Link>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    {listData?.map((row, key) => (
                                        <TableRow>
                                            <TableCell>
                                                {progress[key] == 0 &&
                                                <Tooltip title={`Download ${row.document_name}`} placement="top">
                                                    <Link onClick={() => downloadFile(key,row.id,row.content_type,row.document_name)}><Icon>insert_drive_file</Icon></Link>
                                                </Tooltip>}
                                                {(progress[key] == 1 || progress[key] == 2) &&
                                                <Icon color="primary">insert_drive_file</Icon>}
                                            </TableCell>
                                            <TableCell>
                                                {progress[key] == 0 &&
                                                <Tooltip title={`Download ${row.document_name}`} placement="top">
                                                    <Link onClick={() => downloadFile(key,row.id,row.content_type,row.document_name)}>{row.document_name}</Link>
                                                </Tooltip>}
                                                {progress[key] == 1 &&
                                                <Box>
                                                    <Typography color="primary" variant="body2">{row.document_name}</Typography>
                                                    <LinearProgress value={bar[key]} />
                                                </Box>}
                                                {progress[key] == 2 &&
                                                <Box>
                                                    <Typography color="primary" variant="body2">{row.document_name}
                                                    <Button variant="outlined" size="small" color="primary" className={classes.margin} onClick={() => openFile2(key,row.document_name)}>Open</Button>
                                                    </Typography>
                                                </Box>}
                                            </TableCell>
                                            <TableCell>{checkUpdate(row.updated_at,row.created_at)}</TableCell>
                                            <TableCell>{row.owner.name}</TableCell>
                                            <TableCell>{Moment(row.deleted_at).format("LLL")}</TableCell>
                                            <TableCell>{row.deleted.name}</TableCell>
                                            <TableCell>
                                                <Tooltip title="Restore" placement="top">
                                                    <IconButton>
                                                        <RestoreFromTrash onClick={() => confirmRestore(row.id)} />
                                                    </IconButton>
                                                </Tooltip>
                                                {isAdmin &&
                                                <React.Fragment>
                                                    <Tooltip title="Delete Forever" placement="top">
                                                        <IconButton>
                                                            <DeleteForever onClick={() => confirmDelete(row.id)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </React.Fragment>}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {listData?.length == 0 && 
                                        <TableRow>
                                            <TableCell colspan={7} className="text-center text-muted" align="center">No file to show</TableCell>
                                        </TableRow>
                                    }
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[20, 50, 100]}
                                                colSpan={7}
                                                count={rowCount}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                SelectProps={{
                                                    inputProps: { 'aria-label': 'rows per page' },
                                                    native: true,
                                                }}
                                                onChangePage={handleChangePage}
                                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                            />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                        </Box>}
                        {view == "grid" &&
                        <Box>
                            <Box className="p-3 display-space-between">
                                <Box className="search-bar me-3" style={{width: "25%"}}>
                                    <TextField
                                        variant="standard"
                                        placeholder="Search File Name…"
                                        className="search-input"
                                        readOnly={open}
                                        defaultValue={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        InputProps={{ 
                                            'aria-label': 'search',
                                            'endAdornment': (
                                                <IconButton onClick={doSearch} size="small"><Icon>search</Icon></IconButton>
                                            )
                                        }}/>
                                </Box>
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
                                </Box>
                            </Box>
                            <Divider/>
                            <Grid container className="page-container mt-5" spacing={5}>
                                {listData?.map((row, key) => {
                                    var newKey = 0
                                    return (<Grid item xs={12} md={2} 
                                        className={classes.wrapper}
                                    >
                                        <Box className="card-small" onMouseEnter={() => handleHidden(newKey+key,false)} onMouseLeave={() => handleHidden(newKey+key,true)}>
                                            {progress[key] == 0 &&
                                            <Link onClick={() => downloadFile(key,row.id,row.content_type,row.document_name)}>
                                                {row.thumbnail == null &&
                                                <Box className="text-center" display="flex" justifyContent="center" alignItems="center">
                                                    <Box className="small-icon-wrapper">
                                                        <Icon style={{fontSize: 30}}>insert_drive_file</Icon>
                                                    </Box>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"10px"}}>{row.document_name}</Typography>
                                                </Box>}
                                                {row.thumbnail != null &&
                                                <Box className="text-center" justifyContent="center" alignItems="center">
                                                    <img src={`data:image/jpeg;base64,${row.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"10px"}}>{row.document_name}</Typography>
                                                </Box>}
                                            </Link>}
                                            {progress[key] == 1 &&
                                            <React.Fragment>
                                                {row.thumbnail == null &&
                                                <Box className="text-center" display="flex" justifyContent="center" alignItems="center">
                                                    <Box className="small-icon-wrapper">
                                                        <Icon style={{fontSize: 30}}>insert_drive_file</Icon>
                                                    </Box>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"10px"}}>{row.document_name}
                                                    <CircularProgress value={bar[key]} /></Typography>
                                                </Box>}
                                                {row.thumbnail != null &&
                                                <Box className="text-center" justifyContent="center" alignItems="center">
                                                    <img src={`data:image/jpeg;base64,${row.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"10px"}}>{row.document_name}</Typography>
                                                    <CircularProgress value={bar[key]} />
                                                </Box>}
                                            </React.Fragment>}
                                            {progress[key] == 2 &&
                                            <React.Fragment>
                                                {row.thumbnail == null &&
                                                <Box className="text-center" display="flex" justifyContent="center" alignItems="center">
                                                    <Box className="small-icon-wrapper">
                                                        <Icon style={{fontSize: 30}}>insert_drive_file</Icon>
                                                    </Box>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"10px"}}>{row.document_name}
                                                    <Button variant="outlined" size="small" color="primary" className={classes.margin} onClick={() => openFile2(key,row.document_name)}>Open</Button></Typography>
                                                </Box>}
                                                {row.thumbnail != null &&
                                                <Box className="text-center" justifyContent="center" alignItems="center">
                                                    <img src={`data:image/jpeg;base64,${row.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"10px"}}>{row.document_name}</Typography>
                                                    <Button variant="outlined" size="small" color="primary" className={classes.margin} onClick={() => openFile2(key,row.document_name)}>Open</Button>
                                                </Box>}
                                            </React.Fragment>}
                                            <SpeedDial
                                                ariaLabel="Action"
                                                className={classes.speedDial}
                                                icon={<SpeedDialIcon icon={<MoreVert />} openIcon={<KeyboardArrowDown />} />}
                                                FabProps={{ size: "small" }}
                                                hidden={hidden[newKey+key]}
                                                direction="up"
                                                open={openDial[newKey+key]}
                                                onOpen={() => handleOpen(newKey+key)}
                                                onClose={() => handleClose(newKey+key)}
                                            >
                                                <SpeedDialAction
                                                    key="Delete"
                                                    icon={<RestoreFromTrash />}
                                                    tooltipTitle="Restore"
                                                    onClick={() => confirmRestore(row.id)}
                                                />
                                                {isAdmin &&
                                                <SpeedDialAction
                                                    key="Delete"
                                                    icon={<DeleteForever />}
                                                    tooltipTitle="Delete Forever"
                                                    onClick={() => confirmDelete(row.id)}
                                                />}
                                            </SpeedDial>
                                        </Box>
                                    </Grid>
                                )})}
                            </Grid>
                            <Box display="flex" justifyContent="flex-end" mt={3}>
                                <TableContainer>
                                    <Table>
                                        <TableFooter>
                                            <TableRow>
                                                <TablePagination
                                                    rowsPerPageOptions={[20, 50, 100]}
                                                    count={rowCount}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    SelectProps={{
                                                        inputProps: { 'aria-label': 'rows per page' },
                                                        native: true,
                                                    }}
                                                    onChangePage={handleChangePage}
                                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                                />
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box>}
                </Grid>
            </Grid>
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <AlertDialog open={openDialog} cancelAction={() => setOpenDialog(false)} okAction={() => deleteDoc()} title="Delete confirmation" body="Are you sure want to delete this file?" />
            <AlertDialog open={openRestore} cancelAction={() => setOpenRestore(false)} okAction={() => restoreDoc()} title="Restore confirmation" body="Are you sure want to restore this file?" />
            <Modal open={openView} onClose={closeForm} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                <Card className={classes.card}>
                    {blob[selView.key] instanceof Blob &&
                    <CardMedia className={classes.media} component="img" src={window.URL.createObjectURL(blob[selView.key])} title={selView.name} />
                    }
                    <CardActions>
                        <Button variant="contained" onClick={openFile} startIcon={<GetApp />}>{selView.name}</Button>
                    </CardActions>
                </Card>
            </Modal>
        </Box>
    </BaseLayout>
}