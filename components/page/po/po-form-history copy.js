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
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableFooter,
  Table,
  TableRow,
  TablePagination,
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
import { getPOHistorySwr } from "../../../services/swr/po-history.swr";
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
  const [totalPoStatus, setTotalPoStatus] = useState([]);
  const [poStatusList, setPoStatusList] = useState([]);
  const [poNumber, setPoNumber] = useState("");
  // const [vendor, setVendor] = useState(null);
  var poStatusSwr = getPOHistorySwr(poNumber);
  // useEffect(() => {
  //   if (poStatusSwr?.data) {
  //     setPoNumber(poStatusSwr?.po_number);
  //   }
  // }, [poStatusSwr]);

  useEffect(() => {
    if (props?.open) {
      if (props?.isEdit) {
        setPoNumber(props?.data?.po_number);
      }
    }
  }, [props?.open]);

  useEffect(() => {
    setLoading(poStatusSwr?.isLoading);
    if (poStatusSwr?.data?.result) {
      setTotalPoStatus(poStatusSwr?.data?.total);
      setPoStatusList(poStatusSwr?.data?.result);
    }
  }, [poStatusSwr]);

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
    // setFormState(null);
    // // setVendorId(null);
    // // setVendor(null);
    // setMaterialSelected([]);
    props?.closeModal();
  }

  return (
    <Modal
      open={props?.open}
      onClose={() => closeModal()}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className="modal-wrapper" style={{ width: "80%" }}>
        <Card className="modal">
          <div className="modal-header">
            <h3>{props?.isEdit ? "PO History" : "PO History"}</h3>
          </div>
          <div className="modal-content">
            <TableContainer component={Card}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={3}>PO Number : {poNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Process Date</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Position Current</TableCell>
                    <TableCell>Team Current</TableCell>
                    <TableCell>Position Next</TableCell>
                    <TableCell>Team Next</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!isLoading &&
                    poStatusList.map((data, index) => {
                      return (
                        <TableRow key={index} hover={true}>
                          <TableCell width={20}>{data?.date_process}</TableCell>
                          <TableCell>{data?.username}</TableCell>
                          <TableCell>{data?.name}</TableCell>
                          <TableCell>{data?.position_current}</TableCell>
                          <TableCell>{data?.team_current?.name}</TableCell>
                          <TableCell>{data?.position_next}</TableCell>
                          <TableCell>{data?.team_next?.name}</TableCell>
                        </TableRow>
                      );
                    })}
                  {isLoading && (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center text-muted"
                        align="center"
                      >
                        Loading...
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading && poStatusList?.length <= 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center text-muted"
                        align="center"
                      >
                        No Data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                {/* <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[10, 20, 50, 100]}
                      colSpan={10}
                      count={total}
                      rowsPerPage={limit}
                      page={page}
                      SelectProps={{
                        inputProps: { "aria-label": "rows per page" },
                        native: true,
                      }}
                      onChangePage={(e, page) => setPage(page)}
                      onChangeRowsPerPage={(e) => {
                        setPage(0);
                        setLimit(parseInt(e.target.value));
                      }}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter> */}
              </Table>
            </TableContainer>
          </div>
          <div className="modal-footer"></div>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="warning">
              Vendor can be change !
            </Alert>
          </Snackbar>
        </Card>
      </div>
    </Modal>
  );
}
