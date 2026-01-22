import {
  Box,
  Button,
  makeStyles,
  ButtonGroup,
  Card,
  Divider,
  Grid,
  Icon,
  IconButton,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  Link,
} from "@material-ui/core";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getRoute from "../../../../helpers/router";
import { currency, dateFormat, dateExpired } from "../../../../helpers/general";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { CircularProgressCustom } from "../../../base_component/spinner";
import POForm from "../../po/po-form";
// import BaseLayoutPo from "../../../base_layout/base-layout-po";
import AccountingBaseLayout from "../../../base_layout/base-layout-sidemenu-accounting";
import { getListPurchaseOrderSwr } from "../../../../services/swr/po.swr";
import { getListAccBankSwr } from "../../../../services/swr/acc-bank.swr";
import { exportPurchaseOrder } from "../../../../services/export/export-po";
import SearchBar from "../../../base_component/searchbar";

import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import GrainIcon from "@material-ui/icons/Grain";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";

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
  link: {
    display: "flex",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));

export default function Page() {
  const classes = useStyles();
  const router = useRouter();
  function openDetail(e, url) {
    e.preventDefault();
    router.push(url);
  }

  const [openForm, setOpenForm] = useState(false);

  // ==========================================
  // [START] GET DATA & PAGINATION
  // ------------------------------------------
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  var typingSearchTimer;
  var doneTypingSearchInterval = 500;
  function serachData() {
    setPage(0);
    setSearch(searchInput);
  }

  const [isLoading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  //   var poSwr = getListPurchaseOrderSwr({
  //     search: search,
  //     page: page + 1,
  //     limit: limit,
  //     orderBy: "po_number",
  //     order: "asc",
  //   });
  //   useEffect(() => {
  //     setLoading(poSwr?.isLoading);
  //     if (poSwr?.data?.result) {
  //       setTotal(poSwr?.data?.total);
  //       setDataList(poSwr?.data?.result);
  //     }
  //   }, [poSwr]);
  var accBankSwr = getListAccBankSwr({
    search: search,
    page: page + 1,
    limit: limit,
    orderBy: "bank_name",
    order: "asc",
  });
  useEffect(() => {
    setLoading(accBankSwr?.isLoading);
    if (accBankSwr?.data?.result) {
      setTotal(accBankSwr?.data?.total);
      setDataList(accBankSwr?.data?.result);
    }
  }, [accBankSwr]);
  // ------------------------------------------
  // [END] GET DATA & PAGINATION
  // ==========================================

  const [exportLoading, setExportLoading] = useState(false);
  const exportData = async () => {
    setExportLoading(true);
    try {
      await exportPurchaseOrder({
        search: search,
        page: 1,
        limit: total,
        orderBy: "po_number",
        order: "asc",
      });
    } catch (err) {}
    setExportLoading(false);
  };

  // *------------<Form>------------*
  const [isEdit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);

  function openEditForm(index) {
    setEditIndex(index);
    setEdit(true);
    setOpenForm(true);
  }

  function closeForm() {
    setOpenForm(false);
    setEdit(false);
    setEditIndex(-1);
  }

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  // *------------<Form>------------*

  return (
    <AccountingBaseLayout title="Bank Master">
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          color="inherit"
          button
          onClick={(e) => openPage(e, getRoute("accounting"))}
          className={classes.menuItem}
        >
          <HomeIcon className={classes.icon} />
          Dashboard
        </Link>
        <Link
          color="inherit"
          button
          onClick={(e) => openPage(e, getRoute("accounting.setting"))}
          className={classes.link}
        >
          <WhatshotIcon className={classes.icon} />
          Setup
        </Link>
        <Typography color="textPrimary" className={classes.link}>
          <GrainIcon className={classes.icon} />
          Bank Setup
        </Typography>
      </Breadcrumbs>

      <POForm
        open={openForm}
        isEdit={isEdit}
        data={dataList[editIndex]}
        closeModal={closeForm}
        dataUpdated={(data) => poSwr.mutate()}
        dataInserted={(data) => poSwr.mutate()}
      />
      <Box className="p-5  content-wrapper">
        <Grid
          container
          className="page-container"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12} lg={12} xl={12}>
            <h1 className="mb-3">Bank Master</h1>
            <div className="card no-padding">
              <div className="p-3 display-space-between">
                <SearchBar
                  style={{ width: "25%", marginRight: 24 }}
                  onSearch={(search) => searchData(search)}
                  isLoading={isLoading}
                />
                <ButtonGroup
                  variant="outlined"
                  color="default"
                  aria-label="split button"
                >
                  <Button onClick={() => setOpenForm(true)}>
                    <Icon>add</Icon>Add Bank
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
              </div>
              <Divider />
              <TableContainer component={Card}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width={12}>No</TableCell>
                      <TableCell>Bank Code</TableCell>
                      <TableCell width={150}>Name</TableCell>
                      <TableCell>Acc. Code</TableCell>
                      <TableCell> Acc. Name</TableCell>
                      <TableCell>Bank Account</TableCell>
                      <TableCell>Branch Office</TableCell>

                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!isLoading &&
                      dataList.map((data, index) => {
                        var onGoingItem = data?.items?.findIndex(
                          (val) => val.qty_delivered < val.qty
                        );
                        var isCompleted = onGoingItem < 0;

                        return (
                          <TableRow key={index} hover={true}>
                            <TableCell
                              onClick={(e) =>
                                openDetail(
                                  e,
                                  getRoute("po.detail", { id: data?.id })
                                )
                              }
                            >
                              {index + 1 + page * limit}
                            </TableCell>
                            <TableCell
                              onClick={(e) =>
                                openDetail(
                                  e,
                                  getRoute("po.detail", { id: data?.id })
                                )
                              }
                            >
                              {data?.bank_code}
                            </TableCell>
                            <TableCell
                              onClick={(e) =>
                                openDetail(
                                  e,
                                  getRoute("po.detail", { id: data?.id })
                                )
                              }
                            >
                              {data?.bank_name}
                            </TableCell>
                            <TableCell
                              onClick={(e) =>
                                openDetail(
                                  e,
                                  getRoute("po.detail", { id: data?.id })
                                )
                              }
                            >
                              {data?.acc_coa.coa_code}
                            </TableCell>
                            <TableCell
                              onClick={(e) =>
                                openDetail(
                                  e,
                                  getRoute("po.detail", { id: data?.id })
                                )
                              }
                            >
                              {data?.acc_coa.coa_name}
                            </TableCell>
                            <TableCell
                              onClick={(e) =>
                                openDetail(
                                  e,
                                  getRoute("po.detail", { id: data?.id })
                                )
                              }
                            >
                              {data?.account_code}
                            </TableCell>
                            <TableCell
                              onClick={(e) =>
                                openDetail(
                                  e,
                                  getRoute("po.detail", { id: data?.id })
                                )
                              }
                            >
                              {data?.branch_office}
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Edit" placement="top">
                                <IconButton
                                  size="small"
                                  onClick={() => openEditForm(index)}
                                >
                                  <Icon>edit</Icon>
                                </IconButton>
                              </Tooltip>
                            </TableCell>
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
                    {!isLoading && dataList?.length <= 0 && (
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
                  <TableFooter>
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
                  </TableFooter>
                </Table>
              </TableContainer>
            </div>
          </Grid>
        </Grid>
      </Box>
    </AccountingBaseLayout>
  );
}
