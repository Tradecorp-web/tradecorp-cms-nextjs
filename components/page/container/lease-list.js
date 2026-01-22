import { Button, ButtonGroup, Card, Popper, Divider, Grow, Grid, Icon, IconButton, InputBase, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Tooltip, Typography, Paper, ClickAwayListener, MenuList, Checkbox, Box, TableSortLabel, makeStyles, Backdrop, CircularProgress, FormControl, Popover, TextField, Input, ListItemText, Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormGroup, FormControlLabel, Switch, Collapse } from '@material-ui/core';
import { Alert } from "@material-ui/lab"
import { Delete, Done, Send } from '@material-ui/icons'
import BaseLayout from '../../base_layout/base-layout';
import { useRouter } from 'next/router';
import getRoute from '../../../helpers/router';
import AlertDialog from "../../base_component/dialog";
import React, { useEffect, useRef, useState } from 'react';
import { getLeasedContainerStockSwr } from '../../../services/swr/container-stock.swr';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import { deleteContainerApi, getContainerOptionApi, deleteManyContainersApi, updateContainerDepoApi } from '../../../services/api/container-stocks.api';
import { masterDataSwr } from '../../../services/swr/master-data.swr';
import { getDetailDepoSwr, getListDepoSwr } from "../../../services/swr/depo.swr";
import { countDays, dateFormat, currency, isPermit } from '../../../helpers/general';
import Moment from "moment";

