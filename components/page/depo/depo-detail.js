import { Button, Card, MenuItem, Container, Divider, Grid, Icon, Link, Menu, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { depoData } from "../../../helpers/data-dummy";
import getRoute from "../../../helpers/router";
import { getDetailDepoApi } from "../../../services/api/depo.api";
import { getDepoNewsSwr, getDetailDepoSwr } from "../../../services/swr/depo.swr";
import BaseLayoutDepo from "../../base_layout/base-layout-depo";

const DepoDetail = () => {

    const router = useRouter()
    function linkToPage(e, routerSlug) {
        e.preventDefault()
        router.push(routerSlug)
    }
    
    const depoSlug = router.query.depoSlug
    const stockUrl = getRoute("depo.stock", {depoSlug: depoSlug})
    const doAcceptanceUrl = getRoute("depo.do.accept", {depoSlug: depoSlug})
    const doReleaseUrl = getRoute("depo.do.release", {depoSlug: depoSlug})
    const eirInUrl = getRoute("depo.eir.in", {depoSlug: depoSlug})
    const eirOutUrl = getRoute("depo.eir.out", {depoSlug: depoSlug})
    const settingUrl = getRoute("depo.settings.layout", {depoSlug: depoSlug})

    const [anchorEl, setAnchorEl] = useState(null)
    const isMenuOpen = Boolean(anchorEl)
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null)
    }
    const handleMenuClose = () => {
        setAnchorEl(null)
    }
    const menuId = 'menu-item'
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
            <MenuItem onClick={(e) => handleMenuClose()}>This week</MenuItem>
            <MenuItem onClick={(e) => handleMenuClose()}>Last week</MenuItem>
            <MenuItem onClick={(e) => handleMenuClose()}>This month</MenuItem>
            <MenuItem onClick={(e) => handleMenuClose()}>3 months ago</MenuItem>
            <MenuItem onClick={(e) => handleMenuClose()}>6 months ago</MenuItem>
            <MenuItem onClick={(e) => handleMenuClose()}>This years</MenuItem>
        </Menu>
    )
    
    var [isLoading, setLoading] = useState(true)

    const [depo, setDepo] = useState(null)
    const depoSwr = getDetailDepoSwr(router.query.depoSlug)
    useEffect(() => {
        setDepo(depoSwr.data)
    }, [depoSwr.data])

    return <BaseLayoutDepo title={depo?.name ?? ""}>
        <Container className="pt-5 pb-5">
            <Typography variant="h1" gutterBottom>{depo?.name ?? ""}</Typography>
            <Typography variant="body1" color="textSecondary" className="mb-3">{depo?.address ?? ""}</Typography>
            <Divider />
            <Grid container className="mt-5" spacing={4}>
                <Grid item lg={6}>
                    {/* <Card className="mb-5 p-4 container-stock" variant="outlined">
                        <div className="display-space-between mb-3">
                            <div>
                                <Typography variant="h3" className="title pb-0 mb-0 m-0 p-0" gutterBottom>Container Stocks</Typography>
                                <Typography variant="body2" color="textSecondary" className="mt-1">Stock of containers that are still available</Typography>
                            </div>
                        </div>
                        <Grid container>
                            <Grid item lg={4}>
                                <div><small>Sale Stock</small></div>
                                <strong style={{fontSize: 30}}>400</strong>
                            </Grid>
                            <Grid item lg={4}>
                                <div><small>Hold</small></div>
                                <strong style={{fontSize: 30}}>70</strong>
                            </Grid>
                            <Grid item lg={4}>
                                <div><small>On Hire</small></div>
                                <strong style={{fontSize: 30}}>100</strong>
                            </Grid>
                        </Grid>
                        <Link href={stockUrl} onClick={(e) => linkToPage(e, stockUrl)} className="flex-center mt-3 text-link view-button">
                            <span className="me-2">View All</span>
                            <Icon style={{fontSize: 16}}>arrow_forward</Icon>
                        </Link>
                    </Card> */}
                    <Card className="mb-5 p-4 container-stock" variant="outlined">
                        <div className="display-space-between mb-3">
                            <div>
                                <Typography variant="h3" className="title pb-0 mb-0 m-0 p-0" gutterBottom>Depo Layout</Typography>
                                <Typography variant="body2" color="textSecondary" className="mt-1">You can change the depot layout image on the settings page</Typography>
                            </div>
                        </div>
                        <img src="/images/depo-layout.png" style={{width: "100%"}} />
                        <Link href={settingUrl} onClick={(e) => linkToPage(e, settingUrl)} className="flex-center mt-3 text-link view-button">
                            <span className="me-2">Edit Image</span>
                            <Icon style={{fontSize: 16}}>edit</Icon>
                        </Link>
                    </Card>
                </Grid>
                <Grid item lg={6}>
                    <Card className="p-4 container-stock mb-5" variant="outlined">
                        <div className="display-space-between mb-3">
                            <div>
                                <Typography variant="h3" className="title pb-0 mb-0 m-0 p-0" gutterBottom>Depo Information</Typography>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="mb-1"><small className="text-muted">Address</small></div>
                            <div>{depo?.address}</div>
                        </div>
                        <div className="mb-3">
                            <div className="mb-1"><small className="text-muted">City</small></div>
                            <div>{depo?.city}</div>
                        </div>
                        <div className="mb-3">
                            <div className="mb-1"><small className="text-muted">Contact Person</small></div>
                            {depo?.cp?.map(cp => (
                                <div>{cp?.name} / {cp?.telp}</div>
                            ))}
                        </div>
                    </Card>
                    <div className="display-space-between mb-2">
                        <Typography variant="h2">Summary</Typography>
                        <Button
                            color="secondary"
                            variant="contained"
                            disableElevation
                            onClick={handleMenuOpen}>
                            <Typography variant="body">This Month</Typography>
                            <Icon style={{fontSize: 20}}>expand_more</Icon>
                        </Button>
                    </div>
                    <Divider className="mb-5" />
                    <Card className="mb-5 p-4 container-stock" variant="outlined">
                        <div className="display-space-between mb-3">
                            <div>
                                <Typography variant="h3" className="title pb-0 mb-0 m-0 p-0" gutterBottom>Delivery Order</Typography>
                                <Typography variant="body2" color="textSecondary" className="mt-1">The number of delivery orders that have been made</Typography>
                            </div>
                        </div>
                        <Grid container>
                            <Grid item lg={4}>
                                <Link href={doReleaseUrl} onClick={(e) => linkToPage(e, doReleaseUrl)}>
                                    <div><small>DO Release</small></div>
                                    <strong style={{fontSize: 30}}>400</strong>
                                </Link>
                            </Grid>
                            <Grid item lg={4}>
                                <Link href={doAcceptanceUrl} onClick={(e) => linkToPage(e, doAcceptanceUrl)}>
                                    <div><small>DO Acceptance</small></div>
                                    <strong style={{fontSize: 30}}>70</strong>
                                </Link>
                            </Grid>
                        </Grid>
                    </Card>
                    <Card className="p-4 container-stock" variant="outlined">
                        <div className="display-space-between mb-3">
                            <div>
                                <Typography variant="h3" className="title pb-0 mb-0 m-0 p-0" gutterBottom>EIR</Typography>
                                <Typography variant="body2" color="textSecondary" className="mt-1">The number of EIR that have been made</Typography>
                            </div>
                        </div>
                        <Grid container>
                            <Grid item lg={4}>
                                <Link href={eirInUrl} onClick={(e) => linkToPage(e, eirInUrl)}>
                                    <div><small>EIR IN</small></div>
                                    <strong style={{fontSize: 30}}>400</strong>
                                </Link>
                            </Grid>
                            <Grid item lg={4}>
                                <Link href={eirOutUrl} onClick={(e) => linkToPage(e, eirOutUrl)}>
                                    <div><small>EIR OUT</small></div>
                                    <strong style={{fontSize: 30}}>70</strong>
                                </Link>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Container>
        {renderMenu}
        <style jsx>{`
            .container-stock .sale-stock {
                display: flex;
                align-items: flex-start;
                padding: 16px;
                border: 1px solid #DDD;
                border-radius: 8px;
                flex-direction: column;
            }
            .container-stock .sale-stock strong {
                font-size: 30px;
            }
            .view-button span {
                font-size: 12px;
            }
        `}</style>
    </BaseLayoutDepo>
}

export default DepoDetail