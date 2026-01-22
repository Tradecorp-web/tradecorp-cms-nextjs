import { Button, Grid, Icon, IconButton, InputBase, Menu, MenuItem } from "@material-ui/core";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import BaseLayoutProduct from "../../base_layout/base-layout-product";
import VendorForm from "./vendor-form";
import VendorImport from "./vendor-import";
import VendorItem from "./vendor-item";
import { getListVendorSwr } from "../../../services/swr/vendor.swr";
import { CircularProgressCustom } from "../../base_component/spinner";
import getRoute from "../../../helpers/router";
import SearchBar from "../../base_component/searchbar";

export default function VendorLayout(props) {
    const router = useRouter()

    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const menuId = 'menu-item';
    const renderMenu = (
        <Menu
            className="container-item-menu"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}>
            <MenuItem onClick={() => toggleOpenForm()}>Add Vendor</MenuItem>
            <MenuItem onClick={() => toggleOpenImport()}>Import Data</MenuItem>
        </Menu>
    );

    const [openForm, setOpenForm] = useState(false)
    function toggleOpenForm() {
        setOpenForm(!openForm)
        handleMenuClose();
    }
    
    const [openImport, setOpenImport] = useState(false)
    function toggleOpenImport() {
        setOpenImport(!openImport)
        handleMenuClose();
    }

    // ==========================================
    // [START] GET DATA & PAGINATION
    // ==========================================
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [isMaxData, setMaxData] = useState(1)
    
    const [search, setSearch] = useState("")
    function searchData(search) {
        setPage(1)
        setSearch(search)
    }
    
    const [isLoading, setLoading] = useState(false)
    const [vendors, setVendors] = useState([])
    var vendorSwr = getListVendorSwr({
        search: search, 
        page: page, 
        limit: 20,
        orderBy: 'vendor_name',
        order: 'asc',
        isAccepted: true,
        pendingAcceptance: false,
    })
    useEffect(() => {
        setLoading(vendorSwr?.isLoading)
        if(vendorSwr?.data?.result) {
            if(page == 1) {
                var until = vendorSwr?.data?.until
                setTotal(vendorSwr?.data?.total)
                setVendors(vendorSwr?.data?.result)
                setMaxData(until == total)
            } else {
                var until = vendorSwr?.data?.until
                var tempList = vendors
                vendorSwr?.data?.result?.forEach((item, index) => {
                    var find = vendors?.findIndex((val) => val?.id == item?.id)
                    if(find < 0) tempList.push(item)
                })
                setTotal(vendorSwr?.data?.total)
                setVendors(tempList)
                setMaxData(until == total)
            }
        }
    }, [vendorSwr])
    // ==========================================
    // [END] GET DATA & PAGINATION
    // ==========================================

    return (
        <BaseLayoutProduct title={props?.title}>
            <Grid container>
                <Grid item lg={2}>
                    <div className="sidebar-wrapper">
                        <div className="sidebar-header">
                            <div className="sidebar-title mb-3">
                                <h2>Vendors</h2>
                                <IconButton 
                                    className="icon"
                                    size="small"
                                    onClick={handleProfileMenuOpen}>
                                    <Icon>more_vert</Icon>
                                </IconButton>
                            </div>
                            <SearchBar onSearch={(search) => searchData(search)} isLoading={isLoading} />
                        </div>
                        {!vendors && "Loading"}
                        {vendors && <div className="sidebar-content list pb-5">
                            {vendors?.map((val, i) => {
                                return <VendorItem key={val?.id} data={val}/>
                            })}
                            {isLoading && <Grid
                                container
                                spacing={0}
                                direction="column"
                                alignItems="center"
                                justify="center"
                                className="p-3">
                                <CircularProgressCustom size={20} />
                            </Grid>}
                            {(!isMaxData && !isLoading) && <div className="p-2">
                                <Button
                                    size="small"
                                    variant="contained"
                                    disableElevation
                                    fullWidth
                                    onClick={() => setPage(page+1)}>
                                    Load More
                                </Button>
                            </div>}
                        </div>}
                    </div>
                </Grid>
                <Grid item lg={10}>
                    <div className="p-5 content-wrapper">
                        {props?.children}
                    </div>
                </Grid>
            </Grid>
            {renderMenu}
            <VendorForm 
                open={openForm} 
                closeModal={() => setOpenForm(false)} 
                dataInserted={(data) => router.push(getRoute("vendor.detail", {id: data?.id}))}/>
            <VendorImport open={openImport} closeModal={() => setOpenImport(false)} />
        </BaseLayoutProduct>
    )
}