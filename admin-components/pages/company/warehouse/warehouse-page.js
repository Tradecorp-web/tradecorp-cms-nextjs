import { Avatar, Button, Grid, Icon, IconButton, InputBase, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import getRoute from "../../../../helpers/router";
import AdminBaseLayout from "../../../base_layout/admin_base_layout";

function createData(name, location) {
    return { name, location };
}

const rows = [
    createData('Warehouse A', 'Jakarta, Indonesia'),
    createData('Warehouse B', 'Kalimantan, Indonesia'),
];

export default function Page() {

    const router = useRouter()

    return <AdminBaseLayout title="Warehouse">
        <Grid container spacing={4}>
            <Grid item lg={6}>
                <Button 
                    color="secondary" 
                    variant="contained" 
                    disableElevation 
                    className="mb-4"
                    onClick={(e) => router.push(getRoute("admin.company.warehouse.add"))}>
                    <Icon>add</Icon> Add Warehouse
                </Button>
                <div className="card no-padding">
                    <TableContainer>
                        <Table aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Warehouse</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows.map((row, key) => (
                                <TableRow key={key}>
                                    <TableCell>{key+1}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.location}</TableCell>
                                    <TableCell>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Grid>
        </Grid>
    </AdminBaseLayout>
}