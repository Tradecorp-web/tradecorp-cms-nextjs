import BaseLayout from "../../base_layout/base-layout-sidemenu-accounting";

import {
  Icon,
  Divider,
  Button,
  TextField,
  OutlinedInput,
  Box,
  Collapse,
  IconButton,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
} from "@material-ui/core";

import {
  LOCAL_STORAGE_PREFIX,
  LOCAL_STORAGE_THOUSAND,
  LOCAL_STORAGE_DECIMAL,
  LOCAL_STORAGE_SCALE,
} from "../../../helpers/consts";

import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";

import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import DeleteIcon from "@material-ui/icons/Delete";

import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";
import { numberConvert } from "../../../helpers/general";

import { getListQuoteStatusAccSwr } from "../../../services/swr/quote.swr";
import { getDetailPaymentSwr } from "../../../services/swr/payment.swr";

import AlertDialog from "../../base_component/dialog";

import {
  getFilePaymentApi,
  insertFilePaymentApi,
  updatePaymentApi,
} from "../../../services/api/payment.api";

import { getListInvPaymentSwr } from "../../../services/swr/invoice.swr";

import { currency, dateTimeFormat } from "../../../helpers/general";

import { getListSubAccStatusApi } from "../../../services/api/acc-sub.api";
import { getAccMapSO } from "../../../services/api/sales-order.api";

import { FileUploadSecureComponent } from "../../base_component/file-upload";

import moment from "moment";
import NumberFormat from "react-number-format";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Compare } from "@material-ui/icons";

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

