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
} from "@material-ui/core";
import { sendFlagAcc } from "../../../../../services/export/send-po-acc";

import moment from "moment";
import { useEffect, useState } from "react";
import { currency, dateFormatInput } from "../../../../../helpers/general";
import {
  insertPurchaseOrderApi,
  updatePurchaseOrderApi,
} from "../../../../../services/api/po.api";
import {
  getDetailVendorSwr,
  getListVendorSwr,
} from "../../../../../services/swr/vendor.swr";
import { CircularProgressCustom } from "../../../../base_component/spinner";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { sendStatusBackAcc } from "../../../../../services/export/send-po-acc";

export default function POForm(props) {
  const [formState, setFormState] = useState(null);

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
  // useEffect(() => {
  //   if (vendorsSwr?.data?.result) {
  //     setVendors(vendorsSwr?.data?.result ?? []);
  //   }
  // }, [vendorsSwr]);

  // --------<DETAIL VENDOR SWR>--------
  const [vendorId, setVendorId] = useState("");
  const [vendor, setVendor] = useState(null);
  var vendorSwr = getDetailVendorSwr(vendorId);
  useEffect(() => {
    if (vendorSwr?.data) {
      setVendor(vendorSwr?.data);
    }
  }, [vendorSwr]);

  useEffect(() => {
    if (props?.open) {
      if (props?.isEdit) {
        setVendor(vendors?.find((val) => props?.data?.vendor?.id == val?.id));
        setVendorId(props?.data?.vendor?.id);
        setMaterialSelected([]);
        setMaterialSelected(props?.data?.items);
        setFormState({
          id: props?.data?.id,
          poNumber: props?.data?.po_number,
          poDate: dateFormatInput(props?.data?.po_date),
          toPayment: props?.data?.vendor?.to_payment,
          project: props?.data?.project,
          remarks: props?.data?.remarks,
          vat: props?.data?.vendor?.vat,
          vendor: vendors?.find((val) => props?.data?.vendor?.id == val?.id),
          items: props?.data?.items,
          status_acc: props?.data?.status_acc,
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
    return isValid;
  }

  function sendData() {
    if (checkValidation()) {
      setLoading(true);
      var data = {
        ...props?.data,
        po_number: formState?.poNumber,
        po_date: moment(formState?.poDate),
        vendor_id: formState?.vendor?.id,
        to_payment: formState?.vendor?.to_payment,
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
      if (props?.isEdit) {
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
  function setStatusFlagAcc(id) {
    try {
      sendFlagAcc({ id: id, flag: true })
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
    } catch (err) {}
  }
  function setStatusAcc() {
    try {
      sendStatusBackAcc({ status: 0, flag: false, id: props?.data?.id })
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
    } catch (err) {}
  }
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
                readOnly={true}
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
                readOnly={true}
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
                <Typography variant="caption">Project</Typography>
              </InputLabel>
              <InputBase
                readOnly={true}
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
                readOnly={true}
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
                // onChange={(event, value) => {
                //   setVendorId(value.id);
                //   setMaterialSelected([]);
                //   setFormState({ ...formState, [vendor]: value });
                // }}
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
                  {/* <InputLabel className="pb-1">
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
                  </Select> */}
                </div>
                <div className="mb-3">
                  {(materialSelected ?? [])?.map((val, i) => {
                    return (
                      <Card key={i} className="mb-3" variant="outlined">
                        <div className="display-space-between pt-2 pe-3 pb-2 ps-3">
                          <span>{val?.material?.material_name}</span>
                          {/* <IconButton
                            onClick={() => deleteMaterialSelected(i)}
                            size="small"
                          >
                            <Icon>close</Icon>
                          </IconButton> */}
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
                                  readOnly={true}
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
              <Grid item xs={6}>
                {formState?.status_acc === 1 && (
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => setStatusAcc()}
                    disableElevation
                  >
                    Confirm to Purchase
                  </Button>
                )}
              </Grid>
              {/* <Grid item xs={6}>
                {formState?.status_acc === 1 && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => setStatusFlagAcc(formState?.id)}
                    disableElevation
                  >
                    Mark for post <Icon>check</Icon>
                  </Button>
                )}
              </Grid> */}
            </Grid>
          </div>
        </Card>
      </div>
    </Modal>
  );
}
