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
import { green, red, grey } from "@material-ui/core/colors/green";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
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
import { getListFlowSwr } from "../../../services/swr/ref_flow.swr";
import {
  getPOHistorySwr,
  getPoStatusDetailSwr,
} from "../../../services/swr/po-history.swr";
import { CircularProgressCustom } from "../../base_component/spinner";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import AlertDialog from "../../base_component/dialog";
import { AlternateEmail, Search } from "@material-ui/icons";

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
  const [listAplLength, setListAplLength] = useState([]);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  // --------<LIST REF FLOW>--------
  const [refFlow, setRefFlow] = useState([]);
  var ListRefFlow = getListFlowSwr(
    {
      page: 1,
      limit: 0,
      orderBy: "status",
      order: "desc",
      isAccepted: true,
      pendingAcceptance: false,
    },
    "purchase_order"
  );
  useEffect(() => {
    if (ListRefFlow?.data?.result) {
      setRefFlow(ListRefFlow?.data?.result ?? []);
    }
    setListAplLength(ListRefFlow?.data?.result?.length);
  }, [ListRefFlow]);

  // --------<DETAIL  REF FLOW>--------

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
  const [statusApl, setStatusApl] = useState([]);
  const [statusAplLength, setStatusAplLength] = useState([]);

  var poStatusSwr = getPOHistorySwr(poNumber);
  useEffect(() => {
    if (poStatusSwr?.data?.result) {
      setStatusApl(poStatusSwr?.data?.result ?? []);
    }
    setStatusAplLength(poStatusSwr?.data?.result?.length);
  }, [poStatusSwr]);

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

  function subtotalPrice() {
    var result = 0;
    materialSelected.map((val, i) => {
      var price = val?.qty * val?.price;
      if (!Number.isNaN(price)) result += price;
    });
    return result;
  }

  function checkValidation() {
    var isValid = true;
    return isValid;
  }
  //const [isLoading, setLoading] = useState(false);
  const [vendorSelect, setVendorSelect] = useState([]);

  function closeModal() {
    // setFormState(null);
    // // setVendorId(null);
    // // setVendor(null);
    // setMaterialSelected([]);
    props?.closeModal();
  }

  function findStatus(array, flowId) {
    return array.find((element) => {
      return element.id == flowId;
    });
  }

  var dataPoDetail = getPoStatusDetailSwr(
    poNumber,
    "09527ec1-c109-4a43-ad8d-352451348b24"
  );

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
                    <TableCell colSpan={7}>PO Number : {poNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>
                      Process
                      <br />
                      Date
                    </TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Team</TableCell>
                    {/* <TableCell>Username</TableCell> */}
                    <TableCell>PIC</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!isLoading &&
                    refFlow.map((data, index) => {
                      var dataStatus = [];
                      if (statusApl != null) {
                        var dateBefore = 0;
                        var dateCurrent = 0;

                        statusApl.map((data2, index) => {
                          if (data2.status_application_id_current == data?.id) {
                            if (index < statusAplLength - 1) {
                              dateBefore = new Date(
                                statusApl[index + 1].date_process
                              );
                              dateCurrent = new Date(
                                statusApl[index].date_process
                              );
                            }
                            if (index == statusAplLength - 1) {
                              dateBefore = new Date(
                                statusApl[index].date_process
                              );
                              dateCurrent = new Date(
                                statusApl[index].date_process
                              );
                            }
                            if (
                              index == 0 &&
                              statusApl[index].date_process == null
                            ) {
                              dateBefore = new Date(
                                statusApl[index + 1].date_process
                              );
                              dateCurrent = "";
                            }

                            var startDate = moment(dateBefore);
                            var timeEnd = moment(dateCurrent);
                            var diff = timeEnd.diff(startDate);
                            var diffDuration = moment.duration(diff);
                            var day = "";
                            var hour = "";
                            var minute = "";
                            var second = "";
                            if (diffDuration.days() > 0) {
                              day = diffDuration.days() + " Days ";
                            }
                            if (diffDuration.hours() > 0) {
                              hour = diffDuration.hours() + " Hours ";
                            }
                            if (diffDuration.minutes() > 0) {
                              minute = diffDuration.minutes() + " Minutes ";
                            }
                            if (diffDuration.seconds() > 0) {
                              second = diffDuration.seconds() + " Seconds ";
                            }
                            var mm = day + hour + minute + second;
                            var timeElapse = mm;
                            dataStatus = {
                              uname: data2.username,
                              name: data2.name,
                              statDesc: data2.description,
                              dateProcess: dateCurrent,
                              dateBefore: dateBefore,
                              dateDif: timeElapse,
                            };
                          }
                        });
                      }

                      return (
                        <Fragment>
                          <TableRow key={index} hover={true}>
                            {/* <TableCell width={20}>{data?.date_process}</TableCell> */}
                            <TableCell
                              width={20}
                              style={{ borderBottom: "0px" }}
                            >
                              {dataStatus?.uname == null && (
                                <Icon style={{ color: "red" }}>pending</Icon>
                              )}
                              {dataStatus?.uname != null && (
                                <Icon style={{ color: "green" }}>
                                  check_circle
                                </Icon>
                              )}
                            </TableCell>
                            <TableCell>
                              {moment(dataStatus?.dateProcess).format("LLL")}
                            </TableCell>
                            <TableCell>{data?.position?.position}</TableCell>
                            <TableCell>{data?.team?.name}</TableCell>
                            <TableCell>{dataStatus?.name}</TableCell>
                            <TableCell>{dataStatus?.statDesc}</TableCell>
                          </TableRow>
                          {/* {index < listAplLength && ( */}
                          {index != listAplLength - 1 &&
                            dataStatus?.uname != null && (
                              <TableRow>
                                <TableCell colSpan={7}>
                                  <Fragment>
                                    <Icon
                                      style={{
                                        color: "green",
                                        fontSize: "24px",
                                      }}
                                    >
                                      arrow_upward
                                    </Icon>
                                    {"   "}
                                    <Icon
                                      style={{
                                        color: "grey",
                                        fontSize: "small",
                                      }}
                                    >
                                      hourglass_bottom
                                    </Icon>
                                    {"   "}
                                    <font style={{ color: "green" }}>
                                      {dataStatus?.dateDif}
                                    </font>
                                  </Fragment>
                                </TableCell>
                              </TableRow>
                            )}
                          {/* )} */}
                        </Fragment>
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
