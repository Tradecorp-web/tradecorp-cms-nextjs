import { Button, ButtonGroup, Card, ClickAwayListener, Divider, Grid, Grow, Icon, IconButton, InputBase, InputLabel, MenuItem, MenuList, Paper, Popper, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Tooltip, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import getRoute from "../../../helpers/router";
import { currency, dateFormat, dateExpired } from "../../../helpers/general";
import { getListMaterialSwr } from "../../../services/swr/material.swr";
import BaseLayoutProduct from "../../base_layout/base-layout-product";
import MaterialForm from "./material-form";
import MaterialImport from "./material-import";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { Alert } from "@material-ui/lab";
import { getListMaterialCategorySwr } from "../../../services/swr/material-category.swr";
import SearchBar from "../../base_component/searchbar";
import AlertDialog from "../../base_component/dialog";
import { deleteMaterialApi } from "../../../services/api/material.api";

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
    const [underMinimumStock, setUnderMinimumStock] = useState(false)
    const [priceExpired, setPriceExpired] = useState(false)
    
    const [search, setSearch] = useState("")
    function searchData(search) {
        setPage(0)
        setSearch(search)
    }
    
    var [underMinimumStockTotal, setUnderMinimumStockTotal] = useState(0)
    var listMaterialUnderStockSwr = getListMaterialSwr({
        page: 1, 
        limit: 1,
        underMinimumStock: true
    })
    useEffect(() => {
        if(listMaterialUnderStockSwr?.data?.total)
            setUnderMinimumStockTotal(listMaterialUnderStockSwr?.data?.total ?? 0)
    }, [listMaterialUnderStockSwr])
    
    var [priceExpiredTotal, setPriceExpiredTotal] = useState(0)
    var listMaterialExpiredSwr = getListMaterialSwr({
        page: 1, 
        limit: 1,
        priceExpired: true
    })
    useEffect(() => {
        if(listMaterialExpiredSwr?.data?.total)
        setPriceExpiredTotal(listMaterialExpiredSwr?.data?.total ?? 0)
    }, [listMaterialExpiredSwr])
    
    const [category, setCategory] = useState("all")
    const [isLoading, setLoading] = useState(false)
    const [dataList, setDataList] = useState([])
    var listMaterialSwr = getListMaterialSwr({
        search: search, 
        page: page+1, 
        limit: limit,
        category: category == "all" ? "" : category,
        orderBy: "code",
        order: "asc",
        underMinimumStock: underMinimumStock,
        priceExpired: priceExpired,
    })
    useEffect(() => {
        setLoading(listMaterialSwr?.isLoading)
        if(listMaterialSwr?.data?.result) {
            setTotal(listMaterialSwr?.data?.total)
            setDataList(listMaterialSwr?.data?.result)
        }
    }, [listMaterialSwr])
    
    const [categories, setCategories] = useState([])
    var categorySwr = getListMaterialCategorySwr({ page: 1, limit: 200, orderBy: "name", order: "asc" })
    useEffect(() => {
        if(categorySwr?.data?.result) {
            setCategories(categorySwr?.data?.result ?? [])
        }
    }, [categorySwr])

    const typeList = [
        {name: "All Materials", value: "all"},
        {name: "Stock Under Minimum Level", value: "under"},
        {name: "Price Expired", value: "expired"}
    ]
    const [typeListSelected, setTypeListSelected] = useState(typeList[0]?.value)
    useEffect(() => {
        setPage(0)
        setUnderMinimumStock(typeListSelected == "under")
        setPriceExpired(typeListSelected == "expired")
    }, [typeListSelected])
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
            router.push(getRoute("material.category"))
        } else if(menu?.value == 2) {
            setOpenImport(true)
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
        {name: "Manage Material Category", value: 1},
        {name: "Import Material", value: 2},
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
        await deleteMaterialApi(data?.id)
    }
    // *----<Delete Items>----*

    return <BaseLayoutProduct>
        <AlertDialog 
            title="Delete Item"
            body={`Are you sure you want to delete ${dataList[deleteIndex]?.material_name}`}
            open={isOpenConfirmationDialog} 
            cancelAction={() => setOpenConfirmationDialog(false)} okAction={deleteData} />
        <div className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={12} xl={8}>
                    <h1 className="mb-3">Materials</h1>
                    { 
                        (underMinimumStockTotal > 0 || priceExpiredTotal > 0) &&
                        <Alert severity="error" className="mb-3">
                            {underMinimumStockTotal > 0 && <div>{underMinimumStockTotal} materials have stock below the minimum stock level</div>}
                            {priceExpiredTotal > 0 && <div>{priceExpiredTotal} materials have expired prices</div>}
                        </Alert>
                    }
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
                                <Select
                                    className="input input-rounded"
                                    fullWidth
                                    value={typeListSelected ?? "none"}
                                    onChange={(e) => setTypeListSelected(e.target.value)}
                                    style={{width: 200}}
                                    input={<InputBase />}>
                                    {typeList?.map((item, i) => {
                                        return <MenuItem key={item.value} value={item?.value}>{item?.name}</MenuItem>
                                    })}
                                </Select>
                            </div>
                            <ButtonGroup variant="outlined" color="default" ref={anchorRef} aria-label="split button">
                                <Button
                                    onClick={() => setOpenForm(true)}>
                                    <Icon>add</Icon>Add Material
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
                                        <TableCell>Material Name</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Min. Stock</TableCell>
                                        <TableCell>Stock</TableCell>
                                        <TableCell>Best Price</TableCell>
                                        <TableCell>Expiration Date</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {!isLoading && dataList.map((data, index) => (
                                    <TableRow key={index} hover={true}>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('material.detail', {id: data?.id}))}>{index + 1 + (page*limit)}</TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('material.detail', {id: data?.id}))}>{data?.code}</TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('material.detail', {id: data?.id}))}>{data?.material_name}</TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('material.detail', {id: data?.id}))}>{data?.category?.name}</TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('material.detail', {id: data?.id}))}>{data?.minimum_level_stock ?? "-"} {data?.unit}</TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('material.detail', {id: data?.id}))}>
                                            <div className="flex-center">
                                                {data?.stock ?? 0} {data?.unit}
                                                {data?.stock < data?.minimum_level_stock && <Tooltip title={`Stock is less than the minimum level (${data?.minimum_level_stock ?? "-"} ${data?.unit})`} placement="top">
                                                    <Icon style={{fontSize: 16, marginLeft: 4, color: "red"}}>warning</Icon>
                                                </Tooltip>}
                                            </div>
                                        </TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('material.detail', {id: data?.id}))}>{currency(data?.price)}</TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('material.detail', {id: data?.id}))}>
                                            <div className="flex-center">
                                                {dateFormat(data?.expiration_date)}
                                                {dateExpired(data?.expiration_date) && <Tooltip title="Price is expired" placement="top">
                                                    <Icon style={{fontSize: 16, marginLeft: 4, color: "red"}}>warning</Icon>
                                                </Tooltip>}
                                            </div>
                                        </TableCell>
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
        <MaterialForm 
            open={openForm} 
            closeModal={() => setOpenForm(false)} 
            dataInserted={(data) => listMaterialSwr.mutate()} />
        <MaterialImport open={openImport} closeModal={() => setOpenImport(false)} />
    </BaseLayoutProduct>
}