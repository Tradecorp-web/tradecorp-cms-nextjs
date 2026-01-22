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
import { FlipToFront } from "@material-ui/icons";
import PaymentDetailForm from "./payment-detail";

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

export default function InvoiceHistoryForm(props) {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false);
  const [idPayment, setIdPayment] = useState(false);
  const [dataPayList, setDataPayList] = useState([]);
  const [openPaymentDetailForm, setOpenPaymentDetailForm] = useState(false);
  const closeForm = () => {
    props?.closeModal();
  };
  var payByIdSwr = getListPaymentByIdSwr("invoice", props.idInvoice);
  useEffect(() => {
    if (payByIdSwr?.data) {
      setDataPayList(payByIdSwr?.data?.result ?? []);
    }
  }, [payByIdSwr]);

  const refreshPaymentDetailList = () => {
    setOpenPaymentDetailForm(false);
  };

  const paymentDetailForm = (id) => {
    setIdPayment(id);
    setOpenPaymentDetailForm(true);
  };
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
                <Typography>
                  Payments related to invoices number {props.invoiceNumber}
                </Typography>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Number</TableCell>
                      <TableCell>Payment Number</TableCell>
                      <TableCell>Payment Date</TableCell>
                      <TableCell style={{ textAlign: "right" }}>
                        Payment Value
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataPayList?.map((rows, key) => (
                      <TableRow>
                        <TableCell className={classes.tableBorderNone}>
                          {key + 1}
                        </TableCell>
                        <TableCell className={classes.tableBorderNone}>
                          {rows?.payment_agg?.payment_code}
                          <IconButton>
                            <FlipToFront
                              onClick={() =>
                                paymentDetailForm(rows?.payment_agg?.id)
                              }
                            />
                          </IconButton>
                        </TableCell>
                        <TableCell className={classes.tableBorderNone}>
                          {moment(rows?.payment_agg?.payment_date).format("LL")}
                        </TableCell>
                        <TableCell
                          className={classes.tableBorderNone}
                          style={{ textAlign: "right" }}
                        >
                          {numberWithCommas(rows?.payment_agg?.payment_amount)}
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
        <PaymentDetailForm
          open={openPaymentDetailForm}
          closeModal={refreshPaymentDetailList}
          idPayment={idPayment}
        />
      </Box>
    </Modal>
  );
}
