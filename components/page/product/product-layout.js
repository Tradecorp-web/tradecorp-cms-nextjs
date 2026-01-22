import { Grid, Icon, IconButton, Button, Menu, MenuItem } from "@material-ui/core";
import { fade, makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import BaseLayoutProduct from "../../base_layout/base-layout-product";
import ProductItem from "./product-item";
import ProductForm from "./product-form";
import SearchBar from "../../base_component/searchbar";
import { getListProductSwr } from "../../../services/swr/product.swr";
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

export default function ProductLayout(props) {
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
            <MenuItem onClick={() => toggleOpenForm()}>Add Product</MenuItem>
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
    const [products, setProducts] = useState([])
    var productSwr = getListProductSwr({
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
                setProducts(productSwr?.data?.result)
                setMaxData(until == total)
            } else {
                var until = productSwr?.data?.until
                var tempList = products
                productSwr?.data?.result?.forEach((item, index) => {
                    var find = products?.findIndex((val) => val?.id == item?.id)
                    if(find < 0) tempList.push(item)
                })
                setTotal(productSwr?.data?.total)
                setProducts(tempList)
                setMaxData(until == total)
            }
        }
    }, [productSwr])
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
                                <h2>Products</h2>
                                <IconButton 
                                    className="icon"
                                    size="small"
                                    onClick={handleProfileMenuOpen}>
                                    <Icon>more_vert</Icon>
                                </IconButton>
                            </div>
                            <SearchBar onSearch={(search) => searchData(search)} isLoading={isLoading} />
                        </div>
                        {!products && "Loading"}
                        {products && <div className="sidebar-content list pb-5">
                            {products?.map((val, i) => {
                                return <ProductItem key={val?.id} data={val}/>
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
            <ProductForm 
                open={openForm} 
                closeModal={() => setOpenForm(false)} 
                dataInserted={(data) => router.push(getRoute("product.detail", {id: data?.id}))}/>
        </BaseLayoutProduct>
    )
}