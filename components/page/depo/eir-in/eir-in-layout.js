import { Grid, Icon, IconButton, InputBase, Link, Menu, MenuItem, Paper, Typography } from "@material-ui/core";
import BaseLayoutDepo from "../../../base_layout/base-layout-depo";
import { fade, makeStyles } from '@material-ui/core/styles';
import EirInItem from "./eir-in-item";
import React, { useState } from 'react';
import useSWR from "swr";
import { useRouter } from "next/router";
import getRoute from "../../../../helpers/router";

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

export default function EirInLayout(props) {
    const router = useRouter()
    const depoSlug = router.query.depoSlug

    function toCreatePage(e) {
        e.preventDefault()
        router.push(getRoute("depo.do.release.create", {depoSlug: depoSlug}))
    }

    const [searchInput, setSearchInput] = useState("")

    const fetcher = () => fetch(`https://www.pintarkomputer.com/wp-json/wp/v2/posts`).then(res => res.json())
    const { data, err } = useSWR("posts",  fetcher)

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
            <MenuItem onClick={(e) => toCreatePage(e)}>Create EIR IN</MenuItem>
        </Menu>
    );
    const sideBar = (
        <div className="sidebar-wrapper">
            <div className="sidebar-header">
                <div className="sidebar-title mb-3">
                    <h2>EIR IN</h2>
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
            {!data && "Loading"}
            {data && <div className="sidebar-content list">
                {data?.map((val, i) => {
                    return <EirInItem 
                        data={val} 
                        active={val.id == props?.eirNo}/>
                })}
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
                    <div className="p-5">
                        {props?.children}
                    </div>
                </Grid>
            </Grid>
            {renderMenu}
        </BaseLayoutDepo>
    )
}