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
import getRoute from "../../../../helpers/router";
import { currency, dateFormat, dateExpired } from "../../../../helpers/general";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { CircularProgressCustom } from "../../../base_component/spinner";
import POForm from "../po-form";
import BaseLayoutPo from "../../../base_layout/base-layout-po";
import { exportPurchaseOrder } from "../../../../services/export/export-po";
import {
  getListWorkOrderSwr,
  getListWoAllSwr,
} from "../../../../services/swr/wo.swr";
import SearchBar from "../../../base_component/searchbar";

export default function Page() {
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
  var woSwr = getListWoAllSwr({
    search: search,
    page: page + 1,
    limit: limit,
  });
  useEffect(() => {
    setLoading(woSwr?.isLoading);
    if (woSwr?.data?.result) {
      setTotal(woSwr?.data?.total);
      setDataList(woSwr?.data?.result);
    }
  }, [woSwr]);
  // ------------------------------------------
  // [END] GET DATA & PAGINATION
  // ==========================================

  const [exportLoading, setExportLoading] = useState(false);
  const exportData = async () => {
    setExportLoading(true);
    try {
      await exportPurchaseOrder({
        search: search,
        page: page + 1,
        limit: limit,
        orderBy: "po_number",
        order: "asc",
      });
    } catch (err) {}
    setExportLoading(false);
  };

  return (
    <BaseLayoutPo title="Purchase Order">
      <div className="p-5">
        <Grid
          container
          className="page-container"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12} lg={12} xl={8}>
            <h1 className="mb-4">Work Order Request</h1>
            <div className="card no-padding">
              <div className="p-3 display-space-between">
                <SearchBar
                  style={{ width: "25%", marginRight: 24 }}
                  onSearch={(search) => searchData(search)}
                  isLoading={isLoading}
                />
              </div>
              <Divider />
              <TableContainer component={Card}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width={12}>No</TableCell>
                      <TableCell>WO Date</TableCell>
                      <TableCell>WO Number</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell>Materials</TableCell>
                      <TableCell>Total Price</TableCell>
                      <TableCell>Purchase Order</TableCell>
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
                          <TableRow
                            key={index}
                            hover={true}
                            onClick={(e) =>
                              openDetail(
                                e,
                                getRoute("po.request.wo.detail", {
                                  id: data?.id,
                                })
                              )
                            }
                          >
                            <TableCell>{index + 1 + page * limit}</TableCell>
                            <TableCell>{dateFormat(data?.wo_date)}</TableCell>
                            <TableCell>{data?.wo_number}</TableCell>
                            <TableCell>{data?.project}</TableCell>
                            <TableCell>{data?.materials?.length}</TableCell>
                            <TableCell>{currency(data?.total_price)}</TableCell>
                            <TableCell>
                              {data?.po_created && (
                                <div className="flex-center">
                                  <Icon
                                    fontSize="small"
                                    className="me-2"
                                    color="secondary"
                                  >
                                    check_circle
                                  </Icon>
                                  <Typography variant="body2">
                                    Created
                                  </Typography>
                                </div>
                              )}
                              {!data?.po_created && (
                                <div className="flex-center">
                                  <Icon
                                    fontSize="small"
                                    className="me-2"
                                    style={{ color: "#666" }}
                                  >
                                    remove_circle
                                  </Icon>
                                  <Typography variant="body2">
                                    Not Created
                                  </Typography>
                                </div>
                              )}
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
      <POForm
        open={openForm}
        closeModal={() => setOpenForm(false)}
        dataInserted={(data) => woSwr.mutate()}
      />
    </BaseLayoutPo>
  );
}
