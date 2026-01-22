import { Button, ButtonGroup, Card, Divider, IconButton, Popper, Grid, Grow, TableFooter, ClickAwayListener, InputBase, MenuList, TablePagination, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, Icon } from "@material-ui/core";
import { useRouter } from "next/router";
import VehicleForm from "./vehicle-form";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { useEffect, useRef, useState } from "react";
import getRoute from "../../../helpers/router";
import { getListVehicleSwr } from "../../../services/swr/vehicle.swr";
import BaseLayoutVehicle from "../../base_layout/base-layout-vehicle";
import SearchBar from "../../base_component/searchbar";
import { dateFormat } from "../../../helpers/general";
import { deleteVehicleApi } from "../../../services/api/vehicle.api";
import AlertDialog from "../../base_component/dialog";
import { getListVehicleCategorySwr } from "../../../services/swr/vehicle-category.swr";

export default function Page() {

    const router = useRouter();

    const [openForm, setOpenForm] = useState(false);

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
    const [categories, setCategories] = useState([])
    var categorySwr = getListVehicleCategorySwr({ page: 1, limit: 200, orderBy: "name", order: "asc" })
    useEffect(() => {
        if(categorySwr?.data?.result) {
            setCategories(categorySwr?.data?.result ?? [])
        }
    }, [categorySwr])
    
    const [isLoading, setLoading] = useState(false)
    const [dataList, setDataList] = useState([])
    var listVehicleSwr = getListVehicleSwr({
        search: search, 
        page: page+1, 
        limit: limit,
        category: category == "all" ? "" : category,
        orderBy: "created_at",
        order: "asc",
    })
    useEffect(() => {
        setLoading(listVehicleSwr?.isLoading)
        if(listVehicleSwr?.data?.result) {
            setTotal(listVehicleSwr?.data?.total)
            setDataList(listVehicleSwr?.data?.result)
        }
    }, [listVehicleSwr])
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
            router.push(getRoute("vehicle.category"))
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
        {name: "Manage Vehicle Category", value: 1},
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
        await deleteVehicleApi(data?.id)
    }
    // *----<Delete Items>----*

    return <BaseLayoutVehicle title="Machinery Flat Management">
        <AlertDialog 
            title="Delete Item"
            body={`Are you sure you want to delete ${dataList[deleteIndex]?.name}`}
            open={isOpenConfirmationDialog} 
            cancelAction={() => setOpenConfirmationDialog(false)} okAction={deleteData} />
        <div className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={12} xl={8}>
                        <h1 className="mb-3">Vehicles</h1>
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
                                        <Icon>add</Icon>Add Vehicle
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
                                            <TableCell>Registration Number</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell>Inspection Number</TableCell>
                                            <TableCell>Inspection Expiry Date</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {!isLoading && dataList.map((data, index) => (
                                        <TableRow key={index} hover={true}>
                                            <TableCell onClick={(e) => openDetail(e, getRoute('vehicle.detail', {id: data?.id}))}>{index + 1 + (page*limit)}</TableCell>
                                            <TableCell onClick={(e) => openDetail(e, getRoute('vehicle.detail', {id: data?.id}))}>{data?.vehicle_registration_number}</TableCell>
                                            <TableCell onClick={(e) => openDetail(e, getRoute('vehicle.detail', {id: data?.id}))}>{data?.category?.name}</TableCell>
                                            <TableCell onClick={(e) => openDetail(e, getRoute('vehicle.detail', {id: data?.id}))}>{data?.inspection_number}</TableCell>
                                            <TableCell onClick={(e) => openDetail(e, getRoute('vehicle.detail', {id: data?.id}))}>{dateFormat(data?.inspection_expiry_date)}</TableCell>
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
        <VehicleForm 
            open={openForm} 
            closeModal={() => setOpenForm(false)} 
            dataInserted={(data) => listVehicleSwr.mutate()} />
    </BaseLayoutVehicle>
}