import { Icon, IconButton, Link, Menu, MenuItem, Typography } from "@material-ui/core";
import React from 'react';
import { useRouter } from 'next/router'
import getRoute from "../../../../helpers/router";

export default function DoAcceptanceItem(props) {

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
            <MenuItem onClick={(e) => openDetail(e)}>View</MenuItem>
            <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        </Menu>
    );

    function openDetail(e) {
        if(!(props?.active)) {
            handleMenuClose()
            e.preventDefault()
            router.push(getRoute("depo.do.accept.detail", {depoSlug: depoSlug, id: props?.data?.id}))
        }
    }

    return (
        <div className={"stock-container-item " + (props?.active ? "active" : "")}>
            <Link 
                href={!(props?.active) ? getRoute("depo.do.accept.detail", {depoSlug: depoSlug, id: props?.data?.id}) : "#"} 
                onClick={(e) => openDetail(e)}>
                <div>
                    <div>
                        <strong>
                            {props.data?.reference_number}
                        </strong>
                    </div>
                    <div>
                        <small>
                            To {props.data?.destination?.name}
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