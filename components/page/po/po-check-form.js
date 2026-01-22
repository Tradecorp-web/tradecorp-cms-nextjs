import {
  Button,
  Card,
  Divider,
  Grid,
  Icon,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import moment from "moment";
import { useEffect, useState } from "react";
import { currency, dateFormatInput } from "../../../helpers/general";
import {
  insertPurchaseOrderApi,
  updatePurchaseOrderApi,
  updatePOFlowNext,
  insertFlowStatusAppNext,
  getCheckedPoApi,
} from "../../../services/api/po.api";
import { getPoUserPosSwr, getCheckedPoSwr } from "../../../services/swr/po.swr";
import {
  getDetailVendorSwr,
  getListVendorSwr,
} from "../../../services/swr/vendor.swr";
import { masterProjectSwr } from "../../../services/swr/master-project.swr";
import { CircularProgressCustom } from "../../base_component/spinner";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import AlertDialog from "../../base_component/dialog";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  modal: {
    display: "flex",
    padding: theme.spacing(1),
    alignItems: "center",
    justifyContent: "center",
  },
}));
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function POForm(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const classes = useStyles();
  const [formState, setFormState] = useState(null);
  const [open, setOpen] = useState(false);
  const [statusAcc, setStatusAcc] = useState(null);

  // const [projectList, setProjectList] = useState([]);
  const [disabled, setDisabled] = useState("");
  const [readOnly, setReadOnly] = useState("");

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  // --------<LIST VENDOR SWR>--------
  const [vendors, setVendors] = useState([]);
  var vendorsSwr = getListVendorSwr({
    page: 1,
    limit: 200,
    orderBy: "vendor_name",
    order: "asc",
    isAccepted: true,
    pendingAcceptance: false,
  });
  useEffect(() => {
    if (vendorsSwr?.data?.result) {
      setVendors(vendorsSwr?.data?.result ?? []);
    }
  }, [vendorsSwr]);

  // --------<DETAIL VENDOR SWR>--------
  const [vendorId, setVendorId] = useState("");
  const [vendor, setVendor] = useState(null);
  var vendorSwr = getDetailVendorSwr(vendorId);
  var statusAccSwr = getPoUserPosSwr();

  useEffect(() => {
    if (vendorSwr?.data) {
      setVendor(vendorSwr?.data);
    }
  }, [vendorSwr]);
  useEffect(() => {
    if (statusAccSwr?.data) {
      setStatusAcc(statusAccSwr?.data);
    }
  }, [statusAccSwr]);

  useEffect(() => {
    if (props?.open) {
      if (props?.isEdit) {
        setDisabled("disabled");
        setReadOnly("true");
        var data = vendors.find((val) => props?.data?.vendor?.id == val.id);

        setVendor(vendors?.find((val) => props?.data?.vendor?.id == val?.id));
        setVendorId(props?.data?.vendor?.id);
        setMaterialSelected([]);
        setMaterialSelected(props?.data?.items);
        setFormState({
          poNumber: props?.data?.po_number,
          poDate: dateFormatInput(props?.data?.po_date),
          toPayment: props?.data?.vendor?.to_payment,
          project_code: props?.data?.project_code,
          project: props?.data?.project,
          remarks: props?.data?.remarks,
          vat: props?.data?.vendor?.vat,
          vendor: data?.vendor_name,
          vendorId: data?.id,
          items: props?.data?.items,
          description: "",
        });
      } else {
        setDisabled("");
        setReadOnly("false");
      }
    }
  }, [props?.open]);

  const [errorText, setErrorText] = useState(null);
  const [isLoading, setLoading] = useState(false);

  function onChangeInput(e) {
    console.log(e.target.name);
    if (e.target.name == "vendor") {
      setVendorId(e.target.value.id);
      setMaterialSelected([]);
      setFormState({
        ...formState,
        [e.target.name]: e.target.value,
        vat: e.target.value.vat,
      });
    } else {
      setFormState({ ...formState, [e.target.name]: e.target.value });
    }
  }

  const [materialSelected, setMaterialSelected] = useState([]);
  function selectMaterial(e) {
    var index = materialSelected.findIndex((item) => {
      return item?.id == e?.target?.value?.id;
    });
    if (index < 0) {
      var arrayTemp = [...materialSelected, e.target.value];
      setMaterialSelected(arrayTemp);
    }
  }
  function deleteMaterialSelected(index) {
    materialSelected?.splice(index, 1);
    setMaterialSelected([...materialSelected]);
  }
  function changeMaterialQty(val, index) {
    materialSelected[index].qty = val;
    var arrayTemp = [...materialSelected];
    setMaterialSelected(arrayTemp);
  }

  function onChangeChecked(event, val, index) {
    var valData = null;
    if (event == true) {
      valData = val;
    }
    materialSelected[index].checked = valData;
    var arrayTemp = [...materialSelected];
    setMaterialSelected(arrayTemp);

    // sendData();
  }
  function onMessageChange(e) {
    setFormState({ ...formState, description: e.target.value });
  }
  function subtotalPrice() {
    var result = 0;
    materialSelected.map((val, i) => {
      var price = val?.qty * val?.price;
      if (!Number.isNaN(price)) result += price;
    });
    return result;
  }

  function totalPrice() {
    var result = subtotalPrice();
    if (vendor?.vat) {
      result += result * 0.1;
    }
    return result;
  }

  // function checkValidation() {
  //   var isValid = true;
  //   var eProjectCode = "";
  //   if (formState.project_code == "" || formState.project_code == null) {
  //     isValid = false;
  //     eProjectCode = "Project code  can not be empty";
  //   }
  //   setErrorText({
  //     ...errorText,
  //     project_code: eProjectCode,
  //   });
  //   return isValid;
  // }
  // const [isLoading, setLoading] = useState(false);
  const [vendorSelect, setVendorSelect] = useState([]);

  // function onChangeSelect(value) {
  //   setFormState({
  //     ...formState,
  //     vendor_id: value.id,
  //     to_payment: value.to_payment,
  //     vat: value.vat,
  //   });
  // }

  const confirmSend = () => {
    setOpenDialog(true);
  };

  function sendDataNext() {
    sendData();
  }

  function sendData() {
    var data = [];
    // setLoading(true);
    data = {
      ...props?.data,
      po_number: formState?.poNumber,
      po_date: moment(formState?.poDate),
      vendor_id: formState?.vendorId,
      to_payment: formState?.toPayment,
      project_code: formState?.project_code,
      project: formState?.project,
      remarks: formState?.remarks,
      vat: formState?.vat,
      items: materialSelected?.map((val, i) => {
        return {
          material_id: val?.material?.id,
          qty: parseFloat(val?.qty),
          price: parseFloat(val?.price),
          checked: parseInt(val?.checked),
        };
      }),
    };

    updatePurchaseOrderApi(data, props?.data?.id)
      .then((res) => {
        getCheckedPoApi(props?.data?.id, statusAcc?.status).then((res) => {
          if (res) {
            updatePOFlowNext(props?.data?.id)
              .then((res) => {
                insertFlowStatusAppNext(props?.data?.po_number, {
                  description: formState?.description,
                });
                setLoading(false);
                closeModal();
                props?.dataUpdated(res);
              })
              .catch((err) => {
                console.log(err);
                setErrorText(err);
                setLoading(false);
              });
          } else {
            alert("Material not checked completely");
          }
        });
      })
      .catch((err) => {
        console.log(err);
        setErrorText(err);
        setLoading(false);
      });
  }

  function closeModal() {
    setFormState(null);
    setVendorId(null);
    setVendor(null);
    setMaterialSelected([]);
    props?.closeModal();
  }

  // var projectSwr = masterProjectSwr();

  // useEffect(() => {
  //   if (projectSwr?.data) {
  //     setProjectList(projectSwr?.data?.result ?? []);
  //   }
  // }, [projectSwr]);

  return (
    <Modal
      disablePortal
      disableEnforceFocus
      disableAutoFocus
      className={classes.modal}
      aria-labelledby="server-modal-title"
      aria-describedby="server-modal-description"
      open={props?.open}
      onClose={() => closeModal()}
    >
      <div className="modal-wrapper" style={{ width: "1200px" }}>
        <Card className="modal">
          <div className="modal-header">
            <h3>Check Purchase Order</h3>
          </div>
          <div className="modal-content">
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">PO Date</Typography>
              </InputLabel>
              <InputBase
                readOnly={readOnly}
                color="secondary"
                className="input"
                type="date"
                name="poDate"
                value={formState?.poDate}
                onChange={onChangeInput}
                fullWidth
              ></InputBase>
            </div>
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">PO Number</Typography>
              </InputLabel>
              <InputBase
                readOnly={readOnly}
                name="poNumber"
                color="secondary"
                className="input"
                value={formState?.poNumber}
                onChange={onChangeInput}
                fullWidth
              ></InputBase>
            </div>
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">Project Code</Typography>
              </InputLabel>
              <InputBase
                readOnly={readOnly}
                name="poNumber"
                color="secondary"
                className="input"
                value={formState?.project_code}
                onChange={onChangeInput}
                fullWidth
              ></InputBase>
            </div>
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">Project Name</Typography>
              </InputLabel>
              <InputBase
                readOnly={readOnly}
                name="project"
                color="secondary"
                className="input"
                value={formState?.project}
                onChange={onChangeInput}
                fullWidth
              ></InputBase>
            </div>
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">Remarks</Typography>
              </InputLabel>
              <InputBase
                readOnly={readOnly}
                name="remarks"
                color="secondary"
                className="input"
                value={formState?.remarks}
                onChange={onChangeInput}
                fullWidth
              ></InputBase>
            </div>
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">Vendor</Typography>
              </InputLabel>
              <InputBase
                readOnly={readOnly}
                name="remarks"
                color="secondary"
                className="input"
                value={formState?.vendor}
                fullWidth
              ></InputBase>
              {/* <Autocomplete
                disabled={disabled}
                id="combo-box-demo"
                options={vendors}
                className="input"
                name="vendor"
                value={formState?.vendor}
                onChange={(event, value) => {
                  if (props.isEdit === true) {
                    setOpen(true);
                  } else {
                    setVendorId(value.id);
                    setMaterialSelected([]);
                    //   setFormState({ formState, [vendor]: value });
                    onChangeSelect(value);
                  }
                }}
                getOptionLabel={(option) => option.vendor_name}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <InputBase
                      className="input"
                      style={{ width: "100%" }}
                      type="text"
                      {...params.inputProps}
                    />
                  </div>
                )}
              /> */}
            </div>
            {vendor != null && (
              <Card className="mb-3 p-3" variant="outlined">
                <Typography variant="h4" className="mb-3">
                  Material List
                </Typography>
                <div className="mb-3">
                  <InputLabel className="pb-1">
                    <Typography variant="caption">Add Material</Typography>
                  </InputLabel>
                  <Select
                    disabled={disabled}
                    labelId="demo-customized-select-label"
                    className="input"
                    placeholder="Add Material"
                    fullWidth
                    value="none"
                    onChange={selectMaterial}
                    input={<InputBase />}
                  >
                    <MenuItem value="none">
                      <em className="text-muted">Select Material</em>
                    </MenuItem>
                    {(vendor?.materials ?? [])?.map((val, i) => {
                      return (
                        <MenuItem key={val?.material?.id} value={val}>
                          {val?.material?.material_name} (
                          <em>{currency(val?.price)})</em>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
                <div className="mb-3">
                  {(materialSelected ?? [])?.map((val, i) => {
                    // materialSelected[i]?.checked === statusAcc.status
                    // setCheckedPo("checked");
                    // : setCheckedPo("")
                    var checkedData = "";
                    if (materialSelected[i]?.checked == statusAcc?.status) {
                      checkedData = "checked";
                    }

                    return (
                      <Card key={i} className="mb-3" variant="outlined">
                        <div className="display-space-between pt-2 pe-3 pb-2 ps-3">
                          <span>
                            {statusAcc?.status >= 0 ? (
                              <FormControlLabel
                                checked={checkedData}
                                control={<Checkbox color="primary" />}
                                label={val?.material?.material_name}
                                labelPlacement="check"
                                onChange={(e) =>
                                  onChangeChecked(
                                    e.target.checked,
                                    statusAcc?.status,
                                    i
                                  )
                                }
                              />
                            ) : (
                              ""
                            )}
                          </span>
                          {/* <span>{val?.material?.material_name}</span> */}
                          <IconButton
                            disabled={disabled}
                            onClick={() => deleteMaterialSelected(i)}
                            size="small"
                          >
                            <Icon>close</Icon>
                          </IconButton>
                        </div>
                        <Divider />
                        <div className="p-3">
                          <Grid container spacing={3}>
                            <Grid item xs={6}>
                              <div className="mb-3 text-left">
                                <InputLabel className="pb-1">
                                  <Typography variant="caption">{`Qty (${materialSelected[i]?.material?.unit})`}</Typography>
                                </InputLabel>
                                <InputBase
                                  readOnly={readOnly}
                                  name="remarks"
                                  color="secondary"
                                  className="input"
                                  type="number"
                                  value={materialSelected[i]?.qty}
                                  onChange={(e) =>
                                    changeMaterialQty(e.target.value, i)
                                  }
                                  fullWidth
                                ></InputBase>
                              </div>
                            </Grid>
                            <Grid item xs={6}>
                              <div className="mb-3 text-right">
                                <div className="mb-2">
                                  <Typography
                                    readOnly={readOnly}
                                    variant="caption"
                                    className="text-muted"
                                  >
                                    Price (
                                    {currency(materialSelected[i]?.price)}/
                                    {materialSelected[i]?.material?.unit})
                                  </Typography>
                                  <br />
                                </div>
                                <Typography readOnly={readOnly} variant="body2">
                                  {currency(
                                    materialSelected[i]?.qty *
                                      materialSelected[i]?.price
                                  )}
                                </Typography>
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      </Card>
                    );
                  })}
                </div>
                <Divider />
                <div className="mt-3">
                  <div className="mb-2 display-space-between">
                    <Typography variant="body2">Term of Payment</Typography>
                    <Typography variant="body1">
                      {vendor?.term_of_payment?.name}
                    </Typography>
                  </div>
                  <div className="mb-2 display-space-between">
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body1">
                      {currency(subtotalPrice())}
                    </Typography>
                  </div>
                  <div className="mb-2 display-space-between">
                    <Typography variant="body2">VAT</Typography>
                    <Typography variant="body1">
                      {vendor?.vat ? currency(subtotalPrice() * 0.1) : "-"}
                    </Typography>
                  </div>
                  <div className="display-space-between">
                    <Typography variant="body2">Total Price</Typography>
                    <Typography variant="h4">
                      {currency(totalPrice())}
                    </Typography>
                  </div>
                </div>
              </Card>
            )}
          </div>
          <div className="modal-footer">
            <Grid container spacing={3}>
              {/* <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => sendData()}
                  disableElevation
                >
                  {isLoading ? (
                    <CircularProgressCustom size={26} />
                  ) : props?.isEdit ? (
                    "Edit Purchase Order"
                  ) : (
                    "Add Purchase Order"
                  )}
                </Button>
              </Grid> */}

              <Grid item xs={10}>
                <InputLabel className="pb-1">
                  <Typography variant="caption">Message</Typography>
                </InputLabel>
                <InputBase
                  name="description"
                  color="secondary"
                  className="input"
                  onChange={onMessageChange}
                  fullWidth
                ></InputBase>
              </Grid>
              <Grid item xs={2}>
                <InputLabel className="pb-1">
                  <Typography variant="caption">&nbsp;</Typography>
                </InputLabel>
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
                    "Send data"
                  ) : (
                    "Send data"
                  )}
                </Button>
              </Grid>
            </Grid>
          </div>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="warning">
              Must check all material !
            </Alert>
          </Snackbar>

          <AlertDialog
            open={openDialog}
            cancelAction={() => setOpenDialog(false)}
            okAction={() => sendDataNext()}
            title="Send data confirmation"
            body="Are you sure want to send this record?"
          />
        </Card>
      </div>
    </Modal>
  );
}
