import { Button, ButtonGroup, Card, ClickAwayListener, Divider, Grid, Grow, Icon, IconButton, InputBase, InputLabel, MenuItem, MenuList, Paper, Popper, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Tooltip, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import getRoute from "../../../helpers/router";
import BaseLayoutProduct from "../../base_layout/base-layout-product";
import ProductForm from "./product-category-form";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { CircularProgressCustom } from "../../base_component/spinner";
import { getListProductCategorySwr } from "../../../services/swr/product-category.swr";
import { deleteProductCategoryApi } from "../../../services/api/product-category.api";
import AlertDialog from "../../base_component/dialog";

export default function Page() {

    const router = useRouter();

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
        await deleteProductCategoryApi(data?.id)
        setEditData(null)
    }
    // --------< Delete Data >--------

    // ==========================================
    // [START] GET DATA & PAGINATION
    // ------------------------------------------
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(20)
    
    const [searchInput, setSearchInput] = useState("")
    const [search, setSearch] = useState("")
    var typingSearchTimer;
    var doneTypingSearchInterval = 500; 
    function serachData() {
        setPage(0)
        setSearch(searchInput)
    }

    const [isLoading, setLoading] = useState(false)
    const [dataList, setDataList] = useState([])
    var listProductSwr = getListProductCategorySwr({
        search: search, 
        page: page+1, 
        limit: limit,
        orderBy: "name",
        order: "asc"
    })
    useEffect(() => {
        setLoading(listProductSwr?.isLoading)
        if(listProductSwr?.data?.result) {
            setTotal(listProductSwr?.data?.total)
            setDataList(listProductSwr?.data?.result)
        }
    }, [listProductSwr])
    // ------------------------------------------
    // [END] GET DATA & PAGINATION
    // ==========================================

    return <BaseLayoutProduct>
        <div className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={8}>
                    <h1 className="mb-3">Products Category</h1>
                    <div className="card no-padding">
                        <div className="p-3 display-space-between">
                            <div className="display-space-between" style={{width: "25%"}}>
                                <IconButton onClick={() => router.push(getRoute("product"))} size="small" className="me-3"><Icon>arrow_back</Icon></IconButton>
                                <div className="search-bar me-3">
                                    <InputBase
                                        placeholder="Search…"
                                        className="search-input"
                                        readOnly={isLoading}
                                        renderSuffix={() => {
                                            if (isLoading) {
                                                return <CircularProgressCustom size={20} />
                                            } else {
                                                return <IconButton onClick={() => setSearch(searchInput)} size="small"><Icon>search</Icon></IconButton>
                                            }
                                        }}
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyUp={(e) => {
                                            clearTimeout(typingSearchTimer)
                                            typingSearchTimer = setTimeout(serachData, doneTypingSearchInterval)
                                        }}
                                        onKeyDown={(e) => clearTimeout(typingSearchTimer)}
                                        inputProps={{ 'aria-label': 'search' }}/>
                                </div>
                            </div>
                            <Button
                                variant="contained" 
                                disableElevation 
                                color="secondary"
                                onClick={() => setOpenForm(true)}>
                                <Icon>add</Icon>Add Product Category
                            </Button>
                        </div>
                        <Divider/>
                        <TableContainer component={Card}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={12}>No</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Code</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {!isLoading && dataList.map((data, index) => (
                                    <TableRow key={index} hover={true}>
                                        <TableCell onClick={(e) => openEditData(index)}>{index + 1 + (page*limit)}</TableCell>
                                        <TableCell onClick={(e) => openEditData(index)}>{data?.name}</TableCell>
                                        <TableCell onClick={(e) => openEditData(index)}>{data?.code}</TableCell>
                                        <TableCell align="right">
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
                                    <TableCell colSpan={7} className="text-center text-muted" align="center">
                                        Loading...
                                    </TableCell>
                                </TableRow>}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[10, 20, 50, 100]}
                                            colSpan={7}
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
        <ProductForm 
            open={openForm} 
            closeModal={() => setOpenForm(false)} 
            isEdit={isFormEdit}
            data={editData}
            dataInserted={(data) => listProductSwr.mutate()}
            dataUpdated={(data) => listProductSwr.mutate()} />
        <AlertDialog 
            title="Delete Item"
            body={`Are you sure you want to delete ${dataList[deleteIndex]?.name}`}
            open={confirmDelete} 
            cancelAction={() => setConfirmDelete(false)} okAction={deleteData} />
    </BaseLayoutProduct>
}