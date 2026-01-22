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
} from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getRoute from "../../../helpers/router";
import { currency, dateFormat, dateExpired } from "../../../helpers/general";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { CircularProgressCustom } from "../../base_component/spinner";
import POForm from "./po-form";
import POCheckForm from "./po-check-form";
import BaseLayoutPo from "../../base_layout/base-layout-po";
import {
  getListPurchaseOrderSwr,
  getPoPosSwr,
  getPoUserPosSwr,
} from "../../../services/swr/po.swr";
import { exportPurchaseOrder } from "../../../services/export/export-po";
import SearchBar from "../../base_component/searchbar";

export default function Page() {
  const router = useRouter();
  function openDetail(e, url) {
    e.preventDefault();
    router.push(url);
  }

  const [openForm, setOpenForm] = useState(false);
  const [checkForm, setCheckForm] = useState(false);

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
  function searchData(search) {
    setPage(0);
    setSearch(search);
    // setSearch(searchInput);
  }

  const [isLoading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataTotalPos, setDataTotalPos] = useState([]);
  const [dataPos, setDataPos] = useState([]);

  const [stsAcc, setStsAcc] = useState("disabled");

  var poSwr = getListPurchaseOrderSwr({
    search: search,
    page: page + 1,
    limit: limit,
    orderBy: "po_number",
    order: "desc",
  });
  useEffect(() => {
    setLoading(poSwr?.isLoading);
    if (poSwr?.data?.result) {
      setTotal(poSwr?.data?.total);
      setDataList(poSwr?.data?.result);
      if (poSwr?.data?.result[0]?.status_acc === 0) {
        setStsAcc("");
      } else {
        setStsAcc("");
      }
    }
  }, [poSwr]);

  var userPoSwr = getPoUserPosSwr();
  useEffect(() => {
    // alert(JSON.stringify(userPoSwr));
    if (userPoSwr?.data) {
      if (userPoSwr?.data?.status === 0) {
        setStsAcc("");
      } else {
        setStsAcc("disabled");
      }
    }
  }, [userPoSwr]);

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

  function openCheckForm(index) {
    setEditIndex(index);
    setEdit(true);
    setCheckForm(true);
  }

  function closeCheckForm() {
    setCheckForm(false);
    setEdit(false);
    setEditIndex(-1);
  }
  // *------------<Form>------------*

  return (
    <BaseLayoutPo title="Purchase Order">
      <POForm
        open={openForm}
        isEdit={isEdit}
        data={dataList[editIndex]}
        closeModal={closeForm}
        dataUpdated={(data) => poSwr.mutate()}
        dataInserted={(data) => poSwr.mutate()}
      />

      <POCheckForm
        open={checkForm}
        isEdit={isEdit}
        data={dataList[editIndex]}
        closeModal={closeCheckForm}
        dataUpdated={(data) => poSwr.mutate()}
        dataInserted={(data) => poSwr.mutate()}
      />
      <div className="p-5">
        <Grid
          container
          className="page-container"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12} lg={12} xl={8}>
            <h1 className="mb-3">Purchase Orders</h1>
            <div className="card no-padding">
              <div className="p-3 display-space-between">
                <SearchBar
                  style={{ width: "25%", marginRight: 24 }}
                  onSearch={(search) => searchData(search)}
                  isLoading={isLoading}
                />
                <ButtonGroup
                  disabled={stsAcc}
                  variant="outlined"
                  color="default"
                  aria-label="split button"
                >
                  <Button onClick={() => setOpenForm(true)}>
                    <Icon>add</Icon>Add Purchase Order
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
                      <TableCell>PO Date</TableCell>
                      <TableCell width={150}>PO Number</TableCell>
                      <TableCell>Materials</TableCell>
                      <TableCell>Total Price</TableCell>
                      <TableCell>VAT</TableCell>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell>Remarks</TableCell>
                      <TableCell>Status</TableCell>
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
                              {dateFormat(data?.po_date)}
                            </TableCell>
                            <TableCell
                              onClick={(e) =>
                                openDetail(
                                  e,
                                  getRoute("po.detail", { id: data?.id })
                                )
                              }
                            >
                              {data?.po_number}
                            </TableCell>
                            <TableCell
                              onClick={(e) =>
                                openDetail(
                                  e,
                                  getRoute("po.detail", { id: data?.id })
                                )
                              }
                            >
                              {data?.items?.length}
                            </TableCell>
                            <TableCell
                              onClick={(e) =>
                                openDetail(
                                  e,
                                  getRoute("po.detail", { id: data?.id })
                                )
                              }
                            >
                              {currency(data?.total_price)}
                            </TableCell>
                            <TableCell
                              onClick={(e) =>
                                openDetail(
                                  e,
                                  getRoute("po.detail", { id: data?.id })
                                )
                              }
                            >
                              {currency(data?.vat)}
                            </TableCell>
                            <TableCell
                              onClick={(e) =>
                                openDetail(
                                  e,
                                  getRoute("po.detail", { id: data?.id })
                                )
                              }
                            >
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
                                  getRoute("po.detail", { id: data?.id })
                                )
                              }
                            >
                              {data?.project}
                            </TableCell>
                            <TableCell
                              onClick={(e) =>
                                openDetail(
                                  e,
                                  getRoute("po.detail", { id: data?.id })
                                )
                              }
                            >
                              {data?.remarks}
                            </TableCell>
                            <TableCell
                              onClick={(e) =>
                                openDetail(
                                  e,
                                  getRoute("po.detail", { id: data?.id })
                                )
                              }
                            >
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
                              <Tooltip title="Edit" placement="top">
                                <IconButton
                                  size="small"
                                  onClick={() => openEditForm(index)}
                                >
                                  <Icon>edit</Icon>
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Check" placement="top">
                                <IconButton
                                  size="small"
                                  onClick={() => openCheckForm(index)}
                                >
                                  <Icon>check</Icon>
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
    </BaseLayoutPo>
  );
}
