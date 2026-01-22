import {
  Button,
  Card,
  Grid,
  Modal,
  Box,
  TextField,
  makeStyles,
  Backdrop,
  CircularProgress,
  MenuItem,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  IconButton,
  InputAdornment,
  Collapse,
  InputLabel,
  Chip,
} from "@material-ui/core";

import {
  FileUploadSecureComponent,
  DropZoneComponent,
} from "../../base_component/file-upload";

import DeleteIcon from "@material-ui/icons/Delete";
import AlertDialog from "../../base_component/dialog";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Delete,
  Add,
  AlternateEmailTwoTone,
  AddAlertRounded,
} from "@material-ui/icons";
import React, { Fragment, useEffect, useState } from "react";

import { v4 as uuid } from "uuid";

import {
  getCountryListSwr,
  getCityListSwr,
} from "../../../services/swr/countries-cities.swr";

import {
  insertQuoteInApi,
  updateQuoteInApi,
  insertFileQuoteInApi,
  getFileQuoteInApi,
  deleteFileQuoteIn,
  getListQuoteInGroupFactoryApi,
} from "../../../services/api/quote-in.api";

import { isPermit } from "../../../helpers/general";

import { getCurrencyListSwr } from "../../../services/swr/countries-cities.swr";
import { masterDataSwr } from "../../../services/swr/master-data.swr";
import { getMasterContainerFactorySwr } from "../../../services/swr/quote-in.swr";

import Moment from "moment";
import { Alert } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import { getColorListApi } from "../../../services/api/color-codes.api";

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
  company: {
    margin: "auto",
    border: "1px solid black",
    padding: 10,
  },
  choiceUnselect: {
    margin: "auto",
    border: "1px solid black",
    padding: 10,
    opacity: 0.4,
  },
  choiceSelect: {
    margin: "auto",
    border: "1px solid black",
    padding: 10,
    opacity: 1,
  },
}));

