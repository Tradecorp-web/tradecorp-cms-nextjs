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
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import getRoute from "../../../helpers/router";
import {
  Delete,
  Assignment,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from "@material-ui/icons";

import {
  getListInvoiceApi,
  deleteInvoiceApi,
  getDetailInvoiceApi,
} from "../../../services/api/invoice.api";
import SOForm from "./db-supplier-form";
import InvoiceForm from "./db-supplier-form";
import WOForm from "./formwo";
import BaseLayout from "../../base_layout/base-layout-deal-builder";
import AlertDialog from "../../base_component/dialog";
import { CircularProgressCustom } from "../../base_component/spinner";
import { exportWorkOrder } from "../../../services/export/export-wo";
import Moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
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

  return (
    <React.Fragment>
      <TableRow key={props.keys} hover className={classes.root}>
        <TableCell onClick={() => props.clickAction()}>
          {props.keys + 1 + props.page * props.rowsPerPage}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.project_code}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.invoice_number}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {Moment(props.row.invoice_date).format("LL")}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props?.row?.customer_code +
            ", " +
            props?.row?.customer_contact +
            "." +
            props?.row?.customer_name}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.sales_name}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {Moment(props.row.invoice_due_date).format("LL")}
        </TableCell>

        <TableCell>
          <IconButton>
            <Assignment onClick={() => props.clickCreateWo()} />
          </IconButton>
          <IconButton>
            <Delete onClick={() => props.clickDelete()} />
          </IconButton>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Page() {
  const router = useRouter();
  function openDetail(e, url) {
    e.preventDefault();
    router.push(url);
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

  const deleteInvoice = async () => {
    setOpenDialog(false);
    try {
      setOpen(true);
      var res = await deleteInvoiceApi(idData);
      var data = await getListInvoiceApi();
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
      var data = await getListInvoiceApi();
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

      var data = await getListInvoiceApi(search, newPage, rowsPerPage);
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
      var data = await getListInvoiceApi(
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
      var data = await getListInvoiceApi(search, 0, rowsPerPage);
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const refreshListInvoice = async () => {
    setOpenForm(false);
    try {
      setOpen(true);
      var data = await getListInvoiceApi(search, page, rowsPerPage);
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
      var data = await getListInvoiceApi(search, page, rowsPerPage);
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
    setPage(0);
    setOpen(true);
    let result = await getDetailInvoiceApi(id);
    setData({
      id: id,
      invoice_date: result.invoice_date,
      project_code: result.project_code,
      invoice_number: result.invoice_number,
      customer_code: result.customer_code,
      customer_contact: result.customer_contact,
      customer_name: result.customer_name,
      invoice_due_date: result.invoice_due_date,
      sales_username: result.sales_username,
      sales_name: result.sales_name,
      product_id: result.product_id,
      containers: result.containers,
    });
    setOpen(false);
    setOpenForm(true);
  };

  const createWoForm = async (id) => {
    setPage(0);
    setOpen(true);
    var result = await getDetailInvoiceApi(id);
    setData({
      id: id,
      invoice_date: result.invoice_date,
      project_code: result.project_code,
      invoice_number: result.invoice_number,
      customer_code: result.customer_code,
      customer_contact: result.customer_contact,
      customer_name: result.customer_name,
      invoice_due_date: result.invoice_due_date,
      sales_username: result.sales_username,
      product_id: result.product_id,
      containers: [],
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

  return (
    <BaseLayout title="Deal Builder">
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
                  <Typography variant="h1">Deal Builder</Typography>
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
                    placeholder="Search Invoice Number…"
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
                  disabled={stsAcc}
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
                    <Icon>add</Icon>Create Invoice
                  </Button>
                  <Tooltip title="Download Data" placement="top">
                    <Button
                      size="small"
                      aria-label="select merge strategy"
                      onClick={exportData}
                      aria-haspopup="menu"
                    ></Button>
                  </Tooltip>
                </ButtonGroup>
              </Box>
              <Divider />
              <TableContainer component={Card}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width={12}>No</TableCell>
                      <TableCell>Project Number</TableCell>
                      <TableCell>Invoice Number</TableCell>
                      <TableCell>Invoice&nbsp;Date</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Salesman</TableCell>
                      <TableCell>Invoice Due Date</TableCell>
                      <TableCell />
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listData?.map((row, key) => (
                      <Row
                        keys={key}
                        row={row}
                        clickAction={() => editForm(row.id)}
                        clickCreateWo={() => createWoForm(row.id)}
                        clickDelete={() => confirmDelete(row.id)}
                        page={page}
                        rowsPerPage={rowsPerPage}
                      />
                    ))}
                    {listData?.length == 0 && (
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
          okAction={() => deleteInvoice()}
          title="Delete confirmation"
          body="Are you sure want to delete this record?"
        />
        <InvoiceForm
          open={openForm}
          closeModal={refreshListInvoice}
          invoice={data}
        />
      </Box>
    </BaseLayout>
  );
}
