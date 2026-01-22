import { Button, ButtonGroup, Card, Popper, Divider, Grow, Grid, Icon, IconButton, InputBase, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Tooltip, Typography, Paper, ClickAwayListener, MenuList, Checkbox, Box, TableSortLabel, makeStyles, Backdrop, CircularProgress, FormControl, Popover, TextField, Input, ListItemText, Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormGroup, FormControlLabel, Switch, Collapse } from '@material-ui/core';
import { Alert } from "@material-ui/lab"
import { Delete, Edit, Person, Group } from '@material-ui/icons'
import BaseLayoutDepoLocation from '../../../base_layout/base-layout-depo-location';
import { useRouter } from 'next/router';
import AlertDialog from "../../../base_component/dialog";
import React, { useEffect, useState } from 'react';
import { getListSchedularApi, getDetailSchedularApi, deleteSchedularApi, saveSchedularActiveApi } from '../../../../services/api/schedular.api';
import SchedularForm from './schedular-form'
import { isPermit } from '../../../../helpers/general';
import Moment from "moment";

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  }));

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
    const [active, setActive] = useState([])
  
    const confirmDelete = (id) => {
      setIdData(id)
      setOpenDialog(true)
    };
  
    const deleteSchedular = async () => {
      setOpenDialog(false)
      try {
        setOpen(true);
        var res = await deleteSchedularApi(idData)
        var data = await getListSchedularApi("", "inventory_report", 0, 0)
        var act = []
        for (var i=0; i<data.total; i++) {
            act[i] = data.result[i]?.active ?? false
        }
        setActive(act)
        setListData(data.result)
        setOpen(false)
      } catch (err) {
        console.log(err)
        setOpen(false)
      }
    };
  
    useEffect(async () => {
      try {
        setOpen(true)
        var data = await getListSchedularApi("", "inventory_report", 0, 0)
        var act = []
        for (var i=0; i<data.total; i++) {
            act[i] = data.result[i]?.active ?? false
        }
        setActive(act)
        setRowCount(data.total)
        setListData(data.result)
        setPage(0)
        setOpen(false)
      } catch (err) {
        console.log(err)
        setOpen(false)
      }
    }, []);
  
    const handleChangePage = async (event, newPage) => {
      try {
        setOpen(true)
        var data = await getListSchedularApi(search, "inventory_report", newPage, rowsPerPage)
        var act = []
        for (var i=0; i<data.total; i++) {
            act[i] = data.result[i]?.active ?? false
        }
        setActive(act)
        setRowCount(data.total)
        setListData(data.result)
        setPage(newPage)
        setOpen(false)
      } catch (err) {
        console.log(err)
        setOpen(false)
      }
    };
  
    const handleChangeRowsPerPage = async (event) => {
      setRowsPerPage(parseInt(event.target.value, 10))
      try {
        setOpen(true)
        var data = await getListSchedularApi(search, "inventory_report", 0, parseInt(event.target.value, 10))
        var act = []
        for (var i=0; i<data.total; i++) {
            act[i] = data.result[i]?.active ?? false
        }
        setActive(act)
        setRowCount(data.total)
        setListData(data.result)
        setPage(0)
        setOpen(false)
      } catch (err) {
        console.log(err)
        setOpen(false)
      }
    };

    const doSearch = async () => {
      try {
        setOpen(true)
        var data = await getListSchedularApi(search, "inventory_report", 0, rowsPerPage)
        var act = []
        for (var i=0; i<data.total; i++) {
            act[i] = data.result[i]?.active ?? false
        }
        setActive(act)
        setRowCount(data.total)
        setListData(data.result)
        setPage(0)
        setOpen(false)
      } catch (err) {
        console.log(err)
        setOpen(false)
      }
    };

    const refreshSchedular = async () => {
        setOpenForm(false)
        try {
            setOpen(true)
            var data = await getListSchedularApi(search, "inventory_report", page, rowsPerPage)
            var act = []
            for (var i=0; i<data.total; i++) {
                act[i] = data.result[i]?.active ?? false
            }
            setActive(act)
            setRowCount(data.total)
            setListData(data.result)
            setOpen(false)
        } catch (err) {
            console.log(err)
            setOpen(false)
        }
      };
  
    const editForm = async (row) => {
        setData({id:row.id, module:row.module, recurring:row.recurring, filters:row.filters, active:row.active, month:row.month, day:row.day, hour:row.hour, minute:row.minute, timezone:row.timezone, columns:row.columns, teams:row.teams, users:row.users})
        setOpenForm(true)
    };

    const handleChange = (event, id, pos) => {
        var data = {id:id,active:event.target.checked}
        var act = [...active]
        act[pos] = event.target.checked
        setActive(act)
        saveSchedularActiveApi(data, id).then((res) => {
            
        }).catch((err) => {
            console.log(err)
        })
    }

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
      <BaseLayoutDepoLocation title="Schedular List">
        <Box className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={12} xl={10}>
                    <h1 className="mb-3">Schedular</h1>
                    <Box className="card no-padding">
                    <Box className="display-space-between">
                        <Box className="search-bar me-3" style={{ width: "25%", marginLeft: 10 }}>
                            {/* <TextField
                                variant="standard"
                                placeholder="Search…"
                                className="search-input"
                                readOnly={open}
                                defaultValue={search}
                                onChange={(e) => setSearch(e.target.value)}
                                InputProps={{
                                "aria-label": "search",
                                endAdornment: (
                                    <IconButton onClick={doSearch} size="small">
                                    <Icon>search</Icon>
                                    </IconButton>
                                ),
                                disableUnderline: true,
                                }}
                            /> */}
                        </Box>
                        <Box style={{ marginTop: 15, marginRight: 10 }}>
                            <Button
                                variant="outlined"
                                disableElevation
                                className="mb-4"
                                onClick={() => {
                                    setData(null);
                                    setOpenForm(true);
                                }}
                            >
                                <Icon>add</Icon> New Schedule
                            </Button>
                        </Box>
                    </Box>
                    <Divider />
                    <TableContainer>
                        <Table aria-label="Schedular List">
                          <TableHead>
                              <TableRow>
                                <TableCell width={12} align="center">No</TableCell>
                                <TableCell align="center">Recurring</TableCell>
                                <TableCell align="center">Month</TableCell>
                                <TableCell align="center">Day of Week</TableCell>
                                <TableCell align="center">Day</TableCell>
                                <TableCell align="center">Hour</TableCell>
                                <TableCell align="center">Minute</TableCell>
                                <TableCell align="center">Teams</TableCell>
                                <TableCell align="center">Users</TableCell>
                                <TableCell align="center">Active</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              {listData?.map((row, key) => (
                              <TableRow key={key} className={classes.root}>
                                  <TableCell>{key + 1 + page * rowsPerPage}</TableCell>
                                  <TableCell>{row.recurring.charAt(0).toUpperCase()+row.recurring.slice(1)}</TableCell>
                                  <TableCell>{row.month}</TableCell>
                                  <TableCell>{row.day_of_week}</TableCell>
                                  <TableCell>{row.day}</TableCell>
                                  <TableCell>{row.hour}</TableCell>
                                  <TableCell>{row.minute}</TableCell>
                                  <TableCell align="center">
                                    {row.team_list.length > 0 &&
                                    <Tooltip title={<Tooltiplist data={row.team_list} />} placement="bottom" classes={{tooltip:classes.customWidth}}>
                                        <Icon>
                                            <Group></Group>
                                        </Icon>
                                    </Tooltip>}
                                  </TableCell>
                                  <TableCell align="center">
                                    {row.user_list.length > 0 &&
                                    <Tooltip title={<Tooltiplist data={row.user_list} />} placement="bottom" classes={{tooltip:classes.customWidth}}>
                                        <Icon>
                                            <Person></Person>
                                        </Icon>
                                    </Tooltip>}
                                  </TableCell>
                                  <TableCell align="center">
                                      <FormControlLabel
                                          control={<Switch checked={active[key]} onChange={(e) => handleChange(e,row.id,key)} />}
                                          label="Active"
                                      />
                                  </TableCell>
                                  <TableCell>
                                      <Tooltip title="Edit" placement="top">
                                          <IconButton>
                                              <Edit onClick={() => editForm(row)} />
                                          </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Delete" placement="top">
                                          <IconButton>
                                              <Delete onClick={() => confirmDelete(row.id)} />
                                          </IconButton>
                                      </Tooltip>
                                  </TableCell>
                              </TableRow>
                              ))}
                              {listData?.length == 0 && (
                              <TableRow>
                                  <TableCell colspan={11} align="center">No data to show</TableCell>
                              </TableRow>
                              )}
                          </TableBody>
                          <TableFooter>
                              <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[20, 50, 100]}
                                    colSpan={11}
                                    count={rowCount}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                    inputProps: { "aria-label": "rows per page" },
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
                    <AlertDialog open={openDialog} cancelAction={() => setOpenDialog(false)} okAction={() => deleteSchedular()} title="Delete confirmation" body="Are you sure want to delete this schedule?" />
                    <SchedularForm open={openForm} closeModal={() => refreshSchedular()} schedule={data} alert={(msg) => showToast(msg)} />
                    <Snackbar open={toast.show} autoHideDuration={2000} onClose={closeToast}>
                        <Alert onClose={closeToast} severity="error">{toast.message}</Alert>
                    </Snackbar>
                </Grid>
            </Grid>
        </Box>
      </BaseLayoutDepoLocation>
    );
  }
  