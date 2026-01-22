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
    TextField,
    Divider,
    TableSortLabel,
    Collapse
  } from "@material-ui/core";
  import { useRouter } from "next/router";
  import React, { useEffect, useState } from "react";
  import { getListMasterPermissionTemp, getDetailPermissionTemplateApi, deletePermissionTemplateApi } from "../../../../services/api/office.api";
  import AdminBaseLayout from "../../../base_layout/admin_base_layout";
  import { Delete, KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
  import AlertDialog from "../../../../components/base_component/dialog";
  import TemplateForm from "./form";
  
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
        <TableRow key={props.keys} className={classes.root} hover>
            <TableCell>
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
            </TableCell>
            <TableCell onClick={() => props.clickModify(props.row.id)}>
                {props.keys + 1 + props.page * props.rowsPerPage}
            </TableCell>
            <TableCell onClick={() => props.clickModify(props.row.id)}>
                {props.row.name}
            </TableCell>
            <TableCell>
                <IconButton>
                    <Delete onClick={() => props.clickDelete(props.row.id)} />
                </IconButton>
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1} marginLeft={5}>
                <Table size="small" aria-label="master-data">
                  <TableHead>
                    <TableRow>
                      <TableCell>Permission</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.row.permissions_list?.map((item, key) => (
                      <TableRow key={key}>
                        <TableCell>{item.name}</TableCell>
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
    const router = useRouter();
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [idData, setIdData] = useState(null);
    const [data, setData] = useState(null);
    const [listData, setListData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [rowCount, setRowCount] = useState(0);
    const [openForm, setOpenForm] = useState(false);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
  
    const confirmDelete = (id) => {
      setIdData(id);
      setOpenDialog(true);
    };
  
    const deleteTemplate = async () => {
      setOpenDialog(false);
      try {
        setOpen(true);
        var res = await deletePermissionTemplateApi(idData);
        var data = await getListMasterPermissionTemp("", 0, 0, orderBy, order);
        setRowCount(data.total);
        setListData(data.result);
        setPage(0);
        setOpen(false);
      } catch (err) {
        console.log(err);
        setOpen(false);
      }
    };
  
    useEffect(async () => {
      try {
        setOpen(true);
        var data = await getListMasterPermissionTemp("", 0, 0, orderBy, order);
        setRowCount(data.total);
        setListData(data.result);
        setPage(0);
        setOpen(false);
      } catch (err) {
        console.log(err);
        setOpen(false);
      }
    }, []);
  
    const handleChangePage = async (event, newPage) => {
      try {
        setOpen(true);
        var data = await getListMasterPermissionTemp(search, newPage, rowsPerPage, orderBy, order);
        setRowCount(data.total);
        setListData(data.result);
        setPage(newPage);
        setOpen(false);
      } catch (err) {
        console.log(err);
        setOpen(false);
      }
    };
  
    const handleChangeRowsPerPage = async (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      try {
        setOpen(true);
        var data = await getListMasterPermissionTemp(search, 0, parseInt(event.target.value, 10), orderBy, order);
        setRowCount(data.total);
        setListData(data.result);
        setPage(0);
        setOpen(false);
      } catch (err) {
        console.log(err);
        setOpen(false);
      }
    };
  
    const doSearch = async () => {
      try {
        setOpen(true);
        var data = await getListMasterPermissionTemp(search, 0, rowsPerPage, orderBy, order);
        setRowCount(data.total);
        setListData(data.result);
        setPage(0);
        setOpen(false);
      } catch (err) {
        console.log(err);
        setOpen(false);
      }
    };
  
    const refreshListTemplate = async () => {
      setOpenForm(false);
      try {
        setOpen(true);
        var data = await getListMasterPermissionTemp(search, page, rowsPerPage, orderBy, order);
        setRowCount(data.total);
        setListData(data.result);
        setOpen(false);
      } catch (err) {
        console.log(err);
        setOpen(false);
      }
    };
  
    const editForm = async (id) => {
      setOpen(true);
      var result = await getDetailPermissionTemplateApi(id);
      setData({id: id, name: result.name, permissions: result.permissions});
      setOpen(false);
      setOpenForm(true);
    };
  
    const changeSort = async (field) => {
      const isAsc = orderBy === field && order === "asc"
      var ord
      if (isAsc) {
        ord = "desc"
      } else {
        ord = "asc"
      }
      //setOrder(isAsc ? "desc" : "asc")
      setOrderBy(field)
      setOrder(ord)
      try {
        setOpen(true);
        var data = await getListMasterPermissionTemp(search, page, rowsPerPage, field, ord);
        setRowCount(data.total);
        setListData(data.result);
        setOpen(false);
      } catch (err) {
        console.log(err);
        setOpen(false);
      }
    }
  
    return (
      <AdminBaseLayout title="Permission Template List">
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
                    <Icon>add</Icon> Template
                  </Button>
                </Box>
              </Box>
              <Divider />
              <TableContainer>
                <Table aria-label="Permission Template List">
                  <TableHead>
                    <TableRow>
                      <TableCell width={12}></TableCell>
                      <TableCell width={12}>No</TableCell>
                      <TableCell
                        key="name"
                        sortDirection={orderBy === "name" ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === "name"}
                          direction={orderBy === "name" ? order : "asc"}
                          onClick={() => changeSort("name")}
                        >
                          Template Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listData?.map((row, key) => (
                        <Row keys={key} row={row} clickModify={(id) => editForm(id)} clickDelete={(id) => confirmDelete(id)} page={page} rowsPerPage={rowsPerPage} />
                    ))}
                    {listData?.length == 0 && (
                      <TableRow>
                        <TableCell colspan={4} align="center">
                          No data to show
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[20, 50, 100]}
                        colSpan={4}
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
            <AlertDialog
              open={openDialog}
              cancelAction={() => setOpenDialog(false)}
              okAction={() => deleteTemplate()}
              title="Delete confirmation"
              body="Are you sure want to delete this record?"
            />
            <TemplateForm open={openForm} closeModal={refreshListTemplate} data={data} />
          </Grid>
        </Grid>
      </AdminBaseLayout>
    );
  }
  