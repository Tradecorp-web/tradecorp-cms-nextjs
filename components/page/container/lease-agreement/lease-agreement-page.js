import {
  Button,
  ButtonGroup,
  Popper,
  Divider,
  Grow,
  Grid,
  Icon,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
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
import BaseLayoutStockContainer from "../../../base_layout/base-layout-stock-container";
import { useRouter } from "next/router";
import getRoute from "../../../../helpers/router";
import AlertDialog from "../../../base_component/dialog";
import { useEffect, useRef, useState } from "react";
import { getListLeaseAgreementSwr } from "../../../../services/swr/lease-agreement.swr";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import LeaseAgreementForm from "./lease-agreement-form";
import { dateFormat } from "../../../../helpers/general";
import {
  deleteLeaseAgreementApi,
  getListLeaseAgreementApi,
} from "../../../../services/api/lease-agreement.api";
import { accountSwr } from "../../../../services/swr/account.swr";

import LeaseAgreementLetter from "./lease-agreement-letter";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

import ReactToPrint from "react-to-print";

export default function LeaseAgreementPage() {
  const router = useRouter();
  const account = accountSwr();

  const [formState, setFormState] = useState(null);
  function onChangeInput(e) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  function openDetail(e, url) {
    e.preventDefault();
    router.push(url);
  }

  const [openForm, setOpenForm] = useState(false);

  const [openFormPdf, setOpenFormPdf] = useState(false);

  const [draftCount, setDraftCount] = useState(0);
  const [leasedCount, setLeasedCount] = useState(0);
  const [finishedCount, setFinishedCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);

  function loadTotalData() {
    getListLeaseAgreementApi({
      status: "draft",
      createdBy: account?.data?.is_admin ? "" : account?.data?.id,
    }).then((res) => {
      setDraftCount(res?.total);
    });
    getListLeaseAgreementApi({
      status: "leased",
      createdBy: account?.data?.is_admin ? "" : account?.data?.id,
    }).then((res) => {
      setLeasedCount(res?.total);
    });
    getListLeaseAgreementApi({
      status: "finished",
      createdBy: account?.data?.is_admin ? "" : account?.data?.id,
    }).then((res) => {
      setFinishedCount(res?.total);
    });
  }

  // ==========================================
  // [START] GET DATA & PAGINATION
  // ------------------------------------------
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);

  const [search, setSearch] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [idLeaseAggrement, setIdLeaseAgreement] = useState(0);

  const createLeaseAgreementPDF = async (id) => {
    setIdLeaseAgreement(id);

    setOpenFormPdf(true);
  };

  var listContainerStockSwr = getListLeaseAgreementSwr({
    search: search,
    page: page + 1,
    limit: limit,
    orderBy: "code",
    order: "asc",
    createdBy: account?.data?.is_admin ? "" : account?.data?.id,
  });
  useEffect(() => {
    setLoading(listContainerStockSwr?.isLoading);
    if (listContainerStockSwr?.data?.result) {
      setTotal(listContainerStockSwr?.data?.total);
      setDataList(listContainerStockSwr?.data?.result);
      loadTotalData();
    }
  }, [listContainerStockSwr]);

  function changeFilter() {
    setPage(0);
    setSearch(formState?.title);
  }
  // ------------------------------------------
  // [END] GET DATA & PAGINATION
  // ==========================================

  // *----<Delete Items>----*
  const [isOpenConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);

  function confirmDelete(index) {
    setDeleteIndex(index);
    setOpenConfirmationDialog(true);
  }

  const deleteData = async () => {
    setOpenConfirmationDialog(false);
    var data = dataList[deleteIndex];
    console.log(data);
    dataList.splice(deleteIndex, 1);
    setDataList(dataList);
    await deleteLeaseAgreementApi(data?.id);
  };
  // *----<Delete Items>----*

  function statusColor(status) {
    if (status == "leased") return "text-green";
    else if (status == "finished") return "text-orange";
    return "";
  }

  return (
    <BaseLayoutStockContainer title="Lease Agreement">
      <AlertDialog
        title="Delete Item"
        body={`Are you sure you want to delete ${dataList[deleteIndex]?.name}`}
        open={isOpenConfirmationDialog}
        cancelAction={() => setOpenConfirmationDialog(false)}
        okAction={deleteData}
      />
      <div className="p-5 content-wrapper">
        <Grid
          container
          className="page-container"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12} lg={12} xl={10}>
            <h1 className="mb-3">Lease Agreement</h1>
            <Grid container className="page-container mb-3" spacing={3}>
              <Grid item xs={12} md={3}>
                <div className="card">
                  <h2 className="mb-2">{draftCount}</h2>
                  <div>Draft</div>
                </div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div className="card">
                  <h2 className="mb-2">{leasedCount}</h2>
                  <div>Leased</div>
                </div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div className="card">
                  <h2 className="mb-2">{finishedCount}</h2>
                  <div>Finished</div>
                </div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div className="card">
                  <h2 className="mb-2">{expiredCount}</h2>
                  <div>Expired</div>
                </div>
              </Grid>
            </Grid>
            <div className="card no-padding">
              <div className="p-3 display-space-between">
                <div className="flex-center me-3" style={{ flexGrow: 1 }}>
                  <InputBase
                    style={{ width: "300px", marginRight: 24 }}
                    className="input input-rounded bold"
                    fullWidth
                    name="title"
                    value={formState?.title ?? ""}
                    onChange={onChangeInput}
                    placeholder="Lease Agreement Title"
                  />
                </div>
                <ButtonGroup variant="outlined" color="default">
                  <Button onClick={() => setOpenForm(true)}>
                    <Icon>add</Icon>Add Lease Agreement
                  </Button>
                </ButtonGroup>
              </div>
              <Divider />
              <TableContainer>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width={12}>No</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Depo</TableCell>
                      <TableCell>From Date</TableCell>
                      <TableCell>To Date</TableCell>
                      <TableCell>Termination Notice</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created by</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!isLoading &&
                      dataList.map((data, index) => (
                        <TableRow key={index} hover={true}>
                          <TableCell
                            onClick={(e) =>
                              openDetail(
                                e,
                                getRoute("lease.agreement.detail", {
                                  id: data?.id,
                                })
                              )
                            }
                          >
                            {index + 1 + page * limit}
                          </TableCell>
                          <TableCell
                            onClick={(e) =>
                              openDetail(
                                e,
                                getRoute("lease.agreement.detail", {
                                  id: data?.id,
                                })
                              )
                            }
                          >
                            {data?.title}{" "}
                          </TableCell>
                          <TableCell
                            onClick={(e) =>
                              openDetail(
                                e,
                                getRoute("lease.agreement.detail", {
                                  id: data?.id,
                                })
                              )
                            }
                          >
                            {data?.customer?.company}
                          </TableCell>
                          <TableCell
                            onClick={(e) =>
                              openDetail(
                                e,
                                getRoute("lease.agreement.detail", {
                                  id: data?.id,
                                })
                              )
                            }
                          >
                            {data?.depo?.name}
                          </TableCell>
                          <TableCell
                            onClick={(e) =>
                              openDetail(
                                e,
                                getRoute("lease.agreement.detail", {
                                  id: data?.id,
                                })
                              )
                            }
                          >
                            {dateFormat(data?.from_date)}
                          </TableCell>
                          <TableCell
                            onClick={(e) =>
                              openDetail(
                                e,
                                getRoute("lease.agreement.detail", {
                                  id: data?.id,
                                })
                              )
                            }
                          >
                            {dateFormat(data?.to_date)}
                          </TableCell>
                          <TableCell
                            onClick={(e) =>
                              openDetail(
                                e,
                                getRoute("lease.agreement.detail", {
                                  id: data?.id,
                                })
                              )
                            }
                          >
                            {dateFormat(data?.termination_notice)}
                          </TableCell>
                          <TableCell
                            onClick={(e) =>
                              openDetail(
                                e,
                                getRoute("lease.agreement.detail", {
                                  id: data?.id,
                                })
                              )
                            }
                          >
                            <div
                              className={`text-badge ${statusColor(
                                data?.status
                              )}`}
                            >
                              {data?.status}
                            </div>
                          </TableCell>
                          <TableCell
                            onClick={(e) =>
                              openDetail(
                                e,
                                getRoute("lease.agreement.detail", {
                                  id: data?.id,
                                })
                              )
                            }
                          >
                            {data?.creator?.name}
                          </TableCell>
                          <TableCell>
                            <IconButton style={{ color: "#2196f3" }}>
                              <PictureAsPdfIcon
                                onClick={() =>
                                  createLeaseAgreementPDF(
                                    data?.lease_agreement_header_id
                                  )
                                }
                              />
                            </IconButton>

                            <Tooltip title="Delete" placement="top">
                              <IconButton
                                size="small"
                                onClick={() => confirmDelete(index)}
                              >
                                <Icon>delete</Icon>
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
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
                    {!isLoading && dataList?.length <= 0 && (
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
                        rowsPerPageOptions={[10, 20, 50, 100]}
                        colSpan={9}
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
      <LeaseAgreementForm
        open={openForm}
        closeModal={() => setOpenForm(false)}
        dataInserted={(data) => listContainerStockSwr.mutate()}
      />

      <LeaseAgreementLetter
        open={openFormPdf}
        idLeaseAggrement={idLeaseAggrement}
        closeModal={() => setOpenFormPdf(false)}
      />
    </BaseLayoutStockContainer>
  );
}
