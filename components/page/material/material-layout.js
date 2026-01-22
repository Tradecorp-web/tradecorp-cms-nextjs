import { Button, Grid, Icon, IconButton, InputBase, Menu, MenuItem } from "@material-ui/core";
import { fade, makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import useSWR from "swr";
import { useRouter } from "next/router";
import { getListMaterialSwr } from "../../../services/swr/material.swr";
import BaseLayoutProduct from "../../base_layout/base-layout-product";
import MaterialItem from "./material-item";
import MaterialForm from "./material-form";
import MaterialImport from "./material-import";
import { CircularProgressCustom } from "../../base_component/spinner";
import getRoute from "../../../helpers/router";
import SearchBar from "../../base_component/searchbar";

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

export default function MaterialLayout(props) {
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
            <MenuItem onClick={() => toggleOpenForm()}>Add Material</MenuItem>
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
    const [materials, setMaterials] = useState([])
    var materialSwr = getListMaterialSwr({
        search: search, 
        page: page, 
        limit: 20,
        orderBy: 'vendor_name',
        order: 'asc',
        isAccepted: true,
        pendingAcceptance: false,
    })
    useEffect(() => {
        setLoading(materialSwr?.isLoading)
        if(materialSwr?.data?.result) {
            if(page == 1) {
                var until = materialSwr?.data?.until
                setTotal(materialSwr?.data?.total)
                setMaterials(materialSwr?.data?.result)
                setMaxData(until == total)
            } else {
                var until = materialSwr?.data?.until
                var tempList = materials
                materialSwr?.data?.result?.forEach((item, index) => {
                    var find = materials?.findIndex((val) => val?.id == item?.id)
                    if(find < 0) tempList.push(item)
                })
                setTotal(materialSwr?.data?.total)
                setMaterials(tempList)
                setMaxData(until == total)
            }
        }
    }, [materialSwr])
    // ==========================================
    // [END] GET DATA & PAGINATION
    // ==========================================

    return (
        <BaseLayoutProduct title={props?.title}>
            <Grid container>
                <Grid item md={3} lg={2}>
                    <div className="sidebar-wrapper">
                        <div className="sidebar-header">
                            <div className="sidebar-title mb-3">
                                <h2>Materials</h2>
                                <IconButton 
                                    className="icon"
                                    size="small"
                                    onClick={handleProfileMenuOpen}>
                                    <Icon>more_vert</Icon>
                                </IconButton>
                            </div>
                            <SearchBar onSearch={(search) => searchData(search)} isLoading={isLoading} />
                        </div>
                        {!materials && "Loading"}
                        {materials && <div className="sidebar-content list pb-5">
                            {materials?.map((val, i) => {
                                return <MaterialItem key={val?.id} data={val}/>
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
                <Grid item md={9} lg={10}>
                    <div className="p-5 content-wrapper">
                        {props?.children}
                    </div>
                </Grid>
            </Grid>
            {renderMenu}
            <MaterialForm 
                open={openForm} 
                closeModal={() => setOpenForm(false)} 
                dataInserted={(data) => router.push(getRoute("material.detail", {id: data?.id}))}/>
            <MaterialImport open={openImport} closeModal={() => setOpenImport(false)} />
        </BaseLayoutProduct>
    )
}