import { Button, Grid, Icon, IconButton, InputBase, Link, Menu, MenuItem, Paper, Typography } from "@material-ui/core";
import BaseLayoutDepo from "../../../base_layout/base-layout-depo";
import { fade, makeStyles } from '@material-ui/core/styles';
import DoAcceptanceItem from "./do-acceptance-item";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import getRoute from "../../../../helpers/router";
import { getListDOAcceptanceSwr } from "../../../../services/swr/do-acceptance.swr";
import { CircularProgressCustom } from "../../../base_component/spinner";

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

export default function DoAcceptanceLayout(props) {
    const classes = useStyles()

    const router = useRouter()
    const depoSlug = router.query.depoSlug

    function toCreateContainerPage(e) {
        e.preventDefault()
        router.push(getRoute("depo.stock.create", {depoSlug: depoSlug}))
    }
    
    function toImportContainerPage(e) {
        e.preventDefault()
        router.push(getRoute("depo.stock.import", {depoSlug: depoSlug}))
    }

    const [searchInput, setSearchInput] = useState("")

    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
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
            <MenuItem onClick={(e) => toCreateContainerPage(e)}>Add Container Stock</MenuItem>
            <MenuItem onClick={(e) => toImportContainerPage(e)}>Import Data</MenuItem>
        </Menu>
    );

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
    const [doAcceptances, setDoAcceptances] = useState([])
    var productSwr = getListDOAcceptanceSwr({
        search: search, 
        page: page, 
        limit: 20,
        orderBy: 'name',
        order: 'asc',
    })
    useEffect(() => {
        setLoading(productSwr?.isLoading)
        if(productSwr?.data?.result) {
            if(page == 1) {
                var until = productSwr?.data?.until
                setTotal(productSwr?.data?.total)
                setDoAcceptances(productSwr?.data?.result)
                setMaxData(until == total)
            } else {
                var until = productSwr?.data?.until
                var tempList = doAcceptances
                productSwr?.data?.result?.forEach((item, index) => {
                    var find = doAcceptances?.findIndex((val) => val?.id == item?.id)
                    if(find < 0) tempList.push(item)
                })
                setTotal(productSwr?.data?.total)
                setDoAcceptances(tempList)
                setMaxData(until == total)
            }
        }
    }, [productSwr])
    // ==========================================
    // [END] GET DATA & PAGINATION
    // ==========================================

    const sideBar = (
        <div className="sidebar-wrapper">
            <div className="sidebar-header">
                <div className="sidebar-title mb-3">
                    <h2>DO Acceptance</h2>
                    <IconButton 
                        className="icon"
                        size="small"
                        onClick={handleProfileMenuOpen}>
                        <Icon>more_vert</Icon>
                    </IconButton>
                </div>
                <div className="search-bar">
                    <InputBase
                        placeholder="Search…"
                        className="search-input"
                        renderSuffix={() => <IconButton size="small"><Icon>search</Icon></IconButton>}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        inputProps={{ 'aria-label': 'search' }}/>
                </div>
            </div>
            {!doAcceptances && "Loading"}
            {doAcceptances && <div className="sidebar-content list pb-5">
                {doAcceptances?.map((val, i) => {
                    return <DoAcceptanceItem 
                        key={val?.id} 
                        data={val}/>
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
    )

    return (
        <BaseLayoutDepo title={props?.title}>
            <Grid container>
                <Grid item lg={2}>
                    {sideBar}
                </Grid>
                <Grid item lg={10}>
                    <div className="p-5 content-wrapper">
                        {props?.children}
                    </div>
                </Grid>
            </Grid>
            {renderMenu}
        </BaseLayoutDepo>
    )
}