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
import { getIdSubAccApi } from "../../../../services/api/acc-sub.api";
import moment from "moment";
import { numberWithCommas } from "../../../../helpers/general";
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
  const [dataPayList, setDataPayList] = useState([]);
  const [dataSub, setDataSub] = useState("");
  const [subAcc, setSubAcc] = useState(false);

  const closeForm = () => {
    props?.closeModal();
  };
  var payByIdSwr = getListPaymentByIdSwr("payment", props.idPayment);
  useEffect(() => {
    if (payByIdSwr?.data) {
      setDataPayList(payByIdSwr?.data?.result ?? []);
      payByIdSwr?.data?.result?.map((row) => {
        //   setSubAcc(row?.payment_agg?.subsidiary_account);
        var dataSubTmp = getIdSubAccApi(
          row?.payment_agg?.subsidiary_account
        ).then((res) => {
          setDataSub(res?.subsidiary_description);
        });
      });
    }
  }, [payByIdSwr]);

  // useEffect(() => {
  //   if (subAcc) {
  //     var dataSubTmp = getIdSubAccApi(subAcc).then((res) => {
  //       setDataSub(res?.subsidiary_description);
  //     });
  //   }
  // }, [payByIdSwr]);

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
                Payment Detail
              </Grid>
            </Grid>
          </Box>
          <Box className="modal-content">
            <Box className="mb-3">
              <Paper className={classes.paper}>
                <Table className={classes.table}>
                  <TableBody>
                    {dataPayList?.map((rows, key) => (
                      <React.Fragment>
                        <TableRow>
                          <TableCell className={classes.tableBorderNone}>
                            Project
                          </TableCell>
                          <TableCell className={classes.tableBorderNone}>
                            : {rows?.payment_agg?.project_code}
                            {rows?.payment_agg?.project_name}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.tableBorderNone}>
                            Payment code
                          </TableCell>
                          <TableCell className={classes.tableBorderNone}>
                            : {rows?.payment_agg?.payment_code}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.tableBorderNone}>
                            Payment date
                          </TableCell>
                          <TableCell className={classes.tableBorderNone}>
                            :{" "}
                            {moment(rows?.payment_agg?.payment_date).format(
                              "LL"
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.tableBorderNone}>
                            Payment method
                          </TableCell>
                          <TableCell className={classes.tableBorderNone}>
                            : {rows?.payment_agg?.payment_method}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.tableBorderNone}>
                            Sub Account
                          </TableCell>
                          <TableCell className={classes.tableBorderNone}>
                            : {rows?.payment_agg?.subsidiary_account}
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell className={classes.tableBorderNone}>
                            Sub Account
                          </TableCell>
                          <TableCell className={classes.tableBorderNone}>
                            : {dataSub}
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell className={classes.tableBorderNone}>
                            Company name
                          </TableCell>
                          <TableCell className={classes.tableBorderNone}>
                            :{rows?.payment_agg?.customer_company_type}{" "}
                            {rows?.payment_agg?.customer_company_name}
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
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
      </Box>
    </Modal>
  );
}
