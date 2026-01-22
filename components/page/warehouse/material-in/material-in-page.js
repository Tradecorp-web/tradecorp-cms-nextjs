import {
  Button,
  ButtonGroup,
  Card,
  Divider,
  Grid,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getRoute from "../../../../helpers/router";
import { dateFormat, urlPhoto } from "../../../../helpers/general";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { CircularProgressCustom } from "../../../base_component/spinner";
import BaseLayoutWarehouse from "../../../base_layout/base-layout-warehouse";
import { getListAllPOSwr } from "../../../../services/swr/po.swr";
import SearchBar from "../../../base_component/searchbar";
import { exportPurchaseOrder } from "../../../../services/export/export-po";
import { exportMaterialIn } from "../../../../services/export/export-material-in";

export default function Page() {
  const router = useRouter();

  function openDetail(e, url) {
    e.preventDefault();
    router.push(url);
  }

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
  var listMaterialSwr = getListAllPOSwr({
    search: search,
    page: page + 1,
    limit: limit,
    orderBy: "po_number",
    order: "asc",
  });
  useEffect(() => {
    setLoading(listMaterialSwr?.isLoading);
    if (listMaterialSwr?.data?.result) {
      setTotal(listMaterialSwr?.data?.total);
      setDataList(listMaterialSwr?.data?.result);
    }
  }, [listMaterialSwr]);
  // ------------------------------------------
  // [END] GET DATA & PAGINATION
  // ==========================================

  const [exportLoading, setExportLoading] = useState(false);
  const exportData = async () => {
    console.log(3);
    setExportLoading(true);
    try {
      console.log(4);
      await exportMaterialIn({
        search: search,
        page: 1,
        limit: total,
        orderBy: "po_number",
        order: "asc",
      });
    } catch (err) {
      console.log(err);
    }
    setExportLoading(false);
  };

  return (
    <BaseLayoutWarehouse title="Material In">
      <div className="p-5">
        <Grid
          container
          className="page-container"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12} lg={12} xl={8}>
            <h1 className="mb-3">Material In</h1>
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
                  <Button onClick={exportData}>
                    {exportLoading && <CircularProgressCustom size={20} />}
                    {!exportLoading && (
                      <div className="flex-center">
                        <Icon className="me-2">download</Icon> Export
                      </div>
                    )}
                  </Button>
                </ButtonGroup>
              </div>
              <Divider />
              <TableContainer component={Card}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width={12}>No</TableCell>
                      <TableCell>PO Date</TableCell>
                      <TableCell>PO Number</TableCell>
                      <TableCell>Materials</TableCell>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell>Remarks</TableCell>
                      <TableCell>Status</TableCell>
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
                                getRoute("warehouse.material.in.detail", {
                                  id: data?.id,
                                })
                              )
                            }
                          >
                            <TableCell>{index + 1 + page * limit}</TableCell>
                            <TableCell>{dateFormat(data?.po_date)}</TableCell>
                            <TableCell>{data?.po_number}</TableCell>
                            <TableCell>{data?.items?.length} items</TableCell>
                            <TableCell>
                              <div className="flex-center">
                                <img
                                  src={urlPhoto(data?.vendor?.logo)}
                                  className="image"
                                  style={{ width: 20, height: 20 }}
                                />
                              </div>
                            </TableCell>
                            <TableCell>{data?.project}</TableCell>
                            <TableCell>{data?.remarks}</TableCell>
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
                          </TableRow>
                        );
                      })}
                    {isLoading && (
                      <TableRow>
                        <TableCell
                          colSpan={8}
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
                          colSpan={8}
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
                        colSpan={8}
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
    </BaseLayoutWarehouse>
  );
}
