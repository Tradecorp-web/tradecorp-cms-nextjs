import {
  Button,
  makeStyles,
  Grid,
  IconButton,
  Typography,
  Box,
  TextField,
  MenuItem,
  Collapse,
  Divider,
  Icon,
  OutlinedInput,
  Card,
  CardHeader,
  Checkbox,
  ListItemIcon,
  List,
  ListItemText,
  ListItem,
} from "@material-ui/core";
import { LOCAL_STORAGE_SCALE } from "../../../helpers/consts";
import { Autocomplete, Alert } from "@material-ui/lab";
import BaseLayout from "../../base_layout/base-layout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CloseIcon from "@material-ui/icons/Close";
import getRoute from "../../../helpers/router";
import Paper from "@material-ui/core/Paper";
import ButtonBase from "@material-ui/core/ButtonBase";
import {
  getListSOStatusAcc,
  getListSOGroup,
  getListProject,
} from "../../../services/swr/sales-order.swr";
import {
  getDetailSalesOrderApi,
  getSOProjectListApi,
} from "../../../services/api/sales-order.api";
import { dateFormatInput } from "../../../helpers/general";
import { saveInvoiceApi } from "../../../services/api/invoice.api";

import AlertDialog from "../../base_component/dialog";

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
  labelbase: {
    marginTop: 10,
    fontSize: 12,
  },
  labelbasebold: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "bold",
  },
  inputbase: {
    fontSize: "12px !important",
    height: 30,
  },
  inputbasemultiline: {
    fontSize: "12px !important",
  },

  inputbasemultilinero: {
    fontSize: "12px !important",
    backgroundColor: "#eaecee",
    color: "#000000",
  },

  inputbasero: {
    fontSize: "12px !important",
    height: 30,
    backgroundColor: "#eaecee",
    color: "#000000",
  },
  comboOptions: {
    fontSize: "12px",
    color: "#000000",
  },
  tablehead: {
    fontSize: "12px",
    color: "#000000",
    fontWeight: "bold",
  },
  tablefooter: {
    color: "#000000",
    fontWeight: "bold",
  },
  tableheadr: {
    fontSize: "12px",
    color: "#000000",
    fontWeight: "bold",
    textAlign: "right",
  },
  tablerow: {
    fontSize: "12px",
    color: "#000000",
  },
  tablerowr: {
    fontSize: "12px",
    color: "#000000",
    textAlign: "right",
  },
  titlecard: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000",
  },

  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 688,
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function NewInvoiceForm() {
  const router = useRouter();
  const classes = useStyles();

  /*Start of const variable*/
  const scale = localStorage.getItem(LOCAL_STORAGE_SCALE);
  const [customerId, setCustomerId] = useState("");
  const [open, setOpen] = useState(false);
  const [optionSalesOrderList, setOptionSalesOrderList] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [formState, setFormState] = useState({
    // id: "",
    invoice_date: "",
    invoice_number: "",
    invoice_description: "",
    company_id: "",
    sales_id: "",
    sales_name: "",
    sales_phone: "",
    sales_email: "",
    customer_id: "",
    customer_name: "",
    customer_address: "",
    customer_company_name: "",
    customer_phone: "",
    customer_email: "",
    customer_code: "",
    project_code: "",
    project_name: "",
    project_description: "",
    quote_date: "",
    income_type: "",
    status_acc: 0,
    order_date: "",
    estimate_delivery_date: "",
    total_payment: 0,
    payment_terms: [],
    tax_percent: "",
    payment_approve: "",
    invoice_status: "",
    description_container: [],
  });

  const [errorText, setErrorText] = useState({
    invoice_date: null,
    invoice_description: null,
    sales_id: null,
    containers: [],
    description: [],
    company_id: null,
    project_code: null,
    purchase_order_code: null,
    invoice_status: null,
  });
  const [salesOrderList, setSalesOrderList] = useState([]);
  const [tax, setTax] = useState(0);
  const [disableSave, setDisableSave] = useState(true);
  const [incomeTypeList, setIncomeTypeList] = useState([]);
  const [incomeType, setIncomeType] = useState("");
  const [paymentTermList, setPaymentTermList] = useState([]);
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [projectCode, setProjectCode] = useState("-");
  const [projectData, setProjectData] = useState([]);

  /*End of const variable*/

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;
  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedLeft = () => {
    let tmpLeft = left.concat(not(rightChecked, left));
    setLeft(tmpLeft);
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    setFormState({ ...formState, payment_terms: tmpLeft });
  };

  const handleCheckedRight = () => {
    let tmpLeft = not(left, leftChecked);
    setLeft(tmpLeft);
    setRight(right.concat(leftChecked));
    setChecked(not(checked, leftChecked));
    setLeft(not(left, leftChecked));
    setFormState({ ...formState, payment_terms: tmpLeft });
  };

  const changeIncomeType = (event) => {
    setFormState({ ...formState, income_type: event.target.value });
    var paymentTerm = [];
    projectData?.result?.map((res) => {
      if (res?.income_type === event.target.value) {
        res?.payment_terms.map((resPayment) => {
          paymentTerm.push({
            payment_id: resPayment.payment_id,
            payment_number: resPayment.payment_number,
            payment_type: resPayment.payment_type,
            payment_detail_description: resPayment.payment_detail_description,
            payment_term_type: resPayment.payment_term_type,
            payment_value: resPayment.payment_value,
          });
        });
      }
    });

    if (event.target.value !== null) {
      setRight(paymentTerm);
    } else {
      setRight([]);
    }
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{ "aria-label": "all items selected" }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;
          return (
            <div>
              <ListItem
                key={value}
                role="listitem"
                button
                onClick={handleToggle(value)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={`${value.payment_detail_description} - ${value.payment_term_type} `}
                />
              </ListItem>
            </div>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  /*Start of swr variable*/

  let soSwr = getListSOGroup("status_acc", 1);
  var soProjectSwr = getListProject(projectCode, "*");

  /*End of swr variable variable*/

  /*Start of useEffect*/

  useEffect(() => {
    getCustomer(customerId);
  }, [customerId]);

  useEffect(() => {
    if (soSwr?.data) {
      setSalesOrderList(soSwr?.data.result ?? []);
    }
  }, [soSwr]);

  useEffect(async () => {
    var dataProject = await getSOProjectListApi(projectCode, "*");
    setProjectData(dataProject);
    var incomeTypeArr = [];

    dataProject?.result?.map((res) => {
      if (res.status_acc === 1) {
        incomeTypeArr.push({
          income_type: res.income_type,
        });
      }
    });
    setIncomeTypeList(incomeTypeArr);
  }, [projectCode]);

  useEffect(async () => {
    var dataProject = await getSOProjectListApi(projectCode, "*");
    var incomeTypeArr = [];

    dataProject?.result?.map((res) => {
      setPaymentTermList(res.payment_terms);
      incomeTypeArr.push({
        income_type: res.income_type,
      });
    });
    setIncomeTypeList(incomeTypeArr);
    setFormState({
      ...formState,
      project_code: projectCode,
    });
  }, [incomeType]);

  useEffect(() => {
    let list = [];
    salesOrderList.map((item, i) => {
      list.push({
        id: item.id + "|" + item.project_code + "|" + item.customer_id,
        label: item.project_code,
        so_income_type: item.income_type,
        payment_terms: item.payment_terms,
      });
    });
    setOptionSalesOrderList(list);
  }, [salesOrderList]);

  useEffect(() => {
    setDisableSave(false);
    setTax(0.11);
  }, [formState]);

  /*End of useEffect*/

  /*Start of function*/
  const onProjectCodeChange = (event, value) => {
    let objectVal = Object.values(value);
    let objectValSOId = objectVal[0].split("|");
    setProjectCode(objectValSOId[1]);
    setCustomerId(objectValSOId[0]);
    setRight([]);
  };

  function onInvoiceDataChange(e) {
    if (e.target.name !== "" || null) {
      if (e.target.name == "invoice_date") {
        setFormState({
          ...formState,
          [e.target.name]: e.target.value + "T01:00:00.000Z",
        });
      } else {
        setFormState({
          ...formState,
          [e.target.name]: e.target.value,
        });
      }
    }
    setOpenAlert(false);
  }

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
  const saveConfirmation = (e) => {
    var totalPaymentInvoice = 0;
    formState?.payment_terms?.map((res) => {
      totalPaymentInvoice = totalPaymentInvoice + res?.payment_value;
    });
    var total = parseFloat(Number(totalPaymentInvoice).toFixed(scale));
    setFormState({
      ...formState,
      project_code: projectCode,
      total_payment: total,
      rest_payment: total,
    });
    setOpenDialog(true);
  };
  const sendData = (e) => {
    setOpen(true);
    if (checkValidation()) {
      saveInvoiceApi(formState, 2)
        .then((res) => {
          router.push("/invoice");
        })
        .catch((err) => {
          console.log(err);
          setErrorText(err);
        });
    }

    setDisableSave(true);
    setOpenDialog(false);
    setOpen(false);
  };

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  function getCustomer(id) {
    if (id !== "") {
      getDetailSalesOrderApi(id).then((res) => {
        // console.info(res)
        document.getElementById("order_date").value = dateFormatInput(
          res.order_date
        );
        document.getElementById("project_name").value = res.project_name;
        document.getElementById("estimate_delivery_date").value =
          dateFormatInput(res.estimate_delivery_date);
        document.getElementById("quote_date").value = dateFormatInput(
          res.quote_date
        );
        document.getElementById("project_description").value =
          res.project_description;
        document.getElementById("customer_code").value = res.customer_code;
        document.getElementById("customer_name").value = res.customer_name;
        document.getElementById("customer_company_name").value =
          res.customer_company_type + ". " + res.customer_company_name;
        document.getElementById("customer_email").value = res.customer_email;
        document.getElementById("customer_address").value =
          res.customer_address;
        document.getElementById("sales_name").value = res.sales_name;
        document.getElementById("sales_email").value = res.sales_email;
        document.getElementById("sales_phone").value = res.sales_phone;

        document.getElementById("quantity").value = res.description[0].quantity;
        document.getElementById("price").value = res.description[0].price;
        document.getElementById("uom").value = res.description[0].uom;
        document.getElementById("description").value =
          res.description[0].description;

        setFormState({
          ...formState,
          sales_order_id: res.id,
          order_date: dateFormatInput(res.order_date),
          due_date: res.due_date,
          due_date_period: res.due_date_period,
          project_name: res.project_name,
          estimate_delivery_date: dateFormatInput(res.estimate_delivery_date),
          project_description: res.project_description,
          company_id: res.company_id,
          customer_id: res.customer_id,
          quote_date: dateFormatInput(res.quote_date),
          customer_code: res.customer_code,
          customer_name: res.customer_name,
          customer_company_name: res.customer_company_name,
          customer_company_type: res.customer_company_type,
          customer_address: res.customer_address,
          customer_phone: res.customer_phone,
          customer_email: res.customer_email,
          sales_id: res.sales_id,
          sales_name: res.sales_name,
          sales_email: res.sales_email,
          sales_phone: res.sales_phone,

          description_container: [
            {
              container_id: res.description[0].container_id,
              quantity: res.description[0].quantity,
              price: res.description[0].price,
              uom: res.description[0].uom,
              description: res.description[0].description,
            },
          ],
        });
      });
    }
  }
  const closeDialog = () => {
    setOpenDialog(false);
  };
  return (
    <BaseLayout title="Invoice">
      <div className={classes.root}>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Typography variant="subtitle1">New Invoice Form</Typography>
          </Box>
        </Box>
        <Box item xs={6} style={{ textAlign: "center" }}>
          <Collapse in={open}>
            <Alert
              severity="success"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
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
          <Collapse in={openAlert}>
            <Alert
              severity="warning"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenAlert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {alertMsg}
            </Alert>
          </Collapse>
        </Box>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Divider />
          </Box>
        </Box>
        <Box container>
          <Box item xs={12} style={{ textAlign: "center" }}>
            <div className={classes.rootmenu}>
              <Button
                variant="contained"
                onClick={(e) => openPage(e, getRoute("invoice"))}
              >
                <Icon style={{ fontSize: 20, color: "#999" }}>home</Icon>
              </Button>
              <Button
                variant="contained"
                color="default"
                onClick={(e) => openPage(e, getRoute("invoice"))}
              >
                <Icon style={{ fontSize: 20, color: "yellow" }}>
                  pending_actions
                </Icon>
                {"  "}
                Invoice Order List
              </Button>
            </div>
          </Box>
        </Box>
        <Paper className={classes.paper}>
          <Box container spacing={2}>
            <Box item>
              <ButtonBase>
                <Icon style={{ fontSize: 30, color: "#5d6d7e" }}>
                  open_in_new
                </Icon>
              </ButtonBase>{" "}
            </Box>
            <Box item xs={12} sm container>
              <Box item xs container direction="column" spacing={2}>
                <Box item xs>
                  <Typography gutterBottom variant="subtitle1">
                    New Invoice
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="mb-5">
            <Autocomplete
              className={classes.inputbase}
              variant="outlined"
              name="project_code"
              label="Project Code"
              options={optionSalesOrderList}
              autoHighlight
              // onChange={(e, v) => onChangeInput(e, v, true)}
              onChange={(e, value) => onProjectCodeChange(e, value)}
              // onChange={(event, value) => setProjectCode(value)}
              getOptionLabel={(option) => option?.label || ""}
              renderOption={(option) => (
                <Typography className={classes.comboOptions}>
                  {option?.label}
                </Typography>
              )}
              renderInput={(params) => {
                params.inputProps.className = classes.comboOptions;
                return (
                  <TextField
                    id="project_number_id"
                    className={classes.inputbase}
                    {...params}
                    label="Project Number"
                  />
                );
              }}
            />
          </Box>
          <Grid item xs={12}>
            <TextField
              id="income_type"
              select
              label="Income Type List"
              error={false}
              helperText=""
              onChange={(e) => changeIncomeType(e)}
              fullWidth
            >
              {incomeTypeList?.map((res) => (
                <MenuItem value={res.income_type}>{res.income_type}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Paper>
        <Paper className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item>{customList("Payment Term", right)}</Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCheckedRight}
                  className={classes.button}
                  disabled={leftChecked.length === 0}
                  aria-label="move selected right"
                >
                  &lt;
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={handleCheckedLeft}
                  disabled={rightChecked.length === 0}
                  aria-label="move selected left"
                >
                  &gt;
                </Button>
              </Grid>
            </Grid>
            <Grid item>{customList("Chosen", left)}</Grid>
          </Grid>
        </Paper>
        <Paper className={classes.paper}>
          <Box container spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography className={classes.labelbase}>
                  Project Name
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.labelbase}>
                  Estimate Delivery Date
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className={classes.labelbase}>
                  Quote Date
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className={classes.labelbase}>
                  Order Date
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <OutlinedInput
                id="project_name"
                readOnly={true}
                className={classes.inputbasero}
                name="project_name"
                type="text"
                fullWidth
              ></OutlinedInput>
            </Grid>
            <Grid item xs={4}>
              <OutlinedInput
                id="estimate_delivery_date"
                readOnly={true}
                className={classes.inputbasero}
                name="estimate_delivery_date"
                type="text"
                fullWidth
              ></OutlinedInput>
            </Grid>
            <Grid item xs={2}>
              <OutlinedInput
                id="quote_date"
                readOnly={true}
                className={classes.inputbasero}
                name="quote_date"
                type="text"
                fullWidth
              ></OutlinedInput>
            </Grid>
            <Grid item xs={2}>
              <OutlinedInput
                id="order_date"
                readOnly={true}
                className={classes.inputbasero}
                name="order_date"
                type="text"
                fullWidth
              ></OutlinedInput>
            </Grid>
          </Grid>

          <Box container spacing={2}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>
                Project Description
              </Typography>
            </Box>
            <Box item xs={10}>
              <OutlinedInput
                id="project_description"
                className={classes.inputbasemultilinero}
                defaultValue=""
                rowsMax={5}
                multiline
                name="project_description"
                type="textarea"
                readOnly
                fullWidth
              ></OutlinedInput>
            </Box>
          </Box>
        </Paper>

        <Paper className={classes.paper}>
          <Box container spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography className={classes.labelbase}>Quantity</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className={classes.labelbase}>Price</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.labelbase}>UOM</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.labelbase}>
                  description
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={2}>
                <OutlinedInput
                  id="quantity"
                  readOnly={true}
                  className={classes.inputbasero}
                  name="quantity"
                  type="text"
                  fullWidth
                ></OutlinedInput>
              </Grid>
              <Grid item xs={2}>
                <OutlinedInput
                  id="price"
                  readOnly={true}
                  className={classes.inputbasero}
                  name="price"
                  type="text"
                  fullWidth
                ></OutlinedInput>
              </Grid>
              <Grid item xs={4}>
                <OutlinedInput
                  id="uom"
                  readOnly={true}
                  className={classes.inputbasero}
                  name="uom"
                  type="text"
                  fullWidth
                ></OutlinedInput>
              </Grid>
              <Grid item xs={4}>
                <OutlinedInput
                  id="description"
                  readOnly={true}
                  className={classes.inputbasero}
                  name="description"
                  type="text"
                  fullWidth
                ></OutlinedInput>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        <Paper className={classes.paper}>
          <Box container spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography className={classes.labelbase}>
                  Customer Code
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className={classes.labelbase}>
                  Customer Name
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.labelbase}>
                  Customer Company
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.labelbase}>
                  Customer Email
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={2}>
                <OutlinedInput
                  id="customer_code"
                  readOnly={true}
                  className={classes.inputbasero}
                  name="customer_code"
                  type="text"
                  fullWidth
                ></OutlinedInput>
              </Grid>
              <Grid item xs={2}>
                <OutlinedInput
                  id="customer_name"
                  readOnly={true}
                  className={classes.inputbasero}
                  name="customer_name"
                  type="text"
                  fullWidth
                ></OutlinedInput>
              </Grid>

              <Grid item xs={4}>
                <OutlinedInput
                  id="customer_company_name"
                  readOnly={true}
                  className={classes.inputbasero}
                  name="customer_company_name"
                  type="text"
                  fullWidth
                ></OutlinedInput>
              </Grid>

              <Grid item xs={4}>
                <OutlinedInput
                  id="customer_email"
                  readOnly={true}
                  className={classes.inputbasero}
                  name="customer_email"
                  type="text"
                  fullWidth
                ></OutlinedInput>
              </Grid>
            </Grid>
            <Box container spacing={2}>
              <Box item xs={2}>
                <Typography className={classes.labelbase}>
                  Customer Address
                </Typography>
              </Box>
              <Box item xs={10}>
                <OutlinedInput
                  id="customer_address"
                  className={classes.inputbasemultilinero}
                  defaultValue=""
                  rowsMax={5}
                  multiline
                  name="customer_address"
                  type="textarea"
                  readOnly
                  fullWidth
                ></OutlinedInput>
              </Box>
            </Box>
          </Box>
        </Paper>
        <Paper className={classes.paper}>
          <Box container spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography className={classes.labelbase}>
                  Sales Name
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.labelbase}>
                  Sales Email
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.labelbase}>
                  Sales Phone
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <OutlinedInput
                  id="sales_name"
                  readOnly={true}
                  className={classes.inputbasero}
                  name="sales_name"
                  type="text"
                  fullWidth
                ></OutlinedInput>
              </Grid>
              <Grid item xs={4}>
                <OutlinedInput
                  id="sales_email"
                  readOnly={true}
                  className={classes.inputbasero}
                  name="sales_email"
                  type="text"
                  fullWidth
                ></OutlinedInput>
              </Grid>
              <Grid item xs={4}>
                <OutlinedInput
                  id="sales_phone"
                  readOnly={true}
                  className={classes.inputbasero}
                  name="sales_phone"
                  type="text"
                  fullWidth
                ></OutlinedInput>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <Paper className={classes.paper}>
          <Box container spacing={2}>
            <Box container spacing={2}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography className={classes.labelbase}>
                      Invoice Date
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <OutlinedInput
                      id="invoice_date"
                      className={classes.inputbase}
                      name="invoice_date"
                      type="date"
                      error={errorText.invoice_date}
                      helperText={errorText.invoice_date}
                      onChange={(e) => onInvoiceDataChange(e)}
                      fullWidth
                    ></OutlinedInput>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography className={classes.labelbase}>
                      Invoice Description
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <OutlinedInput
                      className={classes.inputbasemultiline}
                      defaultValue=""
                      rowsMax={5}
                      multiline
                      onChange={(e) => onInvoiceDataChange(e)}
                      name="invoice_description"
                      type="textarea"
                      fullWidth
                    ></OutlinedInput>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Paper>
        <Paper className={classes.paper}>
          <Box container>
            <Box item xs={12} style={{ textAlign: "center" }}>
              <div className={classes.rootmenu}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={(e) => openPage(e, getRoute("invoice"))}
                >
                  <Icon style={{ fontSize: 20, color: "yellow" }}>cancel</Icon>
                  Cancel
                </Button>
                <Button
                  disabled={disableSave}
                  onClick={(e) => saveConfirmation(e)}
                  variant="contained"
                  color="primary"
                >
                  <Icon style={{ fontSize: 20, color: "#af601a" }}>save</Icon>
                  Save
                </Button>
              </div>
            </Box>
          </Box>
        </Paper>
      </div>
      <AlertDialog
        open={openDialog}
        cancelAction={() => closeDialog()}
        okAction={() => sendData()}
        title="Save confirmation"
        body="Are you sure want to save this sales order?"
      />
    </BaseLayout>
  );
}
