import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  Paper,
  TableBody,
  Button,
  IconButton,
  ButtonGroup,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Menu,
  Icon,
  Hidden,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Delete, Add, CallToAction, Edit } from "@material-ui/icons";

import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";

import BaseLayout from "../../base_layout/base-layout";

import { getColorListApi } from "../../../services/api/color-codes.api";
import { getDetailQuoteInApi } from "../../../services/api/quote-in.api";

import AlertDialog from "../../base_component/dialog";

import FormOrder from "./form-order-production";
import CompletenessDocument from "./completeness-document";

import {
  updateStatusOrderQuoteApi,
  getListOrderQuoteApi,
  getListOrderIdStatusQuoteApi,
} from "../../../services/api/order-quote.api";

import { getListMasterSerialApi } from "../../../services/api/master-serial.api";

import { getListCustomerApi } from "../../../services/api/customer.api";

// import UploadForm from "./upload-form";
// import SpecificationForm from "./specification-form";

import { v4 as uuid } from "uuid";

import { getDetailCompDocByOrderIdApi } from "../../../services/api/completed-document.api";

import { Alert, AlertTitle } from "@material-ui/lab";

import { exportXls } from "../../../helpers/build-quote/generateExcel";

import Collapse from "@material-ui/core/Collapse";

//dialog
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import SendToProduction from "./form-send-completed";
import { display } from "@mui/system";
//--dialog

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    fontSize: "1.2em",
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

  table: {
    minWidth: 2650,
  },
}));

