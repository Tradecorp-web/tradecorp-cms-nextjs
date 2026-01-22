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
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
} from "@material-ui/core";
import AlertDialog from "../../base_component/dialog";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Delete, Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { saveWOApi, updateWOFlowNext } from "../../../services/api/wo.api";
import { saveSalesOrderApi } from "../../../services/api/sales-order.api";

import {
  getListPOHistoryApi,
  insertFlowStatusNext,
  flowNextApi,
} from "../../../services/api/send-data.api";

import { getListCustomerSwr } from "../../../services/swr/customer.swr";
import { getListProductSwr } from "../../../services/swr/product.swr";
import { getListContainerStockSwr } from "../../../services/swr/container-stock.swr";
import { masterProjectSwr } from "../../../services/swr/master-project.swr";
import { currency } from "../../../helpers/general";
import Moment from "moment";
import { CircularProgressCustom } from "../../base_component/spinner";
import { dateFormatInput } from "../../../helpers/general";
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

export default function SOForm(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [formState, setFormState] = useState(null);

  const classes = useStyles();

  const [containerList, setContainerList] = useState([]);

  const [optionContainerList, setOptionContainerList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [disabled, setDisabled] = useState("");
  const [soDate, setSoDate] = useState();
  const [estimateDeliveryDate, setEstimateDeliveryDate] = useState();
  const [containerSelectList, setContainerSelectList] = useState([]);
  const [formValues, SetFormValues] = useState();
  const [inputList, setInputList] = useState([
    {
      container_id: null,
      container_size: null,
      container_type: null,
      serial_number: null,
      sales_status: null,
      remark: null,
    },
  ]);

  const [errorText, setErrorText] = useState({
    id: null,
    order_date: null,
    project_code: null,
    project_name: null,
    project_description: null,
    estimate_delivery_date: null,
    client: null,
    customer_id: null,
    containers: null,
    sales_id: null,
  });
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState({
    id: null,
    order_date: null,
    project_code: null,
    project_name: null,
    project_description: null,
    estimate_delivery_date: null,

    client: null,
    customer_id: null,
    // containers: null,
    sales_id: null,
    containers: [],
  });

  const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" });

  const onInputChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const onInputDateChange = (event) => {
    setData({
      ...data,
      [event.target.name]: dateFormatInput(event.target.value),
    });
  };

  let param = { limit: 999 };

  useEffect(() => {
    if (props.so != null) {
      setData({
        id: props.so.id,
        order_date: dateFormatInput(props.so.order_date),
        project_code: props.so.project_code,
        project_name: props.so.project_name,
        project_description: props.so.project_description,
        estimate_delivery_date: dateFormatInput(props.so.estimate_delivery_date),

        client: props.so.client,
        customer_id: props.so.customer_id,
        sales_id: props.so.sales_id,
        sales_name: props.so.sales_name,
        containers: props.so.containers,
      });
      setInputList(props.so.containers);

      setSoDate(Moment(props.so.order_date).format("LL"));
      setEstimateDeliveryDate(Moment(props.so.estimate_delivery_date).format("LL"));
      setDisabled(true);
      setTitle({ formTitle: "Edit Sales Order", buttonTitle: "Save" });

      var containerSelect = [];
      if (props.so.containers != null) {
        for (var i = 0; i < props.so.containers.length; i++) {
          var pos = i + 1;
          containerSelect.push({
            selectedContainer: optionContainerList[pos],
          });
        }
        setContainerSelectList(containerSelect);
      } else {
        setContainerSelectList([]);
      }
    } else {
      setData({
        id: null,
        order_date: null,
        project_code: null,
        project_name: null,
        project_description: null,
        estimate_delivery_date: null,

        client: null,
        customer_id: null,
        containers: [],
        sales_id: null,
      });
      setInputList([]);
      setDisabled(false);
      setTitle({ formTitle: "Add Sales Order", buttonTitle: "Create" });
    }
  }, [props.open]);

  function checkValidation() {
    let isValid = true;
    // var eProjectCode = "",
    //   eClient = "",
    //   eSales = "",
    //   eProject = "",
    //   eRemark = "",
    //   eMaterials = "";
    // if (data.project_code == "" || data.project_code == null) {
    //   isValid = false;
    //   eProjectCode = "Work Order Number can not be empty";
    // }
    // if (data.client_id == "" || data.client_id == null) {
    //   isValid = false;
    //   eClient = "Client can not be empty";
    // }
    // if (data.sales_id == "" || data.sales_id == null) {
    //   isValid = false;
    //   eSales = "Sales can not be empty";
    // }
    // if(data.project == "" || data.project == null) {
    //     isValid = false
    //     eProject = "Project can not be empty"
    // }
    // if(data.remark == "" || data.remark == null) {
    //     isValid = false
    //     eRemark = "Remarks can not be empty"
    // }
    // if (data.materials.length == 0) {
    //   isValid = false;
    //   eMaterials = "Material can not be empty";
    // }
    // setErrorText({
    //   ...errorText,
    //   project_code: eProjectCode,
    //   client_id: eClient,
    //   sales_id: eSales,
    //   project: eProject,
    //   remark: eRemark,
    //   materials: eMaterials,
    // });
    return isValid;
  }

  const sendData = () => {
    if (checkValidation()) {
      setLoading(true);
      saveSalesOrderApi(data)
        .then((res) => {
          setData({
            id: null,
            order_date: null,
            project_code: null,
            project_name: null,
            project_description: null,
            estimate_delivery_date: null,
            client: null,
            customer_id: null,
            containers: [],
            sales_id: null,
          });
          setLoading(false);
          props?.closeModal();
        })
        .catch((err) => {
          console.log(err);
          //setErrorText(err)
          setLoading(false);
        });
    }
  };
  //send data

  const confirmSend = () => {
    setOpenDialog(true);
  };

  function sendDataNext() {
    if (props?.wo?.id != null) {
      updateWOFlowNext(props?.wo?.id)
        .then((res) => {
          insertFlowStatusNext("wo", props?.wo?.wo_number);
          setLoading(false);
          props?.closeModal();
        })
        .catch((err) => {
          console.log(err);
          setErrorText(err);
        });
    } else {
      alert("Only in edit mode");
    }
  }
  //==send data
  const closeForm = () => {
    setData({
      id: null,
      order_date: null,
      project_code: null,
      project_name: null,
      project_description: null,
      estimate_delivery_date: null,

      client: null,
      customer_id: null,
      // containers: null,
      sales_id: null,
      containers: [],
    });
    props?.closeModal();
  };

  // var productSwr = getListProductSwr({ orderBy: "company" });
  var containerSwr = getListContainerStockSwr({
    // status: 1005,
    orderBy: "serial_number",
  });

  useEffect(() => {
    containerSwr.mutate();
    if (containerSwr?.data) {
      setContainerList(containerSwr?.data?.result ?? []);
    }
  }, [containerSwr]);

  const onContainerChange = (event, value, i, extra) => {
    let list = [...inputList];
    if (value != null) {
      var valData = value.label.split(" - ");
      if (valData[2].indexOf(" *") >= 0) {
        list[i]["container_id"] = value.id;
        list[i]["container_size"] = Number(valData[0]);
        list[i]["container_type"] = valData[1];
        list[i]["serial_number"] = valData[2];
      } else {
        alert("Status not ready");
        SetFormValues([""]);
      }
    } else {
      list[i][event.target.name] = event.target.value;
    }
    setInputList(list);
    setData({ ...data, containers: list });
  };

  useEffect(() => {
    let list = [];
    list.push({ id: "", label: "" });

    containerList.map((item, i) => {
      if (item.stock_status_id == 1005) {
        list.push({
          id: item.id,
          label:
            item.size.name +
            " - " +
            item.type.name +
            " - " +
            item.serial_number +
            " *",
        });
      } else {
        list.push({
          id: item.id,
          label:
            item.size.name +
            " - " +
            item.type.name +
            " - " +
            item.serial_number,
        });
      }
    });

    setOptionContainerList(list);
  }, [containerList]);

  let customerSwr = getListCustomerSwr({ orderBy: "company" });

  useEffect(() => {
    if (customerSwr?.data) {
      setCustomerList(customerSwr?.data?.result ?? []);
    }
  }, [customerSwr]);

  function onCustomerChange(e) {
    let compArr = e.target.value.split("||");
    setData({ ...data, customer_id: compArr[0], client: compArr[1] });
  }

  const clickAddRow = () => {
    setInputList([
      ...inputList,
      {
        container_id: null,
        container_size: null,
        container_type: null,
        serial_number: null,
        sales_status: null,
        remark: null,
      },
    ]);
  };
  const clickRemoveRow = (i) => {
    let list = [...inputList];
    list.splice(i, 1);
    setInputList(list);
    setData({ ...data, containers: list });
  };

  const dummyProjectCode = [
    { code: "P-00001" },
    { code: "P-00002" },
    { code: "P-00003" },
  ];

  const dummyProjectName = [
    {name: "Formula e"},
    {name: "Proyek Rokan Hilir"},
    {name: "Proyek Palangkaraya"},
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (event, value) => setSelectedOptions(value);
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
            <h3>{title.formTitle}</h3>
          </Box>
          <Box className="modal-content">
            <h2 className="mb-3">Details</h2>
            <Box className="mb-3">
              <InputLabel className="pb-1">
                <Typography variant="caption">Order Date</Typography>
              </InputLabel>
              <InputBase
                name="order_date"
                label="Order Date"
                variant="outlined"
                color="secondary"
                type="date"
                value={data?.order_date}
                onChange={onInputDateChange}
                fullWidth
              ></InputBase>
            </Box>
            <Box className="mb-3">
              <InputLabel className="pb-1">
                <Typography variant="caption">Estimate Delivery</Typography>
              </InputLabel>
              <InputBase
                name="estimate_delivery_date"
                label="Estimate Delivery Date"
                variant="outlined"
                color="secondary"
                type="date"
                value={data?.estimate_delivery_date}
                onChange={onInputDateChange}
                fullWidth
              ></InputBase>
            </Box>
            <Box className="mb-3">
              <Autocomplete
                  options={dummyProjectCode}
                  getOptionLabel={(option) => option.code}
                  onChange={(event, value) => console.log(value)}
                  renderInput={(params) => (
                      <TextField {...params} label="Project Code" variant="outlined" fullWidth />
                  )}
                  fullWidth
              />
            </Box>
            <Box className="mb-3">
              <Autocomplete
                  options={dummyProjectName}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => <TextField {...params} label="Project Name" variant="outlined" />}
                  onChange={(event, value) => console.log(value)}
                  fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                  name="project_description"
                  label="Project Description"
                  variant="outlined"
                  defaultValue={data.project_description}
                  onChange={onInputChange}
                  multiline={true}
                  required
                  fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                disabled="disabled"
                name="sales"
                label="Sales"
                variant="outlined"
                defaultValue={data.sales_name}
                required
                fullWidth
              />
            </Box>
            <div className="mb-3">
              <TextField
                disabled={disabled}
                name="customer_id"
                select
                label="Customer"
                variant="outlined"
                defaultValue={data.customer_id + "||" + data.client}
                error={errorText.customer_id}
                helperText={errorText.customer_id}
                onChange={onCustomerChange}
                fullWidth
              >
                <MenuItem value={null}>
                  <em>None</em>
                </MenuItem>
                {customerList?.map((row, key) => {
                  return (
                    <MenuItem value={row.id + "||" + row.customer_code}>
                      {row?.company}.{row?.company_type} ({row?.name})
                    </MenuItem>
                  );
                })}
              </TextField>
            </div>
            <h2 className="mb-3 mt-5">Container</h2>
            <Box className="mb-3">
              <Grid
                container
                spacing={2}
                justify="center"
                alignItems="center"
                className={classes.root}
              >
                <Grid item xs={5} sm={5}>
                  <Typography variant="h4">Serial Number</Typography>
                </Grid>

                <Grid item xs={2} sm={2}>
                  <Typography variant="h4">Sale Status</Typography>
                </Grid>
                <Grid item xs={4} sm={4}>
                  <Typography variant="h4">Remark</Typography>
                </Grid>

                <Grid item xs={1} sm={1}></Grid>
                {inputList?.map((row, key) => (
                  <React.Fragment>
                    <Grid item xs={5} sm={5}>
                      {/* <Autocomplete
                        key={formValues}
                        options={optionContainerList}
                        autoHighlight
                        defaultValue={
                          containerSelectList[key]?.selectedContainer
                        }
                        getOptionLabel={(option) => option?.label}
                        renderOption={(option) => (
                          <React.Fragment>{option?.label}</React.Fragment>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="container_id"
                            variant="outlined"
                            error={errorText.container_id}
                            helperText={errorText.container_id}
                            fullWidth
                          />
                        )}
                        onChange={(e, v) => {
                          onContainerChange(e, v, key, true);
                          SetFormValues(v);
                        }}
                      /> */}
                      <TextField
                        name="container_id"
                        select
                        label="Container"
                        variant="outlined"
                        defaultValue={row.container_id}
                        error={errorText.container_id}
                        helperText={errorText.container_id}
                        onChange={(e) => onContainerChange(e, null, key, false)}
                        fullWidth
                      >

                        <MenuItem value={null}>
                          <em>None</em>
                        </MenuItem>
                        {containerList?.map((row2, key) => {
                          return (
                            <MenuItem value={row2.id}>
                              {/*<MenuItem value={row2.serial_number}>*/}
                              {row2?.serial_number} - {row2?.size?.name} -{" "}
                              {row2?.type?.name}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <TextField
                        name="sale_status"
                        select
                        variant="outlined"
                        defaultValue={row.sale_status}
                        error={errorText.sale_status}
                        helperText={errorText.sale_status}
                        onChange={(e) => onContainerChange(e, null, key, false)}
                        fullWidth
                      >
                        <MenuItem value="sale">
                          <em>Sale</em>
                        </MenuItem>
                        <MenuItem value="lease">
                          <em>Lease</em>
                        </MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={4} sm={4}>
                      <TextField
                        name="remark"
                        variant="outlined"
                        defaultValue={row.remark}
                        onChange={(e) => onContainerChange(e, null, key, false)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={1} sm={1}>
                      {key != 0 && (
                        <IconButton>
                          <Delete onClick={() => clickRemoveRow(key)} />
                        </IconButton>
                      )}
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Box>
            <Box className="mb-3">
              <Grid item xs={12} sm={12}>
                <IconButton>
                  <Add onClick={() => clickAddRow()} />
                </IconButton>
              </Grid>
            </Box>
          </Box>

          <Box className="modal-footer">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={sendData}
                  disableElevation
                >
                  {title.buttonTitle}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <AlertDialog
            open={openDialog}
            cancelAction={() => setOpenDialog(false)}
            okAction={() => sendDataNext()}
            title="Send data confirmation"
            body="Are you sure want to send this record?"
          />
        </Card>
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Modal>
  );
}
