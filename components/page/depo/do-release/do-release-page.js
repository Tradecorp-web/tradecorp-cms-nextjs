import { Button, ButtonGroup, Card, Popper, Divider, Grow, Grid, Icon, IconButton, InputBase, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import getRoute from '../../../../helpers/router';
import AlertDialog from "../../../base_component/dialog";
import { useEffect, useRef, useState } from 'react';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import { deleteContainerApi } from '../../../../services/api/container-stocks.api';
import DOReleaseForm from './do-release-form';
import BaseLayoutDepo from '../../../base_layout/base-layout-depo';
import { getListDOReleaseSwr } from '../../../../services/swr/do-release.swr';
import { dateFormat } from '../../../../helpers/general';
import SearchBar from '../../../base_component/searchbar';

export default function DataTable() {

  
  const [formState, setFormState] = useState(null)
  function onChangeInput(e) {
    setFormState({...formState, [e.target.name]: e.target.value})
  }

  function openDetail(e, url) {
    e.preventDefault();
    router.push(url)
  }

  const router = useRouter()
  const depoId = router.query.depoSlug

  const [openForm, setOpenForm] = useState(false);

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
  var listDoReleaseSwr = getListDOReleaseSwr({
      search: search, 
      page: page+1, 
      limit: limit,
      orderBy: "code",
      order: "asc",
      depoId: depoId
  })
  useEffect(() => {
    setLoading(listDoReleaseSwr?.isLoading)
    if(listDoReleaseSwr?.data?.result) {
      setTotal(listDoReleaseSwr?.data?.total)
      setDataList(listDoReleaseSwr?.data?.result)
    }
  }, [listDoReleaseSwr])

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
    <BaseLayoutDepo title="DO Release">
      <AlertDialog 
            title="Delete Item"
            body={`Are you sure you want to delete ${dataList[deleteIndex]?.name}`}
            open={isOpenConfirmationDialog} 
            cancelAction={() => setOpenConfirmationDialog(false)} okAction={deleteData} />
      <div className="p-5 content-wrapper">
        <Grid container className="page-container" alignItems="center" justify="center">
          <Grid item xs={12} lg={12} xl={10}>
            <h1 className="mb-3">DO Release</h1>
            <div className="card no-padding">
                <div className="p-3 display-space-between">
                  <SearchBar 
                    style={{width: "25%", marginRight: 24}} 
                    onSearch={(search) => searchData(search)} 
                    isLoading={isLoading} 
                    placeholder="Search Release Number..."/>
                  <div className="flex-center me-3" style={{flexGrow: 1}}>
                    {/* <InputBase 
                      style={{width: "200px", marginRight: 24}}
                      className="input input-rounded bold uppercase" 
                      fullWidth 
                      name="serialNumber"
                      value={formState?.serialNumber ?? ""}
                      onChange={onChangeInput}
                      placeholder="TIHUxxxxxx"/>
                    <Select
                      className="input input-rounded me-3"
                      fullWidth
                      style={{width: "200px", marginRight: 24}}
                      name="size"
                      value={formState?.size ?? "Select Size"}
                      onChange={onChangeInput}
                      input={<InputBase placeholder="Select Size" />}>
                      <MenuItem value="all" selected>All Size</MenuItem>
                      {sizeOptions?.map((item, i) => {
                        return <MenuItem key={item} value={item}>{item?.name}</MenuItem>
                      })}
                    </Select>
                    <InputBase 
                      className="input input-rounded bold uppercase" 
                      fullWidth 
                      max="9999"
                      style={{width: "100px", marginRight: 24}}
                      type="number"
                      name="yom"
                      value={formState?.yom ?? ""}
                      onChange={onChangeInput}
                      placeholder="2010"/>
                    <Select
                      className="input input-rounded me-3"
                      fullWidth
                      name="status"
                      style={{width: "200px", marginRight: 24}}
                      value={formState?.status ?? "Select Status"}
                      onChange={onChangeInput}
                      input={<InputBase placeholder="Select Status" />}>
                      <MenuItem value="all" selected>All Status</MenuItem>
                      {statusOptions?.map((item, i) => {
                        return <MenuItem key={item} value={item}>{item?.name}</MenuItem>
                      })}
                    </Select>
                    <Select
                      className="input input-rounded me-3"
                      fullWidth
                      name="condition"
                      style={{width: "200px", marginRight: 24}}
                      value={formState?.condition ?? "Select Condition"}
                      onChange={onChangeInput}
                      input={<InputBase placeholder="Select Condition" />}>
                      <MenuItem value="all" selected>All Condition</MenuItem>
                      {conditionOptions?.map((item, i) => {
                        return <MenuItem key={item} value={item}>{item?.name}</MenuItem>
                      })}
                    </Select> */}
                    {/* <Button 
                      color="primary" 
                      fullWidth 
                      variant="contained" 
                      style={{width: "100px", marginRight: 24, borderRadius: 50}}
                      onClick={changeFilter}
                      disabled={isLoading}
                      disableElevation>
                      Filter
                    </Button> */}
                  </div>
                  <ButtonGroup variant="outlined" color="default" ref={anchorRef} aria-label="split button">
                      <Button
                          onClick={() => setOpenForm(true)}>
                          <Icon>add</Icon>Create Do Release
                      </Button>
                      {/* <Button
                          size="small"
                          aria-controls={openMenu ? 'split-button-menu' : undefined}
                          aria-expanded={openMenu ? 'true' : undefined}
                          onClick={handleToggle}
                          aria-label="select merge strategy"
                          aria-haspopup="menu">
                          <Icon>arrow_drop_down</Icon>
                      </Button> */}
                  </ButtonGroup>
                  <Popper open={openMenu} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                  {({ TransitionProps, placement }) => (
                      <Grow {...TransitionProps} style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}>
                      <Paper>
                          <ClickAwayListener onClickAway={handleClose}>
                          <MenuList id="split-button-menu">
                              {options.map((option, index) => (
                                  <MenuItem
                                      key={index}
                                      onClick={(event) => handleMenuItemClick(event, index)}>
                                      {option?.name}
                                  </MenuItem>
                              ))}
                          </MenuList>
                          </ClickAwayListener>
                      </Paper>
                      </Grow>
                  )}
                  </Popper>
                </div>
                <Divider />
                <TableContainer>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell width={12}>No</TableCell>
                                <TableCell>Release Number</TableCell>
                                <TableCell>Release Date</TableCell>
                                <TableCell>Expirated Date</TableCell>
                                <TableCell>Party</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Remark</TableCell>
                                {/* <TableCell></TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {!isLoading && dataList.map((data, index) => (
                            <TableRow key={index} hover={true}>
                                <TableCell onClick={(e) => openDetail(e, getRoute('depo.do.release.detail', {depoSlug: depoId, id: data?.id}))}>{index + 1 + (page*limit)}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('depo.do.release.detail', {depoSlug: depoId, id: data?.id}))}>{data?.release_number}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('depo.do.release.detail', {depoSlug: depoId, id: data?.id}))}>{dateFormat(data?.release_date)}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('depo.do.release.detail', {depoSlug: depoId, id: data?.id}))}>{dateFormat(data?.expired_date)}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('depo.do.release.detail', {depoSlug: depoId, id: data?.id}))}>{data?.stocks?.length}x GP</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('depo.do.release.detail', {depoSlug: depoId, id: data?.id}))}>{data?.customer?.name} ({data?.customer?.company})</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('depo.do.release.detail', {depoSlug: depoId, id: data?.id}))}>{data?.creator?.name}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('depo.do.release.detail', {depoSlug: depoId, id: data?.id}))}>{data?.remarks}</TableCell>
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
      <DOReleaseForm 
          open={openForm} 
          closeModal={() => setOpenForm(false)} 
          dataInserted={(data) => listDoReleaseSwr.mutate()} />

    </BaseLayoutDepo>
  )
}