import {
  Card,
  Modal,
  Box,
  makeStyles,
  Backdrop,
  CircularProgress,
  IconButton,
  Button,
  Grid,
  Paper,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getListPaymentByIdSwr } from "../../../../services/swr/payment.swr";
import moment from "moment";
import { numberWithCommas } from "../../../../helpers/general";
import InvoiceHistoryForm from "./invoice-history";
import { Check } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  paper: {
    overflow: "auto",
    padding: "5px",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  tableBorderNone: {
    borderBottom: "none",
    padding: "2px",
  },
  tableBoldBorderNone: {
    borderBottom: "none",
    padding: "2px",
    fontWeight: "bold",
  },
  table: {
    borderCollapse: "separate",
  },
  td: {
    padding: "0px",
  },
  closeButton: {
    boxShadow: "none",
    textAlign: "right",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function PaymentHistoryForm(props) {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false);
  const [dataPayList, setDataPayList] = useState([]);
  const [openInvoiceForm, setOpenInvoiceForm] = useState(false);
  const [idInvoice, setIdInvoice] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");

  const closeForm = () => {
    props?.closeModal();
  };
  const historyForm = (id, invoiceNumber) => {
    setIdInvoice(id);
    setInvoiceNumber(invoiceNumber);
    setOpenInvoiceForm(true);
  };
  const refreshHistoryList = () => {
    setOpenInvoiceForm(false);
  };

  var payByIdSwr = getListPaymentByIdSwr("payment", props.idPayment);
  useEffect(() => {
    if (payByIdSwr?.data) {
      setDataPayList(payByIdSwr?.data?.result ?? []);
    }
  }, [payByIdSwr]);

  return (
    <Modal
      open={props?.open}
      width={400}
      onClose={closeForm}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box className="modal-wrapper" style={{ width: "1000px" }}>
        <Card className="modal">
          <Box className="modal-header">
            <Grid container>
              <Grid item xs={12}>
                Transaction Detail
              </Grid>
            </Grid>
          </Box>
          <Box className="modal-content">
            <Box className="mb-3">
              <Paper className={classes.paper}>
                <Typography>Invoice</Typography>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Number</TableCell>
                      <TableCell>Invoice Number</TableCell>
                      <TableCell>Invoice Date</TableCell>
                      <TableCell style={{ textAlign: "right" }}>
                        Invoice Value
                      </TableCell>
                      <TableCell style={{ textAlign: "right" }}>
                        Remaining Due
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataPayList?.map((rows, key) => (
                      <TableRow>
                        <TableCell className={classes.tableBorderNone}>
                          {key + 1}
                        </TableCell>
                        <TableCell className={classes.tableBorderNone}>
                          {rows?.invoice_agg?.invoice_number}
                        </TableCell>
                        <TableCell className={classes.tableBorderNone}>
                          {moment(rows?.invoice_agg?.invoice_date).format("LL")}
                        </TableCell>
                        <TableCell
                          className={classes.tableBorderNone}
                          style={{ textAlign: "right" }}
                        >
                          {numberWithCommas(rows?.invoice_agg?.total_payment)}
                        </TableCell>
                        <TableCell
                          className={classes.tableBorderNone}
                          style={{ textAlign: "right" }}
                        >
                          {numberWithCommas(rows?.invoice_agg?.rest_payment)}
                        </TableCell>
                        <TableCell
                          className={classes.tableBorderNone}
                          style={{ textAlign: "center" }}
                        >
                          <IconButton>
                            <Check
                              onClick={() =>
                                historyForm(
                                  rows?.invoice_id,
                                  rows?.invoice_agg?.invoice_number
                                )
                              }
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Box>
          </Box>
          <Box className="modal-footer">
            <Grid container>
              <Grid item xs={12}>
                <Paper className={classes.closeButton}>
                  <Button
                    variant="outlined"
                    color="default"
                    onClick={() => closeForm()}
                  >
                    Close
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Card>
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <InvoiceHistoryForm
          open={openInvoiceForm}
          closeModal={refreshHistoryList}
          idInvoice={idInvoice}
          invoiceNumber={invoiceNumber}
        />
      </Box>
    </Modal>
  );
}
