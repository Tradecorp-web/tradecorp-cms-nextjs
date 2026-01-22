import BaseLayout from "../../base_layout/base-layout";
import {
  Icon,
  Divider,
  Button,
  Box,
  Collapse,
  IconButton,
  Typography,
  Paper,
  Grid,
  TextField, Link,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import {saveInvoiceApi} from "../../../services/api/invoice.api";
import {getListSalesOrderSwr} from "../../../services/swr/sales-order.swr";
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
  labelbase: {
    marginTop: 10,
    fontSize: 12,
  },
  inputbase: {
    fontSize: "12px !important",
    height: 35,
  },
  comboBox: {
    fontSize: "12px",
    height: 30,
  },
  comboOptions: {
    fontSize: "12px",
    color: "#000000",
  },
}));

export default function SearchSalesOrder() {
  //const
  const classes = useStyles();
  const router = useRouter();
  const [data, setData] = useState(
      {
        id: null,
        invoice_date: null,
        invoice_due_date: null,
        invoice_number: null,
        invoice_description: null,
        description: [],
        company_id: null,
        project_code: null,
        purchase_order_code: null,
        status_invoice: null,
        sales_order_number: null,
      });
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [disableSave, setDisableSave] = useState(true);
  const [errorText, setErrorText] = useState({
      sales_order_number : null,
  });
  const [salesOrderNumberList, setsalesOrderNumberList] = useState([]);
  const [optionSalesOrderNumberList, setOptionSalesOrderNumberList] = useState([]);

  function checkValidation() {
    let isValid;

    let eSalesOrderNumber = "Sales Order Number";

    const getSoNumberId = document.getElementById("sales_order_number");

    getSoNumberId?.value === null || getSoNumberId?.value === "" || getSoNumberId?.value === undefined ? isValid = false : isValid = true;

    setErrorText({
      ...errorText,
        eSalesOrderNumber: eSalesOrderNumber,
    });

    let alert1 = eSalesOrderNumber + " Can not be empty ";
    let sendMsg = "";
    if (alert1.substring(0, 1) === ",") {
      sendMsg = alert1.substring(1);
    } else {
      sendMsg = alert1.substring(0);
    }
    setAlertMsg(sendMsg.replace(",  Can", " Can"));
    if (isValid === false) {
      setOpenAlert(true);
    } else {
      setOpenAlert(false);
    }
    return isValid;
  }

  const sendData = (e) => {
    // if (checkValidation()) {
      // saveInvoiceApi(data, 2)
      saveInvoiceApi(data)
        .then((res) => {
          if (res !== 0) {
            setOpen(true);
            setDisableSave(true);
            router.push("/invoice/form", res.id).then(r => { return r; });
          }
        })
        .catch((err) => {
          console.log(err);
          setErrorText(err);
        });
    // }
  };

  /*Start of SWR*/

  let listSalesOrderSwr = getListSalesOrderSwr();

  /*End of SWR*/

  /*Start of useEffect*/

  useEffect(() => {
    if (listSalesOrderSwr?.data) {
      setsalesOrderNumberList(listSalesOrderSwr?.data?.result ?? []);
    }
  }, [listSalesOrderSwr]);

  useEffect(() => {
    const list = [];
//for get so number
    // so_number = row1
    //  for item.payment_term
          // so_numer_detail = so_number
          //  payment_id = row2.id
        // payment_number = row2.payment_number
    //end for item.payment_term
    //endfor so number
    salesOrderNumberList.map((item, i) => {
      console.log('payment terms:',item.payment_terms);
      list.push({
        label1: item.sales_order_number,
        label2: item.payment_terms.map( item2 => {
          return item2.payment_number
        }),

        // label2: item.payment_terms.map( item2 => {
        //   return item2.payment_number + ' - ' + item2.sales_order_number
        // }),
        sales_order_id: item.id
      });

    });
    setOptionSalesOrderNumberList(list);
  }, [salesOrderNumberList]);

  /*End of useEffect*/


  //function

  const onChangeSalesOrderNumber = (e, v) => {
    if (v !== null) {
      setData({
        ...data,
        sales_order_number: v.label1,
        invoice_payment_term: v.label2,
        sales_order_id: v.sales_order_id,
      });
    } else {
      setData({
        ...data,
        sales_order_number: null,
      });
    }
    // console.log(data);
    setDisableSave(false);
    setOpenAlert(false);
  }

  function openPage(e, route) {
    e.preventDefault();
    router.push(route).then(r => { return r; });
  }

  function handleClick(event) {
    event.preventDefault();
  }


  return (
    <BaseLayout title="Search Sales Order">
      <div className={classes.root}>
        <Box container spacing={2}>
          {/*<Box item xs={12}>*/}
          {/*  <Typography variant="subtitle1">Search Sales Order</Typography>*/}
          {/*</Box>*/}
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="primary" href="/invoice/search-sales-order" aria-current="page" onClick={handleClick}>
              Search Sales Order Payment Term
            </Link>
            <Link color="inherit" href="#">
              Create Invoice
            </Link>
          </Breadcrumbs>
        </Box>
        {/*<Box container spacing={2}>*/}
        {/*  <Box item xs={12}>*/}
        {/*    <Divider />*/}
        {/*  </Box>*/}
        {/*</Box>*/}

        <Box container>
          <Box item xs={12} style={{ textAlign: "center" }}>
            <div className={classes.rootmenu}>
              <Button
                variant="contained"
                onClick={(e) => openPage(e, getRoute("customer"))}
              >
                <Icon style={{ fontSize: 20, color: "#999" }}>home</Icon>
              </Button>
              <Button
                variant="contained"
                color="default"
                onClick={(e) =>
                  openPage(e, getRoute("invoice"))
                }
              >
                <Icon style={{ fontSize: 20, color: "yellow" }}>
                  pending_actions
                </Icon>
                Invoice List
              </Button>
            </div>
          </Box>
        </Box>

        <Paper className={classes.paper}>
          <Box container spacing={2}>
            <Box item xs={12} sm={12} container>
              <Box item container direction="column" spacing={2}>
                <Box item>
                  <Typography align="center" gutterBottom variant="subtitle1">
                    Search Sales Order
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
                  <Grid item xs={12}>
                    <Typography className={classes.labelbase}>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Autocomplete
                        className={classes.inputbase}
                        name="sales_order_number"
                        options={optionSalesOrderNumberList}
                        autoHighlight
                        error={errorText.sales_order_number}
                        helperText={errorText.sales_order_number}
                        onChange={(event, value) => onChangeSalesOrderNumber(event, value)}
                        // getOptionLabel={(option) => option?.label ?? "Sales Order Number Not Generated"}
                        getOptionLabel={(option) => option?.label1 + " - " + option?.label2}
                        renderOption={
                          (option) => (
                              <Typography className={classes.comboOptions}>
                                {/*{option?.label1 ? option?.label1 : "Sales Order Number Not Generated"}*/}
                                {/*{option?.label1 + " - " + option?.label2}*/}
                                {/*{option?.label1 + ' - ' + option?.label2}*/}
                                {option?.label1 + ' - '}
                                {option?.label2.map((item, i) => {
                                    return (
                                        <Typography key={i}>
                                            {item}
                                        </Typography>
                                    )
                                })}
                              </Typography>
                          )
                        }
                        renderInput={
                      (params) => <TextField {...params} label="Search Sales Order Payment Term" />}
                    />
                  </Grid>
                </Grid>
              </Box>
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
                  onClick={(e) => openPage(e, getRoute("invoice"))}
                >
                  <Icon style={{ fontSize: 20, color: "yellow" }}>cancel</Icon>
                  Cancel
                </Button>
                <Button
                  disabled={disableSave}
                  onClick={(e) => sendData(e)}
                  variant="contained"
                  color="primary"
                >
                  <ArrowForwardIcon style={{ fontSize: 20, color: "#af601a" }}>Next</ArrowForwardIcon>
                  Next
                </Button>
              </div>
            </Box>
          </Box>
        </Paper>
      </div>
    </BaseLayout>
  );
}
