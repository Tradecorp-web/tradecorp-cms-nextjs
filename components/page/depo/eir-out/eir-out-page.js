import { Button, ButtonGroup, Card, Container, Divider, Grid, Icon, InputBase, InputLabel, Link, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import BaseLayoutDepo from '../../../base_layout/base-layout-depo';
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import getRoute from '../../../../helpers/router';
import SearchBar from '../../../base_component/searchbar';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import { getListEirSwr } from '../../../../services/swr/eir.swr';
import { dateFormat } from '../../../../helpers/general';
import { accountSwr } from '../../../../services/swr/account.swr';
import EirOutForm from './eir-out-form';

export default function DataTable() {

    const account = accountSwr()

    function openDetail(e, routerSlug) {
      e.preventDefault()
      router.push(routerSlug)
    }
  
    const router = useRouter()
    const depoId = router.query.depoSlug
  
    const [isFormEdit, setFormEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [openForm, setOpenForm] = useState(false);
      
    function openEditData(index) {
        setEditData(dataList[index])
        setFormEdit(true)
        setOpenForm(true)
    }

  // ==========================================
  // [START] GET DATA & PAGINATION
  // ------------------------------------------
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState("")
  function searchData(search) {
      setPage(0)
      setSearch(search)
  }
  
  const [isLoading, setLoading] = useState(false)
  const [dataList, setDataList] = useState([])
  var listDataSwr = getListEirSwr({
      search: search, 
      page: page+1, 
      limit: limit,
      orderBy: "code",
      order: "asc",
      depoId: depoId,
      movement: "out"
  })
  useEffect(() => {
    setLoading(listDataSwr?.isLoading)
    if(listDataSwr?.data?.result) {
      setTotal(listDataSwr?.data?.total)
      setDataList(listDataSwr?.data?.result)
    }
  }, [listDataSwr])

  function changeFilter() {
    setPage(0)
  }
  // ------------------------------------------
  // [END] GET DATA & PAGINATION
  // ==========================================

   // *----<Menu Options>----*
   const [openMenu, setOpenMenu] = useState(false);
   const anchorRef = useRef(null);

   const handleMenuItemClick = (e, index) => {
       e.preventDefault()
       var menu = options[index]
       if(menu?.value == 1) {
           router.push(getRoute("product.category"))
       }
       setOpenMenu(false);
   };
   
   const handleToggle = () => {
       setOpenMenu(!openMenu);
   };

   const handleClose = (event) => {
       if (anchorRef.current && anchorRef.current.contains(event.target)) {
           return;
       }
       setOpenMenu(false);
   };

   const options = [
       {name: "Manage Product Category", value: 1},
   ]
   // *----<Menu Options>----*

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
    <BaseLayoutDepo title="Delivery Order">
      <div className="p-5 content-wrapper">
        <Grid container className="page-container" alignItems="center" justify="center">
          <Grid item xs={12} lg={12} xl={10}>
            <h1 className="mb-3">EIR OUT</h1>
            <div className="card no-padding">
                <div className="p-3 display-space-between">
                  <SearchBar 
                    style={{width: "25%", marginRight: 24}} 
                    onSearch={(search) => searchData(search)} 
                    isLoading={isLoading} 
                    placeholder="Search EIR Number..."/>
                  <div className="flex-center me-3" style={{flexGrow: 1}}>
                  </div>
                  <ButtonGroup variant="outlined" color="default" aria-label="split button">
                      <Button onClick={() => setOpenForm(true)}>
                          <Icon>add</Icon>Create Eir Out
                      </Button>
                  </ButtonGroup>
                </div>
                <Divider />
                <TableContainer>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>EIR Number</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Container Number</TableCell>
                                <TableCell>Delivery Number</TableCell>
                                <TableCell>Shipper</TableCell>
                                <TableCell>Destination</TableCell>
                                {/* <TableCell>Created By</TableCell> */}
                                <TableCell>Remark</TableCell>
                                {/* <TableCell></TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                          {!isLoading && dataList.map((data, index) => (
                              <TableRow key={index} hover={true}>
                                  <TableCell onClick={(e) => openDetail(e, getRoute('depo.eir.in.detail', {depoSlug: depoId, id: data?.id}))}>{data?.eir_no}</TableCell>
                                  <TableCell onClick={(e) => openDetail(e, getRoute('depo.eir.in.detail', {depoSlug: depoId, id: data?.id}))}>{dateFormat(data?.date_time)}</TableCell>
                                  <TableCell onClick={(e) => openDetail(e, getRoute('depo.eir.in.detail', {depoSlug: depoId, id: data?.id}))}>{data?.container?.serial_number}x GP</TableCell>
                                  <TableCell onClick={(e) => openDetail(e, getRoute('depo.eir.in.detail', {depoSlug: depoId, id: data?.id}))}>{data?.delivery_no}</TableCell>
                                  <TableCell onClick={(e) => openDetail(e, getRoute('depo.eir.in.detail', {depoSlug: depoId, id: data?.id}))}>{data?.shipper}</TableCell>
                                  <TableCell onClick={(e) => openDetail(e, getRoute('depo.eir.in.detail', {depoSlug: depoId, id: data?.id}))}>{data?.destination}</TableCell>
                                  {/* <TableCell onClick={(e) => openDetail(e, getRoute('depo.eir.in.detail', {depoSlug: depoId, id: data?.id}))}>{data?.created_by?.name}</TableCell> */}
                                  <TableCell onClick={(e) => openDetail(e, getRoute('depo.eir.in.detail', {depoSlug: depoId, id: data?.id}))}>{data?.remarks}</TableCell>
                                  {/* <TableCell>
                                      <Tooltip title="Delete" placement="top">
                                          <IconButton size="small" onClick={() => confirmDelete(index)}><Icon>delete</Icon></IconButton>
                                      </Tooltip>
                                  </TableCell> */}
                              </TableRow>
                          ))}
                          {(isLoading) && <TableRow>
                              <TableCell colSpan={9} className="text-center text-muted" align="center">
                                  Loading...
                              </TableCell>
                          </TableRow>}
                          {(!isLoading && dataList?.length <= 0) && <TableRow>
                              <TableCell colSpan={9} className="text-center text-muted" align="center">
                                  No Data
                              </TableCell>
                          </TableRow>}
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
      <EirOutForm 
          open={openForm} 
          isEdit={isFormEdit}
          data={editData}
          closeModal={() => setOpenForm(false)} 
          dataInserted={(data) => listDataSwr.mutate()}
          dataUpdated={(data) => listDataSwr.mutate()} />
    </BaseLayoutDepo>
  )
}