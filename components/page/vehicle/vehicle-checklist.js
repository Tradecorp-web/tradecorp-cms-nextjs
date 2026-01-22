import { Button, Divider, InputBase, InputLabel, Link, MenuItem, Select, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { updateVehicleApi } from "../../../services/api/vehicle.api";
import { getListVehicleChecklistSwr } from "../../../services/swr/vehicle-checklist.swr";
import { getDetailVehicleSwr } from "../../../services/swr/vehicle.swr";
import { CircularProgressCustom } from "../../base_component/spinner";
import VehicleChecklistForm from "../vehicle-checklist/vehicle-checklist-form";

export default function VehicleChecklist(props) {

    const [isLoading, setLoading] = useState(false)
    const [openForm, setOpenForm] = useState(false);

    const [vehicle, setVehicle] = useState(null)
    const vehicleSwr = getDetailVehicleSwr(props?.vehicleId)
    useEffect(() => {
        setVehicle(vehicleSwr.data)
        if(checklist != null) {
            var item = checklist?.find(val => val?.id == vehicleSwr?.data?.checklist_id)
            setChecklistSelected(item)
        }
    }, [vehicleSwr.data])

    useEffect(() => {
        setChecklistSelected(null)
        console.log("LOAD VEHICLE")
        vehicleSwr.mutate()
    }, [props?.vehicleId])

    const [checklistSelected, setChecklistSelected] = useState(null)
    const [checklist, setChecklist] = useState([])
    var checklistSwr = getListVehicleChecklistSwr({ page: 1, limit: 200, orderBy: "name", order: "asc" })
    useEffect(() => {
        if(checklistSwr?.data?.result) {
            setChecklist(checklistSwr?.data?.result ?? [])
            var item = checklistSwr?.data?.result?.find(val => val?.id == vehicle?.checklist_id)
            setChecklistSelected(item)
        }
    }, [checklistSwr?.data?.result])

    function updateData() {
        var data = {...vehicle, checklist_id: checklistSelected?.id}
        setLoading(true)
        updateVehicleApi(data, data?.id).then((res) => {
            setLoading(false)
            setVehicle(res)
            vehicleSwr.mutate()
        })
    }

    function onSelectTemplate(e) {
        setChecklistSelected(e.target.value)
    }

    return <div className="card no-padding">
        <div className="p-4 display-space-between">
            <h3>Checklist Maintenance</h3>
        </div>
        <Divider />
        <div className="p-4">
            <div className="mb-3">
                This checklist is used every before and after completing a job. 
                <Link onClick={() => setOpenForm(true)} className="text-link"> <br/> <strong>Create new template</strong></Link>
            </div>
            <div className="mb-3">
                <InputLabel className="pb-1">
                    <Typography variant="caption">Select Category</Typography>
                </InputLabel>
                <Select
                    labelId="demo-customized-select-label"
                    className="input"
                    placeholder="Select Vendor"
                    fullWidth
                    name="category"
                    value={checklistSelected ?? "none"}
                    onChange={onSelectTemplate}
                    input={<InputBase />}
                    >
                    <MenuItem value="none"><em className="text-muted">Select Checklist Template</em></MenuItem>
                    {checklist?.map((val, i) => {
                        return <MenuItem key={val?.id} value={val}>{val?.checklist_name}</MenuItem>
                    })}
                </Select>
            </div>
            <Button
                variant="contained"
                color="primary"
                onClick={() => updateData()}
                disableElevation>
                {isLoading ? <CircularProgressCustom size={26} /> : "Save"}
            </Button>
            
            {checklistSelected && <div className="mt-3">
                <Typography className="mb-2" variant="body1">Below is a checklist of <i>{checklistSelected?.checklist_name}</i>:</Typography>
                {checklistSelected?.checklist_groups?.map((val, i) => <div className="mb-3" key={i}>
                    <div className="mb-1"><strong>{val?.group_name}</strong></div>
                    {val?.checklist?.map((c, j) => <Typography variant="body2" gutterBottom key={j}>{c?.description}</Typography>)}
                </div>)}
            </div>}
        </div>
        <VehicleChecklistForm 
            open={openForm} 
            closeModal={() => setOpenForm(false)} 
            dataInserted={(data) => checklistSwr.mutate()}/>
    </div>
}