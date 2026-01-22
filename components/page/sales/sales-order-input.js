import BaseLayout from "../../base_layout/base-layout";

import {
  Icon,
  Divider,
  Button,
  TextField,
  OutlinedInput,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  Collapse,
  IconButton,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  FormGroup,
  Checkbox,
  Tooltip,
} from "@material-ui/core";

import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import Autocomplete from "@material-ui/lab/Autocomplete";

import React, { Component, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";

import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";
import { currency } from "../../../helpers/general";

import { getListQuoteStatusAccSwr } from "../../../services/swr/quote.swr";
import { getDetailQuoteApi } from "../../../services/api/quote.api";

import {
  insertSOApi,
  getAccMapSO,
  getSOStatusAccApi,
  getSoPaymentTermApi,
  updateRefLastNumberSo,
  getSOProjectIncomeApi,
} from "../../../services/api/sales-order.api";
import moment from "moment";
import { arraySlice } from "three/src/animation/AnimationUtils";

import AlertDialog from "../../base_component/dialog";

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
  //const

  const classes = useStyles();
  const router = useRouter();
  const [formState, setFormState] = useState(false);
  const [formStateSale, setFormStateSale] = useState(false);
  const [formStateLease, setFormStateLease] = useState(false);
  const [formStateService, setFormStateService] = useState(false);

  const [customerId, setCustomerId] = useState("");

  const [quoteList, setQuoteList] = useState([]);
  const [listData, setListData] = useState([]);

  const [accMap, setAccMap] = useState([]);
  const [incomeType, setIncomeType] = useState([]);
  const [saleDesc, setSaleDesc] = useState([]);
  const [leaseDesc, setLeaseDesc] = useState([]);
  const [serviceDesc, setServiceDesc] = useState([]);
  const [checked, setChecked] = useState({
    sale: false,
    lease: false,
    service: false,
  });
  const [saleCheck, setSaleCheck] = useState(false);
  const [leaseCheck, setLeaseCheck] = useState(false);
  const [serviceCheck, setServiceCheck] = useState(false);
  const [optionQuoteList, setOptionQuoteList] = useState([]);

  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [disableSave, setDisableSave] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [perPage, rowsPerPage] = useState(0);

  const [selectedValue, setSelectedValue] = React.useState("a");
  const [search, setSearch] = useState("");

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

  const handleChangePage = async (event, newPage) => {
    try {
      setOpen(true);
      var data = await getSOStatusAccApi(-1, search, newPage, rowsPerPage);
      setRowCount(data.total);
      setListData(data.result);
      setPage(newPage);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  //set param
  let param = { limit: 999 };
  var quoteSwr = getListQuoteStatusAccSwr(1);

  const sendData = async (e) => {
    //income_type
    var data = await getSOProjectIncomeApi(formState.project_code, "*");

    if (data.total > 0) {
      setOpenAlert(true);
      setAlertMsg(
        "Project code " +
          formState.project_code +
          " already exist in sales order database"
      );
    } else {
      if (checkValidation()) {
        setDisableSave(true);
        var arrSale = [];
        var arrLease = [];
        var arrService = [];
        var arrSale1 = [];
        var arrLease1 = [];
        var arrService1 = [];
        if (saleCheck) {
          if (saleDesc.containers)
            arrSale = getDescription(saleDesc.containers);
          if (saleDesc.container_stocks)
            arrSale1 = getDescription(saleDesc.container_stocks);

          setFormStateSale({
            ...formState,
            income_type: "sale",
            description: arrSale.concat(arrSale1),
          });
        }
        if (leaseCheck) {
          if (leaseDesc.containers)
            arrLease = getDescription(leaseDesc.containers);
          if (leaseDesc.container_stocks)
            arrLease1 = getDescription(leaseDesc.container_stocks);

          setFormStateLease({
            ...formState,
            income_type: "lease",
            description: arrLease.concat(arrLease1),
          });
        }
        if (serviceCheck) {
          if (serviceDesc.containers > 0)
            arrService = getDescription(serviceDesc.containers);
          if (serviceDesc.container_stocks > 0)
            arrService1 = getDescription(serviceDesc.container_stocks);
          setFormStateService({
            ...formState,
            income_type: "service",
            description: arrService.concat(arrSale1),
          });
        }
        setOpenDialog(true);
      }
    }
  };
  const closeDialog = () => {
    setDisableSave(false);
    setOpenDialog(false);
  };
  const saveData = () => {
    insertSO();
    setOpenDialog(false);
  };
  function insertSO() {
    if (saleCheck) {
      insertSOApi(formStateSale, 2).then((res) => {
        if (res.id != 0) {
          insertLease();
        }
      });
    } else {
      insertLease();
    }
  }
  function insertLease() {
    if (leaseCheck) {
      insertSOApi(formStateLease, 2).then((res) => {
        if (res.id != 0) {
          if (serviceCheck) {
            insertService();
          }
        }
      });
    } else {
      insertService();
    }
  }
  function insertService() {
    if (serviceCheck) {
      insertSOApi(formStateService, 2).then((res) => {
        if (res.id != 0) {
        }
      });
    }
    router.push("/sales/" + formState.project_code);
  }
  function checkValidation() {
    var isValid = true;

    var eOrderDate = "";
    var eEstimateDeliveryDate = "";
    var eProject = "";

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
    if (
      formState.project_code == null ||
      formState.project_code == "undefined"
    ) {
      isValid = false;
      eProject = "Choose a project first";
    }
    setErrorText({
      ...errorText,
      order_date: eOrderDate,
      estimate_delivery_date: eEstimateDeliveryDate,
      project_code: eProject,
    });
    var alert1 =
      eProject +
      ", " +
      eOrderDate +
      ", " +
      eEstimateDeliveryDate +
      " Can not be empty ";
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

        setSaleCheck(false);
        setLeaseCheck(false);
        setServiceCheck(false);
        var vIncomeType = [];
        if (Object.keys(res.sale).length > 0) {
          setSaleCheck(true);
          setSaleDesc(res.sale);
          // vIncomeType.push({ sale: true });
        }
        if (Object.keys(res.lease).length > 0) {
          setLeaseCheck(true);
          setLeaseDesc(res.lease);
          // vIncomeType.push({ income: "lease" });
          // vIncomeType.push({ lease: true });
        }
        if (Object.keys(res.service).length > 0) {
          setServiceCheck(true);
          setServiceDesc(res.service);
          // vIncomeType.push({ income: "service" });
          // vIncomeType.push({ service: true });
        }
        setChecked({ ...checked, sale: true });
        setIncomeType(vIncomeType);
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

        // if (typeof res.sale.container_stocks != "undefined") {
        //   res.sale.container_stocks.map((itemCS, i) => {
        //     if (itemCS.stock_id != "") {
        //       listCS.push({
        //         container_id: itemCS.stock_id,
        //         quantity: 1,
        //         price: itemCS.price,
        //         uom: "unit",
        //         description: itemCS.remark + " " + itemCS.serial_number,
        //       });
        //     }
        //     if (isNaN(itemCS.price) == false) {
        //       total = total + itemCS.price;
        //     }
        //   });
        // } else {
        //   listCS = [];
        // }

        // if (typeof res.sale.containers != "undefined") {
        //   res.sale.containers.map((itemCS2, i) => {
        //     if (itemCS2.qty > 0) {
        //       listCS2.push({
        //         container_id: "",
        //         quantity: itemCS2.qty,
        //         price: itemCS2.price,
        //         uom: "unit",
        //         description: itemCS2.remark,
        //       });
        //       if (isNaN(itemCS2.qty) == false) {
        //         subtotal = itemCS2.price * itemCS2.qty;
        //       }

        //       total2 = total2 + subtotal;
        //     }
        //   });
        // } else {
        //   listCS2 = [];
        // }
        // setQData(listCS.concat(listCS2));
        // setQuoteTotalData(total + total2);
        setFormState({
          ...formState,
          quote_id: res.id,
          quote_date: res.quote_date,
          project_name: res.name,
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
          // description: listCS.concat(listCS2),
          sales_order_file: [],
          description: [],
        });
      });
    } else {
      document.getElementById("customer_name").value = "";
      // document.getElementById("customer_code").value = "";
      document.getElementById("sales_name").value = "";
      document.getElementById("sales_email").value = "";
    }
  }
  function getDescription(desc) {
    var listCS = [];
    desc.map((itemCS, i) => {
      if (itemCS.stock_id != "") {
        listCS.push({
          container_id: itemCS.stock_id,
          quantity: 1,
          price: itemCS.price,
          uom: itemCS.unit,
          description: itemCS.remark,
        });
      }
    });
    return listCS;
  }

  return (
    <BaseLayout title="New Sales Order">
      <div className={classes.root}>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Typography variant="subtitle1">New Sales Order</Typography>
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
                onClick={(e) => {
                  openPage(e, getRoute("sales.sales-order-ongoing"));
                }}
              >
                <Icon style={{ fontSize: 20, color: "red" }}>
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
            <Box container spacing={2}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography className={classes.labelbase}>
                      Order Date
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.labelbase}>
                      Estimate Delivery Date
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <OutlinedInput
                      id="order_date"
                      className={classes.inputbase}
                      name="order_date"
                      type="date"
                      error={errorText.order_date}
                      helperText={errorText.order_date}
                      onChange={onChangeInput}
                      fullWidth
                    ></OutlinedInput>
                  </Grid>

                  <Grid item xs={6}>
                    <OutlinedInput
                      className={classes.inputbase}
                      id="estimate_delivery_date"
                      name="estimate_delivery_date"
                      type="date"
                      onChange={onChangeInput}
                      error={errorText.estimate_delivery_date}
                      helperText={errorText.estimate_delivery_date}
                      fullWidth
                    ></OutlinedInput>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* <Box container>
              <Box item xs={12} style={{ textAlign: "left" }}>
                <div className={classes.rootmenu}>
                  Order Date
                  <OutlinedInput
                    className={classes.inputbase}
                    size="small"
                    name="order_date"
                    color="secondary"
                    type="date"
                    onChange={onChangeInput}
                  ></OutlinedInput>
                  Estimate Delivery Date
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
                    On Going Sales Order
                  </Button>
                  <Button
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
                  </Button>
                </div>
              </Box>
            </Box> */}
          </Box>

          <Box container spacing={2} xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography className={classes.formControl}>Project</Typography>
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
              </Grid>
              <Grid item xs={6}>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <FormLabel component="legend">Income Type</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      value="sale"
                      readOnly
                      control={<Checkbox color="primary" checked={saleCheck} />}
                      label="Sale"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="lease"
                      readOnly
                      control={
                        <Checkbox color="primary" checked={leaseCheck} />
                      }
                      label="Lease"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="service"
                      readOnly
                      control={
                        <Checkbox color="primary" checked={serviceCheck} />
                      }
                      label="Service"
                      labelPlacement="end"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          {/* <Box>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography className={classes.labelbase}>
                  Income Type
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <RadioGroup
                  row
                  aria-label="income_type"
                  name="income_type"
                  id="income_type"
                >
                  {" "}
                  <FormControlLabel
                    onChange={(e) => onRadioCheck(e)}
                    value="sale"
                    control={<Radio color="primary" />}
                    label="Sale"
                    checked={checked.sale}
                  />
                  <FormControlLabel
                    value="lease"
                    control={<Radio color="primary" />}
                    label="Lease"
                    onChange={(e) => onRadioCheck(e)}
                    checked={checked.lease}
                  />{" "}
                  <FormControlLabel
                    value="service"
                    control={<Radio color="primary" />}
                    label="Service"
                    checked={checked.service}
                    onChange={(e) => onRadioCheck(e)}
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </Box> */}
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

          <Box container spacing={2}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>
                Project Description
              </Typography>
            </Box>
            <Box item xs={10}>
              <OutlinedInput
                className={classes.inputbasemultiline}
                defaultValue=""
                rowsMax={5}
                multiline
                onChange={onChangeInput}
                name="project_description"
                type="textare"
                fullWidth
              ></OutlinedInput>
            </Box>
          </Box>
        </Paper>

        {/* <Paper className={classes.paper}>
          <h2 className="mb-3 mt-5">Descriptions</h2>
          <Box className="mb-3">
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="Item Description">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Item Description</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {qData?.map((row, key) => (
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
                  ))}
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
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper> */}

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
                <Tooltip
                  title=" The next button will save the initial data and start the next
              filling for payment scheme and uploading supporting documents"
                  placement="bottom"
                >
                  <Button
                    name="saveBtn"
                    id="saveBtn"
                    disabled={disableSave}
                    onClick={(e) => sendData(e)}
                    variant="contained"
                    color="primary"
                  >
                    <Icon style={{ fontSize: 20, color: "#af601a" }}>
                      navigate_next
                    </Icon>
                    {"  "}
                    Next
                  </Button>
                </Tooltip>
              </div>
            </Box>
          </Box>
        </Paper>
      </div>
      <AlertDialog
        open={openDialog}
        cancelAction={() => closeDialog()}
        okAction={() => saveData()}
        title="Save confirmation"
        body="Are you sure want to save this sales order?"
      />
    </BaseLayout>
  );
}
