import BaseLayout from "../../base_layout/base-layout";

import {
  Icon,
  Divider,
  Button,
  TextField,
  OutlinedInput,
  Card,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Collapse,
  IconButton,
  TableFooter,
  TablePagination,
  Link,
  Checkbox,
} from "@material-ui/core";

import {
  LOCAL_STORAGE_PREFIX,
  LOCAL_STORAGE_SUFFIX,
  LOCAL_STORAGE_THOUSAND,
  LOCAL_STORAGE_DECIMAL,
  LOCAL_STORAGE_SCALE,
  LOCAL_STORAGE_TAX,
  LOCAL_STORAGE_USER_ID,
} from "../../../helpers/consts";

import SalesForm from "./payment-method/form-sales";

import Autocomplete from "@material-ui/lab/Autocomplete";
import NumberFormat from "react-number-format";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import AlertDialog from "../../../components/base_component/dialog";

import { Edit, SentimentSatisfiedOutlined } from "@material-ui/icons";
import Moment from "moment";
import {
  currency,
  dateTimeFormat,
  numberConvert,
} from "../../../helpers/general";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";

import InvoiceLayout from "../invoice/invoice-layout";

import {
  getDetailSalesOrderSwr,
  getInvoiceProjectSwr,
} from "../../../services/swr/sales-order.swr";

import { saveWOApi } from "../../../services/api/wo.api";

import {
  getDetailSalesOrderApi,
  getListSalesOrderApi,
  insertFileSOApi,
  getFileSOApi,
  saveSOTerm,
  saveSOTermDetail,
  deleteFileSO,
  getSOProjectIncomeApi,
  getSoPaymentTermApi,
} from "../../../services/api/sales-order.api";
import { getDetailInvoiceApi } from "../../../services/api/invoice.api";
import { FileUploadSecureComponent } from "../../base_component/file-upload";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { v4 as uuid } from "uuid";
import { route } from "next/dist/next-server/server/router";

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
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },

  labelbase: {
    marginTop: 10,
    fontSize: 12,
  },
  labelbasebold: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "bold",
  },
  inputbase: {
    fontSize: "12px !important",
    height: 30,
  },
  inputbasemultiline: {
    fontSize: "12px !important",
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
  tablerow: {
    fontSize: "12px",
    color: "#000000",
  },
  titlecard: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000",
  },
  descriptionbase: {
    marginTop: 10,
    fontStyle: "italic",
    fontSize: ".8rem",
    color: "#656565",
  },
}));

