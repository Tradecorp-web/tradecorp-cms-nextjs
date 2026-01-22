import BaseLayout from "../../../../base_layout/base-layout-sidemenu-accounting";

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
  ButtonGroup,
  Tooltip,
  Collapse,
  IconButton,
  InputLabel,
} from "@material-ui/core";
import NumberFormat from "react-number-format";
import SvgIcon from "@material-ui/core/SvgIcon";

import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import Autocomplete from "@material-ui/lab/Autocomplete";

import React, { Component, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

import { useRouter } from "next/router";
import getRoute from "../../../../../helpers/router";
import { currency } from "../../../../../helpers/general";

import {
  getListQuoteSwr,
  getListQuoteStatusAccSwr,
} from "../../../../../services/swr/quote.swr";
import {
  getDetailQuoteApi,
  getQuoteStatusAccApi,
} from "../../../../../services/api/quote.api";

import {
  insertSOApi,
  getAccMapSO,
} from "../../../../../services/api/sales-order.api";
import { saveTrxJournal } from "../../../../../services/api/acc-trx-journal.api";
import moment from "moment";

import {
  LOCAL_STORAGE_PREFIX,
  LOCAL_STORAGE_SUFFIX,
  LOCAL_STORAGE_THOUSAND,
  LOCAL_STORAGE_DECIMAL,
  LOCAL_STORAGE_SCALE,
} from "../../../../../helpers/consts";

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

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
  const thousand = localStorage.getItem(LOCAL_STORAGE_THOUSAND);
  const decimal = localStorage.getItem(LOCAL_STORAGE_DECIMAL);
  const scale = localStorage.getItem(LOCAL_STORAGE_SCALE);
  const prefix = localStorage.getItem(LOCAL_STORAGE_PREFIX);
  //const
  const classes = useStyles();
  const router = useRouter();
  const [openForm, setOpenForm] = useState(false);
  const [formState, setFormState] = useState(false);

  const [customerId, setCustomerId] = useState("");
  const [descriptionData, setDescriptionData] = useState([]);

  const [quoteList, setQuoteList] = useState([]);
  const [quoteTotalData, setQuoteTotalData] = useState(0);
  const [qData, setQData] = useState([]);
  const [accMap, setAccMap] = useState([]);

  const [optionQuoteList, setOptionQuoteList] = useState([]);
  const [tax, setTax] = useState(0);

  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [disableSave, setDisableSave] = useState(true);

  const [errorText, setErrorText] = useState({
    order_date: null,
    estimate_delivery_date: null,
  });

  const onProjectCodeChange = (event, value, extra) => {
    var objekval = Object.values(value);
    var objekvalQuoteID = objekval[0].split("|");
    setFormState({ ...formState, project_code: objekvalQuoteID[1] });
    setCustomerId(objekvalQuoteID[0]);
  };

  //set param
  let param = { limit: 999 };
  var quoteSwr = getListQuoteStatusAccSwr(1);

  const sendData = (e) => {
    if (checkValidation()) {
      insertSOApi(formState, 2)
        .then((res) => {
          if (res != 0) {
            saveTrxJournal(setAcc());
            setOpen(true);
            setDisableSave(true);
            router.push("/sales/" + res);
          }
        })
        .catch((err) => {
          console.log(err);
          setErrorText(err);
        });
    }
  };
  function setAcc() {
    var detailAccSave = {};
    var accTmp = [];

    accMap?.result?.map((res) => {
      var debet = 0,
        credit = 0;
      if (res.accounting_debit) {
        debet = quoteTotalData;
      } else {
        credit = quoteTotalData;
      }
      accTmp.push({
        coa_id: res.coa_id,
        coa_code: res.accounting_coa_code,
        coa_name: res.application_name,
        remark_detail: "Penjualan Container",
        subsidiary_code: "",
        subsidiary_description: "",
        debit: debet,
        credit: credit,
      });
    });
    var dataAccSave = {
      company_id: formState.customer_id,
      trx_date: moment().format("YYYY-MM-DD" + "T01:00:00.000Z"),
      reference_document: "Sales Order",
      project_code: formState.project_code,
      remarks: "Sales Order " + formState.project_name,
      team_code: formState.team_code,
      team_name: "",
      details: accTmp,
    };
    return dataAccSave;
  }
  function checkValidation() {
    var isValid = true;

    var eOrderDate = "";
    var eEstimateDeliveryDate = "";

    if (
      document.getElementById("order_date").value == "" ||
      document.getElementById("order_date").value == null
    ) {
      isValid = false;
      eOrderDate = "Order Date";
    }
    if (
      document.getElementById("estimate_delivery_date").value == "" ||
      document.getElementById("estimate_delivery_date").value == null
    ) {
      isValid = false;
      eEstimateDeliveryDate = "Estimate Delivery Date";
    }
    setErrorText({
      ...errorText,
      order_date: eOrderDate,
      estimate_delivery_date: eEstimateDeliveryDate,
    });
    var alert1 =
      eOrderDate + ", " + eEstimateDeliveryDate + " Can not be empty ";
    var sendMsg = "";
    if (alert1.substring(0, 1) == ",") {
      sendMsg = alert1.substring(1);
    } else {
      sendMsg = alert1.substring(0);
    }
    setAlertMsg(sendMsg.replace(",  Can", " Can"));
    if (isValid == false) {
      setOpenAlert(true);
    } else {
      setOpenAlert(false);
    }
    return isValid;
  }

  //useEffect
  useEffect(async () => {
    const mapApi = await getAccMapSO();
    setAccMap(mapApi);
  }, [getAccMapSO]);

  useEffect(() => {
    if (quoteSwr?.data) {
      setQuoteList(quoteSwr?.data.result ?? []);
    }
  }, [quoteSwr]);
  useEffect(() => {
    getCustomer(customerId);
  }, [customerId]);
  useEffect(() => {
    setDisableSave(false);

    console.log(formState);
    setTax(0.11);
  }, [formState]);
  useEffect(() => {
    var list = [];
    // list.push({ id: "-", label: "" });
    quoteList.map((item, i) => {
      list.push({
        id: item.id + "|" + item.project_code + "|" + item.customer_id,
        label: item.project_code + " " + item.name,
      });
    });
    setOptionQuoteList(list);
  }, [quoteList]);

  // setAccMap(getAccMapSO());

  //function
  function onChangeInput(e) {
    if (e.target.name != "") {
      var value = e.target.value;
      if (e.target.type == "date") {
        value = e.target.value + "T01:00:00.000Z";
      }
      setFormState({
        ...formState,
        [e.target.name]: value,
      });
    }
    setOpenAlert(false);
  }
  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }
  function getCustomer(id) {
    var listCustomer = [];
    var listSales = [];
    var listCS = [];
    var listCS2 = [];
    var total = 0;
    var total2 = 0;
    var subtotal = 0;
    var customer = "";
    if (id != "") {
      getDetailQuoteApi(id).then((res) => {
        document.getElementById("quote_date").value = res.quote_date;
        document.getElementById("customer_name").value = res.customer.name;
        if (res.customer.company != null && res.customer.company != null) {
          customer = res.customer.company + ", " + res.customer.company_type;
        } else {
          if (res.customer.name != null) {
            customer = res.customer.name;
          }
        }

        document.getElementById("customer_company_name").value = customer;
        document.getElementById("customer_email").value = res.customer.email;
        document.getElementById("sales_name").value = res.sales.name;
        document.getElementById("sales_email").value = res.sales.email;
        document.getElementById("project_name").value = res.name;
        document.getElementById("project_code_text").value = res.project_code;
        // document.getElementById("status_detail_name").value =
        //   res.status_detail.id + " " + res.status_detail.name;
        document.getElementById("income_type").value = res.income_type;

        listCustomer.push({
          customer_id: res.customer_id,
          customer_code: res.customer.customer_code,
          customer_name: res.customer.name,
          customer_company_name: res.customer.company,
          customer_company_type: res.customer.company_type,
          customer_address: res.customer.address,
          customer_phone: res.customer.phone_number,
          customer_email: res.customer.email,
        });
        listSales.push({
          sales_id: res.sales_id,
          sales_username: res.sales.username,
          sales_name: res.sales.name,
          sales_email: res.sales.email,
          sales_phone_number: res.sales.phone_number,
        });

        if (typeof res.container_stocks != "undefined") {
          res.container_stocks.map((itemCS, i) => {
            if (itemCS.stock_id != "") {
              listCS.push({
                container_id: itemCS.stock_id,
                quantity: 1,
                price: itemCS.price,
                uom: "unit",
                description: itemCS.remark + " " + itemCS.serial_number,
              });
            }
            if (isNaN(itemCS.price) == false) {
              total = total + itemCS.price;
            }
          });
        } else {
          listCS = [];
        }

        if (typeof res.containers != "undefined") {
          res.containers.map((itemCS2, i) => {
            if (itemCS2.qty > 0) {
              listCS2.push({
                container_id: "",
                quantity: itemCS2.qty,
                price: itemCS2.price,
                uom: "unit",
                description: itemCS2.remark,
              });
              if (isNaN(itemCS2.qty) == false) {
                subtotal = itemCS2.price * itemCS2.qty;
              }

              total2 = total2 + subtotal;
            }
          });
        } else {
          listCS2 = [];
        }
        setQData(listCS.concat(listCS2));
        setQuoteTotalData(total + total2);
        setFormState({
          ...formState,
          quote_id: res.id,
          quote_date: res.quote_date,
          project_name: res.name,
          income_type: res.income_type,
          company_id: res.company_id,
          customer_id: res.customer_id,
          customer_code: res.customer.customer_code,
          customer_name: res.customer.name,
          customer_company_name: res.customer.company,
          customer_company_type: res.customer.company_type,
          customer_address: res.customer.address,
          customer_phone: res.customer.phone_number,
          customer_email: res.customer.email,
          sales_id: res.sales_id,
          sales_username: res.sales.username,
          sales_name: res.sales.name,
          sales_email: res.sales.email,
          sales_phone_number: res.sales.phone_number,
          description: listCS.concat(listCS2),
          sales_order_file: [],
        });
      });
    } else {
      document.getElementById("customer_name").value = "";
      // document.getElementById("customer_code").value = "";
      document.getElementById("sales_name").value = "";
      document.getElementById("sales_email").value = "";
    }
  }

  return (
    <BaseLayout title="New Sales Order">
      <div className={classes.root}>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Typography variant="subtitle1">Input Bank Statement</Typography>
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
                onClick={(e) => openPage(e, getRoute("sales"))}
              >
                <Icon style={{ fontSize: 20, color: "#999" }}>home</Icon>
              </Button>
              <Button
                variant="contained"
                color="default"
                onClick={(e) =>
                  openPage(e, getRoute("sales.sales-order-ongoing"))
                }
              >
                <Icon style={{ fontSize: 20, color: "yellow" }}>
                  pending_actions
                </Icon>
                {"  "}
                Sales Order List
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
          </Box>
        </Box>

        <Paper className={classes.paper}>
          <Box container spacing={2}>
            <Box item>
              <ButtonBase>
                <Icon style={{ fontSize: 30, color: "#5d6d7e" }}>
                  open_in_new
                </Icon>
              </ButtonBase>{" "}
            </Box>
            <Box item xs={12} sm container>
              <Box item xs container direction="column" spacing={2}>
                <Box item xs>
                  <Typography gutterBottom variant="subtitle1">
                    New Sales Order
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box container spacing={2}>
            <Box item xs={6} style={{ textAlign: "center" }}>
              <Collapse in={open}>
                <Alert
                  severity="success"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  Insert data success!
                </Alert>
              </Collapse>
              <Collapse in={openAlert}>
                <Alert
                  severity="warning"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpenAlert(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {alertMsg}
                </Alert>
              </Collapse>
            </Box>
          </Box>

          <Box container spacing={2} xs={12}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>
                Project Code
              </Typography>
            </Box>
            <Box item xs={10}>
              <Autocomplete
                variant="outlined"
                size="small"
                name="project_code"
                label="Project Code"
                options={optionQuoteList}
                autoHighlight
                onChange={(e, v) => onProjectCodeChange(e, v, true)}
                getOptionLabel={(option) => option?.label || ""}
                renderOption={(option) => (
                  <Typography className={classes.comboOptions}>
                    {option?.label}
                  </Typography>
                )}
                renderInput={(params) => {
                  params.inputProps.className = classes.comboOptions;
                  return (
                    <TextField size="small" variant="outlined" {...params} />
                  );
                }}
              />
            </Box>
          </Box>

          <Box container spacing={2}>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography className={classes.labelbase}>
                    Project Name
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography className={classes.labelbase}>
                    Project Code
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography className={classes.labelbase}>
                    Quote Date
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <OutlinedInput
                    id="project_name"
                    readOnly={true}
                    className={classes.inputbasero}
                    name="project_name"
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
                <Grid item xs={3}>
                  <OutlinedInput
                    id="project_code_text"
                    readOnly={true}
                    className={classes.inputbasero}
                    name="project_code_text"
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>

                <Grid item xs={3}>
                  <OutlinedInput
                    id="quote_date"
                    readOnly={true}
                    className={classes.inputbasero}
                    name="quote_date"
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography className={classes.labelbase}>
                Customer Name
              </Typography>
            </Box>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <OutlinedInput
                    id="customer_name"
                    readOnly={true}
                    className={classes.inputbasero}
                    name="customer_name"
                    type="text"
                    onChange={onChangeInput}
                    fullWidth
                  ></OutlinedInput>
                </Grid>

                <Grid item xs={4}>
                  <OutlinedInput
                    id="customer_company_name"
                    readOnly={true}
                    className={classes.inputbasero}
                    name="customer_company_name"
                    onChange={onChangeInput}
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>

                <Grid item xs={4}>
                  <OutlinedInput
                    id="customer_email"
                    readOnly={true}
                    className={classes.inputbasero}
                    name="customer_email"
                    onChange={onChangeInput}
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box container spacing={2}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>Sales</Typography>
            </Box>
            <Box item xs={10}>
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <OutlinedInput
                    id="sales_name"
                    readOnly={true}
                    className={classes.inputbasero}
                    name="sales_name"
                    onChange={onChangeInput}
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
                <Grid item xs={3}>
                  <OutlinedInput
                    id="sales_email"
                    readOnly={true}
                    className={classes.inputbasero}
                    onChange={onChangeInput}
                    name="sales_email"
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>

        <Paper className={classes.paper}>
          <h2 className="mb-3 mt-5">Descriptions</h2>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Typography className={classes.labelbase}>Income Type</Typography>
            </Grid>

            <Grid item xs={2}>
              <OutlinedInput
                id="income_type"
                readOnly={true}
                className={classes.inputbasero}
                name="income_type"
                type="text"
                fullWidth
              ></OutlinedInput>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Typography className={classes.labelbase}>Tax</Typography>
            </Grid>

            <Grid item xs={10}>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                  <FormControlLabel
                    value="start"
                    control={<Switch color="primary" />}
                    label=""
                    labelPlacement="start"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Typography className={classes.labelbase}>
                Down Payment
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <NumberFormat
                id="down_payment_persen"
                name="down_payment_persen"
                variant="outlined"
                customInput={TextField}
                thousandSeparator={thousand}
                decimalSeparator={decimal}
                scale={scale}
                inputmode="text"
                size="small"
              />
            </Grid>
            <Grid item xs={1}>
              <Typography className={classes.labelbase}>%</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Typography className={classes.labelbase}>Amount</Typography>
            </Grid>

            <Grid item xs={10}>
              {currency(quoteTotalData)}
            </Grid>
          </Grid>

          <Box className="mb-3">
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="Item Description">
                {/* <TableHead>
                  <TableRow>
                    <TableCell align="left">Item Description</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead> */}
                <TableBody>
                  {/* {qData?.map((row, key) => (
                    <TableRow hover>
                      <TableCell key={row.id} align="left">
                        {row.description}
                      </TableCell>
                      <TableCell key={row.id} align="right">
                        {row.quantity} {row.uom}
                      </TableCell>
                      <TableCell key={row.id} align="right">
                        {currency(row.price)}
                      </TableCell>
                      <TableCell key={row.id} align="right">
                        {currency(row.price * row.quantity)}
                      </TableCell>
                    </TableRow>
                  ))} */}
                  <TableRow>
                    <TableCell
                      align="right"
                      colSpan={3}
                      className={classes.tablefooter}
                    >
                      Total
                    </TableCell>
                    <TableCell align="right" className={classes.tablefooter}>
                      {currency(quoteTotalData)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      align="right"
                      colSpan={3}
                      className={classes.tablefooter}
                    >
                      Tax
                    </TableCell>
                    <TableCell align="right" className={classes.tablefooter}>
                      {currency(quoteTotalData * tax)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      align="right"
                      colSpan={3}
                      className={classes.tablefooter}
                    >
                      Total After Tax
                    </TableCell>
                    <TableCell align="right" className={classes.tablefooter}>
                      {currency(quoteTotalData + quoteTotalData * tax)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>

        <Paper className={classes.paper}>
          <Box container>
            <Box item xs={12} style={{ textAlign: "center" }}>
              <div className={classes.rootmenu}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={(e) => openPage(e, getRoute("sales"))}
                >
                  <Icon style={{ fontSize: 20, color: "yellow" }}>cancel</Icon>
                  {"  "}
                  Cancel
                </Button>
                <Button
                  disabled={disableSave}
                  onClick={(e) => sendData(e)}
                  variant="contained"
                  color="primary"
                >
                  <Icon style={{ fontSize: 20, color: "#af601a" }}>save</Icon>
                  {"  "}
                  Save
                </Button>
              </div>
            </Box>
          </Box>
        </Paper>
      </div>
    </BaseLayout>
  );
}