const useStyles = makeStyles((theme) => ({
  popper: {
      zIndex: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
  selectLabel: {
    top: -10,
    left: 5,
    backgroundColor: "white",
    zIndex: 1,
    padding: "1px 5px",
  },
}))

export default function StockContainerPage() {

  const classes = useStyles()
  const router = useRouter()

  function openDetail(e, url) {
    e.preventDefault();
    router.push(url)
  }

  // ==========================================
  // [START] GET DATA & PAGINATION
  // ------------------------------------------
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(20)
  
  const [isLoading, setLoading] = useState(false)
  const [dataList, setDataList] = useState([])
  const [checkList, setCheckList] = useState([])
  const [param, setParam] = useState({page:(page+1).toString(),limit:limit.toString(),orderBy:"serial_number",order:"asc",serial_number:null,size_id:null,type_id:null,number:null,company:null,from_date:null,to_date:null})
  const [choice, setChoice] = useState({size_id:[],type_id:[]})
  const [anchor, setAnchor] = useState({serial_number:null,size_id:null,type_id:null,number:null,company:null,from_date:null,to_date:null})

  var headCells = [
    {id:"serial_number",label:"Serial Number",sort:true,filter:true,filter_type:"string"},
    {id:"size_id",label:"Size",sort:true,filter:true,filter_type:"select"},
    {id:"type_id",label:"Type",sort:true,filter:true,filter_type:"select"},
    {id:"number",label:"Agreement Number",sort:true,filter:true,filter_type:"string"},
    {id:"company",label:"Company Name",sort:true,filter:true,filter_type:"string"},
    {id:"from_date",label:"From",sort:true,filter:true,filter_type:"date"},
    {id:"to_date",label:"To",sort:true,filter:true,filter_type:"date"},
  ]

  const columnCount = headCells.length + 1

  var listContainerStockSwr = getLeasedContainerStockSwr(param)
  useEffect(() => {
    setLoading(listContainerStockSwr?.isLoading)
    if(listContainerStockSwr?.data?.result.length > 0) {
      setTotal(listContainerStockSwr?.data?.total)
      setDataList(listContainerStockSwr?.data?.result)
      if (checkList.length == 0) {
        var check = []
        for (var i=0; i<listContainerStockSwr.data.result.length; i++) {
          check[i] = false
        }
        setCheckList(check)
      }
    } else {
      setTotal(0)
      setDataList([])
      setCheckList([])
    }
  }, [listContainerStockSwr?.data])

  const [masterData, setMasterData] = useState(null)
  const [sizeOptions, setSizeOptions] = useState([])
  const [typeOptions, setTypeOptions] = useState([])

  var masterSwr = masterDataSwr("")
  useEffect(() => {
    if(masterSwr?.data) {
      setSizeOptions(masterSwr?.data?.filter(val => val?.category == "container_size") ?? [])
      setTypeOptions(masterSwr?.data?.filter((val) => val?.category == "container_type") ?? [])
      setMasterData(masterSwr?.data)
    }
  }, [masterSwr?.data])

  useEffect(() => {
    if (masterData != null) {
      getContainerOptionApi()
      .then(res => {
        if (res.size_option.length > 0) {
          setSizeOptions(masterData.filter(val => val?.category == "container_size" && res.size_option.indexOf(val?.id) !== -1) ?? [])
        }
        if (res.type_option.length > 0) {
          setTypeOptions(masterData.filter((val) => val?.category == "container_type" && res.type_option.indexOf(val?.id) !== -1) ?? [])
        }
      })
    }
  }, [masterData])

  const changeFilter = (e) => {
    if (Array.isArray(e.target.value)) {
      setChoice({...choice, [e.target.name]: e.target.value})
      setParam({...param, [e.target.name]: JSON.stringify(e.target.value)})
    } else {
      setParam({...param, [e.target.name]: e.target.value.toString()})
    }
  }

  const changeSort = (field) => {
    const isAsc = param.orderBy === field && param.order === "asc"
    if (isAsc) {
      setParam({...param, orderBy: field, order: "desc"})
    } else {
      setParam({...param, orderBy: field, order: "asc"})
    }
  }

  const toggleFilter = (event,name) => {
    if (event == null) {
      setAnchor({...anchor, [name]: null})
    } else {
      setAnchor({...anchor, [name]: event.currentTarget})
    }
  }

  const selectedChoice = (name,selected) => {
    var out = []
    if (name == "size_id") {
      sizeOptions.map((item,i) => {
        if (selected.includes(item.id)) {
          out.push(item.name)
        }
      })
    } else if (name == "type_id") {
      typeOptions.map((item,i) => {
        if (selected.includes(item.id)) {
          out.push(item.name)
        }
      })
    }
    return out.join(",")
  }

  const clearFilter = () => {
    setChoice({size_id:[],type_id:[]})
    setParam({page:(page+1).toString(),limit:limit.toString(),orderBy:"serial_number",order:"asc",serial_number:null,size_id:null,type_id:null,number:null,company:null,from_date:null,to_date:null})
  }
  // ------------------------------------------
  // [END] GET DATA & PAGINATION
  // ==========================================

  // useEffect(() => {
  //   setFormState({...formState, ['size']: "all"})
  //   setFormState({...formState, ['status']: "all"})
  //   setFormState({...formState, ['condition']: "all"})
  // }, [])

  // *-----<Pagination>-----*
  const handleChangePage = async (event, newPage) => {
    setPage(newPage)
    setParam({...param, page: (newPage+1).toString()})
  }

  const handleChangeRowsPerPage = async (event) => {
      setPage(0)
      setLimit(parseInt(event.target.value))
      setParam({...param, limit: event.target.value})
  }

   const isAdmin = isPermit("menu","admin")

  // *----------<Toast>-----------------*
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

  return (
    <BaseLayout title="Leased Container">
      <Box className="p-5 content-wrapper">
        <Grid container className="page-container" alignItems="center" justify="center">
          <Grid item xs={12} lg={12} xl={10}>
            <h1 className="mb-3">Leased Container</h1>
            <Box className="card no-padding">
                <Box className="p-3 display-space-between">
                  <Box className="flex-center me-3" style={{flexGrow:1,minHeight:32}}>
                    
                  </Box>
                </Box>
                <Divider />
                <TableContainer>
                    <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                                <TableCell width={12}>No</TableCell>
                                {headCells.map((headCell) => (
                                  <React.Fragment>
                                    {!headCell.sort &&
                                      <TableCell style={{borderLeft:"1px solid #e0e0e0",borderRight:"1px solid #e0e0e0"}}>
                                        <Box style={{whiteSpace:"nowrap"}}>{headCell.label}</Box>
                                      </TableCell>
                                    }
                                    {headCell.sort &&
                                    <TableCell
                                      key={headCell.id}
                                      sortDirection={param.orderBy === headCell.id ? param.order : false}
                                      style={{borderLeft:"1px solid #e0e0e0",borderRight:"1px solid #e0e0e0"}}
                                    >
                                      <Box className="display-space-between" style={{whiteSpace:"nowrap"}}>
                                        <TableSortLabel
                                          active={param.orderBy === headCell.id}
                                          direction={param.orderBy === headCell.id ? param.order : "asc"}
                                          onClick={() => changeSort(headCell.id)}
                                        >
                                          {headCell.label}
                                        </TableSortLabel>
                                        <IconButton size="small" edge="end" onClick={(e) => toggleFilter(e,headCell.id)}><Icon>more_vert</Icon></IconButton>
                                        <Popover
                                          id={headCell.id+"-el"}
                                          open={Boolean(anchor[headCell.id])}
                                          anchorEl={anchor[headCell.id]}
                                          onClose={() => toggleFilter(null,headCell.id)}
                                          anchorOrigin={{
                                            vertical:"bottom",
                                            horizontal:"right",
                                          }}
                                          transformOrigin={{
                                            vertical:"top",
                                            horizontal:"right",
                                          }}
                                        >
                                          <Paper className="p-1">
                                            {(headCell.filter && headCell.id == "size_id") &&
                                            <FormControl className={classes.formControl}>
                                              <InputLabel id="size-id-label" className={classes.selectLabel}>{headCell.label}</InputLabel>
                                              <Select
                                                labelId="size-id-label"
                                                name={headCell.id}
                                                style={{width:"100px"}}
                                                multiple
                                                variant="outlined"
                                                value={choice[headCell.id]}
                                                renderValue={(selected) => selectedChoice(headCell.id,selected)}
                                                size="small"
                                                margin="dense"
                                                onChange={changeFilter}
                                              >
                                                {sizeOptions?.map((row, key) => {
                                                  return (
                                                    <MenuItem key={key} value={row.id}>
                                                      <Checkbox checked={choice[headCell.id].indexOf(row.id) > -1} />
                                                      <ListItemText primary={row.name} />
                                                    </MenuItem>
                                                  );
                                                })}
                                              </Select>
                                            </FormControl>}
                                            {(headCell.filter && headCell.id == "type_id") &&
                                            <FormControl className={classes.formControl}>
                                              <InputLabel id="type-id-label" className={classes.selectLabel}>{headCell.label}</InputLabel>
                                              <Select
                                                labelId="type-id-label"
                                                name={headCell.id}
                                                style={{width:"200px"}}
                                                multiple
                                                variant="outlined"
                                                value={choice[headCell.id]}
                                                renderValue={(selected) => selectedChoice(headCell.id,selected)}
                                                size="small"
                                                margin="dense"
                                                onChange={changeFilter}
                                              >
                                                {typeOptions?.map((row, key) => {
                                                  return (
                                                    <MenuItem key={key} value={row.id}>
                                                      <Checkbox checked={choice[headCell.id].indexOf(row.id) > -1} />
                                                      <ListItemText primary={row.name} />
                                                    </MenuItem>
                                                  );
                                                })}
                                              </Select>
                                            </FormControl>}
                                            {(headCell.filter && headCell.filter_type == "numeric") &&
                                            <TextField
                                              name={headCell.id}
                                              label={headCell.label}
                                              variant="outlined"
                                              type="number"
                                              style={{width:"170px"}}
                                              value={param[headCell.id]}
                                              size="small"
                                              margin="dense"
                                              onChange={changeFilter}
                                              InputProps={{
                                                "aria-label": "search",
                                                endAdornment: (
                                                  <IconButton onClick={() => toggleFilter(null,headCell.id)} size="small">
                                                    <Icon>search</Icon>
                                                  </IconButton>
                                                ),
                                                inputProps: {min:0}
                                              }}
                                            />}
                                            {(headCell.filter && headCell.filter_type == "date") &&
                                            <TextField
                                              name={headCell.id}
                                              variant="outlined"
                                              type="date"
                                              style={{width:"200px"}}
                                              value={param[headCell.id]}
                                              size="small"
                                              margin="dense"
                                              onChange={changeFilter}
                                              InputProps={{
                                                "aria-label": "search",
                                                endAdornment: (
                                                  <IconButton onClick={() => toggleFilter(null,headCell.id)} size="small">
                                                    <Icon>search</Icon>
                                                  </IconButton>
                                                ),
                                              }}
                                            />}
                                            {(headCell.filter && headCell.filter_type == "string") &&
                                            <TextField
                                              name={headCell.id}
                                              label={headCell.label}
                                              variant="outlined"
                                              style={{width:"200px"}}
                                              value={param[headCell.id]}
                                              size="small"
                                              margin="dense"
                                              onChange={changeFilter}
                                              InputProps={{
                                                "aria-label": "search",
                                                endAdornment: (
                                                  <IconButton onClick={() => toggleFilter(null,headCell.id)} size="small">
                                                    <Icon>search</Icon>
                                                  </IconButton>
                                                ),
                                              }}
                                            />}
                                          </Paper>
                                        </Popover>
                                      </Box>
                                    </TableCell>}
                                  </React.Fragment>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {!isLoading && dataList.map((data, index) => (
                            <TableRow key={index} hover={true}>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{index + 1 + (page*limit)}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.serial_number}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.size?.name}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.type?.name}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.agreement?.number}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.agreement?.customer?.company_type} {data?.agreement?.customer?.company}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.agreement?.from_date? Moment(data?.agreement.from_date).format("LL") : "-"}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.agreement?.to_date? Moment(data?.agreement.to_date).format("LL") : "-"}</TableCell>
                            </TableRow>
                        ))}
                        {(isLoading) && <TableRow>
                            <TableCell colSpan={columnCount} className="text-center text-muted" align="center">
                                Loading...
                            </TableCell>
                        </TableRow>}
                        {(!isLoading && dataList?.length <= 0) && <TableRow>
                            <TableCell colSpan={columnCount} className="text-center text-muted" align="center">
                                No Data
                            </TableCell>
                        </TableRow>}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[10, 20, 50, 100]}
                                    colSpan={columnCount}
                                    count={total}
                                    rowsPerPage={limit}
                                    page={page}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}/>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Snackbar open={toast.show} autoHideDuration={2000} onClose={closeToast}>
          <Alert onClose={closeToast} severity="error">{toast.message}</Alert>
      </Snackbar>
    </BaseLayout>
  )
}