export default function Page() {
  const classes = useStyles();
  const router = useRouter();
  // const soId = router.query.projectcode;

  const tax = localStorage.getItem(LOCAL_STORAGE_TAX);
  const decimal = localStorage.getItem(LOCAL_STORAGE_DECIMAL);
  const prefix = localStorage.getItem(LOCAL_STORAGE_PREFIX);
  const thousand = localStorage.getItem(LOCAL_STORAGE_THOUSAND);
  const scale = localStorage.getItem(LOCAL_STORAGE_SCALE);
  const userid = localStorage.getItem(LOCAL_STORAGE_USER_ID);

  //dialog
  const [openAlertDlg, setOpenAlertDlg] = React.useState(false);
  //==dialog

  const [checked, setChecked] = React.useState(false);
  const [fileId, setFileId] = React.useState(false);
  const [dataDescription, setDataDescription] = React.useState(false);
  const [tax2, setTax2] = React.useState(0);
  const [totalAfterSimulation, setTotalAfterSimulation] = React.useState(0);

  const [openConfirmDlg, setOpenConfirmDlg] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const [dataSimulation, setDataSimulation] = React.useState({
    tax_percent: null,
    total_payment: null,
    down_payment: null,
    down_payment_percent: null,
    deposit: null,
    deposit_value: null,
    duration: null,
    duration_period: null,
    due_date: null,
    due_date_period: null,
    payment_approve: null,
  });

  const handleChange = (event) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      setTax2(tax / 100);
    } else {
      setTax2(0);
    }
    setDataSimulation({ ...dataSimulation, tax_percent: numberConvert(tax) });
  };

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  const styleObj = {
    fontSize: "12px",
    color: "#212f3c",
    textAlign: "left",
    paddingTop: "10px",
  };
  const styleObjData = {
    fontSize: "12px",
    color: "#000000",
    textAlign: "left",
    paddingTop: "10px",
  };

  const [page, setPage] = useState(0);
  const [alertMsg, setAlertMsg] = useState("");
  const [invoiceData, setInvoiceData] = useState([]);
  const [projectCode, setProjectCode] = useState("");
  const [soId, setSoId] = useState("");
  const [fileList, setFileList] = useState(null);
  const [data, setData] = useState(null);
  const [quoteTotalData, setQuoteTotalData] = useState(0);
  const [dpValueDisabled, setDpValueDisabled] = useState(true);
  const [depositValueDisabled, setDepositValueDisabled] = useState(true);
  const [dataReadyInsert, setDataReadyInsert] = useState(false);
  const [warningAlertSimulation, setWarningAlertSimulation] = useState(false);
  const [saveAlertSimulation, setSaveAlertSimulation] = useState(false);
  const [warningAlert, setWarningAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [dataDetail, setDataDetail] = useState(false);
  const [dpPercent, setDpPercent] = useState(false);
  const [diffTotal, setDiffTotal] = useState(false);
  const [otherPaymentVisible, setOtherPaymentVisible] = useState("none");
  const [otherPaymentVisibleState, setOtherPaymentVisibleState] =
    useState(false);

  const [open, setOpen] = useState(false);
  const [openDlg, setOpenDlg] = React.useState(false);
  const [openPayChangeDlg, setOpenPayChangeDlg] = React.useState(false);
  const [btnLease, setBtnLease] = React.useState("none");
  const [btnService, setBtnService] = React.useState("none");
  const [btnSale, setBtnSale] = React.useState("none");

  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("warning");

  const [openPDFFile, setOpenPDFFile] = useState(false);
  const [paymentNumber, setPaymentNumber] = useState(false);

  const [idSO, setIdSO] = useState(false);
  const [incomeType, setIncomeType] = useState("*");
  const [dataSO, setDataSO] = useState(false);
  const [statusSO, setStatusSO] = useState(false);
  const [totalDetail, setTotalDetail] = useState(0);
  const [payTermSelect, setPayTermSelect] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  //open modal form
  //sales
  const [salesForm, setSalesForm] = useState(false);
  const [dataSales, setDataSales] = useState(false);
  const [newData, setNewData] = useState(false);
  const [totalNewPayment, setTotalNewPayment] = useState(0);

  const [createWoConfirmDlg, setCreateWoConfirmDlg] = useState(false);

  const closeFormPayment = () => {
    setOpenConfirmDlg(false);
    setSalesForm(false);
  };
  const closeFormModal = () => {
    setSalesForm(false);
  };
  const refreshSalesForm = async (update) => {
    try {
      setOpen(true);
      if (update.length > 0) {
        var tmpTotal = 0;
        update?.map((row) => {
          tmpTotal = tmpTotal + row.payment_value;
        });
        setTotalNewPayment(tmpTotal);
        if (tmpTotal > quoteTotalData) {
          setFormMessage(
            "Payment more then total quotation, are you sure want to close this form?"
          );
          setOpenConfirmDlg(true);
        } else {
          saveSOTermDetail({ payment_terms: update }, soId);
          setDataReadyInsert({ data: update });
          setDataSimulation({
            ...dataSimulation,
            payment_approve: 0,
            total_payment: quoteTotalData,
            payment_terms: update,
          });
          setSalesForm(false);
        }
      }

      setOpen(false);
    } catch (err) {
      console.log(err);
      setSalesForm(false);
      setOpen(false);
    }
  };

  //lease
  const [serviceForm, setServiceForm] = useState(false);
  //service
  const [leaseForm, setLeaseForm] = useState(false);

  const [fileUpload, setFileUpload] = useState({
    file_id: null,
    file_description: null,
    link: null,
    attachment: null,
    content_type: null,
  });

  const soSwr = getDetailSalesOrderSwr(soId);

  //create group so

  //==create group so
  const invoiceSwr = getInvoiceProjectSwr(projectCode);
  var taxP = 0;
  invoiceSwr?.data?.result?.map((row, key) => {
    taxP = row?.taxes_persen;
  });

  const [errorText, setErrorText] = useState({
    order_date: null,
    estimate_delivery_date: null,
  });

  const getPaymentTerm = async (method) => {
    var paymentTerm = await getSoPaymentTermApi(method);
    setDataSimulation({
      ...dataSimulation,
      deposit: paymentTerm.deposit,
      deposit_value: paymentTerm.deposit_value,
      duration_period: paymentTerm.duration_period,
      due_date: paymentTerm.due_date,
      due_date_period: paymentTerm.due_date_period,
      down_payment_percent: paymentTerm.down_payment_percent,
      tax_percent: paymentTerm.tax_percent,
      duration: paymentTerm.duration,
      down_payment: paymentTerm.down_payment,
      payment_approve: paymentTerm.payment_approve,
    });
  };

  const downloadFile = async (id, file_id) => {
    try {
      var response = await getFileSOApi(id, file_id);
      if (response.status == 200) {
        var reader = response.body.getReader();
        var contenttype = response.headers.get("Content-Type");
        var chunks = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          chunks.push(value);
        }
        var content = new Blob(chunks, { type: contenttype });
        var url = window.URL.createObjectURL(content);
        var tmpLink = document.createElement("a");
        tmpLink.href = url;
        tmpLink.setAttribute("target", "_blank");
        tmpLink.click();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    var total2 = 0;
    var dp = 0;
    setDpPercent(0);
    if (totalNewPayment <= totalDetail) {
      dataReadyInsert?.data?.map((row) => {
        if (row.payment_type != "deposit") {
          total2 = total2 + row.payment_value;
        }
        if (row.payment_type == "dp") {
          dp = row.payment_value;
        }
      });
      setDpPercent(((dp / totalDetail) * 100).toFixed(2));
      setDiffTotal(total2 - totalDetail);
      setTotalAfterSimulation(total2);
    }
  });

  //get total description

  useEffect(() => {
    if (invoiceSwr?.data) {
      setInvoiceData(invoiceSwr?.data.result ?? []);
    }
  }, [invoiceSwr]);

  useEffect(async () => {
    refresh();

    if (incomeType == "*") {
      var dataTrx = await getSOProjectIncomeApi(
        router.query.projectcode,
        "sale"
      );
      if (dataTrx.total > 0) {
        setIncomeType("sale");
      } else {
        var dataTrx = await getSOProjectIncomeApi(
          router.query.projectcode,
          "lease"
        );
        if (dataTrx.total > 0) {
          setIncomeType("lease");
        } else {
          var dataTrx = await getSOProjectIncomeApi(
            router.query.projectcode,
            "service"
          );
          setIncomeType("service");
        }
      }
    } else {
      var dataTrx = await getSOProjectIncomeApi(
        router.query.projectcode,
        incomeType
      );
      if (dataTrx.total <= 0) {
        setDefaultDataSO();
        setAlertMsg("Data " + incomeType + " doesn't exist");
        setOpenAlert(true);
        setSeverity("warning");
      }
    }

    var dataTrxIncomeType = await getSOProjectIncomeApi(
      router.query.projectcode,
      "*"
    );
    if (dataTrxIncomeType.total > 0) {
      dataTrxIncomeType?.result?.map((res) => {
        res.income_type == "sale" ? setBtnSale(null) : "";
        res.income_type == "lease" ? setBtnLease(null) : "";
        res.income_type == "service" ? setBtnService(null) : "";
      });
    }

    getPaymentTerm(incomeType);
    // setdataSO(dataTrx);
    var description = [];
    var soFile = [];
    var tmp = [];
    var rpt = "";

    dataTrx?.result?.map((res) => {
      setSoId(res.id);
      setProjectCode(res.project_code);
      setDataSO({
        id: res.id,
        due_date: res.due_date,
        customer_name: res.customer_name,
        sales_name: res.sales_name,
        company_name: res.company_name,
        customer_code: res.customer_code,
        customer_email: res.customer_email,
        down_payment: res.down_payment,
        sales_username: res.sales_username,
        payment_terms: res.payment_terms,
        duration_period: res.duration_period,
        deposit: res.deposit,
        customer_id: res.customer_id,
        customer_company_name: res.customer_company_name,
        customer_phone: res.customer_phone,
        quote_id: res.quote_id,
        sales_id: res.sales_id,
        company_address: res.company_address,
        due_date_period: res.due_date_period,
        quote_date: res.quote_date,
        project_description: res.project_description,
        total_payment: res.total_payment,
        duration: res.duration,
        customer_company_type: res.customer_company_type,
        customer_address: res.customer_address,
        sales_order_file: res.sales_order_file,
        status_acc: res.status_acc,
        sales_phone_number: res.sales_phone_number,
        project_name: res.project_name,
        deposit_value: res.deposit_value,
        sales_email: res.sales_email,
        project_code: res.project_code,
        estimate_delivery_date: res.estimate_delivery_date,
        company_id: res.company_id,
        down_payment_percent: res.down_payment_percent,
        company_id: res.company_id,
        sales_order_number: res.sales_order_number,
        order_date: res.order_date,
        income_type: res.income_type,
        description: res.description,
        payment_approve: res.payment_approve,
        tax_percent: res.tax_percent,
        comment_sales_order: res.comment_sales_order,
      });
      if (res?.payment_approve == null) {
        setStatusSO("Draft");
      } else if (res?.payment_approve == 0) {
        setStatusSO("Waiting for approval");
      } else {
        setStatusSO("Ready to create invoice");
      }
      var totalDetail = 0;
      res?.description?.map((row, key) => {
        totalDetail = totalDetail + row?.price * row?.quantity;
      });
      setTotalDetail(totalDetail);
      setQuoteTotalData(totalDetail);
      setIdSO(res.id);
      if (res?.income_type == "lease") {
        setPayTermSelect([
          {
            id: "Day",
            label: "Day",
          },
          {
            id: "Week",
            label: "Week",
          },
          {
            id: "Month",
            label: "Month",
          },
          {
            id: "Year",
            label: "Year",
          },
        ]);
      } else {
        setPayTermSelect([
          {
            id: "Times",
            label: "Times",
          },
        ]);
      }
      getDataPayTerm(res.payment_terms);
      setFileList(res.sales_order_file);
    });
  }, [incomeType]);
  const onUploaded = (res) => {
    if (res != null) {
      setFileUpload({
        ...fileUpload,
        file_description: document.getElementById("file_description").value,
        link: res.link,
        attachment: res.file_name,
        content_type: res.content_type,
        deleted_at: null,
      });
      fileListData.push({
        file_id: "",
        file_description: document.getElementById("file_description").value,
        link: res.link,
        attachment: res.attachment,
        content_type: res.content_type,
      });
    }
  };
  const getDesc = () => {
    if (document.getElementById("file_description").value != null) {
      setFileUpload({
        ...fileUpload,
        file_description: document.getElementById("file_description").value,
      });
    }
  };

  const handleAlertClose = () => {
    setOpenAlertDlg(false);
  };
  const sendFile = (id) => {
    insertFileSOApi(id, fileUpload).then((res) => {
      setFileList(res.sales_order_file);
      setFileUpload({
        file_id: null,
        file_description: null,
        link: null,
        attachment: null,
        content_type: null,
      });
      document.getElementById("file_description").value = "";
    });
  };

  const createInvoicePDF = async (id) => {
    setPage(0);
    setOpen(true);
    let result = await getDetailInvoiceApi(id);
    setData({
      id: id,
      invoice_number: result.invoice_number,
      invoice_date: result.invoice_date,
      invoice_due_date: result.invoice_due_date,
      project_code: result.project_code,
      project_description: result.project_description,
      estimate_delivery_date: result.estimate_delivery_date,
      client_id: result.client,
      customer_id: result.customer_id,
      product_id: result.product_id,
      sales_id: result.sales_id,
      containers: result.containers,
      purchase_order_code: result.purchase_order_code,
    });
    setOpen(false);
    setOpenPDFFile(true);
  };

  const refreshListInvoice = async () => {
    setOpenPDFFile(false);
  };

  const handleClickOpen = (payNum, desc, val) => {
    setDataDetail({
      ...dataDetail,
      payment_detail_description: desc,
      payment_value: val,
    });

    setPaymentNumber(payNum);
    setOpenDlg(true);
  };

  const handleClose = () => {
    setOpenDlg(false);
  };

  const onInputDetailChange = (event) => {
    setDataDetail({ ...dataDetail, [event.target.name]: event.target.value });
  };
  const UpdatePaymentTerm = () => {
    if (checkDetailValidation()) {
      setOpen(true);
      var payDesc = "";
      var payVal = 0;
      var dataTerm = [];
      var total = 0;
      // soSwr?.data?.payment_terms?.map((row, key) => {

      dataReadyInsert?.data?.map((row, key) => {
        if (row.payment_number == paymentNumber) {
          payDesc = dataDetail.payment_detail_description;
          payVal = parseFloat(dataDetail.payment_value);
        } else {
          payDesc = row.payment_detail_description;
          payVal = row.payment_value;
        }
        dataTerm.push({
          payment_number: row.payment_number,
          payment_type: row.payment_type,
          payment_detail_description: payDesc,
          payment_term_type: row.payment_term_type,
          payment_value: payVal,
        });
        total = total + payVal;
      });
      saveSOTermDetail({ payment_terms: dataTerm }, soId);
      var totalVersus = total - quoteTotalData;

      setDataReadyInsert({ data: dataTerm });
      setOpen(false);
      setOpenDlg(false);
    }
  };
  const deleteFile = (getFileId) => {
    setOpenAlertDlg(true);

    setFileId(getFileId);
  };
  const returnToProject = () => {
    router.push("edit-list/" + projectCode);
  };
  const DeleteFileSO = () => {
    setOpen(true);
    var today = Moment().format("YYYY-MM-DDTh:mm:ss") + ".000Z";
    var dataFile = [];

    // soSwr?.data?.sales_order_file?.map((row, key) => {
    fileList?.map((row, key) => {
      if (row.file_id == fileId) {
        dataFile.push({
          file_id: row.file_id,
          file_description: row.file_description,
          user_upload: row.user_upload,
          send_date: row.send_date,
          attachment: row.attachment,
          link: row.link,
          content_type: row.content_type,
          thumbnail: row.thumbnail,
          deleted_at: today,
          deleted_by: userid,
        });
      } else {
        dataFile.push({
          file_id: row.file_id,
          file_description: row.file_description,
          user_upload: row.user_upload,
          send_date: row.send_date,
          attachment: row.attachment,
          link: row.link,
          content_type: row.content_type,
          thumbnail: row.thumbnail,
          deleted_at: row.deleted_at,
          deleted_by: row.deleted_by,
        });
      }
    });
    deleteFileSO({ sales_order_file: dataFile }, soId, fileId);
    setFileList(dataFile);
    setOpen(false);
    setOpenAlertDlg(false);
  };
  const changeIncome = (incType) => {
    setIncomeType(incType);
  };
  const onChangeSimulationChk = (e) => {
    var targetValue = e.target.value;
    var targetName = e.target.name;
    if (e.target.name == "down_payment") {
      if (e.target.checked) {
        setDpValueDisabled(false);
        targetValue = true;
      } else {
        setDpValueDisabled(true);
        targetValue = false;
      }
    }
    if (e.target.name == "deposit") {
      if (e.target.checked) {
        setDepositValueDisabled(false);
        targetValue = true;
      } else {
        setDepositValueDisabled(true);
        targetValue = false;
      }
    }

    if (
      targetName == "duration" ||
      targetName == "due_date" ||
      targetName == "deposit_value" ||
      targetName == "down_payment_percent"
    ) {
      targetValue = numberConvert(targetValue);
    }
    setDataSimulation({ ...dataSimulation, [e.target.name]: targetValue });
  };

  const getSimulation = (paymentApprove) => {
    setSaveAlertSimulation(false);
    setWarningAlertSimulation(false);
    if (dataSimulation.duration <= 0) {
      setWarningAlertSimulation(true);
      return;
    }
    // setOpen(true);
    var dataReadyInsert = [];
    var number = 1;
    var vTotalPayment = quoteTotalData; //+ quoteTotalData * tax2;
    var vTotalPayment2 = quoteTotalData; // + quoteTotalData * tax2;
    var vParsialPayment = 0;
    var reduce = 0;
    if (dataSimulation.down_payment) {
      number = 0;
      reduce = 1;
      vTotalPayment =
        vTotalPayment -
        (vTotalPayment * dataSimulation.down_payment_percent) / 100;
      vParsialPayment = vTotalPayment / numberConvert(dataSimulation.duration);
    } else {
      vParsialPayment = vTotalPayment / numberConvert(dataSimulation.duration);
    }
    if (dataSimulation.deposit) {
      number = 0;
      reduce = 1;
    }

    for (let i = number; i <= dataSimulation.duration - reduce; i++) {
      if (dataSimulation.down_payment) {
        if (number == 0) {
          dataReadyInsert.push({
            payment_id: uuid(),
            payment_number: number,
            payment_type: "dp",
            payment_detail_description: "Down Payment",
            payment_term_type: "percent",
            payment_value:
              (vTotalPayment2 *
                numberConvert(dataSimulation.down_payment_percent)) /
              100,
          });
        }
      }
      if (dataSimulation.deposit) {
        if (number == 0) {
          dataReadyInsert.push({
            payment_id: uuid(),
            payment_number: number,
            payment_type: "deposit",
            payment_detail_description: "Deposit Payment",
            payment_term_type: "balance",
            payment_value: numberConvert(dataSimulation.deposit_value),
          });
        }
      }
      dataReadyInsert.push({
        payment_id: uuid(),
        payment_number: number + reduce,
        payment_type: "payment",
        payment_detail_description: "Payment #" + (number + reduce),
        payment_term_type: "balance",
        payment_value: vParsialPayment,
      });
      number++;
    }

    setDataReadyInsert({ data: dataReadyInsert });
    setDataSimulation({ ...dataSimulation, total_payment: quoteTotalData });
    setDataSimulation({
      ...dataSimulation,
      payment_approve: paymentApprove,
      total_payment: quoteTotalData,
      payment_terms: dataReadyInsert,
    });

    // setOpen(false);
    setOpenPayChangeDlg(false);
    // alert(JSON.stringify(dataReadyInsert));
  };

  const createWO = () => {
    var dataWo = {
      customer_id: dataSO?.customer_id,
      project_code: dataSO?.project_code,
      customer_code: dataSO?.customer_code,
      project: dataSO?.project_description,
      sales_id: dataSO?.sales_id,
      sales_order_id: dataSO?.id,
    };

    saveWOApi(dataWo).then((res) => {
      setOpenAlert(true);
      setAlertMsg("Work Order Saved");
      setCreateWoConfirmDlg(false);
      setSeverity("info");
      setTimeout(function () {
        router.push("/wo");
      }, 1000);
    });
  };
  function onChangeSimulation(e) {
    setDataSimulation({ ...dataSimulation, [e.target.name]: e.target.value });
  }

  function otherPaymentSchema() {
    if (incomeType != "lease") {
      setSalesForm(true);
      setDataSimulation({ ...dataSimulation, payment_approve: 0 });
    } else {
      setOpenPayChangeDlg(true);
    }
  }
  function closeOtherPayment() {
    setOpenPayChangeDlg(false);
  }

  function saveDataSimulation() {
    setOpen(true);
    // // setDataReadyInsert();
    saveSOTerm(dataSimulation, soId);
    if (dataSimulation?.payment_approve == null) {
      setStatusSO("Draft");
    } else if (dataSimulation?.payment_approve == 0) {
      setStatusSO("Waiting for approval");
    } else {
      setStatusSO("Ready to create invoice");
    }

    setSaveAlertSimulation(true);
    setOpen(false);
  }

  function checkDetailValidation() {
    var isValid = true;
    var ePaymentDetailDescription = "",
      ePaymentValue = "";
    if (
      dataDetail.payment_detail_description == "" ||
      dataDetail.payment_detail_description == null
    ) {
      isValid = false;
      ePaymentDetailDescription = "Description can not be empty";
    }
    if (dataDetail.payment_value == "" || dataDetail.payment_value == null) {
      isValid = false;
      ePaymentValue = "Payment Value can not be empty";
    }

    setErrorText({
      ...errorText,
      payment_detail_description: ePaymentDetailDescription,
      payment_value: ePaymentValue,
    });
    return isValid;
  }

  function getDataPayTerm(dataPayTerm) {
    var dataTmp = [];
    dataPayTerm?.map((res) => {
      dataTmp.push({
        payment_id: res.payment_id,
        payment_number: res.payment_number,
        payment_type: res.payment_type,
        payment_detail_description: res.payment_detail_description,
        payment_term_type: res.payment_term_type,
        payment_value: res.payment_value,
      });
    });

    setDataReadyInsert({ data: dataTmp });
  }
  function refresh() {
    setSaveAlertSimulation(false);
    setAlertMsg("");
    setOpenAlert(false);
    setOpenAlertDlg(false);
    setButtonDisabled(false);
    setDataSimulation({
      ...dataSimulation,
      deposit_value: 0,
      deposit: false,
      down_payment_percent: 0,
      down_payment: false,
    });
  }
  function setDefaultDataSO() {
    setDataSO({
      id: null,
      due_date: null,
      customer_name: null,
      sales_name: null,
      company_name: null,
      customer_code: null,
      customer_email: null,
      down_payment: null,
      sales_username: null,
      payment_terms: null,
      duration_period: null,
      deposit: null,
      customer_id: null,
      customer_company_name: null,
      customer_phone: null,
      quote_id: null,
      sales_id: null,
      company_address: null,
      due_date_period: null,
      quote_date: null,
      project_description: null,
      total_payment: null,
      duration: null,
      customer_company_type: null,
      customer_address: null,
      sales_order_file: null,
      status_acc: null,
      sales_phone_number: null,
      project_name: null,
      deposit_value: null,
      sales_email: null,
      project_code: null,
      estimate_delivery_date: null,
      company_id: null,
      down_payment_percent: null,
      company_id: null,
      sales_order_number: null,
      order_date: null,
      income_type: null,
      description: null,
      payment_approve: null,
    });
    setButtonDisabled(true);
  }

  return (
    <BaseLayout title="View Sales Order">
      <div className={classes.root}>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Typography variant="subtitle1">View Sales Order</Typography>
          </Box>
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
                onClick={(e) => openPage(e, getRoute("sales"))}
              >
                <Icon style={{ fontSize: 20, color: "#999" }}>home</Icon>
              </Button>
              <Button
                onClick={(e) =>
                  openPage(e, getRoute("sales.sales-order-input"))
                }
                variant="contained"
                color="default"
              >
                <Icon style={{ fontSize: 20, color: "#f5b7b1" }}>
                  open_in_new
                </Icon>
                {"  "}
                New Sales Order
              </Button>
              <Button
                variant="contained"
                color="default"
                // onClick={() => {
                //   returnToProject();
                // }}

                onClick={(e) =>
                  openPage(e, getRoute("sales.sales-order-ongoing"))
                }
              >
                <Icon style={{ fontSize: 20, color: "yellow" }}>
                  pending_actions
                </Icon>
                {"  "}
                Sales Order List
              </Button>
              {/* <Button
                onClick={(e) =>
                  openPage(e, getRoute("sales.sales-order-history"))
                }
                variant="contained"
                color="default"
              >
                <Icon style={{ fontSize: 20, color: "#af601a" }}>
                  work_history
                </Icon>
                {"  "}
                History Sales Order Transaction
              </Button> */}
            </div>
          </Box>
        </Box>

        <Paper className={classes.paper}>
          <Box container spacing={2}>
            <Box item>
              <ButtonBase>
                <Icon style={{ fontSize: 30, color: "#5d6d7e" }}>
                  visibility
                </Icon>
              </ButtonBase>{" "}
            </Box>
            <Box item xs={12} sm container>
              <Grid container>
                <Grid item xs={4}>
                  <Typography gutterBottom variant="subtitle1">
                    View Sales Order
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <span
                    style={{
                      float: "right",
                      fontSize: "12px",
                      marginLeft: "5px",
                      display: btnService,
                    }}
                  >
                    <Button
                      onClick={(e) => changeIncome("service")}
                      variant="contained"
                      color="default"
                    >
                      <Icon style={{ fontSize: 20, color: "#f5b7b1" }}>
                        open_in_new
                      </Icon>
                      {"  "}
                      Service
                    </Button>
                  </span>
                  <span
                    style={{
                      float: "right",
                      fontSize: "12px",
                      marginLeft: "5px",
                      display: btnLease,
                    }}
                  >
                    <Button
                      onClick={() => changeIncome("lease")}
                      variant="contained"
                      color="default"
                    >
                      <Icon style={{ fontSize: 20, color: "#f5b7b1" }}>
                        open_in_new
                      </Icon>
                      {"  "}
                      Lease
                    </Button>
                  </span>
                  <span
                    style={{
                      float: "right",
                      fontSize: "12px",
                      marginLeft: "5px",
                      display: btnSale,
                    }}
                  >
                    <Button
                      onClick={(e) => changeIncome("sale")}
                      variant="contained"
                      color="default"
                    >
                      <Icon style={{ fontSize: 20, color: "#f5b7b1" }}>
                        open_in_new
                      </Icon>
                      {"  "}
                      Sale
                    </Button>
                  </span>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box container spacing={2}>
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
                  severity={severity}
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
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Button
                      onClick={() => {
                        returnToProject();
                      }}
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        cursor: "handpointer",
                      }}
                    >
                      {dataSO?.project_code}
                    </Button>
                    <Typography className={classes.labelbase}>
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.5rem",
                          marginLeft: "0.5rem",
                        }}
                      >
                        {dataSO?.sales_order_number}
                        {" - "}
                      </span>
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.5rem",
                          color: "green",
                          textTransform: "uppercase",
                        }}
                      >
                        {" "}
                        {dataSO?.income_type}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    style={{ textAlign: "right" }}
                    className="mt-3"
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        setCreateWoConfirmDlg(true);
                      }}
                    >
                      Create Work Order
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box container spacing={2}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography className={classes.labelbase}>
                      Order Date
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.labelbase}>
                      Estimate Delivery Date
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <OutlinedInput
                      id="order_date"
                      readOnly={true}
                      className={classes.inputbasero}
                      name="order_date"
                      type="text"
                      value={Moment(dataSO?.order_date).format("L")}
                      fullWidth
                    ></OutlinedInput>
                  </Grid>

                  <Grid item xs={6}>
                    <OutlinedInput
                      className={classes.inputbasero}
                      readOnly={true}
                      id="estimate_delivery_date"
                      name="estimate_delivery_date"
                      value={Moment(dataSO?.estimate_delivery_date).format("L")}
                      type="text"
                      fullWidth
                    ></OutlinedInput>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>

          <Box container spacing={2}>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography className={classes.labelbase}>
                    Project Name
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography className={classes.labelbase}>
                    Project Code
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography className={classes.labelbase}>
                    Quote Date
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <OutlinedInput
                    id="project_name"
                    readOnly={true}
                    className={classes.inputbasero}
                    value={dataSO?.project_name}
                    name="project_name"
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
                <Grid item xs={3}>
                  <OutlinedInput
                    id="project_code_text"
                    readOnly={true}
                    className={classes.inputbasero}
                    value={dataSO?.project_code}
                    name="project_code_text"
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>

                <Grid item xs={3}>
                  <OutlinedInput
                    id="quote_date"
                    readOnly={true}
                    className={classes.inputbasero}
                    value={Moment(dataSO?.quote_date).format("L")}
                    name="quote_date"
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography className={classes.labelbase}>
                Customer Name
              </Typography>
            </Box>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <OutlinedInput
                    id="customer_name"
                    readOnly={true}
                    className={classes.inputbasero}
                    name="customer_name"
                    value={dataSO?.customer_name}
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>

                <Grid item xs={4}>
                  <OutlinedInput
                    id="customer_company_name"
                    readOnly={true}
                    className={classes.inputbasero}
                    value={dataSO?.customer_company_name}
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
                    value={dataSO?.customer_email}
                    name="customer_email"
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box container spacing={2}>
            <Box item xs={10}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography className={classes.labelbase}>
                    Sales Type
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.labelbase}>
                    Sales Name
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography className={classes.labelbase}>
                    Sales Email
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box container spacing={2}>
            <Box item xs={10}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <OutlinedInput
                    id="income_type"
                    readOnly={true}
                    className={classes.inputbasero}
                    name="income_type"
                    value={dataSO?.income_type}
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
                <Grid item xs={6}>
                  <OutlinedInput
                    id="sales_name"
                    readOnly={true}
                    className={classes.inputbasero}
                    name="sales_name"
                    value={dataSO?.sales_name}
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
                <Grid item xs={3}>
                  <OutlinedInput
                    id="sales_email"
                    readOnly={true}
                    className={classes.inputbasero}
                    value={dataSO?.sales_email}
                    name="sales_email"
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box container spacing={2}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>
                Project Description
              </Typography>
            </Box>
            <Box item xs={10}>
              <OutlinedInput
                className={classes.inputbasero}
                value={dataSO?.project_description}
                rowsMax={5}
                multiline
                name="project_description"
                type="textare"
                fullWidth
                readOnly={true}
              ></OutlinedInput>
            </Box>
          </Box>
        </Paper>

        <Paper className={classes.paper}>
          <h2 className="mb-3 mt-2">Descriptions</h2>
          <Box className="mb-3">
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="Item Description">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Item Description</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataSO?.description?.map((row, key) => (
                    <TableRow hover>
                      <TableCell key={row.id} align="left">
                        {row.description}
                      </TableCell>
                      <TableCell key={row.id} align="right">
                        {row.quantity} {row.uom}
                      </TableCell>
                      <TableCell key={row.id} align="right">
                        {currency(row.price)}
                      </TableCell>
                      <TableCell key={row.id} align="right">
                        {currency(row.price * row.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      align="right"
                      colSpan={3}
                      className={classes.tablefooter}
                    >
                      Total
                    </TableCell>
                    <TableCell align="right" className={classes.tablefooter}>
                      {currency(totalDetail)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>

        <Paper className={classes.paper}>
          <h2 className="mb-3 mt-5">Payment Method</h2>
          <h1 className="mb-3 mt-0" style={{ color: "red" }}>
            {statusSO}
          </h1>
          <Box className="mb-3">
            <Collapse in={warningAlert}>
              <Alert
                severity="warning"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setWarningAlert(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {message}
              </Alert>
            </Collapse>
            <Collapse in={warningAlertSimulation}>
              <Alert
                severity="warning"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setWarningAlertSimulation(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                input duration first!
              </Alert>
            </Collapse>
            <Collapse in={saveAlertSimulation}>
              <Alert
                severity="success"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setSaveAlertSimulation(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                Data saved!
              </Alert>
            </Collapse>
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="Item Payment">
                <TableBody>
                  <TableRow style={{ backgroundColor: "#faf5f5" }}>
                    <TableCell align="right" width={220}>
                      Tax ({tax}%)
                    </TableCell>
                    <TableCell align="left" width={220}>
                      <Checkbox
                        id="taxCheck"
                        name="taxCheck"
                        onChange={handleChange}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="left">
                      Total {currency(quoteTotalData)}
                    </TableCell>
                    <TableCell align="left">
                      Tax Value {currency(tax2 * quoteTotalData)}
                    </TableCell>
                    <TableCell align="right">
                      Total after tax{" "}
                      {currency(tax2 * quoteTotalData + quoteTotalData)}
                      {"   "}
                    </TableCell>
                  </TableRow>

                  <TableRow
                    style={{
                      backgroundColor: "#faf5f5",
                      display: dataSO?.payment_approve == null ? null : "none",
                    }}
                  >
                    <TableCell colSpan={6} align="center">
                      <Button
                        disabled={buttonDisabled}
                        name="defaultPaymentBtn"
                        id="defaultPaymentBtn"
                        variant="contained"
                        style={{
                          backgroundColor: "#1a7d30",
                          color: "white",
                        }}
                        onClick={() => getSimulation(1)}
                      >
                        Default Payment
                      </Button>
                      {"  "}
                      <Button
                        disabled={buttonDisabled}
                        name="generatePaymentBtn"
                        id="generatePaymentBtn"
                        variant="contained"
                        color="primary"
                        onClick={otherPaymentSchema}
                      >
                        Other Payment Schema
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow
                    style={{
                      backgroundColor: "#faf5f5",
                      display: otherPaymentVisible,
                    }}
                  >
                    <TableCell>Duration</TableCell>
                    <TableCell>
                      Due Date{"  "}
                      <span className={classes.descriptionbase}>
                        After Invoice Date
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        style={{
                          visibility:
                            dataSO?.income_type != "lease" &&
                            otherPaymentVisibleState
                              ? "visible"
                              : "hidden",
                        }}
                      >
                        Down Payment (%){" "}
                        <Checkbox
                          id="down_payment"
                          name="down_payment"
                          color="primary"
                          onChange={onChangeSimulationChk}
                        />
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        style={{
                          visibility:
                            dataSO?.income_type == "lease"
                              ? "visible"
                              : "hidden",
                        }}
                      >
                        Deposit{" "}
                        <Checkbox
                          id="deposit"
                          name="deposit"
                          color="primary"
                          onChange={onChangeSimulationChk}
                        />
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <Button onClick={() => closeOtherPayment()}>
                        <Icon>close</Icon>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    style={{
                      backgroundColor: "#faf5f5",
                      display: otherPaymentVisible,
                    }}
                  ></TableRow>

                  <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                    <TableCell className={classes.tablehead}>
                      Payment Type
                    </TableCell>
                    <TableCell colSpan={2} className={classes.tablehead}>
                      Payment Desc
                    </TableCell>
                    <TableCell className={classes.tablehead}>
                      Payment Term Type
                    </TableCell>
                    <TableCell className={classes.tablehead} align="center">
                      Payment Value
                    </TableCell>
                  </TableRow>

                  {/* {dataReadyInsert?.data?.map((row, index) => ( */}
                  {dataReadyInsert?.data?.map((row, index) => (
                    <TableRow>
                      {/* <TableCell>{row?.payment_number}</TableCell> */}
                      <TableCell>
                        {row?.payment_type == "dp" &&
                          "Down Payment " + dpPercent + "%"}
                        {row?.payment_type != "dp" && row?.payment_type}
                      </TableCell>
                      <TableCell colSpan={2}>
                        {row?.payment_detail_description}
                      </TableCell>
                      <TableCell>{row?.payment_term_type}</TableCell>
                      <TableCell align="right">
                        {currency(row?.payment_value)}

                        <Button
                          color="secondary"
                          type="button"
                          disabled={
                            dataSO?.payment_approve == null ? false : true
                          }
                          onClick={() =>
                            handleClickOpen(
                              row?.payment_number,
                              row?.payment_detail_description,
                              row?.payment_value
                            )
                          }
                        >
                          <Edit />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={5} align="right">
                      <span style={{ marginRight: "4rem", fontWeight: "bold" }}>
                        Total : {currency(totalAfterSimulation)}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} align="right">
                      <span style={{ marginRight: "4rem", fontWeight: "bold" }}>
                        Tax {tax2 * 100} {" %"}:
                        {currency(tax2 * totalAfterSimulation)}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} align="right">
                      <span style={{ marginRight: "4rem", fontWeight: "bold" }}>
                        Different : {currency(diffTotal)}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    style={{
                      display: dataSO.payment_approve == null ? null : "none",
                    }}
                  >
                    <TableCell>
                      <Button
                        style={{
                          display:
                            dataSimulation.payment_approve != null
                              ? null
                              : "none",
                        }}
                        disabled={buttonDisabled}
                        name="generatePaymentBtn"
                        id="generatePaymentBtn"
                        variant="contained"
                        color="primary"
                        onClick={saveDataSimulation}
                      >
                        Update Payment Term
                      </Button>
                    </TableCell>
                    <TableCell colSpan={4}>
                      <span
                        className={classes.descriptionbase}
                        style={{
                          display:
                            dataSimulation.payment_approve == 0 ? null : "none",
                        }}
                      >
                        Updates simulation payment will require the approval of
                        the finance department
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
        <Paper className={classes.paper}>
          <Box>
            <Grid
              container
              spacing={2}
              justify="center"
              alignItems="center"
              className={classes.root}
            >
              <Grid item xs={6} sm={6}>
                <TextField
                  disabled={dataSO?.payment_approve == 3 ? true : false}
                  name="file_description"
                  id="file_description"
                  label="Note"
                  variant="outlined"
                  // defaultValue={data.message}
                  // value={data.message}
                  required
                  error={errorText.message}
                  helperText={errorText.message}
                  // onChange={onInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={5} sm={5}>
                <FileUploadSecureComponent
                  disabled={dataSO?.payment_approve == null ? false : true}
                  id="image"
                  path="sales"
                  fileUploaded={(res) => onUploaded(res)}
                  url={fileUpload.link}
                  deleteFile={() => onUploaded(null)}
                />
              </Grid>
              <Grid item xs={1} sm={1}>
                <Button
                  // disabled={buttonDisabled}
                  disabled={dataSO?.payment_approve == 3 ? true : false}
                  variant="contained"
                  color="secondary"
                  onMouseEnter={() => getDesc()}
                  onFocus={() => getDesc()}
                  onClick={() => sendFile(dataSO?.id)}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box className="mb-3">
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="Item Description">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">No</TableCell>
                    <TableCell align="left">File Description</TableCell>
                    <TableCell align="left">File Name</TableCell>
                    <TableCell align="left">Upload Date</TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fileList != null &&
                    fileList?.map(
                      (row, key) =>
                        row.deleted_at == null && (
                          <TableRow hover>
                            <TableCell key={row.file_id} align="left">
                              {key + 1}
                            </TableCell>
                            <TableCell key={row.file_id} align="left">
                              {row.file_description}
                            </TableCell>
                            <TableCell key={row.file_id} align="left">
                              {row.attachment} {row.uom}
                            </TableCell>
                            <TableCell key={row.file_id} align="left">
                              {dateTimeFormat(row.send_date)}
                            </TableCell>

                            <TableCell>
                              {row.thumbnail != null && (
                                <Box>
                                  <Link
                                    onClick={() =>
                                      downloadFile(soId, row.file_id)
                                    }
                                  >
                                    <Typography
                                      variant="h5"
                                      component="h5"
                                      style={{ wordWrap: "anywhere" }}
                                    >
                                      {row.attachment}
                                    </Typography>
                                  </Link>
                                </Box>
                              )}
                            </TableCell>
                            <TableCell key={row.file_id} align="left">
                              <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                // onMouseEnter={() => getFileDelete()}
                                onClick={() => deleteFile(row.file_id)}
                              >
                                <DeleteIcon fontSize="inherit" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>

        <InvoiceLayout
          open={openPDFFile}
          so={data}
          closeModal={refreshListInvoice}
        />

        <Dialog
          open={openDlg}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Payment Change</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Change Description and Payment Value for number {paymentNumber}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              defaultValue={dataDetail.payment_detail_description}
              id="payment_detail_description"
              name="payment_detail_description"
              label="Payment Description"
              type="text"
              error={errorText.payment_detail_description ? true : false}
              helperText={errorText.payment_detail_description}
              onChange={(e) => onInputDetailChange(e)}
              fullWidth
            />
            <TextField
              margin="dense"
              id="payment_value"
              defaultValue={dataDetail.payment_value}
              name="payment_value"
              label="Payment value"
              onChange={(e) => onInputDetailChange(e)}
              type="number"
              error={errorText.payment_value ? true : false}
              helperText={errorText.payment_value}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={UpdatePaymentTerm} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openPayChangeDlg}
          onClose={closeOtherPayment}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <DialogContentText>Change Payment Method</DialogContentText>
            <Grid container>
              <Grid xs={6}>
                <TextField
                  autoFocus
                  style={{
                    visibility:
                      dataSO?.income_type != "lease" ? "visible" : "hidden",
                  }}
                  margin="dense"
                  variant="outlined"
                  defaultValue={dataSimulation.down_payment_percent}
                  id="down_payment_percent"
                  name="down_payment_percent"
                  label="Down Payment (%)"
                  type="text"
                  // error={errorText.down_payment_percent ? true : false}
                  // helperText={errorText.down_payment_percent}
                  onChange={(e) => onChangeSimulationChk(e)}
                  fullWidth
                />
              </Grid>
              <Grid xs={6}>
                <TextField
                  margin="dense"
                  id="deposit_value"
                  style={{
                    marginLeft: "5px",
                    visibility:
                      dataSO?.income_type == "lease" ? "visible" : "hidden",
                  }}
                  variant="outlined"
                  defaultValue={dataSimulation.deposit_value}
                  name="deposit_value"
                  label="Deposit"
                  size="small"
                  onChange={(e) => onChangeSimulationChk(e)}
                  type="number"
                  // error={errorText.deposit_value ? true : false}
                  // helperText={errorText.deposit_value}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  id="duration"
                  label="Duration"
                  size="small"
                  defaultValue={dataSimulation.duration}
                  name="duration"
                  onChange={(e) => onChangeSimulationChk(e)}
                  type="number"
                  // error={errorText.duration_period ? true : false}
                  // helperText={errorText.duration_period}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <Select
                  variant="outlined"
                  style={{
                    height: "40px",
                    marginLeft: "5px",
                    marginTop: "8px",
                  }}
                  id="duration_period"
                  name="duration_period"
                  onChange={onChangeSimulation}
                  defaultValue={dataSimulation.duration_period}
                  fullWidth
                >
                  {payTermSelect?.map((row) => (
                    <MenuItem value={row.id}>{row.label}</MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  variant="outlined"
                  id="due_date"
                  defaultValue={dataSimulation.due_date}
                  name="due_date"
                  label="Due Date"
                  size="small"
                  onChange={(e) => onChangeSimulationChk(e)}
                  type="number"
                  // error={errorText.due_date ? true : false}
                  // helperText={errorText.due_date}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <Select
                  variant="outlined"
                  style={{
                    height: "40px",
                    marginLeft: "5px",
                    marginTop: "8px",
                  }}
                  size="small"
                  id="due_date_period"
                  name="due_date_period"
                  onChange={onChangeSimulation}
                  fullWidth
                >
                  <MenuItem value="Day">Day</MenuItem>
                  <MenuItem value="Month">Week</MenuItem>
                  <MenuItem value="Week">Month</MenuItem>
                  <MenuItem value="Year">Year</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => closeOtherPayment()} color="primary">
              Cancel
            </Button>
            <Button onClick={() => getSimulation(0)} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <AlertDialog
          open={openAlertDlg}
          cancelAction={() => setOpenAlertDlg(false)}
          okAction={() => DeleteFileSO()}
          title="Delete confirmation"
          body="Are you sure want to delete this file?"
        />
        <AlertDialog
          open={openConfirmDlg}
          cancelAction={() => setOpenConfirmDlg(false)}
          okAction={() => closeFormPayment()}
          title="Payment confirmation"
          body={formMessage}
        />
        <AlertDialog
          open={createWoConfirmDlg}
          cancelAction={() => setCreateWoConfirmDlg(false)}
          okAction={() => createWO()}
          title="Create Work Order?"
          body={formMessage}
        />
      </div>

      <SalesForm
        open={salesForm}
        closeModal2={(updated) => refreshSalesForm(updated)}
        closeModal3={() => closeFormModal()}
        salesData={dataSO}
        totalPayment={quoteTotalData}
        newData={newData}
      />
    </BaseLayout>
  );
}
