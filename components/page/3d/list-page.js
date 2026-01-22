import { Button, ButtonGroup, Card, Divider, Grid, Icon, IconButton, InputBase, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, TablePagination, Tooltip, Typography, Box, makeStyles, Backdrop, CircularProgress } from "@material-ui/core"
import { Delete } from '@material-ui/icons'
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import Moment from 'moment'
import { getListDesignApi, deleteDesignApi } from "../../../services/api/3d.api"
import getRoute from "../../../helpers/router"
import BaseLayout from "../../base_layout/base-layout-design"
import AlertDialog from "../../base_component/dialog"

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

    function openDesign(e, url) {
        e.preventDefault();
        router.push(url)
    }

    const confirmDelete = (id) => {
        setIdData(id)
        setOpenDialog(true)
    }

    const deleteDesign = async () => {
        setOpenDialog(false)
        try {
            setOpen(true)
            var res = await deleteDesignApi(idData)
            var data = await getListDesignApi()
            setListData(data)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    useEffect(async () => {
        try {
            setOpen(true)
            var data = await getListDesignApi()
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
            var data = await getListDesignApi(newPage,rowsPerPage)
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
            var data = await getListDesignApi(0,parseInt(event.target.value, 10))
            setRowCount(data.total)
            setListData(data.result)
            setPage(0)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    // const refreshListDesign = async () => {
    //     setOpenForm(false)
    //     try {
    //         setOpen(true)
    //         var data = await getListDesignApi(page,rowsPerPage)
    //         setRowCount(data.total)
    //         setListData(data.result)
    //         setOpen(false)
    //     } catch(err) {
    //         console.log(err)
    //         setOpen(false)
    //     }
    // }

    return (
        <BaseLayout title="3D">
            <Grid container className="page-container">
                <Grid item lg={3} xl={2}>
                    <Box className="sidebar-wrapper">
                        <Box className="sidebar-header">
                            <Box className="sidebar-title mb-0">
                                <h2>Filter</h2>
                            </Box>
                        </Box>
                        <Box className="sidebar-content padding">
                            <Box className="mb-3">
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Search</Typography>
                                </InputLabel>
                                <InputBase className="input bold" placeholder="Type name of 3D design" fullWidth/>
                            </Box>
                            <Box className="mb-3">
                                <Button color="primary" fullWidth variant="contained" disableElevation>
                                    Use Filter
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={9} xl={10}>
                    <Box className="p-5 content-wrapper">
                        <Box className="display-space-between">
                            <h1 className="mb-3">3D Design</h1>
                            <ButtonGroup color="secondary" aria-label="primary button group" variant="contained" disableElevation>
                                <Tooltip title="Create New Design" placement="top">
                                    <Button onClick={(e) => openDesign(e, getRoute('3d.design', {id: ""}))}><Icon size="small">add</Icon></Button>
                                </Tooltip>
                                <Tooltip title="Import Design" placement="top">
                                    <Button onClick={() => setOpenImport(true)}><Icon size="small">archive</Icon></Button>
                                </Tooltip>
                            </ButtonGroup>
                        </Box>
                        <Box className="card no-padding">
                            <TableContainer component={Card}>
                                <Table aria-label="3D Design List">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No</TableCell>
                                            <TableCell>Design Name</TableCell>
                                            <TableCell>Client</TableCell>
                                            <TableCell>Create Date</TableCell>
                                            <TableCell>Update Date</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {listData?.map((row, key) => (
                                        <TableRow key={key} hover>
                                            <TableCell width={12} onClick={(e) => openDesign(e, getRoute('3d.design', {id: row.id}))}>{key+1+(page*rowsPerPage)}</TableCell>
                                            <TableCell onClick={(e) => openDesign(e, getRoute('3d.design', {id: row.id}))}>{row.name}</TableCell>
                                            <TableCell onClick={(e) => openDesign(e, getRoute('3d.design', {id: row.id}))}>{row.client}</TableCell>
                                            <TableCell width={250} onClick={(e) => openDesign(e, getRoute('3d.design', {id: row.id}))}>{Moment(row.created_at).format("LLLL")}</TableCell>
                                            <TableCell width={250} onClick={(e) => openDesign(e, getRoute('3d.design', {id: row.id}))}>{Moment(row.updated_at).format("LLLL")}</TableCell>
                                            <TableCell width={12}>
                                                <IconButton>
                                                    <Delete onClick={() => confirmDelete(row.id)} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {listData?.length == 0 && 
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">No data to show</TableCell>
                                        </TableRow>
                                    }
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination 
                                                rowsPerPageOptions={[20, 50, 100]}
                                                colSpan={6}
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
                    </Box>
                </Grid>
            </Grid>
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <AlertDialog open={openDialog} cancelAction={() => setOpenDialog(false)} okAction={() => deleteDesign()} title="Delete confirmation" body="Are you sure want to delete this design?" />
            
        </BaseLayout>
    )
}