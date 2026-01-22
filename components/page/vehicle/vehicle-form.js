import { Button, Select, Card, MenuItem, InputBase, InputLabel, Modal, Typography } from "@material-ui/core";
import moment from "moment";
import { useEffect, useState } from "react";
import { insertVehicleApi, updateVehicleApi } from "../../../services/api/vehicle.api";
import { getListVehicleCategorySwr } from "../../../services/swr/vehicle-category.swr";
import { CircularProgressCustom } from "../../base_component/spinner";

export default function VehicleForm(props) {

    const [formState, setFormState] = useState(null)
    const [user, setUser] = useState(null)

    const [categories, setCategories] = useState([])
    var categorySwr = getListVehicleCategorySwr({ page: 1, limit: 200, orderBy: "name", order: "asc" })
    useEffect(() => {
        if(categorySwr?.data?.result) {
            setCategories(categorySwr?.data?.result ?? [])
        }
    }, [categorySwr?.data?.result])
    
    useEffect(() => {
        if(props?.open) {
            if(props?.isEdit) {
                setFormState({
                    vehicleRegistrationNumber : props?.data?.vehicle_registration_number,
                    cashisNumber : props?.data?.cashis_number,
                    engineNumber : props?.data?.engine_number,
                    category: categorySwr?.data?.result?.find((val) => val.id == props?.data?.category_id),
                    inspectionNumber : props?.data?.inspection_number,
                    inspectionNumberRegistrationCertificate : props?.data?.inspection_number_registration_certificate,
                    inspectionExpiryDate : props?.data?.inspection_expiry_date,
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
            var data = {
                ...props?.data,
                vehicle_registration_number : formState?.vehicleRegistrationNumber,
                cashis_number : formState?.cashisNumber,
                engine_number : formState?.engineNumber,
                category_id: formState?.category?.id,
                inspection_number : formState?.inspectionNumber,
                inspection_number_registration_certificate : formState?.inspectionNumberRegistrationCertificate,
                inspection_expiry_date : moment(formState?.inspectionExpiryDate),
            }
            console.log(formState)
            setLoading(true);
            if(props?.isEdit) {
                updateVehicleApi(data, props?.data?.id).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataUpdated(res)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                insertVehicleApi(data).then((res) => {
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
        <div className="modal-wrapper" style={{width: "700px"}}>
            <Card className="modal">
                <div className="modal-header">
                    <h3>{props?.isEdit ? "Edit Vehicle" : "Add Vehicle"}</h3>
                </div>
                <div className="modal-content">
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Select Category</Typography>
                        </InputLabel>
                        <Select
                            labelId="demo-customized-select-label"
                            className="input"
                            placeholder="Select Vendor"
                            fullWidth
                            name="category"
                            value={formState?.category ?? "none"}
                            onChange={onChangeInput}
                            input={<InputBase />}
                            >
                            <MenuItem value="none"><em className="text-muted">Select Category</em></MenuItem>
                            {categories?.map((val, i) => {
                                return <MenuItem key={val?.id} value={val}>{val?.name}</MenuItem>
                            })}
                        </Select>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Vehicle Registration Number</Typography>
                        </InputLabel>
                        <InputBase
                            name="vehicleRegistrationNumber"
                            color="secondary"
                            className="input"
                            value={formState?.vehicleRegistrationNumber}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Cashis Number</Typography>
                        </InputLabel>
                        <InputBase
                            name="cashisNumber"
                            color="secondary"
                            className="input"
                            value={formState?.cashisNumber}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Engine Number</Typography>
                        </InputLabel>
                        <InputBase
                            name="engineNumber"
                            color="secondary"
                            className="input"
                            type="text"
                            value={formState?.engineNumber}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Inspection Number</Typography>
                        </InputLabel>
                        <InputBase
                            name="inspectionNumber"
                            color="secondary"
                            className="input"
                            value={formState?.inspectionNumber}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Inspection Number Registration Certificate</Typography>
                        </InputLabel>
                        <InputBase
                            name="inspectionNumberRegistrationCertificate"
                            color="secondary"
                            className="input"
                            type="text"
                            value={formState?.inspectionNumberRegistrationCertificate}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Inspection Expiry Date</Typography>
                        </InputLabel>
                        <InputBase
                            name="inspectionExpiryDate"
                            color="secondary"
                            className="input"
                            type="date"
                            value={formState?.inspectionExpiryDate}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                </div>
                <div className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => sendData()}
                        disableElevation>
                        {isLoading ? <CircularProgressCustom size={26} /> : (props?.isEdit ? "Edit Vehicle" : "Add Vehicle")}
                    </Button>
                </div>
            </Card>
        </div>
    </Modal>
}