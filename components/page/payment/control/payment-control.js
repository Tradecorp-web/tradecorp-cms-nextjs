import BaseLayout from "../../../base_layout/base-layout-sidemenu-accounting";

import {
  Icon,
  Divider,
  Button,
  TextField,
  OutlinedInput,
  Card,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  ButtonGroup,
  Tooltip,
  Collapse,
  IconButton,
  InputLabel,
  Grid,
  TableSortLabel,
  TableFooter,
  Backdrop,
  CircularProgress,
  Select,
  MenuItem,
  InputBase,
} from "@material-ui/core";

import React, { Component, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import AlertDialog from "../../../base_component/dialog";
import { Edit, Delete, AssignmentTurnedIn } from "@material-ui/icons";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import { useRouter } from "next/router";
import getRoute from "../../../../helpers/router";

import {
  getListPaymentCriteriaApi,
  getListByBankPeriod,
  getDetailPaymentApi,
  deletePaymentApi,
  getListByField,
} from "../../../../services/api/payment.api";

import {
  getInvPaymentDataApi,
  getInvComparePaymentPeriodApi,
} from "../../../../services/api/invoice.api";

import { getDetailInvoiceApi } from "../../../../services/api/invoice.api";
import { getListSubAccStatusApi } from "../../../../services/api/acc-sub.api";
import { getDateDaysBefore, currency } from "../../../../helpers/general";

import InvoiceHistoryForm from "../history/invoice-history";

// import PaymentSearchInvoiceForm from "./payment-search-invoice";

import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 10,
    fontSize: 10,
  },
  rootmenu: {
    "& > *": {
      margin: theme.spacing(1),
      fontSize: 10,
    },
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    marginTop: 20,
    maxWidth: "80%",
  },
  dateField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  selectField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },

  labelbase: {
    marginTop: 10,
    fontSize: 12,
  },
  descriptionbase: {
    marginTop: 10,
    fontStyle: "italic",
    fontSize: ".8rem",
    color: "#656565",
  },
  labelbasebold: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "bold",
  },
  inputbase: {
    fontSize: "12px !important",
    height: 30,
  },
  inputbasemultiline: {
    fontSize: "12px !important",
  },
  inputbasero: {
    fontSize: "12px !important",
    height: 30,
    backgroundColor: "#eaecee",
    color: "#000000",
  },
  comboOptions: {
    fontSize: "12px",
    color: "#000000",
  },
  tablehead: {
    fontSize: "12px",
    color: "#000000",
    fontWeight: "bold",
  },
  tablefooter: {
    color: "#000000",
    fontWeight: "bold",
  },
  tableheadr: {
    fontSize: "12px",
    color: "#000000",
    fontWeight: "bold",
    textAlign: "right",
  },
  tablerow: {
    fontSize: "12px",
    color: "#000000",
  },
  tablerowr: {
    fontSize: "12px",
    color: "#000000",
    textAlign: "right",
  },
  titlecard: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000",
  },
}));

