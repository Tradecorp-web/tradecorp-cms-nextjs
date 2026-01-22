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
  Tooltip,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  Delete,
  Assignment,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from "@material-ui/icons";

import {
  getListSalesOrderGroupApi,
  getListSalesOrderApi,
  deleteSalesOrderApi,
  getDetailSalesOrderApi,
} from "../../../services/api/sales-order.api";
import SOForm from "./form";
import WOForm from "./formwo";
import BaseLayout from "../../base_layout/base-layout";
import AlertDialog from "../../base_component/dialog";
import { exportWorkOrder } from "../../../services/export/export-wo";
import Moment from "moment";

import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
      fontSize: 12,
    },
  },
  rootmenu: {
    "& > *": {
      margin: theme.spacing(1),
      fontSize: 12,
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function Row(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rowCount, setRowCount] = useState(0);

  const router = useRouter();

  return (
    <React.Fragment>
      <TableRow key={props.keys} hover className={classes.root}>
        <TableCell onClick={() => props.clickAction()}>
          {props.keys + 1 + props.page * props.rowsPerPage}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.project_code}
        </TableCell>
        {/* <TableCell onClick={() => props.clickAction()}>
          {props.row.sales_order_number}
        </TableCell> */}
        <TableCell onClick={() => props.clickAction()}>
          {props.row.project_name}
        </TableCell>
        {/* <TableCell onClick={() => props.clickAction()}>
          {props.row.income_type}
        </TableCell> */}
        <TableCell onClick={() => props.clickAction()}>
          {props.row.project_description}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props?.row?.customer_company_name}
          {", "}
          {props?.row?.customer_company_type} <br />
          {props?.row?.customer_name}
          <br />
          {props?.row?.customer_email}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {Moment(props.row.order_date).format("LL")}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {Moment(props.row.estimate_delivery_date).format("LL")}
        </TableCell>

        <TableCell align={"center"}>
          {/* <IconButton style={{ color: "#2196f3" }}>
            <Assignment onClick={(e) => openPage(e, getRoute("sales"))} />
          </IconButton> */}
          {/* <IconButton style={{ color: "#FF0000" }}>
            <Delete onClick={() => props.clickDelete()} />
          </IconButton> */}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Page() {
  const router = useRouter();

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }
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
  const [openWoForm, setOpenWoForm] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [stsAcc, setStsAcc] = useState("disabled");

  const confirmDelete = (id) => {
    setIdData(id);
    setOpenDialog(true);
  };

  const deleteSO = async () => {
    setOpenDialog(false);
    try {
      setOpen(true);
      // var res = await deleteSalesOrderApi(idData);
      var data = await getListSalesOrderGroupApi();

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
      var data = await getListSalesOrderGroupApi();
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
      setStsAcc("");
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  }, []);

  const handleChangePage = async (event, newPage) => {
    try {
      setOpen(true);

      var data = await getListSalesOrderGroupApi(search, newPage, rowsPerPage);
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
      var data = await getListSalesOrderGroupApi(
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
      var data = await getListSalesOrderGroupApi(search, 0, rowsPerPage);
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const refreshListSO = async () => {
    setOpenForm(false);
    try {
      setOpen(true);
      var data = await getListSalesOrderGroupApi(search, page, rowsPerPage);
      setRowCount(data.total);
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
    setPage(0);
  };
  const refreshListWO = async () => {
    setOpenWoForm(false);
    try {
      setOpen(true);
      var data = await getListSalesOrderGroupApi(search, page, rowsPerPage);
      setRowCount(data.total);
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
    setPage(0);
  };
  const editForm = async (id) => {
    router.push("/sales/" + id);
    // setPage(0);
    // setOpen(true);
    // let result = await getDetailSalesOrderApi(id);
    // setData({
    //   id: id,
    //   order_date: result.order_date,
    //   project_code: result.project_code,
    //   project_name: result.project_name,
    //   project_description: result.project_description,
    //   estimate_delivery_date: result.estimate_delivery_date,
    //   client: result.client,
    //   customer_id: result.customer_id,
    //   product_id: result.product_id,
    //   sales_id: result.sales_id,
    //   sales_name: result.sales.name,
    //   containers: result.containers,
    // });
    // setOpen(false);
    // setOpenForm(true);
  };

  const createWoForm = async (id) => {
    setPage(0);
    setOpen(true);
    var result = await getDetailSalesOrderApi(id);
    setData({
      id: id,
      order_date: result.order_date,
      project_code: result.project_code,
      project_name: result.project_name,
      project_description: result.project_description,
      estimate_delivery_date: result.estimate_delivery_date,
      client_id: result.client,
      customer_id: result.customer_id,
      product_id: result.product_id,
      customer_name: result.customer.name,
      customer_company: result.customer.company,
      customer_company_type: result.customer.company_type,
      customer_company_address: result.customer.address,
      customer_company_phone: result.customer.phone_number,
      customer_company_email: result.customer.email,
      sales_id: result.sales_id,
      sales_name: result.sales.name,
      materials: [],
    });
    setOpen(false);
    setOpenWoForm(true);
  };

  const exportData = async () => {
    setExportLoading(true);
    try {
      await exportWorkOrder(rowCount);
    } catch (err) {}
    setExportLoading(false);
  };

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  return (
    <BaseLayout title="On Going Sales Order">
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">On Going Sales Order</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <div className={classes.rootmenu}>
              <Button
                variant="contained"
                onClick={(e) => openPage(e, getRoute("sales"))}
              >
                <Icon style={{ fontSize: 20, color: "#999" }}>home</Icon>
              </Button>
              <Button
                onClick={(e) =>
                  openPage(e, getRoute("sales.sales-order-input"))
                }
                variant="contained"
                color="default"
              >
                <Icon style={{ fontSize: 20, color: "#f5b7b1" }}>
                  open_in_new
                </Icon>
                {"  "}
                New Sales Order
              </Button>
              {/* <Button
                onClick={(e) =>
                  openPage(e, getRoute("sales.sales-order-history"))
                }
                variant="contained"
                color="default"
              >
                <Icon style={{ fontSize: 20, color: "#af601a" }}>
                  work_history
                </Icon>
                {"  "}
                History Sales Order Transaction
              </Button> */}
            </div>
          </Grid>
        </Grid>
      </div>
      <Box className="p-5 content-wrapper">
        <Grid
          container
          className="page-container"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12} lg={12} xl={8}>
            <Box>
              <Grid container spacing={10}>
                <Grid justify="left" alignItems="left" item xs={10} sm={10}>
                  <Typography variant="h1">Sales Order</Typography>
                </Grid>
                <Grid
                  justify="right"
                  alignItems="right"
                  item
                  xs={2}
                  sm={2}
                ></Grid>
              </Grid>
            </Box>
            <Box className="card no-padding">
              <Box className="p-3 display-space-between">
                <Box className="search-bar me-3" style={{ width: "25%" }}>
                  <TextField
                    variant="standard"
                    placeholder="Search Sales Order Number…"
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
              </Box>
              <Divider />
              <TableContainer component={Card}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width={12}>No</TableCell>
                      <TableCell>Project Code</TableCell>
                      {/* <TableCell>SO Number</TableCell> */}
                      <TableCell>Project Name</TableCell>
                      {/* <TableCell>Sale Type</TableCell> */}
                      <TableCell>Description</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Order&nbsp;Date</TableCell>
                      <TableCell>Estimate&nbsp; Delivery Date</TableCell>
                      {/* <TableCell align={"center"}>Action</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listData?.map((row, key) => (
                      <Row
                        keys={key}
                        row={row}
                        clickAction={() => editForm(row.project_code)}
                        page={page}
                        rowsPerPage={rowsPerPage}
                      />
                    ))}
                    {listData?.length === 0 && (
                      <TableRow>
                        <TableCell
                          colspan={9}
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
          okAction={() => deleteSO()}
          title="Delete confirmation"
          body="Are you sure want to delete this record?"
        />
        <SOForm open={openForm} closeModal={refreshListSO} so={data} />
        <WOForm open={openWoForm} closeModal={refreshListWO} wo={data} />
      </Box>
    </BaseLayout>
  );
}
