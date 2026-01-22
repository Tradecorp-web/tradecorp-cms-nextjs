import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Box,
  TextField,
  makeStyles,
  InputBase,
  Link,
  Breadcrumbs,
  CardActions,
  Select,
  MenuItem,
} from "@material-ui/core";
import {
  LOCAL_STORAGE_PREFIX,
  LOCAL_STORAGE_SUFFIX,
  LOCAL_STORAGE_THOUSAND,
  LOCAL_STORAGE_DECIMAL,
  LOCAL_STORAGE_SCALE,
} from "../../../../../helpers/consts";

import { numberConvert } from "../../../../../helpers/general";

import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import AccountingBaseLayout from "../../../../base_layout/base-layout-sidemenu-accounting";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { dateFormatInput } from "../../../../../helpers/general";

import { Delete, Add, Save } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { getListCoaSwr } from "../../../../../services/swr/coa.swr";

import { getListSubAccSwr } from "../../../../../services/swr/acc-sub.swr";
import { getListSalesOrderSwr } from "../../../../../services/swr/sales-order.swr";
import { masterDataSwr } from "../../../../../services/swr/master-data.swr";

import { getCoaDetailApi } from "../../../../../services/api/coa.api";
import { saveTrxJournal } from "../../../../../services/api/acc-trx-journal.api";

import { useRouter } from "next/router";
import getRoute from "../../../../../helpers/router";

