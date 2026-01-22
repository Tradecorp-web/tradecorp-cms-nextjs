import { Grid, Icon, IconButton, Button, Menu, MenuItem } from "@material-ui/core";
import { fade, makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import BaseLayoutVehicle from "../../base_layout/base-layout-vehicle";
import VehicleItem from "./vehicle-item";
import SearchBar from "../../base_component/searchbar";
import { getListlistSwr } from "../../../services/swr/product.swr";
import { CircularProgressCustom } from "../../base_component/spinner";
import VehicleForm from "./vehicle-form";
import { getListVehicleSwr } from "../../../services/swr/vehicle.swr";

const useStyles = makeStyles((theme) => ({
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey,
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      width: '100%',
    },
    searchIcon: {
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
}));

export default function VehicleLayout(props) {
    const classes = useStyles()

    const router = useRouter()
    const depoSlug = router.query.depoSlug

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
    const [listData, setListData] = useState([])
    var listSwr = getListVehicleSwr({
        search: search, 
        page: page, 
        limit: 20,
        orderBy: 'name',
        order: 'asc',
    })
    useEffect(() => {
        setLoading(listSwr?.isLoading)
        if(listSwr?.data?.result) {
            if(page == 1) {
                var until = listSwr?.data?.until
                setTotal(listSwr?.data?.total)
                setListData(listSwr?.data?.result)
                setMaxData(until == total)
            } else {
                var until = listSwr?.data?.until
                var tempList = listData
                listSwr?.data?.result?.forEach((item, index) => {
                    var find = listData?.findIndex((val) => val?.id == item?.id)
                    if(find < 0) tempList.push(item)
                })
                setTotal(listSwr?.data?.total)
                setListData(tempList)
                setMaxData(until == total)
            }
        }
    }, [listSwr])
    // ==========================================
    // [END] GET DATA & PAGINATION
    // ==========================================

    return (
        <BaseLayoutVehicle title={props?.title}>
            <Grid container>
                <Grid item lg={2}>
                    <div className="sidebar-wrapper">
                        <div className="sidebar-header">
                            <div className="sidebar-title mb-3">
                                <h2>Vehicles</h2>
                                <IconButton 
                                    className="icon"
                                    size="small"
                                    onClick={handleProfileMenuOpen}>
                                    <Icon>more_vert</Icon>
                                </IconButton>
                            </div>
                            <SearchBar onSearch={(search) => searchData(search)} isLoading={isLoading} />
                        </div>
                        {!listData && "Loading"}
                        {listData && <div className="sidebar-content list pb-5">
                            {listData?.map((val, i) => {
                                return <VehicleItem key={val?.id} data={val}/>
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
            <VehicleForm 
                open={openForm} 
                closeModal={() => setOpenForm(false)} 
                dataInserted={(data) => router.push(getRoute("product.detail", {id: data?.id}))}/>
        </BaseLayoutVehicle>
    )
}