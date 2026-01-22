import {
  makeStyles,
  Divider,
  Grid,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Box,
  Backdrop,
  CircularProgress,
  Chip,
  InputBase,
  Select,
  MenuItem,
  Button,
  ButtonGroup,
  Tooltip,
} from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AccountingBaseLayout from "../../base_layout/base-layout-sidemenu-accounting";

import AlertDialog from "../../base_component/dialog";
import { exportWorkOrder } from "../../../services/export/export-wo";
import Moment from "moment";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import Edit from "@material-ui/icons/Edit";

import {
  getListInvoiceApi,
  deleteInvoiceApi,
  getDetailInvoiceApi,
  generateInvoiceNumberApi,
  invoiceFlowNext,
} from "../../../services/api/invoice.api";

import EditInvoiceForm from "../invoice/form-modal";
import InvoiceLayout from "../invoice/invoice-layout";
import InvoiceApproval from "./form-approval";

import { getListInvoiceSwr } from "../../../services/swr/invoice.swr";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function Row(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <TableRow key={props.keys} hover className={classes.root}>
        {/*<TableCell onClick={() => props.clickAction()}>*/}
        <TableCell>{props.keys + 1 + props.page * props.rowsPerPage}</TableCell>
        <TableCell>{props.row.invoice_number}</TableCell>
        <TableCell>{Moment(props.row.invoice_date).format("LL")}</TableCell>
        <TableCell>{Moment(props.row.invoice_due_date).format("LL")}</TableCell>
        <TableCell id="sales_name">
          {" "}
          {props?.row?.sales_name != null ? props?.row?.sales_name : ""}
        </TableCell>
        <TableCell>
          {props?.row?.customer_company_type != null
            ? props?.row?.customer_company_type + ". "
            : ""}

          {props?.row?.customer_company_name != null
            ? props?.row?.customer_company_name + ", "
            : ""}

          {props?.row?.customer_name != null ? props?.row?.customer_name : ""}
        </TableCell>
        <TableCell>{/*{props?.row?.}*/}</TableCell>
        <TableCell>
          <Chip style={{ background: "#77dd77" }} label="0" />
        </TableCell>

        <TableCell>
          {props.row?.invoice_status === "draft" ? (
            <Chip
              style={{ background: "#a7c7e7" }}
              label={props.row?.invoice_status}
            />
          ) : props.row?.invoice_status === "outstanding" ? (
            <Chip
              style={{ background: "#fdfd96" }}
              label={props.row?.invoice_status}
            />
          ) : props.row?.invoice_status === "paid" ? (
            <Chip
              style={{ background: "#77dd77" }}
              label={props.row?.invoice_status}
            />
          ) : (
            <div></div>
          )}
        </TableCell>
        <TableCell>
          <IconButton style={{ color: "primary" }}>
            <Edit onClick={() => props.clickAction()} />
          </IconButton>
          <IconButton style={{ color: "#2196f3" }}>
            <PictureAsPdfIcon onClick={() => props.clickGeneratePDF()} />
          </IconButton>
          <Tooltip title="Send invoice for approval">
            <IconButton
              style={{
                color: "#FF0000",
                display: props.row?.invoice_status != "draft" ? "none" : "",
              }}
            >
              <Icon onClick={() => props.clickSend()}>send</Icon>
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Page() {
  const router = useRouter();
  function openDetail(e, url) {
    e.preventDefault();
    router.push(url);
  }
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [idData, setIdData] = useState(null);
  const [projectCodeData, setProjectCodeData] = useState(null);
  const [data, setData] = useState(null);
  const [dataEdit, setDataEdit] = useState(null);
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rowCount, setRowCount] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [openPDFFile, setOpenPDFFile] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [salesOptions, setSalesOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [stsAcc, setStsAcc] = useState("disabled");
  const [draftCount, setDraftCount] = useState(0);
  const [outstandingCount, setOutstandingCount] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [status, setStatus] = useState("");
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [statusInvoice, setStatusInvoice] = useState("");
  const [customer, setCustomer] = useState("");
  const [sales, setSales] = useState("");
  const [invoiceId, setInvoiceId] = useState(false);

  const [openInvoiceApproval, setOpenInvoiceApproval] = useState(false);

  let invoiceSwr = getListInvoiceSwr({
    search: search,
    page: page + 1,
    limit: limit,
    orderBy: "invoice_number",
    order: "asc",
    invoice_status: statusInvoice,
    customer_id: customer,
    sales: sales,
  });
  useEffect(() => {
    setLoading(invoiceSwr?.isLoading);
    if (invoiceSwr?.data?.result) {
      setTotal(invoiceSwr?.data.total);
      setListData(invoiceSwr?.data?.result);
    }
  }, [invoiceSwr]);

  const confirmDelete = (id) => {
    setIdData(id);
    setOpenDialog(true);
  };

  const deleteInvoice = async () => {
    setOpenDialog(false);
    try {
      setOpen(true);
      let res = await deleteInvoiceApi(idData);
      let data = await getListInvoiceApi();
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };
  const [formState, setFormState] = useState(null);
  function onChangeInput(e) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  useEffect(async () => {
    try {
      setOpen(true);
      let data = await getListInvoiceApi();
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
      setStsAcc("");
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  }, []);

  const handleChangePage = async (event, newPage) => {
    try {
      setOpen(true);

      let data = await getListInvoiceApi(search, newPage, rowsPerPage);
      setRowCount(data.total);
      setListData(data.result);
      setPage(newPage);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    try {
      setOpen(true);
      let data = await getListInvoiceApi(
        search,
        0,
        parseInt(event.target.value, 10)
      );
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  function changeFilter() {
    setPage(0);
    setSearch(formState?.invoice_number);
    setStatusInvoice(formState?.invoice_status);
    setSales(formState?.sales);
    //  TODO: tambahin amount, overdue, sales, customer
  }

  // const invoiceJugaSwr = getListInvoiceSwr("");
  //
  //   useEffect(() => {
  //     if(invoiceJugaSwr?.data){
  //       setStatusOptions(invoiceJugaSwr?.data?.filter(val => val?.status_invoice !== "all") ?? [])
  //     }
  //   },[])

  // useEffect(() => {
  //   setFormState({...formState, ['status_invoice']: "draft" })
  // }, [])

  // const doSearch = async () => {
  //   try {
  //     setOpen(true);
  //     let data = await getListInvoiceApi(search, 0, rowsPerPage);
  //     setRowCount(data.total);
  //     setListData(data.result);
  //     setPage(0);
  //     setOpen(false);
  //   } catch (err) {
  //     console.log(err);
  //     setOpen(false);
  //   }
  // };
  const refreshInvoiceApproval = () => {
    invoiceSwr.mutate();
    setOpenInvoiceApproval(false);
  };
  const refershInvoiceForm = () => {
    setOpenForm(false);
  };
  const refreshListInvoice = async () => {
    setOpenForm(false);
    setOpenPDFFile(false);
    try {
      setOpen(true);
      let data = await getListInvoiceApi(search, page, rowsPerPage);
      setRowCount(data.total);
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
    setPage(0);
  };
  const editForm = async (id) => {
    setInvoiceId(id);
    setPage(0);
    setOpen(true);
    let result = await getDetailInvoiceApi(id);
    setDataEdit(result);
    setOpen(false);
    setOpenForm(true);
    setOpenPDFFile(false);
  };
  const sendAppr = async (id) => {
    var dataTmp = await getDetailInvoiceApi(id);
    setData(dataTmp);
    setOpenInvoiceApproval(true);
    // var result = await invoiceFlowNext(id).then((res) => {
    //   alert(JSON.stringify(res));
    // });
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
    setOpenForm(false);
  };

  const confirmGenerateInvoiceNumber = (id, project_code) => {
    setIdData(id);
    setProjectCodeData(project_code);

    // alert(id)
    // alert(project_code)
    setOpenDialog(true);
  };

  // const generateInvoiceNumber = async (id, project_code) => {
  //   setPage(0);
  //   setOpen(true);
  //   alert(id)
  //   alert(project_code)
  //   setIdData(id);
  //   setProjectCodeData(project_code);
  //
  //   let result = await generateInvoiceNumberApi(id, project_code)
  //
  //         setData({
  //           id: result.id,
  //           project_code: result.project_code
  //         });
  //
  //   setOpen(false);
  //   setOpenForm(true);
  // };

  const exportData = async () => {
    setExportLoading(true);
    try {
      await exportWorkOrder(rowCount);
    } catch (err) {}
    setExportLoading(false);
  };

  return (
    <AccountingBaseLayout title="Invoices">
      <Box className="p-0 content-wrapper">
        <Grid
          container
          className="page-container"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12} lg={12} xl={12}>
            <Typography
              variant="h1"
              align={"center"}
              style={{ marginBottom: 10 }}
            >
              Invoice
            </Typography>
            <Grid container className="page-container mb-3" spacing={3}>
              <Grid item xs={12} md={3}>
                <div className="card" style={{ background: "#a7c7e7" }}>
                  <h2 className="mb-2">{draftCount}</h2>
                  <div>Draft</div>
                </div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div className="card" style={{ background: "#fdfd96" }}>
                  <h2 className="mb-2">{outstandingCount}</h2>
                  <div>Outstanding</div>
                </div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div className="card" style={{ background: "#77dd77" }}>
                  <h2 className="mb-2">{paidCount}</h2>
                  <div>Paid</div>
                </div>
              </Grid>
            </Grid>
            <Box className="card no-padding">
              <div className="p-3 display-space-between">
                <div className="flex-center me-3" style={{ flexGrow: 1 }}>
                  <InputBase
                    style={{ width: "200px", marginRight: 24 }}
                    className="input input-rounded bold uppercase"
                    fullWidth
                    name="invoice_number"
                    value={formState?.invoice_number ?? ""}
                    onChange={onChangeInput}
                    placeholder="Invoice Number"
                  />
                  <Select
                    className="input input-rounded me-3"
                    fullWidth
                    style={{ width: "150px", marginRight: 24 }}
                    name="statusInvoice"
                    value={formState?.invoice_status ?? "Select Status"}
                    onChange={onChangeInput}
                    input={<InputBase placeholder="Select Status Invoice" />}
                  >
                    <MenuItem value={"all"}>All Status</MenuItem>
                    <MenuItem value={"draft"}>draft</MenuItem>
                    <MenuItem value={"outstanding"}>outstanding</MenuItem>
                    <MenuItem value={"paid"}>paid</MenuItem>
                    {/*{statusOptions?.map((item, i) => {*/}
                    {/*  return <MenuItem key={item} value={item}>{item?.status_invoice}</MenuItem>*/}
                    {/*})}*/}
                  </Select>
                  {/*<InputBase*/}
                  {/*    className="input input-rounded bold uppercase"*/}
                  {/*    fullWidth*/}
                  {/*    max="9999"*/}
                  {/*    style={{width: "115px", marginRight: 24}}*/}
                  {/*    type="number"*/}
                  {/*    name="yom"*/}
                  {/*    // value={formState?.yom ?? ""}*/}
                  {/*    // onChange={onChangeInput}*/}
                  {/*    placeholder="Amount"/>*/}

                  {/*<InputBase*/}
                  {/*    className="input input-rounded bold uppercase"*/}
                  {/*    fullWidth*/}
                  {/*    max="9999"*/}
                  {/*    style={{width: "115px", marginRight: 24}}*/}
                  {/*    type="number"*/}
                  {/*    name="invoice_over_due"*/}
                  {/*    value={formState?.invoice_due_date ?? ""}*/}
                  {/*    onChange={onChangeInput}*/}
                  {/*    placeholder="overdue"/>*/}

                  {/*<Select*/}
                  {/*    className="input input-rounded me-3"*/}
                  {/*    fullWidth*/}
                  {/*    name="sales_id"*/}
                  {/*    style={{width: "200px", marginRight: 24}}*/}
                  {/*    value={formState?.sales_id ?? "Select Sales Name"}*/}
                  {/*    onChange={onChangeInput}*/}
                  {/*    input={<InputBase placeholder="Select Sales Name" />}>*/}
                  {/*  <MenuItem value="all" selected>Sales</MenuItem>*/}
                  {/*  {salesOptions?.map((item, i) => {*/}
                  {/*    return <MenuItem key={item} value={item}>{item?.name}</MenuItem>*/}
                  {/*  })}*/}
                  {/*</Select>*/}

                  {/*<TextField*/}
                  {/*    style={{width: "200px", marginRight: 24}}*/}
                  {/*    className="input input-rounded bold"*/}
                  {/*    fullWidth*/}
                  {/*    name="sales"*/}
                  {/*    value={formState?.sales}*/}
                  {/*    onChange={onChangeInput}*/}
                  {/*    placeholder="Sales Name">*/}

                  {/*</TextField>*/}

                  {/*<Select*/}
                  {/*    className="input input-rounded me-3"*/}
                  {/*    fullWidth*/}
                  {/*    name="customer_id"*/}
                  {/*    style={{width: "200px", marginRight: 24}}*/}
                  {/*    value={formState?.customer_id ?? "Select Customer"}*/}
                  {/*    onChange={onChangeInput}*/}
                  {/*    input={<InputBase placeholder="Select Customer" />}>*/}
                  {/*  <MenuItem value="all" selected>Customer</MenuItem>*/}
                  {/*  {customerOptions?.map((item, i) => {*/}
                  {/*    return <MenuItem key={item} value={item}>{item?.name}</MenuItem>*/}
                  {/*  })}*/}
                  {/*</Select>*/}
                  <Button
                    color="primary"
                    fullWidth
                    variant="contained"
                    style={{
                      width: "100px",
                      marginRight: 24,
                      borderRadius: 50,
                    }}
                    onClick={changeFilter}
                    disabled={isLoading}
                    disableElevation
                  >
                    Filter
                  </Button>
                </div>

                <ButtonGroup
                  variant="outlined"
                  color="default"
                  aria-label="split button"
                >
                  <Button onClick={() => router.push("/invoice/form")}>
                    <Icon>add</Icon>Add Invoice
                  </Button>
                </ButtonGroup>
              </div>
              <Divider />
              <TableContainer component="Card">
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>Invoice&nbsp;Number</TableCell>
                      <TableCell width="10%">Invoice&nbsp;Date</TableCell>
                      <TableCell>Invoice&nbsp;Due&nbsp;Date</TableCell>
                      <TableCell>Sales</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount Due</TableCell>
                      <TableCell>Overdue (days)</TableCell>
                      <TableCell>Status Invoice</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!isLoading &&
                      listData?.map((row, key) => (
                        <Row
                          keys={key}
                          row={row}
                          clickAction={() => editForm(row.id)}
                          clickGeneratePDF={() => createInvoicePDF(row.id)}
                          clickSend={() => sendAppr(row.id)}
                          page={page}
                          rowsPerPage={rowsPerPage}
                        />
                      ))}
                    {isLoading && (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center text-muted"
                          align="center"
                        >
                          Loading...
                        </TableCell>
                      </TableRow>
                    )}
                    {!isLoading && listData?.length <= 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center text-muted"
                          align="center"
                        >
                          No Data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[20, 50, 100]}
                        colSpan={9}
                        count={rowCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                          inputProps: { "aria-label": "rows per page" },
                          native: true,
                        }}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>
        <Backdrop className={classes.backdrop} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <AlertDialog
          open={openDialog}
          cancelAction={() => setOpenDialog(false)}
          okAction={() => deleteInvoice()}
          title="Delete confirmation"
          body="Are you sure want to delete this record?"
        />
        {/*<AlertDialog*/}
        {/*    open={openDialog}*/}
        {/*    cancelAction={() => setOpenDialog(false)}*/}
        {/*    okAction={() => generateInvoiceNumber()}*/}
        {/*    title="Generate Invoice Number Confirmation"*/}
        {/*    body="Are you sure want to Generate Invoice Number?"*/}
        {/*/>*/}
        <EditInvoiceForm
          open={openForm}
          closeModal={refershInvoiceForm}
          invData={dataEdit}
          invoiceId={invoiceId}
        />
        <InvoiceLayout
          open={openPDFFile}
          closeModal={refreshListInvoice}
          so={data}
        />
        <InvoiceApproval
          open={openInvoiceApproval}
          closeModal={refreshInvoiceApproval}
          invData={data}
        />
      </Box>
    </AccountingBaseLayout>
  );
}
