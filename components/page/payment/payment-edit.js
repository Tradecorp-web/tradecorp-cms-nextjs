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
  ButtonGroup,
  Tooltip,
  Collapse,
  IconButton,
  InputLabel,
  Modal,
} from "@material-ui/core";

import SvgIcon from "@material-ui/core/SvgIcon";

import {
  LOCAL_STORAGE_PREFIX,
  LOCAL_STORAGE_SUFFIX,
  LOCAL_STORAGE_THOUSAND,
  LOCAL_STORAGE_DECIMAL,
  LOCAL_STORAGE_SCALE,
} from "../../../helpers/consts";

import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import Autocomplete from "@material-ui/lab/Autocomplete";

import React, { Component, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";

import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";
import { currency, numberConvert } from "../../../helpers/general";

import {
  getListQuoteSwr,
  getListQuoteStatusAccSwr,
} from "../../../services/swr/quote.swr";
import {
  getDetailQuoteApi,
  getQuoteStatusAccApi,
} from "../../../services/api/quote.api";

import { getListSubAccStatusApi } from "../../../services/api/acc-sub.api";
import {
  insertSOApi,
  getAccMapSO,
} from "../../../services/api/sales-order.api";

import { insertPaymentInApi } from "../../../services/api/payment-in.api";
import moment from "moment";
import NumberFormat from "react-number-format";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { BrightnessMediumTwoTone } from "@material-ui/icons";

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Page(props) {
  const thousand = localStorage.getItem(LOCAL_STORAGE_THOUSAND);
  const decimal = localStorage.getItem(LOCAL_STORAGE_DECIMAL);
  const prefix = localStorage.getItem(LOCAL_STORAGE_PREFIX);
  const scale = parseInt(localStorage.getItem(LOCAL_STORAGE_SCALE));
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
  const [accSubBank, setAccSubBank] = useState([]);
  const [statusSub, setStatusSub] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const [readOnlyStyle, setReadOnlyStyle] = useState(false);

  const [optionQuoteList, setOptionQuoteList] = useState([]);
  const [tax, setTax] = useState(0);

  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [data, setData] = useState(true);
  const [disableSave, setDisableSave] = useState(true);

  const [errorText, setErrorText] = useState({
    // order_date: null,
    // estimate_delivery_date: null,
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
      insertPaymentInApi(formState, 2).catch((err) => {
        console.log(err);
        setErrorText(err);
      });
    }
  };

  const closeForm = () => {
    setData({
      id: null,
      name: null,
    });
    console.log("Close");
    props?.closeModal();
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

    // var eOrderDate = "";
    // var eEstimateDeliveryDate = "";

    // if (
    //   document.getElementById("order_date").value == "" ||
    //   document.getElementById("order_date").value == null
    // ) {
    //   isValid = false;
    //   eOrderDate = "Order Date";
    // }
    // if (
    //   document.getElementById("estimate_delivery_date").value == "" ||
    //   document.getElementById("estimate_delivery_date").value == null
    // ) {
    //   isValid = false;
    //   eEstimateDeliveryDate = "Estimate Delivery Date";
    // }
    // setErrorText({
    //   ...errorText,
    //   order_date: eOrderDate,
    //   estimate_delivery_date: eEstimateDeliveryDate,
    // });
    // var alert1 =
    //   eOrderDate + ", " + eEstimateDeliveryDate + " Can not be empty ";
    // var sendMsg = "";
    // if (alert1.substring(0, 1) == ",") {
    //   sendMsg = alert1.substring(1);
    // } else {
    //   sendMsg = alert1.substring(0);
    // }
    // setAlertMsg(sendMsg.replace(",  Can", " Can"));
    // if (isValid == false) {
    //   setOpenAlert(true);
    // } else {
    //   setOpenAlert(false);
    // }
    return isValid;
  }

  //useEffect
  useEffect(async () => {
    var dataSub = await getListSubAccStatusApi(statusSub);
    setAccSubBank(dataSub);
  }, [statusSub]);
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
    setReadOnlyStyle(classes.inputbase);
    // getCustomer(customerId);
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
  function onChangeDateInput(e) {
    if (e.target.name != "") {
      setFormState({
        ...formState,
        [e.target.name]: moment(e.target.value).toDate(),
      });
    }
    setOpenAlert(false);
  }
  function onChangeInput(e) {
    if (e.target.name != "") {
      setFormState({
        ...formState,
        [e.target.name]: e.target.value,
      });
    }
    setOpenAlert(false);
  }

  function onInputDetailChange(e) {
    // var val = numberConvert(e.target.value);
    // setFormState({
    //   ...formState,
    //   [e.target.name]: Number(val),
    // });
  }
  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }
  function getCashBank(e) {
    setStatusSub(e.target.value);
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
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
        if (res.customer.id != null) {
          setReadOnly(true);
          setReadOnlyStyle(classes.inputbasero);
        } else {
          setReadOnly(false);
          setReadOnlyStyle(classes.inputbase);
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

        setFormState({
          ...formState,
          quote_id: res.id,
          quote_date: res.quote_date,
          project_name: res.name,
          project_description: res.project_description,
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
          payment_in_currency: prefix,
          payment_in_files: [],
        });
      });
    } else {
      document.getElementById("customer_name").value = "";
      document.getElementById("sales_name").value = "";
      document.getElementById("sales_email").value = "";
    }
  }

  return (
    <Modal
      open={props?.open}
      onClose={closeForm}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {/* <BaseLayout title="Create Receive Payment"> */}
      <div className={classes.root}>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Typography variant="subtitle1">Edit Payment</Typography>
          </Box>
        </Box>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Divider />
          </Box>
        </Box>

        <Paper className={classes.paper}>
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
            <Box container spacing={2}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography className={classes.labelbase}>
                      Payment Date
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.labelbase}>
                      Payment Method
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <OutlinedInput
                      id="payment_in_date"
                      className={classes.inputbase}
                      name="payment_in_date"
                      type="date"
                      error={errorText.payment_in_date}
                      helperText={errorText.payment_in_date}
                      onChange={onChangeDateInput}
                      fullWidth
                    ></OutlinedInput>
                  </Grid>
                  <Grid item xs={6}>
                    <Select
                      id="payment_in_method"
                      name="payment_in_method"
                      labelId="demo-simple-select-label"
                      fullWidth
                      onClick={getCashBank}
                    >
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="bank">Bank</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box container spacing={2}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography className={classes.labelbase}>
                      &nbsp;
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.labelbase}>
                      Subsidiary Account
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    &nbsp;
                  </Grid>
                  <Grid item xs={6}>
                    <Select
                      id="subsidiary_account"
                      name="subsidiary_account"
                      labelId="demo-simple-select-label"
                      onChange={onChangeInput}
                      fullWidth
                    >
                      {accSubBank?.result?.map((row, key) => (
                        <MenuItem value={row?.subsidiary_code}>
                          {row?.subsidiary_code}
                          {"  "}
                          {row?.subsidiary_description}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </Box>
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
                className={classes.inputbase}
                variant="outlined"
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
                    <TextField className={classes.inputbase} {...params} />
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
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography className={classes.labelbase}>
                    Income Type
                  </Typography>
                </Grid>

                <Grid item xs={3}>
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
            </Box>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography className={classes.labelbase}>
                    Customer Name
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.labelbase}>
                    Company Name
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.labelbase}>Email</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <OutlinedInput
                    id="customer_name"
                    readOnly={readOnly}
                    // className={classes.inputbasero}
                    className={readOnlyStyle}
                    name="customer_name"
                    type="text"
                    onChange={onChangeInput}
                    fullWidth
                  ></OutlinedInput>
                </Grid>

                <Grid item xs={4}>
                  <OutlinedInput
                    id="customer_company_name"
                    readOnly={readOnly}
                    // className={classes.inputbasero}
                    className={readOnlyStyle}
                    name="customer_company_name"
                    onChange={onChangeInput}
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>

                <Grid item xs={4}>
                  <OutlinedInput
                    id="customer_email"
                    readOnly={readOnly}
                    className={readOnlyStyle}
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
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <Typography className={classes.labelbase}>Sales</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography className={classes.labelbase}>
                    Sales Email
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box item xs={10}>
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <OutlinedInput
                    readOnly={readOnly}
                    className={readOnlyStyle}
                    id="sales_name"
                    name="sales_name"
                    onChange={onChangeInput}
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
                <Grid item xs={3}>
                  <OutlinedInput
                    readOnly={readOnly}
                    className={readOnlyStyle}
                    id="sales_email"
                    onChange={onChangeInput}
                    name="sales_email"
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box container spacing={2}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>
                Payment Description
              </Typography>
            </Box>
            <Box item xs={10}>
              <OutlinedInput
                className={classes.inputbasemultiline}
                defaultValue=""
                rowsMax={5}
                multiline
                name="payment_in_description"
                id="payment_in_description"
                onChange={onChangeInput}
                type="textare"
                fullWidth
              ></OutlinedInput>
            </Box>
          </Box>

          <Box container spacing={2}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>
                Payment Amount
              </Typography>
            </Box>
            <Box item xs={10}>
              <NumberFormat
                name="payment_in_amount"
                id="payment_in_amount"
                customInput={TextField}
                thousandSeparator={thousand}
                decimalSeparator={decimal}
                scale={scale}
                prefix={prefix}
                inputmode="text"
                variant="outlined"
                fullWidth
                onChange={onInputDetailChange}
              />
            </Box>
          </Box>
        </Paper>
        <Paper className={classes.paper}>
          <Box container>
            <Box item xs={12} style={{ textAlign: "center" }}>
              <div className={classes.rootmenu}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={(e) => openPage(e, getRoute("payment"))}
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
      {/* </BaseLayout> */}
    </Modal>
  );
}
