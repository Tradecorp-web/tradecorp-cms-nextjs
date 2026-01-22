import { Button, ButtonGroup, Card, Divider, Popper, Grid, Grow, TableFooter, ClickAwayListener, InputBase, MenuList, TablePagination, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, Icon } from "@material-ui/core";
import { useRouter } from "next/router";
import ProductForm from "../product/product-form";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { useEffect, useRef, useState } from "react";
import getRoute from "../../../helpers/router";
import { getListProductCategorySwr } from "../../../services/swr/product-category.swr";
import { getListProductSwr } from "../../../services/swr/product.swr";
import BaseLayoutProduct from "../../base_layout/base-layout-product";
import SearchBar from "../../base_component/searchbar";
import { currency } from "../../../helpers/general";
import { IconButton } from "@material-ui/core";
import AlertDialog from "../../base_component/dialog";
import { deleteProductApi } from "../../../services/api/product.api";

export default function Page() {

    const router = useRouter();

    const [openForm, setOpenForm] = useState(false);
    const [openImport, setOpenImport] = useState(false);

    function openDetail(e, url) {
        e.preventDefault();
        router.push(url)
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
    
    const [category, setCategory] = useState("all")
    const [isLoading, setLoading] = useState(false)
    const [dataList, setDataList] = useState([])
    var listProductSwr = getListProductSwr({
        search: search, 
        page: page+1, 
        limit: limit,
        category: category == "all" ? "" : category,
        orderBy: "code",
        order: "asc",
    })
    useEffect(() => {
        setLoading(listProductSwr?.isLoading)
        if(listProductSwr?.data?.result) {
            setTotal(listProductSwr?.data?.total)
            setDataList(listProductSwr?.data?.result)
        }
    }, [listProductSwr])
    
    const [categories, setCategories] = useState([])
    var categorySwr = getListProductCategorySwr({ page: 1, limit: 200, orderBy: "name", order: "asc" })
    useEffect(() => {
        if(categorySwr?.data?.result) {
            setCategories(categorySwr?.data?.result ?? [])
        }
    }, [categorySwr])
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
        await deleteProductApi(data?.id)
    }
    // *----<Delete Items>----*

    return <BaseLayoutProduct>
    <div className="p-5 content-wrapper">
        <AlertDialog 
            title="Delete Item"
            body={`Are you sure you want to delete ${dataList[deleteIndex]?.name}`}
            open={isOpenConfirmationDialog} 
            cancelAction={() => setOpenConfirmationDialog(false)} okAction={deleteData} />
        <Grid container className="page-container" alignItems="center" justify="center">
            <Grid item xs={12} lg={12} xl={8}>
                    <h1 className="mb-3">Products</h1>
                    <div className="card no-padding">
                        <div className="p-3 display-space-between">
                            <SearchBar style={{width: "25%", marginRight: 24}} onSearch={(search) => searchData(search)} isLoading={isLoading} />
                            <div className="flex-center me-3" style={{flexGrow: 1}}>
                                <Select
                                    className="input input-rounded me-3"
                                    fullWidth
                                    value={category ?? "all"}
                                    onChange={(e) => setCategory(e.target.value)}
                                    style={{width: 200}}
                                    input={<InputBase placeholder="Select Category" />}>
                                    <MenuItem value="all" selected>All</MenuItem>
                                    {categories?.map((item, i) => {
                                        return <MenuItem key={item.id} value={item?.id}>{item?.name}</MenuItem>
                                    })}
                                </Select>
                            </div>
                            <ButtonGroup variant="outlined" color="default" ref={anchorRef} aria-label="split button">
                                <Button
                                    onClick={() => setOpenForm(true)}>
                                    <Icon>add</Icon>Add Product
                                </Button>
                                <Button
                                    size="small"
                                    aria-controls={openMenu ? 'split-button-menu' : undefined}
                                    aria-expanded={openMenu ? 'true' : undefined}
                                    onClick={handleToggle}
                                    aria-label="select merge strategy"
                                    aria-haspopup="menu">
                                    <Icon>arrow_drop_down</Icon>
                                </Button>
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
                        <Divider/>
                        <TableContainer component={Card}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={12}>No</TableCell>
                                        <TableCell>Code</TableCell>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Price Estimated</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {!isLoading && dataList.map((data, index) => (
                                    <TableRow key={index} hover={true}>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('product.detail', {id: data?.id}))}>{index + 1 + (page*limit)}</TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('product.detail', {id: data?.id}))}>{data?.code}</TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('product.detail', {id: data?.id}))}>{data?.name}</TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('product.detail', {id: data?.id}))}>{data?.category?.name}</TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('product.detail', {id: data?.id}))}>{currency(data?.price)}</TableCell>
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
    <ProductForm 
        open={openForm} 
        closeModal={() => setOpenForm(false)} 
        dataInserted={(data) => listProductSwr.mutate()} />
</BaseLayoutProduct>
}