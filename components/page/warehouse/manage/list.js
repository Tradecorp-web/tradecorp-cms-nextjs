import { Button, ButtonGroup, Card, makeStyles, Divider, Grid, Icon, IconButton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography, Box, TextField, Backdrop, CircularProgress, Collapse } from "@material-ui/core"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { Delete } from '@material-ui/icons'
import { getListWHApi,deleteWHApi,getDetailWHApi } from "../../../../services/api/warehouse.api"
import WarehouseForm from "./form"
import BaseLayoutWarehouse from "../../../base_layout/base-layout-warehouse"
import AlertDialog from "../../../base_component/dialog"

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
}))

export default function Page() {
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

    const confirmDelete = (id) => {
        setIdData(id)
        setOpenDialog(true)
    }

    const deleteWH = async () => {
        setOpenDialog(false)
        try {
            setOpen(true)
            var res = await deleteWHApi(idData)
            var data = await getListWHApi()
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
            var data = await getListWHApi()
            setRowCount(data.total)
            setListData(data.result)
            setPage(0)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }, [])

    const handleChangePage = async (event, newPage) => {
        try {
            setOpen(true)
            var data = await getListWHApi(search,newPage,rowsPerPage)
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
            var data = await getListWHApi(search,0,parseInt(event.target.value, 10))
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
            var data = await getListWHApi(search,0,rowsPerPage)
            setRowCount(data.total)
            setListData(data.result)
            setPage(0)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    const refreshListWH = async () => {
        setOpenForm(false)
        try {
            setOpen(true)
            var data = await getListWHApi(search,page,rowsPerPage)
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
        var result = await getDetailWHApi(id)
        setData({id:id,warehouse_name:result.warehouse_name,pic_id:result.pic_id,remark:result.remark})
        setOpen(false)
        setOpenForm(true)
    }

    return <BaseLayoutWarehouse title="Warehouse Management">
        <Box className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={8}>
                        <h1 className="mb-3">Warehouse Management</h1>
                        <Box className="card no-padding">
                            <Box className="p-3 display-space-between">
                                <Box className="search-bar me-3" style={{width: "25%"}}>
                                    <TextField
                                        variant="standard"
                                        placeholder="Search…"
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
                                    <Button 
                                        onClick={() => {
                                            setData(null)
                                            setOpenForm(true)
                                        }}>
                                        <Icon className="me-2">add</Icon> Add Warehouse
                                    </Button>
                                </ButtonGroup>
                            </Box>
                            <Divider/>
                            <TableContainer component={Card}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={12}>No</TableCell>
                                            <TableCell>Warehouse</TableCell>
                                            <TableCell>PIC</TableCell>
                                            <TableCell>Remarks</TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {listData?.map((row, key) => (
                                        <TableRow key={key} hover className={classes.root}>
                                            <TableCell onClick={() => editForm(row.id)}>{key+1+(page*rowsPerPage)}</TableCell>
                                            <TableCell onClick={() => editForm(row.id)}>{row.warehouse_name}</TableCell>
                                            <TableCell onClick={() => editForm(row.id)}>{row.pic.name}</TableCell>
                                            <TableCell onClick={() => editForm(row.id)}>{row.remark}</TableCell>
                                            <TableCell>
                                                <IconButton>
                                                    <Delete onClick={() => confirmDelete(row.id)} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {listData?.length == 0 && 
                                        <TableRow>
                                            <TableCell colspan={5} className="text-center text-muted" align="center">No data to show</TableCell>
                                        </TableRow>
                                    }
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[20, 50, 100]}
                                                colSpan={5}
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
            <AlertDialog open={openDialog} cancelAction={() => setOpenDialog(false)} okAction={() => deleteWH()} title="Delete confirmation" body="Are you sure want to delete this record?" />
            <WarehouseForm open={openForm} closeModal={refreshListWH} warehouse={data} />
        </Box>
    </BaseLayoutWarehouse>
}