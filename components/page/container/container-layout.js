import { Button, Grid, Icon, IconButton, InputBase, Link, Menu, MenuItem, Paper, Typography } from "@material-ui/core";
import BaseLayoutStockContainer from "../../base_layout/base-layout-stock-container";
import { fade, makeStyles } from '@material-ui/core/styles';
import StockContainerItem from "./container-item";
import React, { useEffect, useState } from 'react';
import useSWR from "swr";
import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";
import { getListContainerStockSwr } from "../../../services/swr/container-stock.swr";
import { CircularProgressCustom } from "../../base_component/spinner";

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

export default function StockContainerLayout(props) {
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
    const [dataList, setDataList] = useState([])
    var dataListSwr = getListContainerStockSwr({
        search: search, 
        page: page, 
        limit: 20,
        orderBy: 'serial_number',
        order: 'asc',
    })
    useEffect(() => {
        setLoading(dataListSwr?.isLoading)
        if(dataListSwr?.data?.result) {
            if(page == 1) {
                var until = dataListSwr?.data?.until
                setTotal(dataListSwr?.data?.total)
                setDataList(dataListSwr?.data?.result)
                setMaxData(until == total)
            } else {
                var until = dataListSwr?.data?.until
                var tempList = dataList
                dataListSwr?.data?.result?.forEach((item, index) => {
                    var find = dataList?.findIndex((val) => val?.id == item?.id)
                    if(find < 0) tempList.push(item)
                })
                setTotal(dataListSwr?.data?.total)
                setDataList(tempList)
                setMaxData(until == total)
            }
        }
    }, [dataListSwr])
    // ==========================================
    // [END] GET DATA & PAGINATION
    // ==========================================

    return (
        <BaseLayoutStockContainer title={props?.title}>
            <Grid container>
                <Grid item md={3} lg={2}>
                    <div className="sidebar-wrapper">
                        <div className="sidebar-header">
                            <div className="sidebar-title mb-3">
                                <h2>Container Stocks</h2>
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
                        {!dataList && "Loading"}
                        {dataList && <div className="sidebar-content list pb-5">
                            {dataList?.map((val, i) => {
                                return <StockContainerItem 
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
                </Grid>
                <Grid item md={9} lg={10}>
                    <div className="p-5">
                        {props?.children}
                    </div>
                </Grid>
            </Grid>
            {renderMenu}
        </BaseLayoutStockContainer>
    )
}