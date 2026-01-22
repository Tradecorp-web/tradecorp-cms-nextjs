import { Button, Card, Container, Divider, FormControl, Grid, Icon, IconButton, InputBase, InputLabel, MenuItem, Modal, Paper, Select, TextField, Tooltip, Typography } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getListContainerStockApi } from "../../../../services/api/container-stocks.api";
import { insertEirApi, updateEirApi } from "../../../../services/api/eir.api";
import { getDetailDepoSwr } from "../../../../services/swr/depo.swr";
import { CircularProgressCustom } from "../../../base_component/spinner";

export default function EirOutForm(props) {
    
    const [errorText, setErrorText] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [formState, setFormState] = useState(null)
    useEffect(() => {
        if(props?.open) {
            if(props?.isEdit) {
                setFormState({
                    name: props?.data?.name,
                    address: props?.data?.address,
                    city: props?.data?.city,
                    telp: props?.data?.telp,
                    fax: props?.data?.fax,
                    country: props?.data?.country,
                    postalCode: props?.data?.postal_code,
                    cp: props?.data?.cp ?? [],
                })
            }
        }
    }, [props?.open])
    function onChangeInput(e) {
        setFormState({...formState, [e.target.name]: e.target.value})
    }
    function onChangeInputByName(name, value) {
        console.log(value)
        setFormState({...formState, [name]: value})
    }

    const router = useRouter()
    const depoId = router.query.depoSlug
    const [depo, setDepo] = useState([])
    const depoSwr = getDetailDepoSwr(depoId)
    useEffect(() => {
        setDepo(depoSwr?.data ?? [])
    }, [depoSwr.data])

    const [stockContainers, setStockContainers] = useState([])
    useEffect(() => {
        getListContainerStockApi({
            page: 1, 
            limit: 5000,
            orderBy: "serial_number",
            order: "asc",
            // depoId: depoId
        }).then((res) => {
            if(res?.result) {
              setStockContainers(res?.result)
            }
        })
    }, [])

    function checkValidation() {
        var isValid = true
        return isValid
    }

    function sendData() {
        console.log(formState)
        if(checkValidation()) {
            setLoading(true);
            var data = {
                ...props?.data,
                movement: "out",
                depo_id: depoId,
                date_time: moment(Date.now()),
                eir_no: parseInt(formState?.eirNo),
                delivery_no: formState?.deliveryNo,
                shipper: formState?.shipper,
                trucker: formState?.trucker,
                vessel_voyage: formState?.vesselVoyage,
                destination: formState?.destination,
                container_id: formState?.container?.id,
                condition_id: formState?.container?.repair_status?.id,
                seal: formState?.seal,
                remarks: formState?.remarks,
                for_carrier_id: formState?.forCarrier?.id,
                for_depot_id: formState?.forDepot?.id,
            }
            if(props?.isEdit) {
                updateEirApi(data, props?.data?.id).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataUpdated(res)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                insertEirApi(data).then((res) => {
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

    return (
        <Modal
            open={props?.open}
            onClose={() => props?.closeModal()}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            <div className="modal-wrapper" style={{width: "800px"}}>
                <Card className="modal">
                    <div className="modal-header">
                        <h3>{props?.isEdit ? "Edit Eir Out" : "Add Eir Out"}</h3>
                    </div>

                    <div className="modal-content">
                        <Grid container spacing={3}>
                            <Grid item md={6}>
                                <div className="mb-3 text-left">
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">Delivery Number</Typography>
                                    </InputLabel>
                                    <InputBase
                                        name="deliveryNo"
                                        color="secondary"
                                        className="input"
                                        value={formState?.deliveryNo}
                                        placeholder=""
                                        onChange={onChangeInput}
                                        fullWidth>
                                    </InputBase>
                                </div>
                                <div className="mb-3 text-left">
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">Shipper</Typography>
                                    </InputLabel>
                                    <InputBase
                                        name="shipper"
                                        color="secondary"
                                        className="input"
                                        value={formState?.shipper}
                                        placeholder=""
                                        onChange={onChangeInput}
                                        fullWidth>
                                    </InputBase>
                                </div>
                                <div className="mb-3 text-left">
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">Ex. Vessel/Voy No.</Typography>
                                    </InputLabel>
                                    <InputBase
                                        name="vesselVoyage"
                                        color="secondary"
                                        className="input"
                                        value={formState?.vesselVoyage}
                                        placeholder=""
                                        onChange={onChangeInput}
                                        fullWidth>
                                    </InputBase>
                                </div>
                                <div className="mb-3 text-left">
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">Destination</Typography>
                                    </InputLabel>
                                    <InputBase
                                        name="destination"
                                        color="secondary"
                                        className="input"
                                        value={formState?.destination}
                                        placeholder=""
                                        onChange={onChangeInput}
                                        fullWidth>
                                    </InputBase>
                                </div>
                            </Grid>
                            <Grid item md={6}>
                                <div className="mb-3 text-left">
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">Eir No</Typography>
                                    </InputLabel>
                                    <InputBase
                                        name="eirNo"
                                        color="secondary"
                                        className="input"
                                        type="number"
                                        value={formState?.eirNo}
                                        placeholder="1"
                                        onChange={onChangeInput}
                                        fullWidth>
                                    </InputBase>
                                </div>
                                <div className="mb-3 text-left">
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">Movement</Typography>
                                    </InputLabel>
                                    <InputBase
                                        name="movement"
                                        color="secondary"
                                        className="input"
                                        value="IN"
                                        readOnly={true}
                                        disabled={true}
                                        fullWidth>
                                    </InputBase>
                                </div>
                                <div className="mb-3 text-left">
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">Trucker</Typography>
                                    </InputLabel>
                                    <InputBase
                                        name="trucker"
                                        color="secondary"
                                        className="input"
                                        value={formState?.trucker}
                                        placeholder=""
                                        onChange={onChangeInput}
                                        fullWidth>
                                    </InputBase>
                                </div>
                                <div className="mb-3 text-left">
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">Vehicle No</Typography>
                                    </InputLabel>
                                    <InputBase
                                        name="vehicleNumber"
                                        color="secondary"
                                        className="input"
                                        value={formState?.vehicleNumber}
                                        placeholder=""
                                        onChange={onChangeInput}
                                        fullWidth>
                                    </InputBase>
                                </div>
                            </Grid>
                        </Grid>
                        <Card variant="outlined" className="p-3 mb-3">
                            <h3 className="mb-3">Select Container</h3>
                            <div className="mb-3 text-left">
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Select Container Stock</Typography>
                                </InputLabel>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={stockContainers}
                                    className="input"
                                    name="container"
                                    value={formState?.container}
                                    onChange={(e, v) => onChangeInputByName('container', v)}
                                    getOptionLabel={(option) => `${option.serial_number} - ${option?.size?.name}/${option?.type?.name}`}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            <InputBase className="input" placeholder="TIHU-XXXXXX" style={{width: "100%"}} type="text" {...params.inputProps} />
                                        </div>
                                    )}/>
                            </div>
                            {formState?.container != null && <Grid container spacing={3}>
                                <Grid item md={3}>
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">Container Number</Typography> <br/>
                                    </InputLabel>
                                    <span>{formState?.container?.serial_number}</span>
                                </Grid>
                                <Grid item md={3}>
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">Size</Typography> <br/>
                                    </InputLabel>
                                    <span>{formState?.container?.size?.name}</span>
                                </Grid>
                                <Grid item md={3}>
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">Type</Typography> <br/>
                                    </InputLabel>
                                    <span>{formState?.container?.type?.name}</span>
                                </Grid>
                                <Grid item md={3}>
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">Condition</Typography> <br/>
                                    </InputLabel>
                                    <span>{formState?.container?.repair_status?.name}</span>
                                </Grid>
                            </Grid>}
                        </Card>
                        <div className="mb-3 text-left">
                            <InputLabel className="pb-1">
                                <Typography variant="caption">Seal</Typography>
                            </InputLabel>
                            <InputBase
                                name="seal"
                                color="secondary"
                                className="input"
                                value={formState?.seal}
                                placeholder=""
                                onChange={onChangeInput}
                                fullWidth>
                            </InputBase>
                        </div>
                        <div className="mb-3 text-left">
                            <InputLabel className="pb-1">
                                <Typography variant="caption">Remarks</Typography>
                            </InputLabel>
                            <InputBase
                                name="remarks"
                                color="secondary"
                                className="input"
                                value={formState?.remarks}
                                placeholder=""
                                onChange={onChangeInput}
                                fullWidth>
                            </InputBase>
                        </div>
                        <Grid container spacing={3}>
                            <Grid item md={6}>
                                <div className="mb-3 text-left">
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">For Carrier</Typography>
                                    </InputLabel>
                                    <Select
                                        labelId="demo-customized-select-label"
                                        className="input"
                                        placeholder="Select Officer"
                                        fullWidth
                                        name="forCarrier"
                                        value={formState?.forCarrier ?? "none"}
                                        onChange={onChangeInput}
                                        input={<InputBase />}>
                                        <MenuItem value="none"><em className="text-muted">Select Officer</em></MenuItem>
                                        {depo?.officers?.map((val, i) => {
                                            return <MenuItem key={val?.id} value={val}>{val?.name}</MenuItem>
                                        })}
                                    </Select>
                                </div>
                            </Grid>
                            <Grid item md={6}>
                                <div className="mb-3 text-left">
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">For Depot</Typography>
                                    </InputLabel>
                                    <Select
                                        labelId="demo-customized-select-label"
                                        className="input"
                                        placeholder="Select Officer"
                                        fullWidth
                                        name="forDepot"
                                        value={formState?.forDepot ?? "none"}
                                        onChange={onChangeInput}
                                        input={<InputBase />}>
                                        <MenuItem value="none"><em className="text-muted">Select Officer</em></MenuItem>
                                        {depo?.officers?.map((val, i) => {
                                            return <MenuItem key={val?.id} value={val}>{val?.name}</MenuItem>
                                        })}
                                    </Select>
                                </div>
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
                            {isLoading ? <CircularProgressCustom size={26} /> : (props?.isEdit ? "Edit Eir Out" : "Add Eir Out")}
                        </Button>
                    </div>
                </Card>
            </div>
        </Modal>
    )
}