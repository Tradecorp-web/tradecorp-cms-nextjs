import { Icon, IconButton, Link, Menu, MenuItem, Typography } from "@material-ui/core";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import getRoute from "../../../helpers/router";
import { currency, dateExpired } from "../../../helpers/general";

export default function MaterialItem(props) {

    const router = useRouter()
    const productId = router.query.id
    const urlDetail = getRoute("product.detail", {id: props?.data?.id})
    const isActive = productId == props?.data?.id

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
        console.log(urlDetail)
        if(!(isActive)) {
            handleMenuClose()
            e.preventDefault()
            router.push(urlDetail);
        }
    }

    const [isWarning, setWarning] = useState(false)

    useEffect(() => {
        setWarning(
            dateExpired(props?.data?.expiration_date) ||
            props?.data?.stock < props?.data?.minimum_level_stock
        )
    }, [])

    return (
        <div className={"stock-container-item " + (isActive ? "active" : "")}>
            <Link 
                href={!(isActive) ? urlDetail : "#"} 
                onClick={(e) => openDetailPage(e)}>
                <div>
                    <div >
                        <Typography variant="body2">
                            {props?.data?.name}
                        </Typography>
                    </div>
                    <div>
                        <small>
                            {props?.data?.code} | {currency(props?.data?.price)}
                        </small>
                    </div>
                </div>
            </Link>
            {isWarning && <Icon style={{fontSize: 16, marginLeft: 8, color: "red"}}>warning</Icon>}
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