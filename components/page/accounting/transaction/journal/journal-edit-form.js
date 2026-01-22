import {
  Button,
  Card,
  Grid,
  Modal,
  Box,
  TextField,
  makeStyles,
  InputBase,
  CardHeader,
  CardContent,
  FormControl,
  Divider,
  Backdrop,
  CircularProgress,
  Collapse,
  IconButton,
  Typography,
} from "@material-ui/core";
import {
  LOCAL_STORAGE_PREFIX,
  LOCAL_STORAGE_SUFFIX,
  LOCAL_STORAGE_THOUSAND,
  LOCAL_STORAGE_DECIMAL,
  LOCAL_STORAGE_SCALE,
} from "../../../../../helpers/consts";
import { numberConvert } from "../../../../../helpers/general";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Autocomplete from "@material-ui/lab/Autocomplete";
import NumberFormat from "react-number-format";
import { Delete, Add, Save } from "@material-ui/icons";

import { saveTrxJournal } from "../../../../../services/api/acc-trx-journal.api";
import { getListCoaSwr } from "../../../../../services/swr/coa.swr";
import { getListSubAccSwr } from "../../../../../services/swr/acc-sub.swr";

import Moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
//==new

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    spacing: 2,
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
  title: {
    fontWeight: "bold",
  },
}));
const numStyles = {
  borderTop: "0px",
  borderRight: "0px",
  borderLeft: "0px",
  borderBottom: "0px",
};

function not(a, b) {
  return a.filter((value) => b.findIndex((o) => o.id == value.id) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.findIndex((o) => o.id == value.id) !== -1);
}

