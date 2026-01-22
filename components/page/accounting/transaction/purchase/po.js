import {
  Button,
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
  makeStyles,
  Link,
  Checkbox,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState, componentDidUpdate } from "react";
import getRoute from "../../../../../helpers/router";
import {
  currency,
  dateFormat,
  dateExpired,
} from "../../../../../helpers/general";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { CircularProgressCustom } from "../../../../base_component/spinner";
import POForm from "./po-form";
import PoJournalForm from "./journal-form";
import BaseLayoutPo from "../../../../base_layout/base-layout-po";
import AccountingBaseLayout from "../../../../base_layout/base-layout-sidemenu-accounting";
// import BaseLayoutPo from "../../../../base_layout/base-layout-po";
import { getAccMapCodeSwr } from "../../../../../services/swr/acc-map.swr";
import { getListAccPoSwr } from "../../../../../services/swr/acc-po-data.swr";
import SearchBar from "../../../../base_component/searchbar";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";

import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import GrainIcon from "@material-ui/icons/Grain";
import {
  sendFlagAcc,
  sendPurchaseOrderAcc,
} from "../../../../../services/export/send-po-acc";
import { Alert } from "@material-ui/lab";

import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  backdrop: { zIndex: theme.zIndex.drawer + 1, color: "#fff" },
  link: { display: "flex" },
  icon: { marginRight: theme.spacing(0.5), width: 20, height: 20 },
}));

