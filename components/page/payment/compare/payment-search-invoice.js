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
} from "../../../../helpers/consts";

import AlertDialog from "../../../../components/base_component/dialog";

import React, { Component, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";

import { useRouter } from "next/router";
import getRoute from "../../../../helpers/router";
import { currency, numberConvert } from "../../../../helpers/general";

import {
  getListQuoteSwr,
  getListQuoteStatusAccSwr,
} from "../../../../services/swr/quote.swr";
import {
  getDetailQuoteApi,
  getQuoteStatusAccApi,
} from "../../../../services/api/quote.api";

import {
  updatePaymentApi,
  insertPaymentInvoiceApi,
} from "../../../../services/api/payment.api";

import { getDetailPaymentSwr } from "../../../../services/swr/payment.swr";

import {
  updateStatusInvoice,
  getListSearchInv,
  getDetailPaymentApi,
} from "../../../../services/api/payment.api";

import Moment from "moment";
import { updateInvoicePayDetailApi } from "../../../../services/api/invoice.api";
import { v4 as uuid } from "uuid";

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

function PaymentDataRow(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Grid container>
        <Grid item>{props.keys}</Grid>
      </Grid>
    </React.Fragment>
  );
}

export default function Page(props) {
  const thousand = localStorage.getItem(LOCAL_STORAGE_THOUSAND);
  const decimal = localStorage.getItem(LOCAL_STORAGE_DECIMAL);
  const prefix = localStorage.getItem(LOCAL_STORAGE_PREFIX);
  const scale = parseInt(localStorage.getItem(LOCAL_STORAGE_SCALE));
  //const
  const classes = useStyles();
  const router = useRouter();
  const [accurate, setAccurate] = useState(100);
  const [formState, setFormState] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [customerId, setCustomerId] = useState("");
  const [descriptionData, setDescriptionData] = useState([]);

  const [quoteList, setQuoteList] = useState([]);
  const [quoteTotalData, setQuoteTotalData] = useState(0);
  const [dataInv, setDataInv] = useState(false);

  const [qData, setQData] = useState([]);
  const [accMap, setAccMap] = useState([]);
  const [accSubBank, setAccSubBank] = useState([]);
  const [statusSub, setStatusSub] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const [readOnlyStyle, setReadOnlyStyle] = useState(false);

  const [optionQuoteList, setOptionQuoteList] = useState([]);
  const [dataPayment, setDataPayment] = useState(false);

  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [data, setData] = useState(true);
  const [idPayment, setIdPayment] = useState(false);
  const [idInvoice, setIdInvoice] = useState(false);
  const [invTotalPay, setInvTotalPay] = useState(0);
  const [subDataPay, setSubDataPay] = useState([]);

  const [errorText, setErrorText] = useState({
    // order_date: null,
    // estimate_delivery_date: null,
  });

  //set param
  let param = { limit: 999 };

  const closeForm = () => {
    setData({
      id: null,
      name: null,
    });
    props?.closeModal();
  };
  const getDataInvoice = async () => {
    var dataSub = await getListSearchInv(
      "outstanding",
      props?.paymentData?.payment_amount,
      accurate,
      "*",
      "*"
    );

    setDataInv(dataSub);
  };
  const getDataPayment = (e) => {
    setAccurate(e.target.value);
  };

  const getDataPaymentById = async () => {
    var data = await getDetailPaymentApi(props?.paymentData?.id);
    setDataPayment(data);
  };
  const actPaid = (id, totalPayment, payment_detail, key) => {
    setSubDataPay(payment_detail);
    setOpenDialog(true);
    setIdInvoice(dataInv?.result[key]?.id);
    setInvTotalPay(totalPayment);
    setDataPayment({
      ...dataPayment,
      customer_id: dataInv?.result[key]?.customer_id,
      customer_name: dataInv?.result[key]?.customer_name,
      customer_company: dataInv?.result[key]?.customer_company,
      customer_address: dataInv?.result[key]?.customer_address,
      customer_email: dataInv?.result[key]?.customer_email,
      customer_phone: dataInv?.result[key]?.customer_phone,
      project_code: dataInv?.result[key]?.project_code,
    });
    var dataTmp = [];

    setIdPayment(props?.paymentData?.id);
  };

  const checkPaid = async () => {
    var vPaid = "";
    var totalBeforeUpdate = 0;
    var dataPay = [];
    var idSubAcc = "";

    subDataPay?.map((data) => {
      dataPay.push({
        sub_payment_id: data.sub_payment_id,
        payment_id: data.payment_id,
        invoice_id: data.invoice_id,
        payment_value: data.payment_value,
      });

      totalBeforeUpdate = totalBeforeUpdate + parseFloat(data.payment_value);
    });

    var remaining_payment = 0;
    if (totalBeforeUpdate == 0) {
      remaining_payment =
        invTotalPay - parseFloat(props?.paymentData?.payment_amount);
    } else {
      remaining_payment = parseFloat(
        invTotalPay -
          Math.abs(
            parseFloat(totalBeforeUpdate) +
              parseFloat(props?.paymentData?.payment_amount)
          )
      );
    }
    if (remaining_payment < 0) {
      remaining_payment = 0;
    }
    dataPay.push({
      payment_id: props?.paymentData?.id,
      payment_value: props?.paymentData?.payment_amount,
    });
    paymentProgress(idSubAcc, totalBeforeUpdate, {
      rest_payment: remaining_payment,
      payment_detail: dataPay,
    });
  };

  const paymentProgress = async (idSubAcc, totalBeforeUpdate, subDataPay) => {
    var vPaid = "outstanding";
    // var totalAfterUpdate =
    //   totalBeforeUpdate + props?.paymentData?.payment_amount;

    if (subDataPay.rest_payment == 0) {
      vPaid = "paid";
    }
    var data = {
      invoice_status: vPaid,
      payment_id: idPayment,
    };
    var dataSub = await updateStatusInvoice(idInvoice, data).then((res) => {
      var result = updatePaymentApi(props?.paymentData?.id, dataPayment);
      var result = updateInvoicePayDetailApi(idInvoice, subDataPay);
      //save pay inv mapping
      var data2 = {
        payment_id: idPayment,
        invoice_id: idInvoice,
      };
      insertPaymentInvoiceApi(data2);
      //==save pay inv mapping
      getDataInvoice();
      setOpenDialog(false);
      closeForm();
    });
  };
  //useEffect

  useEffect(async () => {
    getDataInvoice();
  }, [accurate]);

  useEffect(() => {
    getDataInvoice();
  }, [props?.paymentData?.payment_amount]);
  useEffect(() => {
    getDataPaymentById();
  }, [props?.paymentData?.id]);

  // setAccMap(getAccMapSO());

  //function

  return (
    <Modal
      open={props?.open}
      onClose={closeForm}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
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
          <Grid container spacing={2}>
            <Grid item xl={4}>
              <span className={classes.labelbase}>Payment trx code :</span>{" "}
              <span className={classes.labelbasebold}>
                {props.paymentData.payment_trx_code}
              </span>
            </Grid>
            <Grid item xl={4}>
              {" "}
              <span className={classes.labelbase}>Payment description : </span>
              <span className={classes.labelbasebold}>
                {props.paymentData.payment_description}
              </span>
            </Grid>
            <Grid item xl={4}>
              <span className={classes.labelbase}>Payment amount :</span>{" "}
              <span className={classes.labelbasebold}>
                {currency(props.paymentData.payment_amount)}
              </span>
            </Grid>
          </Grid>
        </Paper>

        <Paper className={classes.paper}>
          <Box container spacing={2}>
            <Box item style={{ textAlign: "right" }}>
              Accurate{" "}
              <OutlinedInput
                onChange={getDataPayment}
                defaultValue={accurate}
                id="accurate"
                name="accurate"
                type="number"
              ></OutlinedInput>
            </Box>
            <Box item xs={6} style={{ textAlign: "center" }}>
              <TableContainer component={Card}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width={12}>No</TableCell>
                      <TableCell>Invoice Date</TableCell>
                      <TableCell>Invoice#</TableCell>
                      <TableCell>Invoice Description</TableCell>
                      <TableCell>Project Code</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Remaining Payment</TableCell>
                      <TableCell>Match</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataInv?.result?.map((row, key) => (
                      <TableRow>
                        <TableCell width={12}>{key + 1}</TableCell>
                        <TableCell>
                          {Moment(row.invoice_date).format("L")}
                        </TableCell>
                        <TableCell>{row.invoice_number}</TableCell>
                        <TableCell>{row.invoice_description}</TableCell>
                        <TableCell>{row.project_code}</TableCell>
                        <TableCell>{row.customer_name}</TableCell>
                        <TableCell>{currency(row.total_payment)}</TableCell>
                        <TableCell>{currency(row.rest_payment)}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            onClick={() =>
                              actPaid(
                                row.id,
                                row.total_payment,
                                row.payment_detail,
                                key
                              )
                            }
                            color="secondary"
                          >
                            Set Paid
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Paper>
        <AlertDialog
          open={openDialog}
          cancelAction={() => setOpenDialog(false)}
          okAction={() => checkPaid()}
          title="Status confirmation"
          body="Are you sure want to set as paid this transaction?"
        />
      </div>
    </Modal>
  );
}
