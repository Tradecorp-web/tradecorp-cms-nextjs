import { Button, ButtonGroup, Popper, Divider, Grow, Grid, Icon, IconButton, InputBase, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@material-ui/core';
import BaseLayoutCompanyDirectory from '../../../base_layout/base-layout-company-directory';
import { useRouter } from 'next/router';
import getRoute from '../../../../helpers/router';
import AlertDialog from "../../../base_component/dialog";
import { useEffect, useRef, useState } from 'react';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import { getListMailGroupSwr } from '../../../../services/swr/mail-groups.swr';
import MailGroupForm from './mail-group-form';
import { deleteMailGroupApi } from '../../../../services/api/mail-group.api';
import { accountSwr } from '../../../../services/swr/account.swr';

export default function MailGroupPage() {

  const router = useRouter()
  var companyId = router.query.companyId

  const account = accountSwr()
  
  const [isFormEdit, setFormEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formState, setFormState] = useState(null)
  function onChangeInput(e) {
    setFormState({...formState, [e.target.name]: e.target.value})
  }
      
  function openEditData(index) {
      setEditData(dataList[index])
      setFormEdit(true)
      setOpenForm(true)
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
  var listMailGroupSwr = getListMailGroupSwr({
      search: search, 
      page: page+1, 
      limit: limit,
      orderBy: "group_name",
      order: "asc",
      createdBy: account?.data?.is_admin ? "" : account?.data?.id,
      company: companyId,
  })
  useEffect(() => {
    setLoading(listMailGroupSwr?.isLoading)
    if(listMailGroupSwr?.data?.result) {
      setTotal(listMailGroupSwr?.data?.total)
      setDataList(listMailGroupSwr?.data?.result)
    }
  }, [listMailGroupSwr])

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
      dataList.splice(deleteIndex, 1)
      setDataList(dataList)
      await deleteMailGroupApi(data?.id)
  }
  // *----<Delete Items>----*

  return (
    <BaseLayoutCompanyDirectory title="Mail Groups">
      <AlertDialog 
        title="Delete Item"
        body={`Are you sure you want to delete ${dataList[deleteIndex]?.name}`}
        open={isOpenConfirmationDialog} 
        cancelAction={() => setOpenConfirmationDialog(false)} okAction={deleteData} />
      <div className="p-5 content-wrapper">
        <Grid container className="page-container" alignItems="center" justify="center">
          <Grid item xs={12} lg={12} xl={10}>
            <h1 className="mb-3">Mail Groups</h1>
            <div className="card no-padding">
                <div className="p-3 display-space-between">
                  <div className="flex-center me-3" style={{flexGrow: 1}}>
                    <InputBase 
                      style={{width: "200px", marginRight: 24}}
                      className="input input-rounded bold" 
                      fullWidth 
                      name="title"
                      value={formState?.title ?? ""}
                      onChange={onChangeInput}
                      placeholder="Mail Groups Title"/>
                  </div>
                  <ButtonGroup variant="outlined" color="default">
                      <Button
                          onClick={() => setOpenForm(true)}>
                          <Icon>add</Icon>Add Mail Groups
                      </Button>
                  </ButtonGroup>
                </div>
                <Divider />
                <TableContainer>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell width={12}>No</TableCell>
                                <TableCell>Group Name</TableCell>
                                <TableCell>Members</TableCell>
                                <TableCell>Created by</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {!isLoading && dataList.map((data, index) => (
                            <TableRow key={index} hover={true}>
                                <TableCell onClick={(e) => openDetail(e, getRoute('mail.group.detail', {id: data?.id, companyId: companyId}))}>{index + 1 + (page*limit)}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('mail.group.detail', {id: data?.id, companyId: companyId}))}>{data?.group_name}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('mail.group.detail', {id: data?.id, companyId: companyId}))}>{data?.users?.length}</TableCell>
                                <TableCell onClick={(e) => openDetail(e, getRoute('mail.group.detail', {id: data?.id, companyId: companyId}))}>{data?.creator?.name}</TableCell>
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
                            <TableCell colSpan={4} className="text-center text-muted" align="center">
                                Loading...
                            </TableCell>
                        </TableRow>}
                        {(!isLoading && dataList?.length <= 0) && <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted" align="center">
                                No Data
                            </TableCell>
                        </TableRow>}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[10, 20, 50, 100]}
                                    colSpan={4}
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
      <MailGroupForm 
          open={openForm} 
          isEdit={isFormEdit}
          data={editData}
          closeModal={() => setOpenForm(false)} 
          dataInserted={(data) => listMailGroupSwr.mutate()}
          dataUpdated={(data) => listMailGroupSwr.mutate()} />

    </BaseLayoutCompanyDirectory>
  )
}