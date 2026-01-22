import { Grid, Icon, IconButton, Button, Menu, MenuItem } from "@material-ui/core";
import { fade, makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import BaseLayoutDriver from "../../base_layout/base-layout-driver";
import DriverJobItem from "./driver-job-item";
import DriverForm from "./driver-job-form";
import SearchBar from "../../base_component/searchbar";
import { getListDriverSwr } from "../../../services/swr/driver.swr";
import { CircularProgressCustom } from "../../base_component/spinner";
import { getListDriverJobSwr } from "../../../services/swr/driver-job.swr";

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

export default function DriverJobLayout(props) {
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
            <MenuItem onClick={() => toggleOpenForm()}>Add Driver</MenuItem>
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
    const [drivers, setData] = useState([])
    var dataSwr = getListDriverJobSwr({
        search: search, 
        page: page, 
        limit: 20,
        orderBy: 'created_at',
        order: 'asc',
    })
    useEffect(() => {
        setLoading(dataSwr?.isLoading)
        if(dataSwr?.data?.result) {
            if(page == 1) {
                var until = dataSwr?.data?.until
                setTotal(dataSwr?.data?.total)
                setData(dataSwr?.data?.result)
                setMaxData(until == total)
            } else {
                var until = dataSwr?.data?.until
                var tempList = drivers
                dataSwr?.data?.result?.forEach((item, index) => {
                    var find = drivers?.findIndex((val) => val?.id == item?.id)
                    if(find < 0) tempList.push(item)
                })
                setTotal(dataSwr?.data?.total)
                setData(tempList)
                setMaxData(until == total)
            }
        }
    }, [dataSwr])
    // ==========================================
    // [END] GET DATA & PAGINATION
    // ==========================================

    return (
        <BaseLayoutDriver title={props?.title}>
            <Grid container>
                <Grid item md={4} lg={2}>
                    <div className="sidebar-wrapper">
                        <div className="sidebar-header">
                            <div className="sidebar-title mb-3">
                                <h2>Driver Jobs</h2>
                                <IconButton 
                                    className="icon"
                                    size="small"
                                    onClick={handleProfileMenuOpen}>
                                    <Icon>more_vert</Icon>
                                </IconButton>
                            </div>
                            <SearchBar onSearch={(search) => searchData(search)} isLoading={isLoading} />
                        </div>
                        {!drivers && "Loading"}
                        {drivers && <div className="sidebar-content list pb-5">
                            {drivers?.map((val, i) => {
                                return <DriverJobItem key={val?.id} data={val}/>
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
                <Grid item md={8} lg={10}>
                    <div className="p-5 content-wrapper">
                        {props?.children}
                    </div>
                </Grid>
            </Grid>
            {renderMenu}
            <DriverForm 
                open={openForm} 
                closeModal={() => setOpenForm(false)} 
                dataInserted={(data) => router.push(getRoute("product.detail", {id: data?.id}))}/>
        </BaseLayoutDriver>
    )
}