export default function Page() {
  //const
  const classes = useStyles();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState("");
  const [idData, setIdData] = useState("");
  const [open, setOpen] = useState(false);

  const [data, setData] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const [listDataBank, setListData] = useState([]);
  const [pageBank, setPage] = useState(0);
  const [rowsPerPage, setrowsPerPage] = useState(20);
  const [rowCountBank, setRowCount] = useState(0);

  const [subAcc, setSubAcc] = useState([]);
  const [listSubAcc, setListSubAcc] = useState([]);
  const [listDataPayment, setListDataPayment] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [period, setPeriod] = useState("");
  const [accSubCode, setAccSubCode] = useState("");
  const [accSubName, setAccSubName] = useState("");

  const [collapseOpen, setCollapseOpen] = useState(-1);
  const [openInvoiceForm, setOpenInvoiceForm] = useState(false);
  const [idInvoice, setIdInvoice] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(false);

  const [listDataPayment60Days, setListDataPayment60Days] = useState([]);

  //set param
  let param = { limit: 999 };
  //const

  const confirmDelete = (id) => {
    setIdData(id);
    setOpenDialog(true);
  };
  const doSearch = async () => {
    try {
      setOpen(true);
      var data = await getListPaymentCriteriaApi(
        "bank",
        "*",
        search,
        0,
        rowsPerPage,
        orderBy,
        order
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

  const handleChangePage = async (event, newPage) => {
    try {
      setOpen(true);
      var data = await getListPaymentCriteriaApi(
        "bank",
        "*",
        search,
        newPage,
        rowsPerPage,
        orderBy,
        order
      );
      setRowCount(data.total);
      setListData(data.result);
      setPage(newPage);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const handleChangerowsPerPage = async (event) => {
    setrowsPerPage(parseInt(event.target.value, 10));
    try {
      setOpen(true);
      var data = await getListPaymentCriteriaApi(
        "bank",
        "*",
        search,
        0,
        parseInt(event.target.value, 10),
        orderBy,
        order
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
  const dateChange = (event) => {
    setPeriod({ ...period, [event.target.name]: event.target.value });
  };
  const changeSort = async (field) => {
    const isAsc = orderBy === field && order === "asc";
    var ord;
    if (isAsc) {
      ord = "desc";
    } else {
      ord = "asc";
    }
    //setOrder(isAsc ? "desc" : "asc")
    setOrderBy(field);
    setOrder(ord);
    try {
      setOpen(true);
      var data = await getListPaymentCriteriaApi(
        "bank",
        "*",
        search,
        pageBank,
        rowsPerPage,
        field,
        ord
      );

      setRowCount(data.total);
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };
  const getDataPayment = async () => {
    // try {
    //   setOpen(true);
    //   // var data = await getListByField(banksubacc, "status_match", "ne", "1");
    //   var data = await getListInvPaymentSwr("invoice_status", "outstanding");
    //   alert(JSON.stringify(data));
    //   setListDataPayment(data);
    //   setPage(0);
    //   setOpen(false);
    // } catch (err) {
    //   console.log(err);
    //   setOpen(false);
    // }
  };

  // const editForm = async (id) => {
  //   setOpen(true);
  //   var result = await getDetailPaymentApi(id);
  //   setData(result);
  //   setOpen(false);
  //   setOpenForm(true);
  // };
  const refreshList = () => {
    setOpenForm(false);
    try {
      setOpen(true);
      getDataPayment(subAcc);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const closeForm = () => {
    props?.closeModal();
  };
  const historyForm = (id, invoiceNumber) => {
    setIdInvoice(id);
    setInvoiceNumber(invoiceNumber);
    setOpenInvoiceForm(true);
  };
  const refreshHistoryList = () => {
    setOpenInvoiceForm(false);
  };

  //useEffect
  useEffect(async () => {
    var data = await getInvPaymentDataApi("invoice_status", "outstanding");
    if (data.count > 0) {
      setListDataPayment(data);
    } else {
      setListDataPayment([]);
    }
  }, []);
  useEffect(async () => {
    var date = new Date();
    const dayNow = moment(new Date(date.getTime())).format("YYYY-MM-DD");
    const dayBefore = moment(getDateDaysBefore(60)).format("YYYY-MM-DD");

    var data = await getInvComparePaymentPeriodApi(dayBefore, dayNow, "paid");
    if (data.count > 0) {
      setListDataPayment60Days(data);
    } else {
      setListDataPayment60Days([]);
    }
  }, []);

  //function

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  function onChangeInput(e) {
    var code = e.target.value.split("||");
    setAccSubCode(code[0]);
    setAccSubName(code[1]);
    getDataPayment(code[0]);
    setSubAcc(code[0]);
  }

  return (
    <BaseLayout title="Payment Transaction">
      <div className={classes.root}>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Typography variant="subtitle1">Invoice Control</Typography>
          </Box>
        </Box>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Divider />
          </Box>
        </Box>
        <Box container>
          <Box item xs={12} style={{ textAlign: "center" }}>
            <div className={classes.rootmenu}>
              <Button
                variant="contained"
                onClick={(e) => openPage(e, getRoute("payment"))}
              >
                <Icon style={{ fontSize: 20, color: "#999" }}>home</Icon>
              </Button>
            </div>
          </Box>
        </Box>
        <Paper className={classes.paper}>
          <Box container spacing={2}>
            <Grid container spacing={4}>
              <Grid item lg={12}>
                <Box className="card no-padding">
                  <Box className="display-space-between">
                    <Box
                      className="search-bar me-3"
                      style={{ width: "25%", marginLeft: 10 }}
                    >
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
                      <Typography variant="body2" color="textSecondary">
                        <span
                          style={{
                            color: "#474545",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        ></span>
                        {accSubName}
                        {"  "}
                        <span
                          style={{
                            color: "#575454",
                            fontSize: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          {accSubCode}
                        </span>
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Typography align="left" className={classes.selectField}>
                    Outstanding Invoice
                  </Typography>
                  <TableContainer>
                    <Table aria-label="User List">
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell>Invoice Date</TableCell>

                          <TableCell
                            key="customer_company_name"
                            sortDirection={
                              orderBy === "customer_company_name"
                                ? order
                                : false
                            }
                          >
                            <TableSortLabel
                              active={orderBy === "customer_company_name"}
                              direction={
                                orderBy === "customer_company_name"
                                  ? order
                                  : "asc"
                              }
                              onClick={() =>
                                changeSort("customer_company_name")
                              }
                            >
                              Invoice Number
                            </TableSortLabel>
                          </TableCell>
                          <TableCell
                            key="project_name"
                            sortDirection={
                              orderBy === "project_name" ? order : false
                            }
                          >
                            <TableSortLabel
                              active={orderBy === "project_name"}
                              direction={
                                orderBy === "project_name" ? order : "asc"
                              }
                              onClick={() => changeSort("project_name")}
                            >
                              Customer
                            </TableSortLabel>
                          </TableCell>
                          <TableCell
                            key="payment_description"
                            sortDirection={
                              orderBy === "payment_description" ? order : false
                            }
                          >
                            <TableSortLabel
                              active={orderBy === "payment_description"}
                              direction={
                                orderBy === "payment_description"
                                  ? order
                                  : "asc"
                              }
                              onClick={() => changeSort("payment_description")}
                            >
                              Sales
                            </TableSortLabel>
                          </TableCell>

                          <TableCell
                            align="right"
                            key="credit_account"
                            sortDirection={
                              orderBy === "credit_account" ? order : false
                            }
                          >
                            <TableSortLabel
                              active={orderBy === "credit_account"}
                              direction={
                                orderBy === "credit_account" ? order : "asc"
                              }
                              onClick={() => changeSort("credit_account")}
                            >
                              Invoice Amount
                            </TableSortLabel>
                          </TableCell>

                          <TableCell
                            align="right"
                            key="credit_account"
                            sortDirection={
                              orderBy === "credit_account" ? order : false
                            }
                          >
                            <TableSortLabel
                              active={orderBy === "credit_account"}
                              direction={
                                orderBy === "credit_account" ? order : "asc"
                              }
                              onClick={() => changeSort("credit_account")}
                            >
                              Remaining Due
                            </TableSortLabel>
                          </TableCell>

                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listDataPayment?.result?.map((row, key) => (
                          <React.Fragment>
                            <TableRow key={key} hover>
                              <TableCell>
                                <IconButton
                                  aria-label="expand row"
                                  size="small"
                                  onClick={() =>
                                    setCollapseOpen(
                                      collapseOpen === key ? -1 : key
                                    )
                                  }
                                >
                                  {collapseOpen === key ? (
                                    <KeyboardArrowUpIcon />
                                  ) : (
                                    <KeyboardArrowDownIcon />
                                  )}
                                </IconButton>
                              </TableCell>
                              <TableCell>
                                {moment(row.invoice_date).format("L")}
                              </TableCell>
                              <TableCell>{row?.invoice_number}</TableCell>

                              <TableCell>{row?.sales?.name}</TableCell>
                              <TableCell>
                                {row?.customer_detail?.company_type}
                                {"  "}
                                {row?.customer_detail?.company}
                              </TableCell>
                              <TableCell align="right">
                                {currency(row.total_payment)}
                              </TableCell>
                              <TableCell align="right">
                                {currency(row.rest_payment)}
                              </TableCell>
                              <TableCell>
                                {row.status_match != 1 && (
                                  <IconButton>
                                    <AssignmentTurnedIn
                                      onClick={() =>
                                        historyForm(
                                          row?.id,
                                          row?.invoice_number
                                        )
                                      }
                                    />
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                colSpan={8}
                                style={{ paddingBottom: 0, paddingTop: 0 }}
                              >
                                <Collapse
                                  in={collapseOpen === key}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <Box
                                    sx={{
                                      width: "100%",
                                      backgroundColor: "rgba(50,50,50,0.4)",
                                      minHeight: 36,
                                      textAlign: "center",
                                      alignItems: "center",
                                      fontSize: 18,
                                    }}
                                  >
                                    <Typography
                                      variant="h4"
                                      gutterBottom
                                      component="div"
                                    >
                                      Invoice Detail
                                    </Typography>
                                    <Table size="small" aria-label="purchases">
                                      <TableRow>
                                        <TableCell
                                          width="20%"
                                          style={{ borderBottom: "none" }}
                                        >
                                          <Typography variant="h4" gutterBottom>
                                            Invoice Description
                                          </Typography>
                                        </TableCell>
                                        <TableCell
                                          style={{ borderBottom: "none" }}
                                        >
                                          {row?.invoice_description}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell
                                          width="20%"
                                          style={{ borderBottom: "none" }}
                                        >
                                          <Typography variant="h4" gutterBottom>
                                            Project Code
                                          </Typography>
                                        </TableCell>
                                        <TableCell
                                          style={{ borderBottom: "none" }}
                                        >
                                          {row?.project_code}
                                        </TableCell>
                                      </TableRow>

                                      <TableRow>
                                        <TableCell
                                          width="20%"
                                          style={{ borderBottom: "none" }}
                                        >
                                          <Typography variant="h4" gutterBottom>
                                            Customer Name
                                          </Typography>
                                        </TableCell>
                                        <TableCell
                                          style={{ borderBottom: "none" }}
                                        >
                                          {row?.customer_name}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell
                                          width="20%"
                                          style={{ borderBottom: "none" }}
                                        >
                                          <Typography variant="h4" gutterBottom>
                                            Customer Code
                                          </Typography>
                                        </TableCell>
                                        <TableCell
                                          style={{ borderBottom: "none" }}
                                        >
                                          {row?.customer_code}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell
                                          width="20%"
                                          style={{ borderBottom: "none" }}
                                        >
                                          <Typography variant="h4" gutterBottom>
                                            Customer Phone
                                          </Typography>
                                        </TableCell>
                                        <TableCell
                                          style={{ borderBottom: "none" }}
                                        >
                                          {row?.customer_phone}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell
                                          width="20%"
                                          style={{ borderBottom: "none" }}
                                        >
                                          <Typography variant="h4" gutterBottom>
                                            Customer Email
                                          </Typography>
                                        </TableCell>
                                        <TableCell
                                          style={{ borderBottom: "none" }}
                                        >
                                          {row?.customer_email}
                                        </TableCell>
                                      </TableRow>
                                    </Table>
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        ))}
                        {/* {listDataBank?.length == 0 && (
                          <TableRow>
                            <TableCell colspan={9} align="center">
                              No data to show
                            </TableCell>
                          </TableRow>
                        )} */}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TablePagination
                            rowsPerPageOptions={[20, 50, 100]}
                            colSpan={9}
                            count={rowCountBank}
                            rowsPerPage={rowsPerPage}
                            page={pageBank}
                            SelectProps={{
                              inputProps: { "aria-label": "rows per page" },
                              native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangerowsPerPage}
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
                  okAction={() => deletePayment()}
                  title="Delete confirmation"
                  body="Are you sure want to delete this record?"
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <Paper className={classes.paper}>
          <TableContainer>
            <Typography align="left" className={classes.selectField}>
              Paid Invoice
            </Typography>
            <Table aria-label="User List">
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Invoice Date</TableCell>

                  <TableCell
                    key="customer_company_name"
                    sortDirection={
                      orderBy === "customer_company_name" ? order : false
                    }
                  >
                    <TableSortLabel
                      active={orderBy === "customer_company_name"}
                      direction={
                        orderBy === "customer_company_name" ? order : "asc"
                      }
                      onClick={() => changeSort("customer_company_name")}
                    >
                      Invoice Number
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="project_name"
                    sortDirection={orderBy === "project_name" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "project_name"}
                      direction={orderBy === "project_name" ? order : "asc"}
                      onClick={() => changeSort("project_name")}
                    >
                      Customer
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="payment_description"
                    sortDirection={
                      orderBy === "payment_description" ? order : false
                    }
                  >
                    <TableSortLabel
                      active={orderBy === "payment_description"}
                      direction={
                        orderBy === "payment_description" ? order : "asc"
                      }
                      onClick={() => changeSort("payment_description")}
                    >
                      Sales
                    </TableSortLabel>
                  </TableCell>

                  <TableCell
                    align="right"
                    key="credit_account"
                    sortDirection={orderBy === "credit_account" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "credit_account"}
                      direction={orderBy === "credit_account" ? order : "asc"}
                      onClick={() => changeSort("credit_account")}
                    >
                      Invoice Amount
                    </TableSortLabel>
                  </TableCell>

                  <TableCell
                    align="right"
                    key="credit_account"
                    sortDirection={orderBy === "credit_account" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "credit_account"}
                      direction={orderBy === "credit_account" ? order : "asc"}
                      onClick={() => changeSort("credit_account")}
                    >
                      Remaining Due
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="right"
                    key="credit_account"
                    sortDirection={orderBy === "credit_account" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "credit_account"}
                      direction={orderBy === "credit_account" ? order : "asc"}
                      onClick={() => changeSort("credit_account")}
                    >
                      Invoice Status
                    </TableSortLabel>
                  </TableCell>

                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listDataPayment60Days?.result?.map((row, key) => (
                  <React.Fragment>
                    <TableRow key={key} hover>
                      <TableCell>{key + 1}</TableCell>
                      <TableCell>
                        {moment(row.invoice_date).format("L")}
                      </TableCell>
                      <TableCell>{row?.invoice_number}</TableCell>

                      <TableCell>
                        {row?.customer_detail?.company_type}
                        {"  "}
                        {row?.customer_detail?.company}
                      </TableCell>
                      <TableCell>{row?.sales?.name}</TableCell>
                      <TableCell align="right">
                        {currency(row.total_payment)}
                      </TableCell>
                      <TableCell align="right">
                        {currency(row.rest_payment)}
                      </TableCell>
                      <TableCell align="right">{row.invoice_status}</TableCell>
                      <TableCell>
                        {row.status_match != 1 && (
                          <IconButton>
                            <AssignmentTurnedIn
                              onClick={() =>
                                historyForm(row?.id, row?.invoice_number)
                              }
                            />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
                {/* {listDataBank?.length == 0 && (
                          <TableRow>
                            <TableCell colspan={9} align="center">
                              No data to show
                            </TableCell>
                          </TableRow>
                        )} */}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[20, 50, 100]}
                    colSpan={9}
                    count={rowCountBank}
                    rowsPerPage={rowsPerPage}
                    page={pageBank}
                    SelectProps={{
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangerowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>

        <InvoiceHistoryForm
          open={openInvoiceForm}
          closeModal={refreshHistoryList}
          idInvoice={idInvoice}
          invoiceNumber={invoiceNumber}
        />
      </div>
    </BaseLayout>
  );
}