export default function BuildQuoteInput() {
  const router = useRouter();

  const quoteinId = router.query.id;

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }
  const classes = useStyles();
  const [openComDoc, setOpenComDoc] = useState(false);
  const [completedDocData, setCompletedDocData] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [openFailAlert, setOpenFailAlert] = useState(false);

  const [openOrderForm, setOpenOrderForm] = useState(false);
  const [actForm, setActForm] = useState("Add");

  const [sendToProdDlg, setSendToProdDlg] = useState(false);
  const [msgStatusQuote, setMsgStatusQuote] = useState("");

  const [listFile, setListFile] = useState(false);
  const [refCust, setRefCust] = useState(false);
  const [colorList, setColorList] = useState([
    {
      ral_code: null,
      rgb: null,
      html_code: null,
      name_german: null,
      name_english: null,
      name_french: null,
      name_spanish: null,
      name_italian: null,
      name_nederlands: null,
      unit_link: null,
      series: null,
    },
  ]);

  const [quoteData, setQuoteData] = useState(false);
  const [orderDataList, setOrderDataList] = useState(false);
  const [refreshOrder, setRefreshOrder] = useState(false);
  const [inputList, setInputList] = useState([
    {
      id: null,
      unit_code: null,
      series: null,
      color: null,
      price: null,
      quantity: null,
      container_number_from: null,
      container_number_to: null,
      pre_sale: null,
      order_quote_files: [],
      specification: [],
    },
  ]);
  const [data, setData] = useState([
    {
      id: null,
      unit_code: null,
      series: null,
      color: null,
      price: null,
      quantity: null,
      container_number_from: null,
      container_number_to: null,
      pre_sale: null,
      order_quote_files: [],
      specification: [],
    },
  ]);
  const [specListData, setSpecListData] = useState([
    {
      container_specifications: [
        { specification_id: null, specification: null },
      ],
      other_specifiaction: null,
    },
  ]);

  const [state, setState] = useState({
    checkedA: true,
    checkedB: true,
    checkedF: true,
    checkedG: true,
  });
  const [unitCode, setUnitCode] = useState("");
  const [series, setSeries] = useState(-1);
  const [uploadListData, setUploadListData] = useState(false);
  const [uploadOtherListData, setUploadOtherListData] = useState(false);

  const [openUploadForm, setOpenUploadForm] = useState(false);
  // const [openSpecificationForm, setOpenSpecificationForm] = useState(false);
  const [keyRow, setKeyRow] = useState(-1);

  const [sendToProdDialog, setSendToProdDialog] = useState(false);

  //complete document
  const [openCompleteDoc, setOpenCompleteDoc] = useState(false);
  const [actFormCompleteDoc, setActFormCompleteDoc] = useState(false);
  //complete document

  useEffect(async () => {
    var data = await getListCustomerApi();
    if (data.count > 0) {
      setRefCust(data.result);
    }
  }, []);

  useEffect(async () => {
    var data = await getDetailQuoteInApi(quoteinId);
    setQuoteData(data);
  }, []);

  useEffect(async () => {
    var data = await getListOrderIdStatusQuoteApi(quoteinId, "production");
    setOrderDataList(data);
    setRefreshOrder(false);
  }, [refreshOrder]);

  useEffect(async () => {
    try {
      var dataColor = [];
      dataColor.push({
        ral_code: "Miscellaneous",
        rgb: null,
        html_code: null,
        name_german: null,
        name_english: "Miscellaneous",
        name_french: null,
        name_spanish: null,
        name_italian: null,
        name_nederlands: null,
        unit_link: null,
        series: -1,
      });
      dataColor.push({
        ral_code: "All Colours",
        rgb: null,
        html_code: null,
        name_german: null,
        name_english: "All Colours",
        name_french: null,
        name_spanish: null,
        name_italian: null,
        name_nederlands: null,
        unit_link: null,
        series: -1,
      });
      var res = await getColorListApi("", "name_english");
      res?.map((res) => {
        dataColor.push({
          ral_code: res?.ral_code,
          rgb: null,
          html_code: res?.html_code,
          name_german: null,
          name_english: res?.name_english,
          name_french: null,
          name_spanish: null,
          name_italian: null,
          name_nederlands: null,
          unit_link: null,
          series: -1,
        });
      });

      setColorList(dataColor);
    } catch (err) {
      console.log(err);
    }
  }, [refreshOrder]);

  useEffect(() => {
    setListFile({ quote_in_images: [] });
  }, []);

  const handleClickOpenProduction = () => {
    updateStatusOrderQuoteApi(quoteinId, "completed");
    setMsgStatusQuote("Already Sent to Completed Production");
    setSendToProdDlg(false);
    setSendToProdDialog(false);
  };

  const completenessDocument = async (id) => {
    setOrderId(id);
    var data = await getDetailCompDocByOrderIdApi(id).then((res) => {
      if (res != null) {
        setCompletedDocData(res);
        setActFormCompleteDoc("edit");
      } else {
        setActFormCompleteDoc("add");
        setCompletedDocData(null);
      }
      setOpenCompleteDoc(true);
    });
  };

  const clickEditRow = (iddata) => {
    setActForm("Update");
    setOpenOrderForm(true);
    var data = orderDataList?.result?.find(({ id }) => id === iddata);

    fUploadData(data?.order_quote_files, 0);
    setColorEnable(data?.unit_code);
    var dataSpec = {
      container_specifications: data?.container_specifications,
      other_specification: data?.other_specification,
    };

    setUploadListData({ fileData: data?.order_quote_files });
    setUploadOtherListData({ otherFileData: data?.other_order_quote_files });
    setSpecListData(dataSpec);
    setInputList([data]);
  };

  function fUploadData(data, key) {
    var list = [...inputList];
    list[key]["order_quote_files"] = data;
    setInputList(list);
    setOpenUploadForm(false);
  }

  function fUploadOtherData(data, key) {
    var list = [...inputList];
    list[key]["other_order_quote_files"] = data;
    setInputList(list);
    setOpenUploadForm(false);
  }

  function fSpecData(data, key) {
    setSpecListData(data);
    setKeyRow(key);
    var list = [...inputList];
    list[key]["container_specifications"] = data?.container_specification;
    list[key]["other_specification"] = data?.other_specification;
    setInputList(list);
    // setOpenSpecificationForm(false);
  }
  function closeModalCompleteDoc() {
    setOpenCompleteDoc(false);
  }
  function closeFormOrder() {
    refresh();
    setRefreshOrder(true);
    setOpenOrderForm(false);
  }

  async function setColorEnable(unitCode) {
    var dataColorOrigin = [];
    dataColorOrigin.push({
      ral_code: "Miscellaneous",
      rgb: null,
      html_code: null,
      name_german: null,
      name_english: "Miscellaneous",
      name_french: null,
      name_spanish: null,
      name_italian: null,
      name_nederlands: null,
      unit_link: null,
      series: -1,
    });
    dataColorOrigin.push({
      ral_code: "All Colours",
      rgb: null,
      html_code: null,
      name_german: null,
      name_english: "All Colours",
      name_french: null,
      name_spanish: null,
      name_italian: null,
      name_nederlands: null,
      unit_link: null,
      series: -1,
    });
    var res = await getColorListApi("", "name_english");
    res?.map((res) => {
      dataColorOrigin.push({
        ral_code: res?.ral_code,
        rgb: null,
        html_code: res?.html_code,
        name_german: null,
        name_english: res?.name_english,
        name_french: null,
        name_spanish: null,
        name_italian: null,
        name_nederlands: null,
        unit_link: null,
        series: -1,
      });
    });

    var colorData = await getListMasterSerialApi(unitCode, "*");
    var colorDataMisc = await getListMasterSerialApi("*", "Miscellaneous");
    var colorDataAllC = await getListMasterSerialApi("*", "Allcolours");

    var colorTmp = [];

    dataColorOrigin?.map((res) => {
      var series = -1;

      if (res?.ral_code == "All Colours") {
        var x = colorDataAllC?.result?.filter(
          ({ ral_colour }) => ral_colour === res?.ral_code
        );
        if (x.length > 0) {
          x?.map((res2) => {
            if (res2.unit_code == unitCode) {
              series = res2.series;
            } else {
              series = -1;
            }
            colorTmp.push({
              ral_code: res2?.ral_colour,
              html_code: null,
              name_english: res2?.ral_colour,
              series: series,
            });
          });
        }
      } else if (res?.ral_code == "Miscellaneous") {
        var x = colorDataMisc?.result?.filter(
          ({ ral_colour }) => ral_colour === res?.ral_code
        );
        if (x.length > 0) {
          x?.map((res2) => {
            if (res2.unit_code == unitCode) {
              series = res2.series;
            } else {
              series = -1;
            }
            colorTmp.push({
              ral_code: res2?.ral_colour,
              html_code: null,
              name_english: res2?.ral_colour,
              series: series,
            });
          });
        }
      } else {
        var x = colorData?.result?.find(
          ({ ral_colour }) => ral_colour === res?.ral_code
        );

        if (typeof x != "undefined") {
          series = x?.series;
        } else {
          series = -1;
        }
        colorTmp.push({
          ral_code: res?.ral_code,
          html_code: res?.html_code,
          name_english: res?.name_english,
          series: series,
        });
      }
    });
    setColorList(colorTmp);
  }

  const exportForm = async (id) => {
    var dataOrder = await getListOrderIdStatusQuoteApi(id, "*");
    exportXls(dataOrder);
  };

  const newOrder = () => {
    setActForm("Add");
    setOpenOrderForm(true);
    refresh();
  };
  function refresh() {
    setUploadListData([]);
    setUploadOtherListData([]);
    setRefreshOrder(true);
    setSpecListData();
    setUnitCode("");
    setSeries(-1);
    setInputList([
      {
        id: null,
        unit_code: null,
        series: null,
        color: null,
        price: null,
        quantity: null,
        container_number_from: null,
        container_number_to: null,
        pre_sale: null,
        order_quote_files: [],
        specification: [],
      },
    ]);

    setSpecListData([
      {
        container_specifications: [
          { specification_id: null, specification: null },
        ],
        other_specifiaction: null,
      },
    ]);
  }
  return (
    <BaseLayout title="Quotation">
      <Box className="p-5 content-wraper">
        <Collapse in={openAlert}>
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            Data container order saved!
          </Alert>
        </Collapse>
        <Collapse in={openFailAlert}>
          <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
            Data container order not saved!
          </Alert>
        </Collapse>

        <Card className={classes.root}>
          <Grid container className="mt-3">
            <Grid xs={12}>
              <ButtonGroup>
                <Button
                  style={{ marginLeft: 7 }}
                  onClick={(e) => openPage(e, getRoute("quotein-production"))}
                >
                  <Icon>arrow_back_ios</Icon>Back
                </Button>
              </ButtonGroup>{" "}
            </Grid>
          </Grid>
          <CardHeader
            style={{ fontSize: "1.5em" }}
            title="Order"
            subheader={quoteData?.factory}
          ></CardHeader>
          <CardContent>
            <Grid container>
              <Grid item xs={6}>
                <h4>Quote</h4>
              </Grid>
              <Grid item xs={6} style={{ color: "red", textAlign: "right" }}>
                <h3>{msgStatusQuote}</h3>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <Table container size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Container Type</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  {quoteData?.container_details?.map((res) => (
                    <TableRow>
                      <TableCell>{res?.container_type_data?.name}</TableCell>
                      <TableCell>{res?.container_size_data?.name}</TableCell>
                      <TableCell>{res?.quantity}</TableCell>
                      <TableCell align="right">
                        {res?.price}
                        {"  "}
                        {res?.currency}
                      </TableCell>
                    </TableRow>
                  ))}
                </Table>
              </Grid>
            </Grid>
            <Grid container style={{ marginTop: 10 }}>
              <Grid item xs="12">
                <Card className={classes.root}>
                  <CardContent>
                    <Grid container style={{ marginBottom: 10 }}>
                      <Grid item xs={6} style={{ textAlign: "left" }}>
                        {/* <ButtonGroup>
                          <Button
                            onClick={(e) => openPage(e, getRoute("quotein"))}
                          >
                            <Icon>arrow_back_ios</Icon>Back
                          </Button>
                        </ButtonGroup> */}
                      </Grid>
                      <Grid item xs={6} style={{ textAlign: "right" }}>
                        {/* <ButtonGroup>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => newOrder()}
                            style={{
                              display: msgStatusQuote != "" ? "none" : "",
                            }}
                          >
                            Add
                          </Button>
                        </ButtonGroup> */}
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item xs={12}>
                        <h4> Order Detail</h4>
                      </Grid>
                    </Grid>
                    <TableContainer component={Paper}>
                      <Table
                        size="small"
                        className={classes.table}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>Unit Code</TableCell>
                            <TableCell>Color</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Series From</TableCell>
                            <TableCell>Series To</TableCell>
                            <TableCell>Pre Sold</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orderDataList?.result?.map((res, key) => (
                            <TableRow style={{ cursor: "pointer" }} key={key}>
                              <TableCell onClick={() => clickEditRow(res?.id)}>
                                {res?.unit_code}
                              </TableCell>
                              <TableCell onClick={() => clickEditRow(res?.id)}>
                                {res?.color}{" "}
                                {res?.container_color?.name_english}{" "}
                                <CallToAction
                                  style={{
                                    width: 70,
                                    padding: 0,
                                    color: res?.container_color?.html_code,
                                  }}
                                />
                              </TableCell>
                              <TableCell onClick={() => clickEditRow(res?.id)}>
                                {res?.price}
                              </TableCell>
                              <TableCell onClick={() => clickEditRow(res?.id)}>
                                {res?.quantity}
                              </TableCell>
                              <TableCell onClick={() => clickEditRow(res?.id)}>
                                {res?.container_number_from}
                              </TableCell>
                              <TableCell onClick={() => clickEditRow(res?.id)}>
                                {res?.container_number_to}
                              </TableCell>
                              <TableCell onClick={() => clickEditRow(res?.id)}>
                                {res?.customer?.company}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => clickEditRow(res?.id)}
                                >
                                  Detail
                                </Button>
                                {"  "}
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => completenessDocument(res?.id)}
                                >
                                  Completeness Document
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Grid container style={{ marginTop: 10 }}>
                      <Grid item xs={12} style={{ textAlign: "right" }}>
                        <ButtonGroup
                          color="secondary"
                          aria-label="outlined primary button group"
                        >
                          <Button
                            variant="contained"
                            onClick={(e) => exportForm(quoteinId)}
                          >
                            Export to Excel
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => setSendToProdDialog(true)}
                            style={{
                              display: msgStatusQuote !== "" ? "none" : "",
                            }}
                          >
                            Completed Production
                          </Button>
                        </ButtonGroup>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <CompletenessDocument
        open={openCompleteDoc}
        actForm={actFormCompleteDoc}
        quoteinId={quoteinId}
        completedDocData={completedDocData}
        orderId={orderId}
        closeModal={closeModalCompleteDoc}
        quoteData={quoteData}
      />

      <FormOrder
        open={openOrderForm}
        actForm={actForm}
        quoteinId={quoteinId}
        closeModal={closeFormOrder}
        quoteData={quoteData}
        orderDataList={inputList}
        uploadListData={uploadListData}
        uploadOtherListData={uploadOtherListData}
        specListData={specListData}
        // newOption={newOption}
        // addMaster={(category) => addMaster(category)}
      />

      <Dialog
        open={sendToProdDialog}
        onClose={() => setSendToProdDialog(false)}
        fullWidth
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Send Order to Production"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SendToProduction
              open={sendToProdDialog}
              paramQuoteData={quoteData}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setSendToProdDialog(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={() => setSendToProdDlg(true)}
            color="primary"
            autoFocus
          >
            Completed Production
          </Button>
        </DialogActions>
      </Dialog>

      <AlertDialog
        open={sendToProdDlg}
        cancelAction={() => setSendToProdDlg(false)}
        okAction={() => handleClickOpenProduction()}
        title="Confirmation"
        body="Send to Completed Production ?"
      />
    </BaseLayout>
  );
}
