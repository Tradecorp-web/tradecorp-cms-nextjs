import { Icon, IconButton, Link, Menu, MenuItem, Typography } from "@material-ui/core";
import React from 'react';
import { useRouter } from 'next/router'
import getRoute from "../../../helpers/router";

export default function VendorItem(props) {

    const router = useRouter()
    const vendorId = router.query.id
    const urlDetail = getRoute("vendor.detail", {id: props?.data?.id})
    const isActive = vendorId == props?.data?.id

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
            <MenuItem onClick={(e) => openDetailPage(e)}>View</MenuItem>
            <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        </Menu>
    );

    function openDetailPage(e) {
        if(!(isActive)) {
            handleMenuClose()
            e.preventDefault()
            router.push(urlDetail);
        }
    }

    return (
        <div className={"stock-container-item " + (isActive ? "active" : "")}>
            <Link 
                href={!(isActive) ? urlDetail : "#"} 
                onClick={(e) => openDetailPage(e)}>
                <div>
                    <Typography variant="body2">
                        {props?.data?.vendor_name}
                    </Typography>
                    <div>
                        <small>{props?.data?.vendor_phone}</small>
                    </div>
                </div>
            </Link>
            <IconButton 
                className="icon"
                size="small"
                onClick={handleProfileMenuOpen}>
                <Icon fontSize="small">more_vert</Icon>
            </IconButton>
            {renderMenu}
        </div>
    )
}