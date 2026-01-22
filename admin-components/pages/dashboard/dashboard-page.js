import { Card, Grid, Icon, Link } from "@material-ui/core";
import AdminBaseLayout from "../../base_layout/admin_base_layout";

export default function Page(props) {
    return <AdminBaseLayout title="Dashboard">
        <Grid container spacing={4}>
            <Grid item lg={3}>
                <Link>
                    <div className="card card-hover mb-3">
                        <h4 className="mb-3">Depo Cakung</h4>
                        <div className="flex-center">
                            <Icon className="me-2" style={{color: "#666"}}>view_quilt</Icon>
                            <small className="text-muted">
                                400 Container Stocks
                            </small>
                        </div>
                    </div>
                </Link>
                <Link>
                    <div className="card card-hover mb-3">
                        <h4 className="mb-3">Depo Balikpapan</h4>
                        <div className="flex-center">
                            <Icon className="me-2" style={{color: "#666"}}>view_quilt</Icon>
                            <small className="text-muted">
                                600 Container Stocks
                            </small>
                        </div>
                    </div>
                </Link>
            </Grid>
        </Grid>
    </AdminBaseLayout>
}