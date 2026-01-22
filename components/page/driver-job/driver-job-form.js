import { Avatar, Button, Card, Chip, Grid, Icon, InputBase, InputLabel, Modal, Select, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react"
import { MenuItem } from "@material-ui/core";
import { getListDriverSwr } from "../../../services/swr/driver.swr";
import { getListVehicleSwr } from "../../../services/swr/vehicle.swr";
import { CircularProgressCustom } from "../../base_component/spinner";
import { insertDriverJobApi, updateDriverJobApi } from "../../../services/api/driver-job.api";
import moment from "moment";
import MapModal from "../../base_component/map-modal";
import { urlPhoto } from "../../../helpers/general";

export default function DriverJobForm(props) {

    const [formState, setFormState] = useState(null)
    const [isOpenMap, setOpenMap] = useState(false)
    
    const [pickup, setPickup] = useState(null)
    function pickupLocation(str) {
        console.log(str)
        setOpenMap(true)
        setPickup(str)
    }
    function locationPicked(val) {
        setPickup(null)
        setFormState({...formState, [pickup]: val})
        console.log({...formState, [pickup]: val})
    }

    const [drivers, setDrivers] = useState([])
    var driverSwr = getListDriverSwr({ page: 1, limit: 200, orderBy: "name", order: "asc" })
    useEffect(() => {
        if(driverSwr?.data?.result) {
            setDrivers(driverSwr?.data?.result ?? [])
        }
    }, [driverSwr?.data?.result])
    
    const [vehicles, setVehicles] = useState([])
    var vehicleSwr = getListVehicleSwr({ page: 1, limit: 200, orderBy: "name", order: "asc" })
    useEffect(() => {
        if(vehicleSwr?.data?.result) {
            console.log(vehicleSwr?.data?.result)
            setVehicles(vehicleSwr?.data?.result ?? [])
        }
    }, [vehicleSwr?.data?.result])
    
    useEffect(() => {
        if(props?.open) {
            if(props?.isEdit) {
                setFormState({
                    jobNumber: props?.data?.job_number,
                    driver: drivers?.find((val) => val.id == props?.data?.driver_id),
                    vehicle: vehicles?.find((val) => val.id == props?.data?.vehicle_id),
                    description: props?.data?.description,
                    schedule: props?.data?.schedule,
                    startedAt: props?.data?.started_at,
                    finishedAt: props?.data?.finished_at,
                    origin: {
                        address: props?.data?.from_address,
                        location: {
                            lat: props?.data?.from_lat,
                            lng: props?.data?.from_long,
                        },
                    },
                    destination: {
                        address: props?.data?.destination_address,
                        location: {
                            lat: props?.data?.destination_lat,
                            lng: props?.data?.destination_long,
                        },
                    },
                })
            }
        }
    }, [props?.open])

    const [errorText, setErrorText] = useState(null)
    const [isLoading, setLoading] = useState(false)
    function onChangeInput(e) {
        setFormState({...formState, [e.target.name]: e.target.value})
    }

    function checkValidation() {
        var isValid = true
        return isValid
    }

    function sendData() {
        if(checkValidation()) {
            setLoading(true);
            var data =  {
                ...props?.data,
                job_number: formState?.jobNumber,
                driver_id: formState?.driver?.id,
                vehicle_id: formState?.vehicle?.id,
                person_in_charge_id: formState?.personInCharge?.id,
                description: formState?.description,
                schedule: moment(formState?.schedule),
                from_lat: formState?.origin?.location?.lat,
                from_long: formState?.origin?.location?.lng,
                from_address: formState?.origin?.address,
                destination_lat: formState?.destination?.location?.lat,
                destination_long: formState?.destination?.location?.lng,
                destination_address: formState?.destination?.address
            }
            if(props?.isEdit) {
                updateDriverJobApi(data, props?.data?.id).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataUpdated(res)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                insertDriverJobApi(data).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataInserted(res)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            }
        }
    }

    function closeModal() {
        setFormState(null)
        props?.closeModal()
    }

    return <Modal
        open={props?.open}
        onClose={() => props?.closeModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div className="modal-wrapper" style={{width: "900px"}}>
            <MapModal 
                open={isOpenMap}
                locationPicked={(val) => locationPicked(val)}
                pickupLoaction={formState != null ? formState[pickup] : null}
                closeModal={() => setOpenMap(false)} />
            <Card className="modal">
                <div className="modal-header">
                    <h3>{props?.isEdit ? "Edit Driver Job" : "Add Driver Job"}</h3>
                </div>
                <div className="modal-content">
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Job Number</Typography>
                        </InputLabel>
                        <InputBase
                            name="jobNumber"
                            color="secondary"
                            className="input"
                            value={formState?.jobNumber}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Driver</Typography>
                        </InputLabel>
                        <Select
                            labelId="demo-customized-select-label"
                            className="input"
                            placeholder="Select Driver"
                            fullWidth
                            name="driver"
                            value={formState?.driver ?? "none"}
                            onChange={onChangeInput}
                            input={<InputBase />}>
                            <MenuItem value="none"><em className="text-muted">Select Driver</em></MenuItem>
                            {drivers?.map((val, i) => {
                                return <MenuItem key={i} value={val}>
                                    <div className="flex-center">
                                        <Avatar alt="Travis Howard" src={urlPhoto(val?.user?.photo)} style={{width: "16px", height: "16px"}} />
                                        <div className="ms-2">
                                            <div>
                                                <Typography variant="body2">
                                                    {val?.user?.name}
                                                </Typography>
                                            </div>
                                            <div>
                                                <small>
                                                    {props?.data?.driver_license}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </MenuItem>
                            })}
                        </Select>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Vehicle</Typography>
                        </InputLabel>
                        <Select
                            labelId="demo-customized-select-label"
                            className="input"
                            placeholder="Select Vehicle"
                            fullWidth
                            name="vehicle"
                            value={formState?.vehicle ?? "none"}
                            onChange={onChangeInput}
                            input={<InputBase />}>
                            <MenuItem value="none"><em className="text-muted">Select Vehicle</em></MenuItem>
                            {vehicles?.map((val, i) => {
                                return <MenuItem key={i} value={val}>{val?.vehicle_registration_number} - {val?.category?.name}</MenuItem>
                            })}
                        </Select>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Description</Typography>
                        </InputLabel>
                        <InputBase
                            name="description"
                            color="secondary"
                            className="input"
                            value={formState?.description}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Schedule</Typography>
                        </InputLabel>
                        <InputBase
                            name="schedule"
                            color="secondary"
                            type="date"
                            className="input"
                            value={formState?.schedule}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <Grid container spacing={3}>
                        <Grid item md={6} lg={6}>
                            <Card className="p-3" variant="outlined">
                                <strong>Original Location</strong>
                                {formState?.origin && <div className="mt-2">
                                    <div><small>{formState?.origin?.address}</small></div>
                                    <div className="mt-1">
                                        <small className="text-muted">
                                            Coordinate: {formState?.origin?.location?.lat?.toFixed(6)}, {formState?.origin?.location?.lng?.toFixed(6)}
                                        </small>
                                    </div>
                                </div>}
                                <div className="mt-3">
                                    <Chip
                                        icon={<Icon style={{fontSize: 16}}>map</Icon>}
                                        className="ps-2 pe-2"
                                        label="Open Map"
                                        clickable
                                        onClick={() => pickupLocation("origin")}
                                        color="basic"/>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item md={6} lg={6}>
                            <Card className="p-3" variant="outlined">
                                <strong>Destination Location</strong>
                                {formState?.destination && <div className="mt-2">
                                    <div><small>{formState?.destination?.address}</small></div>
                                    <div className="mt-2">
                                        <small className="text-muted">
                                            Coordinate: {formState?.destination?.location?.lat?.toFixed(6)}, {formState?.destination?.location?.lng?.toFixed(6)}
                                        </small>
                                    </div>
                                </div>}
                                <div className="mt-3">
                                    <Chip
                                        icon={<Icon style={{fontSize: 16}}>map</Icon>}
                                        className="ps-2 pe-2"
                                        label="Open Map"
                                        clickable
                                        onClick={() => pickupLocation("destination")}
                                        color="basic"/>
                                </div>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
                <div className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => sendData()}
                        disableElevation>
                        {isLoading ? <CircularProgressCustom size={26} /> : (props?.isEdit ? "Edit Driver Job" : "Add Driver Job")}
                    </Button>
                </div>
            </Card>
        </div>
    </Modal>
}