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
} from "@material-ui/core";
import AlertDialog from "../../base_component/dialog";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Delete, Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { saveWOApi, updateWOFlowNext } from "../../../services/api/wo.api";
import {
  getListPOHistoryApi,
  insertFlowStatusNext,
  flowNextApi,
} from "../../../services/api/send-data.api";
import { getListProductSwr } from "../../../services/swr/product.swr";
import { getListMaterialSwr } from "../../../services/swr/material.swr";
import { masterProjectSwr } from "../../../services/swr/master-project.swr";
import { currency } from "../../../helpers/general";
import Moment from "moment";
import { CircularProgressCustom } from "../../base_component/spinner";
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

export default function WOForm(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const classes = useStyles();

  const [projectList, setProjectList] = useState([]);
  const [projectDisabled, setProjectDisabled] = useState("");
  const [productList, setProductList] = useState([]);
  const [inputList, setInputList] = useState([
    { material_id: null, qty: null, unit: null, remark: null },
  ]);
  const [materialList, setMaterialList] = useState([]);
  const [optionMaterial, setOptionMaterial] = useState([]);
  const [priceList, setPriceList] = useState([
    { price: null, selectedMaterial: null },
  ]);

  const [errorText, setErrorText] = useState({
    wo_number: null,
    project_code: null,
    project: null,
    remark: null,
    materials: null,
  });
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState({
    id: null,
    wo_number: null,
    client_id: null,
    sales_id: null,
    project: null,
    project_code: null,
    remark: null,
    materials: [],
  });
  const [woDate, setWoDate] = useState(null);
  const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" });

  const onInputChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const onMaterialChange = (event, value, i, extra) => {
    var list = [...inputList];
    var price = [...priceList];
    if (value != null) {
      list[i]["material_id"] = value.id;
    } else {
      list[i][event.target.name] =
        event.target.name == "qty"
          ? parseInt(event.target.value)
          : event.target.value;
    }
    if (extra) {
      if (event.target.value == null || value == null) {
        list[i]["unit"] = null;
        price[i]["price"] = null;
      } else {
        for (var j = 0; j < materialList.length; j++) {
          if (
            materialList[j].id == event.target.value ||
            materialList[j].id == value.id
          ) {
            list[i]["unit"] = materialList[j].unit;
            price[i]["price"] = materialList[j].price;
            var pos = j + 1;
            price[i]["selectedMaterial"] = optionMaterial[pos];
          }
        }
      }
    }
    setInputList(list);
    setPriceList(price);
    setData({ ...data, materials: list });
    console.log(price);
  };

  const clickAddRow = () => {
    setInputList([
      ...inputList,
      { material_id: null, qty: null, unit: null, remark: null },
    ]);
    setPriceList([...priceList, { price: null, selectedMaterial: null }]);
  };

  const clickRemoveRow = (i) => {
    var list = [...inputList];
    list.splice(i, 1);
    setInputList(list);
    var price = [...priceList];
    price.splice(i, 1);
    setPriceList(price);
    setData({ ...data, materials: list });
  };

  let param = { limit: 999 };
  var materialSwr = getListMaterialSwr(param);

  useEffect(() => {
    if (materialSwr?.data) {
      setMaterialList(materialSwr?.data.result ?? []);
    }
  }, [materialSwr]);

  useEffect(() => {
    var list = [];
    list.push({ id: "", label: "" });
    materialList.map((item, i) => {
      list.push({ id: item.id, label: item.code + " - " + item.material_name });
    });
    setOptionMaterial(list);
  }, [materialList]);

  useEffect(() => {
    if (props.wo != null) {
      setData({
        id: null,
        sales_order_id: props.wo.id,
        wo_number: props.wo.wo_number,
        client_id: props.wo.client_id,
        customer_id: props.wo.customer_id,
        customer_name: props.wo.customer_name,
        customer_company: props.wo.customer_company,
        customer_company_type: props.wo.customer_company_type,
        customer_company_address: props.wo.customer_company_address,
        customer_company_phone: props.wo.customer_company_phone,
        customer_company_email: props.wo.customer_company_email,
        sales_id: props.wo.sales_id,
        product_id: props.wo.product_id,
        sales_name: props.wo.sales_name,
        project_code: props.wo.project_code,
        project: props.wo.project_name,
        remark: props.wo.project_description,
        materials: props.wo.materials,
      });
      setProjectDisabled("disabled");
      setInputList(props.wo.materials);
      setWoDate(Moment(props.wo.wo_date).format("LL"));
      // var price = [];
      // for (var i = 0; i < props.wo.materials.length; i++) {
      //   for (var j = 0; j < materialList.length; j++) {
      //     if (materialList[j].id == props.wo.materials[i].material_id) {
      //       var pos = j + 1;
      //       price.push({
      //         price: materialList[j].price,
      //         selectedMaterial: optionMaterial[pos],
      //       });
      //     }
      //   }
      // }
      // setPriceList(price);
      setTitle({ formTitle: "Create Work Order", buttonTitle: "Save" });
    } else {
      setData({
        id: null,
        wo_number: null,
        client_id: null,
        sales_id: null,
        product_id: null,
        project: null,
        project_code: null,
        remark: null,
        materials: [],
      });
      setInputList([
        { material_id: null, qty: null, unit: null, remark: null },
      ]);
      setProjectDisabled("");
      setWoDate(Moment().format("LL"));
      setTitle({ formTitle: "Add Work Order", buttonTitle: "Create" });
    }
  }, [props.open]);

  function checkValidation() {
    var isValid = true;
    var eProjectCode = "",
      eClient = "",
      eSales = "",
      eProject = "",
      eRemark = "",
      eMaterials = "";
    if (data.project_code == "" || data.project_code == null) {
      isValid = false;
      eProjectCode = "Work Order Number can not be empty";
    }
    if (data.client_id == "" || data.client_id == null) {
      isValid = false;
      eClient = "Client can not be empty";
    }
    if (data.sales_id == "" || data.sales_id == null) {
      isValid = false;
      eSales = "Sales can not be empty";
    }
    // if(data.project == "" || data.project == null) {
    //     isValid = false
    //     eProject = "Project can not be empty"
    // }
    // if(data.remark == "" || data.remark == null) {
    //     isValid = false
    //     eRemark = "Remarks can not be empty"
    // }
    if (data.materials.length == 0) {
      isValid = false;
      eMaterials = "Material can not be empty";
    }
    setErrorText({
      ...errorText,
      project_code: eProjectCode,
      client_id: eClient,
      sales_id: eSales,
      project: eProject,
      remark: eRemark,
      materials: eMaterials,
    });
    return isValid;
  }

  const sendData = () => {
    if (checkValidation()) {
      setLoading(true);
      saveWOApi(data)
        .then((res) => {
          setData({
            id: null,
            wo_number: null,
            client_id: null,
            sales_id: null,
            project: null,
            project_code: null,
            remark: null,
            product_id: null,
            materials: [],
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
      wo_number: null,
      client_id: null,
      sales_id: null,
      project: null,
      project_code: null,
      product_id: null,
      remark: null,
      materials: [],
    });
    props?.closeModal();
  };
  var projectSwr = masterProjectSwr();

  useEffect(() => {
    if (projectSwr?.data) {
      setProjectList(projectSwr?.data?.result ?? []);
    }
  }, [projectSwr]);

  function onProjectChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  var productSwr = getListProductSwr({ orderBy: "company" });

  useEffect(() => {
    if (productSwr?.data) {
      setProductList(productSwr?.data?.result ?? []);
    }
  }, [productSwr]);

  function onProductChange(e) {
    setData({ ...data, product_id: e.target.value });
  }

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
              <TextField
                disabled="disabled"
                name="wo_number"
                label="Work Order Number"
                variant="outlined"
                defaultValue={data.wo_number}
                required
                error={errorText.wo_number}
                helperText={errorText.wo_number}
                onChange={onInputChange}
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                name="wo_date"
                label="Work Order Date"
                variant="outlined"
                defaultValue={woDate}
                disabled={true}
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                disabled
                label="Client"
                variant="outlined"
                defaultValue={
                  data.customer_name +
                  ", " +
                  data.customer_company +
                  " " +
                  data.customer_company_type
                }
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                disabled
                name="sales_name"
                label="Sales"
                variant="outlined"
                defaultValue={data.sales_name}
                required
                error={errorText.sales_name}
                helperText={errorText.sales_name}
                onChange={onInputChange}
                fullWidth
              />
            </Box>
            <div className="mb-3">
              <TextField
                disabled
                name="project_code"
                label="Project Code"
                variant="outlined"
                defaultValue={data.project_code}
                required
                error={errorText.project_code}
                helperText={errorText.project_code}
                onChange={onInputChange}
                fullWidth
              />
            </div>
            <Box className="mb-3">
              <TextField
                disabled
                name="project"
                label="Project"
                variant="outlined"
                defaultValue={data.project}
                error={errorText.project}
                helperText={errorText.project}
                onChange={onInputChange}
                fullWidth
              />
            </Box>

            <div className="mb-3">
              <TextField
                disabled
                name="product_id"
                select
                label="Product"
                variant="outlined"
                defaultValue={data.product_id}
                error={errorText.product_id}
                helperText={errorText.product_id}
                onChange={onProductChange}
                fullWidth
              >
                <MenuItem value={null}>
                  <em>None</em>
                </MenuItem>
                {productList?.map((row, key) => {
                  return <MenuItem value={row.id}>{row?.name}</MenuItem>;
                })}
              </TextField>
            </div>
            <Box className="mb-3">
              <TextField
                disabled
                name="remark"
                label="Remarks"
                variant="outlined"
                defaultValue={data.remark}
                error={errorText.remark}
                helperText={errorText.remark}
                onChange={onInputChange}
                fullWidth
              />
            </Box>
            <h2 className="mb-3 mt-5">Materials</h2>
            <Box className="mb-3">
              <Grid
                container
                spacing={2}
                justify="center"
                alignItems="center"
                className={classes.root}
              >
                <Grid item xs={5} sm={5}>
                  <Typography variant="h4">Material</Typography>
                </Grid>
                <Grid item xs={2} sm={2}>
                  <Typography variant="h4">Prices</Typography>
                </Grid>
                <Grid item xs={2} sm={2}>
                  <Typography variant="h4">Quantity</Typography>
                </Grid>
                <Grid item xs={2} sm={2}>
                  <Typography variant="h4">Remark</Typography>
                </Grid>
                <Grid item xs={1} sm={1}></Grid>
                {inputList?.map((row, key) => (
                  <React.Fragment>
                    <Grid item xs={5} sm={5}>
                      <Autocomplete
                        options={optionMaterial}
                        autoHighlight
                        value={priceList[key]?.selectedMaterial}
                        getOptionLabel={(option) => option?.label}
                        renderOption={(option) => (
                          <React.Fragment>{option?.label}</React.Fragment>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="material_id"
                            variant="outlined"
                            error={errorText.materials}
                            helperText={errorText.materials}
                            fullWidth
                          />
                        )}
                        onChange={(e, v) => onMaterialChange(e, v, key, true)}
                      />
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      {currency(priceList[key]?.price)}
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <TextField
                        name="qty"
                        type="number"
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {row.unit}
                            </InputAdornment>
                          ),
                        }}
                        defaultValue={row.qty}
                        error={errorText.materials}
                        helperText={errorText.materials}
                        onChange={(e) => onMaterialChange(e, null, key, false)}
                      />
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <TextField
                        name="remark"
                        variant="outlined"
                        defaultValue={row.remark}
                        onChange={(e) => onMaterialChange(e, null, key, false)}
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
                <Grid item xs={12} sm={12}>
                  <IconButton>
                    <Add onClick={() => clickAddRow()} />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box className="modal-footer">
            <Grid container spacing={3}>
              <Grid item xs={6}>
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
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => confirmSend()}
                  disableElevation
                >
                  {isLoading ? (
                    <CircularProgressCustom size={26} />
                  ) : props?.isEdit ? (
                    "Create Work Order"
                  ) : (
                    "Create Work Order"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <AlertDialog
            open={openDialog}
            cancelAction={() => setOpenDialog(false)}
            okAction={() => sendDataNext()}
            title="Send data confirmation"
            body="Are you sure want to create work order ?"
          />
        </Card>
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Modal>
  );
}
