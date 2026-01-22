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

import WOForm from "./wo-form-history";
import BaseLayout from "../../base_layout/base-layout";

import { getListWoStatusSwr } from "../../../services/swr/wo.swr";
import { exportPurchaseOrder } from "../../../services/export/export-po";
import SearchBar from "../../base_component/searchbar";

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
  function searchData(search) {
    setPage(0);
    setSearch(search);
    // setSearch(searchInput);
  }

  const [isLoading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataTotalPos, setDataTotalPos] = useState([]);
  const [dataPos, setDataPos] = useState([]);

  var woSwr = getListWoStatusSwr({
    search: search,
    page: page + 1,
    limit: limit,
    orderBy: "wo_date",
    order: "desc",
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

  // *------------<Form>------------*

  return (
    <BaseLayout title="Work Order">
      <WOForm
        open={openForm}
        isEdit={isEdit}
        data={dataList[editIndex]}
        closeModal={closeForm}
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
            <Grid container spacing={10}>
              <Grid justify="left" alignItems="left" item xs={10} sm={10}>
                <Typography variant="h1">Work Order History</Typography>
              </Grid>
              <Grid justify="right" alignItems="right" item xs={2} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  align="right"
                  fullWidth
                  disableElevation
                  onClick={(e) => openDetail(e, getRoute("wo"))}
                >
                  WO Transaction
                </Button>
                {/* <Typography align="right" variant="h4">
                    Prices
                  </Typography> */}
              </Grid>
            </Grid>
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
                      <TableCell width={150}>WO Number</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell>Client</TableCell>
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
                            <TableCell>{index + 1 + page * limit}</TableCell>
                            <TableCell>{dateFormat(data?.wo_date)}</TableCell>
                            <TableCell>{data?.wo_number}</TableCell>
                            <TableCell>{data?.project}</TableCell>
                            <TableCell>{data?.client_id}</TableCell>
                            <TableCell>
                              <Tooltip
                                title="Status Information"
                                placement="top"
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => openEditForm(index)}
                                >
                                  <Icon>assessment</Icon>
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
    </BaseLayout>
  );
}
