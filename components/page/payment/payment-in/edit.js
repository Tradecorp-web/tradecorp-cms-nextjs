import BaseLayout from "../../../base_layout/base-layout-sidemenu-accounting";

import {
  Icon,
  Divider,
  Button,
  TextField,
  OutlinedInput,
  Box,
  Collapse,
  IconButton,
} from "@material-ui/core";

import {
  LOCAL_STORAGE_PREFIX,
  LOCAL_STORAGE_THOUSAND,
  LOCAL_STORAGE_DECIMAL,
  LOCAL_STORAGE_SCALE,
} from "../../../../helpers/consts";

import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";

import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";

import { useRouter } from "next/router";
import getRoute from "../../../../helpers/router";
import { numberConvert } from "../../../../helpers/general";

import { getListQuoteStatusAccSwr } from "../../../../services/swr/quote.swr";
import { getDetailPaymentInSwr } from "../../../../services/swr/payment-in.swr";

import { getListSubAccStatusApi } from "../../../../services/api/acc-sub.api";
import { getAccMapSO } from "../../../../services/api/sales-order.api";

import moment from "moment";
import NumberFormat from "react-number-format";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

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

export default function Page() {
  const thousand = localStorage.getItem(LOCAL_STORAGE_THOUSAND);
  const decimal = localStorage.getItem(LOCAL_STORAGE_DECIMAL);
  const prefix = localStorage.getItem(LOCAL_STORAGE_PREFIX);
  const scale = parseInt(localStorage.getItem(LOCAL_STORAGE_SCALE));
  //const
  const classes = useStyles();
  const router = useRouter();
  const [formState, setFormState] = useState(false);

  const [quoteList, setQuoteList] = useState([]);
  const [accMap, setAccMap] = useState([]);
  const [accSubBank, setAccSubBank] = useState([]);
  const [statusSub, setStatusSub] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const [readOnlyStyle, setReadOnlyStyle] = useState(false);
  const [payMethod, setPayMethod] = useState("");
  const [subAcc, setSubAcc] = useState("");
  const [projectCode, setProjectCode] = useState("");

  const [optionQuoteList, setOptionQuoteList] = useState([]);
  const [tax, setTax] = useState(0);

  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const [errorText, setErrorText] = useState({
    // order_date: null,
    // estimate_delivery_date: null,
  });

  //set param
  let param = { limit: 999 };
  var quoteSwr = getListQuoteStatusAccSwr(1);
  const payInSwr = getDetailPaymentInSwr(router.query.id);

  function checkValidation() {
    var isValid = true;

    return isValid;
  }

  //useEffect
  useEffect(async () => {
    var dataSub = await getListSubAccStatusApi(statusSub);
    setAccSubBank(dataSub);
  }, [statusSub]);
  useEffect(() => {
    setFormState(payInSwr?.data);
    setPayMethod(payInSwr?.data?.payment_in_method);
    setSubAcc(payInSwr?.data?.subsidiary_account);
    setStatusSub(payInSwr?.data?.payment_in_method);
    setProjectCode(payInSwr?.data?.project_code);
  }, [payInSwr]);

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
    var list = [];
    quoteList.map((item, i) => {
      list.push({
        id: item.id + "|" + item.project_code + "|" + item.customer_id,
        label: item.project_code + " " + item.name,
      });
    });
    setOptionQuoteList(list);
  }, [quoteList]);

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
    var val = numberConvert(e.target.value);
    setFormState({
      ...formState,
      [e.target.name]: Number(val),
    });
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

  return (
    <BaseLayout title="Create Receive Payment">
      <div className={classes.root}>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Typography variant="subtitle1">Create Receive Payment</Typography>
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
                onClick={(e) => openPage(e, getRoute("payment-out"))}
              >
                <Icon style={{ fontSize: 20, color: "yellow" }}>payment</Icon>
                Bill Payment
              </Button>
              <Button
                onClick={(e) => openPage(e, getRoute("payment-transaction"))}
                variant="contained"
                color="default"
              >
                <CompareArrowsIcon style={{ fontSize: 20 }} />
                Payment Transaction
              </Button>
            </div>
          </Box>
        </Box>

        <Paper className={classes.paper}>
          <Box container spacing={2}>
            <Box item>
              <ButtonBase>
                <Icon style={{ fontSize: 30, color: "#5d6d7e" }}>
                  peoplealt
                </Icon>
              </ButtonBase>{" "}
            </Box>
            <Box item xs={12} sm container>
              <Box item xs container direction="column" spacing={2}>
                <Box item xs>
                  <Typography gutterBottom variant="subtitle1">
                    Receive payment
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
                      value={moment(payInSwr?.data?.payment_in_date).format(
                        "YYYY-MM-DD"
                      )}
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
                      value={payMethod}
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
                      value={subAcc}
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
                    value={payInSwr?.data?.project_name}
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
                <Grid item xs={3}>
                  <OutlinedInput
                    id="project_code_text"
                    readOnly={true}
                    value={payInSwr?.data?.project_code}
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
                    value={moment(payInSwr?.data?.quote?.quote_date).format(
                      "L"
                    )}
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
                    value={payInSwr?.data?.quote?.income_type}
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
                    value={payInSwr?.data?.customer_name}
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
                    value={payInSwr?.data?.customer_company_name}
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
                    value={payInSwr?.data?.customer_email}
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
                    value={payInSwr?.data?.sales_name}
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
                    value={payInSwr?.data?.sales_email}
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
                value={payInSwr?.data?.payment_in_description}
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
                value={payInSwr?.data?.payment_in_amount}
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
      </div>
    </BaseLayout>
  );
}
