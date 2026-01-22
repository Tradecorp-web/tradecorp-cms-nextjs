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
    Divider
  } from "@material-ui/core"
  import { useRouter } from "next/router"
  import React, { useEffect, useState } from "react"
  import { getMasterDataApi, deleteMasterDataApi } from "../../../../services/api/master-data.api"
  import AdminBaseLayout from "../../../base_layout/admin_base_layout"
  import { Delete, Edit, KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons"
  import AlertDialog from "../../../../components/base_component/dialog"
  import MasterForm from "./form"
  
  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  }));

  function Row(props) {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
  
    return (
      <React.Fragment>
        <TableRow key={props.keys} className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell>{props.row.category}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Table size="small" aria-label="master-data">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Alias</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.row.detail?.map((item, key) => (
                      <TableRow key={key}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.alias}</TableCell>
                        <TableCell>
                          <IconButton>
                            <Edit onClick={() => props.clickModify(item.id)} />
                          </IconButton>
                          <IconButton>
                            <Delete onClick={() => props.clickDelete(item.id)} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
  
    const confirmDelete = (id) => {
      setIdData(id)
      setOpenDialog(true)
    };
  
    const deleteMasterData = async () => {
      setOpenDialog(false)
      try {
        setOpen(true);
        var res = await deleteMasterDataApi(idData)
        var data = await getMasterDataApi()
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
        var data = await getMasterDataApi()
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
        var data = await getMasterDataApi(search, newPage, rowsPerPage)
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
        var data = await getMasterDataApi(search, 0, parseInt(event.target.value, 10))
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
        setOpen(true);
        var data = await getMasterDataApi(search, 0, rowsPerPage);
        setRowCount(data.total);
        setListData(data.result);
        setPage(0);
        setOpen(false);
      } catch (err) {
        console.log(err);
        setOpen(false);
      }
    };
  
    const refreshListMasterData = async (updated) => {
      setOpenForm(false);
      try {
        setOpen(true)
        var data = await getMasterDataApi(search, page, rowsPerPage)
        setRowCount(data.total)
        setListData(data.result)
        setOpen(false)
      } catch (err) {
        console.log(err)
        setOpen(false)
      }
    };
  
    const editForm = async (row,id) => {
      row.detail.map((det,i) => {
        if (det.id == id) {
          setData({id: det.id, name: det.name, alias: det.alias, category: row.category})
        }
      })
      setOpenForm(true)
    };
  
    return (
      <AdminBaseLayout title="Master Data List">
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
                    <Icon>add</Icon> Add Master Data
                  </Button>
                </Box>
              </Box>
              <Divider />
              <TableContainer>
                <Table aria-label="Master Data List">
                  <TableHead>
                    <TableRow>
                      <TableCell width={12}></TableCell>
                      <TableCell>Category</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listData?.map((row, key) => (
                      <Row keys={key} row={row} clickModify={(id) => editForm(row,id)} clickDelete={(id) => confirmDelete(id)} page={page} rowsPerPage={rowsPerPage} />
                    ))}
                    {listData?.length == 0 && (
                      <TableRow>
                        <TableCell colspan={2} align="center">No data to show</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[20, 50, 100]}
                        colSpan={2}
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
            <AlertDialog open={openDialog} cancelAction={() => setOpenDialog(false)} okAction={() => deleteMasterData()} title="Delete confirmation" body="Are you sure want to delete this record?" />
            <MasterForm open={openForm} closeModal={(updated) => refreshListMasterData(updated)} master={data} category={data?.category} />
          </Grid>
        </Grid>
      </AdminBaseLayout>
    );
  }
  