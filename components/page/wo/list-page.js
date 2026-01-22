import {
  Button,
  ButtonGroup,
  Card,
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
  CircularProgress,
  Collapse,
  Tooltip,
} from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import getRoute from "../../../helpers/router";
import { Delete, KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
import {
  getListWOApi,
  deleteWOApi,
  getDetailWOApi,
} from "../../../services/api/wo.api";
import { getWoUserPosSwr } from "../../../services/swr/wo.swr";
import WOForm from "./form";
import WOCheckForm from "./form-check-wo";
import BaseLayout from "../../base_layout/base-layout";
import AlertDialog from "../../base_component/dialog";
import { CircularProgressCustom } from "../../base_component/spinner";
import { exportWorkOrder } from "../../../services/export/export-wo";
import Moment from "moment";

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

  return (
    <React.Fragment>
      <TableRow key={props.keys} hover className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.keys + 1 + props.page * props.rowsPerPage}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.wo_number}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {Moment(props.row.wo_date).format("LL")}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.customer_name}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.customer_company + " " + props.row.customer_company_type}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.project}
        </TableCell>
        <TableCell>
          <IconButton>
            <Delete onClick={() => props.clickDelete()} />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h3" gutterBottom component="div">
                Materials
              </Typography>
              <Table size="small" aria-label="materials">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Material Desc</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.row.materials?.map((item, key) => (
                    <TableRow key={key}>
                      <TableCell>{item.detail.code}</TableCell>
                      <TableCell>{item.detail.material_name}</TableCell>
                      <TableCell>
                        {item.qty} {item.unit}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
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
  const [openCheck, setOpenCheck] = useState(false);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [idData, setIdData] = useState(null);
  const [data, setData] = useState(null);
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rowCount, setRowCount] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [openCheckForm, setOpenCheckForm] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [stsAcc, setStsAcc] = useState("disabled");

  const confirmDelete = (id) => {
    setIdData(id);
    setOpenDialog(true);
  };

  const deleteWO = async () => {
    setOpenDialog(false);
    try {
      setOpen(true);
      var res = await deleteWOApi(idData);
      var data = await getListWOApi();
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  var userWoSwr = getWoUserPosSwr();
  useEffect(() => {
    if (userWoSwr?.data) {
      if (userWoSwr?.data?.status === 0) {
        setStsAcc("");
      } else {
        setStsAcc("disabled");
      }
    }
  }, [userWoSwr]);

  useEffect(async () => {
    try {
      setOpen(true);
      var data = await getListWOApi();
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  }, []);

  const handleChangePage = async (event, newPage) => {
    try {
      setOpen(true);
      var data = await getListWOApi(search, newPage, rowsPerPage);
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
      var data = await getListWOApi(
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

  const doSearch = async () => {
    try {
      setOpen(true);
      var data = await getListWOApi(search, 0, rowsPerPage);
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const refreshListWO = async () => {
    setPage(0);
    setOpenForm(false);
    try {
      setOpen(true);
      var data = await getListWOApi(search, page, rowsPerPage);
      setRowCount(data.total);
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };
  const refreshListCheckWO = async () => {
    setPage(0);
    setOpenCheckForm(false);
    try {
      setOpenCheck(true);
      var data = await getListWOApi(search, page, rowsPerPage);
      setRowCount(data.total);
      setListData(data.result);
      setOpenCheck(false);
    } catch (err) {
      console.log(err);
      setOpenCheck(false);
    }
  };

  const editForm = async (id) => {
    setOpen(true);
    var result = await getDetailWOApi(id);
    setData({
      id: id,
      wo_number: result.wo_number,
      wo_date: result.wo_date,
      client_id: result.client_id,
      customer_id: result.customer_id,
      customer_code: result.customer_code,
      customer_name: result.customer_name,
      customer_company: result.customer_company,
      customer_company_type: result.customer_company_type,
      sales_order_id: result.sales_order_id,
      sales_id: result.sales_id,
      sales: result.sales.name,
      project: result.project,
      project_code: result.project_code,
      remark: result.remark,
      materials: result.materials,
    });
    // setPage(0);
    setOpen(false);
    setOpenForm(true);
  };
  const checkForm = async (id) => {
    setOpenCheck(true);
    var result = await getDetailWOApi(id);
    setPage(0);
    setData({
      id: id,
      wo_number: result.wo_number,
      wo_date: result.wo_date,
      client_id: result.client_id,
      customer_id: result.customer_id,
      customer_name: result.customer_name,
      customer_company: result.customer_company,
      customer_company_type: result.customer_company_type,
      customer:
        result.customer_name +
        ", " +
        result.customer_company +
        " " +
        result.customer_company_type,
      sales_id: result.sales_id,
      project: result.project,
      project_code: result.project_code,
      remark: result.remark,
      materials: result.materials,
    });
    setOpenCheck(false);
    setOpenCheckForm(true);
  };

  const exportData = async () => {
    setExportLoading(true);
    try {
      await exportWorkOrder(rowCount);
    } catch (err) {}
    setExportLoading(false);
  };

  return (
    <BaseLayout title="Work Order">
      <Box className="p-5 content-wrapper">
        <Grid
          container
          className="page-container"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12} lg={12} xl={8}>
            <Box>
              <Grid container spacing={10}>
                <Grid justify="left" alignItems="left" item xs={10} sm={10}>
                  <Typography variant="h1">Work Order</Typography>
                </Grid>
                <Grid justify="right" alignItems="right" item xs={2} sm={2}>
                  {/* <Button
                    variant="contained"
                    color="primary"
                    align="right"
                    fullWidth
                    disableElevation
                    onClick={(e) => openDetail(e, getRoute("wo-history"))}
                  >
                    Wo History
                  </Button> */}
                  {/* <Typography align="right" variant="h4">
                    Prices
                  </Typography> */}
                </Grid>
              </Grid>
            </Box>
            <Box className="card no-padding">
              <Box className="p-3 display-space-between">
                <Box className="search-bar me-3" style={{ width: "25%" }}>
                  <TextField
                    variant="standard"
                    placeholder="Search WO Number…"
                    className="search-input"
                    readOnly={open}
                    defaultValue={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                      "aria-label": "search",
                      endAdornment: (
                        <IconButton onClick={doSearch} size="small">
                          <Icon>search</Icon>
                        </IconButton>
                      ),
                    }}
                  />
                </Box>
                <ButtonGroup
                  // disabled={stsAcc}
                  variant="outlined"
                  color="default"
                  aria-label="split button"
                >
                  <Button
                    onClick={() => {
                      setData(null);
                      setOpenForm(true);
                    }}
                  >
                    <Icon>add</Icon>Create Work Order
                  </Button>
                  <Tooltip title="Download Data" placement="top">
                    <Button
                      size="small"
                      aria-label="select merge strategy"
                      onClick={exportData}
                      aria-haspopup="menu"
                    >
                      {exportLoading && <CircularProgressCustom size={20} />}
                      {!exportLoading && <Icon>download</Icon>}
                    </Button>
                  </Tooltip>
                </ButtonGroup>
              </Box>
              <Divider />
              <TableContainer component={Card}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width={12} />
                      <TableCell width={12}>No</TableCell>
                      <TableCell>WO Number</TableCell>
                      <TableCell>WO Date</TableCell>
                      <TableCell>Client Name</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell />
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listData?.map((row, key) => (
                      <Row
                        keys={key}
                        row={row}
                        clickAction={() => editForm(row.id)}
                        clickCheck={() => checkForm(row.id)}
                        clickDelete={() => confirmDelete(row.id)}
                        page={page}
                        rowsPerPage={rowsPerPage}
                      />
                    ))}
                    {listData?.length == 0 && (
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
        <AlertDialog
          open={openDialog}
          cancelAction={() => setOpenDialog(false)}
          okAction={() => deleteWO()}
          title="Delete confirmation"
          body="Are you sure want to delete this record?"
        />
        <WOForm open={openForm} closeModal={refreshListWO} wo={data} />
        <WOCheckForm
          open={openCheckForm}
          closeModal={refreshListCheckWO}
          wo={data}
        />
      </Box>
    </BaseLayout>
  );
}