export default function QuoteForm(props) {
  const classes = useStyles();

  const [openDetail, setOpenDetail] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const [active, setAcive] = useState(false);
  const [factoryDisplay, setFactoryDisplay] = useState("none");
  const [factory2Display, setFactory2Display] = useState("");

  const [optionFactory, setOptionFactory] = useState([]);

  const [factoryList, setFactoryList] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState([]);

  const [cityParam, setCityParam] = useState(102);
  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [countryList, setCountryList] = useState([]);

  const [pendingSelect, setPendingSelect] = useState(null);

  const [containerTypeOptions, setContainerTypeOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [openAlertDlg, setOpenAlertDlg] = useState(false);
  const [fileList, setFileList] = useState([
    {
      file_id: null,
      file_description: null,
      link: null,
      attachment: null,
      content_type: null,
      send_date: null,
      user_upload: null,
      thumbnail: null,
    },
  ]);
  const [listFile, setListFile] = useState({ quote_in_images: [] });
  const [containerDetail, setContainerDetail] = useState([
    {
      container_id: null,
      container_type: null,
      quantity: null,
      quantity_uom: null,
      container_size: null,
      container_size_uom: null,
      price: null,
      currency: null,
      ral_code: null,
    },
  ]);
  const [openFileDlg, setOpenFileDlg] = useState(false);

  const [fileId, setFileId] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState("");
  const [severity, setSeverity] = React.useState("");

  const [colorList, setColorList] = useState(null);

  const isAdmin = isPermit("menu", "admin");

  const [fileUpload, setFileUpload] = useState({
    file_id: null,
    file_description: null,
    user_upload: null,
    send_date: null,
    link: null,
    attachment: null,
    content_type: null,
    thumbnail: null,
  });

  const [data, setData] = useState({
    id: null,
    quote_in_date: Moment().format(),
    quantity: null,
    quantity_uom: "unit",
    container_type: null,
    container_size: null,
    container_size_uom: "feet",
    price: null,
    currency: null,
    validity: Moment().format(),
    factory: null,
    production_time: null,
    production_time_period: "days",
    remarks: "",
    country_id: null,
    selected_country: null,
    city_id: null,
    selected_city: null,
    country_name: null,
    city_name: null,
    container_details: [],
    quote_in_file: [],
  });
  const [errorText, setErrorText] = useState({
    quote_in_date: false,
    quantity: false,
    container_type: false,
    container_size: false,
    price: false,
    validity: false,
    factory: false,
    production_time: false,
  });
  const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" });

  const onInputChg = (event) => {
    setData({ ...data, factory: event.target.value });
  };

  const onInputChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const onInputDateChange = (event) => {
    setData({
      ...data,
      [event.target.name]: Moment(event.target.value).format(),
    });
  };

  const openAddMaster = (tipe) => {
    props?.addMaster(tipe);
  };

  var masterSwr = masterDataSwr("");
  useEffect(() => {
    if (masterSwr?.data) {
      setContainerTypeOptions(
        masterSwr?.data?.filter((val) => val?.category == "container_type") ??
          []
      );
      setSizeOptions(
        masterSwr?.data?.filter((val) => val?.category == "container_size") ??
          []
      );
    }
  }, [masterSwr?.data]);

  useEffect(async () => {
    try {
      var res = await getColorListApi();
      setColorList(res);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const onInputNumberChange = (event) => {
    if (event.target.value == "create-new") {
      if (event.target.name == "container_size") {
        openAddMaster("container_size");
      } else if (event.target.name == "container_type") {
        openAddMaster("container_type");
      }
      setPendingSelect(event.target.name);
    } else {
      setData({ ...data, [event.target.name]: parseFloat(event.target.value) });
    }
  };

  const onCountryCityChange = async (event, value, tipe) => {
    if (tipe == "country") {
      setData({
        ...data,
        country_id: value?.id ?? null,
        country_name: value?.label ?? null,
        selected_country: value ?? null,
      });
      if (value != null) {
        var city = [...cityOptions];
        if (city[value.id] == undefined) {
          setCityParam(value.id);
        }
      }
    } else if (tipe == "city") {
      setData({
        ...data,
        city_id: value?.id ?? null,
        city_name: value?.label,
        selected_city: value ?? null,
      });
    }
  };

  let param = { limit: 999 };
  var masterCurrency = getCurrencyListSwr();
  var masterContainerType = masterDataSwr("container_type", "name");
  var masterContainerSize = masterDataSwr("container_size", "name");
  var masterContainerFactory = getMasterContainerFactorySwr();

  const onFactoryChange = (event, value, extra) => {
    if (value != null) {
      var objekval = Object.values(value);
      // data.factory = objekval[0].trim();
      setData({ ...data, factory: objekval[0].trim() });
      setSelectedFactory({
        id: objekval[0],
        label: objekval[1],
      });
    } else {
      data.factory = "";
      setSelectedFactory({
        id: "",
        label: "",
      });
    }
  };

  const deleteFile = (getFileId) => {
    setOpenAlertDlg(true);

    setFileId(getFileId);
  };

  const alertSave = () => {
    setOpenAlertDlg(true);
  };
  const DeleteFileQuoteIn = () => {
    setOpen(true);
    var today = Moment().format("YYYY-MM-DDTh:mm:ss") + ".000Z";
    var dataFile = [];

    fileList?.map((row, key) => {
      if (row.file_id == fileId) {
        dataFile.push({
          file_id: row.file_id,
          file_description: row.file_description,
          user_upload: row.user_upload,
          send_date: row.send_date,
          attachment: row.attachment,
          link: row.link,
          content_type: row.content_type,
          thumbnail: row.thumbnail,
          deleted_at: today,
          deleted_by: userid,
        });
      } else {
        dataFile.push({
          file_id: row.file_id,
          file_description: row.file_description,
          user_upload: row.user_upload,
          send_date: row.send_date,
          attachment: row.attachment,
          link: row.link,
          content_type: row.content_type,
          thumbnail: row.thumbnail,
          deleted_at: row.deleted_at,
          deleted_by: row.deleted_by,
        });
      }
    });
    deleteFileQuoteIn({ quote_in_file: dataFile }, props.quote.id, fileId);
    setFileList(dataFile);
    setOpen(false);
    setOpenAlertDlg(false);
  };

  var countrySwr = getCountryListSwr("");
  useEffect(() => {
    if (countrySwr?.data) {
      var list = [];
      list.push({ id: "", label: "" });
      countrySwr.data.map((item, i) => {
        list.push({ id: item.id, label: item.name });
      });
      setCountryList(countrySwr.data);
      setCountryOptions(list);
    }
  }, [countrySwr?.data]);

  var citySwr = getCityListSwr(cityParam);
  useEffect(() => {
    if (citySwr?.data) {
      var city = [...cityOptions];
      var list = [];
      citySwr.data.cities.map((item, i) => {
        list.push({ id: item.id, label: item.name });
      });
      city[cityParam] = { id: cityParam, cities: list };
      setCityOptions(city);
      if (cityParam == 102) {
        // Australia
        setCityParam(14);
      } else if (cityParam == 14) {
        // Hong Kong
        setCityParam(98);
      } else if (cityParam == 98) {
        // US
        setCityParam(233);
      }
    }
  }, [citySwr?.data]);

  useEffect(() => {
    if (masterContainerFactory?.data) {
      setFactoryList(masterContainerFactory?.data.result ?? []);
    }
  });

  useEffect(() => {
    if (pendingSelect != null) {
      if (pendingSelect == "container_size") {
        masterContainerSize.mutate();
      }
      if (pendingSelect == "container_type") {
        masterContainerType.mutate();
      }
      setData({ ...data, [pendingSelect]: props?.newOption?.id });
      setPendingSelect(null);
    }
  }, [props?.newOption]);

  useEffect(() => {
    var list = [];
    list.push({ id: "", label: "" });
    factoryList.map((item, i) => {
      list.push({ id: item.factory, label: item.factory });
    });
    setOptionFactory(list);
  }, [factoryList]);

  useEffect(() => {
    masterContainerFactory.mutate();

    var containerType = "";
    var containerSize = "";
    if (active === false) {
      if (props.quote != null) {
        if (props.quote.id != null) {
          var selectCountry = null;
          var selectCity = null;
          if (
            props.quote.country_id != null &&
            props.quote.country_id != undefined &&
            props.quote.country_id > 0
          ) {
            countryOptions.map((item, i) => {
              if (item.id == props.quote.country_id) {
                selectCountry = item;
              }
            });
            if (props.quote.city_id != null && props.quote.city_id > 0) {
              var city = [...cityOptions];
              if (city[props.quote.country_id] == undefined) {
                setCityParam(props.quote.country_id);
              }
              city[props.quote.country_id]?.cities.map((item, i) => {
                if (item.id == props.quote.city_id) {
                  selectCity = item;
                }
              });
            }
          }

          if (props?.newOption != null) {
            containerType = props?.newOption?.id;
          } else {
            containerType = props.quote.container_type;
          }

          if (props?.newOption != null) {
            containerSize = props?.newOption?.id;
          } else {
            containerSize = props.quote.container_size;
          }

          setData({
            id: props.quote.id,
            quote_in_date: props.quote.quote_in_date,
            quantity: props.quote.quantity,
            quantity_uom: props.quote.quantity_uom,
            container_type: containerType,
            container_size: containerSize,
            container_size_uom: props.quote.container_size_uom,
            price: props.quote.price,
            currency: props.quote.currency,
            validity: props.quote.validity,
            factory: props.quote.factory,
            production_time: props.quote.production_time,
            production_time_period: props.quote.production_time_period,
            remarks: props.quote.remarks,
            country_id: props.quote.country_id,
            country_name: props.quote.country_name,
            selected_country: selectCountry,
            selected_city: selectCity,
            city_id: props.quote.city_id,
            city_name: props.quote.city_name,
            container_details: props?.quote?.container_details,
            quote_in_file: props?.quote?.quote_in_file,
          });
          var quote_in_images_arr = [];
          if (Array.isArray(props?.quote?.quote_in_images)) {
            props?.quote?.quote_in_images.map((item, i) => {
              quote_in_images_arr.push({
                name: item.label,
                progress: 100,
                link: item.link,
                content_type: item.content_type,
                loading: -1,
              });
            });
          }
          setFileList(props?.quote?.quote_in_file);

          setContainerDetail(props?.quote?.container_details);

          setListFile({ quote_in_images: quote_in_images_arr });
          setFactory2Display("");
          setFactoryDisplay("none");
          setTitle({ formTitle: "Edit Build Quote", buttonTitle: "Update" });
        } else {
          setContainerDetail([
            {
              container_id: null,
              container_type: null,
              quantity: null,
              quantity_uom: null,
              container_size: null,
              container_size_uom: null,
              price: null,
              currency: null,
              ral_code: null,
            },
          ]);
          if (props?.newOption != null) {
            containerType = props?.newOption?.id;
          } else {
            containerType = null;
          }

          if (props?.newOption != null) {
            containerSize = props?.newOption?.id;
          } else {
            containerSize = null;
          }

          setData({
            id: null,
            quote_in_date: Moment().format(),
            quantity: null,
            quantity_uom: "unit",
            container_type: containerType,
            container_size: null,
            container_size_uom: "feet",
            price: null,
            currency: "USD",
            validity: Moment().format(),
            factory: null,
            production_time: null,
            production_time_period: "days",
            remarks: "",
            country_id: null,
            selected_country: null,
            city_id: null,
            selected_city: null,
            country_name: null,
            city_name: null,
            container_details: [],
            quote_in_file: [],
          });
          setOpenDetail(false);
          setFactory2Display("none");
          setListFile({ quote_in_images: [] });
          setFactoryDisplay("");
          setTitle({ formTitle: "New Build Quote", buttonTitle: "Save" });
        }
      }
      if (props.open) {
        setAcive(true);
      }
    }
  }, [props.open]);

  function checkValidation() {
    var isValid = true;

    var eQuoteInDate = "",
      // eQuantity = "",
      // eContainerType = "",
      // eContainerSize = "",
      // ePrice = "",
      eFactory = "",
      evalidity = "",
      eProductionTime = "";

    if (data.quote_in_date == "" || data.quote_in_date == null) {
      isValid = false;
      eQuoteInDate = "Quote can not be empty";
    }
    // if (data.quantity == "" || data.quantity == null) {
    //   isValid = false;
    //   eQuantity = "Quantity can not be empty";
    // }
    // if (data.container_type == "" || data.container_type == null) {
    //   isValid = false;
    //   eContainerType = "Container Type can not be empty";
    // }
    // if (data.container_size == "" || data.container_size == null) {
    //   isValid = false;
    //   eContainerSize = "Container Size can not be empty";
    // }
    // if (data.price == "" || data.price == null) {
    //   isValid = false;
    //   ePrice = "Price can not be empty";
    // }
    if (data.validity == "" || data.validity == null) {
      isValid = false;
      evalidity = "validity can not be empty";
    }
    if (data.factory == "" || data.factory == null) {
      isValid = false;
      eFactory = "Factory can not be empty";
    }
    if (data.production_time == "" || data.production_time == null) {
      isValid = false;
      eProductionTime = "Production time can not be emptys";
    }

    setErrorText({
      ...errorText,
      quote_in_date: eQuoteInDate,
      // quantity: eQuantity,
      // container_type: eContainerType,
      // container_size: eContainerSize,
      // price: ePrice,
      validity: evalidity,
      factory: eFactory,
      production_time: eProductionTime,
    });
    return isValid;
  }

  const sendData = () => {
    if (checkValidation()) {
      setLoading(true);
      var dataTemp = "";
      if (title.buttonTitle == "Save") {
        dataTemp = insertQuoteInApi(data).then((res) => {
          saveFile(res.id);
          setLoading(false);
          setAcive(false);
          props?.closeModal();
        });
      } else {
        if (data.id != null) {
          dataTemp = updateQuoteInApi(data.id, data).then((res) => {
            saveFile(data.id);
            setLoading(false);
            setAcive(false);
            props?.closeModal();
          });
        }
      }
      masterContainerFactory.mutate();
      setLoading(false);
    }
    setOpenAlertDlg(false);
  };
  const saveFile = (id) => {
    insertFileQuoteInApi(id, fileUpload).then((res) => {
      setFileList(res.quote_in_file);
      setFileUpload({
        file_id: null,
        file_description: null,
        link: null,
        attachment: null,
        content_type: null,
        send_date: null,
        user_upload: null,
        thumbnail: null,
      });
      setOpenFileDlg(false);
    });
  };

  const sendFile = (id) => {
    var file = fileList;
    fileList.map((row, key) => {
      file.push({
        file_id: row.file_id,
        file_description: row.file_description,
        link: row.link,
        attachment: row.attachment,
        content_type: row.content_type,
        send_date: row.send_date,
        user_upload: row.user_upload,
        thumbnail: row.thumbnail,
      });
    });
    file.push(fileUpload);
    setFileList(file);
    setOpenFileDlg(false);
  };
  const openDialogDile = () => {
    setOpenFileDlg(true);
  };
  const handleFileClose = () => {
    setOpenFileDlg(false);
  };
  const closeForm = () => {
    refresh();
    setAcive(false);
    props?.closeModal();
  };

  const onChangeContainerDetail = (res, i) => {
    var list = [...containerDetail];
    var value = res.target.value;
    if (res.target.name !== "currency") {
      value = parseFloat(value);
    }
    if (res != null) {
      list[i][res.target.name] = value;
      list[i]["container_id"] = uuid();
    }
    setContainerDetail(list);

    setData({ ...data, container_details: list });
  };

  const onColorChange = (res, value, i) => {
    var list = [...containerDetail];
    if (res != null) {
      list[i]["ral_code"] = value;
      list[i]["container_id"] = uuid();
    }
    setContainerDetail(list);

    setData({ ...data, container_details: list });
  };
  const onUploaded = (res, i) => {
    var list = [...fileList];
    var today = Moment().format("YYYY-MM-DDTh:mm:ss") + ".000Z";
    if (res != null) {
      list[i]["link"] = res.link;
      list[i]["attachment"] = res.file_name;
      list[i]["content_type"] = res.content_type;
      list[i]["send_date"] = today;
      list[i]["user_upload"] = res.user_upload;
      list[i]["thumbnail"] = res.thumbnail;
      list[i]["deleted_at"] = null;
    }
    setFileList(list);
    setData({ ...data, quote_in_file: list });
    // console.log(list);
  };

  const clickAddRow = () => {
    setFileList([
      ...fileList,
      {
        file_description: null,
        link: null,
        attachment: null,
        content_type: null,
        send_date: null,
        user_upload: null,
        thumbnail: null,
        deleted_at: null,
      },
    ]);
  };

  const clickAddRowContainer = () => {
    setContainerDetail([
      ...containerDetail,
      {
        container_id: null,
        container_type: null,
        quantity: null,
        quantity_uom: null,
        container_size: null,
        container_size_uom: null,
        price: null,
        currency: null,
        ral_code: null,
      },
    ]);
  };

  const clickRemoveRow = (i) => {
    var list = [...fileList];
    list.splice(i, 1);
    setFileList(list);
    setData({ ...data, quote_in_file: list });
  };

  const clickRemoveRowContainer = (i) => {
    setOpen(true);
    var list = [...containerDetail];
    list.splice(i, 1);
    setContainerDetail(list);
    setData({ ...data, container_details: list });
    setOpen(false);
  };

  const onFileDescriptionChange = (e, i) => {
    var list = [...fileList];
    list[i]["file_description"] = e.target.value;
    setFileList(list);
    setData({ ...data, quote_in_file: list });
  };

  const onChangeUpload = (res, name) => {
    var result = [];
    res?.map((row, i) => {
      result.push({
        label: row.name,
        content_type: row.content_type,
        link: row.link,
        thumbnail: null,
      });
    });

    setData({ ...data, [name]: result });
  };

  function refresh() {
    setErrorText({
      quote_in_date: false,
      quantity: false,
      container_type: false,
      container_size: false,
      price: false,
      validity: false,
      factory: false,
      production_time: false,
    });
    setData({
      id: null,
      quote_in_date: Moment().format("YYYY-MM-DD"),
      quantity: null,
      quantity_uom: "unit",
      container_type: null,
      container_size: null,
      container_size_uom: "feet",
      price: null,
      currency: "USD",
      validity: Moment().format("YYYY-MM-DD"),
      factory: null,
      production_time: null,
      production_time_period: "days",
      remarks: "",
      country_id: null,
      selected_country: null,
      city_id: null,
      selected_city: null,
      country_name: null,
      city_name: null,
      container_details: [],
      quote_in_file: [],
    });
  }
  function changeInputFactory() {
    setFactory2Display("show");
    setFactory2Display("none");
  }
  return (
    <Modal
      open={props?.open}
      onClose={closeForm}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box className="modal-wrapper" style={{ width: "1400px" }}>
        <Card className="modal">
          <Box className="modal-header">
            <h3>{title.formTitle}</h3>
          </Box>
          <Box className="modal-content">
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={6}>
                  <TextField
                    name="quote_in_date"
                    id="quote_in_date"
                    label="Quote Date"
                    variant="outlined"
                    defaultValue={Moment(data.quote_in_date).format(
                      "YYYY-MM-DD"
                    )}
                    required
                    error={errorText.quote_in_date ? true : false}
                    helperText={errorText.quote_in_date}
                    onChange={onInputDateChange}
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="validity"
                    label="validity"
                    variant="outlined"
                    defaultValue={
                      data.validity == "Invalid date"
                        ? Moment().format("YYYY-MM-DD")
                        : Moment(data.validity).format("YYYY-MM-DD")
                    }
                    error={errorText.validity ? true : false}
                    helperText={errorText.validity}
                    onChange={onInputDateChange}
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3">
              <Autocomplete
                name="factory"
                id="factory"
                label="Factory"
                options={optionFactory}
                autoHighlight
                freeSolo
                defaultValue={{ id: data.factory, label: data.factory }}
                onChange={(e, v) => onFactoryChange(e, v, true)}
                getOptionLabel={(option) => option?.label}
                renderOption={(option) => (
                  <React.Fragment>{option?.id}</React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="factory"
                    label="Factory"
                    id="factory"
                    variant="outlined"
                    onChange={onInputChg}
                    error={errorText.factory}
                    helperText={errorText.factory}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Box>

            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={6}>
                  <TextField
                    name="production_time"
                    label="Production Time"
                    variant="outlined"
                    type="number"
                    defaultValue={data.production_time}
                    error={errorText.production_time ? true : false}
                    helperText={errorText.production_time}
                    onChange={onInputNumberChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    select
                    id="production_time_period"
                    name="production_time_period"
                    variant="outlined"
                    label="Period"
                    defaultValue={data.production_time_period}
                    onChange={onInputChange}
                    native
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  >
                    <MenuItem value={"Days"}>Days</MenuItem>
                    <MenuItem value={"Month"}>Month</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={6}>
                  <Autocomplete
                    options={countryOptions}
                    autoHighlight
                    value={data.selected_country}
                    getOptionLabel={(option) => option?.label}
                    renderOption={(option) => (
                      <React.Fragment>{option?.label}</React.Fragment>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Location (Country)"
                        name="country_id"
                        variant="outlined"
                        error={errorText.country_id ? true : false}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    )}
                    onChange={(e, v) => onCountryCityChange(e, v, "country")}
                  />
                </Grid>
                <Grid item md={6}>
                  <Autocomplete
                    options={
                      cityOptions[data.country_id]?.cities ?? [
                        { id: "", label: "" },
                      ]
                    }
                    autoHighlight
                    value={data.selected_city}
                    getOptionLabel={(option) => option?.label}
                    renderOption={(option) => (
                      <React.Fragment>{option?.label}</React.Fragment>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="(City)"
                        name="city_id"
                        variant="outlined"
                        error={errorText.city_id ? true : false}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    )}
                    onChange={(e, v) => onCountryCityChange(e, v, "city")}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3">
              <TextField
                multiline
                rows={5}
                name="remarks"
                label="Remarks"
                variant="outlined"
                type="text"
                defaultValue={data.remarks}
                onChange={onInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Paper>
              <Box className="mb-3">
                <TableContainer>
                  <Table stickyHeader aria-label="Item Description">
                    <TableHead>
                      <TableRow>
                        <TableCell colSpan={7}>Container</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell width="30%" align="left">
                          Type
                        </TableCell>
                        <TableCell width="20%" align="left">
                          Size
                        </TableCell>
                        {/* <TableCell width="15%" align="left">
                          Color
                        </TableCell> */}
                        <TableCell width="15%" align="left">
                          Qty
                        </TableCell>

                        <TableCell width="20%" align="left">
                          Price
                        </TableCell>
                        <TableCell width="10%" align="left">
                          Currency
                        </TableCell>
                        <TableCell width="5%" align="left"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <React.Fragment>
                        {containerDetail != null &&
                          containerDetail?.map(
                            (row, keyRow) =>
                              row.deleted_at == null && (
                                <TableRow hover>
                                  <TableCell key={keyRow} align="left">
                                    <TextField
                                      fullWidth
                                      select
                                      size="small"
                                      id="container_type"
                                      name="container_type"
                                      variant="outlined"
                                      value={row?.container_type}
                                      onChange={(e) =>
                                        onChangeContainerDetail(e, keyRow)
                                      }
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                    >
                                      <MenuItem value={null}>
                                        <em className="text-muted">None</em>
                                      </MenuItem>
                                      {masterContainerType?.data?.map((row) => (
                                        <MenuItem key={row?.id} value={row?.id}>
                                          {row?.name}
                                        </MenuItem>
                                      ))}
                                      {isAdmin && (
                                        <MenuItem value="create-new">
                                          <em>Add (+)</em>
                                        </MenuItem>
                                      )}
                                    </TextField>
                                  </TableCell>
                                  <TableCell key={keyRow} align="left">
                                    <TextField
                                      select
                                      size="small"
                                      id="container_size"
                                      value={row?.container_size}
                                      name="container_size"
                                      variant="outlined"
                                      onChange={(e) =>
                                        onChangeContainerDetail(e, keyRow)
                                      }
                                      fullWidth
                                    >
                                      <MenuItem value={null}>
                                        <em className="text-muted">None</em>
                                      </MenuItem>
                                      {masterContainerSize?.data?.map((row) => (
                                        <MenuItem value={row?.id}>
                                          {row?.name}
                                        </MenuItem>
                                      ))}
                                      {isAdmin && (
                                        <MenuItem value="create-new">
                                          <em>Add (+)</em>
                                        </MenuItem>
                                      )}
                                    </TextField>
                                  </TableCell>
                                  {/* <TableCell key={keyRow} align="center">
                                    <Autocomplete
                                      options={colorList?.map(
                                        (option) => option.ral_code
                                      )}
                                      autoHighlight
                                      // value={data.ral_code}
                                      defaultValue={row?.ral_code}
                                      renderOption={(option) => (
                                        <Chip
                                          size="small"
                                          label={option}
                                          style={{
                                            backgroundColor: colorList.filter(
                                              (val) => val.ral_code == option
                                            )[0].html_code,
                                            width: 250,
                                          }}
                                        />
                                      )}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label="Color Name"
                                          name="ral_code"
                                          id="ral_code"
                                          variant="outlined"
                                          size="small"
                                          error={
                                            errorText.color_name ? true : false
                                          }
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          fullWidth
                                        />
                                      )}
                                      // onChange={(e) =>
                                      //   onChangeContainerDetail(e, keyRow)
                                      // }
                                      onChange={(e, v) =>
                                        onColorChange(e, v, keyRow)
                                      }
                                    />
                                  </TableCell> */}
                                  <TableCell key={keyRow} align="left">
                                    <TextField
                                      name="quantity"
                                      variant="outlined"
                                      type="number"
                                      size="small"
                                      value={row?.quantity}
                                      error={errorText.quantity ? true : false}
                                      helperText={errorText.quantity}
                                      onChange={(e) =>
                                        onChangeContainerDetail(e, keyRow)
                                      }
                                      fullWidth
                                    />
                                  </TableCell>
                                  <TableCell key={keyRow} align="left">
                                    <TextField
                                      name="price"
                                      size="small"
                                      variant="outlined"
                                      value={row?.price}
                                      error={errorText.price ? true : false}
                                      helperText={errorText.price}
                                      onChange={(e) =>
                                        onChangeContainerDetail(e, keyRow)
                                      }
                                      type="number"
                                      fullWidth
                                    />
                                  </TableCell>
                                  <TableCell key={keyRow} align="left">
                                    <TextField
                                      select
                                      id="currency"
                                      name="currency"
                                      size="small"
                                      value={row?.currency}
                                      variant="outlined"
                                      onChange={(e) =>
                                        onChangeContainerDetail(e, keyRow)
                                      }
                                      native
                                      fullWidth
                                    >
                                      <MenuItem value={null}>
                                        <em className="text-muted">None</em>
                                      </MenuItem>
                                      {masterCurrency?.data?.map((row, key) => (
                                        <MenuItem value={row.currency}>
                                          {row.currency}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  </TableCell>
                                  <TableCell
                                    key={row?.container_id}
                                    align="left"
                                  >
                                    {keyRow != 0 && (
                                      <IconButton>
                                        <Delete
                                          onClick={() =>
                                            clickRemoveRowContainer(keyRow)
                                          }
                                        />
                                      </IconButton>
                                    )}
                                  </TableCell>
                                </TableRow>
                              )
                          )}
                        <TableRow>
                          <TableCell colSpan={6} align="left">
                            <IconButton>
                              <Add onClick={() => clickAddRowContainer()} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper>
            {/* <Paper>
              <Box className="mb-3">
                <TableContainer>
                  <Table stickyHeader aria-label="Item Description">
                    <TableHead>
                      <TableRow>
                        <TableCell width="40%" align="left">
                          File Description
                        </TableCell>
                        <TableCell width="40%" align="left">
                          File Name
                        </TableCell>
                        <TableCell width="10%" align="left"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <React.Fragment>
                        {fileList != null &&
                          fileList?.map(
                            (row, keyRow) =>
                              row.deleted_at == null && (
                                <TableRow hover>
                                  <TableCell key={row?.file_id} align="left">
                                    <TextField
                                      name="file_description"
                                      type="text"
                                      variant="outlined"
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            {row.unit}
                                          </InputAdornment>
                                        ),
                                      }}
                                      defaultValue={row?.file_description}
                                      error={errorText.file_description}
                                      helperText={errorText.file_description}
                                      onChange={(e, i) => {
                                        onFileDescriptionChange(e, keyRow);
                                      }}
                                      fullWidth
                                    />
                                  </TableCell>
                                  <TableCell key={row?.file_id} align="left">
                                    <FileUploadSecureComponent
                                      id={"file_" + keyRow}
                                      path="build_quote"
                                      fileUploaded={(res) =>
                                        onUploaded(res, keyRow)
                                      }
                                      url={fileList[keyRow].link}
                                      deleteFile={() => onUploaded(null)}
                                      fullWidth
                                    />
                                  </TableCell>
                                  <TableCell key={row?.file_id} align="left">
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      onClick={() => sendFile(props?.quote?.id)}
                                    >
                                      Send
                                    </Button>
                                  </TableCell>

                                  <TableCell key={row?.file_id} align="left">
                                    {keyRow != 0 && (
                                      <IconButton>
                                        <Delete
                                          onClick={() => clickRemoveRow(keyRow)}
                                        />
                                      </IconButton>
                                    )}
                                  </TableCell>
                                </TableRow>
                              )
                          )}
                        <TableRow>
                          <TableCell colSpan={2} align="left">
                            <IconButton>
                              <Add onClick={() => clickAddRow()} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper> */}
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={12}>
                  <InputLabel shrink={true}>Images / Files</InputLabel>
                  <DropZoneComponent
                    id="images"
                    exportList={(res) => onChangeUpload(res, "quote_in_images")}
                    data={listFile?.quote_in_images}
                    path="quote_in_images"
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box className="modal-footer">
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => alertSave()}
              disableElevation
            >
              {title.buttonTitle}
            </Button>
          </Box>
        </Card>
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <Dialog
          fullWidth
          open={openFileDlg}
          onClose={handleFileClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <DialogContentText>Add file</DialogContentText>
            <Box container>
              <Box className="mb-3 text-left">
                <TextField
                  multiline
                  rows={2}
                  name="file_description"
                  id="file_description"
                  label="File Note"
                  variant="outlined"
                  required
                  error={errorText.message}
                  helperText={errorText.message}
                  fullWidth
                />
              </Box>
              <Box className="mb-3 text-left">
                <FileUploadSecureComponent
                  id="image"
                  path="build_quote"
                  fileUploaded={(res) => onUploaded(res)}
                  url={fileUpload.link}
                  deleteFile={() => onUploaded(null)}
                />
              </Box>
              <Box className="mb-3 text-right">
                {/* <Button
                  // disabled={props?.quote?.id == null ? true : false}
                  variant="contained"
                  color="secondary"
                  onMouseEnter={() => getDesc()}
                  onFocus={() => getDesc()}
                  onClick={() => sendFile(props?.quote?.id)}
                >
                  Send
                </Button> */}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFileClose} color="primary">
              Cancel
            </Button>
            <Button color="primary">Update</Button>
          </DialogActions>
        </Dialog>
        <AlertDialog
          open={openAlertDlg}
          cancelAction={() => setOpenAlertDlg(false)}
          okAction={() => sendData()}
          title="Save confirmation"
          body="Are you sure want to save this data?"
        />
      </Box>
    </Modal>
  );
}
