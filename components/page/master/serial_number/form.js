import {
  Modal,
  Box,
  Card,
  Collapse,
  Grid,
  TextField,
  MenuItem,
  Chip,
  Button,
  IconButton,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  InputLabel, FilledInput,
  makeStyles, Paper, InputAdornment
} from "@material-ui/core";
import { Alert, AlertTitle, Autocomplete } from "@material-ui/lab";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { onlyNumber } from '../../../../helpers/general'


import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useState } from "react";
import { masterDataSwr } from "../../../../services/swr/master-data.swr";

import { getColorListApi } from "../../../../services/api/color-codes.api";
import {
  insertContainerNumberApi,
  updateContainerNumberApi, cekLastCntNumber,
  getCntAvailableApi, updateCntSerialNumber
} from "../../../../services/api/container-number.api";

import { getCntFilterSwr, getCntAvailableSwr } from "../../../../services/swr/container-number.swr"

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: '1.5em',
    '& > *': {
      margin: theme.spacing(3),
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
  },
  dark: {
    color: "#000000",
  },
  light: {
    display: "#ffffff",
  },
}));

export default function Form(props) {

  const [openAlert, setOpenAlert] = useState(false);
  const [openFailAlert, setOpenFailAlert] = useState(false);
  const [btnLabel, setBtnLabel] = useState([]);
  const [btnDisable, setBtnDisable] = useState(false);
  const [unitSize, setUnitSize] = useState("");
  const [coSize, setCoSize] = useState("");
  const [colorSchemeVal, setColorSchemeVal] = useState("");

  const [type, setType] = useState("");
  const [delColor, setDelColor] = useState(false);

  const classes = useStyles();

  const [ralColorList, setRalColorList] = useState([
    {
      ral_code: "",
      name_english: "",
      html_code: "",
    },
  ]);
  const [ralColorData, setRalColorData] = useState([
    {
      ral_code: "",
      name_english: "",
      html_code: "",
    },
  ]);
  const [backRalColor, setBackRalColor] = useState("");
  const [ralFont, setRalFont] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [seriesCheckAv, setSeriesCheckAv] = useState("disabled");
  const [series, setSeries] = useState([]);
  const [serialNumber, setSerialNumber] = useState("");
  const [lastSerialNumber, setLastSerialNumber] = useState("");
  const [pendingSelect, setPendingSelect] = useState(null);
  const [disableEntries, setDisableEntries] = useState(false);
  const [openDlg, setOpenDlg] = useState(false);
  const [openDlgChgSNumber, setOpenDlgChgSNumber] = useState(false);
  const [dataSerial, setDataSerial] = useState(false);
  const [scroll, setScroll] = React.useState('paper');
  const [seriesAvailable, setSeriesAvailable] = React.useState([]);
  const [saveSerialDisabled, setSaveSerialDisabled] = React.useState(true);

  const [data, setData] = useState({
    id: null,
    unit_code: null,
    unit_type: null,
    prefix: null,
    series: null,
    colour_name: null,
    ral_colour: null,
    html_code: null,
    comments: null,
    segment: null,
    last_number: null,
    serial_number: null,
  });
  const [colorList, setColorList] = useState(null);

  var masterContainerType = masterDataSwr("container_type", "name");
  var masterContainerSize = masterDataSwr("container_size", "name");
  var masterCntAvailableSwr = getCntAvailableSwr(props?.prefix);

  const closeForm = () => {
    props?.closeModal();
  };

  const [errorText, setErrorText] = useState({
    serial_number: null,
  });

  //const

  const openAddMaster = (tipe) => {
    props?.addMaster(tipe);
  };

  const onSerialFocus = (e) => {
    if (props?.actForm == "Add") {
      if (data?.series != null) {
        setSerialNumber(props.prefix + data?.series + "0000")
        e.target.value = props.prefix + data?.series + "0000";
        setData({
          ...data,
          serial_number: data?.prefix + data?.series + "0000",
        });
        setErrorText({
          ...errorText,
          series: null,
          colour_name: null,
          ral_colour: null,
          html_code: null,
          comments: null,
          segment: null,
          serial_number: null,
        });
      }
    }
  };

  const checkSerial = async (e) => {
    var val = e.target.value;
    var vPrefix = props.prefix != null ? props.prefix.toUpperCase() : "";
    var vSeries = data?.series != null ? data?.series.toUpperCase() : "";
    var valPrefix = val.substring(0, 4).toUpperCase();
    var valSeries = val.substring(4, 6).toUpperCase();
    var valLastNum = e.target.value.substring(6, 10);


    var vAlert = null;
    if (vPrefix != valPrefix) {
      vAlert = "Prefix not Match";
    }
    if (vSeries != valSeries) {
      vAlert = " Series not Match";
    }
    if (vSeries != valSeries && vPrefix != valPrefix) {
      vAlert = "Prefix and serial not match";
    }
    if (vSeries == valSeries && vPrefix == valPrefix) {
      vAlert = null;
    }

    setSerialNumber(e.target.value)
    if (vAlert == null) {
      setData({
        ...data,
        serial_number: e.target.value,
        last_number: parseInt(valLastNum),
      });
    }

    setErrorText({
      ...errorText,
      serial_number: vAlert,
    });
  };
  const onFieldChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value.toUpperCase() });
  };

  const onChangeType = (e) => {
    if (e.target.value == "create-new") {
      openAddMaster("container_type");
      setPendingSelect(e.target.name);
    } else {
      if (e.target.value != null) {
     
        var vType = e.target.value.split("|");
        var vUnitCode = coSize + vType[0];
        var vUnitType = coSize + "' " + vType[1];
        setType(e.target.value);
        setData({
          ...data,
          size: coSize,
          type: vType[0],
          unit_type: vUnitType,
          unit_code: vUnitCode,
        });
      }
    }
  };

  const onChangeSize = (e) => {
    if (e.target.value == "create-new") {
      openAddMaster("container_size");
      setPendingSelect(e.target.name);
    } else {
      var vUnitCode = "";
      var vUnitType = "";
      var vType1 = "";
      if (type != "") {
        var vType = type.split("|");
        vUnitCode = e.target.value + vType[0];
        vUnitType = e.target.value + "' " + vType[1];
        vType1 = vType[0];
      }
      setData({
        ...data,
        size: e.target.value,
        type: vType1,
        unit_type: vUnitType,
        unit_code: vUnitCode,
      });
      setUnitSize(e.target.value);
      setCoSize(e.target.value);
    }
  };

  const saveData = async () => {
    if (cekField() == true) {
      setBtnDisable(true);
      if (props?.actForm === "Add") {
        var save = await insertContainerNumberApi(data);
      } else {
        var save = await updateContainerNumberApi(data?.id, data);
      }
      setOpenAlert(true);
      setOpenFailAlert(false);
    } else {
      setOpenFailAlert(true);
      setOpenAlert(false);
    }
  };

  const cekField = () => {
    var eSerialNumber = "",
      eSeries = "";
    var valid = true;
    if (data?.serial_number == null || data?.serial_number == "") {
      eSerialNumber = "Serial number cannot be empty !";
      valid = false;
    }

    if (data?.series == null || data?.series == "") {
      eSeries = "Series cannot be empty !";
      valid = false;
    }

    setErrorText({
      ...errorText,
      serial_number: eSerialNumber,
      series: eSeries,
    });
    return valid;
  };

  const saveSerialNumber = () => {
  
    if(props?.actForm=="Add"){
      setSerialNumber(data?.serial_number)
      setOpenDlgChgSNumber(false)
    }else{
  
      var updateData = updateCntSerialNumber(props?.serialData?.id, data?.serial_number?.substring(6, 10)).then((res) => {
        if (res != null) {
          setSerialNumber(res?.serial_number)
          setOpenDlgChgSNumber(false)
        }
      })
    }
  }

  const clearColor = () => {
    if (ralColorData != null) {
      var list = ralColorData;
      list.splice(0, list.length);
      setRalColorData(list);
      setRalColorList(list);
      setData({ ...data, container_ral_color: [] });
    }
  };

  const colorScheme = (colorscheme) => {
    var ral_code = "";
    var name_english = "";
    setRalColorList([
      {
        ral_code: "",
        name_english: "",
        html_code: "",
      },
    ]);
    if (colorscheme == "allcolor") {
      ral_code = "All Colours";
      name_english = "All Colours";
    } else if (colorscheme == "miscellaneous") {
      ral_code = "Miscellaneous";
      name_english = "Miscellaneous";
    } else {
      ral_code = "";
      name_english = "";
    }
    setData({
      ...data,
      ral_colour: ral_code,
      colour_name: name_english,
    });
    setColorSchemeVal(colorscheme);
  };

  const dataSerialSwr = getCntFilterSwr("prefix", props?.prefix)

  const seriesCheck = () => {
    setOpenDlg(true)
  }

  const seriesNumberChange = async () => {
    //cek series and prefix
    var val = serialNumber;
    var valPrefix = val.substring(0, 4).toUpperCase();
    var valSeries = val.substring(4, 6).toUpperCase();
    var valLastNum = serialNumber.substring(6, 10);
    var cntSn = await cekLastCntNumber(valPrefix + valSeries).then((res) => {
      if (res != "nodata") {
        setLastSerialNumber(res.serial_number);
      } else {
        setLastSerialNumber("0000");
      }
    });

    // alert(valPrefix+valSeries)
    if (serialNumber != "") {
      setOpenDlgChgSNumber(true)
    }
  }
  const lastSerialChange = (e) => {
    var val = serialNumber;
    var valPrefix = val.substring(0, 4).toUpperCase();
    var valSeries = val.substring(4, 6).toUpperCase();
    var serialTmp = valPrefix+valSeries+e.target.value
    setData({...data,serial_number:serialTmp})
  }
  const checkNumber = (e) => {
    setAlertOpen(false)
    var valNum = e.target.value
    e.target.value = onlyNumber(e.target.value)
    if (valNum.length == 4) {
      var lastNum = parseInt(lastSerialNumber.substring(6, 10));
      var numInput = parseInt(e.target.value);
      if (numInput < lastNum) {
        setAlertOpen(true);
        setSaveSerialDisabled(true);
      } else {
        setSaveSerialDisabled(false);
      }
    }
  }
  /**{"isLoading":false,"data":{"count":2,"current_page":1,"start":1,"until":2,"total":2,
   * "result":[{"id":"738d5103-faa1-4cc0-a5ad-ee4a63c8b91b","unit_code":"10FR","unit_type":"10' Flat Rack","prefix":"FUKU","series":"91","segment":null,"size":"10","type":"FR","colour_name":"All Colours","ral_colour":"All Colours","container_ral_color":[],"comments":"TES FUKU","last_number":82,"used":null,"serial_number":"FUKU910082","container_color":{"ral_code":"","name_english":"","html_code":"","name_german":"","name_french":"","name_spanish":"","name_italian":"","name_nederlands":""},"company_id":"bbaecc1f-6151-44b8-9be5-debe77d40676","created_at":"2023-05-31T02:50:43.239Z","updated_at":"2023-05-31T04:16:43.977Z"},{"id":"1bb6720b-fdc1-4dfc-8be5-b1178b76c72f","unit_code":"20DD","unit_type":"20' Double Door","prefix":"FUKU","series":"99","segment":null,"size":"20","type":"DD","colour_name":"Pearl dark grey","ral_colour":"RAL 9023","container_ral_color":[{"ral_code":"RAL 9023","name_english":"Pearl dark grey","html_code":"#828282"}],"comments":"TES 2 FUKU","last_number":19,"used":null,"serial_number":"FUKU990019","container_color":{"ral_code":"RAL 9023","name_english":"Pearl dark grey","html_code":"#828282","name_german":"Perldunkelgrau","name_french":"Gris fonçé nacré","name_spanish":"Gris oscuro perlado","name_italian":"Grigio scuro perlato","name_nederlands":"Parelmoer-donkergrijs"},"company_id":"bbaecc1f-6151-44b8-9be5-debe77d40676","created_at":"2023-05-31T02:50:13.642Z","updated_at":"2023-05-31T04:09:18.507Z"}]}} */
  //==const
  //useEffect

  useEffect(async () => {
    var dataSerialAvailable = await getCntAvailableApi(props?.prefix).then((res) => {
      setSeriesAvailable(res)
    })
  }, [])

  useEffect(() => {
    if (props?.newOption != null) {
      setData({
        ...data,
        size: props?.newOption.name,
      });
      setUnitSize(props?.newOption.name);
    }
    masterContainerSize.mutate();
    masterContainerType.mutate();
  }, [props?.newOption]);

  useEffect(() => {
    dataSerialSwr.mutate()
    if (dataSerialSwr?.data != null) {
      setDataSerial(dataSerialSwr?.data?.result)
    }
  }, [dataSerialSwr]);

  useEffect(() => {
    setOpenAlert(false);
    setOpenFailAlert(false);
    if (props.actForm == "Add") {
      setSeries("");
      setBtnDisable(false);
      setDisableEntries(false);
      setBtnLabel("Save");
      setData({
        id: null,
        unit_code: null,
        unit_type: null,
        size: null,
        type: null,
        prefix: props.prefix,
        series: null,
        colour_name: null,
        ral_colour: null,
        container_ral_color: null,
        html_code: null,
        comments: null,
        segment: null,
        last_number: null,
        serial_number: null,
      });
      setRalColorData([]);
      setColorSchemeVal("onecolor");
      setSerialNumber("");
      setSeriesCheckAv("");
    } else {
      setSeriesCheckAv("disabled");
      setSeries(props?.serialData?.series)
      setBtnDisable(false);
      setDisableEntries(true);
      setBtnLabel("Update");
      setData({
        id: props?.serialData?.id,
        unit_code: props?.serialData?.unit_code,
        unit_type: props?.serialData?.unit_type,
        prefix: props.prefix,
        size: props.serialData.size,
        type: props.serialData.type,
        series: props?.serialData?.series,
        colour_name: props?.serialData?.colour_name,
        container_ral_color: props?.serialData?.container_ral_color,
        ral_colour: props?.serialData?.ral_colour,
        html_code: props?.serialData?.html_code,
        comments: props?.serialData?.comments,
        segment: props?.serialData?.segment,
        last_number: props?.serialData?.last_number,
        serial_number: props?.serialData?.serial_number,
      });
      setSerialNumber(props?.serialData?.serial_number)
      if (props?.serialData?.colour_name == "All Colours") {
        setColorSchemeVal("allcolor");
      } else if (props?.serialData?.colour_name == "Miscellaneous") {
        setColorSchemeVal("miscellaneous");
      } else {
        setColorSchemeVal("onecolor");
      }

      if (typeof props?.serialData?.container_ral_color != "undefined") {
        setRalColorList(props?.serialData?.container_ral_color);
        setRalColorData(props?.serialData?.container_ral_color);
      }
    }
  }, [props?.open]);

  useEffect(async () => {
    try {
      var dataColor = [];
      var res = await getColorListApi("name_english", "asc");
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
  }, []);

  const clickAddRow = () => {
    setRalColorList([
      ...ralColorList,
      {
        ral_code: "",
        name_english: "",
        html_code: "",
      },
    ]);
  };

  const clickRemoveRow = (i) => {
    if (ralColorData.length > 0) {
      var list = ralColorData;
      list.splice(i, 1);
      setRalColorData(list);
      setDelColor(true);
    }
  };

  const refRalColorChange = (value, key, htmlCode) => {
    if (value != null) {
      // setRalFont(htmlCode);
      setBackRalColor(htmlCode);
      if (htmlCode.substring(0, 2).toLowerCase() == "#f") {
        setRalFont("#969191");
      } else {
        setRalFont("#FFFFFF");
      }
      var ralColor = value.split("  ");
      var nameEnglish = ralColor[0];
      var ralColorCode = ralColor[1];
      var ralData = ralColorData; //setDataColor();

      if (ralColorData != null) {
        ralData.push({
          ral_code: ralColorCode,
          name_english: nameEnglish,
          html_code: htmlCode,
        });
      } else {
        ralData = [
          {
            ral_code: ralColorCode,
            name_english: nameEnglish,
            html_code: htmlCode,
          },
        ];
      }

      setRalColorData(ralData);
      if (colorSchemeVal == "miscellaneous") {
        var ralColorCode = "Miscellaneous";
        var nameEnglish = "Miscellaneous";
      }
      if (colorSchemeVal == "allcolor") {
        var ralColorCode = "All Colours";
        var nameEnglish = "All Colours";
      }
      setData({
        ...data,
        container_ral_color: ralData,
        ral_colour: ralColorCode,
        colour_name: nameEnglish,
      });
    } else {
      setRalFont("#000000");
      setBackRalColor("#FFFFFF");
    }
  };

  const setDataColor = () => {
    var colSet = ralColorData.filter((val) => val.name_english != "");
    return colSet;
  };

  const alertMsg = () => {

  }
  const getSerialNumber = async (val) => {
    setSeries(val?.res);
    var lastSNum = props.prefix + val?.res +"0000";
    var cntSn = await cekLastCntNumber(props.prefix + val?.res).then((res) => {
      if (res != "nodata") {
        lastSNum = res.serial_number.substring(0,10);
      } 
    });

    setData({
      ...data,
      series: val?.res,
      serial_number: lastSNum,
      last_number: parseInt(lastSNum.substring(6,10)),
    });
    setSerialNumber(lastSNum)
    setOpenDlg(false);
  }
  useEffect(() => {
    setRalColorList(ralColorData);
    setDelColor(false);
  }, [delColor]);
  //===useEffect
  //function
  function closeFormModal() {
    props?.closeModal();
  }
  function handleClose() {
    setOpenDlg(false)
  }
  function handleCloseChgSNumber() {
    setOpenDlgChgSNumber(false)
  }
  //===function

  return (
    <Modal open={props.open} onClose={closeFormModal}>
      <Box className="modal-wrapper" style={{ width: "1000px" }}>
        <Card className="modal">
          <Collapse in={openAlert}>
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              Data saved...
            </Alert>
          </Collapse>
          <Collapse in={openFailAlert}>
            <Alert severity="warning">
              <AlertTitle>Warning</AlertTitle>
              Data not saved!
            </Alert>
          </Collapse>
          <Box className="modal-header">
            <h3>
              {props.actForm}
              {" Serial Number"}
            </h3>
          </Box>
          <Box className="modal-content">
            <Grid container>
              <Grid item xs={6} className="mb-3 text-left">
                {props?.actForm == "Update" && (
                  <TextField
                    disabled
                    fullWidth
                    label="Unit Size"
                    id="container_size"
                    name="container_size"
                    variant="outlined"
                    value={props.serialData?.size}
                  />
                )}
                {props?.actForm == "Add" && (
                  <TextField
                    select
                    label="Unit Size"
                    id="container_size"
                    name="container_size"
                    variant="outlined"
                    defaultValue={data?.size}
                    onChange={(e) => onChangeSize(e)}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    <MenuItem value={null}>
                      <em className="text-muted">None</em>
                    </MenuItem>
                    {masterContainerSize?.data?.map((row) => (
                      <MenuItem value={row?.name}>{row?.name}</MenuItem>
                    ))}
                    <MenuItem value="create-new">
                      <em>Add (+)</em>
                    </MenuItem>
                  </TextField>
                )}
              </Grid>
              <Grid item xs={6} className="mb-3 text-left">
                {props?.actForm == "Update" && (
                  <TextField
                    disabled
                    fullWidth
                    label="Unit Type"
                    id="container_type"
                    name="container_type"
                    variant="outlined"
                    value={props.serialData?.unit_type}
                  />
                )}
                {props?.actForm == "Add" && (
                  <TextField
                    fullWidth
                    label="Unit Type"
                    select
                    id="container_type"
                    name="container_type"
                    variant="outlined"
                    value={props.serialData?.unit_type}
                    // value={row?.container_type}
                    onChange={(e) => onChangeType(e)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    <MenuItem value={null}>
                      <em className="text-muted">None</em>
                    </MenuItem>
                    {masterContainerType?.data?.map((row) => (
                      <MenuItem
                        key={row?.id}
                        value={row?.alias + "|" + row?.name}
                      >
                        {row?.name}{" "}
                        {row?.alias != "" ? "[" + row?.alias + "]" : ""}
                      </MenuItem>
                    ))}
                    <MenuItem value="create-new">
                      <em>Add (+)</em>
                    </MenuItem>
                  </TextField>
                )}
              </Grid>

              <Grid item xs={12} className="mb-3 text-left">
                <TextField
                  disabled
                  label="Prefix"
                  variant="outlined"
                  fullWidth
                  name="prefix"
                  error={errorText.prefix ? true : false}
                  helperText={errorText.prefix}
                  onChange={(e) => onFieldChange(e)}
                  defaultValue={props.prefix}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ style: { textTransform: "uppercase" } }}
                ></TextField>
              </Grid>
              <Grid container>
                <Grid item xs={12} className="mb-3 text-left">
                  <FormControl variant="filled" fullWidth>
                    <InputLabel htmlFor="standard-adornment-series">Series</InputLabel>
                    <FilledInput
                      id="standard-adornment-series"
                      value={series}
                      onChange={(e) => onFieldChange(e)}

                      // value={values.password}
                      // onChange={handleChange('password')}
                      endAdornment={
                        <InputAdornment position="end">
                          <Button disabled={seriesCheckAv} color="primary" small onClick={() => seriesCheck()} >Series Check </Button>

                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  {/* <FormControl>
                    <FilledInput
                      //   disabled={disableEntries}
                      label="Series"
                      variant="outlined"
                      name="series"
                      //  onBlur={(e) => onBlurSeries(e)}
                      error={errorText.series ? true : false}
                      helperText={errorText.series}
                      onChange={(e) => onFieldChange(e)}
                      fullWidth
                      value={series}
                      InputLabelProps={{ shrink: true }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"

                          >
                            <Visibility />
                          </IconButton>
                        </InputAdornment>
                      }

                    ></FilledInput></FormControl> */}

                </Grid>
                {/* <Grid item xs={4} className="mb-0 text-right">
                  <Button variant="outlined" color="primary" small onClick={() => seriesCheck()} >Series Check </Button></Grid> */}
              </Grid>
              <Grid container>
                <Grid item xs={12} className="mb-3 text-left">
                  <FormControl variant="filled" fullWidth>
                    <InputLabel htmlFor="standard-adornment-serial-number">Serial Number</InputLabel>
                    <FilledInput
                      id="standard-adornment-serial-number"
                      autoFocus
                      value={serialNumber}
                      onFocus={(e) => onSerialFocus(e)}

                      onBlur={(e) => checkSerial(e)}
                      error={errorText.serial_number ? true : false}
                      helperText={errorText.serial_number}
                      // value={values.password}
                      // onChange={handleChange('password')}
                      endAdornment={
                        <InputAdornment position="end">
                          <Button color="primary" small onClick={() => seriesNumberChange()} >Change Series Number</Button>

                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  {/* <TextField
                    //    disabled={disableEntries}
                    label="Serial Number"
                    name="serial_number"
                    fullWidth
                    variant="outlined"
                    value={serialNumber}
                    // defaultValue={data?.serial_number}
                    onFocus={(e) => onSerialFocus(e)}
                    onBlur={(e) => checkSerial(e)}
                    error={errorText.serial_number ? true : false}
                    helperText={errorText.serial_number}
                    inputProps={{
                      style: {
                        textTransform: "uppercase",
                      },
                      maxLength: 10,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  /> */}
                </Grid>
                {/* <Grid item xs={4} className="mb-0 text-right">
                  <Button variant="outlined" color="primary" small onClick={() => seriesNumberChange()} >Change Series Number</Button>
                </Grid> */}
              </Grid>


              <Grid item xs={12} className="mb-3 text-left">
                <TextField
                  multiline
                  rows={4}
                  name="comments"
                  label="Comments"
                  fullWidth
                  variant="outlined"
                  defaultValue={props?.serialData?.comments}
                  onChange={(e) => onFieldChange(e)}
                  inputProps={{ style: { textTransform: "uppercase" } }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            <Box>
              <Grid container>
                <Grid item xs={12}>
                  <h4>Container Color</h4>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      aria-label="position"
                      name="position"
                      defaultValue={colorSchemeVal}
                    >
                      <FormControlLabel
                        value="onecolor"
                        control={<Radio color="primary" />}
                        label="One Color"
                        labelPlacement="bottom"
                        onMouseDown={() => {
                          clearColor();
                        }}
                        onClick={() => {
                          colorScheme("onecolor");
                        }}
                      />

                      <FormControlLabel
                        value="allcolor"
                        control={<Radio color="primary" />}
                        label="All Color"
                        labelPlacement="bottom"
                        onMouseDown={() => {
                          clearColor();
                        }}
                        onClick={() => {
                          colorScheme("allcolor");
                        }}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              {colorSchemeVal != "allcolor" &&
                ralColorList?.map((res, key) => (
                  <Grid
                    container
                    spacing={0}
                    justify="center"
                    alignItems="center"
                  >
                    <React.Fragment>
                      <Grid item xs={12}>
                        <Autocomplete
                          className={classes.light}
                          value={res?.name_english + "  " + res?.ral_code}
                          onChange={(event, newValue) => {
                            if (newValue != null) {
                              var htmlCode = colorList.filter(
                                (val) =>
                                  val.name_english + "  " + val.ral_code ==
                                  newValue
                              )[0].html_code;
                              refRalColorChange(newValue, key, htmlCode);
                            } else {
                              refRalColorChange(null, key, "");
                            }
                          }}
                          freeSolo
                          options={colorList?.map(
                            (option) =>
                              option.name_english + "  " + option.ral_code
                          )}
                          inputProps={{
                            style: {
                              color: "#FFFFFF",
                              textTransform: "uppercase",
                            },
                          }}
                          renderOption={(option) => (
                            <Chip
                              size="small"
                              label={option}
                              style={{
                                backgroundColor: colorList.filter(
                                  (val) =>
                                    val.name_english + "  " + val.ral_code ==
                                    option
                                )[0].html_code,
                                width: 250,
                              }}
                            />
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              style={{
                                backgroundColor: backRalColor,
                              }}
                              label={"Color"}
                              margin="normal"
                              variant="outlined"
                              id="container_ral_color"
                              name="container_ral_color"
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        ></Autocomplete>
                      </Grid>

                      {/* <Grid item xs={1} sm={1}>
                        {key != 0 && (
                          <IconButton>
                            <Delete onClick={() => clickRemoveRow(key)} />
                          </IconButton>
                        )}
                      </Grid> */}
                    </React.Fragment>
                  </Grid>
                ))}
              {/* {colorSchemeVal == "miscellaneous" && (
                <Grid
                  container
                  spacing={0}
                  justify="center"
                  alignItems="center"
                >
                  <Grid item xs={12} sm={12}>
                    <Button variant="outlined" color="secondary">
                      <Add onClick={() => clickAddRow()} />
                    </Button>
                  </Grid>
                </Grid>
              )} */}
            </Box>
          </Box>

          <Box className="modal-footer">
            <Grid container>
              <Grid item xs={6} className="mb-3 text-left">
                <Button variant="outlined" onClick={() => closeForm()}>
                  Close
                </Button>
              </Grid>
              <Grid item xs={6} className="mb-3 text-right">
                <Button
                  disabled={btnDisable}
                  variant="outlined"
                  onClick={() => saveData()}
                >
                  {btnLabel}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Card>
        <Dialog
          open={openDlg}
          // TransitionComponent={Transition}
          // keepMounted
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title"><h4>Available Series</h4></DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
            >
              <Grid container style={{ width: "600px" }}>
                {/* <Grid item xs={6}><h5>Available Serial</h5></Grid> */}
              </Grid>
              <div className={classes.root}>
                {seriesAvailable && seriesAvailable.map((res) => (
                  <Paper elevation={3}
                    style={{ cursor: res.slice(0, 1) == "*" ? "default" : "pointer", color: res.slice(0, 1) != "*" ? "black" : "red" }}
                    onClick={res.slice(0, 1) != "*" ? () => getSerialNumber({ res }) : () => alertMsg()}
                  >{res}</Paper>
                ))}
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Grid container>
              <Grid item xs={6} style={{ textAlign: "left" }}>
                <h5 style={{ color: "red" }}>* serial not available</h5>
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                <Button variant="outlined" onClick={handleClose} color="primary">
                  Close
                </Button>
              </Grid>
            </Grid>

          </DialogActions>
        </Dialog>

        <Dialog open={openDlgChgSNumber} onClose={handleCloseChgSNumber} aria-labelledby="form-dialog-title">
          <Collapse in={alertOpen}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setAlertOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>}
              severity="warning">The  last serial number in the stock container is {lastSerialNumber.substring(0, 10)}</Alert>
          </Collapse>

          <DialogTitle id="form-dialog-title">Serial Number</DialogTitle>
          <DialogContent>
            <DialogContentText>
              The previous serial number was <b>{serialNumber.substring(0, 10)}</b> Master Serial, please fill in the text box to update the serial number.
            </DialogContentText>
            <Grid container>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <FormControl fullWidth className={classes.margin} variant="filled">
                  <InputLabel htmlFor="filled-adornment-serial-number">Serial Number</InputLabel>
                  <FilledInput
                    id="serial_number"
                    onKeyUp={(e) => checkNumber(e)}
                    defaultValue={serialNumber.substring(6, 10)}
                    onChange={(e) => lastSerialChange(e)}
                    inputProps={{ style: { textTransform: "uppercase" }, maxLength: 4 }}
                    startAdornment={<InputAdornment position="start">{serialNumber.substring(0, 6)}</InputAdornment>}
                  />
                </FormControl>
                {/* <FilledInput
                  autoFocus
                  // sx={{ pl: 2 }}
                  margin="dense"
                  id="serial_number"
                  onKeyUp={(e) => checkNumber(e)}
                  inputProps={{ style: { textTransform: "uppercase" }, maxLength: 4 }}
                  InputLabelProps={{ shrink: true }}
                  startAdornment={<InputAdornment position="start" style={{ paddingTop: 0 }}>  {serialNumber.substring(0, 6)}</InputAdornment>}
                /> */}
              </Grid>
            </Grid>

          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseChgSNumber}
              color="primary">
              Cancel
            </Button>
            <Button
              disabled={saveSerialDisabled}
              onClick={() => saveSerialNumber()}
              color="primary">
              Update Serial Number
            </Button>
          </DialogActions>
        </Dialog>
      </Box>


    </Modal>

  );
}

