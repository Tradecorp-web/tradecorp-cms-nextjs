import {
  Button,
  Card,
  makeStyles,
  Grid,
  Typography,
  Box,
  Modal,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import AlertDialog from "../../base_component/dialog";
import Moment from "moment";
import {dateExpired, dateFormatInput, rupiah} from "../../../helpers/general";
import CardContent from "@material-ui/core/CardContent";
import { getListContainerStockSwr } from "../../../services/swr/container-stock.swr";
import { getDetailCustomerSwr } from "../../../services/swr/customer.swr";
// import {Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Pdf from "react-to-pdf";
const ref = React.createRef();
const optionToPDF = {
  orientation: "portrait",
  unit: "in",

};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  paper: {
    width: 250,
    height: 300,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  table: {
    minWidth: 650,
  },
  textFontCenter: {
    fontSize: 10,
    textAlign: "center",
  },

  textFont: {
    fontSize: 5,
  },
}));

export default function AccountingBaseLayout(props) {
  const TAX_RATE = 0.11;

  function ccyFormat(num) {
    return `${num.toFixed(2)}`;
  }

  function priceRow(qty, unit) {
    return qty * unit;
  }

  function createRow(desc, qty, unit) {
    const price = priceRow(qty, unit);
    return { desc, qty, unit, price };
  }

  function subtotal(items) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
  }

  const rows = [createRow("20FT GP CONTAINER", 1, 20000000)];

  const invoiceSubtotal = subtotal(rows);
  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;

  const [openDialog, setOpenDialog] = useState(false);
  const classes = useStyles();
  const [containerList, setContainerList] = useState([]);
  const [optionContainerList, setOptionContainerList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [disabled, setDisabled] = useState("");
  const [invoiceDate, setInvoiceDate] = useState();
  const [invoiceDueDate, setInvoiceDueDate] = useState();
  const [containerSelectList, setContainerSelectList] = useState([]);
  const [formValues, SetFormValues] = useState();
  const [inputList, setInputList] = useState([
    {
      container_id: null,
      container_size: null,
      container_type: null,
      serial_number: null,
      sales_status: null,
      remark: null,
    },
  ]);
  const [errorText, setErrorText] = useState({
    id: null,
    invoice_date: null,
    invoice_due_date: null,
    invoice_number: null,
    invoice_description: null,
    title: null,
    sales_name: null,
    sales_phone: null,
    taxes_persen: null,
    customer_id: null,
    sales_id: null,
    containers: [],
    company_id: null,
  });
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState({
    id: null,
    invoice_date: null,
    invoice_due_date: null,
    invoice_number: null,
    invoice_description: null,
    title: null,
    taxes_persen: null,
    customer_id: null,
    sales_name: null,
    sales_phone: null,
    containers: [],
    company_id: null,
    sales_id: null,
    purchase_order_code: null,
  });

  const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" });

  const onInputChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const onInputDateChange = (event) => {
    setData({
      ...data,
      [event.target.name]: dateFormatInput(event.target.value),
    });
  };

  let param = { limit: 999 };

  useEffect(() => {
    if (props.so != null) {
      setData({
        id: props.so.id,
        invoice_date: dateFormatInput(props.so.invoice_date),
        invoice_due_date: dateFormatInput(props.so.invoice_due_date),
        invoice_number: props.so.invoice_number,
        invoice_description: props.so.invoice_description,
        title: props.so.title,
        project_description: props.so.project_description,
        project_code: props.so.project_code,
        taxes_persen: props.so.taxes_persen,
        containers: props.so.containers,
        customer_id: props.so.customer_id,
        customer_name: props.so.customer_name,
        customer_contact: props.so.customer_contact,
        customer_address: props.so.customer_address,
        customer_phone: props.so.customer_phone,
        customer_delivery_address: props.so.customer_delivery_address,
        customer_email: props.so.customer_email,
        sales_id: props.so.sales_id,
        sales_name: props.so.sales_name,
        sales_phone: props.so.sales_phone,
        company_id: props.so.company_id,
        purchase_order_code: props.so.purchase_order_code,
      });

      setCustomerList(props.so.customer_id);
      setInputList(props.so.containers);
      setInvoiceDate(Moment(props.so.invoice_date).format("LL"));
      setInvoiceDueDate(Moment(props.so.invoice_due_date).format("LL"));
      setDisabled(true);
      setTitle({ formTitle: "INVOICE", buttonTitle: "Generate PDF" });

      // let containerSelect = [];
      // if (props.so.containers != null) {
      //   for (let i = 0; i < props.so.containers.length; i++) {
      //     let pos = i + 1;
      //     containerSelect.push({
      //       selectedContainer: optionContainerList[pos],
      //     });
      //   }
      //   setContainerSelectList(containerSelect);
      // } else {
      //   setContainerSelectList([]);
      // }
    } else {
      setData({
        id: null,
        title: null,
        invoice_description: null,
        taxes_persen: null,
        invoice_date: null,
        invoice_number: null,
        project_description: null,
        invoice_due_date: null,
        sales_name: null,
        sales_phone: null,
        containers: [],
        customer_id: null,
        customer_name: null,
        customer_contact: null,
        customer_address: null,
        customer_phone: null,
        customer_delivery_address: null,
        customer_email: null,
        company_id: null,
        purchase_order_code: null,
      });
      setInputList([]);
      setDisabled(false);
      setTitle({ formTitle: "New Invoice", buttonTitle: "Create" });
    }
  }, [props.open]);

  // const confirmSend = () => {
  //   setOpenDialog(true);
  // };

  const closeForm = () => {
    setData({
      id: null,
      title: null,
      invoice_description: null,
      taxes_persen: null,
      company_id: null,
      invoice_date: null,
      invoice_number: null,
      project_name: null,
      project_description: null,
      invoice_due_date: null,
      customer_name: null,
      customer_contact: null,
      customer_address: null,
      customer_phone: null,
      customer_delivery_address: null,
      customer_email: null,
      customer_id: null,
      sales_name: null,
      sales_phone: null,
      purchase_order_code: null,
      // containers: [],
    });
    props?.closeModal();
  };

  // var productSwr = getListProductSwr({ orderBy: "company" });
  let containerSwr = getListContainerStockSwr({
    // status: 1005,
    orderBy: "serial_number",
  });

  // useEffect(() => {
  //   containerSwr.mutate();
  //   if (containerSwr?.data) {
  //     setContainerList(containerSwr?.data?.result ?? []);
  //   }
  // }, [containerSwr]);

  // const onContainerChange = (event, value, i, extra) => {
  //   let list = [...inputList];
  //   if (value != null) {
  //     let valData = value.label.split(" - ");
  //     if (valData[2].indexOf(" *") >= 0) {
  //       list[i]["container_id"] = value.id;
  //       list[i]["container_size"] = Number(valData[0]);
  //       list[i]["container_type"] = valData[1];
  //       list[i]["serial_number"] = valData[2];
  //     } else {
  //       alert("Status not ready");
  //       SetFormValues([""]);
  //     }
  //   } else {
  //     list[i][event.target.name] = event.target.value;
  //   }
  //   setInputList(list);
  //   setData({ ...data, containers: list });
  // };

  // useEffect(() => {
  //   let list = [];
  //   list.push({ id: "", label: "" });
  //
  //   containerList.map((item, i) => {
  //     if (item.stock_status_id === 1005) {
  //       list.push({
  //         id: item.id,
  //         label:
  //             item.size.name +
  //             " - " +
  //             item.type.name +
  //             " - " +
  //             item.serial_number +
  //             " *",
  //       });
  //     } else {
  //       list.push({
  //         id: item.id,
  //         label:
  //             item.size.name +
  //             " - " +
  //             item.type.name +
  //             " - " +
  //             item.serial_number,
  //       });
  //     }
  //   });
  //
  //   setOptionContainerList(list);
  // }, [containerList]);

  let customerSwr = getDetailCustomerSwr(data?.customer_id);

  //
  // useEffect(() => {
  //   if (data.customer_id != null) {
  //       customerSwr.mutate();
  //       if (customerSwr?.data) {
  //           setData({
  //           ...data,
  //           customer_name: customerSwr?.data?.result?.name,
  {
    /*          // customer_contact: customerSwr?.data?.result?.contact,*/
  }
  //           customer_address: customerSwr?.data?.result?.address,
  //           customer_phone: customerSwr?.data?.result?.phone,
  //           // customer_delivery_address: customerSwr?.data?.result?.delivery_address,
  //           customer_email: customerSwr?.data?.result?.email,
  //           });
  //       }
  //   }
  {
    /*  else {*/
  }
  {
    /*    alert("Customer not found");*/
  }
  //   }
  //
  //   // alert(JSON.stringify(customerSwr))
  //   // if (customerSwr?.data) {
  //   //   setCustomerList(customerSwr?.data?.result ?? []);
  //   // }
  //   // else if (customerSwr?.data) {
  //   //   setCustomerList(customerSwr?.data?.result ?? []);
  //   // }
  // });

  return (
    <Modal
      open={props?.open}
      onClose={closeForm}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box className="modal-wrapper" style={{ width: "794px" }}>
        <Card className="modal">
          <Box className="modal-header"></Box>
          <Box className="modal-content">
            <div ref={ref} >
              <Grid
                item
                xs={12}
                align="left"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingRight: 40,
                  paddingTop: 10,
                }}
              >
                <img style={{ height: 60 }} src="/images/logo.png" />
              </Grid>
              <h2 style={{ paddingLeft: 30 }}>{title.formTitle}</h2>

              <Box className="modal-content">
                <Grid container spacing={1} style={{ paddingBottom: 10 }}>
                  <Grid item xs={4}>
                    <Typography variant="body2" component="p">
                      {customerSwr?.data?.company_type +
                        ". " +
                        customerSwr?.data?.company}
                      <br />
                      {customerSwr?.data?.name}
                      <br />
                      {customerSwr?.data?.phone_number}
                      <br />
                      {customerSwr?.data?.email}
                      <br />
                      {customerSwr?.data?.address}
                    </Typography>
                    <Grid item xs={12} style={{paddingTop: 10}}>
                      <Typography variant="body2" component="p">
                        <b>Customer Code: </b> <br />
                        {customerSwr?.data?.customer_code}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} style={{paddingTop: 15}}>
                      <Typography variant="body2" component="p">
                        <b>Project Code: </b> <br />
                        {data?.project_code}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" component="p">
                          <b>Invoice Date: </b> <br />
                          {Moment(data?.invoice_date).format("LL")}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" component="p">
                          <b>Due Date:</b> <br />
                          {Moment(data?.invoice_due_date).format("LL")}
                          {/*{dateExpired(data?.invoice_due_date)}*/}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" component="p">
                          {" "}
                          <b>Invoice Number:</b> <br />
                          {data?.invoice_number}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" component="p">
                          {" "}
                          <b>Purchase Order #:</b> <br />
                          {data?.purchase_order_code}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="body2"
                      component="p"
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      PT Tradecorp Indonesia <br />
                      JL. Rorotan Babek TNI No 2-3 <br />
                      Cakung Timur <br />
                      JAKARTA TIMUR, 13910, <br />
                      PHONE : 021 - 22946099 <br />
                      INDONESIA <br />
                    </Typography>
                  </Grid>
                </Grid>

                <TableContainer style={{}}>
                  <Table
                    background="/images/Logo-Tradecorp.webp"
                    className={classes.table}
                    aria-label="spanning table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontSize: 10 }}>
                          Description
                        </TableCell>
                        <TableCell align="right" style={{ fontSize: 10 }}>
                          Qty
                        </TableCell>
                        <TableCell align="right" style={{ fontSize: 10 }}>
                          Unit Price
                        </TableCell>
                        <TableCell align="right" style={{ fontSize: 10 }}>
                          Amount in IDR
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.desc}>
                          <TableCell style={{ fontSize: 10 }}>
                            {row.desc}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }} align="right">
                            {row.qty}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }} align="right">
                            {rupiah(row.unit)}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }} align="right">
                            {rupiah(ccyFormat(row.price))}
                          </TableCell>
                        </TableRow>
                      ))}

                      <TableRow>
                        <TableCell rowSpan={5} />
                        <TableCell style={{ fontSize: 10 }} colSpan={2}>
                          Subtotal
                        </TableCell>
                        <TableCell style={{ fontSize: 10 }} align="right">
                          {rupiah(ccyFormat(invoiceSubtotal))}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontSize: 10 }}>
                          Total Sales Tax 10%{" "}
                        </TableCell>
                        <TableCell style={{ fontSize: 10 }} align="right">{`${(
                          TAX_RATE * 100
                        ).toFixed(0)} %`}</TableCell>
                        <TableCell style={{ fontSize: 10 }} align="right">
                          {rupiah(ccyFormat(invoiceTaxes))}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontSize: 10 }} colSpan={2}>
                          Invoice Total IDR
                        </TableCell>
                        <TableCell style={{ fontSize: 10 }} align="right">
                          {rupiah(ccyFormat(invoiceTotal))}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontSize: 10 }} colSpan={2}>
                          Total Net Payments IDR
                        </TableCell>
                        <TableCell style={{ fontSize: 10 }} align="right">
                          {rupiah(0)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontSize: 10 }} colSpan={2}>
                          Amount Due IDR
                        </TableCell>
                        <TableCell style={{ fontSize: 10 }} align="right">
                          {rupiah(ccyFormat(invoiceTotal))}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <br />
              <Grid
                container
                spacing={1}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingLeft: 20,
                }}
              >
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="body2"
                        component="p"
                        className={classes.textFontCenter}
                      >
                        THANK YOU FOR YOUR BUSINESS, PT TRADECORP INDONESIA
                        RETAINS TITLE TO THE GOODS LISTED ON THIS SALES INVOICE
                        AND OWNERSHIP OF THE GOODS DOES NOT PASS TO THE
                        PURCHASER UNTILL PT TRADECORP INDONESIA HAS RECEIVED
                        PAYMENT IN FULL
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={8}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="body2"
                        component="p"
                        className={classes.textFontCenter}
                      >
                        Please remit payment to the following account:
                        <br />
                        PT TRADECORP INDONESIA
                        <br />
                        Bank: PT. BANK MANDIRI (PERSERO) TBK
                        <br />
                        Address: KCP JAKARTA KELAPA GADING
                        <br />
                        SWIFTBIC: BMRIIDJA
                        <br />
                        Account: USD ACCOUNT 0000000000/ IDR ACCOUNT 0000000000
                        <br />
                        <b>
                          {" "}
                          ALL BANK CHARGES INCURRED ON BOTH SIDES ARE TO BE
                          SETTLED ON THE REMITTERS ACCOUNT
                        </b>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Grid
                    item
                    xs={12}
                    style={{ paddingBottom: 120, fontSize: 10 }}
                  >
                    Approved by:
                  </Grid>
                  <Grid item xs={12} style={{ fontSize: 10 }}>
                    <Divider></Divider> Date:
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Box>

          <Box className="modal-footer">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Pdf
                  targetRef={ref}
                  filename="invoice.pdf"
                  options={optionToPDF}
                >
                  {({ toPdf }) => (
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={toPdf}
                    >
                      Generate PDF
                    </Button>
                  )}
                </Pdf>
                {/*<Button*/}
                {/*    variant="contained"*/}
                {/*    color="secondary"*/}
                {/*    fullWidth*/}
                {/*    onClick={sendData}*/}
                {/*    disableElevation*/}
                {/*>*/}
                {/*  {title.buttonTitle}*/}
                {/*</Button>*/}
              </Grid>
            </Grid>
          </Box>
          <AlertDialog
            open={openDialog}
            cancelAction={() => setOpenDialog(false)}
            // okAction={() => sendDataNext()}
            // okAction={alert('generate pdf in here')}

            title="Send data confirmation"
            body="Are you sure want to send this record?"
          />
        </Card>
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Modal>
  );
}
