import BaseLayout from "../../base_layout/base-layout-sidemenu-accounting";

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

import AlertDialog from "../../../components/base_component/dialog";
import { Edit, Delete, Check } from "@material-ui/icons";

import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";

import {
  getListPaymentCriteriaApi,
  getListByBankPeriod,
  getDetailPaymentApi,
  deletePaymentApi,
} from "../../../services/api/payment.api";
import { getListSubAccStatusApi } from "../../../services/api/acc-sub.api";
import { currency } from "../../../helpers/general";

import PaymentEditForm from "./payment-edit";
import PaymentHistoryForm from "./history/payment-history";

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
  const [dataHistory, setDataHistory] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openHistoryForm, setOpenHistoryForm] = useState(false);

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
  const [idPayment, setIdPayment] = useState("");

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
  const getDataPayment = async (vSubAcc) => {
    try {
      setOpen(true);

      var data = await getListByBankPeriod(vSubAcc, period.date1, period.date2);
      // setRowCount(data.total);

      setListDataPayment(data);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const deletePayment = async () => {
    setOpenDialog(false);
    setOpen(true);
    var result = await deletePaymentApi(idData);
    refreshList();
    setOpen(false);
  };

  const editForm = (id) => {
    if (id != null) {
      router.push("/payment/" + id);
    }
  };
  const historyForm = (id) => {
    setIdPayment(id);
    setOpenHistoryForm(true);
  };
  const refreshHistoryList = () => {
    setOpenHistoryForm(false);
  };
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
  //useEffect
  useEffect(async () => {
    var dataSub = await getListSubAccStatusApi("cash");
    var dataCol = [];
    dataSub?.result?.map((row) => {
      dataCol.push({
        code: row.subsidiary_code,
        description: row.subsidiary_description,
      });
    });
    var dataSub = await getListSubAccStatusApi("bank");
    dataSub?.result?.map((row) => {
      dataCol.push({
        code: row.subsidiary_code,
        description: row.subsidiary_description,
      });
    });
    setListSubAcc(dataCol);
  }, []);
  useEffect(async () => {
    try {
      var data = await getListByBankPeriod(
        subAcc,
        date1,
        date2,
        "",
        0,
        0,
        orderBy,
        order
      );
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
    } catch (err) {
      console.log(err);
    }
  }, []);

  //function

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  function onChangeInput(e) {
    getDataPayment(e.target.value);
    setSubAcc(e.target.value);
  }
  return (
    <BaseLayout title="Payment Transaction">
      <div className={classes.root}>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Typography variant="subtitle1">Payment Transction</Typography>
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
              <Button
                variant="contained"
                color="default"
                onClick={(e) => openPage(e, getRoute("payment-input"))}
              >
                <Icon style={{ fontSize: 20, color: "yellow" }}>peoplealt</Icon>
                {"  "}
                Add Payment
              </Button>
              {/* <Button
                variant="contained"
                color="default"
                onClick={(e) => openPage(e, getRoute("payment-history"))}
              >
                <Icon style={{ fontSize: 20, color: "green" }}>history</Icon>
                {"  "}
                Payment History by Invoice
              </Button> */}

              {/* <Button
                variant="contained"
                color="default"
                onClick={(e) => openPage(e, getRoute("payment-history"))}
              >
                <Icon style={{ fontSize: 20, color: "black" }}>history</Icon>
                {"  "}
                Payment History
              </Button> */}
            </div>
          </Box>
        </Box>
        <Paper className={classes.paper}>
          <Box container spacing={2}>
            <Box item>
              <span>
                <InputBase
                  readOnly={true}
                  className={classes.dateField}
                  defaultValue="From date"
                  inputProps={{ "aria-label": "naked" }}
                />
              </span>
              <span>
                <InputBase
                  readOnly={true}
                  className={classes.dateField}
                  defaultValue="To date"
                  inputProps={{ "aria-label": "naked" }}
                />
              </span>
            </Box>
          </Box>
          <Box container spacing={2}>
            <Box item>
              <span>
                <TextField
                  id="date1"
                  name="date1"
                  variant="outlined"
                  type="date"
                  onChange={dateChange}
                  className={classes.dateField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </span>
              <span>
                <TextField
                  id="date2"
                  name="date2"
                  variant="outlined"
                  type="date"
                  onChange={dateChange}
                  className={classes.dateField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </span>
            </Box>
          </Box>

          <Box container spacing={2}>
            <Box item className="mt-3">
              <Typography align="left" className={classes.selectField}>
                Payment method
              </Typography>
            </Box>
            <Box item>
              <span>
                <Select
                  id="subsidiary_account"
                  name="subsidiary_account"
                  variant="outlined"
                  className={classes.selectField}
                  onChange={onChangeInput}
                  fullWidth
                >
                  {listSubAcc?.map((row, key) => (
                    <MenuItem value={row?.code}>
                      {row?.code}
                      {"  "}
                      {row?.description}
                    </MenuItem>
                  ))}
                </Select>
              </span>
            </Box>
          </Box>
        </Paper>
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
                      <Button
                        color="secondary"
                        variant="contained"
                        disableElevation
                        className="mb-4"
                        onClick={(e) =>
                          openPage(e, getRoute("bank-statement-import"))
                        }
                      >
                        <Icon>account_balance</Icon>Import Bank Statement
                      </Button>
                    </Box>
                  </Box>
                  <Divider />
                  <TableContainer>
                    <Table aria-label="User List">
                      <TableHead>
                        <TableRow>
                          <TableCell>No</TableCell>
                          <TableCell>Payment Date</TableCell>
                          <TableCell>Payment Code</TableCell>
                          <TableCell
                            key="subsidiary_account"
                            sortDirection={
                              orderBy === "subsidiary_account" ? order : false
                            }
                          >
                            <TableSortLabel
                              active={orderBy === "subsidiary_account"}
                              direction={
                                orderBy === "subsidiary_account" ? order : "asc"
                              }
                              onClick={() => changeSort("subsidiary_account")}
                            >
                              Subsidiary Account
                            </TableSortLabel>
                          </TableCell>

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
                              Trx Code
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
                              Project
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
                              Payment Description
                            </TableSortLabel>
                          </TableCell>
                          <TableCell
                            align="right"
                            key="debit_account"
                            sortDirection={
                              orderBy === "debit_account" ? order : false
                            }
                          >
                            <TableSortLabel
                              active={orderBy === "debit_account"}
                              direction={
                                orderBy === "debit_account" ? order : "asc"
                              }
                              onClick={() => changeSort("debit_account")}
                            >
                              Debit Account
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
                              Credit Account
                            </TableSortLabel>
                          </TableCell>

                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listDataPayment?.result?.map((row, key) => (
                          <TableRow key={key} hover>
                            <TableCell onClick={() => editForm(row.id)}>
                              {key + 1 + pageBank * rowsPerPage}
                            </TableCell>
                            <TableCell onClick={() => editForm(row.id)}>
                              {moment(row.payment_date).format("L")}
                            </TableCell>{" "}
                            <TableCell onClick={() => editForm(row.id)}>
                              {row.payment_code}
                            </TableCell>
                            <TableCell onClick={() => editForm(row.id)}>
                              {row.subsidiary_account}
                            </TableCell>
                            <TableCell onClick={() => editForm(row.id)}>
                              {row.payment_trx_code}
                            </TableCell>
                            <TableCell onClick={() => editForm(row.id)}>
                              {row?.project_name}
                            </TableCell>
                            <TableCell onClick={() => editForm(row.id)}>
                              {row?.payment_description}
                            </TableCell>
                            <TableCell
                              align="right"
                              onClick={() => editForm(row.id)}
                            >
                              {currency(row.debit_account)}
                            </TableCell>
                            <TableCell
                              align="right"
                              onClick={() => editForm(row.id)}
                            >
                              {currency(row.credit_account)}
                            </TableCell>
                            <TableCell
                              onClick={() => editForm(row.id)}
                            ></TableCell>
                            <TableCell>
                              <IconButton>
                                <Edit onClick={() => editForm(row.id)} />
                                {"  "}
                              </IconButton>
                              <IconButton>
                                <Check onClick={() => historyForm(row.id)} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
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

        <PaymentEditForm
          open={openForm}
          closeModal={refreshList}
          paymentData={data}
        />
        <PaymentHistoryForm
          open={openHistoryForm}
          closeModal={refreshHistoryList}
          idPayment={idPayment}
        />
      </div>
    </BaseLayout>
  );
}
