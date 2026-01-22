import { Icon, IconButton, Link, Menu, MenuItem, Typography } from "@material-ui/core";
import React from 'react';
import { useRouter } from 'next/router'
import getRoute from "../../../../helpers/router";

export default function EirInItem(props) {

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
            <MenuItem onClick={(e) => openDetailContainer(e)}>View</MenuItem>
            <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        </Menu>
    );

    function openDetailContainer(e) {
        if(!(props?.active)) {
            handleMenuClose()
            e.preventDefault()
            router.push(getRoute("depo.eir.in.detail", {depoSlug: depoSlug, eirNo: props?.data?.id}))
        }
    }

    return (
        <div className={"stock-container-item " + (props?.active ? "active" : "")}>
            <Link 
                href={!(props?.active) ? getRoute("depo.eir.in.detail", {depoSlug: depoSlug, eirNo: props?.data?.id}) : "#"} 
                onClick={(e) => openDetailContainer(e)}>
                <div>
                    <div>
                        <strong>
                            {props.data.id} - TIHU12345432
                        </strong>
                    </div>
                    <div>
                        <small>
                            20 May 2021 at 13:00 PM
                        </small>
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