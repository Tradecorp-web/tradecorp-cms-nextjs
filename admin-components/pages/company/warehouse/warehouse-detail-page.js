import { Avatar, Button, Card, Grid, Icon, IconButton, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import AdminBaseLayout from "../../../base_layout/admin_base_layout";

export default function Page() {

    const router = useRouter()

    return <AdminBaseLayout title="Warehouse">
        <Grid container spacing={4}>
            <Grid item lg={6}>
                <div className="card mb-5">
                    <h3 className="mb-4">Depo</h3>
                    <div>
                        <Typography variant="body2" color="textSecondary">Name</Typography>
                        <Typography className="mb-3">Depo Cakung</Typography>
                        <Typography variant="body2" color="textSecondary">City</Typography>
                        <Typography className="mb-3">Jakarta</Typography>
                        <Typography variant="body2" color="textSecondary">Address</Typography>
                        <Typography className="mb-3">Jl. Rorotan Babek TNI No.2-3, RW.6, Cakung Tim., Kec. Cakung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13910</Typography>
                    </div>
                    <Button variant="contained" size="small" disableElevation><Icon style={{fontSize: 16, marginRight: 4}}>edit</Icon> Edit</Button>
                </div>
                <div className="card">
                    <div className="display-space-between mb-4">
                        <h3>Operation Officer</h3>
                        <Button variant="contained" size="small" color="secondary" disableElevation><Icon style={{fontSize: 20, marginRight: 4}}>add</Icon> Add Officer</Button>
                    </div>
                    <Card className="display-space-between p-2 mb-3" variant="outlined">
                        <div className="flex-center">
                            <Avatar className="account-button me-3" alt="Admin" src="https://tradecorp-bucket.s3-ap-southeast-1.amazonaws.com/test/2ceee68afd1c98c04434552bba961ad1202110152810tradecorp-logo.jpeg" />
                            <Typography>Dika</Typography>
                        </div>
                        <IconButton><Icon>close</Icon></IconButton>
                    </Card>
                    <Card className="display-space-between p-2" variant="outlined">
                        <div className="flex-center">
                            <Avatar className="account-button me-3" alt="Admin" src="https://tradecorp-bucket.s3-ap-southeast-1.amazonaws.com/test/2ceee68afd1c98c04434552bba961ad1202110152810tradecorp-logo.jpeg" />
                            <Typography>Erni</Typography>
                        </div>
                        <IconButton><Icon>close</Icon></IconButton>
                    </Card>
                </div>
            </Grid>
        </Grid>
    </AdminBaseLayout>
}