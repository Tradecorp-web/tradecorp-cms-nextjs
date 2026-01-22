import { Button, Card, CardActionArea, Container, Divider, Grid, Icon, Link, TextField, Typography } from "@material-ui/core";
import BaseLayout from "../../base_layout/base-layout";

export default function DepoPage() {
    return <BaseLayout title="Depo">
        <Container className="pt-5 pb-5 mt-5 mb-5">
            <Grid container justify="center">
                <Grid item lg={6}>
                    <div className="display-space-between">
                        <h1 className="mb-3">Add New Depo</h1>
                    </div>
                    <Divider />
                    <div className="mt-5 pt-3">
                        <TextField
                            id="standard-number"
                            label="Depo Name"
                            className="mb-5"
                            placeholder="Enter Depo Name"
                            type="text"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }} />
                        <TextField
                            id="standard-number"
                            label="Address"
                            className="mb-5"
                            placeholder="Enter Depo Address"
                            type="text"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }} />
                        <TextField
                            id="standard-number"
                            label="City"
                            className="mb-5"
                            placeholder="Enter City Name"
                            type="text"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }} />
                        <Button
                            variant="contained"
                            disableElevation
                            className="ps-3 pe-3"
                            color="primary">
                            Add Depo
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </Container>
    </BaseLayout>
}