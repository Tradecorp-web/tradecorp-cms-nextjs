import { Button, ButtonGroup, Card, makeStyles, Divider, Grid, Icon, IconButton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography, Box, TextField, Backdrop, CircularProgress, Collapse, Tooltip, Link } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import getRoute from "../../../helpers/router"
import { Chat, KeyboardArrowUp, KeyboardArrowDown, Delete } from '@material-ui/icons'
import { getListTaskManagerApi,getDetailTaskManagerApi,saveTaskMessageApi,deleteTaskMessageApi,downloadTaskMessageFileApi,getListTaskMessageApi } from "../../../services/api/task-manager.api"
import BaseLayout from "../../base_layout/base-layout"
import AlertDialog from "../../base_component/dialog"
import { FileUploadSecureComponent } from "../../base_component/file-upload"
import validator from "validator"
import { CircularProgressCustom } from "../../base_component/spinner"
import Moment from 'moment'
import { LOCAL_STORAGE_USER_ID } from "../../../helpers/consts"
import { isPermit } from "../../../helpers/general"

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
          borderBottom: 'unset',
        },
    },
    customWidth: {
        minWidth: 150,
        fontSize: 14,
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
}))

function Row(props) {
    const classes = useStyles()
    const [messages, setMessages] = useState([])
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [data, setData] = useState({id:null,message:null,attachment:null,link:null,content_type:null})
    const [errorText, setErrorText] = useState({message:null})

    const isAdmin = isPermit("menu","admin")

    const onInputChange = (event) => {
        setData({ ...data, [event.target.name]:event.target.value})
    }

    const onUploaded = (res) => {
        if (res == null) {
            setData({ ...data, link:null, attachment:null, content_type:null})
        } else {
            setData({ ...data, link:res.link, attachment:res.file_name, content_type:res.content_type})
        }
    }

    const checkNull = (value) => {
        if (value == null) {
          return "";
        } else {
          return value;
        }
    }

    useEffect(() => {
        setMessages(props.row.messages)
    }, [props.row])

    function checkValidation() {
        var isValid = true
        var eMessage = ""
        if(data.message == "" || data.message == null) {
            isValid = false
            eMessage = "Message can not be empty"
        }
        setErrorText({message:eMessage})
        return isValid
    }

    const refreshMessage = (id) => {
        getListTaskMessageApi(id).then((result) => {
            setMessages(result)
        }).catch((err) => {
            console.log(err)
        })
    }

    const sendMessage = () => {
        if(checkValidation()) {
            saveTaskMessageApi(props.row.id,data).then((res) => {
                setData({id:null,message:null,attachment:null,link:null,content_type:null})
                refreshMessage(props.row.id)
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    const deleteMessage = (id,msgid) => {
        deleteTaskMessageApi(id,msgid).then((res) => {
            refreshMessage(props.row.id)
        }).catch((err) => {
            console.log(err)
        })
    }

    const downloadFile = async (id,msgid) => {
        try {
            var response = await downloadTaskMessageFileApi(id,msgid)
            if (response.status == 200) {
                var reader = response.body.getReader()
                var contenttype = response.headers.get("Content-Type")
                var chunks = []
                while (true) {
                    const {done, value} = await reader.read()
                    if (done) {
                        break
                    }
                    chunks.push(value)
                }
                var content = new Blob(chunks, {type:contenttype})
                var url = window.URL.createObjectURL(content)
                var tmpLink = document.createElement("a")
                tmpLink.href = url
                tmpLink.setAttribute('target','_blank')
                tmpLink.click()
            }
        } catch(err) {
            console.log(err)
        }
    }
  
    return (
      <React.Fragment>
        <TableRow key={props.key} className={classes.root}>
            <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => {
                        setOpen(!open)
                        setOpen2(false)
                    }}
                >
                    {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
            </TableCell>
            <TableCell>{props.row.description}</TableCell>
            <TableCell width={50}>
                <IconButton>
                    <Chat onClick={() => {
                        setOpen2(!open2)
                        setOpen(false)
                    }} />
                </IconButton>
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h3" gutterBottom component="div">
                  Flow
                </Typography>
                <Table size="small" aria-label="materials">
                  <TableHead>
                    <TableRow>
                      <TableCell>Module</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>Team</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.row.ref_flow?.map((item, key) => {
                        item.modul_id != null &&
                        <TableRow key={key}>
                        <TableCell>{item.modul_id}</TableCell>
                        <TableCell>{item.position.position}</TableCell>
                        <TableCell>{item.team_id}</TableCell>
                        </TableRow>
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
            <Collapse in={open2} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h3" gutterBottom component="div">
                  Messages
                </Typography>
                <Table size="small" aria-label="materials">
                  <TableHead>
                    <TableRow>
                      <TableCell width={200}>From</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell width={200}>Attachment</TableCell>
                      <TableCell width={200}>Send</TableCell>
                      <TableCell width={12}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {messages?.map((item, key) => (
                      <TableRow key={key}>
                        <TableCell>{item.from.name}</TableCell>
                        <TableCell>{item.message}</TableCell>
                        <TableCell>
                            {item.thumbnail != null &&
                            <Box>
                                <Link onClick={() => downloadFile(props.row.id,item.message_id)}>
                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                    <Typography variant="h5" component="h5" style={{wordWrap:"anywhere"}}>{item.attachment}</Typography>
                                </Link>
                            </Box>}
                            {item.thumbnail == null &&
                            <Link onClick={() => downloadFile(props.row.id,item.message_id)}>{item.attachment}</Link>}
                        </TableCell>
                        <TableCell>{Moment(item.send_date).format("LLL")}</TableCell>
                        <TableCell>
                            {isAdmin &&
                            <IconButton>
                                <Delete onClick={() => deleteMessage(props.row.id,item.message_id)} />
                            </IconButton>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              <Box className="modal-content">
                <Grid
                    container
                    spacing={2}
                    justify="center"
                    alignItems="center"
                    className={classes.root}
                >
                    <Grid item xs={8} sm={8}>
                        <TextField 
                            name="message" 
                            label="Message" 
                            variant="outlined" 
                            value={checkNull(data.message)}
                            required 
                            error={errorText.message} 
                            helperText={errorText.message} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <FileUploadSecureComponent 
                            id="image"
                            path="task-message"
                            fileUploaded={(res) => onUploaded(res)}
                            url={data.link}
                            deleteFile={() => onUploaded(null)}/>
                    </Grid>
                    <Grid item xs={1} sm={1}>
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            onClick={sendMessage}
                            disableElevation>
                            Send
                        </Button>
                    </Grid>
                </Grid>
                </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

export default function Page() {
    const router = useRouter()
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [openDialog, setOpenDialog] = useState(false)
    const [idData, setIdData] = useState(null)
    const [data, setData] = useState(null)
    const [listData, setListData] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [rowCount, setRowCount] = useState(0)
    const [openForm, setOpenForm] = useState(false)
    const [toast, setToast] = useState(false)

    const userId = localStorage.getItem(LOCAL_STORAGE_USER_ID)

    const confirmDelete = (id) => {
        setIdData(id)
        setOpenDialog(true)
    }

    const deletePwd = async () => {
        setOpenDialog(false)
        try {
            setOpen(true)
            var res = await deletePwdApi(idData)
            var data = await getListPwdApi()
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
            var data = await getListTaskManagerApi()
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
            var data = await getListPwdApi(search,newPage,rowsPerPage)
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
            var data = await getListPwdApi(search,0,parseInt(event.target.value, 10))
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
            var data = await getListPwdApi(search,0,rowsPerPage)
            setRowCount(data.total)
            setListData(data.result)
            setPage(0)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    const refreshListPwd = async () => {
        setOpenForm(false)
        try {
            setOpen(true)
            var data = await getListPwdApi(search,page,rowsPerPage)
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
        var result = await getDetailPwdApi(id)
        setData({id:id,category:result.category,app_url:result.app_url,username:result.username,password:result.password,teams:result.teams,users:result.users})
        setOpen(false)
        setOpenForm(true)
    }

    const closeToast = (event, reason) => {
        if (reason === "clickaway") {
            return
        }
        setToast(false)
    }

    return <BaseLayout title="Task Manager">
        <Box className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={12} xl={8}>
                        <h1 className="mb-3">Task Manager</h1>
                        <Box className="card no-padding">
                            <Box className="p-3 display-space-between">
                                <Box className="search-bar me-3" style={{width: "25%"}}>
                                    <TextField
                                        variant="standard"
                                        placeholder="Search task…"
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
                            </Box>
                            <Divider/>
                            <TableContainer component={Card}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={12}></TableCell>
                                            <TableCell>Task</TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {listData?.map((row, key) => (
                                        <Row
                                            keys={key}
                                            row={row}
                                            page={page}
                                            rowsPerPage={rowsPerPage}
                                        />                            
                                    ))}
                                    {listData?.length == 0 && 
                                        <TableRow>
                                            <TableCell colspan={3} className="text-center text-muted" align="center">No task to show</TableCell>
                                        </TableRow>
                                    }
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[20, 50, 100]}
                                                colSpan={3}
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
                </Grid>
            </Grid>
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <AlertDialog open={openDialog} cancelAction={() => setOpenDialog(false)} okAction={() => deletePwd()} title="Delete confirmation" body="Are you sure want to delete this record?" />
        </Box>
    </BaseLayout>
}