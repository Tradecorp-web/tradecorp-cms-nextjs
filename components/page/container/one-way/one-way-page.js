import { Button, ButtonGroup, Card, Popper, Divider, Grow, Grid, Icon, IconButton, InputBase, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@material-ui/core';
import BaseLayoutStockContainer from '../../../base_layout/base-layout-stock-container';
import { useRouter } from 'next/router';
import getRoute from '../../../../helpers/router';
import AlertDialog from "../../../base_component/dialog";
import { useEffect, useRef, useState } from 'react';
import { getListOneWaySwr } from '../../../../services/swr/one-way.swr';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import { deleteContainerApi } from '../../../../services/api/container-stocks.api';
import OneWayForm from './one-way-form';
import { dateFormat } from '../../../../helpers/general';

export default function OneWayPage() {

  const router = useRouter()

  const [formState, setFormState] = useState(null)
  function onChangeInput(e) {
    setFormState({...formState, [e.target.name]: e.target.value})
  }

  function openDetail(e, url) {
    e.preventDefault();
    router.push(url)
  }

  const [openForm, setOpenForm] = useState(false);

  // ==========================================
  // [START] GET DATA & PAGINATION
  // ------------------------------------------
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(20)
  
  const [search, setSearch] = useState("")
  
  const [isLoading, setLoading] = useState(false)
  const [dataList, setDataList] = useState([])
  var listContainerStockSwr = getListOneWaySwr({
      search: search, 
      page: page+1, 
      limit: limit,
      orderBy: "code",
      order: "asc",
  })
  useEffect(() => {
    setLoading(listContainerStockSwr?.isLoading)
    if(listContainerStockSwr?.data?.result) {
      setTotal(listContainerStockSwr?.data?.total)
      setDataList(listContainerStockSwr?.data?.result)
    }
  }, [listContainerStockSwr])

  function changeFilter() {
    setPage(0)
    setSearch(formState?.title)
  }
  // ------------------------------------------
  // [END] GET DATA & PAGINATION
  // ==========================================

  // *----<Delete Items>----*
  const [isOpenConfirmationDialog, setOpenConfirmationDialog] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(-1)

  function confirmDelete(index) {
      setDeleteIndex(index)
      setOpenConfirmationDialog(true)
  }

  const deleteData = async () => {
      setOpenConfirmationDialog(false)
      var data = dataList[deleteIndex]
      console.log(data)
      dataList.splice(deleteIndex, 1)
      setDataList(dataList)
      await deleteContainerApi(data?.id)
  }
  // *----<Delete Items>----*

  return (
    <BaseLayoutStockContainer title="One Way">
      <AlertDialog 
            title="Delete Item"
            body={`Are you sure you want to delete ${dataList[deleteIndex]?.name}`}
            open={isOpenConfirmationDialog} 
            cancelAction={() => setOpenConfirmationDialog(false)} okAction={deleteData} />
      <div className="p-5 content-wrapper">
        <Grid container className="page-container" alignItems="center" justify="center">
          <Grid item xs={12} lg={12} xl={10}>
            <h1 className="mb-3">One Way</h1>
            <div className="card no-padding">
                <div className="p-3 display-space-between">
                  <div className="flex-center me-3" style={{flexGrow: 1}}>
                    <InputBase 
                      style={{width: "300px", marginRight: 24}}
                      className="input input-rounded bold" 
                      fullWidth 
                      name="title"
                      value={formState?.title ?? ""}
                      onChange={onChangeInput}
                      placeholder="One Way Title"/>
                  </div>
                  <ButtonGroup variant="outlined" color="default">
                      <Button
                          onClick={() => setOpenForm(true)}>
                          <Icon>add</Icon>Add One Way
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
                                <TableCell>Origin</TableCell>
                                <TableCell>Destination</TableCell>
                                <TableCell>Qty</TableCell>
                                <TableCell>From Date</TableCell>
                                <TableCell>To Date</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {!isLoading && dataList.map((data, index) => (
                            <TableRow key={index} hover={true}>
                                <TableCell onClick={(e) => openDetail(e, getRoute('one.way.detail', {id: data?.id}))}>{index + 1 + (page*limit)}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('one.way.detail', {id: data?.id}))}>{data?.name}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('one.way.detail', {id: data?.id}))}>{data?.origin_city}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('one.way.detail', {id: data?.id}))}>{data?.destination_city}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('one.way.detail', {id: data?.id}))}>{data?.qty}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('lease.agreement.detail', {id: data?.id}))}>{dateFormat(data?.from_date)}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('lease.agreement.detail', {id: data?.id}))}>{dateFormat(data?.to_date)}</TableCell>
                                <TableCell>
                                    <Tooltip title="Delete" placement="top">
                                        <IconButton size="small" onClick={() => confirmDelete(index)}><Icon>delete</Icon></IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(isLoading) && <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted" align="center">
                                Loading...
                            </TableCell>
                        </TableRow>}
                        {(!isLoading && dataList?.length <= 0) && <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted" align="center">
                                No Data
                            </TableCell>
                        </TableRow>}
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
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onChangePage={(e, page) => setPage(page)}
                                    onChangeRowsPerPage={(e) => {
                                        setPage(0)
                                        setLimit(parseInt(e.target.value))
                                    }}
                                    ActionsComponent={TablePaginationActions}/>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div>
          </Grid>
        </Grid>
      </div>
      <OneWayForm 
          open={openForm} 
          closeModal={() => setOpenForm(false)} 
          dataInserted={(data) => listContainerStockSwr.mutate()} />

    </BaseLayoutStockContainer>
  )
}