export default function Page() {
  const thousand = localStorage.getItem(LOCAL_STORAGE_THOUSAND);
  const decimal = localStorage.getItem(LOCAL_STORAGE_DECIMAL);
  const prefix = localStorage.getItem(LOCAL_STORAGE_PREFIX);
  const scale = parseInt(localStorage.getItem(LOCAL_STORAGE_SCALE));
  //const
  const classes = useStyles();
  const router = useRouter();
  const [formState, setFormState] = useState(false);

  const [quoteList, setQuoteList] = useState([]);
  const [accMap, setAccMap] = useState([]);
  const [accSubBank, setAccSubBank] = useState([]);
  const [statusSub, setStatusSub] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const [readOnlyStyle, setReadOnlyStyle] = useState(false);
  const [payMethod, setPayMethod] = useState("");
  const [payType, setPayType] = useState("");
  const [subAcc, setSubAcc] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [fileList, setFileList] = useState(null);
  const [fileUpload, setFileUpload] = useState({
    file_id: null,
    file_description: null,
    link: null,
    attachment: null,
    content_type: null,
  });

  const [optionQuoteList, setOptionQuoteList] = useState([]);
  const [tax, setTax] = useState(0);

  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const [errorText, setErrorText] = useState({
    // order_date: null,
    // estimate_delivery_date: null,
  });

  const [openAmountDlg, setOpenAmountDlg] = useState("");
  const [openAmountTmpDlg, setOpenAmountTmpDlg] = useState("none");

  const getDesc = () => {
    if (document.getElementById("file_description").value != null) {
      setFileUpload({
        ...fileUpload,
        file_description: document.getElementById("file_description").value,
      });
    }
  };

  const sendFile = (id) => {
    insertFilePaymentApi(id, fileUpload).then((res) => {
      paymentSwr.mutate();
      // setFileList(res.payment_files);
      setFileUpload({
        file_id: null,
        file_description: null,
        link: null,
        attachment: null,
        content_type: null,
      });
      document.getElementById("file_description").value = "";
    });
  };
  //set param
  let param = { limit: 999 };
  var quoteSwr = getListQuoteStatusAccSwr(1);

  const paymentSwr = getDetailPaymentSwr(router.query.id);
  const invPaymentSwr = getListInvPaymentSwr(router.query.id);
  const downloadFile = async (id, file_id) => {
    try {
      var response = await getFilePaymentApi(id, file_id);
      if (response.status == 200) {
        var reader = response.body.getReader();
        var contenttype = response.headers.get("Content-Type");
        var chunks = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          chunks.push(value);
        }
        var content = new Blob(chunks, { type: contenttype });
        var url = window.URL.createObjectURL(content);
        var tmpLink = document.createElement("a");
        tmpLink.href = url;
        tmpLink.setAttribute("target", "_blank");
        tmpLink.click();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onUploaded = (res) => {
    if (res != null) {
      setFileUpload({
        ...fileUpload,
        file_description: document.getElementById("file_description").value,
        link: res.link,
        attachment: res.file_name,
        content_type: res.content_type,
        deleted_at: null,
      });
      fileListData.push({
        file_id: "",
        file_description: document.getElementById("file_description").value,
        link: res.link,
        attachment: res.attachment,
        content_type: res.content_type,
      });
    }
  };
  function checkValidation() {
    var isValid = true;

    return isValid;
  }
  const showEditAmount = () => {
    setOpenAmountDlg("none");
    setOpenAmountTmpDlg("");
  };

  const updateData = (id) => {
    alert(JSON.stringify(formState));
    // updatePaymentApi(id, formState).then((res) => {
    //   alert(JSON.stringify(res));
    // });
  };
  //useEffect
  useEffect(async () => {
    var dataSub = await getListSubAccStatusApi(statusSub);
    setAccSubBank(dataSub);
  }, [statusSub]);

  useEffect(() => {
    setFormState(paymentSwr?.data);
    setPayType(paymentSwr?.data?.payment_type);
    setPayMethod(paymentSwr?.data?.payment_method);
    setSubAcc(paymentSwr?.data?.subsidiary_account);
    setStatusSub(paymentSwr?.data?.payment_method);
    setProjectCode(paymentSwr?.data?.project_code);
    setFileList(paymentSwr?.data?.payment_files);
  }, [paymentSwr]);

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
    var list = [];
    quoteList.map((item, i) => {
      list.push({
        id: item.id + "|" + item.project_code + "|" + item.customer_id,
        label: item.project_code + " " + item.name,
      });
    });
    setOptionQuoteList(list);
  }, [quoteList]);

  //function
  function onChangeDateInput(e) {
    if (e.target.name != "") {
      setFormState({
        ...formState,
        [e.target.name]: moment(e.target.value).toDate(),
      });
    }
    setOpenAlert(false);
  }
  function onChangeInput(e) {
    if (e.target.name != "") {
      setFormState({
        ...formState,
        [e.target.name]: e.target.value,
      });
    }
    setOpenAlert(false);
  }

  function onInputDetailTmpChange(e) {
    var val = numberConvert(e.target.value);
    setFormState({
      ...formState,
      [e.target.name]: Number(val),
    });
  }
  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }
  function getCashBank(e) {
    setStatusSub(e.target.value);
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <BaseLayout title="Create Receive Payment">
      <div className={classes.root}>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Typography variant="subtitle1">Create Receive Payment</Typography>
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
                onClick={(e) => openPage(e, getRoute("payment"))}
              >
                <Icon style={{ fontSize: 20, color: "#999" }}>home</Icon>
              </Button>
              <Button
                variant="contained"
                color="default"
                onClick={(e) => openPage(e, getRoute("payment-input"))}
              >
                <Icon style={{ fontSize: 20, color: "yellow" }}>payment</Icon>
                Add Payment
              </Button>
              <Button
                onClick={(e) => openPage(e, getRoute("payment-transaction"))}
                variant="contained"
                color="default"
              >
                <CompareArrowsIcon style={{ fontSize: 20 }} />
                Payment Transaction
              </Button>

              <Button
                onClick={(e) => openPage(e, getRoute("payment-compare"))}
                variant="contained"
                color="default"
              >
                <Compare style={{ fontSize: 20 }} />
                Payment Compare with Invoice
              </Button>
            </div>
          </Box>
        </Box>

        <Paper className={classes.paper}>
          <Box container spacing={2}>
            <Box item>
              <ButtonBase>
                <Icon style={{ fontSize: 30, color: "#5d6d7e" }}>
                  peoplealt
                </Icon>
              </ButtonBase>{" "}
            </Box>
            <Box item xs={12} sm container>
              <Box item xs container direction="column" spacing={2}>
                <Box item xs>
                  <Typography gutterBottom variant="subtitle1">
                    Receive payment
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
                      Payment Date
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.labelbase}>
                      Payment Method
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <OutlinedInput
                      id="payment_date"
                      className={classes.inputbase}
                      name="payment_date"
                      type="date"
                      value={moment(paymentSwr?.data?.payment_date).format(
                        "YYYY-MM-DD"
                      )}
                      error={errorText.payment_date}
                      helperText={errorText.payment_date}
                      onChange={onChangeDateInput}
                      fullWidth
                    ></OutlinedInput>
                  </Grid>
                  <Grid item xs={6}>
                    <Select
                      id="payment_method"
                      name="payment_method"
                      labelId="demo-simple-select-label"
                      fullWidth
                      value={payMethod}
                      onClick={getCashBank}
                    >
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="bank">Bank</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box container spacing={2}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Payment Type</FormLabel>
                      <RadioGroup
                        row
                        aria-label="gender"
                        id="payment_type"
                        name="payment_type"
                        disabled
                        value={payType}
                      >
                        <FormControlLabel
                          value="in"
                          control={<Radio />}
                          label="Payment In"
                        />
                        <FormControlLabel
                          value="out"
                          control={<Radio />}
                          label="Payment Out"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.labelbase}>
                      Subsidiary Account
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    &nbsp;
                  </Grid>
                  <Grid item xs={6}>
                    <Select
                      id="subsidiary_account"
                      name="subsidiary_account"
                      labelId="demo-simple-select-label"
                      onChange={onChangeInput}
                      value={subAcc}
                      fullWidth
                    >
                      {accSubBank?.result?.map((row, key) => (
                        <MenuItem value={row?.subsidiary_code}>
                          {row?.subsidiary_code}
                          {"  "}
                          {row?.subsidiary_description}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>

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
                    value={paymentSwr?.data?.project_name}
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
                <Grid item xs={3}>
                  <OutlinedInput
                    id="project_code_text"
                    readOnly={true}
                    value={paymentSwr?.data?.project_code}
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
                    value={moment(paymentSwr?.data?.quote?.quote_date).format(
                      "L"
                    )}
                    className={classes.inputbasero}
                    name="quote_date"
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography className={classes.labelbase}>
                    Income Type
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <OutlinedInput
                    id="income_type"
                    readOnly={true}
                    className={classes.inputbasero}
                    value={paymentSwr?.data?.quote?.income_type}
                    name="income_type"
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography className={classes.labelbase}>
                    Customer Name
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.labelbase}>
                    Company Name
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.labelbase}>Email</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <OutlinedInput
                    id="customer_name"
                    readOnly={readOnly}
                    // className={classes.inputbasero}
                    className={readOnlyStyle}
                    name="customer_name"
                    value={paymentSwr?.data?.customer_name}
                    type="text"
                    onChange={onChangeInput}
                    fullWidth
                  ></OutlinedInput>
                </Grid>

                <Grid item xs={4}>
                  <OutlinedInput
                    id="customer_company_name"
                    readOnly={readOnly}
                    // className={classes.inputbasero}
                    className={readOnlyStyle}
                    name="customer_company_name"
                    value={paymentSwr?.data?.customer_company_name}
                    onChange={onChangeInput}
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>

                <Grid item xs={4}>
                  <OutlinedInput
                    id="customer_email"
                    readOnly={readOnly}
                    className={readOnlyStyle}
                    name="customer_email"
                    value={paymentSwr?.data?.customer_email}
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
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <Typography className={classes.labelbase}>Sales</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography className={classes.labelbase}>
                    Sales Email
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box item xs={10}>
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <OutlinedInput
                    readOnly={readOnly}
                    className={readOnlyStyle}
                    id="sales_name"
                    name="sales_name"
                    value={paymentSwr?.data?.sales_name}
                    onChange={onChangeInput}
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
                <Grid item xs={3}>
                  <OutlinedInput
                    readOnly={readOnly}
                    className={readOnlyStyle}
                    id="sales_email"
                    onChange={onChangeInput}
                    value={paymentSwr?.data?.sales_email}
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
                Payment Description
              </Typography>
            </Box>
            <Box item xs={10}>
              <OutlinedInput
                className={classes.inputbasemultiline}
                rowsMax={5}
                multiline
                defaultValue={paymentSwr?.data?.payment_description}
                name="payment_description"
                id="payment_description"
                onChange={onChangeInput}
                type="textarea"
                fullWidth
              ></OutlinedInput>
            </Box>
          </Box>

          <Box container spacing={2}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>
                Payment Amount
              </Typography>
            </Box>
            <Box item xs={10}>
              <span>
                {/* <NumberFormat
                  style={{ display: openAmountDlg }}
                  name="payment_amount"
                  id="payment_amount"
                  value={formState?.payment_amount}
                  customInput={TextField}
                  thousandSeparator={thousand}
                  decimalSeparator={decimal}
                  scale={scale}
                  prefix={prefix}
                  inputmode="text"
                  variant="outlined"
                  onBlur={onInputDetailTmpChange}
                /> */}
                <TextField
                  defaultValue={paymentSwr?.data?.payment_amount}
                  variant="outlined"
                  name="payment_amount"
                  id="payment_amount"
                  onChange={onInputDetailTmpChange}
                  type="number"
                  fullWidth
                ></TextField>

                {/* <NumberFormat
                  style={{ display: openAmountTmpDlg }}
                  customInput={TextField}
                  thousandSeparator={thousand}
                  decimalSeparator={decimal}
                  scale={scale}
                  prefix={prefix}
                  inputmode="text"
                  variant="outlined"
                  onChange={onInputDetailTmpChange}
                /> */}
              </span>
              {/* <span>
                <IconButton>
                  <Edit onClick={() => showEditAmount()} />
                </IconButton>
              </span> */}
            </Box>
          </Box>
          <Box container spacing={2} className="mt-3">
            <Box item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => updateData(paymentSwr?.data?.id)}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper className={classes.paper}>
          <Box>
            <Grid
              container
              spacing={2}
              justify="center"
              alignItems="center"
              className={classes.root}
            >
              <Grid item xs={6} sm={6}>
                <TextField
                  name="file_description"
                  id="file_description"
                  label="Note"
                  variant="outlined"
                  // defaultValue={data.message}
                  // value={data.message}
                  required
                  error={errorText.message}
                  helperText={errorText.message}
                  // onChange={onInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={5} sm={5}>
                <FileUploadSecureComponent
                  id="image"
                  path="finance_payment"
                  fileUploaded={(res) => onUploaded(res)}
                  url={fileUpload.link}
                  deleteFile={() => onUploaded(null)}
                />
              </Grid>
              <Grid item xs={1} sm={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  onMouseEnter={() => getDesc()}
                  onFocus={() => getDesc()}
                  onClick={() => sendFile(paymentSwr?.data?.id)}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box className="mb-3">
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="Item Description">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">No</TableCell>
                    <TableCell align="left">File Description</TableCell>
                    <TableCell align="left">File Name</TableCell>
                    <TableCell align="left">Upload Date</TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fileList != null &&
                    fileList?.map((row, key) => (
                      <TableRow hover>
                        <TableCell key={row.file_id} align="left">
                          {key + 1}
                        </TableCell>
                        <TableCell key={row.file_id} align="left">
                          {row.file_description}
                        </TableCell>
                        <TableCell key={row.file_id} align="left">
                          {row.attachment} {row.uom}
                        </TableCell>
                        <TableCell key={row.file_id} align="left">
                          {dateTimeFormat(row.send_date)}
                        </TableCell>

                        <TableCell>
                          {row.thumbnail != null && (
                            <Box>
                              <Link
                                onClick={() =>
                                  downloadFile(
                                    paymentSwr?.data?.id,
                                    row.file_id
                                  )
                                }
                              >
                                <Typography
                                  variant="h5"
                                  component="h5"
                                  style={{ wordWrap: "anywhere" }}
                                >
                                  {row.attachment}
                                </Typography>
                              </Link>
                            </Box>
                          )}
                        </TableCell>
                        <TableCell key={row.file_id} align="left">
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onMouseEnter={() => getFileDelete()}
                            onClick={() => deleteFile(paymentSwr?.data?.id)}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
        {/* <AlertDialog
          open={openAmountDlg}
          cancelAction={() => setOpenAmountDlg(false)}
          okAction={() => updateAmount()}
          title="Delete confirmation"
          body="Are you sure want to delete this design?"
        >
         
        </AlertDialog> */}
      </div>
    </BaseLayout>
  );
}
