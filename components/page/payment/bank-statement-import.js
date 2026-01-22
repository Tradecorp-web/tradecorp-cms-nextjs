import BaseLayout from "../../base_layout/base-layout-sidemenu-accounting";

import {
  Icon,
  Divider,
  Button,
  TextField,
  OutlinedInput,
  Card,
  CardHeader,
  Box,
  ButtonGroup,
  Tooltip,
  Collapse,
  IconButton,
  InputLabel,
  Grid,
  Breadcrumbs,
  Link,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Select,
  MenuItem,
  TableFooter,
} from "@material-ui/core";
import readXlsxFile from "read-excel-file";
import React, { Component, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import WarningDialog from "../../base_component/warning-dialog";
import { Delete, RoomServiceTwoTone, SkipNext } from "@material-ui/icons";

import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import moment from "moment";

import AlertDialog from "../../../components/base_component/dialog";

import { currency } from "../../../helpers/general";

import { getListSubAccStatusApi } from "../../../services/api/acc-sub.api";

import { getRefBankSetupDetailApi } from "../../../services/api/ref-bank-setup.api";

import {
  insertPaymentApi,
  getListByBankName,
  deletePaymentApi,
  getListByBankPeriod,
} from "../../../services/api/payment.api";
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
  titlebase: {
    marginTop: 10,
    fontSize: "1.25rem",
    color: "#656565",
  },
  titlewarn: {
    marginTop: 10,
    fontSize: "0.9rem",
    color: "#eb1c05",
  },
  titlebasebold: {
    marginTop: 10,
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#656565",
  },
  subtitlebase: {
    marginTop: 10,
    fontSize: "1rem",
    color: "#656565",
  },
  subtitlebasebold: {
    marginTop: 10,
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#656565",
  },
  descriptionbase: {
    marginTop: 10,
    fontStyle: "italic",
    fontSize: ".8rem",
    color: "#656565",
  },
  labelbase: {
    marginTop: 10,
    fontSize: "1rem",
    color: "#656565",
  },
  labelbasebold: {
    marginTop: 10,
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#656565",
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
  titlecard: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000",
  },
}));

