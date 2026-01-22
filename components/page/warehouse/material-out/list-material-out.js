import { Button, ButtonGroup, Card, makeStyles, Divider, Grid, Icon, IconButton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography, Box, TextField, Backdrop, CircularProgress, Collapse } from "@material-ui/core"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import getRoute from "../../../../helpers/router"
import { AssignmentReturned,KeyboardArrowUp,KeyboardArrowDown } from '@material-ui/icons'
import { getListWOApi,deleteWOApi,getDetailWOApi } from "../../../../services/api/wo.api"
import ReleaseForm from "./release-form"
import BaseLayoutWarehouse from "../../../base_layout/base-layout-warehouse"
import AlertDialog from "../../../base_component/dialog"
import Moment from 'moment'
import { CircularProgressCustom } from "../../../base_component/spinner"
import { exportWorkMaterial } from "../../../../services/export/export-wo"

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

function Row(props) {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [usedList, setUsedList] = useState([])
    const [completed, setCompleted] = useState(true)

    useEffect(async () => {
        var used = []
        for (var i=0; i<props.row.materials.length; i++) {
            if (props.row.history != undefined) {
                var histQty = 0
                for (var j=0; j<props.row.history.length; j++) {
                    for (var k=0; k<props.row.history[j].material.length; k++) {
                        if (props.row.history[j].material[k].material_id == props.row.materials[i].material_id) {
                            histQty += props.row.history[j].material[k].qty
                        }
                    }
                }
                used.push({qty:histQty})
                if (histQty < props.row.materials[i].qty) {
                    setCompleted(false)
                }
            } else {
                used.push({qty:0})
                setCompleted(false)
            }
        }
        setUsedList(used)
    }, [])
    
    return (
      <React.Fragment>
        <TableRow key={props.keys} className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell>{props.keys+1+(props.page*props.rowsPerPage)}</TableCell>
          <TableCell>{props.row.wo_number}</TableCell>
          <TableCell>{Moment(props.row.wo_date).format("LL")}</TableCell>
          <TableCell>{props.row.project}</TableCell>
          <TableCell>{props.row.remark}</TableCell>
          <TableCell>
            {!completed && 
                <IconButton>
                    <AssignmentReturned onClick={() => props.clickModify()} />
                </IconButton>
            }
            {completed && 
                <Box className="flex-center">
                    <Icon style={{fontSize: 14, marginRight: 4}} color="secondary">check_circle</Icon> 
                    <small className="text-muted">Completed</small>
                </Box>
            }
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h3" gutterBottom component="div">
                  Materials
                </Typography>
                <Table size="small" aria-label="materials">
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Material Desc</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Used</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.row.materials?.map((item, key) => (
                      <TableRow key={key}>
                        <TableCell>{item.detail.code}</TableCell>
                        <TableCell>{item.detail.material_name}</TableCell>
                        <TableCell>{item.qty} {item.unit}</TableCell>
                        <TableCell>{usedList[key]?.qty} {item.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
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
    const [exportLoading, setExportLoading] = useState(false)

    useEffect(async () => {
        try {
            setOpen(true)
            var data = await getListWOApi()
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
            var data = await getListWOApi(search,newPage,rowsPerPage)
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
            var data = await getListWOApi(search,0,parseInt(event.target.value, 10))
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
            var data = await getListWOApi(search,0,rowsPerPage)
            setRowCount(data.total)
            setListData(data.result)
            setPage(0)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    const refreshListWO = async () => {
        setOpenForm(false)
        try {
            setOpen(true)
            var data = await getListWOApi(search,page,rowsPerPage)
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
        var result = await getDetailWOApi(id)
        setData({id:id,wo_number:result.wo_number,wo_date:result.wo_date,project:result.project,remark:result.remark,materials:result.materials,detail:result.detail,history:result.history})
        setOpen(false)
        setOpenForm(true)
    }

    const exportData = async () => {
        setExportLoading(true)
        try {
            await exportWorkMaterial(rowCount)
        } catch (err) {
            
        }
        setExportLoading(false)
    }

    return <BaseLayoutWarehouse title="Material Out">
        <Box className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={8}>
                        <h1 className="mb-3">Material Out</h1>
                        <Box className="card no-padding">
                            <Box className="p-3 display-space-between">
                                <Box className="search-bar me-3" style={{width: "25%"}}>
                                    <TextField
                                        variant="standard"
                                        placeholder="Search WO Number…"
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
                                        onClick={exportData}>
                                        {exportLoading && <CircularProgressCustom size={20}/>}
                                        {!exportLoading && <div className="flex-center"><Icon className="me-2">download</Icon> Export</div>}
                                    </Button>
                                </ButtonGroup>
                            </Box>
                            <Divider/>
                            <TableContainer component={Card}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={12} />
                                            <TableCell width={12}>No</TableCell>
                                            <TableCell>WO Number</TableCell>
                                            <TableCell>WO Date</TableCell>
                                            <TableCell>Project</TableCell>
                                            <TableCell>Remarks</TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {listData?.map((row, key) => (
                                        <Row keys={key} row={row} clickModify={() => editForm(row.id)} page={page} rowsPerPage={rowsPerPage} />
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
            <AlertDialog open={openDialog} cancelAction={() => setOpenDialog(false)} okAction="" title="Delete confirmation" body="Are you sure want to delete this record?" />
            <ReleaseForm open={openForm} closeModal={refreshListWO} wo={data} />
        </Box>
    </BaseLayoutWarehouse>
}