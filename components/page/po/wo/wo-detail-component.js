import {
  Card,
  Tooltip,
  IconButton,
  Button,
  Icon,
  Select,
  Link,
  MenuItem,
  Divider,
  InputLabel,
  Grid,
  InputBase,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  currency,
  dateFormat,
  dateTimeFormatInput,
  dateTimeFormat,
  dateFormatInput,
} from "../../../../helpers/general";
import getRoute from "../../../../helpers/router";
import {
  insertPurchaseOrderApi,
  getPoNumberApi,
} from "../../../../services/api/po.api";
import { updateWoWhenPoCreatedApi } from "../../../../services/api/wo.api";
import { getDetailMaterialSwr } from "../../../../services/swr/material.swr";
import { getDetailCompanyApi } from "../../../../services/api/company.api";
import { getDetailWorkOrderSwr } from "../../../../services/swr/wo.swr";
import { CircularProgressCustom } from "../../../base_component/spinner";
import { LOCAL_STORAGE_API_TOKEN } from "../../../../helpers/consts";

export default function WODetailComponent(props) {
  const router = useRouter();
  const woId = router.query.id;

  function openLink(e, url) {
    e.preventDefault();
    router.push(url);
  }

  const [wo, setWo] = useState(null);
  const [companyTax, setCompanyTax] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [tax, setTax] = useState(null);
  const woSwr = getDetailWorkOrderSwr(woId);

  const token = localStorage.getItem(LOCAL_STORAGE_API_TOKEN);

  useEffect(() => {
    setWo(woSwr.data);
  }, [woSwr?.data]);

  useEffect(async () => {
    try {
      var compId = "";
      if (token != "" && token != "undefined" && token != null) {
        const data = JSON.parse(atob(token.split(".")[1]));
        compId = data.company_id;
      }
      var data = await getDetailCompanyApi(compId);
      setCompanyTax(data.tax);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  }, []);

  function updateItem(totalPrice, vendors, index) {
    if (wo != null) {
      wo.materials[index] = {
        ...wo.materials[index],
        totalPrice: totalPrice,
        vendors: vendors,
      };
      setWo(wo);
      countRealPriceTotal();
    }
  }

  function estimatedPriceTotal() {
    var result = 0;
    wo?.materials?.forEach((val, i) => {
      var p = wo?.materials[i]?.detail?.price ?? 0;
      var q = wo?.materials[i]?.qty ?? 0;
      result += p * q;
    });
    return result;
  }

  const [isAllVendorSelected, setAllVendorSelected] = useState(false);
  const [realPriceTotal, setRealPriceTotal] = useState(0);
  function countRealPriceTotal() {
    var isVendorNotEmpty = true;
    var result = 0;
    wo?.materials?.forEach((val, i) => {
      if (!Number.isNaN(wo?.materials[i]?.totalPrice)) {
        result += wo?.materials[i]?.totalPrice ?? 0;
      }
      if ((wo?.materials[i]?.vendors?.length ?? 0) < 1) {
        isVendorNotEmpty = false;
      } else if (isVendorNotEmpty) {
        isVendorNotEmpty = wo?.materials[i]?.vendors[0]?.vendor != null;
      }
    });
    setRealPriceTotal(result);
    setAllVendorSelected(isVendorNotEmpty);
  }

  function isPriceOk() {
    return estimatedPriceTotal() >= realPriceTotal;
  }

  // --------------------<PO>--------------------
  const [purchaseOrders, setPurcahseOrders] = useState([]);
  const [poMode, setPoMode] = useState(false);
  const [errorText, setErrorText] = useState(null);

  function onChangeInput(e, index) {
    purchaseOrders[index] = {
      ...purchaseOrders[index],
      [e.target.name]: e.target.value,
    };
    setPurcahseOrders([...purchaseOrders]);
  }

  function allPoLoaded() {
    var isLoaded = false;
    purchaseOrders?.forEach((val, i) => {
      if (!isLoaded) {
        isLoaded = !val?.isLoading;
      }
    });
    return isLoaded;
  }

  function allPoWasCreated() {
    var created = false;
    purchaseOrders?.forEach((val, i) => {
      if (!created) {
        created = val?.created;
      }
    });
    return created;
  }

  function subtotalPricePerPo(po) {
    var total = 0;
    po?.materials?.forEach((item, i) => {
      total += item?.totalPrice;
    });
    return total;
  }

  function taxPerPo(po) {
    var tax = 0;
    if (po?.vendor?.vat) {
      tax += subtotalPricePerPo(po) * (companyTax / 100);
    }
    return tax;
  }

  function totalPricePerPo(po) {
    var total = subtotalPricePerPo(po);
    if (po?.vendor?.vat) {
      total += total * (companyTax / 100);
    }
    return total;
  }

  function generatePurchaseOrder() {
    var po = [];
    wo?.materials?.forEach((item, index) => {
      item?.vendors?.forEach((ven, idx) => {
        var findIndex = po?.findIndex(
          (v) => v.vendor.id == ven.vendor.vendor.id
        );
        if (findIndex < 0) {
          po.push({
            vendor: ven.vendor.vendor,
            poDate: dateFormatInput(Date.now()),
            project: wo?.project,
            project_code: wo?.project_code,
            remarks: null,
            woNumber: wo?.wo_number,
            woNd: wo?.id,
            error: null,
            isLoading: false,
            created: false,
            materials: [
              {
                material_id: wo?.materials[index].material_id,
                material_name: wo?.materials[index].detail.material_name,
                price: wo?.materials[index].vendors[idx].price,
                qty: wo?.materials[index].vendors[idx].qty,
                remarks: wo?.materials[index].vendors[idx].remarks,
                totalPrice: wo?.materials[index].vendors[idx].totalPrice,
              },
            ],
          });
        } else {
          po[findIndex].materials.push({
            material_id: wo?.materials[index].material_id,
            material_name: wo?.materials[index].detail.material_name,
            price: wo?.materials[index].vendors[idx].price,
            qty: wo?.materials[index].vendors[idx].qty,
            totalPrice: wo?.materials[index].vendors[idx].totalPrice,
          });
        }
      });
    });
    setPoMode(true);
    setPurcahseOrders(po);
  }

  function isPurchaseFormValid() {
    var isValid = true;
    purchaseOrders?.forEach((item, i) => {
      purchaseOrders[i].error = null;
      if (
        item.poDate == null ||
        item.poDate == "" ||
        item.poDate == undefined
      ) {
        isValid = false;
        purchaseOrders[i].error = {
          ...purchaseOrders[i].error,
          poDate: "PO Date can't be empty",
        };
      }
      //   if (
      //     item.poNumber == null ||
      //     item.poNumber == "" ||
      //     item.poNumber == undefined
      //   ) {
      //     isValid = false;
      //     purchaseOrders[i].error = {
      //       ...purchaseOrders[i].error,
      //       poNumber: "PO Number can't be empty",
      //     };
      //   }
    });
    setPurcahseOrders([...purchaseOrders]);
    return isValid;
  }

  function createPurchaseOrder() {
    if (isPurchaseFormValid()) {
      purchaseOrders?.forEach((val, i) => {
        getPoNumberApi().then((res) => {
          var data = {
            work_order_id: wo?.id,
            po_number: res,
            po_date: moment(val?.poDate),
            vendor_id: val?.vendor?.id,
            to_payment: val?.vendor?.to_payment,
            project: val?.project,
            project_code: val?.project_code,
            remarks: val?.remarks,
            vat: val?.vendor?.vat ?? false,
            items: val?.materials?.map((material, j) => {
              return {
                material_id: material?.material_id,
                remarks: material?.remarks,
                qty: parseFloat(material?.qty),
                price: parseFloat(material?.price),
              };
            }),
          };

          purchaseOrders[i] = { ...purchaseOrders[i], isLoading: true };
          setPurcahseOrders([...purchaseOrders]);
          insertPurchaseOrderApi(data)
            .then((res) => {
              purchaseOrders[i] = {
                ...purchaseOrders[i],
                created: true,
                isLoading: false,
                po: res,
              };
              setPurcahseOrders([...purchaseOrders]);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      });
      updateWoWhenPoCreatedApi(wo?.id);
    }
  }

  // --------------------<PO>--------------------

  return (
    <Grid
      container
      className="page-container mt-5"
      alignItems="center"
      justify="center"
    >
      <Grid item xs={12} lg={10} xl={6}>
        <div className="display-space-between mb-5">
          <h1 className="flex-center">
            {props?.role == "warehouse" && (
              <div>Record Material In ({wo?.wo_number})</div>
            )}
            {props?.role == "purchasing" && (
              <div>
                Create Purchase Order Base on WO Number: {wo?.wo_number}
              </div>
            )}
          </h1>
        </div>
        <Divider />
        <div className="card mt-5 mb-5">
          <Grid container className="page-container mb-3">
            <Grid item lg={4}>
              <div>
                <div className="mb-1">
                  <small className="text-muted">WO Number</small>
                </div>
                <div>{wo?.wo_number}</div>
              </div>
            </Grid>
            <Grid item lg={4}>
              <div>
                <div className="mb-1">
                  <small className="text-muted">WO Date</small>
                </div>
                <div>{dateFormat(wo?.wo_date)}</div>
              </div>
            </Grid>
            <Grid item lg={4}>
              <div className="mb-3">
                <div className="mb-1">
                  <small className="text-muted">Project</small>
                </div>
                <div>{wo?.project}</div>
              </div>
            </Grid>
          </Grid>
          <Grid container className="page-container mb-3">
            <Grid item lg={4}>
              <div>
                <div className="mb-1">
                  <small className="text-muted">Remarks</small>
                </div>
                <div>{wo?.vendor?.remarks ?? "-"}</div>
              </div>
            </Grid>
            <Grid item lg={4}>
              <div>
                <div className="mb-1">
                  <small className="text-muted">Purchase Order</small>
                </div>
                {wo?.po_created && (
                  <div className="flex-center">
                    <Icon fontSize="small" className="me-2" color="secondary">
                      check_circle
                    </Icon>
                    <Typography variant="body2">Created</Typography>
                  </div>
                )}
              </div>
            </Grid>
            <Grid item lg={4}></Grid>
          </Grid>
        </div>

        {wo?.po_created && (
          <div className="card no-padding">
            <div className="p-4">
              <h3>Purchase Orders</h3>
            </div>
            <Divider />
            <TableContainer component={Card} elevation={0}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell width={12}>No</TableCell>
                    <TableCell>PO Date</TableCell>
                    <TableCell>PO Number</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                {wo?.purchase_orders?.map((po, index) => {
                  var onGoingItem = po?.items?.findIndex(
                    (val) => val.qty_delivered < val.qty
                  );
                  var isCompleted = onGoingItem < 0;

                  return (
                    <TableRow
                      key={index}
                      hover={true}
                      onClick={(e) =>
                        openLink(e, getRoute("po.detail", { id: po?.id }))
                      }
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{dateFormat(po?.po_date)}</TableCell>
                      <TableCell>{po?.po_number}</TableCell>
                      <TableCell>{currency(po?.total_price)}</TableCell>
                      <TableCell>{po?.remarks}</TableCell>
                    </TableRow>
                  );
                })}
              </Table>
            </TableContainer>
          </div>
        )}

        {!poMode && !wo?.po_created && (
          <div className="mb-5 card no-padding">
            <div className="display-space-between p-4">
              <h2>Materials</h2>
            </div>
            <TableContainer component={Card} elevation={0}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell width={12}>No</TableCell>
                    <TableCell>Material</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell align="right">Estimated Price</TableCell>
                    <TableCell align="right">Real Price</TableCell>
                  </TableRow>
                </TableHead>
                {(wo?.materials ?? [])?.map((item, index) => {
                  return (
                    <RowItem
                      key={index}
                      index={index}
                      wo={wo}
                      updatedTotalPrice={(total, vendors) =>
                        updateItem(total, vendors, index)
                      }
                    />
                  );
                })}
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      Total
                    </TableCell>
                    <TableCell colSpan={1} align="right">
                      <strong>{currency(estimatedPriceTotal())}</strong>
                    </TableCell>
                    <TableCell colSpan={1} align="right">
                      <div
                        className="flex-center"
                        style={{ justifyContent: "flex-end" }}
                      >
                        {!isPriceOk() && (
                          <Tooltip
                            title="The actual price is higher than the estimated price"
                            placement="top"
                          >
                            <Icon
                              color="primary"
                              fontSize="small"
                              className="me-1"
                            >
                              cancel
                            </Icon>
                          </Tooltip>
                        )}
                        {isPriceOk() && (
                          <Icon
                            color="secondary"
                            fontSize="small"
                            className="me-1"
                          >
                            check_circle
                          </Icon>
                        )}
                        <strong>{currency(realPriceTotal)}</strong>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} align="right"></TableCell>
                    <TableCell colSpan={1}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={generatePurchaseOrder}
                        fullWidth
                        disabled={!isPriceOk() || !isAllVendorSelected}
                        disableElevation
                      >
                        Generate Purchase Order
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

        {poMode && (
          <div className="pb-5 mb-5">
            {!allPoWasCreated() && (
              <div
                className="flex-center pt-4 pb-4"
                style={{ cursor: "pointer" }}
                onClick={() => setPoMode(false)}
              >
                <Icon className="me-2">arrow_back</Icon>
                <strong>Back to Material List</strong>
              </div>
            )}
            <div className="mb-3">
              {purchaseOrders?.map((purchaseOrder, index) => {
                return (
                  <div
                    className="mb-5 card no-padding"
                    variant="outlined"
                    key={index}
                  >
                    <div className="display-space-between p-4">
                      <div>
                        <h4>
                          Purchase Order to {purchaseOrder?.vendor?.vendor_name}
                        </h4>
                        <small>
                          Purchase Order to{" "}
                          {purchaseOrder?.vendor?.vendor_address}
                        </small>
                      </div>
                      {purchaseOrder?.created && (
                        <Link
                          href={getRoute("po.detail", {
                            id: purchaseOrder?.po?.id,
                          })}
                          targe="_blank"
                        >
                          <div className="flex-center">
                            <Icon
                              fontSize="small"
                              className="me-2"
                              color="secondary"
                            >
                              check_circle
                            </Icon>
                            <Typography variant="body2">
                              Successfully created, click to open detail
                            </Typography>
                          </div>
                        </Link>
                      )}
                      {purchaseOrder?.isLoading && <CircularProgressCustom />}
                    </div>
                    <Divider />
                    <div className="p-4 mb-3">
                      <Grid container spacing={3}>
                        <Grid item lg={3}>
                          <InputLabel className="pb-1">
                            <Typography variant="caption">PO Date</Typography>
                          </InputLabel>
                          <InputBase
                            color="secondary"
                            className="input"
                            type="date"
                            name="poDate"
                            disabled={purchaseOrders[index]?.created}
                            value={purchaseOrders[index]?.poDate}
                            onChange={(e) => onChangeInput(e, index)}
                            fullWidth
                          ></InputBase>
                          <small className="text-error">
                            {purchaseOrder?.error?.poDate}
                          </small>
                        </Grid>
                        <Grid item lg={3}>
                          <InputLabel className="pb-1">
                            <Typography variant="caption">PO Number</Typography>
                          </InputLabel>
                          <InputBase
                            disabled
                            name="poNumber"
                            color="secondary"
                            className="input uppercase"
                            // disabled={purchaseOrders[index]?.created}
                            value={purchaseOrders[index]?.poNumber}
                            onChange={(e) => onChangeInput(e, index)}
                            fullWidth
                          ></InputBase>
                          <small className="text-error">
                            {purchaseOrder?.error?.poNumber}
                          </small>
                        </Grid>
                        <Grid item lg={6}>
                          <InputLabel className="pb-1">
                            <Typography variant="caption">Remarks</Typography>
                          </InputLabel>
                          <InputBase
                            name="remarks"
                            color="secondary"
                            className="input"
                            disabled={purchaseOrders[index]?.created}
                            value={purchaseOrders[index]?.remarks}
                            onChange={(e) => onChangeInput(e, index)}
                            fullWidth
                          ></InputBase>
                          <small className="text-error">
                            {purchaseOrder?.error?.remarks}
                          </small>
                        </Grid>
                      </Grid>
                    </div>
                    <Divider />
                    <TableContainer component={Card} elevation={0}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell width={12}>No</TableCell>
                            <TableCell>Material</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {purchaseOrder?.materials?.map((material, i) => {
                            return (
                              <TableRow key={i}>
                                <TableCell width={12}>{i + 1}</TableCell>
                                <TableCell>{material?.material_name}</TableCell>
                                <TableCell>
                                  {currency(material?.price)}
                                </TableCell>
                                <TableCell>{material?.qty}</TableCell>
                                <TableCell>
                                  {currency(material?.totalPrice)}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          <TableRow>
                            <TableCell colSpan={4} align="right">
                              Subtotal Price
                            </TableCell>
                            <TableCell colSpan={1}>
                              <strong>
                                {currency(subtotalPricePerPo(purchaseOrder))}
                              </strong>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={4} align="right">
                              Tax
                            </TableCell>
                            <TableCell colSpan={1}>
                              <strong>
                                {currency(taxPerPo(purchaseOrder))}
                              </strong>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={4} align="right">
                              Total Price
                            </TableCell>
                            <TableCell colSpan={1}>
                              <strong>
                                {currency(totalPricePerPo(purchaseOrder))}
                              </strong>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                );
              })}
            </div>
            {!allPoWasCreated() && (
              <div className="text-right">
                <Button
                  variant="contained"
                  color="secondary"
                  disableElevation
                  disabled={!allPoLoaded()}
                  onClick={createPurchaseOrder}
                >
                  {allPoLoaded() ? (
                    "Create Purchase Order"
                  ) : (
                    <CircularProgressCustom fontSize={24} />
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </Grid>
    </Grid>
  );
}

function RowItem({ index, wo, updatedTotalPrice }) {
  const router = useRouter();

  var material = getDetailMaterialSwr(wo?.materials[index]?.material_id);
  useEffect(() => {
    if ((material?.data?.vendors?.length ?? 0) == 1) {
      selectVendor(material.data.vendors[0], 0);
    } else if ((material?.data?.vendors?.length ?? 0) > 1) {
      var ven = material.data.vendors[0];
      material.data.vendors.forEach((val) => {
        if (val.price < ven.price) {
          ven = val;
        }
      });
      selectVendor(ven, 0);
    }
  }, [material.data]);

  const [vendors, setVendors] = useState([
    { vendor: null, qty: 0, price: 0, totalPrice: 0, remarks: null },
  ]);

  function addRow() {
    setVendors([
      ...vendors,
      { vendor: null, qty: 0, price: 0, totalPrice: 0, remarks: null },
    ]);
  }

  function removeRow(i) {
    vendors.splice(i, 1);
    setVendors([...vendors]);
  }

  function selectVendor(val, i) {
    vendors[i].vendor = val;
    if (i == 0) {
      vendors[i].qty = wo?.materials[index]?.qty ?? 0;
      vendors[i].price = parseFloat(vendors[i]?.vendor?.price);
      vendors[i].totalPrice =
        parseFloat(vendors[i]?.vendor?.price) *
        (wo?.materials[index]?.qty ?? 0);
    } else {
      vendors[i].qty = 0;
      vendors[i].price = 0;
      vendors[i].totalPrice = 0;
    }
    setVendors([...vendors]);
    console.log(vendors);
  }

  function inputQty(val, i) {
    vendors[i].qty = val;
    vendors[i].price = vendors[i]?.vendor?.price;
    vendors[i].totalPrice = vendors[i]?.vendor?.price * val;
    setVendors([...vendors]);
    totalPrice();
    checkQuantityValid();
  }

  function inputRemarks(val, i) {
    vendors[i].remarks = val;
    setVendors([...vendors]);
  }

  function totalPrice() {
    var totalPrice = 0;
    vendors?.forEach((item, i) => {
      totalPrice += item?.qty * item?.vendor?.price;
    });
    updatedTotalPrice(totalPrice, vendors);
    return totalPrice;
  }

  const [isQuantityValid, setQuantityValid] = useState(true);
  function checkQuantityValid() {
    var qtyNeed = wo?.materials[index]?.qty;
    var totalQty = 0;
    vendors?.map((val, i) => {
      if (val?.qty != "") {
        totalQty += parseFloat(val?.qty ?? 0) ?? 0;
      }
    });
    setQuantityValid(qtyNeed >= totalQty);
  }

  useEffect(() => {
    console.log("AAAAA");
  });

  return (
    <TableBody key={index}>
      <TableRow>
        <TableCell>{index + 1}</TableCell>
        <TableCell>
          <Link
            className="text-hover"
            target="_blank"
            href={getRoute("material.detail", {
              id: wo?.materials[index]?.material_id,
            })}
          >
            {wo?.materials[index]?.detail?.code} |{" "}
            {wo?.materials[index]?.detail?.material_name}
          </Link>
        </TableCell>
        <TableCell>
          <div className="flex-center">
            {wo?.materials[index]?.qty ?? 0} {wo?.materials[index]?.unit}
            {!isQuantityValid && (
              <Tooltip
                title="Sorry, the quantity entered is more than what is required"
                placement="top"
              >
                <Icon fontSize="small" className="ms-1" color="primary">
                  cancel
                </Icon>
              </Tooltip>
            )}
          </div>
        </TableCell>
        <TableCell align="right">
          {currency(
            wo?.materials[index]?.detail?.price *
              (wo?.materials[index]?.qty ?? 0)
          )}
        </TableCell>
        <TableCell align="right">{currency(totalPrice())}</TableCell>
      </TableRow>
      {material?.isLoading && (
        <TableRow colSpan={6}>
          <TableCell></TableCell>
        </TableRow>
      )}
      {!material?.isLoading &&
        (vendors ?? [])?.map((item, i) => {
          return (
            <TableRow key={i}>
              <TableCell>
                {material?.data?.vendors?.length > 1 &&
                  (vendors.length > i + 1 ||
                    vendors.length >= material?.data?.vendors?.length) && (
                    <IconButton className="p-0" onClick={() => removeRow(i)}>
                      <Icon fontSize="small">remove_circle</Icon>
                    </IconButton>
                  )}
                {vendors.length == i + 1 &&
                  vendors.length < material?.data?.vendors?.length && (
                    <IconButton className="p-0" onClick={addRow}>
                      <Icon fontSize="small" color="secondary">
                        add_circle
                      </Icon>
                    </IconButton>
                  )}
              </TableCell>
              <TableCell>
                <Select
                  className="input input-small"
                  fullWidth
                  value={item?.vendor ?? "-"}
                  onChange={(e) => selectVendor(e.target.value, i)}
                  input={<InputBase placeholder="Select Vendor" />}
                >
                  <MenuItem
                    key={index + "SDASDS"}
                    value="-"
                    className="text-muted"
                  >
                    <em>
                      Select Vendor ({material?.data?.vendors?.length ?? "-"}{" "}
                      available)
                    </em>
                  </MenuItem>
                  {(material?.data?.vendors ?? [])?.map(
                    (itemVendor, indexVendor) => {
                      return (
                        <MenuItem key={indexVendor} value={itemVendor}>
                          {itemVendor?.vendor?.vendor_name},{" "}
                          {currency(itemVendor?.price)}/{material?.data?.unit}
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
              </TableCell>
              <TableCell>
                <InputBase
                  className="input me-3"
                  type="number"
                  disabled={item?.vendor == null}
                  value={item?.qty ?? 0}
                  style={{ width: 100 }}
                  inputProps={{
                    min: 0,
                    max: wo?.materials[index]?.qty ?? 0,
                  }}
                  onChange={(e) => inputQty(e.target.value, i)}
                  placeholder="0"
                ></InputBase>
              </TableCell>
              <TableCell align="right">
                <InputBase
                  className="input"
                  fullWidth
                  value={item?.remarks ?? ""}
                  onChange={(e) => inputRemarks(e.target.value, i)}
                  placeholder="Remarks"
                ></InputBase>
              </TableCell>
              <TableCell align="right" className="text-muted">
                {currency(item?.qty * item?.vendor?.price)}
              </TableCell>
            </TableRow>
          );
        })}
    </TableBody>
  );
}