export default function Page() {
  const [formState, setFormState] = useState(null);

  const classes = useStyles();
  const router = useRouter();
  function openDetail(e, url) {
    e.preventDefault();
    router.push(url);
  }

  const [openForm, setOpenForm] = useState(false);
  const [openJournalForm, setOpenJournalForm] = useState(false);

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
  const [dataMap, setDataMap] = useState([]);
  var poSwr = getListAccPoSwr({
    search: search,
    page: page + 1,
    limit: limit,
    orderBy: "po_date",
    order: "desc",
  });
  useEffect(() => {
    setLoading(poSwr?.isLoading);
    if (poSwr?.data?.result) {
      setTotal(poSwr?.data?.total);
      setDataList(poSwr?.data?.result);
    }
  }, [poSwr]);
  var accMapSwr = getAccMapCodeSwr("PO");
  useEffect(() => {
    setDataMap(accMapSwr?.data?.result);
  }, [accMapSwr]);

  //get data accmap

  //==get data accmap

  // ------------------------------------------
  // [END] GET DATA & PAGINATION
  // ==========================================

  const [exportLoading, setExportLoading] = useState(false);

  const sendData = async () => {
    // setExportLoading(true);
    try {
      await sendPurchaseOrderAcc({
        search: search,
        page: 1,
        limit: total,
        orderBy: "po_number",
        order: "asc",
      });
    } catch (err) {}
    // setExportLoading(false);
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
  function openEditJournalForm(index) {
    // setEditIndex(index);
    // setEdit(true);
    setOpenJournalForm(true);
  }

  function closeJournalForm() {
    setOpenJournalForm(false);
    setEdit(false);
    setEditIndex(-1);
  }

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  function onChangeInput(e) {
    try {
      sendFlagAcc({
        id: e.target.id,
        flag: e.target.checked,
      });
    } catch (err) {}
  }
  // *------------<Form>------------*

  return (
    <AccountingBaseLayout title="Purchase Order">
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
          onClick={(e) =>
            openPage(e, getRoute("accounting.transaction.purchase"))
          }
          className={classes.menuItem}
        >
          <WhatshotIcon className={classes.icon} />
          Purchase
        </Link>
        <Typography color="textPrimary" className={classes.link}>
          <GrainIcon className={classes.icon} />
          Purchase Order
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

      <PoJournalForm
        open={openJournalForm}
        isEdit={isEdit}
        data={dataList[editIndex]}
        closeModal={closeJournalForm}
        dataUpdated={(data) => poSwr.mutate()}
        dataInserted={(data) => poSwr.mutate()}
      />
      <div className="p-6 content-wrapper">
        <Grid
          container
          className="page-container"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12} lg={12} xl={12}>
            <h1 className="mb-3">Purchase Orders</h1>
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
                  {/* <Button onClick={() => setOpenForm(true)}>
                    <Icon>add</Icon>Add Purchase Order
                  </Button> */}
                  <Tooltip title="Send to Accounting" placement="top">
                    <Button
                      size="small"
                      aria-label="select merge strategy"
                      onClick={sendData}
                      aria-haspopup="menu"
                    >
                      {exportLoading && <CircularProgressCustom size={20} />}
                      {!exportLoading && <Icon>send</Icon>}
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
                      <TableCell>PO Date</TableCell>
                      <TableCell width={150}>PO Number</TableCell>
                      {/* <TableCell>Materials</TableCell>
                      <TableCell>Total Price</TableCell>
                      <TableCell>VAT</TableCell> */}
                      <TableCell>Vendor</TableCell>
                      <TableCell>Remark</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>View</TableCell>
                      <TableCell>Journal</TableCell>
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
                            <TableCell>{index + 1 + page * limit}</TableCell>
                            <TableCell>{dateFormat(data?.po_date)}</TableCell>
                            <TableCell
                              onClick={(e) =>
                                openDetail(
                                  e,
                                  getRoute(
                                    "accounting.transaction.purchase.po.detail",
                                    { id: data?.id }
                                  )
                                )
                              }
                            >
                              {data?.po_number}
                            </TableCell>
                            {/* <TableCell>{data?.items?.length}</TableCell>
                            <TableCell>{currency(data?.total_price)}</TableCell>
                            <TableCell>{currency(data?.vat)}</TableCell> */}
                            <TableCell>
                              <div className="flex-center">
                                {data?.vendor?.logo != null && (
                                  <img
                                    src={data?.vendor?.logo}
                                    style={{
                                      width: 20,
                                      height: 20,
                                      marginRight: "8px",
                                      objectFit: "contain",
                                    }}
                                  />
                                )}
                                {data?.vendor?.vendor_name}
                              </div>
                            </TableCell>
                            <TableCell
                              onClick={(e) =>
                                openDetail(
                                  e,
                                  getRoute(
                                    "accounting.transaction.purchase.po.detail",
                                    { id: data?.id }
                                  )
                                )
                              }
                            >
                              {data?.remarks}
                            </TableCell>

                            <TableCell>
                              {isCompleted && (
                                <div className="flex-center">
                                  <Icon
                                    style={{ fontSize: 14, marginRight: 4 }}
                                    color="secondary"
                                  >
                                    check_circle
                                  </Icon>
                                  <small className="text-muted">
                                    Completed
                                  </small>
                                </div>
                              )}
                              {!isCompleted && (
                                <div className="flex-center">
                                  <Icon
                                    style={{
                                      fontSize: 14,
                                      marginRight: 4,
                                      color: "#666",
                                    }}
                                  >
                                    remove_circle
                                  </Icon>
                                  <small className="text-muted">On Going</small>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Tooltip title="View" placement="top">
                                <IconButton
                                  size="small"
                                  onClick={() => openEditForm(index)}
                                >
                                  <Icon>pageview</Icon>

                                  {/* <Icon>keyboard_backspace</Icon> */}
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              style={{
                                textAlign: "center",
                              }}
                            >
                              {/* {data?.status_acc === 1 && (
                                <Tooltip title="Check" placement="top">
                                  <Checkbox
                                    defaultChecked={data?.flag_status_acc}
                                    onChange={onChangeInput}
                                    name="chkFlag"
                                    id={data?.id}
                                    color="primary"
                                  />
                                </Tooltip>
                              )}
                              {data?.status_acc === 0 && (
                                <Tooltip title="Journal Po" placement="top">
                                  <IconButton
                                    size="small"
                                    onClick={() => openEditJournalForm(index)}
                                  >
                                    <Icon>dataset_linked</Icon>
                                  </IconButton>
                                </Tooltip>
                              )} */}
                              <Tooltip title="Journal Po" placement="top">
                                <IconButton
                                  size="small"
                                  onClick={() => openEditJournalForm(index)}
                                >
                                  <Icon>dataset_linked</Icon>
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
      </div>
    </AccountingBaseLayout>
  );
}