export default function Page() {
  var id = "1";
  //const
  const classes = useStyles();
  const router = useRouter();

  const [progress, setProgress] = React.useState(0);

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(null);
  // const [company, setCompany] = useState(null);
  // const [userId, setUserId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState([
    {
      id: null,
      tanggal: null,
      keterangan: null,
      kodetrx: null,
      bank_acc_sub: null,
      debit: null,
      credit: null,
      validation: false,
    },
  ]);
  const [fileType, setFileType] = React.useState("xlsx");
  const [csvArray, setCsvArray] = useState([]);

  const [accBank, setAccBank] = useState(false);
  const [accSub, setAccSub] = useState(false);
  const [accId, setAccId] = useState(false);

  const [msgSave, setMsgSave] = useState(false);
  const [bankValid, setBankValid] = useState(false);
  const [bankDisabled, setBankDisabled] = useState(true);

  const [accSubBank, setAccSubBank] = useState(false);

  const [checked, setChecked] = React.useState(true);
  const [dataDbBank, setDataDbBank] = React.useState([]);
  const [idPayment, setIdPayment] = React.useState([]);
  const [month, setMonth] = React.useState([]);
  const [year, setYear] = React.useState([]);
  const [period, setPeriod] = React.useState([]);
  const [hiddenVal, setHiddenVal] = React.useState(true);
  const [messageData, setMessageData] = useState("");
  const [refBankSetupId, setRefBankSetupId] = useState(false);
  const [refBankSetupCode, setRefBankSetupCode] = useState(false);
  const [refBankSetup, setRefBankSetup] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [isWarnBankOpen, setIsWarnBankOpen] = useState(false);
  const [isSuccSaveOpen, setIsSuccSaveOpen] = useState(false);
  const [isWarnAccValidOpen, setIsWarnAccValidOpen] = useState(false);
  const [statusData, setStatusData] = useState(false);

  //set param
  let param = { limit: 999 };
  //const

  const getMonth = () => {
    var vMonth = [];
    var i = 1;
    for (i = 1; i <= 12; i++) {
      vMonth.push({ monthId: i, monthName: moment(i, "MM").format("MMMM") });
    }
    setMonth({ ...month, vMonth });
  };

  const getYear = () => {
    var vYear = [];
    var ii = new Date().getFullYear() - 1;
    for (var i = ii; i <= ii + 1; i++) {
      vYear.push({ year: i });
    }
    setYear({ vYear });
  };

  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
  };
  const onChangePeriod = (event) => {
    setPeriod({ ...period, [event.target.name]: event.target.value });
    cekPeriod();
  };
  const handleValidChange = (event) => {
    var check = false;
    if (event.target.checked) {
      check = true;
    }
    const newState = data.map((obj) => {
      if (obj.id === event.target.value) {
        return { ...obj, validation: check };
      }
      return obj;
    });
    setData(newState);
  };

  const maxDate = (listData) =>
    new Date(
      Math.max(
        ...listData.map((element) => {
          return new Date(element.tanggal);
        })
      )
    );
  const minDate = (listData) =>
    new Date(
      Math.min(
        ...listData.map((element) => {
          return new Date(element.tanggal);
        })
      )
    );

  const cekBank = () => {
    if (!accId) {
      setIsWarnBankOpen(true);
      return;
    } else {
      document.getElementById(id).click();
    }
  };
  const removeDb = async (id) => {
    setOpenDialog(true);
    setIdPayment(id);
  };
  const cekPeriod = () => {
    setOpen(true);
    setMessageData("");
    setHiddenVal(true);
    // if (period.monthSelect != "undefined" && period.yearSelect != "undefined") {
    //   setBankDisabled(false);
    // } else {
    //   setBankDisabled(true);
    // }

    setBankDisabled(true);
    setOpen(false);
  };
  const importDBParsial = (key) => {
    setOpen(true);
    var payType = data[key].credit > 0 ? "in" : "out";
    var val = data[key].credit > 0 ? data[key].credit : data[key].debit;
    var dataTmp = {
      payment_method: "bank",
      subsidiary_id: accId,
      subsidiary_account: accSub,
      payment_description: data[key].keterangan,
      payment_amount: val,
      status_acc: 0,
      payment_type: payType,
      payment_trx_code: data[key].kodetrx,
      payment_date: data[key].tanggal + "T15:04:05Z",
      payment_currency: "Rp.",
      debit_account: data[key].debit,
      credit_account: data[key].credit,
    };
    insertPaymentApi(dataTmp, 0).then((res) => {
      setIdPayment(res.id);
    });
    data[key].status = 0;
    refreshData(data, refBankSetupCode);
    setOpen(true);
  };

  const handleChange = (event) => {
    const input = event.target;
    var file = input.files[0];
    var textType = /text.*/;
    var data2 = [];

    readXlsxFile(input.files[0]).then((rows) => {
      setMessageData("");
      var header = !checked;
      var no = 0;
      var noStart = 0;
      var debit = 0,
        credit = 0;
      // var monthTmp = period.monthSelect.toString();
      // if (monthTmp.length == 1) {
      //   monthTmp = "0" + monthTmp;
      // }
      var norek = "";
      // var periodTmp = period.yearSelect.toString() + monthTmp;

      rows.map((row) => {
        noStart++;
        if (noStart == 1) {
          norek = row[1];
        }
        setHiddenVal(false);
        // const date = new Date(row[refBankSetup.col_trx_date - 1]);
        // if (moment(date).format("YYYYMM") == periodTmp && header) {
        if (noStart >= refBankSetup.row_start) {
          if (refBankSetup.one_column_value) {
            debit =
              row[refBankSetup.col_cr_indicator - 1] == "DR"
                ? row[refBankSetup.col_value - 1]
                : 0;
            credit =
              row[refBankSetup.col_cr_indicator - 1] == "CR"
                ? row[refBankSetup.col_value - 1]
                : 0;
          } else {
            debit = row[refBankSetup.col_debit - 1];
            credit = row[refBankSetup.col_credit - 1];
          }
          no++;

          data2.push({
            no: no,
            id: uuid(),
            tanggal: row[refBankSetup.col_trx_date - 1],
            keterangan: row[refBankSetup.col_description - 1],
            kodetrx: row[refBankSetup.col_trx_code - 1],
            bank_acc_sub: accSub,
            bank_acc_id: accId,
            debit: debit,
            credit: credit,
            status: 1,
            validation: false,
          });
        }
        // }

        if (!header) {
          data2.pop();
          header = true;
        }
      });
      //minDate(data2));
      refreshData(data2, norek);
      if (no == 0) {
        setMessageData("Empty data");
      }
    });
    // }
  };
  const refreshData = (data2, norek) => {
    var dataFound = [];

    var dataBankPeriod = getListByBankPeriod(
      norek,
      moment(minDate(data2)).format("YYYY-MM-DD"),
      moment(maxDate(data2)).format("YYYY-MM-DD")
    ).then((res) => {
      res?.result?.map((dataDb) => {
        data2?.map((resData) => {
          if (
            moment(resData.tanggal).format("YYYY-MM-DD") ==
              moment(dataDb.payment_date).format("YYYY-MM-DD") &&
            resData.keterangan == dataDb.payment_description &&
            resData.subsidiary_account == dataDb.refBankSetupCode &&
            (resData.debit == dataDb.payment_amount ||
              resData.credit == dataDb.payment_amount) &&
            resData.subsidiary_account == dataDb.refBankSetupCode
          ) {
            dataFound.push(resData.no);
          }
        });
      });
      if (norek != refBankSetupCode || norek == "") {
        setIsWarnAccValidOpen(true);
      } else {
        dataFound?.map((res) => {
          var objIndex = data2.findIndex((obj) => obj.no == res);
          data2[objIndex].status = 0;
        });
        setData(data2);
      }
    });
  };
  const processCSV = (str, delim = ",") => {
    const headers = str.slice(0, str.indexOf("\n")).split(delim);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const newArray = rows.map((row) => {
      const values = row.split(delim);
      const eachObject = headers.reduce((obj, header, i) => {
        obj[header] = values[i];
        return obj;
      }, {});
      return eachObject;
    });
    alert(JSON.stringify(newArray));
    setData(newArray);
  };

  useEffect(async () => {
    var dataSub = await getListSubAccStatusApi("bank");
    var tmp = [];
    dataSub?.result?.map((row) => {
      tmp.push({
        id: row.id,
        acc_id: row.id + "|" + row.subsidiary_code,
        subsidiary_code: row.subsidiary_code,
        subsidiary_description: row.subsidiary_description,
      });
    });
    setAccSubBank({ result: tmp });
    getMonth();
    getYear();
  }, []);

  useEffect(() => {
    getDataBank();
    getBankSetup(accId);
  }, [accId]);
  useEffect(() => {
    getDataBank();
  }, [idPayment]);

  const getBankSetup = async (acc_id) => {
    var tmp = [];
    var dataBankSetup = await getRefBankSetupDetailApi(acc_id);
    setRefBankSetup(dataBankSetup);
    setRefBankSetupId(dataBankSetup?.id);
    setRefBankSetupCode(dataBankSetup?.subaccbanksetup?.subsidiary_code);
  };

  const getDataBank = async () => {
    try {
      setOpen(true);
      var data = await getListByBankName(accId, "0");
      // setRowCount(data.total);
      setDataDbBank(data);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };
  const deletePayment = async () => {
    try {
      setOpen(true);
      var data = await deletePaymentApi(idPayment).then((res) => {
        setIdPayment("=");
        setOpenDialog(false);
      });

      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }
  function onChangeInput(e) {
    var data = e.target.value.split("|");

    setAccBank(data[1]);
    setAccId(data[0]);
    setAccSub(data[1]);
    setMessageData("");

    setData([]);
  }

  return (
    <BaseLayout title="Payment Transaction">
      <div className={classes.root}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link color="inherit" href="/payment">
            Payment Home
          </Link>
          <Link color="inherit" href="/payment/payment-transaction">
            Payment List
          </Link>
          <Typography color="textPrimary">Bank Statement Import</Typography>
        </Breadcrumbs>
      </div>
      <Paper className={classes.paper}>
        <Box container spacing={2}>
          <Grid container spacing={2}>
            <Grid item lg={6}>
              <span className={classes.titlebase}>Upload Bank Statement</span>
            </Grid>

            {/* <Grid item lg={6}>
              <span>
                <Typography align="left" className="mt-0">
                  Period
                </Typography>
              </span>
              <span>
                <Select
                  id="monthSelect"
                  name="monthSelect"
                  variant="outlined"
                  labelId="demo-simple-select-label"
                  onChange={onChangePeriod}
                >
                  {month?.vMonth?.map((row, key) => (
                    <MenuItem value={row?.monthId}>{row?.monthName}</MenuItem>
                  ))}
                </Select>
              </span>{" "}
              <span>
                <Select
                  id="yearSelect"
                  name="yearSelect"
                  variant="outlined"
                  labelId="demo-simple-select-label"
                  onChange={onChangePeriod}
                >
                  {year?.vYear?.map((row, key) => (
                    <MenuItem value={row?.year}>{row?.year}</MenuItem>
                  ))}
                </Select>
              </span>
            </Grid> */}
          </Grid>
          <Grid container spacing={2}>
            <Grid item lg={6}>
              {/* <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleCheckChange}
                      name="checkedA"
                      color="primary"
                    />
                  }
                  label="File excel with Header"
                />
              </FormGroup> */}
            </Grid>
            <Grid item lg={6}>
              <Typography align="left" className="mt-0">
                Bank Name
                {/* <span className={classes.descriptionbase}>
                  Choose a period before specifying a bank name
                </span> */}
              </Typography>
              <Select
                id="subsidiary_account"
                name="subsidiary_account"
                variant="outlined"
                // disabled={bankDisabled}
                labelId="demo-simple-select-label"
                onChange={onChangeInput}
                fullWidth
              >
                {accSubBank?.result?.map((row, key) => (
                  <MenuItem value={row?.acc_id}>
                    {row?.subsidiary_description}
                    {"  "}
                    {row?.subsidiary_code}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item lg={12}>
              <span className={classes.descriptionbase}>
                Choose .xlsx file for upload bank statement
              </span>
              <Typography align="right" className="mt-0">
                <Button
                  variant="contained"
                  color="secondary"
                  // onClick={() => document.getElementById(id).click()}
                  onClick={cekBank}
                  disableElevation
                >
                  Get File for Import Bank Statement
                </Button>
              </Typography>
              <InputBase
                onChange={handleChange}
                style={{ display: "none" }}
                id={id}
                type="file"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Paper className={classes.paper} hidden={hiddenVal}>
        <span className={classes.titlebase}>
          Result of temporary data from import excel process
        </span>

        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="left">Remark</TableCell>
                <TableCell align="left">Trx Code</TableCell>
                <TableCell align="right">Debet</TableCell>
                <TableCell align="right">Credit</TableCell>
                <TableCell align="center">Migrate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data != null &&
                data.map((row, key) => (
                  <TableRow key={row.id}>
                    <TableCell
                      width={5}
                      component="th"
                      align="center"
                      scope="row"
                    >
                      {row.no}
                    </TableCell>
                    <TableCell
                      width={15}
                      component="th"
                      align="center"
                      scope="row"
                    >
                      {moment(row.tanggal).format("L")}
                    </TableCell>

                    <TableCell width={20} align="left">
                      {row.keterangan}
                    </TableCell>
                    <TableCell width={30} align="left">
                      {row.kodetrx}
                    </TableCell>
                    <TableCell width={30} align="right">
                      {currency(row.debit)}
                    </TableCell>
                    <TableCell width={10} align="right">
                      {currency(row.credit)}
                    </TableCell>
                    <TableCell width={5} align="center">
                      {" "}
                      {moment(row.tanggal).format("L") != "Invalid date" && (
                        // <Checkbox
                        //   onClick={handleValidChange}
                        //   value={row.id}
                        //   name="validation"
                        //   color="primary"
                        // />
                        <Button
                          disabled={row.status == 1 ? false : true}
                          variant="contained"
                          color="primary"
                          onClick={() => importDBParsial(key)}
                          // onClick={importToDB(0)}
                          disableElevation
                        >
                          Save to database
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              <TableRow>
                <TableCell colSpan={6} align="left">
                  <span className={classes.titlewarn}> {messageData}</span>
                </TableCell>
                <TableCell align="right">
                  {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={() => importToDB()}
                    // onClick={importToDB(0)}
                    disableElevation
                  >
                    Save to database
                  </Button> */}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper className={classes.paper}>
        <Typography style={{ textAlign: "left" }}>
          <span className={classes.titlebase}>
            Transaction in Bank Database
          </span>
        </Typography>
        <Typography style={{ textAlign: "right" }}>
          <Button
            variant="outlined"
            onClick={(e) => openPage(e, getRoute("payment-compare"))}
            disableElevation
          >
            Payment Compare
          </Button>
        </Typography>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="left">Payment Code</TableCell>
                <TableCell align="left">Remark</TableCell>
                <TableCell align="left">Trx Code</TableCell>
                <TableCell align="right">Debet</TableCell>
                <TableCell align="right">Credit</TableCell>
                <TableCell align="center">Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataDbBank != null &&
                dataDbBank?.result?.map((row, key) => (
                  <TableRow key={row.id}>
                    <TableCell
                      width={5}
                      component="th"
                      align="center"
                      scope="row"
                    >
                      {key + 1}
                    </TableCell>
                    <TableCell
                      width={15}
                      component="th"
                      align="center"
                      scope="row"
                    >
                      {moment(row.payment_date).format("L")}
                    </TableCell>
                    <TableCell width={30} align="center">
                      {row.payment_code}
                    </TableCell>
                    <TableCell width={20} align="left">
                      {row.payment_description}
                    </TableCell>
                    <TableCell width={30} align="left">
                      {row.payment_trx_code}
                    </TableCell>

                    <TableCell width={30} align="right">
                      {currency(row.debit_account)}
                    </TableCell>
                    <TableCell width={10} align="right">
                      {currency(row.credit_account)}
                    </TableCell>
                    <TableCell width={5} align="center">
                      {" "}
                      <Button
                        variant="outlined"
                        onClick={() => removeDb(row.id)}
                        // onClick={importToDB(0)}
                        disableElevation
                      >
                        <Icon style={{ fontSize: 20, color: "red" }}>
                          delete
                        </Icon>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableRow>
              <TableCell colSpan={6}>
                <span className={classes.descriptionbase}>
                  The data displayed is data that has not been validated
                </span>
              </TableCell>
            </TableRow>
          </Table>
        </TableContainer>
      </Paper>
      <WarningDialog
        title="Bank Confirmation"
        body={`Account Number not valid`}
        open={isWarnAccValidOpen}
        cancelAction={() => setIsWarnAccValidOpen(false)}
      />
      <WarningDialog
        title="Bank Confirmation"
        body={`Bank name not selected`}
        open={isWarnBankOpen}
        cancelAction={() => setIsWarnBankOpen(false)}
      />
      <WarningDialog
        title="Bank Confirmation"
        body={msgSave}
        open={isSuccSaveOpen}
        cancelAction={() => setIsSuccSaveOpen(false)}
      />
      <AlertDialog
        open={openDialog}
        cancelAction={() => setOpenDialog(false)}
        okAction={() => deletePayment()}
        title="Delete confirmation"
        body="Are you sure want to delete this transaction?"
      />
    </BaseLayout>
  );
}
/**
 * "payment_method" : "bank",
    "payment_description" : "gdgdf",
    "payment_amount" : 11111.0,
    "status_acc" : 0,
    "payment_type" : "in",
    "payment_date" : ISODate("2022-08-02T17:00:00.000Z"),
    "payment_currency" : "Rp.",
    "subsidiary_account" : "BCA.0001",
    "debit_account" : 11111.0,
    "credit_account" : 0.0,
 */
