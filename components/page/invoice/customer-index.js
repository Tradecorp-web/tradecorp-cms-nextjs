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
  TextField,
  Backdrop,
  CircularProgress, Chip,
} from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  deleteInvoiceApi,
  getDetailInvoiceApi, getListInvoiceApi,
  getListInvoiceByInvNumberApi
} from "../../../services/api/invoice.api";
import InvoiceSideMenuLayout from "../../base_layout/base-layout-sidemenu-invoice";
import AlertDialog from "../../base_component/dialog";
import Moment from "moment";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import EditInvoiceForm from "./form-modal";
import InvoiceLayout from "./invoice-layout";

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
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rowCount, setRowCount] = useState(0);

  return (
      <React.Fragment>
        <TableRow key={props.keys} hover className={classes.root}>
          <TableCell onClick={() => props.clickAction()}>
            {props.keys + 1 + props.page * props.rowsPerPage}
          </TableCell>
          <TableCell onClick={() => props.clickAction()}>
            {
              props?.row?.customer?.company_type == null || props?.row?.customer?.company == null ? props?.row?.customer?.name + " " : props?.row?.customer?.name + ", " + props?.row?.customer?.company + ", " + props?.row?.customer?.company_type
            }
          </TableCell>
          <TableCell onClick={() => props.clickAction()}>
            {props.row.invoice_number}
          </TableCell>
          <TableCell onClick={() => props.clickAction()}>
            {Moment(props.row.invoice_date).format("LL")}
          </TableCell>
          <TableCell onClick={() => props.clickAction()}>
            {Moment(props.row.invoice_due_date).format("LL")}
          </TableCell>
          <TableCell onClick={() => props.clickAction()}>
            {props?.row?.sales?.name}
          </TableCell>
          <TableCell>
            Rp. 20.000.000
            {/*{props?.row?.}*/}
          </TableCell>
          <TableCell>
            <Chip style={{ background: "#77dd77" }} label="0"/>
          </TableCell>
          <TableCell>
            {
              props.row?.status_invoice === "draft" ?
                  <Chip style={{ background: "#a7c7e7" }} label={props.row?.status_invoice}/> :
                  props.row?.status_invoice === "outstanding" ?
                      <Chip style={{ background: "#fdfd96" }} label={props.row?.status_invoice}/> :
                      props.row?.status_invoice === "paid" ?
                          <Chip style={{ background: "#77dd77" }} label={props.row?.status_invoice}/> :
                          <Chip style={{ background: "#fff" }}/>
            }
          </TableCell>
          <TableCell>
            <IconButton style={{ color: "#2196f3" }}>
              <PictureAsPdfIcon onClick={() => props.clickGeneratePDF()} />
            </IconButton>
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
  const [data, setData] = useState(null);
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rowCount, setRowCount] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [stsAcc, setStsAcc] = useState("disabled");

  const [openPDFFile, setOpenPDFFile] = useState(false);
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

  const confirmDelete = (id) => {
    setIdData(id);
    setOpenDialog(true);
  };

  const deleteInvoice = async () => {
    setOpenDialog(false);
    try {
      setOpen(true);
      let res = await deleteInvoiceApi(idData);
      let data = await getListInvoiceByInvNumberApi();
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  useEffect(async () => {
    try {
      setOpen(true);
      let data = await getListInvoiceByInvNumberApi();
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

      let data = await getListInvoiceByInvNumberApi("INV", newPage, rowsPerPage);
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
      let data = await getListInvoiceByInvNumberApi(
          "INV",
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

  const invoiceSearch = async () => {
    try {
      setOpen(true);
      let data = await getListInvoiceApi(search, 0, rowsPerPage);
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const refreshListInvoice = async () => {
    setOpenForm(false);
    setOpenPDFFile(false);
    try {
      setOpen(true);
      let data = await getListInvoiceByInvNumberApi("INV", page, rowsPerPage);
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
    setPage(0);
    setOpen(true);
    // let result = await getDetailSalesOrderApi(id);
    let result = await getDetailInvoiceApi(id);
    setData({
      id: id,
      order_date: result.order_date,
      project_code: result.project_code,
      project_name: result.project_name,
      project_description: result.project_description,
      estimate_delivery_date: result.estimate_delivery_date,
      client: result.client,
      customer_id: result.customer_id,
      product_id: result.product_id,
      sales_id: result.sales_id,
      sales_name: result.sales.name,
      containers: result.containers,
    });
    setOpen(false);
    setOpenForm(true);
    setOpenPDFFile(false);
  };

  // const createWoForm = async (id) => {
  //   setPage(0);
  //   setOpen(true);
  //   var result = await getDetailSalesOrderApi(id);
  //   setData({
  //     id: id,
  //     order_date: result.order_date,
  //     project_code: result.project_code,
  //     project_name: result.project_name,
  //     project_description: result.project_description,
  //     estimate_delivery_date: result.estimate_delivery_date,
  //
  //     client_id: result.client,
  //     customer_id: result.customer_id,
  //     product_id: result.product_id,
  //     customer_name: result.customer.name,
  //     customer_company: result.customer.company,
  //     customer_company_type: result.customer.company_type,
  //     customer_company_address: result.customer.address,
  //     customer_company_phone: result.customer.phone_number,
  //     customer_company_email: result.customer.email,
  //     sales_id: result.sales_id,
  //     sales_name: result.sales.name,
  //     materials: [],
  //   });
  //   setOpen(false);
  //   setOpenWoForm(true);
  // };

  // const exportData = async () => {
  //   setExportLoading(true);
  //   try {
  //     await exportWorkOrder(rowCount);
  //   } catch (err) {}
  //   setExportLoading(false);
  // };

  return (
      <InvoiceSideMenuLayout title="List Of Active Customer Invoice">
        <Box className="p-0 content-wrapper">
          <Grid container className="page-container" alignItems="center" justify="center">
            <Grid item xs={12} lg={12} xl={12}>
              <Typography variant="h1" align={"center"} style={{marginBottom: 10}}>List Of Active Customer Invoice</Typography>
              <Box className="card no-padding">
                <Box className="p-3 display-space-between">
                  <Box className="search-bar me-3" style={{ width: "25%" }}>
                    <TextField
                        variant="standard"
                        placeholder="Search Invoice Number…"
                        className="search-input"
                        readOnly={open}
                        defaultValue={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                          "aria-label": "search",
                          endAdornment: (
                              <IconButton onClick={invoiceSearch} size="small">
                                <Icon>search</Icon>
                              </IconButton>
                          ),
                        }}
                    />
                  </Box>
                </Box>
                <Divider />
                <TableContainer component="Card">
                  <Table aria-label="Customer Invoice Table">
                    <TableHead>
                      <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>Customer&nbsp;Name</TableCell>
                        <TableCell>Invoice&nbsp;Number</TableCell>
                        <TableCell width="8%" align={"center"}>Invoice&nbsp;Date</TableCell>
                        <TableCell>Invoice&nbsp;Due&nbsp;Date</TableCell>
                        <TableCell width="8%" align={"center"}>Sales&nbsp;Name</TableCell>
                        <TableCell>Amount Due</TableCell>
                        <TableCell>Overdue (days)</TableCell>
                        <TableCell>Status Invoice</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listData?.map((row, key) => (
                          <Row
                              keys={key}
                              row={row}
                              clickAction={() => editForm(row.id)}
                              clickGeneratePDF={() => createInvoicePDF(row.id)}
                              // clickDelete={() => confirmDelete(row.id)}
                              page={page}
                              rowsPerPage={rowsPerPage}
                          />
                      ))}
                      {listData?.length === 0 && (
                          <TableRow>
                            <TableCell
                                colspan={9}
                                className="text-center text-muted"
                                align="center"
                            >
                              No data to show
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
          {/*<AlertDialog*/}
          {/*    open={openDialog}*/}
          {/*    cancelAction={() => setOpenDialog(false)}*/}
          {/*    okAction={() => deleteInvoice()}*/}
          {/*    title="Delete confirmation"*/}
          {/*    body="Are you sure want to delete this record?"*/}
          {/*/>*/}
          <EditInvoiceForm
              open={openForm}
              closeModal={refreshListInvoice}
              so={data} />
          <InvoiceLayout
              open={openPDFFile}
              closeModal={refreshListInvoice}
              so={data}
          />
        </Box>
      </InvoiceSideMenuLayout>
  );
}
