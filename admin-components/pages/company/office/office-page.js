import { Button, ButtonGroup, Divider, Grid, Icon, Card, IconButton, Tooltip, TablePagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter } from "@material-ui/core";
import { useEffect, useState } from "react";
import SearchBar from "../../../../components/base_component/searchbar";
import getRoute from "../../../../helpers/router";
import { getListCompanyOfficeSwr } from "../../../../services/swr/company.swr";
import AdminBaseLayout from "../../../base_layout/admin_base_layout";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import OfficeForm from "./office-form";
import AlertDialog from "../../../../components/base_component/dialog";
import { deleteCompanyOfficeApi } from "../../../../services/api/company.api";

export default function Page() {

    const [isFormEdit, setFormEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    
    function openEditData(index) {
        setEditData(dataList[index])
        setFormEdit(true)
        setOpenForm(true)
    }

    // --------< Delete Data >--------
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(false);

    function confirmDeleting(index) {
        setDeleteIndex(index)
        setConfirmDelete(true)
    }
    
    async function deleteData() {
        setConfirmDelete(false)
        var data = dataList[deleteIndex]
        dataList.splice(deleteIndex, 1)
        setDataList(dataList)
        await deleteCompanyOfficeApi(data?.id)
        setEditData(null)
    }
    // --------< Delete Data >--------

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
    var officesSwr = getListCompanyOfficeSwr({
        search: search, 
        page: page+1, 
        limit: limit,
        orderBy: "code",
        order: "asc",
    })
    useEffect(() => {
        setLoading(officesSwr?.isLoading)
        if(officesSwr?.data?.result) {
            setTotal(officesSwr?.data?.total)
            setDataList(officesSwr?.data?.result)
        }
    }, [officesSwr])
    // ------------------------------------------
    // [END] GET DATA & PAGINATION
    // ==========================================

    return <AdminBaseLayout title="Company Offices">
        <Grid container spacing={4}>
            <Grid item lg={12} xl={8}>
                <div className="card no-padding">
                    <div className="p-3 display-space-between">
                        <SearchBar style={{width: "25%", marginRight: 24}} onSearch={(search) => searchData(search)} isLoading={isLoading} />
                        <ButtonGroup variant="outlined" color="default" aria-label="split button">
                            <Button
                                onClick={() => setOpenForm(true)}>
                                <Icon>add</Icon>Add Office
                            </Button>
                        </ButtonGroup>
                    </div>
                    <Divider/>
                    <TableContainer component={Card}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell width={12}>No</TableCell>
                                    <TableCell width={150}>Office Name</TableCell>
                                    <TableCell width={150}>Phone Number</TableCell>
                                    <TableCell width={150}>City</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell width={100}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {!isLoading && dataList.map((data, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1 + (page*limit)}</TableCell>
                                    <TableCell>{data?.office_name}</TableCell>
                                    <TableCell>{data?.phone_number}</TableCell>
                                    <TableCell>{data?.city}</TableCell>
                                    <TableCell>{data?.address}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit" placement="top">
                                            <IconButton size="small" onClick={() => openEditData(index)}><Icon>edit</Icon></IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete" placement="top">
                                            <IconButton size="small" onClick={() => confirmDeleting(index)}><Icon>delete</Icon></IconButton>
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
        <OfficeForm 
            open={openForm} 
            closeModal={() => setOpenForm(false)} 
            isEdit={isFormEdit}
            data={editData}
            dataInserted={(data) => officesSwr.mutate()}
            dataUpdated={(data) => officesSwr.mutate()} />
        <AlertDialog 
            title="Delete Item"
            body={`Are you sure you want to delete ${dataList[deleteIndex]?.office_name}`}
            open={confirmDelete} 
            cancelAction={() => setConfirmDelete(false)} okAction={deleteData} />
    </AdminBaseLayout>
}