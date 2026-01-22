import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Grid,
  Icon,
  Box,
  Button,
  ButtonGroup,
  Link,
  Paper,
  Typography,
  makeStyles,
  TextField,
} from "@material-ui/core";

import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState } from "react";
import AccountingBaseLayout from "../../../../base_layout/base-layout-accounting";

import { getListCoaSwr } from "../../../../../services/swr/coa.swr";
import { getMonth } from "../../helper/acc-helper";
import { showYear, showMonth } from "../../helper/acc-helper";

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
}));

export default function Page(props) {
  const [coaList, setCoaList] = useState([]);
  const [optionCoa, setOptionCoa] = useState([]);
  const [selectedCoa, setSelectedCoa] = useState([]);
  const [optionPeriodMonth, setOptionPeriodMonth] = useState([]);
  const [optionPeriodYear, setOptionPeriodYear] = useState([]);
  const [errorText, setErrorText] = useState({});
  const [data, setData] = useState({
    id: null,
    coa_code: null,
    coa_name: null,
    coa_type: null,
    coa_parent: null,
    coa_description: null,
  });

  //select period
  useEffect(() => {
    var list = [];
    list.push({ id: "", label: "" });
    var data = showMonth();
    data.map((item, i) => {
      list.push({ id: i + 1, label: item });
    });
    setOptionPeriodMonth(list);
  }, [data]);

  useEffect(() => {
    var list = [];
    list.push({ id: "", label: "" });
    var data = showYear();
    data.map((item, i) => {
      list.push({ id: item, label: item });
    });
    setOptionPeriodYear(list);
  }, [data]);
  //==select period
  //get coa
  const onCoaChange = (event, value, extra) => {
    if (value != null) {
      var objekval = Object.values(value);
      var coa_code = objekval[1].split("-");
      data.coa = coa_code[0].trim();
      setSelectedCoa({
        id: objekval[0],
        label: objekval[1],
      });
    } else {
      data.coa = "";
      setSelectedCoa({
        id: "",
        label: "",
      });
    }
  };

  let param = { limit: 999 };
  var coaSwr = getListCoaSwr(param);
  useEffect(() => {
    if (coaSwr?.data) {
      setCoaList(coaSwr?.data.result ?? []);
    }
  }, [coaSwr]);
  useEffect(() => {
    var list = [];
    list.push({ id: "", label: "" });
    coaList.map((item, i) => {
      list.push({ id: item.id, label: item.coa_code + " - " + item.coa_name });
    });
    setOptionCoa(list);
  }, [coaList]);
  const onMonthChange = (event, value, extra) => {
    if (value != null) {
      var objekval = Object.values(value);
      data.acc_period_month = objekval[0];
    } else {
      data.acc_period_month = "";
    }
  };
  const onYearChange = (event, value, extra) => {
    if (value != null) {
      var objekval = Object.values(value);
      data.acc_period_year = objekval[0];
    } else {
      data.acc_period_year = "";
    }
  };
  //==get coa
  const classes = useStyles();
  var period =
    getMonth(localStorage.getItem("lsMonth")) +
    "  " +
    localStorage.getItem("lsYear");
  let period_acc = "General Ledger";
  return (
    <AccountingBaseLayout title="Accounting">
      <div className="p-5 content-wrapper">
        <Grid
          container
          className="page-container"
          alignItems="center"
          justify="center"
        >
          <Grid item lg={12}>
            <Card className="{classes.root}">
              <CardHeader
                title="General Ledger"
                subheader={period_acc}
              ></CardHeader>
              <CardContent>
                <TableContainer component={Card}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <div style={{ textAlign: "left" }}>Period </div>
                        </TableCell>
                        <TableCell colSpan={2}>
                          <div style={{ textAlign: "left" }}>
                            <Autocomplete
                              size="small"
                              options={optionPeriodMonth}
                              autoHighlight
                              // value={selectedCoaType}
                              onChange={(e, v) => onMonthChange(e, v, true)}
                              getOptionLabel={(option) => option?.label}
                              // renderOption={(option) => (
                              //   <React.Fragment>{option?.label}</React.Fragment>
                              // )}

                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  name="acc_period_month"
                                  label="Month"
                                  variant="outlined"
                                  error={errorText.acc_period_month}
                                  helperText={errorText.acc_period_month}
                                  fullWidth
                                />
                              )}
                            />
                          </div>
                        </TableCell>
                        <TableCell colSpan={2}>
                          <div style={{ textAlign: "left" }}>
                            <Autocomplete
                              size="small"
                              options={optionPeriodYear}
                              autoHighlight
                              // value={selectedCoaType}
                              onChange={(e, v) => onYearChange(e, v, true)}
                              getOptionLabel={(option) => option?.label}
                              // renderOption={(option) => (
                              //   <React.Fragment>{option?.label}</React.Fragment>
                              // )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  name="acc_period_year"
                                  label="Year"
                                  variant="outlined"
                                  error={errorText.acc_period_year}
                                  helperText={errorText.acc_period_year}
                                  fullWidth
                                />
                              )}
                            />
                          </div>
                        </TableCell>
                        <TableCell colSpan={2}></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <div style={{ textAlign: "left" }}>
                            Chart of Account
                          </div>
                        </TableCell>
                        <TableCell colSpan={4}>
                          <div style={{ textAlign: "left" }}>
                            <Autocomplete
                              size="small"
                              options={optionCoa}
                              autoHighlight
                              value={selectedCoa}
                              onChange={(e, v) => onCoaChange(e, v, true)}
                              getOptionLabel={(option) => option?.label}
                              renderOption={(option) => (
                                <React.Fragment>{option?.label}</React.Fragment>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  name="coa"
                                  label="Coa"
                                  variant="outlined"
                                  error={errorText.coa}
                                  helperText={errorText.coa}
                                  fullWidth
                                />
                              )}
                            />
                          </div>
                        </TableCell>{" "}
                        <TableCell colSpan={1}>
                          <div style={{ textAlign: "left" }}>
                            <Button
                              variant="contained"
                              color="secondary"
                              fullWidth
                              disableElevation
                              // onClick={(e) =>
                              //   openPage(
                              //     e,
                              //     getRoute("accounting.transaction-landing")
                              //   )
                              // }
                            >
                              View
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell colSpan={1}>
                          <div style={{ textAlign: "left" }}>
                            <Button
                              variant="outlined"
                              color="default"
                              fullWidth
                              disableElevation
                              // onClick={(e) =>
                              //   openPage(
                              //     e,
                              //     getRoute("accounting.transaction-landing")
                              //   )
                              // }
                            >
                              <Icon>print</Icon>Print
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <div style={{ textAlign: "center" }}>No</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ textAlign: "center" }}>Date</div>
                        </TableCell>

                        <TableCell>
                          <div style={{ textAlign: "center" }}>Ref. Number</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ textAlign: "center" }}>Description</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ textAlign: "center" }}>Debet</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ textAlign: "center" }}>Credit</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ textAlign: "center" }}>Balance</div>
                        </TableCell>

                        <TableCell>
                          <div style={{ textAlign: "center" }}>
                            <ButtonGroup variant="outlined" color="default">
                              <Button onClick={() => {}}>
                                <Icon>add</Icon> Add
                              </Button>
                            </ButtonGroup>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableCell>
                        <div style={{ textAlign: "center" }}>1</div>
                      </TableCell>

                      <TableCell>
                        <div style={{ textAlign: "left" }}>28-02-2022</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "left" }}>TRX-2001</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "left" }}>
                          Pembayaran Rekening Listrik
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "right" }}>0</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "right" }}>1.300.000</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "right" }}>10.219.000</div>
                      </TableCell>

                      <TableCell>
                        <div style={{ textAlign: "center" }}>
                          <ButtonGroup variant="outlined" color="default">
                            <Button onClick={() => {}}>
                              <Icon>view_list</Icon>
                            </Button>{" "}
                          </ButtonGroup>
                        </div>
                      </TableCell>
                    </TableBody>
                    <TableBody>
                      <TableCell>
                        <div style={{ textAlign: "center" }}>1</div>
                      </TableCell>

                      <TableCell>
                        <div style={{ textAlign: "left" }}>28-02-2022</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "left" }}>TRX-2002</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "left" }}>
                          Ambil kas dari BCA
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "right" }}>25.000.000</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "right" }}>0</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "right" }}>35.219.000</div>
                      </TableCell>

                      <TableCell>
                        <div style={{ textAlign: "center" }}>
                          <ButtonGroup variant="outlined" color="default">
                            <Button onClick={() => {}}>
                              <Icon>view_list</Icon>
                            </Button>{" "}
                          </ButtonGroup>
                        </div>
                      </TableCell>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* <AccJournalForm open={openForm} closeModal={refreshListCoa} /> */}
      </div>
    </AccountingBaseLayout>
  );
}
