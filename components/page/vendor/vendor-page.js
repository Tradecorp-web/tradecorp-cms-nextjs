import { Button, ButtonGroup, Card, Divider, Grid, Icon, IconButton, InputBase, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Tooltip, Typography } from "@material-ui/core";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { generateRange } from "../../../helpers/general";
import getRoute from "../../../helpers/router";
import { deleteVendorApi } from "../../../services/api/vendor.api";
import { getListVendorSwr } from "../../../services/swr/vendor.swr";
import AlertDialog from "../../base_component/dialog";
import { CircularProgressCustom } from "../../base_component/spinner";
import BaseLayoutProduct from "../../base_layout/base-layout-product";
import VendorForm from "./vendor-form";
import VendorImport from "./vendor-import";
import SearchBar from "../../base_component/searchbar";

export default function Page() {

    const router = useRouter()

    const [openForm, setOpenForm] = useState(false)
    const [openImport, setOpenImport] = useState(false)

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

    var listVebdorPendingRegisteredSwr = getListVendorSwr({limit: 1, pendingAcceptance: true})
    var [totalPendingRegistered, setTotalPendingRegistered] = useState(0)
    useEffect(() => {
        setTotalPendingRegistered(listVebdorPendingRegisteredSwr?.data?.total)
    }, [listVebdorPendingRegisteredSwr])
    
    const [isAccepted, setAccepted] = useState(true)
    const [pendingAcceptance, setPendingAcceptance] = useState(false)

    const [isLoading, setLoading] = useState(false)
    const [dataList, setDataList] = useState([])
    var listVendorSwr = getListVendorSwr({
        search: search, 
        page: page+1, 
        limit: limit,
        isAccepted: isAccepted,
        pendingAcceptance: pendingAcceptance,
    })
    useEffect(() => {
        setLoading(listVendorSwr?.isLoading)
        if(listVendorSwr?.data?.result) {
            setTotal(listVendorSwr?.data?.total)
            setDataList(listVendorSwr?.data?.result)
        }
    }, [listVendorSwr])
    // ------------------------------------------
    // [END] GET DATA & PAGINATION
    // ==========================================

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const listTypeMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    };
    const listTypeMenuClose = () => {
        setAnchorEl(null)
    };
    const [listTypeMenuCurrent, setListTypeMenuCurrent] = useState('Our Vendors');
    const listTypeMenuId = 'vendor-page-menu-id';
    const listTypeMenu = (
        <Menu
            className="container-item-menu"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={listTypeMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={listTypeMenuClose}>
                <MenuItem onClick={(e) => changeMenu("default", "Our Vendors")}>Our Vendors</MenuItem>
                <MenuItem onClick={(e) => changeMenu("pending", "Waiting for Reeview")}>
                    Waiting for Reeview ({totalPendingRegistered})
                    {totalPendingRegistered > 0 && <Icon className="ms-2" color="primary" style={{fontSize: 12}}>fiber_manual_record</Icon>}
                </MenuItem>
        </Menu>
    );
    function changeMenu(menu, current) {
        setListTypeMenuCurrent(current)
        listTypeMenuClose()
        if(menu == "pending") {
            setAccepted(null)
            setPendingAcceptance(true)
        } else {
            setAccepted(true)
            setPendingAcceptance(false)
        }
    }

    return <BaseLayoutProduct title="Product">
        <div className="content-wrapper">
            <Grid 
                container 
                className="page-container"
                alignItems="center"
                justify="center">
                <Grid item xs={12} lg={12} xl={8}>
                    <div className="p-5 mb-5">
                        <h1 className="mb-3">Vendor</h1>
                        <div className="card no-padding">
                            <div className="p-3 display-space-between">
                                <SearchBar style={{width: "25%", marginRight: 24}} onSearch={(search) => searchData(search)} isLoading={isLoading} />
                                <div className="display-space-between" style={{flexGrow: 1}}>
                                    <div className="select-options" onClick={listTypeMenuOpen}>
                                        {totalPendingRegistered > 0 && <Icon className="me-2" color="primary" style={{fontSize: 12}}>fiber_manual_record</Icon>}
                                        <span>{listTypeMenuCurrent}</span>
                                        <Icon className="ms-2" style={{fontSize: 14}}>unfold_more</Icon>
                                    </div>
                                    <ButtonGroup color="default" aria-label="primary button group" variant="outlined" disableElevation>
                                        <Tooltip title="Add Vendor" placement="top">
                                            <Button onClick={() => setOpenForm(true)}><Icon size="small">add</Icon> Add Vendor</Button>
                                        </Tooltip>
                                        {/* <Tooltip title="Import Vendor Data" placement="top">
                                            <Button onClick={() => setOpenImport(true)}><Icon size="small">archive</Icon></Button>
                                        </Tooltip> */}
                                    </ButtonGroup>
                                </div>
                            </div>
                            <Divider/>
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={12}>No</TableCell>
                                            <TableCell width={24}></TableCell>
                                            <TableCell>Company</TableCell>
                                            <TableCell>Telp</TableCell>
                                            <TableCell>Address</TableCell>
                                            <TableCell>Since</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {(dataList ?? [])?.map((data, index) => (
                                        <RowItem
                                            key={data?.id}
                                            data={data}
                                            no={index + 1 + (page*limit)}
                                            onDeleted={listVendorSwr.mutate} />
                                    ))}
                                    {(isLoading && dataList.length == 0) && <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted" align="center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>}
                                    {(!isLoading && dataList?.length <= 0) && <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted" align="center">
                                            No Data
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
                                                onChangeRowsPerPage={(e) => setLimit(parseInt(e.target.value))}
                                                ActionsComponent={TablePaginationActions}/>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
        <VendorForm 
            open={openForm} 
            closeModal={() => setOpenForm(false)} 
            dataInserted={(data) => listVendorSwr.mutate()}/>
        <VendorImport open={openImport} closeModal={() => setOpenImport(false)} />
        {listTypeMenu}
    </BaseLayoutProduct>
}

function RowItem(props) {

    const router = useRouter()

    const [openDialog, setOpenDialog] = useState(false)
    const [isLoading, setLoading] = useState(false)

    function deleteData() {
        setOpenDialog(false)
        setLoading(true)
        deleteVendorApi(props?.data?.id).then((val) => {
            props?.onDeleted()
            setLoading(false)
        }).catch((err) => {
            setLoading(false)
        })
    }

    function openDetail(e, url) {
        if (!e) var e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation()) {
            e.stopPropagation()
        }
        else {
            e.preventDefault();
            router.push(url)
        }
    }

    return <TableRow key={props?.data?.id} hover={true}>
        <TableCell onClick={(e) => openDetail(e, getRoute('vendor.detail', {id: props?.data?.id}))}>{props?.no}</TableCell>
        <TableCell className="text-center" width={24} onClick={(e) => openDetail(e, getRoute('vendor.detail', {id: props?.data?.id}))}>
            {props?.data?.logo != null && <img src={props?.data?.logo} style={{width: 24, height: 24, marginRight: "24px", objectFit: "contain"}}/>}
        </TableCell>
        <TableCell onClick={(e) => openDetail(e, getRoute('vendor.detail', {id: props?.data?.id}))}>{props?.data?.vendor_name}</TableCell>
        <TableCell onClick={(e) => openDetail(e, getRoute('vendor.detail', {id: props?.data?.id}))}>{props?.data?.vendor_phone}</TableCell>
        <TableCell onClick={(e) => openDetail(e, getRoute('vendor.detail', {id: props?.data?.id}))}>{props?.data?.vendor_address}</TableCell>
        <TableCell onClick={(e) => openDetail(e, getRoute('vendor.detail', {id: props?.data?.id}))}>{props?.data?.last_updated ?? "-"}</TableCell>
        <TableCell>
            {isLoading && <CircularProgressCustom />}
            {!isLoading && <Tooltip title="Delete" placement="top">
                <IconButton size="small" onClick={() => setOpenDialog(true)}><Icon>delete</Icon></IconButton>
            </Tooltip>}
        </TableCell>
        <AlertDialog 
            title="Delete Item"
            body={`Are you sure you want to delete ${props?.data?.vendor_name}`}
            open={openDialog} 
            cancelAction={() => setOpenDialog(false)} okAction={deleteData} />
    </TableRow>
}