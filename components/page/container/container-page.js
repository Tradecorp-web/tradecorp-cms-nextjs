import { Button, ButtonGroup, Card, Popper, Divider, Grow, Grid, Icon, IconButton, InputBase, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Tooltip, Typography, Paper, ClickAwayListener, MenuList, Checkbox, Box, TableSortLabel, makeStyles, Backdrop, CircularProgress, FormControl, Popover, TextField, Input, ListItemText, Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormGroup, FormControlLabel, Switch, Collapse } from '@material-ui/core';
import { Alert } from "@material-ui/lab"
import { Delete, Done, Send, GetApp } from '@material-ui/icons'
import BaseLayoutStockContainer from '../../base_layout/base-layout-stock-container';
import { useRouter } from 'next/router';
import getRoute from '../../../helpers/router';
import AlertDialog from "../../base_component/dialog";
import React, { useEffect, useRef, useState } from 'react';
import { getListContainerStockSwr, getListContainerStock2Swr } from '../../../services/swr/container-stock.swr';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import { deleteContainerApi, getContainerOptionApi, deleteManyContainersApi, updateContainerDepoApi, downloadContainerApi } from '../../../services/api/container-stocks.api';
import { masterDataSwr } from '../../../services/swr/master-data.swr';
import { getDetailDepoSwr, getListDepoSwr } from "../../../services/swr/depo.swr";
import StockContainerForm from './container-form';
import { countDays, dateFormat, currency, isPermit } from '../../../helpers/general';
import MasterForm from "../../../admin-components/pages/master/data/form";
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

  // const [formState, setFormState] = useState(null)
  // function onChangeInput(e) {
  //   setFormState({...formState, [e.target.name]: e.target.value})
  // }

  function openDetail(e, url) {
    e.preventDefault();
    router.push(url)
  }

  const [openForm, setOpenForm] = useState(false);

  // ==========================================
  // [START] GET DATA & PAGINATION
  // ------------------------------------------
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(20)
  
  // const [search, setSearch] = useState("")
  // const [size, setSize] = useState("")
  // const [yom, setYom] = useState("")
  // const [status, setStatus] = useState("")
  // const [condition, setCondition] = useState("")
  
  const [isLoading, setLoading] = useState(false)
  const [dataList, setDataList] = useState([])
  const [checkList, setCheckList] = useState([])
  const [idList, setIdList] = useState([])
  const [param, setParam] = useState({page:(page+1).toString(),limit:limit.toString(),orderBy:"serial_number",order:"asc",serial_number:null,size_id:null,type_id:null,repair_status_id:null,condition_id:null,percentage:null,yom_year:null,gate_in_date:null,depo_id:null,stock_status_id:null,selling_price:null,owner:null,stock_reconcile:null,remarks:null})
  const [choice, setChoice] = useState({size_id:[],type_id:[],repair_status_id:[],condition_id:[],depo_id:[],stock_status_id:[],stock_reconcile:[]})
  const [anchor, setAnchor] = useState({serial_number:null,size_id:null,type_id:null,repair_status_id:null,condition_id:null,percentage:null,yom_year:null,gate_in_date:null,depo_id:null,stock_status_id:null,selling_price:null,owner:null,stock_reconcile:null,remarks:null})
  
  const sellingPrice = isPermit("component","selling_price_container")
  const costPrice = isPermit("component","cost_price_container")

  var headCells = [
    {id:"serial_number",label:"Serial Number",sort:true,filter:true,filter_type:"string"},
    {id:"size_id",label:"Size",sort:true,filter:true,filter_type:"select"},
    {id:"type_id",label:"Type",sort:true,filter:true,filter_type:"select"},
    {id:"repair_status_id",label:"Repair Status",sort:true,filter:true,filter_type:"select"},
    {id:"condition_id",label:"Condition",sort:true,filter:true,filter_type:"select"},
    {id:"percentage",label:"Percentage",sort:true,filter:true,filter_type:"numeric"},
    {id:"yom_year",label:"YOM",sort:true,filter:true,filter_type:"numeric"},
    {id:"gate_in_date",label:"Gate In Date",sort:true,filter:true,filter_type:"date"},
    {id:"days",label:"Days In Stock",sort:true,filter:true,filter_type:"numeric"},
    {id:"depo_id",label:"Location",sort:true,filter:true,filter_type:"select"},
    {id:"stock_status_id",label:"Sale Status",sort:true,filter:true,filter_type:"select"},
    {id:"owner",label:"Owner",sort:true,filter:true,filter_type:"string"},
    {id:"remarks",label:"Remark",sort:true,filter:true,filter_type:"string"},
  ]

  const columnCount = headCells.length + 3

  var listContainerStockSwr = getListContainerStock2Swr(param)
  // var listContainerStockSwr = getListContainerStockSwr({
  //     search: search, 
  //     page: page+1, 
  //     limit: limit,
  //     orderBy: "serial_number",
  //     order: "asc",
  //     size: size,
  //     yom: yom,
  //     status: status,
  //     condition: condition,
  // })
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
  const [depoList, setDepoList] = useState(null)
  const [conditionOptions, setConditionOptions] = useState([])
  const [statusOptions, setStatusOptions] = useState([])
  const [sizeOptions, setSizeOptions] = useState([])
  const [typeOptions, setTypeOptions] = useState([])
  const [repairOptions, setRepairOptions] = useState([])
  const [depoOptions, setDepoOptions] = useState([])

  var masterSwr = masterDataSwr("")
  useEffect(() => {
    if(masterSwr?.data) {
      setConditionOptions(masterSwr?.data?.filter(val => val?.category == "condition") ?? [])
      setStatusOptions(masterSwr?.data?.filter(val => val?.category == "stock_status") ?? [])
      setSizeOptions(masterSwr?.data?.filter(val => val?.category == "container_size") ?? [])
      setTypeOptions(masterSwr?.data?.filter((val) => val?.category == "container_type") ?? [])
      setRepairOptions(masterSwr?.data?.filter((val) => val?.category == "status_repair") ?? [])
      setMasterData(masterSwr?.data)
    }
  }, [masterSwr?.data])

  var depoSwrList = getListDepoSwr({
    page: 1, 
    limit: 999,
    // isOwn: true
  })
  useEffect(() => {
      if(depoSwrList?.data?.result) {
          setDepoList(depoSwrList?.data?.result ?? [])
          setDepoOptions(depoSwrList?.data?.result ?? [])
      }
  }, depoSwrList.data)

  useEffect(() => {
    if (depoList != null && masterData != null) {
      getContainerOptionApi()
      .then(res => {
        if (res.size_option.length > 0) {
          setSizeOptions(masterData.filter(val => val?.category == "container_size" && res.size_option.indexOf(val?.id) !== -1) ?? [])
        }
        if (res.type_option.length > 0) {
          setTypeOptions(masterData.filter((val) => val?.category == "container_type" && res.type_option.indexOf(val?.id) !== -1) ?? [])
        }
        if (res.stock_status_option.length > 0) {
          setStatusOptions(masterData.filter(val => val?.category == "stock_status" && res.stock_status_option.indexOf(val?.id) !== -1) ?? [])
        }
        if (res.repair_status_option.length > 0) {
          setRepairOptions(masterData.filter((val) => val?.category == "status_repair" && res.repair_status_option.indexOf(val?.id) !== -1) ?? [])
        }
        if (res.condition_option.length > 0) {
          setConditionOptions(masterData.filter(val => val?.category == "condition" && res.condition_option.indexOf(val?.id) !== -1) ?? [])
        }
        if (res.depo_option.length > 0) {
          setDepoOptions(depoList.filter(val => res.depo_option.indexOf(val?.id) !== -1) ?? [])
        }
      })
    }
  }, [depoList,masterData])

  // function changeFilter() {
  //   setPage(0)
  //   setSearch(formState?.serialNumber)
  //   setSize(formState?.size?.id)
  //   setYom(formState?.yom)
  //   setStatus(formState?.status?.id)
  //   setCondition(formState?.condition?.id)
  // }

  const changeFilter = (e) => {
    if (Array.isArray(e.target.value)) {
      setChoice({...choice, [e.target.name]: e.target.value})
      if (e.target.name == "stock_reconcile") {
        if (e.target.value.length == 2) {
          setParam({...param, stock_reconcile: null})
        } else {
          setParam({...param, stock_reconcile: JSON.stringify(e.target.value)})
        }
      } else {
        setParam({...param, [e.target.name]: JSON.stringify(e.target.value)})
      }
    } else {
      setParam({...param, [e.target.name]: e.target.value.toString()})
    }
  }

  const changeSort = (field) => {
    const isAsc = param.orderBy === field && param.order === "asc"
    if (isAsc) {
      // setOrder("desc")
      setParam({...param, orderBy: field, order: "desc"})
    } else {
      // setOrder("asc")
      setParam({...param, orderBy: field, order: "asc"})
    }
    // setOrder(isAsc ? "desc" : "asc")
    // setOrderBy(field)
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
    } else if (name == "repair_status_id") {
      repairOptions.map((item,i) => {
        if (selected.includes(item.id)) {
          out.push(item.name)
        }
      })
    } else if (name == "condition_id") {
      conditionOptions.map((item,i) => {
        if (selected.includes(item.id)) {
          out.push(item.name)
        }
      })
    } else if (name == "depo_id") {
      depoOptions.map((item,i) => {
        if (selected.includes(item.id)) {
          out.push(item.name)
        }
      })
    } else if (name == "stock_status_id") {
      statusOptions.map((item,i) => {
        if (selected.includes(item.id)) {
          out.push(item.name)
        }
      })
    } else if (name == "stock_reconcile") {
      selected.map((item,i) => {
        if (item == "Y") {
          out.push("Yes")
        } else if (item == "N") {
          out.push("No")
        }
      })
    }
    return out.join(",")
  }

  const clearFilter = () => {
    setChoice({size_id:[],type_id:[],repair_status_id:[],condition_id:[],depo_id:[],stock_status_id:[],stock_reconcile:[]})
    setParam({page:(page+1).toString(),limit:limit.toString(),orderBy:"serial_number",order:"asc",serial_number:null,size_id:null,type_id:null,repair_status_id:null,condition_id:null,percentage:null,yom_year:null,gate_in_date:null,depo_id:null,stock_status_id:null,selling_price:null,owner:null,stock_reconcile:null,remarks:null})
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

   // *----<Menu Options>----*
   const [openMenu, setOpenMenu] = useState(false);
   const anchorRef = useRef(null);

   const handleMenuItemClick = (e, index) => {
       e.preventDefault()
       var menu = options[index]
       if(menu?.value == 1) {
           router.push(getRoute("product.category"))
       }
       setOpenMenu(false);
   };
   
   const handleToggle = () => {
       setOpenMenu(!openMenu);
   };

   const handleClose = (event) => {
       if (anchorRef.current && anchorRef.current.contains(event.target)) {
           return;
       }
       setOpenMenu(false);
   };

   const isAdmin = isPermit("menu","admin")

   const options = [
       {name: "Manage Product Category", value: 1},
   ]
   // *----<Menu Options>----*

  // *----<Delete Items>----*
  const [isOpenConfirmationDialog, setOpenConfirmationDialog] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(-1)
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false)
  const [busy, setBusy] = useState(false)

  function confirmDelete(index) {
      setDeleteIndex(index)
      setOpenConfirmationDialog(true)
  }

  const deleteData = async () => {
      setOpenConfirmationDialog(false)
      var data = dataList[deleteIndex]
      dataList.splice(deleteIndex, 1)
      setDataList(dataList)
      await deleteContainerApi(data?.id)
      var check = []
      for (var i=0; i<dataList.length; i++) {
        check[i] = false
      }
      setIdList([])
      setCheckList(check)
  }
  // *----<Delete Items>----*

  const onCheckChange = (event,id,i) => {
    var list = [...idList]
    var check = [...checkList]
    check[i] = event.target.checked
    if (event.target.checked) {
      list.push({id:id,index:i})
    } else {
      for (var j=0; j<list.length; j++) {
        if (list[j].id == id) {
          list.splice(j,1)
        }
      }
    }
    setIdList(list)
    setCheckList(check)
  }

  const selectAll = (event) => {
    if (event.target.checked) {
      var list = []
      var check = []
      for (var i=0; i<dataList.length; i++) {
        list[i] = {id:dataList[i].id,index:i}
        check[i] = true
      }
      setIdList(list)
      setCheckList(check)
    } else {
      var check = []
      for (var i=0; i<dataList.length; i++) {
        check[i] = false
      }
      setIdList([])
      setCheckList(check)
    }
  }

  const confirmDeleteAll = () => {
    setDeleteAllConfirm(true)
  }

  const deleteAll = async () => {
    setDeleteAllConfirm(false)
    setBusy(true)
    var list = [...dataList]
    var select = [...idList]
    var check = []
    var listID = []
    var newSwr = listContainerStockSwr.data
    for (var i=0; i<select.length; i++) {
      listID.push(select[i].id)
      list.splice(select[i].index, 1)
    }
    await deleteManyContainersApi(listID)
    for (var i=0; i<dataList.length; i++) {
      check[i] = false
    }
    newSwr.result = list
    listContainerStockSwr.mutate(newSwr, true)
    setDataList(list)
    setIdList([])
    setCheckList(check)
    setBusy(false)
  }

  const refreshData = (id="") => {
    if (id != "") {
      var newSwr = listContainerStockSwr.data
      var newData = dataList.filter((r) => r.batch_id !== id)
      newSwr.result = newData
      listContainerStockSwr.mutate(newSwr, true)
      setDataList(newData)
    } else {
      listContainerStockSwr.mutate()
    }
  }

  const [openHistory, setOpenHistory] = useState(false)

  // *----------<Master Data>-----------------*

  const [openMaster, setOpenMaster] = useState(false)
  const [master, setMaster] = useState(null)
  const [newOptionImport, setNewOptionImport] = useState(null)
  const [newOptionInsert, setNewOptionInsert] = useState(null)
  const [lastForm, setLastForm] = useState("")

  const addMaster = (category,form) => {
    setMaster({id: null, name: null, alias: null, category: category})
    setLastForm(form)
    setOpenImport(false)
    setOpenMaster(true)
  }

  const refreshMaster = (update) => {
    masterSwr.mutate()
    setNewOptionInsert(update)
    setOpenForm(true)
    setOpenMaster(false)
  }

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

  // *----<Move Container>----*
  const [showMove, setShowMove] = useState(false)
  const [newDepo, setNewDepo] = useState({depo_id:null, stock_depo_id:null})
  const [advanceMove, setAdvanceMove] = useState(false)

  const changeDepoDest = (e) => {
    if (advanceMove) {
      setNewDepo({...newDepo, depo_id:e.target.value})
    } else {
      setNewDepo({depo_id:e.target.value, stock_depo_id: e.target.value})
    }
  }
  const changeDepoListing = (e) => {
    setNewDepo({...newDepo, stock_depo_id:e.target.value})
  }

  const toggleAdvance = (e) => {
    setAdvanceMove(e.target.checked)
  }

  const cancelMove = () => {
    setNewDepo({depo_id:null, stock_depo_id: null})
    setAdvanceMove(false)
    setShowMove(false)
  }

  const applyMove = async () => {
    setBusy(true)
    try {
      var list = [...dataList]
      var select = [...idList]
      var check = []
      var listID = []
      var newSwr = listContainerStockSwr.data
      for (var i=0; i<select.length; i++) {
        listID.push(select[i].id)
        list.splice(select[i].index, 1)
      }
      var data = {list_id:listID, depo_id:newDepo.depo_id, stock_depo_id:newDepo.stock_depo_id}
      await updateContainerDepoApi(data)
      for (var i=0; i<dataList.length; i++) {
        check[i] = false
      }
      newSwr.result = list
      listContainerStockSwr.mutate(newSwr, true)
      setDataList(list)
      setIdList([])
      setCheckList(check)
    } catch(err) {
      console.log(err)
    }
    setBusy(false)
    setNewDepo({depo_id:null, stock_depo_id: null})
    setAdvanceMove(false)
    setShowMove(false)
  }

  // *----<Download Container>----*
  const downloadContainer = async () => {
    setBusy(true)
    try {
      var select = [...idList]
      var check = []
      var listID = []
      for (var i=0; i<select.length; i++) {
        listID.push(select[i].id)
      }
      var data = {list_id:listID, tipe:"all"}
      var response = await downloadContainerApi(data)
      if (response.status == 200) {
          var reader = response.body.getReader()
          var len = parseInt(response.headers.get("Content-Length"))
          var filename = response.headers.get("X-Filename")
          var receiveLen = 0
          var chunks = []
          // var bar = {...loadBar}
          while (true) {
              const {done, value} = await reader.read()
              if (done) {
                  break
              }
              chunks.push(value)
              receiveLen += value.length
              // if (cat == "all") {
              //     bar.all = Math.round(parseInt(receiveLen / len * 100))
              // }
              // setLoadBar({...bar})
          }
          // if (cat == "all") {
          //     bar.all = 0
          //     progress.all = false
          // }
          var bl = new Blob(chunks, {type:"application/zip"})
          var url = window.URL.createObjectURL(bl)
          var tmpLink = document.createElement("a")
          tmpLink.href = url
          tmpLink.setAttribute('download',filename)
          tmpLink.click()
          // setLoadBar({...bar})
          // setLoadProgress({...progress})
      } else {
          // if (cat == "all") {
          //     bar.all = 0
          //     progress.all = false
          // }
          // setLoadBar({...bar})
          // setLoadProgress({...progress})
      }
      for (var i=0; i<dataList.length; i++) {
        check[i] = false
      }
      setIdList([])
      setCheckList(check)
    } catch(err) {
      console.log(err)
    }
    setBusy(false)
  }

  return (
    <BaseLayoutStockContainer title="Container Stock">
      <AlertDialog 
        title="Delete Item"
        body={`Are you sure you want to delete ${dataList[deleteIndex]?.serial_number}`}
        open={isOpenConfirmationDialog} 
        cancelAction={() => setOpenConfirmationDialog(false)} okAction={deleteData} />
      <AlertDialog title="Delete Selected Items" body={`Are you sure you want to delete these ${idList.length} selected items?`}
        open={deleteAllConfirm} okAction={deleteAll} cancelAction={() => setDeleteAllConfirm(false)} />
      <Box className="p-5 content-wrapper">
        <Grid container className="page-container" alignItems="center" justify="center">
          <Grid item xs={12} lg={12} xl={10}>
            <h1 className="mb-3">Tradecorp Container Stock</h1>
            <Box className="card no-padding">
                {idList.length == 0 &&
                <Box className="p-3 display-space-between">
                  <Box className="flex-center me-3" style={{flexGrow:1,minHeight:32}}>
                    
                  </Box>
                </Box>}
                {idList.length > 0 &&
                  <Box className="p-2 display-space-between" color="text.primary" bgcolor="secondary.main">
                    <Typography component="div">{idList.length} selected</Typography>
                    <Box>
                      <Tooltip title="Download selected">
                        <IconButton aria-label="download">
                          <GetApp onClick={downloadContainer} />
                        </IconButton>      
                      </Tooltip>
                      <Tooltip title="Move selected">
                        <IconButton aria-label="move">
                          <Send onClick={() => setShowMove(true)} />
                        </IconButton>      
                      </Tooltip>
                      <Tooltip title="Delete selected">
                        <IconButton aria-label="delete">
                          <Delete onClick={confirmDeleteAll} />
                        </IconButton>      
                      </Tooltip>
                    </Box>
                  </Box>}
                <Divider />
                <TableContainer>
                    <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                                <TableCell padding="checkbox" style={{borderLeft:"1px solid #e0e0e0",borderRight:"1px solid #e0e0e0"}}>
                                  <Checkbox 
                                    indeterminate={idList.length > 0 && idList.length < dataList.length}
                                    checked={dataList.length > 0 && idList.length === dataList.length}
                                    onChange={selectAll}
                                    inputProps={{'aria-label':'select all containers'}}
                                    color="primary"
                                  />
                                </TableCell>
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
                                      <Box style={{whiteSpace:"nowrap"}}>
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
                                            {(headCell.filter && headCell.id == "repair_status_id") &&
                                            <FormControl className={classes.formControl}>
                                              <InputLabel id="repair-status-label" className={classes.selectLabel}>{headCell.label}</InputLabel>
                                              <Select
                                                labelId="repair-status-label"
                                                name={headCell.id}
                                                style={{width:"150px"}}
                                                multiple
                                                variant="outlined"
                                                value={choice[headCell.id]}
                                                renderValue={(selected) => selectedChoice(headCell.id,selected)}
                                                size="small"
                                                margin="dense"
                                                onChange={changeFilter}
                                              >
                                                {repairOptions?.map((row, key) => {
                                                  return (
                                                    <MenuItem key={key} value={row.id}>
                                                      <Checkbox checked={choice[headCell.id].indexOf(row.id) > -1} />
                                                      <ListItemText primary={row.name} />
                                                    </MenuItem>
                                                  );
                                                })}
                                              </Select>
                                            </FormControl>}
                                            {(headCell.filter && headCell.id == "condition_id") &&
                                            <FormControl className={classes.formControl}>
                                              <InputLabel id="condition-id-label" className={classes.selectLabel}>{headCell.label}</InputLabel>
                                              <Select
                                                labelId="condition-id-label"
                                                name={headCell.id}
                                                style={{width:"120px"}}
                                                multiple
                                                variant="outlined"
                                                value={choice[headCell.id]}
                                                renderValue={(selected) => selectedChoice(headCell.id,selected)}
                                                size="small"
                                                margin="dense"
                                                onChange={changeFilter}
                                              >
                                                {conditionOptions?.map((row, key) => {
                                                  return (
                                                    <MenuItem key={key} value={row.id}>
                                                      <Checkbox checked={choice[headCell.id].indexOf(row.id) > -1} />
                                                      <ListItemText primary={row.name} />
                                                    </MenuItem>
                                                  );
                                                })}
                                              </Select>
                                            </FormControl>}
                                            {(headCell.filter && headCell.id == "stock_status_id") &&
                                            <FormControl className={classes.formControl}>
                                              <InputLabel id="stock-status-label" className={classes.selectLabel}>{headCell.label}</InputLabel>
                                              <Select
                                                labelId="stock-status-label"
                                                name={headCell.id}
                                                style={{width:"150px"}}
                                                multiple
                                                variant="outlined"
                                                value={choice[headCell.id]}
                                                renderValue={(selected) => selectedChoice(headCell.id,selected)}
                                                size="small"
                                                margin="dense"
                                                onChange={changeFilter}
                                              >
                                                {statusOptions?.map((row, key) => {
                                                  return (
                                                    <MenuItem key={key} value={row.id}>
                                                      <Checkbox checked={choice[headCell.id].indexOf(row.id) > -1} />
                                                      <ListItemText primary={row.name} />
                                                    </MenuItem>
                                                  );
                                                })}
                                              </Select>
                                            </FormControl>}
                                            {(headCell.filter && headCell.id == "depo_id") &&
                                            <FormControl className={classes.formControl}>
                                              <InputLabel id="depo-label" className={classes.selectLabel}>{headCell.label}</InputLabel>
                                              <Select
                                                labelId="depo-label"
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
                                                {depoOptions?.map((row,key) => {
                                                  return (
                                                    <MenuItem key={key} value={row.id}>
                                                      <Checkbox checked={choice[headCell.id].indexOf(row.id) > -1} />
                                                      <ListItemText primary={row.name} />
                                                    </MenuItem>
                                                  )
                                                })}
                                              </Select>
                                            </FormControl>}
                                            {(headCell.filter && headCell.id == "stock_reconcile") &&
                                            <FormControl className={classes.formControl}>
                                              <InputLabel id="stock-reconcile-label" className={classes.selectLabel}>{headCell.label}</InputLabel>
                                              <Select
                                                labelId="stock-reconcile-label"
                                                name={headCell.id}
                                                style={{width:"150px"}}
                                                multiple
                                                variant="outlined"
                                                value={choice[headCell.id]}
                                                renderValue={(selected) => selectedChoice(headCell.id,selected)}
                                                size="small"
                                                margin="dense"
                                                onChange={changeFilter}
                                              >
                                                <MenuItem key={0} value="Y">
                                                  <Checkbox checked={choice[headCell.id].indexOf("Y") > -1} />
                                                  <ListItemText primary="Yes" />
                                                </MenuItem>
                                                <MenuItem key={1} value="N">
                                                  <Checkbox checked={choice[headCell.id].indexOf("N") > -1} />
                                                  <ListItemText primary="No" />
                                                </MenuItem>
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
                                <TableCell>
                                  <Tooltip title="Clear Filters" placement="top">
                                      <IconButton size="small" onClick={clearFilter}><Icon>clear_all</Icon></IconButton>
                                  </Tooltip>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {!isLoading && dataList.map((data, index) => (
                            <TableRow key={index} hover={true}>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={checkList[index]}
                                    onClick={(e) => onCheckChange(e,data?.id,index)}
                                    color="primary"
                                  />
                                </TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{index + 1 + (page*limit)}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.serial_number}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.size?.name}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.type?.name}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.repair_status?.name}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.condition?.name}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.percentage ?? 0}%</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.yom_month}-{data?.yom_year}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.gate_in_date? Moment(data?.gate_in_date).format("LL") : "-"}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>
                                  { (data?.stock_status_id != 1002 && data?.stock_status_id != 1003) &&
                                    countDays(data?.gate_in_date)
                                  }
                                </TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.depo?.name}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.stock_status?.name}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.owner}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('container.detail', {id: data?.id}))}>{data?.remarks}</TableCell>
                                <TableCell>
                                    {isAdmin &&
                                    <Tooltip title="Delete" placement="top">
                                        <IconButton size="small" onClick={() => confirmDelete(index)}><Icon>delete</Icon></IconButton>
                                    </Tooltip>}
                                </TableCell>
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
      <StockContainerForm 
        open={openForm} 
        closeModal={() => setOpenForm(false)} 
        dataRefresh={refreshData}
        depoId={null}
        addMaster={(category) => addMaster(category,"insert")}
        newOption={newOptionInsert} 
        alert={(msg) => showToast(msg)} />
      <MasterForm open={openMaster} closeModal={(updated) => refreshMaster(updated)} master={master} category={master?.category} />
      <Dialog open={showMove} onClose="" aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title"><Typography style={{fontWeight: 700, fontSize: 18}}>Move Containers</Typography></DialogTitle>
        <DialogContent>
          <DialogContentText>Choose depot destination</DialogContentText>
          <TextField
            name="depo_id"
            label="Depot"
            style={{width:"400px"}}
            select
            value={newDepo.depo_id}
            variant="outlined"
            onChange={changeDepoDest}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {depoList?.map((row,key) => {
              return (<MenuItem value={row.id}>{row.name}</MenuItem>)
            })}
          </TextField>
          <FormGroup row>
            <FormControlLabel control={<Switch checked={advanceMove} onChange={toggleAdvance} name="advance_option" />} label="Advanced Option"/>
          </FormGroup>
          <Collapse in={advanceMove} timeout="auto" unmountOnExit>
            <DialogContentText>List at depot</DialogContentText>
            <TextField
              name="stock_depo_id"
              label="Depot"
              style={{width:"400px"}}
              select
              value={newDepo.stock_depo_id}
              variant="outlined"
              onChange={changeDepoListing}
              InputLabelProps={{
                shrink: true,
              }}
            >
              {depoList?.map((row,key) => {
                return (
                  <React.Fragment>
                    {row.is_own &&
                    <MenuItem value={row.id}>{row.name}</MenuItem>}
                  </React.Fragment>
                )
              })}
            </TextField>
          </Collapse>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelMove} color="default" size="small" disableElevation>Cancel</Button>
          <Button onClick={applyMove} color="primary" size="small" variant="contained" disableElevation autoFocus>Apply</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={toast.show} autoHideDuration={2000} onClose={closeToast}>
          <Alert onClose={closeToast} severity="error">{toast.message}</Alert>
      </Snackbar>
      <Backdrop className={classes.backdrop} open={busy}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </BaseLayoutStockContainer>
  )
}