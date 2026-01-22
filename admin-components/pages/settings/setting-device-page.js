import { Button, Grid, Icon, IconButton, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Backdrop, CircularProgress, TablePagination, TableFooter, Box, Switch, FormControlLabel, Tooltip } from "@material-ui/core"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { getListDeviceApi, saveDeviceApi, deleteDeviceApi } from "../../../services/api/device.api"
import AdminBaseLayout from "../../base_layout/admin_base_layout"
import { Delete } from '@material-ui/icons'
import AlertDialog from "../../../components/base_component/dialog"
import Moment from 'moment'

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
}))

export default function Page() {
    const router = useRouter()
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [idData, setIdData] = useState(null)
    const [listData, setListData] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [rowCount, setRowCount] = useState(0)
    const [permit, setPermit] = useState([])

    const confirmDelete = (id) => {
        setIdData(id)
        setOpenDialog(true)
    }

    const deleteDevice = async () => {
        setOpenDialog(false)
        try {
            setOpen(true)
            var res = await deleteDeviceApi(idData)
            var data = await getListDeviceApi()
            var pmt = []
            for (var i=0; i<data.total; i++) {
                pmt[i] = data.result[i]?.permit ?? false
            }
            setPermit(pmt)
            setRowCount(data.total)
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
            var data = await getListDeviceApi()
            var pmt = []
            for (var i=0; i<data.total; i++) {
                pmt[i] = data.result[i]?.permit ?? false
            }
            setPermit(pmt)
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
            var data = await getListDeviceApi("",newPage,rowsPerPage)
            var pmt = []
            for (var i=0; i<data.total; i++) {
                pmt[i] = data.result[i]?.permit ?? false
            }
            setPermit(pmt)
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
            var data = await getListDeviceApi("",0,parseInt(event.target.value, 10))
            var pmt = []
            for (var i=0; i<data.total; i++) {
                pmt[i] = data.result[i]?.permit ?? false
            }
            setPermit(pmt)
            setRowCount(data.total)
            setListData(data.result)
            setPage(0)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    const refreshListDevice = async () => {
        setOpenForm(false)
        try {
            setOpen(true)
            var data = await getListDeviceApi("",page,rowsPerPage)
            var pmt = []
            for (var i=0; i<data.total; i++) {
                pmt[i] = data.result[i]?.permit ?? false
            }
            setPermit(pmt)
            setRowCount(data.total)
            setListData(data.result)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    const handleChange = (event, id, pos) => {
        var data = {id:id,permit:event.target.checked}
        var pmt = [...permit]
        pmt[pos] = event.target.checked
        setPermit(pmt)
        saveDeviceApi(data).then((res) => {
            
        }).catch((err) => {
            console.log(err)
        })
    }

    return ( <AdminBaseLayout title="Permitted Devices">
        <Grid container spacing={4}>
            <Grid item lg={12}>
                <Box className="card no-padding">
                    <TableContainer>
                        <Table aria-label="Device List">
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>IP Address</TableCell>
                                    <TableCell>User Agent</TableCell>
                                    <TableCell>Device ID</TableCell>
                                    <TableCell>Login Attempt Date</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {listData?.map((row, key) => (
                                <TableRow key={key}>
                                    <TableCell>{key+1+(page*rowsPerPage)}</TableCell>
                                    <TableCell>{row.user.username}</TableCell>
                                    <TableCell>{row.user.name}</TableCell>
                                    <TableCell>{row.ip_address}</TableCell>
                                    <TableCell>{row.user_agent}</TableCell>
                                    <TableCell>{row.device_id}</TableCell>
                                    <TableCell>{Moment(row.created_at).format("LLL")}</TableCell>
                                    <TableCell>
                                        <FormControlLabel
                                            control={<Switch checked={permit[key]} onChange={(e) => handleChange(e,row.id,key)} />}
                                            label="Permit"
                                        />
                                        <Tooltip title="Delete" placement="top">
                                            <IconButton>
                                                <Delete onClick={() => confirmDelete(row.id)} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {listData?.length == 0 && 
                                <TableRow>
                                    <TableCell colspan={8} align="center">No data to show</TableCell>
                                </TableRow>
                            }
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination 
                                        rowsPerPageOptions={[2, 20, 50, 100]}
                                        colSpan={8}
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
                <Backdrop className={classes.backdrop} open={open}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <AlertDialog open={openDialog} cancelAction={() => setOpenDialog(false)} okAction={() => deleteDevice()} title="Delete confirmation" body="Are you sure want to delete this device?" />
            </Grid>
        </Grid>
    </AdminBaseLayout> )
}