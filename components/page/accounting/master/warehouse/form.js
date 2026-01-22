import {
  Button,
  Card,
  Grid,
  MenuItem,
  Modal,
  Typography,
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  makeStyles,
  Backdrop,
  CircularProgress,
  Icon,
  InputAdornment,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Delete, Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import {
  getCoaParentDetailApi,
  saveCoaApi,
} from "../../../../../services/api/coa.api";
import { currency } from "../../../../../helpers/general";
import Moment, { calendarFormat } from "moment";

import { getListCoaSwr } from "../../../../../services/swr/coa.swr";
import { getListCoaTypeSwr } from "../../../../../services/swr/coa-type.swr";

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

export default function CoaForm(props) {
  const classes = useStyles();
  const [optionCoaParent, setOptionCoaParent] = useState([]);
  const [CoaParentTmp, setCoaParentTmp] = useState([]);
  const [CoaNameParentTmp, setCoaNameParentTmp] = useState([]);
  const [selectedCoaParent, setSelectedCoaParent] = useState([]);

  const [optionCoaType, setOptionCoaType] = useState([]);
  const [selectedCoaType, setSelectedCoaType] = useState([]);

  const [coaParentList, setCoaParentList] = useState([]);
  const [coaTypeList, setCoaTypeList] = useState([]);

  const [errorText, setErrorText] = useState({
    coa_code: null,
    coa_name: null,
    coa_type: null,
    coa_parent: null,
  });

  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState({
    id: null,
    coa_code: null,
    coa_name: null,
    coa_type: null,
    coa_parent: null,
    coa_description: null,
  });

  const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" });

  const onInputChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const onCoaParentChange = (event, value, extra) => {
    if (value != null) {
      var objekval = Object.values(value);
      var coa_code_parent = objekval[1].split("-");
      data.coa_parent = coa_code_parent[0].trim();
      setSelectedCoaParent({
        id: objekval[0],
        label: objekval[1],
      });
    } else {
      data.coa_parent = "";
      setSelectedCoaParent({
        id: "",
        label: "",
      });
    }
  };
  const getCoaParent = async (id) => {
    if (id != undefined) {
      var result = await getCoaParentDetailApi(id);
      setSelectedCoaParent({
        id: result.coa_code,
        label: result.coa_code + " - " + result.coa_name,
      });
      setCoaParentTmp(result.coa_code);
      setCoaNameParentTmp(result.coa_code + " - " + result.coa_name);
    } else {
      setSelectedCoaParent({
        id: "",
        label: "",
      });
    }
  };

  //coa type

  useEffect(() => {
    if (props.coa != null) {
      setData({
        id: props.coa.id,
        coa_code: props.coa.coa_code,
        coa_name: props.coa.coa_name,
        coa_type: props.coa.coa_type,
        coa_parent: props.coa.coa_parent,
        coa_description: props.coa.coa_description,
      });

      if (
        props.coa.coa_parent != undefined ||
        props.coa.coa_parent != "" ||
        props.coa.coa_parent != null
      ) {
        getCoaParent(props.coa.coa_parent);
        setSelectedCoaType({
          id: props.coa.coa_type,
          label: props.coa.coa_type,
        });
      }
      clearForm();
      setTitle({ formTitle: "Edit Chart of Account", buttonTitle: "Save" });
    } else {
      setData({
        id: null,
        coa_code: null,
        coa_name: null,
        coa_type: null,
        coa_parent: null,
        coa_description: null,
      });
      setSelectedCoaParent({
        id: "",
        label: "",
      });
      clearForm();
      setTitle({ formTitle: "Add Chart of Account", buttonTitle: "Create" });
    }
  }, [props.open]);

  function clearForm() {
    errorText.coa_code = "";
    errorText.coa_name = "";
    errorText.coa_type = "";
    errorText.coa_parent = "";
  }
  let param = { limit: 999 };
  //paren coa
  var coaSwr = getListCoaSwr(param);
  useEffect(() => {
    if (coaSwr?.data) {
      setCoaParentList(coaSwr?.data.result ?? []);
    }
  }, [coaSwr]);

  useEffect(() => {
    var list = [];
    list.push({ id: "", label: "" });
    coaParentList.map((item, i) => {
      list.push({ id: item.id, label: item.coa_code + " - " + item.coa_name });
    });
    setOptionCoaParent(list);
  }, [coaParentList]);
  //==>parent coa

  //Coa type
  const onCoaTypeChange = (event, value, extra) => {
    if (value != null) {
      var objekval = Object.values(value);
      data.coa_type = objekval[0].trim();
      setSelectedCoaType({
        id: objekval[0],
        label: objekval[1],
      });
    } else {
      data.coa_type = "";
      setSelectedCoaType({
        id: "",
        label: "",
      });
    }
  };

  var coaTypeSwr = getListCoaTypeSwr(param);
  useEffect(() => {
    if (coaTypeSwr?.data) {
      setCoaTypeList(coaTypeSwr?.data.result ?? []);
    }
  }, [coaTypeSwr]);

  useEffect(() => {
    var list = [];
    list.push({ id: "", label: "" });
    coaTypeList.map((item, i) => {
      list.push({ id: item.coa_type, label: item.coa_type });
    });
    setOptionCoaType(list);
  }, [coaTypeList]);
  //==>Coa Type
  function checkValidation() {
    var isValid = true;
    var eCoaCode = "",
      eCoaName = "",
      eCoaType = "",
      eCoaParent = "";
    if (data.coa_code == "" || data.coa_code == null) {
      isValid = false;
      eCoaCode = "Coa Code can not be empty";
    }
    if (data.coa_name == "" || data.coa_name == null) {
      isValid = false;
      eCoaName = "Name not be empty";
    }
    if (data.coa_type == "" || data.coa_type == null) {
      isValid = false;
      eCoaType = "Type can not be empty";
    }
    if (
      data.coa_parent != "" &&
      parseInt(data.coa_parent) >= parseInt(data.coa_code)
    ) {
      setSelectedCoaParent({
        id: CoaParentTmp,
        label: CoaNameParentTmp,
      });
      isValid = false;
      eCoaParent = "Coa Parent higer level then Coa Code";
    }

    setErrorText({
      ...errorText,
      coa_code: eCoaCode,
      coa_name: eCoaName,
      coa_type: eCoaType,
      coa_parent: eCoaParent,
    });
    return isValid;
  }

  const sendData = () => {
    if (checkValidation()) {
      setLoading(true);
      saveCoaApi(data)
        .then((res) => {
          setData({
            id: null,
            coa_code: null,
            coa_name: null,
            coa_type: null,
            coa_parent: null,
            coa_description: null,
          });
          setLoading(false);
          props?.closeModal();
        })
        .catch((err) => {
          console.log(err);
          setErrorText(err);
          setLoading(false);
        });
    }
  };

  const closeForm = () => {
    setData({
      id: null,
      coa_code: null,
      coa_name: null,
      coa_type: null,
      coa_parent: null,
      coa_description: null,
    });
    props?.closeModal();
  };

  return (
    <Modal
      open={props?.open}
      onClose={closeForm}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box className="modal-wrapper" style={{ width: "1000px" }}>
        <Card className="modal">
          <Box className="modal-header">
            <Box className="me-3" style={{ width: "100%" }}>
              <Grid container>
                <Grid item xs={11} direction="column">
                  <h3>{title.formTitle}</h3>
                </Grid>
                <Grid item xs={1} direction="column">
                  <Button
                    variant="outlined"
                    size="small"
                    style={{ display: "flex", justifyContent: "right" }}
                    onClick={closeForm}
                    color="default"
                  >
                    <Icon className="me-2">close</Icon>
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box className="modal-content">
            <h2 className="mb-3">Details</h2>

            <Box className="mb-3">
              <TextField
                name="coa_code"
                label="Code"
                variant="outlined"
                defaultValue={data.coa_code}
                required
                error={errorText.coa_code}
                helperText={errorText.coa_code}
                onChange={onInputChange}
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                name="coa_name"
                label="Name"
                variant="outlined"
                defaultValue={data.coa_name}
                // disabled={true}
                required
                error={errorText.coa_name}
                helperText={errorText.coa_name}
                onChange={onInputChange}
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <Autocomplete
                options={optionCoaType}
                autoHighlight
                value={selectedCoaType}
                onChange={(e, v) => onCoaTypeChange(e, v, true)}
                getOptionLabel={(option) => option?.label}
                renderOption={(option) => (
                  <React.Fragment>{option?.label}</React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="coa_type"
                    label="Coa Type"
                    variant="outlined"
                    error={errorText.coa_type}
                    helperText={errorText.coa_type}
                    fullWidth
                  />
                )}
              />
            </Box>
            <Box className="mb-3">
              <Autocomplete
                options={optionCoaParent}
                autoHighlight
                value={selectedCoaParent}
                onChange={(e, v) => onCoaParentChange(e, v, true)}
                getOptionLabel={(option) => option?.label}
                renderOption={(option) => (
                  <React.Fragment>{option?.label}</React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="coa_parent"
                    label="Coa Parent"
                    variant="outlined"
                    error={errorText.coa_parent}
                    helperText={errorText.coa_parent}
                    fullWidth
                  />
                )}
              />
            </Box>

            <Box className="mb-3">
              <TextField
                name="coa_description"
                label="Description"
                variant="outlined"
                defaultValue={data.coa_description}
                error={errorText.coa_description}
                helperText={errorText.coa_description}
                onChange={onInputChange}
                fullWidth
              />
            </Box>
          </Box>
          <Box className="modal-footer">
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={sendData}
              disableElevation
            >
              {title.buttonTitle}
            </Button>
          </Box>
        </Card>
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Modal>
  );
}
