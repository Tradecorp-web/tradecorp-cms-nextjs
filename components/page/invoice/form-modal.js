import {
  Button,
  Card,
  makeStyles,
  Grid,
  IconButton,
  Typography,
  Box,
  TextField,
  MenuItem,
  Modal,
  InputLabel,
  InputBase,
  Backdrop,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Delete, Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import AlertDialog from "../../base_component/dialog";
import Moment from "moment";
import { dateFormatInput } from "../../../helpers/general";
import { updateWOFlowNext } from "../../../services/api/wo.api";
import { insertFlowStatusNext } from "../../../services/api/send-data.api";
import { getListContainerStockSwr } from "../../../services/swr/container-stock.swr";
import { getListCustomerSwr } from "../../../services/swr/customer.swr";
import { saveInvoiceApi } from "../../../services/api/invoice.api";
import { getInvoiceDetailSwr } from "../../../services/swr/invoice.swr";

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

export default function EditInvoiceForm(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const classes = useStyles();
  const [containerList, setContainerList] = useState([]);
  const [optionContainerList, setOptionContainerList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [disabled, setDisabled] = useState("");
  const [invoiceDate, setInvoiceDate] = useState();
  const [invoiceDueDate, setInvoiceDueDate] = useState();
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
    invoice_date: null,
    invoice_due_date: null,
    invoice_number: null,
    invoice_description: null,
    title: null,
    sales_name: null,
    sales_phone: null,
    taxes_persen: null,
    customer_id: null,
    customer_name: null,
    customer_contact: null,
    customer_address: null,
    customer_phone: null,
    customer_delivery_address: null,
    customer_email: null,
    sales_id: null,
    containers: [],
    company_id: null,
    project_description: null,
  });
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState({
    id: null,
    invoice_date: null,
    invoice_due_date: null,
    invoice_number: null,
    invoice_description: null,
    title: null,
    taxes_persen: null,
    customer_id: null,
    customer_name: null,
    customer_contact: null,
    customer_address: null,
    customer_phone: null,
    customer_delivery_address: null,
    customer_email: null,
    sales_name: null,
    sales_phone: null,
    containers: [],
    company_id: null,
    project_description: null,
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
  let invDataDetail = getInvoiceDetailSwr(props.invoiceId);

  useEffect(() => {
    if (props?.invData != null) {
      setData({
        id: props?.invData?.id,
        invoice_date: dateFormatInput(props?.invData?.invoice_date),
        invoice_due_date: dateFormatInput(props?.invData?.invoice_due_date),
        invoice_number: props?.invData?.invoice_number,
        invoice_description: props?.invData?.invoice_description,
        title: props?.invData?.title,
        project_description: props?.invData?.project_description,
        taxes_persen: props?.invData?.taxes_persen,
        containers: props?.invData?.containers,
        customer_id: props?.invData?.customer_id,
        customer_name: props?.invData?.customer_name,
        customer_contact: props?.invData?.customer_contact,
        customer_address: props?.invData?.customer_address,
        customer_phone: props?.invData?.customer_phone,
        customer_delivery_address: props?.invData?.customer_delivery_address,
        customer_email: props?.invData?.customer_email,
        // sales_id: props?.invData?.sales_id,
        sales_name: props?.invData?.sales_name,
        sales_phone: props?.invData?.sales_phone,
        company_id: props?.invData?.company_id,
      });
      setInputList(props?.invData?.containers);
      setInvoiceDate(Moment(props?.invData?.invoice_date).format("LL"));
      setInvoiceDueDate(Moment(props?.invData?.invoice_due_date).format("LL"));
      setDisabled(true);
      setTitle({ formTitle: "Edit Invoice", buttonTitle: "Save" });
      let containerSelect = [];
      if (props?.invData?.containers != null) {
        for (let i = 0; i < props?.invData?.containers.length; i++) {
          let pos = i + 1;
          containerSelect.push({
            selectedContainer: optionContainerList[pos],
          });
        }
        setContainerSelectList(containerSelect);
      } else {
        setContainerSelectList([]);
      }
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
      saveInvoiceApi(data)
        .then((res) => {
          setData({
            id: null,
            title: null,
            invoice_description: null,
            taxes_persen: null,
            company_id: null,
            invoice_date: null,
            invoice_number: null,
            project_name: null,
            project_description: null,
            sales_name: null,
            sales_phone: null,
            invoice_due_date: null,
            // client: null,
            customer_id: null,
            customer_name: null,
            customer_contact: null,
            customer_address: null,
            customer_phone: null,
            customer_delivery_address: null,
            customer_email: null,
            containers: [],
            // sales_id: null,
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
      title: null,
      invoice_description: null,
      taxes_persen: null,
      company_id: null,
      invoice_date: null,
      invoice_number: null,
      project_name: null,
      project_description: null,
      invoice_due_date: null,
      customer_name: null,
      customer_contact: null,
      customer_address: null,
      customer_phone: null,
      customer_delivery_address: null,
      customer_email: null,
      customer_id: null,
      sales_name: null,
      sales_phone: null,
      containers: [],
    });
    props?.closeModal();
  };

  // var productSwr = getListProductSwr({ orderBy: "company" });
  let containerSwr = getListContainerStockSwr({
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
      let valData = value.label.split(" - ");
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
      if (item.stock_status_id === 1005) {
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
                <Typography variant="caption">Invoice Date</Typography>
              </InputLabel>
              <InputBase
                name="invoice_date"
                label="Invoice Date"
                color="secondary"
                className="input"
                type="date"
                value={data?.invoice_date}
                onChange={onInputDateChange}
                fullWidth
              ></InputBase>
            </Box>
            <Box className="mb-3">
              <InputLabel className="pb-1">
                <Typography variant="caption">Invoice Due Date</Typography>
              </InputLabel>
              <InputBase
                name="invoice_due_date"
                label="Invoice Due Date"
                variant="outlined"
                color="secondary"
                className="input"
                type="date"
                value={data?.invoice_due_date}
                onChange={onInputDateChange}
                fullWidth
              ></InputBase>
            </Box>
            <Box className="mb-3">
              <TextField
                name="invoice_number"
                label="Invoice Number"
                variant="outlined"
                defaultValue={data?.invoice_number}
                disabled="disabled"
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                name="invoice_description"
                label="Invoice Description"
                variant="outlined"
                defaultValue={data?.invoice_description}
                multiline={true}
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                disabled="disabled"
                name="sales_name"
                label="Sales Name"
                variant="outlined"
                defaultValue={data?.sales_name}
                required
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                disabled="disabled"
                name="sales_phone"
                label="Sales Phone"
                variant="outlined"
                defaultValue={data?.sales_phone}
                required
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                disabled="disabled"
                name="customer_name"
                label="Customer Name"
                variant="outlined"
                defaultValue={data?.customer_name}
                required
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                disabled="disabled"
                name="customer_contact"
                label="Customer Contact"
                variant="outlined"
                defaultValue={data?.customer_contact}
                required
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                disabled="disabled"
                name="customer_delivery_address"
                label="Customer Delivery Address"
                variant="outlined"
                defaultValue={data?.customer_delivery_address}
                required
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                disabled="disabled"
                name="customer_phone"
                label="Customer Phone"
                variant="outlined"
                defaultValue={data?.customer_phone}
                required
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                disabled="disabled"
                name="customer_email"
                label="Customer Email"
                variant="outlined"
                defaultValue={data?.customer_email}
                required
                fullWidth
              />
            </Box>

            {/*<div className="mb-3">*/}
            {/*<TextField*/}
            {/*    disabled="disabled"*/}
            {/*    name="customer_id"*/}
            {/*    select*/}
            {/*    label="Customer"*/}
            {/*    variant="outlined"*/}
            {/*    defaultValue={data.customer_id + "||" + data.client}*/}
            {/*      error={errorText.customer_id}*/}
            {/*      helperText={errorText.customer_id}*/}
            {/*      onChange={onCustomerChange}*/}
            {/*      fullWidth*/}
            {/*  >*/}
            {/*    <MenuItem value={null}>*/}
            {/*       <em>None</em>*/}
            {/*     </MenuItem>*/}
            {/*     {customerList?.map((row, key) => {*/}
            {/*      return (*/}
            {/*          <MenuItem value={row.id + "||" + row.customer_code}>*/}
            {/*            {row?.company}.{row?.company_type} ({row?.name})*/}
            {/*          </MenuItem>*/}
            {/*      );*/}
            {/*    })}*/}
            {/*  </TextField>*/}
            {/*</div>*/}

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

            <h2 className="mb-3 mt-5">Container</h2>
            {/*<Box className="mb-3">*/}
            {/*  <Grid*/}
            {/*      container*/}
            {/*      spacing={2}*/}
            {/*      justify="center"*/}
            {/*      alignItems="center"*/}
            {/*      className={classes.root}*/}
            {/*  >*/}
            {/*    <Grid item xs={5} sm={5}>*/}
            {/*      <Typography variant="h4">Serial Number</Typography>*/}
            {/*    </Grid>*/}

            {/*    <Grid item xs={2} sm={2}>*/}
            {/*      <Typography variant="h4">Sale Status</Typography>*/}
            {/*    </Grid>*/}
            {/*    <Grid item xs={4} sm={4}>*/}
            {/*      <Typography variant="h4">Remark</Typography>*/}
            {/*    </Grid>*/}

            {/*    <Grid item xs={1} sm={1}></Grid>*/}
            {/*    {inputList?.map((row, key) => (*/}
            {/*        <React.Fragment>*/}
            {/*          <Grid item xs={5} sm={5}>*/}
            {/*            <TextField*/}
            {/*                name="container_id"*/}
            {/*                select*/}
            {/*                label="Container"*/}
            {/*                variant="outlined"*/}
            {/*                defaultValue={row.container_id}*/}
            {/*                error={errorText.container_id}*/}
            {/*                helperText={errorText.container_id}*/}
            {/*                onChange={(e) => onContainerChange(e, null, key, false)}*/}
            {/*                fullWidth*/}
            {/*            >*/}

            {/*              <MenuItem value={null}>*/}
            {/*                <em>None</em>*/}
            {/*              </MenuItem>*/}
            {/*              {containerList?.map((row2, key) => {*/}
            {/*                return (*/}
            {/*                    <MenuItem value={row2.id}>*/}
            {/*                      /!*<MenuItem value={row2.serial_number}>*!/*/}
            {/*                      {row2?.serial_number} - {row2?.size?.name} - {row2?.type?.name}*/}
            {/*                    </MenuItem>*/}
            {/*                );*/}
            {/*              })}*/}
            {/*            </TextField>*/}
            {/*          </Grid>*/}
            {/*          <Grid item xs={2} sm={2}>*/}
            {/*            <TextField*/}
            {/*                name="sale_status"*/}
            {/*                select*/}
            {/*                variant="outlined"*/}
            {/*                defaultValue={row.sale_status}*/}
            {/*                error={errorText.sale_status}*/}
            {/*                helperText={errorText.sale_status}*/}
            {/*                onChange={(e) => onContainerChange(e, null, key, false)}*/}
            {/*                fullWidth*/}
            {/*            >*/}
            {/*              <MenuItem value="sale">*/}
            {/*                <em>Sale</em>*/}
            {/*              </MenuItem>*/}
            {/*              <MenuItem value="lease">*/}
            {/*                <em>Lease</em>*/}
            {/*              </MenuItem>*/}
            {/*            </TextField>*/}
            {/*          </Grid>*/}

            {/*          <Grid item xs={4} sm={4}>*/}
            {/*            <TextField*/}
            {/*                name="remark"*/}
            {/*                variant="outlined"*/}
            {/*                defaultValue={row.remark}*/}
            {/*                onChange={(e) => onContainerChange(e, null, key, false)}*/}
            {/*                fullWidth*/}
            {/*            />*/}
            {/*          </Grid>*/}
            {/*          <Grid item xs={1} sm={1}>*/}
            {/*            {key != 0 && (*/}
            {/*                <IconButton>*/}
            {/*                  <Delete onClick={() => clickRemoveRow(key)} />*/}
            {/*                </IconButton>*/}
            {/*            )}*/}
            {/*          </Grid>*/}
            {/*        </React.Fragment>*/}
            {/*    ))}*/}
            {/*  </Grid>*/}
            {/*</Box>*/}
            {/*<Box className="mb-3">*/}
            {/*  <Grid item xs={12} sm={12}>*/}
            {/*    <IconButton>*/}
            {/*      <Add onClick={() => clickAddRow()} />*/}
            {/*    </IconButton>*/}
            {/*  </Grid>*/}
            {/*</Box>*/}
          </Box>

          <Box className="modal-footer">
            {props?.invData?.payment_terms?.map((res) => (
              <Grid container spacing={3}>
                <Grid item xs={2}>
                  {res.payment_id}
                </Grid>
                <Grid item xs={2}>
                  {res.payment_number}
                </Grid>
                <Grid item xs={2}>
                  {res.payment_type}
                </Grid>
                <Grid item xs={2}>
                  {res.payment_detail_description}
                </Grid>
                <Grid item xs={2}>
                  {res.payment_term_type}
                </Grid>
                <Grid item xs={2}>
                  {res.payment_value}
                </Grid>
              </Grid>
            ))}
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
