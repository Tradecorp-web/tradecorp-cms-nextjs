import {
  Button,
  ButtonGroup,
  Divider,
  Grid,
  TableFooter,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Icon, Card, Box, Link, Typography,
} from "@material-ui/core";
import { useRouter } from "next/router";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import React, { useEffect, useRef, useState } from "react";
import BaseLayoutCustomer from "../../base_layout/base-layout-customer";
import SearchBar from "../../base_component/searchbar";
import { IconButton } from "@material-ui/core";
import AlertDialog from "../../base_component/dialog";
import {getDetailCustomerSwr, getListCustomerSwr, getLogoSwr} from "../../../services/swr/customer.swr";
import {
  getDetailCustomerApi,
  deleteCustomerApi,
  getLogoApi,
} from "../../../services/api/customer.api";
import getRoute from "../../../helpers/router";
import {cancelIdleCallback} from "next/dist/client/request-idle-callback";
import {getDetailCustomerReferenceApi, getListCustomerReferenceApi} from "../../../services/api/customer-reference.api";
import CustomerDetailForm from "./customer-detail";

export default function Page() {
  /*Start Constanta*/

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [isEditForm, setIsEditForm] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [isOpenConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [fileLogoList, setFileLogoList] = useState(null);
  const [rowCount, setRowCount] = useState(0);



  /*End Constanta*/

  /*Start Function*/

  const customerView = async (id) => {
    setOpen(true);
    let result = await getDetailCustomerApi(id);
    setData({
      id: result.id,
      phone_number : result.phone_number,
      company_type : result.company_type,
      customer_code : result.customer_code,
      email : result.email,
      fax_number : result.fax_number,
      address : result.address,
      company : result.company,
      name : result.name,
      customer_logo_file : result.customer_logo_file,
      customer_npwp_file : result.customer_npwp_file,
    });
    setOpen(false);
    setOpenForm(true);
  };

  function openDetail(e, url) {
    e.preventDefault();
    router.push(url).then(r => {return r});
  }

  function searchData(search) {
    setPage(0);
    setSearch(search);
  }

  const refreshListCustomer = async () => {
    try {
      let data = await getListCustomerSwr();
      setRowCount(data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const downloadLogo = async (id, file_id) => {
    alert(id)
    alert(file_id)
    try {
      let response = await getLogoApi(id, file_id);
      if (response.status === 200) {
        let reader = response.body.getReader();
        let contenttype = response.headers.get("Content-Type");
        let chunks = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          chunks.push(value);
        }
        let content = new Blob(chunks, { type: contenttype });
        let url = window.URL.createObjectURL(content);
        let tmpLink = document.createElement("a");
        tmpLink.href = url;
        tmpLink.setAttribute("target", "_blank");
        tmpLink.click();
      }
    } catch (err) {
      console.log(err);
    }
  };

  /*End Function*/


  let listCustomerSwr = getListCustomerSwr({
    search: search,
    page: page + 1,
    limit: limit,
    orderBy: "name",
    order: "asc",
  });

  // let listLogoSwr = getLogoSwr({
  //   id: router.query.id,
  //   file_id:
  // });

  useEffect(() => {
    setLoading(listCustomerSwr?.isLoading);
    if (listCustomerSwr?.data?.result) {
      setTotal(listCustomerSwr?.data?.total);
      setDataList(listCustomerSwr?.data?.result);
    }
    // setOpen(false);
    // setOpenForm(false);
  }, [listCustomerSwr]);

  // useEffect(async () => {
  //   try {
  //     let data = await getListCustomerApi();
  //     setRowCount(data.total);
  //     setPage(0);
  //   } catch (err) {
  //     console.log(err);
  //     setOpen(false);
  //   }
  // }, []);



// const customerId = router.query.id;

  // useEffect(async () => {
  //   try {
  //     let dataLogoCustomer = await getDetailCustomerApi(customerId);
  //     setFileLogoList(dataLogoCustomer.customer_logo_file);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, []);



  // *----<Delete Items>----*
  function confirmDelete(index) {
    setDeleteIndex(index);
    setOpenConfirmationDialog(true);
  }

  const deleteData = async () => {
    setOpenConfirmationDialog(false);
    let data = dataList[deleteIndex];
    // console.log(data);
    dataList.splice(deleteIndex, 1);
    setDataList(dataList);
    await deleteCustomerApi(data?.id);
  };
  // *----<Delete Items>----*

  const openEditForm = async (id) => {
    await router.push(getRoute("customer.customer-edit", {id: id}));
  }
  const editForm = async (id) => {
    setPage(0);
    setOpen(true);
    let result = await getDetailCustomerApi(id);
    setData({
      id: id,
      name: result.name,
      company: result.company,
      phone_number: result.phone_number,
      company_type: result.company_type,
      customer_code: result.customer_code,
      address: result.address,
      email: result.email,
      npwp_number: result.npwp_number,
      fax_number: result.fax_number,
    });
    setOpen(false);
    setIsEditForm(true);
    setOpenForm(true);
  };

  function addForm() {
    setOpen(false);
    setIsEditForm(false);
    setData({
      id: null,
      name: null,
      company: null,
      phone_number: null,
      company_type: null,
      customer_code: null,
      address: null,
      email: null,
      npwp_number: null,
      fax_number: null,
    });
    setOpenForm(true);
  }
  return (
    <BaseLayoutCustomer>
      <div className="p-5 content-wrapper">
        <AlertDialog
          title="Delete Item"
          body={`Are you sure you want to delete ${dataList[deleteIndex]?.name}`}
          open={isOpenConfirmationDialog}
          cancelAction={() => setOpenConfirmationDialog(false)}
          okAction={deleteData}
        />
        <Grid
          container
          className="page-container"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12} lg={12} xl={8}>
            <h1 className="mb-3">Customers</h1>
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
                  <Button onClick={() => router.push("customer-company-search-form")}>
                    <Icon>add</Icon>Add Customer
                  </Button>
                </ButtonGroup>
              </div>
              <Divider />
              <TableContainer component="Card">
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width={12}>No</TableCell>
                      <TableCell>Customer Code</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Company Type</TableCell>
                      {/*<TableCell>Logo</TableCell>*/}
                      {/*<TableCell>NPWP</TableCell>*/}
                      <TableCell>Phone Number</TableCell>
                      <TableCell>Fax Number</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!isLoading &&
                      dataList.map((data, index) => (
                        <TableRow key={data} hover={true}>
                          <TableCell onClick={() => customerView(data?.id)}>
                            {index + 1 + page * limit}
                          </TableCell>
                          <TableCell  onClick={() => customerView(data?.id)}>
                            {data?.customer_code}
                          </TableCell>
                          <TableCell onClick={() => customerView(data?.id)}>
                            {data?.name}
                          </TableCell>
                          <TableCell onClick={() => customerView(data?.id)}>
                            {data?.company}
                          </TableCell>
                          <TableCell onClick={() => customerView(data?.id)}>
                            {data?.company_type}
                          </TableCell>
                            {/*<TableCell>*/}
                            {/*  */}
                            {/*  {*/}
                            {/*    data?.customer_logo_file?.attachment != null && (*/}
                            {/*          <img*/}
                            {/*              src={data?.customer_logo_file?.attachment}*/}
                            {/*              style={{*/}
                            {/*                width: 20,*/}
                            {/*                height: 20,*/}
                            {/*                marginRight: "8px",*/}
                            {/*                objectFit: "contain",*/}
                            {/*              }}*/}
                            {/*          />*/}
                            {/*      )}*/}
                            {/*  {data?.customer_logo_file?.attachment}*/}
                            {/*    </TableCell>*/}

                          {/*  {fileLogoList != null &&*/}
                          {/*      fileLogoList?.map((row, key) => (*/}
                          {/*            <TableCell>*/}
                          {/*              {row.thumbnail != null && (*/}
                          {/*                  <Box>*/}
                          {/*                    <Link onClick={() => downloadLogo(customerId, row.file_id)}>*/}
                          {/*                      <Typography*/}
                          {/*                          variant="h5"*/}
                          {/*                          component="h5"*/}
                          {/*                          style={{ wordWrap: "anywhere" }}*/}
                          {/*                      >*/}
                          {/*                        {row.attachment}*/}
                          {/*                      </Typography>*/}
                          {/*                    </Link>*/}
                          {/*                  </Box>*/}
                          {/*              )}*/}
                          {/*            </TableCell>*/}
                          {/*      ))}*/}

                          {/*<TableCell onClick={() => openEditForm(data?.id)}>*/}
                          {/*  ini buat npwp*/}
                          {/*</TableCell>*/}
                          <TableCell onClick={() => customerView(data?.id)}>
                            {data?.phone_number}
                          </TableCell>
                          <TableCell onClick={() => customerView(data?.id)}>
                            {data?.fax_number}
                          </TableCell>
                          <TableCell onClick={() => customerView(data?.id)}>
                            {data?.email}
                          </TableCell>
                          <TableCell onClick={() => customerView(data?.id)}>
                            {data?.address}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Edit" placement="top">
                              <IconButton
                                size="small"
                                onClick={() => openEditForm(data?.id)}

                              >
                                <Icon>edit</Icon>
                              </IconButton>
                            </Tooltip>
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
      {/*<CustomerForm*/}
      {/*  open={openForm}*/}
      {/*  closeModal={() => setOpenForm(false)}*/}
      {/*  data={data}*/}
      {/*  isEdit={isEditForm}*/}
      {/*  dataInserted={(data) => listCustomerSwr.mutate()}*/}
      {/*  dataUpdated={(data) => listCustomerSwr.mutate()}*/}
      {/*/>*/}

      {/*<CustomerEditPage*/}
      {/*    customer={data}*/}
      {/*    isEdit={isEditForm}*/}
      {/*/>*/}

      <CustomerDetailForm
        open={openForm}
        closeModal={() => setOpenForm(false)}
        customerDetail={data}
      />
    </BaseLayoutCustomer>
  );
}
