import { Icon, IconButton, Link, Menu, MenuItem, Typography } from "@material-ui/core";
import React from 'react';
import { useRouter } from 'next/router'
import getRoute from "../../../../helpers/router";

export default function StockContainerItem(props) {

    const router = useRouter()
    const depoSlug = router.query.depoSlug
    const urlDetail = getRoute("depo.stock.detail", {depoSlug: depoSlug, id: props.data.id})
    const containerId = router.query.serialNumber
    const isActive = containerId == props?.data?.id

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
                onClick={(e) => openDetailContainer(e)}>
                <div>
                    <div>
                        <strong>
                            {props.data.serial_number}
                        </strong>
                    </div>
                    <div>
                        <small>
                            {props?.data?.size?.name}' {props?.data?.type?.name}, <br/> {props?.data?.repair_status?.name}/{props?.data?.condition?.name} ({props?.data?.percentage ?? 0}%)
                        </small>
                    </div>
                </div>
            </Link>
            <IconButton 
                className="icon"
                size="small"
                onClick={handleProfileMenuOpen}>
                {/* <Icon fontSize="small">more_vert</Icon> */}
            </IconButton>
            {/* {renderMenu} */}
        </div>
    )
}