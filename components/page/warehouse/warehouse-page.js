import { Divider, Grid, Icon, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import getRoute from "../../../helpers/router";
import { currency, dateFormat, dateExpired } from "../../../helpers/general";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { CircularProgressCustom } from "../../base_component/spinner";
import BaseLayoutWarehouse from "../../base_layout/base-layout-warehouse";
import { getListPurchaseOrderSwr } from "../../../services/swr/po.swr";
import { Link } from "@material-ui/core";

export default function Page() {

    const router = useRouter();

    function openPage(e, url) {
        e.preventDefault()
        router.push(url)
    }

    return <BaseLayoutWarehouse title="Material In">
        <div className="p-5">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} md={10} lg={10} xl={6}>
                    <h1 className="mb-5">Warehouse Menu</h1>
                    <Divider />
                    <Grid container className="page-container mt-5" spacing={5}>
                        <Grid item xs={12} md={3}>
                            <Link href={getRoute("warehouse.list")} onClick={(e) => openPage(e, getRoute("warehouse.list"))}>
                                <div className="card">
                                    <div className="icon-wrapper mb-3">
                                        <Icon>holiday_village</Icon>
                                    </div>
                                    <h2 className="mb-2">Manage</h2>
                                    <Typography variant="body2">You can manage warehouses for material storing</Typography>
                                </div>
                            </Link>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Link href={getRoute("warehouse.stock")} onClick={(e) => openPage(e, getRoute("warehouse.stock"))}>
                                <div className="card">
                                    <div className="icon-wrapper mb-3">
                                        <Icon>inventory_2</Icon>
                                    </div>
                                    <h2 className="mb-2">Stock Material</h2>
                                    <Typography variant="body2">You can see where the stock material is stored</Typography>
                                </div>
                            </Link>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Link href={getRoute("warehouse.material.in")} onClick={(e) => openPage(e, getRoute("warehouse.material.in"))}>
                                <div className="card">
                                    <div className="icon-wrapper mb-3">
                                        <Icon>vertical_align_bottom</Icon>
                                    </div>
                                    <h2 className="mb-2">Material In</h2>
                                    <Typography variant="body2">You can update material stock data that enters the warehouse</Typography>
                                </div>
                            </Link>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Link href={getRoute("warehouse.material.out")} onClick={(e) => openPage(e, getRoute("warehouse.material.out"))}>
                                <div className="card">
                                    <div className="icon-wrapper mb-3">
                                        <Icon>upgrade</Icon>
                                    </div>
                                    <h2 className="mb-2">Material Out</h2>
                                    <Typography variant="body2">You can update material stock data released from the warehouse</Typography>
                                </div>
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    </BaseLayoutWarehouse>
}