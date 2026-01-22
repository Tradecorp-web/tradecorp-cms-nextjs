import {
  Button,
  Card,
  CardHeader,
  CardContent,
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
  Box,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { sendFlagAcc } from "../../../../../services/export/send-po-acc";

import { getListCoaSwr } from "../../../../../services/swr/coa.swr";
import { getCoaDetailApi } from "../../../../../services/api/coa.api";
import NumberFormat from "react-number-format";
import { Delete, Add, Save } from "@material-ui/icons";

import moment from "moment";
import React, { useEffect, useState } from "react";
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
  headerItem: {
    padding: "0 5px",
    color: "#333",
  },
}));
export default function PoJournalForm(props) {
  let param = { limit: 999 };
  const [coaList, setCoaList] = useState([]);
  const [optionCoa, setOptionCoa] = useState([]);
  const classes = useStyles();
  const [selectedCoa, setSelectedCoa] = useState([]);
  const [CoaTmp, setCoaTmp] = useState([]);
  const [CoaNameTmp, setCoaNameTmp] = useState([]);
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
  }, [props?.open]);

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
  //journal
  const [dataJournalList, setDataJournalList] = useState([
    {
      id: null,
      coa_code: null,
      remark_detail: null,
      debit: null,
      credit: null,
    },
  ]);
  const [serviceList, setServiceList] = useState([{ service: "" }]);
  const handleServiceAdd = () => {
    // setServiceList([...serviceList, { service: "" }]);
    setServiceList([
      ...serviceList,
      {
        id: null,
        coa_code: null,
        remark_detail: null,
        debit: null,
        credit: null,
      },
    ]);
  };
  const handleServiceRemove = (index) => {
    const list = [...serviceList];
    alert(JSON.stringify(list));
    // const list = [...dataJournalList];
    list.splice(index, 1);
    setServiceList(list);
  };
  const hendleServiceChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...serviceList];
    if (e.target.name === "remark_detail") list[index]["remark_detail"] = value;
    if (e.target.name === "coa") list[index]["coa"] = value;
    if (e.target.name === "debit") list[index]["debit"] = value;
    if (e.target.name === "credit") list[index]["credit"] = value;
    setServiceList(list);
  };

  console.log(serviceList);
  //==add function for journal

  const closeForm = () => {
    props?.closeModal();
  };

  const onCoaChange = (event, value, extra, index) => {
    if (value != null) {
      // const { name, value } = event.target;
      // const list = [...serviceList];
      // list[index][name] = value;
      // setServiceList(list);
      // alert(JSON.stringify(value));
      var objekval = Object.values(value);
      var coa_code = objekval[1].split("-");
      data.coa = coa_code[0].trim();
      setSelectedCoa({
        id: objekval[0],
        label: objekval[1],
      });
    } else {
      data.coa = "";
      setSelectedCoa({
        id: "",
        label: "",
      });
    }
  };

  const saveJournal = () => {
    alert(JSON.stringify(serviceList));
  };
  const [errorText, setErrorText] = useState({});
  const [inputList, setInputList] = useState([
    { coa: null, remark_detail: null, debit: null, credit: null },
  ]);
  const [data, setData] = useState({
    id: null,
    remark: null,
    trx_src: null,
    trx_date: null,
    reference_number: null,
    reference_document: null,
    details: [],
  });

  const getCoa = async (id) => {
    if (id != undefined) {
      var result = await getCoaDetailApi(id);
      setSelectedCoa({
        id: result.coa_code,
        label: result.coa_code + " - " + result.coa_name,
      });
      setCoaTmp(result.coa_code);
      setCoaNameTmp(result.coa_code + " - " + result.coa_name);
    } else {
      setSelectedCoa({
        id: "",
        label: "",
      });
    }
  };

  //get coa
  var coaSwr = getListCoaSwr(param);
  useEffect(() => {
    if (coaSwr?.data) {
      setCoaList(coaSwr?.data.result ?? []);
    }
  }, [coaSwr]);
  useEffect(() => {
    var list = [];
    list.push({ id: "", label: "" });
    coaList.map((item, i) => {
      list.push({ id: item.id, label: item.coa_code + " - " + item.coa_name });
    });
    setOptionCoa(list);
  }, [coaList]);

  useEffect(() => {
    trx_date: dateFormatInput("01-01-2022");
    getCoa("120");
  }, []);

  return (
    <Modal open={props?.open} onClose={closeForm}>
      <Box className="modal-wrapper" style={{ width: "1200px" }}>
        <Card className="modal">
          <Box className="modal-header">
            <Box className="me-3" style={{ width: "100%" }}>
              <Grid container>
                <Grid item xs={11} direction="column">
                  <h3>Jounal Transaction</h3>
                </Grid>
                <Grid item xs={1} direction="column">
                  <Button
                    variant="outlined"
                    size="small"
                    style={{ display: "flex", justifyContent: "right" }}
                    onClick={closeForm}
                    color="default"
                  >
                    <Icon className="me-2">close</Icon>
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box className="modal-content">
            <Box className="mb-3">
              <Grid
                container
                spacing={2}
                // justify="left"
                //   alignItems="center"
                className={classes.root}
              >
                <Grid item lg={3}>
                  <h3 className="mb-3">Transaction Date</h3>
                </Grid>
                <Grid item lg={6}>
                  <InputBase
                    color="secondary"
                    className="input"
                    type="date"
                    name="trx_date"
                    value="2022-06-09"
                    // onChange={onChangeInput}
                    fullWidth
                  ></InputBase>
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3">
              <Grid
                container
                spacing={2}
                justify="left"
                alignItems="center"
                className={classes.root}
              >
                <Grid item lg={3}>
                  Reference Doc
                </Grid>
                <Grid item lg={6}>
                  <TextField
                    size="small"
                    name="reference_document"
                    label="Reference Doc"
                    variant="outlined"
                    value="PO.EDE001.22001.001"
                    disabled={true}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3">
              <Grid
                container
                spacing={2}
                justify="left"
                alignItems="center"
                className={classes.root}
              >
                <Grid item lg={3}>
                  Reference Document
                </Grid>
                <Grid item lg={3}>
                  <TextField
                    name="reference_number"
                    label="Reference Number"
                    variant="outlined"
                    disabled={true}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item lg={3}>
                  <TextField
                    name="trx_src"
                    label="Trx Source"
                    variant="outlined"
                    disabled={true}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>

            <Box className="mb-3">
              <Card className="{classes.root}">
                <CardHeader title="" subheader="Journal Input"></CardHeader>
                <CardContent>
                  {serviceList.map((singleService, index) => (
                    <Grid
                      container
                      spacing={2}
                      justify="left"
                      alignItems="center"
                      className={classes.root}
                      key={index}
                    >
                      <Grid item lg={2}>
                        <Autocomplete
                          options={optionCoa}
                          autoHighlight
                          // value={selectedCoa}
                          value={singleService.coa}
                          onChange={(e, v) => onCoaChange(e, v, true, index)}
                          getOptionLabel={(option) => option?.label}
                          renderOption={(option) => (
                            <React.Fragment>{option?.label}</React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              id="coa"
                              name="coa"
                              label="COA"
                              error={errorText.coa}
                              helperText={errorText.coa}
                              fullWidth
                              size="small"
                            />
                          )}
                        />
                        {/* {serviceList.length - 1 === index &&
                        serviceList.length <= 4 && (
                          <button
                            type="button"
                            className="add-btn"
                            onClick={handleServiceAdd}
                          >
                            <span>Add Journal</span>
                          </button>
                        )} */}
                      </Grid>

                      <Grid item lg={4}>
                        <TextField
                          name="remark_detail"
                          label="Remark Detail"
                          // onBlur={(e, v) =>
                          //   hendleServiceChange(e, v, true, index)
                          // }
                          onBlur={(e) => hendleServiceChange(e, index)}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item lg={2}>
                        <NumberFormat
                          name="debit"
                          label="Debit"
                          customInput={TextField}
                          thousandsGroupStyle="thousand"
                          value="0"
                          prefix=""
                          decimalSeparator="."
                          displayType="input"
                          type="text"
                          thousandSeparator={true}
                          allowNegative={false}
                          className={classes.headerItem}
                        />
                      </Grid>
                      <Grid item lg={2}>
                        <NumberFormat
                          name="credit"
                          label="Credit"
                          customInput={TextField}
                          thousandsGroupStyle="thousand"
                          value="0"
                          prefix=""
                          decimalSeparator="."
                          displayType="input"
                          type="text"
                          thousandSeparator={true}
                          allowNegative={false}
                          justify="right"
                          alignItems="right"
                        />
                      </Grid>
                      <Grid item lg={1}>
                        {serviceList.length > 1 && (
                          <Button
                            color="primary"
                            type="button"
                            variant="contained"
                            className="remove-btn"
                            onClick={() => handleServiceRemove(index)}
                          >
                            <Delete />
                            Remove
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  ))}
                  <Grid
                    container
                    spacing={2}
                    justify="left"
                    alignItems="center"
                    className={classes.root}
                  >
                    <Grid item xs={10} sm={10}>
                      <Button
                        color="primary"
                        onClick={handleServiceAdd}
                        variant="outlined"
                        size="small"
                        style={{ display: "flex", justifyContent: "left" }}
                      >
                        <Add />
                        Add Jurnal
                      </Button>
                    </Grid>

                    <Grid item xs={2} sm={2}>
                      <Button
                        onClick={saveJournal}
                        color="secondary"
                        variant="contained"
                        size="small"
                        style={{ display: "flex", justify: "right" }}
                      >
                        <Save />
                        Save Jurnal
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Card>
      </Box>
    </Modal>
  );
}
