import { Typography, Card, Grid, Avatar, Icon, Button, Link } from "@material-ui/core";
import { useEffect, useState } from "react";
import DriverJobLayout from "./driver-job-layout";
import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";
import DriverForm from "./driver-job-form";
import { updateDriverApi } from "../../../services/api/driver.api";
import { getDetailDriverJobSwr } from "../../../services/swr/driver-job.swr";
import { dateTimeFormat, urlPhoto } from "../../../helpers/general";
import MapLayer from "../../base_component/map-layer";

export default function DriverDetail(props) {

    const router = useRouter()
    const driverId = router.query.id

    const [driverJob, setDriverJob] = useState(null)
    const driverJobSwr = getDetailDriverJobSwr(driverId)
    useEffect(() => {
        setDriverJob(driverJobSwr.data)
        console.log(driverJobSwr.data)
    }, [driverJobSwr.data])

    const [openFormEdit, setOpenFormEdit] = useState(false)

    function updateData() {
        updateDriverApi(driver, driver?.id).then((res) => {
            setDriverJob(res)
        })
    }

    return (
        <DriverJobLayout title={driverJob?.name}>
            <Grid container spacing={3}>
                <Grid item md={12} lg={6}>
                    <div className="p-4 mb-5 card">
                        <div className="display-space-between mb-3">
                            <h3>Driver Job</h3>
                            <Button
                                variant="outlined" 
                                size="small"
                                onClick={() => setOpenFormEdit(true)}
                                color="default">
                                <Icon className="me-2">edit</Icon>Edit Driver
                            </Button>
                        </div>
                        <div className="container-detail-wrapper mb-3">
                            <Grid container spacing={2} className="mt-3">
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Job Number</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{driverJob?.job_number}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Person In Charge</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1">{driverJob?.person_in_charge?.name}</Typography>
                                            <small>{driverJob?.person_in_charge?.phone_number}</small>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Status</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{driverJob?.status}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Schedule</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{dateTimeFormat(driverJob?.schedule)}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Started At</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{dateTimeFormat(driverJob?.started_at)}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Finished At</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{dateTimeFormat(driverJob?.finished_at)}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                            <div className="mb-3">
                                <div>
                                    <Typography variant="caption" color="textSecondary" gutterBottom>Deskripsi</Typography>
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>{driverJob?.description}</Typography>
                                </div>
                            </div>
                            <Grid container spacing={3} className="mt-3">
                                <Grid item md={6}>
                                    <Link href={getRoute('driver.detail', {id: driverJob?.driver_id})}>
                                        <Card className="flex-center pt-2 pb-2 pe-3 ps-3" variant="outlined">
                                            <div className="me-3">
                                                <Avatar alt={driverJob?.user?.name} src={urlPhoto(driverJob?.user?.photo)} style={{width: "40px", height: "40px"}} />
                                            </div>
                                            <div>
                                                <Typography variant="body1">{driverJob?.driver?.user?.name}</Typography>
                                                <Typography variant="caption">{driverJob?.driver?.driver_license}</Typography>
                                            </div>
                                        </Card>
                                    </Link>
                                </Grid>
                                <Grid item md={6}>
                                    <Card className="flex-center pt-2 pb-2 pe-3 ps-3" variant="outlined">
                                        <div className="me-3">
                                            <Icon style={{color: "#333", fontSize: 32}}>local_shipping</Icon>
                                        </div>
                                        <div>
                                            <Typography variant="body1">{driverJob?.vehicle?.category?.name}</Typography>
                                            <Typography variant="caption">{driverJob?.vehicle?.vehicle_registration_number}</Typography>
                                        </div>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Grid>
                <Grid item md={12} lg={6}>
                    <div className="mb-5 card no-padding">
                        <MapLayer
                            width="100%"
                            height="400px"
                            markers={[
                                {
                                    lat: driverJob?.from_lat,
                                    lng: driverJob?.from_long,
                                    icon: "http://localhost/images/markers/first_stop.png"
                                },
                                {
                                    lat: driverJob?.destination_lat,
                                    lng: driverJob?.destination_long,
                                    icon: "http://localhost/images/markers/first_stop.png"
                                }
                            ]} />
                    </div>
                </Grid>
            </Grid>

            <DriverForm 
                open={openFormEdit} 
                closeModal={() => setOpenFormEdit(false)} 
                isEdit={true}
                dataUpdated={driverJobSwr?.mutate}
                data={driverJob}/>
        </DriverJobLayout>
    )
}