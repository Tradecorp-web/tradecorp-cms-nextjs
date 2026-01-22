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
  TextField,
} from "@material-ui/core";
import moment from "moment";
import { useEffect, useState } from "react";
import { currency, dateFormatInput } from "../../../helpers/general";
import {
  insertPurchaseOrderApi,
  updatePurchaseOrderApi,
  updatePOFlowNext,
  insertFlowStatusAppNext,
} from "../../../services/api/po.api";
import {
  getDetailVendorSwr,
  getListVendorSwr,
} from "../../../services/swr/vendor.swr";
import { masterDataSwr } from "../../../services/swr/master-data.swr";
import { masterProjectSwr } from "../../../services/swr/master-project.swr";
import { CircularProgressCustom } from "../../base_component/spinner";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import AlertDialog from "../../base_component/dialog";
import { AlternateEmail } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
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

  const [projectList, setProjectList] = useState([]);
  const [disabledEdit, setDisabledEdit] = useState("");

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
  const [teamList, setTeamList] = useState(null);
  var vendorSwr = getDetailVendorSwr(vendorId);
  useEffect(() => {
    if (vendorSwr?.data) {
      setVendor(vendorSwr?.data);
    }
  }, [vendorSwr]);
  var teamSwr = masterDataSwr("team");
  useEffect(() => {
    if (teamSwr?.data) {
      setTeamList(teamSwr?.data);
    }
  }, [teamSwr]);

  useEffect(() => {
    if (props?.open) {
      if (props?.isEdit) {
        setDisabledEdit("disabled");
        setVendor(vendors?.find((val) => props?.data?.vendor?.id == val?.id));
        setVendorId(props?.data?.vendor?.id);
        setMaterialSelected([]);
        setMaterialSelected(props?.data?.items);
        setFormState({
          poNumber: props?.data?.po_number,
          poDate: dateFormatInput(props?.data?.po_date),
          toPayment: props?.data?.vendor?.to_payment,
          request_team_id: props?.data?.vendor?.request_team_id,
          project_code: props?.data?.project_code,
          project: props?.data?.project,
          remarks: props?.data?.remarks,
          vat: props?.data?.vendor?.vat,
          vendor: vendors?.find((val) => props?.data?.vendor?.id == val?.id),
          request_team_id: props?.data?.request_team_id,
          items: props?.data?.items,
        });
      } else {
        setDisabledEdit("");
        setFormState({
          poNumber: null,
          project_code: "none",
          remarks: null,
        });
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
  function onTeamChange(e) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
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

  function checkValidation() {
    var isValid = true;
    var eProjectCode = "";
    if (formState.project_code == "" || formState.project_code == null) {
      isValid = false;
      eProjectCode = "Project code  can not be empty";
    }
    setErrorText({
      ...errorText,
      project_code: eProjectCode,
    });
    return isValid;
  }
  //const [isLoading, setLoading] = useState(false);
  const [vendorSelect, setVendorSelect] = useState([]);

  function onChangeSelect(value) {
    setFormState({
      ...formState,
      vendor_id: value.id,
      to_payment: value.to_payment,
      vat: value.vat,
    });
  }

  const confirmSend = () => {
    setOpenDialog(true);
  };

  function sendDataNext() {
    if (props?.isEdit) {
      updatePOFlowNext(props?.data?.id)
        .then((res) => {
          insertFlowStatusAppNext(props?.data?.po_number);
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
      alert("Only in edit mode");
    }
  }
  function sendData() {
    if (checkValidation()) {
      setLoading(true);
      var data = [];
      if (props?.isEdit) {
        data = {
          ...props?.data,
          po_number: formState?.poNumber,
          po_date: moment(formState?.poDate),
          vendor_id: formState?.vendor?.id,
          to_payment: formState?.vendor?.to_payment,
          project_code: formState?.project_code,
          project: formState?.project,
          remarks: formState?.remarks,
          vat: formState?.vat,
          items: materialSelected?.map((val, i) => {
            return {
              material_id: val?.material?.id,
              qty: parseFloat(val?.qty),
              price: parseFloat(val?.price),
            };
          }),
        };
        updatePurchaseOrderApi(data, props?.data?.id)
          .then((res) => {
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
        data = {
          ...props?.data,
          po_number: formState?.poNumber,
          po_date: moment(formState?.poDate),
          vendor_id: formState?.vendor_id, // vendor?.id,
          to_payment: formState?.to_payment, //formState?.vendor?.to_payment,
          project_code: formState?.project_code,
          project: formState?.project,
          remarks: formState?.remarks,
          vat: formState?.vat,
          items: materialSelected?.map((val, i) => {
            return {
              material_id: val?.material?.id,
              qty: parseFloat(val?.qty),
              price: parseFloat(val?.price),
            };
          }),
        };

        insertPurchaseOrderApi(data)
          .then((res) => {
            setLoading(false);
            closeModal();
            props?.dataInserted(res);
          })
          .catch((err) => {
            console.log(err);
            setErrorText(err);
            setLoading(false);
          });
      }
    }
  }

  function closeModal() {
    setFormState(null);
    setVendorId(null);
    setVendor(null);
    setMaterialSelected([]);
    props?.closeModal();
  }

  var projectSwr = masterProjectSwr();

  useEffect(() => {
    if (projectSwr?.data) {
      setProjectList(projectSwr?.data?.result ?? []);
    }
  }, [projectSwr]);

  return (
    <Modal
      open={props?.open}
      onClose={() => closeModal()}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className="modal-wrapper" style={{ width: "700px" }}>
        <Card className="modal">
          <div className="modal-header">
            <h3>
              {props?.isEdit ? "Edit Purchase Order" : "Add Purchase Order"}
            </h3>
          </div>
          <div className="modal-content">
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">PO Date</Typography>
              </InputLabel>
              <InputBase
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
                disabled="disabled"
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
              <TextField
                disabled
                name="project_code"
                variant="outlined"
                value={formState?.project_code}
                // error={errorText.team}
                // helperText={errorText.team}
                fullWidth
              ></TextField>
            </div>
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">Request Team By</Typography>
              </InputLabel>
              <TextField
                disabled={disabledEdit}
                name="request_team_id"
                select
                variant="outlined"
                defaultValue={formState?.request_team_id}
                // error={errorText.team}
                // helperText={errorText.team}
                onChange={onTeamChange}
                fullWidth
              >
                <MenuItem value="none">
                  <em>None</em>
                </MenuItem>
                {teamList?.map((row, key) => {
                  return (
                    <MenuItem value={row.id}>
                      {row?.id} - {row?.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </div>
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">Project Name</Typography>
              </InputLabel>
              <InputBase
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
                <Typography variant="caption">Select Vendor</Typography>
              </InputLabel>
              <Autocomplete
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
              />
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
                    return (
                      <Card key={i} className="mb-3" variant="outlined">
                        <div className="display-space-between pt-2 pe-3 pb-2 ps-3">
                          <span>{val?.material?.material_name}</span>
                          <IconButton
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
                                    variant="caption"
                                    className="text-muted"
                                  >
                                    Price (
                                    {currency(materialSelected[i]?.price)}/
                                    {materialSelected[i]?.material?.unit})
                                  </Typography>
                                  <br />
                                </div>
                                <Typography variant="body2">
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
              <Grid item xs={12}>
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
              </Grid>
              {/* <Grid item xs={6}>
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
              </Grid> */}
            </Grid>
          </div>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="warning">
              Vendor can not be change !
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
