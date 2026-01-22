import {
    Button,
    Grid,
    Icon,
    IconButton,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Backdrop,
    CircularProgress,
    TablePagination,
    TableFooter,
    Box,
    Collapse,
    TextField,
    Divider,
    Snackbar,
    Chip
  } from "@material-ui/core"
  import { Alert } from "@material-ui/lab"
  import { useRouter } from "next/router"
  import React, { useEffect, useState } from "react"
  import { getListColorCodesApi, deleteColorCodesApi } from "../../../../services/api/color-codes.api"
  import AdminBaseLayout from "../../../base_layout/admin_base_layout"
  import { Delete, Edit } from "@material-ui/icons"
  import AlertDialog from "../../../../components/base_component/dialog"
  import ColorForm from "./form"
  
  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  }));
  
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
  
    const confirmDelete = (code) => {
      setIdData(code)
      setOpenDialog(true)
    };
  
    const deleteColor = async () => {
      setOpenDialog(false)
      try {
        setOpen(true);
        var res = await deleteColorCodesApi(idData)
        var data = await getListColorCodesApi()
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
        var data = await getListColorCodesApi()
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
        var data = await getListColorCodesApi(search, newPage, rowsPerPage)
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
        var data = await getListColorCodesApi(search, 0, parseInt(event.target.value, 10))
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
        var data = await getListColorCodesApi(search, 0, rowsPerPage)
        setRowCount(data.total)
        setListData(data.result)
        setPage(0)
        setOpen(false)
      } catch (err) {
        console.log(err)
        setOpen(false)
      }
    };

    const refreshListColor = async () => {
        setOpenForm(false)
        try {
          setOpen(true)
          var data = await getListColorCodesApi(search, page, rowsPerPage)
          setRowCount(data.total)
          setListData(data.result)
          setOpen(false)
        } catch (err) {
          console.log(err)
          setOpen(false)
        }
      };
  
    const editForm = async (row) => {
        setData({ral_code:row.ral_code, name_english:row.name_english, html_code:row.html_code, name_german:row.name_german, name_french:row.name_french, name_spanish:row.name_spanish, name_italian:row.name_italian, name_nederlands:row.name_nederlands})
        setOpenForm(true)
    };

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
      <AdminBaseLayout title="Master Color List">
        <Grid container spacing={4}>
          <Grid item lg={12}>
            <Box className="card no-padding">
              <Box className="display-space-between">
                <Box className="search-bar me-3" style={{ width: "25%", marginLeft: 10 }}>
                  <TextField
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
                  />
                </Box>
                <Box style={{ marginTop: 15, marginRight: 10 }}>
                  <Button
                    color="secondary"
                    variant="contained"
                    disableElevation
                    className="mb-4"
                    onClick={() => {
                      setData(null);
                      setOpenForm(true);
                    }}
                  >
                    <Icon>add</Icon> Add Master Color
                  </Button>
                </Box>
              </Box>
              <Divider />
              <TableContainer>
                <Table aria-label="Master Color List">
                  <TableHead>
                    <TableRow>
                      <TableCell width={12}>No</TableCell>
                      <TableCell>RAL Code</TableCell>
                      <TableCell>HTML Code</TableCell>
                      <TableCell>Name English</TableCell>
                      <TableCell>Name Deutsch</TableCell>
                      <TableCell>Name Francais</TableCell>
                      <TableCell>Name Espanol</TableCell>
                      <TableCell>Name Italiano</TableCell>
                      <TableCell>Name Nederlands</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listData?.map((row, key) => (
                      <TableRow key={key} className={classes.root} hover>
                        <TableCell onClick={() => editForm(row)}>{key + 1 + page * rowsPerPage}</TableCell>
                        <TableCell onClick={() => editForm(row)}>{row.ral_code}</TableCell>
                        <TableCell onClick={() => editForm(row)}>
                            <Chip label={row.html_code} style={{backgroundColor:row.html_code}} />
                        </TableCell>
                        <TableCell onClick={() => editForm(row)}>{row.name_english}</TableCell>
                        <TableCell onClick={() => editForm(row)}>{row.name_german}</TableCell>
                        <TableCell onClick={() => editForm(row)}>{row.name_french}</TableCell>
                        <TableCell onClick={() => editForm(row)}>{row.name_spanish}</TableCell>
                        <TableCell onClick={() => editForm(row)}>{row.name_italian}</TableCell>
                        <TableCell onClick={() => editForm(row)}>{row.name_nederlands}</TableCell>
                        <TableCell>
                            <IconButton>
                                <Delete onClick={() => confirmDelete(row.ral_code)} />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                    ))}
                    {listData?.length == 0 && (
                      <TableRow>
                        <TableCell colspan={10} align="center">No data to show</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[20, 50, 100]}
                        colSpan={10}
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
            <AlertDialog open={openDialog} cancelAction={() => setOpenDialog(false)} okAction={() => deleteColor()} title="Delete confirmation" body="Are you sure want to delete this record?" />
            <ColorForm open={openForm} closeModal={() => refreshListColor()} color={data} alert={(msg) => showToast(msg)} />
            <Snackbar open={toast.show} autoHideDuration={2000} onClose={closeToast}>
                <Alert onClose={closeToast} severity="error">{toast.message}</Alert>
            </Snackbar>
          </Grid>
        </Grid>
      </AdminBaseLayout>
    );
  }
  