export default function JurnalEditForm(props) {
  const thousand = localStorage.getItem(LOCAL_STORAGE_THOUSAND);
  const decimal = localStorage.getItem(LOCAL_STORAGE_DECIMAL);
  const prefix = localStorage.getItem(LOCAL_STORAGE_PREFIX);
  const suffix = localStorage.getItem(LOCAL_STORAGE_SUFFIX);
  const scale = parseInt(localStorage.getItem(LOCAL_STORAGE_SCALE));

  const [value, setValue] = React.useState(null);

  const router = useRouter();
  const classes = useStyles();
  const modul = router.query.modul;
  const [officeList, setOfficeList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [templateList, setTemplateList] = useState([]);
  const [template, setTemplate] = useState("");
  const [userPosList, setUserPosList] = useState([]);
  const [userPermissionList, setUserPermissionList] = useState([]);
  const [idModule, setIdModule] = useState("");
  // const [modul, setModul] = useState("");

  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  const [office, setOffice] = useState(null);
  const [position, setPosition] = useState(null);
  const [team, setTeam] = useState(null);
  const [finalCheck, setFinalCheck] = useState(false);

  const [open, setOpen] = useState(false);

  const [coaList, setCoaList] = useState([]);
  const [subAccList, setSubAccList] = useState([]);
  const [selectedCoa, setSelectedCoa] = useState([]);
  const [selectedSubAcc, setSelectedSubAcc] = useState([]);

  const [errorText, setErrorText] = useState({
    position: null,
  });
  const [isLoading, setLoading] = useState(false);

  const [formState, setFormState] = useState(false);
  const [formDetails, setFormDetails] = useState(false);

  const [optionCoa, setOptionCoa] = useState([]);
  const [optionSubAcc, setOptionSubAcc] = useState([]);
  const [inputList, setInputList] = useState([
    {
      coa_id: null,
      coa_code: null,
      coa_name: null,
      remark_detail: null,
      subsidiary_code: null,
      subsidiary_description: null,
      debit: null,
      credit: null,
    },
  ]);

  const [data, setData] = useState({
    id: null,
    trx_date: null,
    project_code: null,
    reference_document: null,
    reference_number: null,
    remarks: null,
    team_code: null,
    team_name: null,
    details: null,
  });

  const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" });

  const [serviceList, setServiceList] = useState([{ service: "" }]);

  const onInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const onInputNumChange = (event) => {
    setData({
      ...data,
      [event.target.name]: Number(event.target.value),
    });
  };

  const handleChange = (event) => {
    setFinalCheck(event.target.checked);
    if (event.target.checked === true) {
      setData({
        ...data,
        [event.target.name]: true,
      });
    } else {
      setData({
        ...data,
        [event.target.name]: false,
      });
    }
  };
  //onInputDetailChange
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

      setData({ ...data, details: list });
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
      data.coa = coa_code[0].trim();
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

      setData({ ...data, details: list });
    } else {
      data.coa = "";
      setSelectedSubAcc({
        id: "",
        label: "",
      });
    }
  };

  const closeForm = () => {
    setData({
      id: null,
      trx_date: null,
      project_code: null,
      reference_document: null,
      reference_number: null,
      remarks: null,
      team_code: null,
      team_name: null,
      details: null,
    });
    console.log("tutup");
    props?.closeModal();
  };

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

  const handleServiceAdd = () => {
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
    setServiceList([
      ...serviceList,
      {
        id: null,
        coa_code: null,
        remark_detail: null,
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
  const hendleServiceChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...serviceList];
    if (e.target.name === "remark_detail") list[index]["remark_detail"] = value;
    if (e.target.name === "coa") list[index]["coa"] = value;
    if (e.target.name === "debit") list[index]["debit"] = value;
    if (e.target.name === "credit") list[index]["credit"] = value;
    setServiceList(list);
  };
  const clickAddRow = () => {
    alert(JSON.stringify(inputList));
    // setInputList([
    //   ...inputList,
    //   {
    //     coa_id: null,
    //     coa_code: null,
    //     coa_name: null,
    //     remark_detail: null,
    //     subsidiary_code: null,
    //     debit: null,
    //     credit: null,
    //   },
    // ]);
  };
  const saveJournal = () => {
    if (checkBalance()) {
      setLoading(true);
      setOpen(false);
      var dataSave = {
        id: data.id,
        trx_date: data.trx_date,
        project_code: data.project_code,
        reference_document: data.reference_document,
        reference_number: data.reference_number,
        remarks: data.remarks,
        team_code: data.team_code,
        team_name: data.team_name,
        details: inputList,
      };
      saveTrxJournal(dataSave).then((res) => {
        if (res == data.id) {
          setLoading(false);
          setOpen(true);
        }
      });
    } else {
      alert("Unbalance, check transaction !");
    }
  };

  let param = { limit: 999 };
  var coaSwr = getListCoaSwr(param);
  var subAccSwr = getListSubAccSwr(param);

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
    if (props.jurnal != null) {
      setData({
        id: props.jurnal.id,
        trx_date: props.jurnal.trx_date,
        project_code: props.jurnal.project_code,
        reference_document: props.jurnal.reference_document,
        reference_number: props.jurnal.reference_number,
        remarks: props.jurnal.remarks,
        team_code: props.jurnal.team_code,
        team_name: props.jurnal.team_name,
        details: props.jurnal.details,
      });
      setInputList(props.jurnal.details);
    }
  }, [props.jurnal]);

  //function
  function onChangeInput(e) {
    if (e.target.name != "") {
      setFormState({
        ...formState,
        [e.target.name]: e.target.value,
      });
    }
    setOpenAlert(false);
  }

  function checkValidation() {
    var isValid = true;
    // var ePositionId = "";
    // var eTeamId = "";

    // if (data.position_id == "" || data.position_id == null) {
    //   isValid = false;
    //   ePositionId = "Position  can not be empty";
    // }
    // if (data.team_id == "" || data.team_id == null) {
    //   isValid = false;
    //   eTeamId = "Team can not be empty";
    // }

    // setErrorText({
    //   ...errorText,
    //   position_id: ePositionId,
    //   team_id: eTeamId,
    // });
    return isValid;
  }
  function checkBalance() {
    var stat = true;
    var vDebit = 0,
      vCredit = 0;
    inputList?.map((dataList, index) => {
      vDebit = vDebit + dataList?.debit;
      vCredit = vCredit + dataList?.credit;
    });
    if (vDebit != vCredit) {
      stat = false;
    }
    return stat;
  }
  return (
    <Modal
      open={props?.open}
      onClose={closeForm}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box className="modal-wrapper" style={{ width: "1600px" }}>
        <Collapse in={open}>
          <Alert
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
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
        <Card className="modal">
          <Box className="modal-header">
            <Box className="me-3" style={{ width: "100%" }}>
              <Grid container>
                <Grid item xs={11} direction="column">
                  <h3>Jounal Transaction</h3>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box className="modal-content">
            <Box className="mb-3">
              <Grid
                container
                spacing={2}
                // justify="left"
                //   alignItems="center"
                className={classes.root}
              >
                <Grid item lg={2}>
                  <h3 className="mb-3">Transaction Date</h3>
                </Grid>
                <Grid item lg={10}>
                  <TextField
                    id="trx_date"
                    type="date"
                    defaultValue={Moment(data?.trx_date).format("YYYY-MM-DD")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3">
              <Grid
                container
                spacing={2}
                // justify="left"
                className={classes.root}
              >
                <Grid item lg={2}>
                  Team
                </Grid>
                <Grid item lg={10}>
                  <TextField
                    name="team_name"
                    variant="outlined"
                    defaultValue={data.team_name}
                    disabled={true}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                // justify="left"
                className={classes.root}
              >
                <Grid item lg={2}>
                  Remark
                </Grid>
                <Grid item lg={10}>
                  <TextField
                    name="remarks"
                    variant="outlined"
                    defaultValue={data.remarks}
                    disabled={true}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3">
              <Grid
                container
                spacing={2}
                // justify="left"
                className={classes.root}
              >
                <Grid item lg={2}>
                  Reference
                </Grid>
                <Grid item lg={5}>
                  <TextField
                    disabled={true}
                    label="Reference Number"
                    name="reference_number"
                    variant="outlined"
                    defaultValue={data.reference_number}
                    fullWidth
                  />
                </Grid>
                <Grid item lg={5}>
                  <TextField
                    name="trx_src"
                    label="Reference Document"
                    variant="outlined"
                    disabled={true}
                    defaultValue={data.reference_document}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>

            <Box className="mb-3">
              <Card className="{classes.root}">
                <CardHeader title="" subheader="Journal Input"></CardHeader>
                <CardContent>
                  <Grid
                    container
                    spacing={2}
                    // justify="left"
                    className={classes.root}
                  >
                    <Grid item lg={2}>
                      <Typography className={classes.title} align="left">
                        Coa Code
                      </Typography>
                    </Grid>
                    <Grid item lg={3}>
                      <Typography className={classes.title} align="left">
                        Description
                      </Typography>
                    </Grid>
                    <Grid item lg={2}>
                      <Typography className={classes.title} align="left">
                        Sub. Acc.
                      </Typography>
                    </Grid>
                    <Grid item lg={2}>
                      <Typography className={classes.title} align="center">
                        Debet
                      </Typography>
                    </Grid>
                    <Grid item lg={2}>
                      <Typography className={classes.title} align="center">
                        Credit
                      </Typography>
                    </Grid>
                    <Grid item lg={1}>
                      &nbsp;
                    </Grid>
                  </Grid>
                  {/* {data?.details?.map((detil, index) => ( */}
                  {inputList?.map((detil, index) => (
                    <Grid
                      container
                      spacing={2}
                      // justify="left"
                      className={classes.root}
                      key={index}
                    >
                      <Grid item lg={2}>
                        <Autocomplete
                          options={optionCoa}
                          autoHighlight
                          defaultValue={{
                            id: detil.id,
                            label: detil.coa_code + " - " + detil.coa_name,
                          }}
                          onChange={(e, v) => onCoaChange(e, v, true, index)}
                          getOptionLabel={(option) => option?.label}
                          renderOption={(option) => (
                            <React.Fragment>{option?.label}</React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              variant="outlined"
                              {...params}
                              id="coa"
                              defaultValue={detil.coa_code}
                              name="coa"
                              error={errorText.coa}
                              helperText={errorText.coa}
                              fullWidth
                            />
                          )}
                        />
                      </Grid>

                      <Grid item lg={3}>
                        <TextField
                          InputProps={{
                            disableUnderline: true, // <== added this
                          }}
                          variant="outlined"
                          name="remark_detail"
                          defaultValue={detil.remark_detail}
                          onChange={(e, v) =>
                            onInputDetailChange(e, v, true, index)
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item lg={2}>
                        <Autocomplete
                          options={optionSubAcc}
                          autoHighlight
                          defaultValue={{
                            id: detil.subsidiary_code,
                            label:
                              detil.subsidiary_code +
                              " - " +
                              detil.subsidiary_description,
                          }}
                          onChange={(e, v) => onSubAccChange(e, v, true, index)}
                          getOptionLabel={(option) => option?.label}
                          renderOption={(option) => (
                            <React.Fragment>{option?.label}</React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              id="coa"
                              defaultValue={detil.subsidiary_code}
                              name="coa"
                              error={errorText.coa}
                              helperText={errorText.coa}
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={2}>
                        <NumberFormat
                          style={numStyles}
                          name="debit"
                          variant="outlined"
                          customInput={TextField}
                          defaultValue={detil.debit}
                          thousandSeparator={thousand}
                          decimalSeparator={decimal}
                          scale={scale}
                          prefix={prefix}
                          inputmode="text"
                          onChange={(e, v) =>
                            onInputDetailChange(e, v, true, index)
                          }
                          // className={classes.numberText}
                        />
                      </Grid>
                      <Grid item lg={2}>
                        <NumberFormat
                          style={numStyles}
                          customInput={TextField}
                          variant="outlined"
                          name="credit"
                          defaultValue={detil.credit}
                          thousandSeparator={thousand}
                          decimalSeparator={decimal}
                          scale={scale}
                          prefix={prefix}
                          inputmode="numeric"
                          onChange={(e, v) =>
                            onInputDetailChange(e, v, true, index)
                          }
                          align="right"
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
                  <Grid
                    container
                    // spacing={2}
                    // justify="left"
                    className={classes.root}
                  >
                    <Grid item xs={10} sm={10}>
                      <Button
                        color="primary"
                        onClick={handleInputAdd}
                        variant="outlined"
                        style={{ display: "flex", justifyContent: "left" }}
                      >
                        <Add />
                        Add Jurnal
                      </Button>
                    </Grid>

                    <Grid item xs={2} sm={2}>
                      <Button
                        onClick={saveJournal}
                        color="secondary"
                        variant="contained"
                        style={{ display: "flex" }}
                      >
                        <Save />
                        Save Jurnal
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Card>
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Modal>
  );
}