import NumberFormat from "react-number-format";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  paper: {
    width: 250,
    height: 300,
    overflow: "auto",
  },
  grid: {
    spacing: 2,
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  headerItem: {
    padding: "0 5px",
    color: "#333",
  },
  headerCard: {
    backgroundColor: "#d9d9d9",
    fontWeight: "bold",
  },
  headerChildCard: {
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
  },
  breadcrumb: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function AccJournalForm(props) {
  const thousand = localStorage.getItem(LOCAL_STORAGE_THOUSAND);
  const decimal = localStorage.getItem(LOCAL_STORAGE_DECIMAL);
  const prefix = localStorage.getItem(LOCAL_STORAGE_PREFIX);
  const suffix = localStorage.getItem(LOCAL_STORAGE_SUFFIX);
  const scale = parseInt(localStorage.getItem(LOCAL_STORAGE_SCALE));
  const classes = useStyles();

  const router = useRouter();

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  const [optionCoa, setOptionCoa] = useState([]);
  const [optionProjectCode, setOptionProjectCode] = useState([]);

  const [team, setTeam] = React.useState("");

  const [CoaTmp, setCoaTmp] = useState([]);
  const [coaList, setCoaList] = useState([]);
  const [SOList, setSOList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [CoaNameTmp, setCoaNameTmp] = useState([]);
  const [selectedCoa, setSelectedCoa] = useState([]);
  const [selectedProjectCode, setSelectedProjectCode] = useState([]);
  const [subAccList, setSubAccList] = useState([]);
  const [selectedSubAcc, setSelectedSubAcc] = useState([]);

  const [optionSubAcc, setOptionSubAcc] = useState([]);

  const [serviceList, setServiceList] = useState([{ service: "" }]);
  const handleInputAdd = () => {
    setInputList([
      ...inputList,
      {
        coa_id: null,
        coa_code: null,
        coa_name: null,
        remark_detail: null,
        subsidiary_code: null,
        debit: null,
        credit: null,
      },
    ]);
  };
  const handleServiceRemove = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  //==add function for journal

  const onProjectCodeChange = (event, value, extra) => {
    if (value != null) {
      var objekval = Object.values(value);
      var project_code = objekval[1].split("-");
      data.project_code = project_code[0].trim();
    } else {
      data.project_code = "";
    }
  };
  const onCoaChange = (event, value, extra, index) => {
    if (value != null) {
      var objekval = Object.values(value);
      var coa_code = objekval[1].split("-");
      data.coa = coa_code[0].trim();
      setSelectedCoa({
        id: objekval[0],
        label: objekval[1],
      });

      // insert to array details

      var list = [...inputList];
      if (value != null) {
        list[index]["coa_id"] = value.id;
        list[index]["coa_code"] = coa_code[0].trim();
        list[index]["coa_name"] = coa_code[1].trim();
      }
      setInputList(list);
    } else {
      data.coa = "";
      setSelectedCoa({
        id: "",
        label: "",
      });
    }
  };
  const onSubAccChange = (event, value, extra, index) => {
    if (value != null) {
      var objekval = Object.values(value);
      var coa_code = objekval[1].split("-");
      setSelectedSubAcc({
        id: objekval[0],
        label: objekval[1],
      });

      // insert to array details

      var list = [...inputList];
      if (value != null) {
        list[index]["subsidiary_code"] = coa_code[0].trim();
        list[index]["subsidiary_description"] = coa_code[1].trim();
      }
      setInputList(list);
    } else {
      setSelectedSubAcc({
        id: "",
        label: "",
      });
    }
  };

  const saveJournal = () => {
    setLoading(true);
    var dataSave = {
      id: data.id,
      trx_date: data.trx_date + "T01:00:00.000Z",
      reference_document: data.reference_document,
      project_code: data.project_code,
      remarks: data.remarks,
      team_code: data.team_code,
      team_name: data.team_name,
      details: inputList,
    };
    saveTrxJournal(dataSave).then((res) => {
      if (res == data.id) {
        setLoading(false);
      }
    });
  };
  const [errorText, setErrorText] = useState({});
  const [inputList, setInputList] = useState([
    {
      coa_id: null,
      coa_code: null,
      coa_name: null,
      remark_detail: null,
      subsidiary_code: null,
      debit: null,
      credit: null,
    },
  ]);
  const [data, setData] = useState({
    id: null,
    remark: null,
    trx_src: null,
    trx_date: null,
    reference_number: null,
    project_code: null,
    team_code: null,
    team_name: null,
    reference_document: null,
    details: [],
  });

  const getCoa = async (id) => {
    if (id != undefined) {
      var result = await getCoaDetailApi(id);
      setSelectedCoa({
        id: result.coa_code,
        label: result.coa_code + " - " + result.coa_name,
      });
      setCoaTmp(result.coa_code);
      setCoaNameTmp(result.coa_code + " - " + result.coa_name);
    } else {
      setSelectedCoa({
        id: "",
        label: "",
      });
    }
  };
  let param = { limit: 999 };

  const clickRemoveRow = (i) => {
    var list = [...inputList];
    list.splice(i, 1);
    setInputList(list);
    setData({ ...data, details: list });
  };
  const onDetailChange = (event, value, i, extra) => {
    var list = [...inputList];
    setInputList(list);
    setData({ ...data, details: list });
  };
  //onInputDetailChange
  const inputChange = (e) => {
    if (e.target.name != "") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    }
  };
  const onInputDetailChange = (event, value, extra, index) => {
    var list = [...inputList];
    const decimal = localStorage.getItem(LOCAL_STORAGE_DECIMAL);
    const prefix = localStorage.getItem(LOCAL_STORAGE_PREFIX);
    if (event.target.name == "debit" || event.target.name == "credit") {
      var val = numberConvert(event.target.value);
      list[index][event.target.name] = Number(val);
    } else {
      list[index][event.target.name] = event.target.value;
    }
    setInputList(list);
  };
  //get coa
  var coaSwr = getListCoaSwr(param);
  var subAccSwr = getListSubAccSwr(param);
  var SOSwr = getListSalesOrderSwr();
  var teamSwr = masterDataSwr("team", "team");

  useEffect(() => {
    if (SOSwr?.data) {
      setSOList(SOSwr?.data.result ?? []);
    }
  }, [SOSwr]);

  useEffect(() => {
    var list = [];
    list.push({ id: "", label: "" });
    SOList.map((item, i) => {
      list.push({
        id: item.project_code,
        label: item.project_code + " - " + item.project_name,
      });
    });

    setOptionProjectCode(list);
  }, [SOList]);

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

  /*sub acc */
  useEffect(() => {
    if (subAccSwr?.data) {
      setSubAccList(subAccSwr?.data.result ?? []);
    }
  }, [subAccSwr]);
  useEffect(() => {
    var listSubAcc = [];
    listSubAcc.push({ id: "", label: "" });
    subAccList.map((item, i) => {
      listSubAcc.push({
        id: item.subsidiary_code,
        label: item.subsidiary_code + " - " + item.subsidiary_description,
      });
    });
    setOptionSubAcc(listSubAcc);
  }, [subAccList]);
  /**sub acc */

  useEffect(() => {
    trx_date: dateFormatInput("01-01-2022");
    getCoa("120");
  }, []);

  return (
    <AccountingBaseLayout title="Edit Payment Setup">
      <div className={classes.breadcrumb}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link
            color="inherit"
            onClick={(e) => openPage(e, getRoute("accounting"))}
          >
            Accounting Dashboard
          </Link>
          <Link
            color="inherit"
            onClick={(e) => openPage(e, getRoute("accounting.setting"))}
          >
            Setting
          </Link>
          <Link
            color="inherit"
            onClick={(e) =>
              openPage(e, getRoute("accounting.setting.acc-payment-setup"))
            }
          >
            Bank Statement
          </Link>
          <Typography color="textPrimary"> Edit</Typography>
        </Breadcrumbs>
      </div>
      <Box style={{ width: "100%" }}>
        <Card>
          <CardHeader
            className={classes.headerCard}
            subheader="Journal Transaction"
          ></CardHeader>
          <CardContent>
            <Box>
              <Box className="mb-0">
                <Grid
                  container
                  spacing={2}
                  // justify="left"
                  //   alignItems="center"
                  className={classes.root}
                >
                  <Grid item lg={3}>
                    <h3 className="mb-3">Transaction Date</h3>
                  </Grid>
                  <Grid item lg={6}>
                    <InputBase
                      color="secondary"
                      className="input"
                      type="date"
                      name="trx_date"
                      onChange={(e, v) => inputChange(e)}
                      fullWidth
                    ></InputBase>
                  </Grid>
                </Grid>
              </Box>
              <Box className="mb-0">
                <Grid
                  container
                  spacing={2}
                  justify="left"
                  alignItems="center"
                  className={classes.root}
                >
                  <Grid item lg={3}>
                    Reference Document
                  </Grid>
                  <Grid item lg={6}>
                    <TextField
                      size="small"
                      name="reference_document"
                      label="Reference Doc"
                      variant="outlined"
                      onChange={(e, v) => inputChange(e)}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box className="mb-0">
                <Grid container spacing={2} className={classes.root}>
                  <Grid item lg={3}>
                    Project Code
                  </Grid>
                  <Grid item lg={6}>
                    <Autocomplete
                      options={optionProjectCode}
                      autoHighlight
                      onChange={(e, v) => onProjectCodeChange(e, v, true)}
                      getOptionLabel={(option) => option?.label}
                      renderOption={(option) => (
                        <React.Fragment>{option?.label}</React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="project_code"
                          name="project_code"
                          variant="outlined"
                          error={errorText.project_code}
                          helperText={errorText.project_code}
                          fullWidth
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box className="mb-0">
                <Grid container spacing={2} className={classes.root}>
                  <Grid item lg={3}>
                    Team
                  </Grid>
                  <Grid item lg={6}>
                    <Select
                      labelId="demo-simple-select-label"
                      variant="outlined"
                      id="team_code"
                      name="team_code"
                      fullWidth
                      size="small"
                      onChange={(e, v) => inputChange(e)}
                    >
                      {teamSwr?.data?.map((dataTeam, index) => (
                        <MenuItem padding="5px" value={dataTeam?.id}>
                          {dataTeam?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </Box>
              <Box className="mb-3">
                <Grid
                  container
                  spacing={2}
                  justify="left"
                  alignItems="center"
                  className={classes.root}
                >
                  <Grid item lg={3}>
                    Remark
                  </Grid>
                  <Grid item lg={6}>
                    <TextField
                      name="remarks"
                      label="Remarks"
                      variant="outlined"
                      onChange={(e, v) => inputChange(e)}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box className="mb-3">
                <Card>
                  <CardHeader
                    className={classes.headerChildCard}
                    title=""
                    subheader="Journal Input"
                  ></CardHeader>
                  <CardContent>
                    <Grid
                      container
                      spacing={2}
                      justify="left"
                      alignItems="center"
                      className={classes.root}
                    >
                      <Grid item lg={2}>
                        Coa Code
                      </Grid>
                      <Grid item lg={3}>
                        Description
                      </Grid>
                      <Grid item lg={2}>
                        Sub Code
                      </Grid>
                      <Grid item lg={2}>
                        Debit
                      </Grid>
                      <Grid item lg={2}>
                        Credit
                      </Grid>
                      <Grid item lg={1}></Grid>
                    </Grid>
                    {inputList.map((singleService, index) => (
                      <Grid
                        container
                        spacing={2}
                        justify="left"
                        alignItems="center"
                        className={classes.root}
                        key={index}
                      >
                        <Grid item lg={2}>
                          <Autocomplete
                            options={optionCoa}
                            autoHighlight
                            // value={selectedCoa}
                            value={singleService.coa}
                            onChange={(e, v) => onCoaChange(e, v, true, index)}
                            getOptionLabel={(option) => option?.label}
                            renderOption={(option) => (
                              <React.Fragment>{option?.label}</React.Fragment>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                id="coa_code"
                                name="coa_code"
                                variant="outlined"
                                error={errorText.coa}
                                helperText={errorText.coa}
                                fullWidth
                                size="small"
                              />
                            )}
                          />
                        </Grid>

                        <Grid item lg={3}>
                          <TextField
                            name="remark_detail"
                            // onBlur={(e, v) =>
                            //   hendleServiceChange(e, v, true, index)
                            // }
                            onChange={(e, v) =>
                              onInputDetailChange(e, v, true, index)
                            }
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item lg={2}>
                          <Autocomplete
                            options={optionSubAcc}
                            autoHighlight
                            // defaultValue={{
                            //   id: detil.subsidiary_code,
                            //   label:
                            //     detil.subsidiary_code +
                            //     " - " +
                            //     detil.subsidiary_description,
                            // }}
                            onChange={(e, v) =>
                              onSubAccChange(e, v, true, index)
                            }
                            getOptionLabel={(option) => option?.label}
                            renderOption={(option) => (
                              <React.Fragment>{option?.label}</React.Fragment>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                id="subsidiary_code"
                                // defaultValue={detil.subsidiary_code}
                                name="subsidiary_code"
                                error={errorText.coa}
                                helperText={errorText.coa}
                                fullWidth
                                variant="outlined"
                                size="small"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item lg={2}>
                          <NumberFormat
                            name="debit"
                            customInput={TextField}
                            thousandSeparator={thousand}
                            decimalSeparator={decimal}
                            scale={scale}
                            prefix={prefix}
                            inputmode="text"
                            variant="outlined"
                            size="small"
                            onChange={(e, v) =>
                              onInputDetailChange(e, v, true, index)
                            }
                            // className={classes.numberText}
                          />
                        </Grid>
                        <Grid item lg={2}>
                          <NumberFormat
                            name="credit"
                            customInput={TextField}
                            thousandSeparator={thousand}
                            decimalSeparator={decimal}
                            scale={scale}
                            prefix={prefix}
                            inputmode="text"
                            variant="outlined"
                            size="small"
                            onChange={(e, v) =>
                              onInputDetailChange(e, v, true, index)
                            }
                            // className={classes.numberText}
                          />
                        </Grid>
                        <Grid item lg={1}>
                          {inputList.length > 1 && (
                            <Button
                              color="primary"
                              type="button"
                              variant="contained"
                              className="remove-btn"
                              onClick={() => handleServiceRemove(index)}
                            >
                              <Delete />
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    ))}
                  </CardContent>
                  <CardActions>
                    <Grid
                      container
                      spacing={2}
                      justify="left"
                      alignItems="center"
                      className={classes.root}
                    >
                      <Grid item xs={10} sm={10}>
                        <Button
                          color="primary"
                          onClick={handleInputAdd}
                          variant="outlined"
                          size="small"
                          style={{ display: "flex", justifyContent: "left" }}
                        >
                          <Add />
                          Add Jurnal
                        </Button>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              </Box>
            </Box>
          </CardContent>
          <CardActions>
            <Grid container>
              <Grid item xs={2} sm={2}>
                <Button
                  onClick={saveJournal}
                  color="primary"
                  variant="contained"
                  size="small"
                  style={{ display: "flex", justify: "right" }}
                >
                  <Save />
                  Save Jurnal
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Box>
    </AccountingBaseLayout>
  );
}
