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
import {getListInvoiceBySalesOrderNumberApi, saveInvoiceApi} from "../../../services/api/invoice.api";
import {getDetailSalesOrderSwr, getListSalesOrderSwr} from "../../../services/swr/sales-order.swr";
import {getListInvoiceSwr} from "../../../services/swr/invoice.swr";
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

export default function SearchPaymentTerm() {

  const classes = useStyles();
  const router = useRouter();

  /* Start of useState */

  const [listInvoice, setListInvoice] = useState([]);
  const [data, setData] = useState(
      {
        id: null,
        // invoice_date: null,
        // invoice_due_date: null,
        // invoice_number: null,
        // invoice_description: null,
        // description: [],
        // company_id: null,
        // project_code: null,
        // purchase_order_code: null,
        // status_invoice: null,
        invoice_payment_term: null,
      });
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [disableSave, setDisableSave] = useState(true);
  const [errorText, setErrorText] = useState({
    invoice_payment_term: null,
  });
  const [value, setValue] = useState(null);
  const [paymentTermList, setPaymentTermList] = useState([]);
  const [optionPaymentTermList, setOptionPaymentTermList] = useState([]);

  function checkValidation() {
    let isValid = true;

    let ePaymentTerm = "Payment Term";

    const getPaymentTerm = document.getElementById("payment_term");

    getPaymentTerm?.value === null || getPaymentTerm?.value === "" || getPaymentTerm?.value === undefined ? isValid = false : isValid = true;

    setErrorText({
      ...errorText,
        ePaymentTerm: ePaymentTerm,
    });

    let alert1 = ePaymentTerm + " Can not be empty ";
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
    if (checkValidation()) {
      // saveInvoiceApi(data, 2)
      saveInvoiceApi(data)
        .then((res) => {
          if (res !== 0) {
            setOpen(true);
            setDisableSave(true);
            router.push("/invoice/form" + res.id).then(r => { return r; });
          }
        })
        .catch((err) => {
          console.log(err);
          setErrorText(err);
        });
    }
  };

  /*Start of SWR*/

  const getListInvoice = getListInvoiceSwr();

  useEffect(() => {
    if (getListInvoice.data) {
      setListInvoice(getListInvoice.data?.results?.sales_order_id);
    }
  });
// console.log(getListInvoice.data.result)
  let paymentTermSwr = getDetailSalesOrderSwr();

  // console.log(paymentTermSwr);

  /*End of SWR*/

  /*Start of useEffect*/

  useEffect(() => {
    if (paymentTermSwr?.data) {
      setPaymentTermList(paymentTermSwr?.data?.result ?? []);
    }
  }, [paymentTermSwr]);

  useEffect(() => {
    const list = [];
    paymentTermList.map((item, i) => {
      list.push({
        label: item.payment_terms.map((item2, i) => {
            return item2.payment_number;
        }),
        // label: item.payment_terms[0].payment_number,
        // label: Object.values(item.payment_terms),
      });
      console.log("item", item.payment_terms.map((item2, i) => {
        return item2.payment_number;
      }));
    });
    setOptionPaymentTermList(list);
  }, [paymentTermList]);

  /*End of useEffect*/


  //function

  const onChangePaymentTerm = (e, v) => {
    if (v !== null) {
      setData({
        ...data,
        invoice_payment_term: v.label,
      });
    } else {
      setData({
        ...data,
        invoice_payment_term: null,
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
    <BaseLayout title="Search Payment Term">
      <div className={classes.root}>
        <Box container spacing={2}>
          {/*<Box item xs={12}>*/}
          {/*  <Typography variant="subtitle1">Search Sales Order</Typography>*/}
          {/*</Box>*/}
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="#" aria-current="page">
              Search Sales Order
            </Link>
            <Link color="primary" href="/invoice/search-sales-order" aria-current="page"  onClick={handleClick}>
              Search Payment Term
            </Link>
            <Link color="inherit" href="#">
              Create Invoice
            </Link>
          </Breadcrumbs>
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
                    Search Payment Term
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
                        name="invoice_payment_term"
                        options={optionPaymentTermList}
                        autoHighlight
                        error={errorText.invoice_payment_term}
                        helperText={errorText.invoice_payment_term}
                        onChange={(event, value) => onChangePaymentTerm(event, value)}
                        getOptionLabel={(option) => option?.label}
                        renderOption={
                          (option) => (
                              <Typography className={classes.comboOptions}>
                                {option?.label}
                              </Typography>
                          )
                        }
                        renderInput={
                          (params) => <TextField {...params} label="Search Payment Term" />}
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
                  onClick={(e) => openPage(e, getRoute("customer"))}
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
