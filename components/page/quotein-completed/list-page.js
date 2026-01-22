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
  Link,
  TableSortLabel,
} from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import getRoute from "../../../helpers/router";
import {
  Edit,
  Delete,
  Assignment,
  Send,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from "@material-ui/icons";
import {
  getListQuoteInApi,
  deleteQuoteInApi,
  getDetailQuoteInApi,
  getListQuoteInStatusApi,
} from "../../../services/api/quote-in.api";
// import QuoteForm from "./form_";

// import ContainerOrdersForm from "./container-orders";
// import BaseLayout from "../../base_layout/base-layout-design";
import BaseLayout from "../../base_layout/base-layout";
import AlertDialog from "../../base_component/dialog";
import { currency } from "../../../helpers/general";
import { CircularProgressCustom } from "../../base_component/spinner";

import MasterForm from "../../../admin-components/pages/master/data/form";

import { masterDataSwr } from "../../../services/swr/master-data.swr";
import {
  getListOrderIdQuoteApi,
  getListOrderIdStatusQuoteApi,
} from "../../../services/api/order-quote.api";

import { getDetailContainerSerialUnitcodeApi } from "../../../services/api/container-number.api";

import { exportXls } from "../../../helpers/build-quote/generateExcel";

import Moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      // borderBottom: "unset",
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
  const [openContainerOrdersForm, setOpenContainerOrdersForm] = useState(false);

  const [idData, setIdData] = useState(false);
  const [orderData, setOrderData] = useState(false);
  const [unitCode, setUnitCode] = useState("-");
  const [dataUnitCode, setDataUnitCode] = useState(null);
  const [containerSize, setContainerSize] = useState(null);
  const [containerType, setContainerType] = useState(null);

  // var dtaUnitCode = getDetailContainerSerialUnitcodeSwr(unitCode);

  var d1 = new Date();
  var dvalid = new Date(props.row.validity);

  const newContainerOrders = (id, row) => {
    setIdData(id);
    setContainerSize(row?.container_size_data?.name);
    setContainerType(row?.container_type_data?.name);

    var dataUnit = getDetailContainerSerialUnitcodeApi(
      row?.container_size_data?.name + row?.container_type_data?.alias
    ).then((res) => {
      // setOrderData({ ...row, unit_code_data: res.result });
      setOrderData({ ...row, unit_code_data: res.result, rowData: props });
      setOpenContainerOrdersForm(true);
    });
  };

  // const serialNumberOption = (unitc) => {};
  const refreshDataOrders = async () => {
    setOpenContainerOrdersForm(false);
    try {
      setOpen(true);
      var data = await getListQuoteInApi(search, page, rowsPerPage);

      setRowCount(data.total);
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  return (
    <React.Fragment>
      <TableRow
        style={{ cursor: "pointer" }}
        key={props.keys}
        className={classes.root}
      >
        <TableCell
          onClick={(e) => props.clickFormBuild(e, props?.row?.id)}
          style={{ textAlign: "center" }}
        >
          {props.keys + 1 + props.page * props.rowsPerPage}{" "}
        </TableCell>
        <TableCell
          onClick={(e) => props.clickFormBuild(e, props?.row?.id)}
          style={{ textAlign: "center" }}
        >
          {Moment(props?.row?.quote_in_date).format("LL")}
        </TableCell>
        <TableCell
          onClick={(e) => props.clickFormBuild(e, props?.row?.id)}
          style={{ textAlign: "center", color: dvalid <= d1 ? "red" : "green" }}
        >
          {Moment(props?.row?.validity).format("LL")}
        </TableCell>
        <TableCell
          onClick={(e) => props.clickFormBuild(e, props?.row?.id)}
          style={{ textAlign: "center" }}
        >
          {props?.row?.factory}
        </TableCell>
        <TableCell
          onClick={(e) => props.clickFormBuild(e, props?.row?.id)}
          style={{ textAlign: "center" }}
        >
          {props?.row?.production_time} {props?.row?.production_time_period}
        </TableCell>
        <TableCell
          onClick={(e) => props.clickFormBuild(e, props?.row?.id)}
          style={{ textAlign: "center" }}
        >
          {props?.row?.country?.name}
        </TableCell>
        <TableCell
          onClick={(e) => props.clickFormBuild(e, props?.row?.id)}
          style={{ textAlign: "center" }}
        >
          {props?.row?.city_id == null ? "" : props?.row?.city_name}
        </TableCell>
        <TableCell
          onClick={(e) => props.clickFormBuild(e, props?.row?.id)}
          style={{ textAlign: "center" }}
        >
          {props?.row?.user_create?.name}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          <Tooltip title={props?.row?.remarks} placement="bottom">
            <IconButton>
              <Assignment />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          <React.Fragment>
            <ButtonGroup>
              <Tooltip title="Order">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => props.clickFormBuild(e, props?.row?.id)}
                >
                  Order Detail
                </Button>
              </Tooltip>
              <Tooltip title="Export data to excel file">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={(e) => props.clickExport(e, props?.row?.id)}
                >
                  Export
                </Button>
              </Tooltip>
            </ButtonGroup>
          </React.Fragment>
        </TableCell>
      </TableRow>

      {/* <ContainerOrdersForm
        open={openContainerOrdersForm}
        id={idData}
        containerSize={containerSize}
        containerType={containerType}
        orderData={orderData}
        // unitCode={dataUnitCode}
        closeModal={refreshDataOrders}
      /> */}
    </React.Fragment>
  );
}

export default function Page() {
  const router = useRouter();

  function openPage(e, url) {
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
  // const [openForm, setOpenForm] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const [sizeOptions, setSizeOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  const [newOption, setNewOption] = useState(null);
  const [openMaster, setOpenMaster] = useState(false);
  const [master, setMaster] = useState(null);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("quote_in_date");

  const addMaster = (category, form) => {
    setMaster({ id: null, name: null, alias: null, category: category });
    setOpenForm(false);
    setOpenMaster(true);
  };

  const confirmDelete = (id) => {
    setIdData(id);
    setOpenDialog(true);
  };

  const deleteQuote = async () => {
    setOpenDialog(false);
    try {
      setOpen(true);
      var res = await deleteQuoteInApi(idData);
      var data = await getListQuoteInApi();
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  var masterSwr = masterDataSwr("");
  useEffect(() => {
    if (masterSwr?.data) {
      setSizeOptions(
        masterSwr?.data?.filter((val) => val?.category == "container_size") ??
          []
      );
      setTypeOptions(
        masterSwr?.data?.filter((val) => val?.category == "container_type") ??
          []
      );
    }
  }, [masterSwr?.data]);

  useEffect(async () => {
    try {
      setOpen(true);
      var data = await getListQuoteInStatusApi("completed");

      // var data = await getListQuoteInApi();
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
      var data = await getListQuoteInStatusApi(
        "completed",
        search,
        newPage,
        rowsPerPage
      );
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
      var data = await getListQuoteInApi(
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
      var data = await getListQuoteInStatusApi(
        "completed",
        search,
        0,
        rowsPerPage
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

  // const refreshListQuote = async () => {
  //   setOpenForm(false);
  //   try {
  //     setOpen(true);
  //     var data = await getListQuoteInStatusApi(
  //       "completed",
  //       search,
  //       page,
  //       rowsPerPage
  //     );
  //     setRowCount(data.total);
  //     setListData(data.result);
  //     setOpen(false);
  //   } catch (err) {
  //     console.log(err);
  //     setOpen(false);
  //   }
  // };
  const buildForm = (e, id) => {
    openPage(e, getRoute("order-completed", { id: id }));
  };

  const exportForm = async (e, id) => {
    var dataOrder = await getListOrderIdStatusQuoteApi(id, "*");
    exportXls(dataOrder);
  };
  // const editForm = async (id) => {
  //   setOpen(true);
  //   var result = await getDetailQuoteInApi(id).then((result) => {
  //     if (result.id != null) {
  //       setData({
  //         id: result.id,
  //         quote_in_date: result.quote_in_date,
  //         quantity: result.quantity,
  //         quantity_uom: result.quantity_uom,
  //         container_type: result.container_type,
  //         container_size: result.container_size,
  //         container_size_uom: result.container_size_uom,
  //         price: result.price,
  //         currency: result.currency,
  //         validity: result.validity,
  //         factory: result.factory,
  //         production_time: result.production_time,
  //         production_time_period: result.production_time_period,
  //         remarks: result.remarks,
  //         country_id: result.country_id,
  //         country_name: result.country_name,
  //         city_id: result.city_id,
  //         city_name: result.city_name,
  //         edit_mode: true,
  //         container_details: result.container_details,
  //         quote_in_file: result.quote_in_file,
  //         user_create: result.user_create.name,
  //         quote_in_images: result.quote_in_images,
  //       });
  //       setOpenForm(true);
  //     }
  //   });

  //   setOpen(false);
  // };

  const refreshMaster = (update) => {
    masterSwr.mutate();
    setNewOption(update);
    setOpenForm(true);
    setOpenMaster(false);
  };

  const changeSort = async (field) => {
    const isAsc = orderBy === field && order === "asc";
    var ord;
    if (isAsc) {
      ord = "desc";
    } else {
      ord = "asc";
    }
    setOrderBy(field);
    setOrder(ord);
    try {
      setOpen(true);
      var data = await getListQuoteInStatusApi(
        "completed",
        search,
        page,
        rowsPerPage,
        field,
        ord
      );
      setRowCount(data.total);
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  return (
    <BaseLayout title="Quotation">
      <Box className="p-5 content-wrapper">
        <Grid
          container
          className="page-container"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12} lg={12} xl={12}>
            <h1 className="mb-3">Completed Production</h1>
            <Box className="card no-padding">
              <Box className="p-3 display-space-between">
                <Box className="search-bar me-3" style={{ width: "25%" }}>
                  <TextField
                    variant="standard"
                    placeholder="Search"
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
                      disableUnderline: true,
                    }}
                  />
                </Box>
                <ButtonGroup
                  variant="outlined"
                  color="default"
                  aria-label="split button"
                >
                  <Button onClick={(e) => openPage(e, getRoute("home"))}>
                    <Icon>arrow_back_ios</Icon>Back
                  </Button>
                  <Button
                    onClick={() => {
                      setData(null);
                      setData({
                        id: null,
                        quantity: null,
                        quantity_uom: "unit",
                        container_type: null,
                        container_size: null,
                        container_size_uom: "feet",
                        price: null,
                        currency: "USD",
                        validity: null,
                        factory: null,
                        production_time: null,
                        production_time_period: "days",
                        quote_in_date: Moment().format(),
                        country_id: null,
                        city_id: null,
                        country_name: null,
                        city_name: null,
                        edit_mode: false,
                      });
                      setOpenForm(true);
                    }}
                  >
                    <Icon>add</Icon>Add Quote
                  </Button>
                </ButtonGroup>
              </Box>
              <Divider />
              <TableContainer component={Card}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{ textAlign: "center" }}
                        rowSpan={2}
                        width={12}
                      >
                        No
                      </TableCell>
                      <TableCell
                        style={{ textAlign: "center" }}
                        key="quote_in_date"
                        sortDirection={
                          orderBy === "quote_in_date" ? order : false
                        }
                      >
                        <TableSortLabel
                          active={orderBy === "quote_in_date"}
                          direction={
                            orderBy === "quote_in_date" ? order : "asc"
                          }
                          onClick={() => changeSort("quote_in_date")}
                        >
                          Quote Date
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        style={{ textAlign: "center" }}
                        key="validity"
                        sortDirection={orderBy === "validity" ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === "validity"}
                          direction={orderBy === "validity" ? order : "asc"}
                          onClick={() => changeSort("validity")}
                        >
                          Validity
                        </TableSortLabel>
                      </TableCell>

                      <TableCell
                        style={{ textAlign: "center" }}
                        key="factory"
                        sortDirection={orderBy === "factory" ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === "factory"}
                          direction={orderBy === "factory" ? order : "asc"}
                          onClick={() => changeSort("factory")}
                        >
                          Factory
                        </TableSortLabel>
                      </TableCell>

                      <TableCell
                        style={{ textAlign: "center" }}
                        key="production_time"
                        sortDirection={
                          orderBy === "production_time" ? order : false
                        }
                      >
                        <TableSortLabel
                          active={orderBy === "production_time"}
                          direction={
                            orderBy === "production_time" ? order : "asc"
                          }
                          onClick={() => changeSort("production_time")}
                        >
                          Production Time
                        </TableSortLabel>
                      </TableCell>

                      <TableCell
                        style={{ textAlign: "center" }}
                        key="country_name"
                        sortDirection={
                          orderBy === "country_name" ? order : false
                        }
                      >
                        <TableSortLabel
                          active={orderBy === "country_name"}
                          direction={orderBy === "country_name" ? order : "asc"}
                          onClick={() => changeSort("country_name")}
                        >
                          Country
                        </TableSortLabel>
                      </TableCell>

                      <TableCell
                        style={{ textAlign: "center" }}
                        key="city_name"
                        sortDirection={orderBy === "city_name" ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === "city_name"}
                          direction={orderBy === "city_name" ? order : "asc"}
                          onClick={() => changeSort("city_name")}
                        >
                          City
                        </TableSortLabel>
                      </TableCell>

                      <TableCell style={{ textAlign: "center" }}>
                        Created By
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        Remarks
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listData?.map((row, key) => (
                      <Row
                        keys={key}
                        row={row}
                        // clickAction={() => editForm(row.id)}
                        clickDelete={() => confirmDelete(row.id)}
                        clickFormBuild={(e) => buildForm(e, row.id)}
                        clickExport={(e) => exportForm(e, row.id)}
                        page={page}
                        rowsPerPage={rowsPerPage}
                      />
                    ))}
                    {listData?.length == 0 && (
                      <TableRow>
                        <TableCell
                          colspan={13}
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
                        colSpan={13}
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
          okAction={() => deleteQuote()}
          title="Delete confirmation"
          body="Do you want to delete this record ?"
        />
        {/* <QuoteForm
          open={openForm}
          closeModal={refreshListQuote}
          quote={data}
          newOption={newOption}
          addMaster={(category) => addMaster(category)}
        /> */}

        <MasterForm
          open={openMaster}
          closeModal={(updated) => refreshMaster(updated)}
          master={master}
          category={master?.category}
        />
      </Box>
    </BaseLayout>
  );
}
