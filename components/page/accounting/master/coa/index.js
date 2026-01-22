import {
  Button,
  ButtonGroup,
  Card,
  makeStyles,
  Divider,
  Grid,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Box,
  TextField,
  Backdrop,
  CircularProgress,
  Collapse,
  Tooltip,
} from "@material-ui/core";

import Link from "@material-ui/core/Link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import getRoute from "../../../../../helpers/router";
import { Delete, KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import GrainIcon from "@material-ui/icons/Grain";

import {
  getListCoaApi,
  getDetailCoaApi,
  deleteCoaApi,
} from "../../../../../services/api/coa.api";
import CoaForm from "./form";
import AccountingBaseLayout from "../../../../base_layout/base-layout-sidemenu-accounting";
// import BaseLayout from "../../../../base_layout/base-layout";
import AlertDialog from "../../../../base_component/dialog";
import { CircularProgressCustom } from "../../../../base_component/spinner";
import { exportWorkOrder } from "../../../../../services/export/export-wo";
import Moment from "moment";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "set",
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  link: {
    display: "flex",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));
var type = "";
function Row(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow
        style={{ display: props.pred }}
        key={props.keys}
        id={props.row.coa_final_statement}
        hover
        className={classes.root}
      >
        <TableCell colSpan={8}>
          {props.row.coa_final_statement} {props.pred}
        </TableCell>
      </TableRow>

      <TableRow key={props.keys} hover className={classes.root}>
        <TableCell onClick={() => props.clickAction()}>
          {props.keys + 1 + props.page * props.rowsPerPage}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.coa_code}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.coa_name}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.coa_type}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.coa_sub_type}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.coa_final_statement}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.normaly}
        </TableCell>

        <TableCell>
          <IconButton>
            <Delete onClick={() => props.clickDelete()} />
          </IconButton>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Page() {
  // const router = useRouter();
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
  const [exportLoading, setExportLoading] = useState(false);

  const confirmDelete = (id) => {
    setIdData(id);
    setOpenDialog(true);
  };

  const deleteCoa = async () => {
    setOpenDialog(false);
    try {
      setOpen(true);
      var res = await deleteCoaApi(idData);
      var data = await getListCoaApi();
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  useEffect(async () => {
    try {
      setOpen(true);
      var data = await getListCoaApi();
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
      var data = await getListCoaApi(search, newPage, rowsPerPage);
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
      var data = await getListWOApi(
        search,
        0,
        parseInt(event.target.value, 10)
      );
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
      var data = await getListCoaApi(search, 0, rowsPerPage);
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const refreshListCoa = async () => {
    setOpenForm(false);
    try {
      setOpen(true);
      var data = await getListCoaApi(search, page, rowsPerPage);
      setRowCount(data.total);
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const editForm = async (id) => {
    var result = await getDetailCoaApi(id);

    setOpen(true);

    setData({
      id: id,
      coa_code: result.coa_code,
      coa_name: result.coa_name,
      coa_type: result.coa_type,
      coa_parent: result.coa_sub_type,
      coa_description: result.coa_description,
    });
    setOpen(false);
    setOpenForm(true);
  };

  const exportData = async () => {
    setExportLoading(true);
    try {
      await exportWorkOrder(rowCount);
    } catch (err) {}
    setExportLoading(false);
  };

  const router = useRouter();

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  return (
    <AccountingBaseLayout title="Chart of Account">
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          color="inherit"
          button
          onClick={(e) => openPage(e, getRoute("accounting"))}
          className={classes.menuItem}
        >
          <HomeIcon className={classes.icon} />
          Dashboard
        </Link>
        <Link
          color="inherit"
          button
          onClick={(e) => openPage(e, getRoute("accounting.master"))}
          className={classes.link}
        >
          <WhatshotIcon className={classes.icon} />
          Master
        </Link>
        <Typography color="textPrimary" className={classes.link}>
          <GrainIcon className={classes.icon} />
          Chart of Account
        </Typography>
      </Breadcrumbs>
      <Box className="p-5 content-wrapper">
        <Grid
          container
          className="page-container"
          alignItems="left"
          justify="left"
        >
          <Grid item xs={12} lg={12} xl={12}>
            <h1 className="mb-3">Chart of Account</h1>
            <Box className="card no-padding">
              <Box className="p-3 display-space-between">
                <Box className="search-bar me-3" style={{ width: "25%" }}>
                  <TextField
                    variant="standard"
                    placeholder="Search COA Code…"
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
                    }}
                  />
                </Box>
                <ButtonGroup
                  variant="outlined"
                  color="default"
                  aria-label="split button"
                >
                  <Button
                    onClick={() => {
                      setData(null);
                      setOpenForm(true);
                    }}
                  >
                    <Icon>add</Icon>Create Chart of Account
                  </Button>
                  {/* <Tooltip title="Download Data" placement="top">
                    <Button
                      size="small"
                      aria-label="select merge strategy"
                      onClick={exportData}
                      aria-haspopup="menu"
                    >
                      {exportLoading && <CircularProgressCustom size={20} />}
                      {!exportLoading && <Icon>download</Icon>}
                    </Button>
                  </Tooltip> */}
                </ButtonGroup>
              </Box>
              <Divider />
              <TableContainer component={Card}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width={12}>No</TableCell>
                      <TableCell>Coa Code</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Sub Type</TableCell>
                      <TableCell>Final Statement</TableCell>
                      <TableCell>Normaly</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listData?.map((row, key) => (
                      <Row
                        keys={key}
                        pred={
                          key > 0
                            ? listData[key - 1].coa_final_statement !=
                              listData[key].coa_final_statement
                              ? ""
                              : "none"
                            : ""
                        }
                        row={row}
                        clickAction={() => editForm(row.id)}
                        clickDelete={() => confirmDelete(row.id)}
                        page={page}
                        rowsPerPage={rowsPerPage}
                      />
                    ))}
                    {listData?.length == 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center text-muted"
                          align="center"
                        >
                          No data to show
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[20, 50, 100]}
                        colSpan={9}
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
          </Grid>
        </Grid>
        <Backdrop className={classes.backdrop} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <AlertDialog
          open={openDialog}
          cancelAction={() => setOpenDialog(false)}
          okAction={() => deleteCoa()}
          title="Delete confirmation"
          body="Are you sure want to delete this record?"
        />
        <CoaForm open={openForm} closeModal={refreshListCoa} coa={data} />
      </Box>
    </AccountingBaseLayout>
  );
}
