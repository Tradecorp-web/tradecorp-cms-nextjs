import { Icon } from "@material-ui/core";
import {
  Card,
  Button,
  Link,
  IconButton,
  Divider,
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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CircularProgressCustom } from "../../../../base_component/spinner";
import {
  currency,
  dateFormat,
  dateTimeFormatInput,
  dateTimeFormat,
  dateFormatInput,
  isPermit,
} from "../../../../../helpers/general";
import { updatePurchaseOrderApi } from "../../../../../services/api/po.api";
import { insertMaterialStockHistoryApi } from "../../../../../services/api/material.api";
import { getDetailPurchaseOrderSwr } from "../../../../../services/swr/po.swr";
import getRoute from "../../../../../helpers/router";
import moment from "moment";

export default function PODetailComponent(props) {
  const router = useRouter();
  const poId = router.query.id;

  const [po, setPo] = useState(null);
  const [poBackup, setPoBackup] = useState(null);
  const poSwr = getDetailPurchaseOrderSwr(poId);
  useEffect(() => {
    setPo(poSwr.data);
  }, [poSwr]);

  // --------<Edit Mode>--------
  const [itemIndex, setItemIndex] = useState(-1);
  const [addingQtyDelivered, setAddingQtyDelivered] = useState(false);

  const [qtyItemHistoryLoading, setQtyItemHistoryLoading] = useState(null);
  const [qtyItemHistoryInput, setQtyItemHistoryInput] = useState(null);
  const [qtyItemHistoryInputErrorText, setQtyItemHistoryInputErrorText] =
    useState(null);
  const [doItemHistoryInput, setDoItemHistoryInput] = useState(null);
  const [doItemHistoryInputErrorText, setDoItemHistoryInputErrorText] =
    useState(null);

  function resetAllEditMode() {
    if (poBackup != null) {
      setPo({ ...poBackup });
    }
    setAddingQtyDelivered(false);
    setQtyItemHistoryLoading(false);
    setQtyItemHistoryInput(null);
    setQtyItemHistoryInputErrorText(null);
    setDoItemHistoryInput(null);
    setDoItemHistoryInputErrorText(null);
    setItemIndex(-1);
  }

  function openQtyDeliveredInsertForm(index) {
    resetAllEditMode();
    if (itemIndex != index) {
      setPoBackup({ ...po });
      setAddingQtyDelivered(true);
      setItemIndex(index);
    }
  }

  function isValid() {
    var isValid = true;
    var qty = parseFloat(qtyItemHistoryInput);
    var data = { ...poBackup };
    if (
      Number.isNaN(qty) ||
      qty < 0 ||
      qty > data?.items[itemIndex]?.qty - data?.items[itemIndex]?.qty_delivered
    ) {
      console.log("3333");
      setQtyItemHistoryInputErrorText(
        `The quantity inputted must be (0 < qty <= ${
          data?.items[itemIndex]?.qty - data?.items[itemIndex]?.qty_delivered
        })`
      );
      isValid = false;
    }
    if (doItemHistoryInput == "" || doItemHistoryInput == null) {
      setDoItemHistoryInputErrorText("Delivery Order Number can't be empty");
      isValid = false;
    }
    return isValid;
  }

  const addQtyDeliveredHistoryProcess = async () => {
    setQtyItemHistoryInputErrorText(null);
    var qty = parseFloat(qtyItemHistoryInput);
    if (isValid()) {
      var data = { ...poBackup };
      data.po_date = moment(data.po_date);
      var now = Date.now();
      var qtyHistory = {
        qty: qty,
        delivery_order: doItemHistoryInput,
        created_at: moment(),
      };
      if (data?.items[itemIndex]?.histories != null)
        data?.items[itemIndex]?.histories?.push(qtyHistory);
      else data.items[itemIndex].histories = [qtyHistory];
      data.items[itemIndex].qty_delivered += qty;
      setQtyItemHistoryLoading(true);

      try {
        var res = await updatePurchaseOrderApi(data, poId);
        resetAllEditMode();
        setPo(res);
        insertMaterialStockHistoryApi(
          {
            qty: qty,
            description: `Incoming stock from Purchase Order ${po?.po_number} with Delivery Order ${doItemHistoryInput}`,
          },
          data.items[itemIndex].material_id
        );
      } catch (err) {
        resetAllEditMode();
      }
    }
  };

  // --------<Edit Mode>--------

  return (
    <Grid
      container
      className="page-container mt-5"
      alignItems="center"
      justify="center"
      spacing={3}
    >
      <Grid item xs={12} lg={10} xl={6}>
        <div className="display-space-between mb-5">
          <h1 className="flex-center">
            {props?.role == "warehouse" && (
              <div>Record Material In ({po?.po_number})</div>
            )}
            {props?.role == "purchasing" && (
              <div>Purchase Order Detail ({po?.po_number})</div>
            )}
          </h1>
        </div>
        <Divider />
        <div className="card mt-5 mb-5">
          <Grid container className="page-container mb-3">
            <Grid item xs={3} lg={4}>
              <div>
                <div className="mb-1">
                  <small className="text-muted">PO Number</small>
                </div>
                <div>{po?.po_number}</div>
              </div>
            </Grid>
            <Grid item xs={3} lg={4}>
              <div>
                <div className="mb-1">
                  <small className="text-muted">PO Date</small>
                </div>
                <div>{dateFormat(po?.po_date)}</div>
              </div>
            </Grid>
            <Grid item xs={3} lg={4}>
              <div>
                <div className="mb-1">
                  <small className="text-muted">Vendor</small>
                </div>
                <div className="flex-center">
                  {po?.vendor?.logo != null && po?.vendor?.logo != "" && (
                    <img
                      src={po?.vendor?.logo ?? ""}
                      style={{
                        width: 20,
                        height: 20,
                        marginRight: "8px",
                        objectFit: "contain",
                      }}
                    />
                  )}
                  {po?.vendor?.vendor_name}
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid container className="page-container mb-3">
            <Grid item xs={3} lg={4}>
              <div>
                <div className="mb-1">
                  <small className="text-muted">WO Number</small>
                </div>
                <div>{po?.work_order?.wo_number}</div>
              </div>
            </Grid>
            <Grid item xs={3} lg={4}>
              <div>
                <div className="mb-1">
                  <small className="text-muted">Project</small>
                </div>
                <div>{po?.project}</div>
              </div>
            </Grid>
            <Grid item xs={3} lg={4}>
              <div>
                <div className="mb-1">
                  <small className="text-muted">Remarks</small>
                </div>
                <div>{po?.remarks ?? "-"}</div>
              </div>
            </Grid>
          </Grid>
          <Divider />
          {/* <div className="mt-3">
            <Button
              variant="contained"
              color="secondary"
              elevation="0"
              siz="small"
              disableElevation={true}
            >
              Export PDF
            </Button>
          </div> */}
        </div>
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
                  <TableCell>Delivered Qty</TableCell>
                  {isPermit("component", "price_material") && (
                    <TableCell>Price</TableCell>
                  )}
                  {isPermit("component", "price_material") && (
                    <TableCell align="right">Total</TableCell>
                  )}
                </TableRow>
              </TableHead>
              {(po?.items ?? [])?.map((item, index) => {
                return (
                  <TableBody key={index}>
                    <TableRow>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Link
                          className="text-hover"
                          href={getRoute("material.detail", {
                            id: item?.material?.id,
                          })}
                          onClick={() =>
                            router.push(
                              getRoute("material.detail", {
                                id: item?.material?.id,
                              })
                            )
                          }
                        >
                          ({item?.material?.code}){" "}
                          {item?.material?.material_name}
                        </Link>
                        {item?.remarks != null && (
                          <p className="m-0 text-muted">
                            Remarks: {item?.remarks}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {item?.qty ?? 0} {item?.material?.unit}
                      </TableCell>
                      <TableCell>
                        {props?.role == "purchasing" && (
                          <div className="flex-center">
                            {item?.qty_delivered ?? 0} {item?.material?.unit}
                            {item?.qty_delivered >= item?.qty && (
                              <Icon
                                color="secondary"
                                className="ms-2"
                                fontSize="small"
                              >
                                check_circle
                              </Icon>
                            )}
                          </div>
                        )}
                        {props?.role == "warehouse" && (
                          <div className="flex-center">
                            {item?.qty_delivered ?? 0} {item?.material?.unit}
                            {item?.qty_delivered >= item?.qty && (
                              <Icon
                                color="secondary"
                                className="ms-2"
                                fontSize="small"
                              >
                                check_circle
                              </Icon>
                            )}
                            {item?.qty_delivered < item?.qty && (
                              <IconButton
                                size="small"
                                className="ms-2 p-0"
                                onClick={() =>
                                  openQtyDeliveredInsertForm(index)
                                }
                              >
                                <Icon>add_circle</Icon>
                              </IconButton>
                            )}
                          </div>
                        )}
                      </TableCell>
                      {isPermit("component", "price_material") && (
                        <TableCell>{currency(item?.price)}</TableCell>
                      )}
                      {isPermit("component", "price_material") && (
                        <TableCell align="right">
                          {currency(item?.total_price)}
                        </TableCell>
                      )}
                    </TableRow>
                    {addingQtyDelivered && itemIndex == index && (
                      <TableRow>
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={5}>
                          <div className="mb-2 text-muted">
                            <em>Add the quantity that has been sent</em>
                          </div>
                          <div className="flex-center">
                            <InputBase
                              className="input input-small me-3"
                              type="number"
                              style={{ width: 100 }}
                              onChange={(e) =>
                                setQtyItemHistoryInput(e.target.value)
                              }
                              placeholder="Qty"
                            ></InputBase>
                            <InputBase
                              className="input input-small me-3"
                              type="text"
                              style={{ width: 300 }}
                              onChange={(e) =>
                                setDoItemHistoryInput(e.target.value)
                              }
                              placeholder="Delivery Order Number"
                            ></InputBase>
                            <Button
                              color="default"
                              variant="contained"
                              disableElevation
                              disabled={qtyItemHistoryLoading}
                              onClick={addQtyDeliveredHistoryProcess}
                              size="small"
                            >
                              {qtyItemHistoryLoading ? (
                                <CircularProgressCustom size={22} />
                              ) : (
                                "Add"
                              )}
                            </Button>
                            <IconButton
                              size="small"
                              className="ms-2 p-0"
                              onClick={() => openQtyDeliveredInsertForm(index)}
                            >
                              <Icon>cancel</Icon>
                            </IconButton>
                          </div>
                          {qtyItemHistoryInputErrorText != null && (
                            <div className="mb-2 text-error">
                              <small>{qtyItemHistoryInputErrorText}</small>
                            </div>
                          )}
                          {doItemHistoryInputErrorText != null && (
                            <div className="mb-2 text-error">
                              <small>{doItemHistoryInputErrorText}</small>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                    {item?.histories?.map((history, i) => (
                      <TableRow key={`history-${i}`}>
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={5} className="text-muted">
                          <em>
                            {history?.qty} {item?.material?.unit} Delivered at{" "}
                            {dateTimeFormat(history?.created_at)} with Delivery
                            Order {history?.delivery_order ?? "-"}
                          </em>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                );
              })}
              {isPermit("component", "price_material") && (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} align="right"></TableCell>
                    <TableCell colSpan={2}>
                      <div className="display-space-between mb-2">
                        <span>Subtotal</span>
                        <strong>{currency(po?.subtotal_price)}</strong>
                      </div>
                      <div className="display-space-between mb-2">
                        <span>Vat</span>
                        <strong>{currency(po?.vat)}</strong>
                      </div>
                      <div className="display-space-between mb-2">
                        <span>Total Cost</span>
                        <strong>{currency(po?.total_price)}</strong>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </div>
      </Grid>
    </Grid>
  );
}
