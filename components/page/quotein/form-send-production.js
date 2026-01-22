import { makeStyles } from "@material-ui/core/styles";

import {
  Divider,
  Grid,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  Typography,
  TableBody,
  TextField,
  Hidden,
} from "@material-ui/core";
import Moment from "moment";
import { useEffect, useState } from "react";
import { downloadFileProcess } from "../../../helpers/build-quote/file";
import { getListOrderIdQuoteApi } from "../../../services/api/order-quote.api";
import CallToAction from "@material-ui/icons/Lens";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    color: "#000000",
    fontSize: "1em",
    fontWeight: "bold",
  },
  rootItem: {
    border: 0,
    color: "#595959",
    padding: "0 10px !important",
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },

  tableHead: {
    fontSize: "10px",
    fontWeight: "Bold",
  },
  tableContent: {
    fontSize: "10px",
  },
}));

export default function SendToProduction(props) {
  const classes = useStyles();
  const [dataOrder, setDataOrder] = useState(false);

  useEffect(async () => {
    if (props.open) {
      var dtaOrder = await getListOrderIdQuoteApi(props?.paramQuoteData?.id);
      setDataOrder(dtaOrder);
    }
  }, []);

  const downloadFile = (link) => {
    downloadFileProcess(link);
  };

  return (
    <section>
      <h4>Send to Production</h4>
      <Grid container>
        <Grid item xs={2}>
          <Typography variant="h6" gutterBottom>
            Factory
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography className={classes.title} variant="h6" gutterBottom>
            {props?.paramQuoteData?.factory}
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={2}>
          <Typography variant="h6" gutterBottom>
            Quote date
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.title} variant="h6" gutterBottom>
            {Moment(props?.paramQuoteData?.quote_in_date).format("YYYY-MM-DD")}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6" gutterBottom>
            Validity
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.title} variant="h6" gutterBottom>
            {Moment(props?.paramQuoteData?.validity).format("YYYY-MM-DD")}
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={2}>
          <Typography variant="h6" gutterBottom>
            Factory Country
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.title} variant="h6" gutterBottom>
            {props?.paramQuoteData?.country_name}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6" gutterBottom>
            Currency
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.title} variant="h6" gutterBottom>
            {props?.paramQuoteData?.country?.currency}
          </Typography>
        </Grid>
      </Grid>
      {/* production  */}
      <Grid container>
        <Grid item xs={2}>
          <Typography variant="h6" gutterBottom>
            Factory City
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.title} variant="h6" gutterBottom>
            {props?.paramQuoteData?.city_name}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6" gutterBottom>
            Production time
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.title} variant="h6" gutterBottom>
            {props?.paramQuoteData?.production_time}{" "}
            {props?.paramQuoteData?.production_time_period}
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
      {/* Container detail */}

      <Grid container className="mt-3">
        <Grid item xs={12}>
          <Typography className={classes.title} variant="h6" gutterBottom>
            Container Order
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <TableContainer className="mt-0">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHead}>No</TableCell>
                  <TableCell className={classes.tableHead}>Type</TableCell>
                  <TableCell className={classes.tableHead}>Size</TableCell>
                  <TableCell
                    className={classes.tableHead}
                    colSpan={3}
                    style={{
                      textAlign: "center",
                      backgroundColor: "lightyellow",
                    }}
                  >
                    Color
                  </TableCell>
                  <TableCell className={classes.tableHead}>Qty</TableCell>
                  <TableCell
                    className={classes.tableHead}
                    colSpan={2}
                    style={{
                      textAlign: "center",
                      backgroundColor: "lightyellow",
                    }}
                  >
                    Series
                  </TableCell>
                  <TableCell
                    className={classes.tableHead}
                    style={{ textAlign: "center" }}
                  >
                    Pre-sale
                  </TableCell>
                  <TableCell className={classes.tableHead}>Logo</TableCell>
                  <TableCell className={classes.tableHead}>CSC Plate</TableCell>
                  <TableCell className={classes.tableHead}>
                    CSC Description
                  </TableCell>
                </TableRow>
              </TableHead>
              {dataOrder.count > 0 &&
                dataOrder?.result?.map((res, key) => (
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.tableContent}>
                        {key + 1}
                      </TableCell>
                      <TableCell className={classes.tableContent}>
                        {res?.container_type_data}
                      </TableCell>
                      <TableCell className={classes.tableContent}>
                        {res?.unit_code}
                      </TableCell>
                      <TableCell
                        className={classes.tableContent}
                        style={{
                          textAlign: "center",
                          backgroundColor: "lightyellow",
                        }}
                      >
                        {res?.container_color?.name_english}
                      </TableCell>
                      <TableCell
                        className={classes.tableContent}
                        style={{
                          textAlign: "center",
                          backgroundColor: "lightyellow",
                        }}
                      >
                        {res?.container_color?.ral_code}
                      </TableCell>
                      <TableCell
                        className={classes.tableContent}
                        style={{
                          textAlign: "center",
                          backgroundColor: "lightyellow",
                        }}
                      >
                        {res?.container_color?.ral_code != null && (
                          <CallToAction
                            style={{
                              width: 70,
                              padding: 0,
                              color: res?.container_color?.html_code,
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell className={classes.tableContent}>
                        {res?.quantity}
                      </TableCell>
                      <TableCell
                        className={classes.tableContent}
                        style={{
                          textAlign: "center",
                          backgroundColor: "lightyellow",
                        }}
                      >
                        {res?.container_number_from}
                      </TableCell>
                      <TableCell
                        className={classes.tableContent}
                        style={{
                          textAlign: "center",
                          backgroundColor: "lightyellow",
                        }}
                      >
                        {res?.container_number_to}
                      </TableCell>
                      <TableCell>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableHead}>
                                Company
                              </TableCell>
                              <TableCell className={classes.tableHead}>
                                Code
                              </TableCell>
                              <TableCell className={classes.tableHead}>
                                Phone
                              </TableCell>
                              <TableCell className={classes.tableHead}>
                                Email
                              </TableCell>
                              <TableCell className={classes.tableHead}>
                                Address
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableRow>
                            <TableCell className={classes.tableContent}>
                              {res?.customer?.company_type}{" "}
                              {res?.customer?.company}
                            </TableCell>
                            <TableCell className={classes.tableContent}>
                              {res?.customer?.customer_code}
                            </TableCell>
                            <TableCell className={classes.tableContent}>
                              {res?.customer?.phone_number}
                            </TableCell>
                            <TableCell className={classes.tableContent}>
                              {res?.customer?.email}
                            </TableCell>
                            <TableCell className={classes.tableContent}>
                              {res?.customer?.address}
                            </TableCell>
                          </TableRow>
                        </Table>
                      </TableCell>

                      <TableCell className={classes.tableContent}>
                        {res?.pre_sale != null &&
                          res?.customer?.customer_logo_file != null && (
                            <img
                              onClick={() =>
                                downloadFile(
                                  res?.customer?.customer_logo_file[0]?.link
                                )
                              }
                              width="100px"
                              src={`data:image/jpeg;base64,${res?.customer?.customer_logo_file[0]?.thumbnail}`}
                            />
                          )}
                      </TableCell>
                      <TableCell className={classes.tableContent}>
                        {res?.order_quote_files?.map((iRes) => (
                          <img
                            style={{
                              display:
                                iRes?.file_description == "csc_certified"
                                  ? ""
                                  : "none",
                            }}
                            onClick={() => downloadFile(iRes?.link)}
                            width="100px"
                            src={`data:image/jpeg;base64,${iRes?.thumbnail}`}
                          />
                        ))}
                      </TableCell>
                      <TableCell className={classes.tableContent}>
                        {res?.csc_plate_description}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))}
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </section>
  );
}
