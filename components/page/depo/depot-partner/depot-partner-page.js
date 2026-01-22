import { Button, ButtonGroup, Card, Popper, Divider, Grow, Grid, Icon, IconButton, InputBase, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import getRoute from '../../../../helpers/router';
import AlertDialog from "../../../base_component/dialog";
import { useEffect, useRef, useState } from 'react';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import BaseLayoutDepo from '../../../base_layout/base-layout-depo';
import SearchBar from '../../../base_component/searchbar';
import { getListDepoSwr } from '../../../../services/swr/depo.swr';
import DepoForm from '../depo-form';
import { deleteDepoApi } from '../../../../services/api/depo.api';

export default function DataTable() {

  function openDetail(e, url) {
    e.preventDefault();
    router.push(url)
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
  var listDepoSwr = getListDepoSwr({
      search: search, 
      page: page+1, 
      limit: limit,
      orderBy: "name",
      order: "asc",
      isOwn: false,
      depoPartnerId: depoId
  })
  useEffect(() => {
    setLoading(listDepoSwr?.isLoading)
    if(listDepoSwr?.data?.result) {
      setTotal(listDepoSwr?.data?.total)
      setDataList(listDepoSwr?.data?.result)
    }
  }, [listDepoSwr])

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
      await deleteDepoApi(data?.id)
  }
  // *----<Delete Items>----*

  return (
    <BaseLayoutDepo title="Depot 3rd Party">
      <AlertDialog 
        title="Delete Item"
        body={`Are you sure you want to delete ${dataList[deleteIndex]?.name}`}
        open={isOpenConfirmationDialog} 
        cancelAction={() => setOpenConfirmationDialog(false)} okAction={deleteData} />
      <div className="p-5 content-wrapper">
        <Grid container className="page-container" alignItems="center" justify="center">
          <Grid item xs={12} lg={12} xl={10}>
            <h1 className="mb-3">Depot 3rd Party</h1>
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
                          <Icon>add</Icon>Add Depot
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
                                <TableCell>Name</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Contact Person</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {!isLoading && dataList.map((depo, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{depo?.name}</TableCell>
                              <TableCell>{depo?.address} <br /> {depo?.city} <br /> {depo?.country}, {depo?.postal_code}</TableCell>
                              <TableCell>
                                  {depo?.cp?.map(cp => (
                                    <div className="mb-3">{cp?.name} / {cp?.telp}</div>
                                  ))}
                              </TableCell>
                              <TableCell>
                                <Tooltip title="Edit" placement="top">
                                  <IconButton size="small" onClick={() => openEditData(index)}><Icon>edit</Icon></IconButton>
                                </Tooltip>
                                <Tooltip title="Delete" placement="top">
                                  <IconButton size="small" onClick={() => confirmDelete(index)}><Icon>delete</Icon></IconButton>
                                </Tooltip>
                              </TableCell>
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
      <DepoForm 
          open={openForm} 
          isEdit={isFormEdit}
          data={editData}
          closeModal={() => setOpenForm(false)} 
          isOwn={false}
          depoPartnerId={depoId}
          dataInserted={(data) => listDepoSwr.mutate()}
          dataUpdated={(data) => listDepoSwr.mutate()} />

    </BaseLayoutDepo>
  )
}