import { Button, ButtonGroup, Card, makeStyles, Divider, Grid, Icon, IconButton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography, Box, TextField, Backdrop, CircularProgress, Collapse, Tooltip, Link, Snackbar } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import getRoute from "../../../helpers/router"
import { Delete, Edit, Person, Group } from '@material-ui/icons'
import { getListPwdApi,deletePwdApi,getDetailPwdApi } from "../../../services/api/pwd.api"
import PwdForm from "./form"
import BaseLayout from "../../base_layout/base-layout"
import AlertDialog from "../../base_component/dialog"
import validator from "validator"
import { CircularProgressCustom } from "../../base_component/spinner"
import Moment from 'moment'
import { LOCAL_STORAGE_USER_ID } from "../../../helpers/consts"

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

function Tooltiplist(props) {
    var list = []
    props.data.map((row,key) => {
        list.push(row.name)
    })
    var lists = list.join(", ")
    return <React.Fragment>{lists}</React.Fragment>
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
            var data = await getListPwdApi()
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

    const copyPass = (pass) => {
        if ("clipboard" in navigator) {
            navigator.clipboard.writeText(pass)
        } else {
            document.execCommand("copy", true, pass)
        }
        setToast(true)
    }

    const closeToast = (event, reason) => {
        if (reason === "clickaway") {
            return
        }
        setToast(false)
    }

    return <BaseLayout title="HSAM">
        <Box className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={12} xl={8}>
                        <h1 className="mb-3">HSAM</h1>
                        <Box className="card no-padding">
                            <Box className="p-3 display-space-between">
                                <Box className="search-bar me-3" style={{width: "25%"}}>
                                    <TextField
                                        variant="standard"
                                        placeholder="Search Category…"
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
                                <ButtonGroup variant="outlined" color="default" aria-label="split button">
                                    <Button onClick={() => {
                                        setData(null)
                                        setOpenForm(true)
                                        }}>
                                        <Icon>add</Icon>New Password
                                    </Button>
                                </ButtonGroup>
                            </Box>
                            <Divider/>
                            <TableContainer component={Card}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={12}>No</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell>App / URL</TableCell>
                                            <TableCell>Username</TableCell>
                                            <TableCell>Password</TableCell>
                                            <TableCell>Shares</TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {listData?.map((row, key) => (
                                        <TableRow key={key} className={classes.root}>
                                            <TableCell>{key+1+(page*rowsPerPage)}</TableCell>
                                            <TableCell>{row.category}</TableCell>
                                            <TableCell>
                                                {validator.isURL(row.app_url) && 
                                                <Link href={`http://${row.app_url}`}>{row.app_url}</Link>
                                                }
                                                {validator.isURL(row.app_url) == false && 
                                                <React.Fragment>{row.app_url}</React.Fragment>
                                                }
                                            </TableCell>
                                            <TableCell>{row.username}</TableCell>
                                            <TableCell>
                                                <Tooltip title={row.password} placement="bottom" classes={{tooltip:classes.customWidth}}>
                                                    <IconButton>
                                                        <Icon onClick={() => copyPass(row.password)}>key</Icon>
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
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
                                                {userId == row.user_id &&
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
                                            <TableCell colspan={7} className="text-center text-muted" align="center">No data to show</TableCell>
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
                        </Box>
                </Grid>
            </Grid>
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <AlertDialog open={openDialog} cancelAction={() => setOpenDialog(false)} okAction={() => deletePwd()} title="Delete confirmation" body="Are you sure want to delete this record?" />
            <PwdForm open={openForm} closeModal={refreshListPwd} pwd={data} />
            <Snackbar open={toast} autoHideDuration={2000} onClose={closeToast}>
                <Alert onClose={closeToast} severity="info">Password copied</Alert>
            </Snackbar>
        </Box>
    </BaseLayout>
}