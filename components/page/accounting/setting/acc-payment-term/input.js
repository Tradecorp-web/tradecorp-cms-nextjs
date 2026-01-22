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
  Select,
  MenuItem,
  CardHeader,
  CardContent,
  CardActions,
  TableFooter,
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
import { Delete, Add, Save } from "@material-ui/icons";
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
import { saveAccPaymentTermApi } from "../../../../../services/api/acc-payment-term.api";
import moment from "moment";

import {
  LOCAL_STORAGE_PREFIX,
  LOCAL_STORAGE_SUFFIX,
  LOCAL_STORAGE_THOUSAND,
  LOCAL_STORAGE_DECIMAL,
  LOCAL_STORAGE_SCALE,
} from "../../../../../helpers/consts";

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
  table: {
    flex: 1,
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

  const [customerId, setCustomerId] = useState("");

  const [quoteList, setQuoteList] = useState([]);
  const [quoteTotalData, setQuoteTotalData] = useState(0);
  const [qData, setQData] = useState([]);
  const [accMap, setAccMap] = useState([]);
  const [formState, setFormState] = useState([]);
  const [inputList, setInputList] = useState([
    {
      payment_number: null,
      payment_type: null,
      peyment_detail_description: null,
      payment_term_type: null,
      payment_value: null,
      days_due_date: null,
    },
  ]);

  const handleInputAdd = () => {
    setPaymentNumber("");
    setInputList([
      ...inputList,
      {
        payment_number: null,
        payment_type: null,
        peyment_detail_description: null,
        payment_term_type: null,
        payment_value: null,
        days_due_date: null,
      },
    ]);
  };
  const handleServiceRemove = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };
  const [optionQuoteList, setOptionQuoteList] = useState([]);
  const [tax, setTax] = useState(0);

  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [disableSave, setDisableSave] = useState(true);
  const [paymentNumber, setPaymentNumber] = useState("");

  const [errorText, setErrorText] = useState({
    order_date: null,
    estimate_delivery_date: null,
  });
  const numberRows = [];
  for (let i = 1; i <= 20; i++) {
    numberRows.push(i);
  }

  //set param
  let param = { limit: 999 };
  var quoteSwr = getListQuoteStatusAccSwr(1);

  const sendData = (e) => {
    setDisableSave(true);

    if (inputList != null) {
      // setFormState({ ...formState, payment_term_details: inputList });
      if (checkValidation()) {
        saveAccPaymentTermApi(formState)
          .then((res) => {
            if (res.id != null) {
              router.push("/accounting/setting/acc-payment-term");
            }
          })
          .catch((err) => {
            console.log(err);
            setErrorText(err);
          });
      }
    }
  };

  const onInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  const onTaxChange = (e) => {
    if (e.target.checked) {
      setFormState({ ...formState, tax_percent: 11 });
    } else {
      setFormState({ ...formState, tax_percent: 0 });
    }
  };
  const onInputDetailNumChange = (event, value, extra, index) => {
    var list = [...inputList];
    list[index][event.target.name] = parseInt(event.target.value);
    setInputList(list);
  };
  const onInputDetailChange = (event, value, extra, index) => {
    var list = [...inputList];
    list[index][event.target.name] = event.target.value;
    setInputList(list);
  };
  const onSelectDetailChange = (event, value, extra, index) => {
    var list = [...inputList];
    setPaymentNumber(event.target.value);
    list[index][event.target.name] = event.target.value;
    setInputList(list);
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
    setErrorText({
      ...errorText,
      // order_date: eOrderDate,
      // estimate_delivery_date: eEstimateDeliveryDate,
    });
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
    const mapApi = await getAccMapSO();
    setAccMap(mapApi);
  }, [getAccMapSO]);

  useEffect(() => {
    if (quoteSwr?.data) {
      setQuoteList(quoteSwr?.data.result ?? []);
    }
  }, [quoteSwr]);
  useEffect(() => {
    setFormState({ ...formState, payment_term_details: inputList });
  }, [inputList]);
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

  return (
    <BaseLayout title="New Payment Term Schema">
      <div className={classes.root}>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Typography variant="subtitle1">New Payment Term Schema</Typography>
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
                onClick={(e) => openPage(e, getRoute("accounting.setting"))}
              >
                <Icon style={{ fontSize: 20, color: "#999" }}>home</Icon>
              </Button>
              <Button
                variant="contained"
                color="default"
                onClick={(e) =>
                  openPage(e, getRoute("accounting.setting.acc-payment-term"))
                }
              >
                <Icon style={{ fontSize: 20, color: "yellow" }}>
                  pending_actions
                </Icon>
                {"  "}
                Payment Term List
              </Button>
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
                    New Payment Term
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
                Payment Method
              </Typography>
            </Box>
            <Box item xs={6}>
              <Select
                className={classes.inputbase}
                variant="outlined"
                size="small"
                fullWidth
                labelId="demo-simple-select-label"
                id="method"
                name="method"
                // value={age}
                onChange={onInputChange}
              >
                <MenuItem value="Sale">Sale</MenuItem>
                <MenuItem value="Lease">Lease</MenuItem>
                <MenuItem value="Service">Service</MenuItem>
              </Select>
            </Box>
          </Box>
          <Box container spacing={2} xs={12}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>
                Payment Name
              </Typography>
            </Box>
            <Box item xs={6}>
              <OutlinedInput
                id="payment_name"
                className={classes.inputbase}
                name="payment_name"
                type="text"
                onChange={onInputChange}
                fullWidth
              ></OutlinedInput>
            </Box>
          </Box>
          <Box container spacing={2} xs={12}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>
                Payment Description
              </Typography>
            </Box>
            <Box item xs={6}>
              <OutlinedInput
                id="payment_description"
                className={classes.inputbase}
                name="payment_description"
                onChange={onInputChange}
                type="text"
                fullWidth
              ></OutlinedInput>
            </Box>
          </Box>
          <Box container spacing={2} xs={12}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>Tax</Typography>
            </Box>
            <Box item xs={6}>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                  <FormControlLabel
                    value="true"
                    control={<Switch color="primary" />}
                    label=""
                    labelPlacement="true"
                    onChange={onTaxChange}
                  />
                </FormGroup>
              </FormControl>
            </Box>
          </Box>
        </Paper>

        <Paper className={classes.paper}>
          <h2 className="mb-3 mt-5">Detail Payment</h2>
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="10%">
                    Payment
                    <br />
                    Number
                  </TableCell>
                  <TableCell width="10%" align="center">
                    Payment
                    <br />
                    Type
                  </TableCell>
                  <TableCell width="10%" align="center">
                    Payment
                    <br />
                    Term Type
                  </TableCell>
                  <TableCell width="10%" align="center">
                    Value
                  </TableCell>
                  <TableCell width="10%" align="center">
                    Due Date
                  </TableCell>
                  <TableCell width="50%" align="center">
                    Description
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inputList.map((detailData, index) => (
                  <TableRow key={detailData.payment_number}>
                    <TableCell component="th" scope="row">
                      <Select
                        variant="outlined"
                        size="small"
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="payment_number"
                        name="payment_number"
                        defaultValue={paymentNumber}
                        onChange={(e, v) =>
                          onSelectDetailChange(e, v, true, index)
                        }
                      >
                        {numberRows.map((rows) => (
                          <MenuItem value={rows}>{rows}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell align="center">
                      <Select
                        variant="outlined"
                        fullWidth
                        id="payment_type"
                        name="payment_type"
                        onChange={(e, v) =>
                          onInputDetailChange(e, v, true, index)
                        }
                      >
                        <MenuItem value="payment">Payment</MenuItem>
                        <MenuItem value="deposit">Deposit</MenuItem>
                        <MenuItem value="down_payment">Down Payment</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="center">
                      <Select
                        variant="outlined"
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="payment_term_type"
                        name="payment_term_type"
                        onChange={(e, v) =>
                          onInputDetailChange(e, v, true, index)
                        }
                      >
                        <MenuItem value="percent">Percent</MenuItem>
                        <MenuItem value="balance">Balance</MenuItem>
                        <MenuItem value="flat">Flat Amount</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="center">
                      <NumberFormat
                        name="payment_value"
                        id="payment_value"
                        customInput={TextField}
                        thousandSeparator={thousand}
                        decimalSeparator={decimal}
                        scale={2}
                        type="number"
                        variant="outlined"
                        fullWidth
                        onChange={(e, v) =>
                          onInputDetailNumChange(e, v, true, index)
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <NumberFormat
                        name="days_due_date"
                        id="days_due_date"
                        customInput={TextField}
                        thousandSeparator={thousand}
                        decimalSeparator={decimal}
                        scale={2}
                        onChange={(e, v) =>
                          onInputDetailNumChange(e, v, true, index)
                        }
                        type="number"
                        variant="outlined"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="payment_detail_description"
                        id="payment_detail_description"
                        variant="outlined"
                        onChange={(e, v) =>
                          onInputDetailChange(e, v, true, index)
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      {inputList.length > 1 && (
                        <Button
                          color="primary"
                          type="button"
                          variant="contained"
                          className="remove-btn"
                          onClick={() => handleServiceRemove(index)}
                        >
                          <Delete />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={7}>
                    <Button
                      color="primary"
                      onClick={handleInputAdd}
                      variant="outlined"
                      size="small"
                      style={{ display: "flex", justifyContent: "left" }}
                    >
                      <Add />
                      Add Jurnal
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
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
