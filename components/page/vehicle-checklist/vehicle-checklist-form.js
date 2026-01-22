import { Button, Card, Fab, Icon, IconButton, InputBase, InputLabel, Modal, Typography } from "@material-ui/core";
import exportFromJSON from "export-from-json";
import { useEffect, useState } from "react";
import { insertVehicleChecklistApi, updateVehicleChecklistApi } from "../../../services/api/vehicle-checklist.api";
import { CircularProgressCustom } from "../../base_component/spinner";

export default function VehicleChecklistForm(props) {

    const [formState, setFormState] = useState(null)
    
    useEffect(() => {
        if(props?.open) {
            if(props?.isEdit) {
                console.log(props?.data)
                setFormState({
                    checklist_name : props?.data?.checklist_name,
                    checklist_groups : props?.data?.checklist_groups,
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
            var data = formState
            if(props?.isEdit) {
                updateVehicleChecklistApi(data, props?.data?.id).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataUpdated(res)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                insertVehicleChecklistApi(data).then((res) => {
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

    function addGroup() {
        if(formState?.checklist_groups == null) {
            setFormState({...formState, checklist_groups: [{
                group_name: "", 
                checklist: [{description: ""}]
            }]})
        } else {
            formState?.checklist_groups?.push({
                group_name: "", 
                checklist: [{description: ""}]
            })
            setFormState({...formState})
        }
    }
    
    function removeGroup(groupIndex) {
        formState.checklist_groups.splice(groupIndex, 1)
        setFormState({...formState})
    }
    
    function onGroupNameChanged(e, i) {
        formState.checklist_groups[i].group_name = e.target.value
        setFormState({...formState})
    }
    
    function addChecklist(i) {
        formState.checklist_groups[i].checklist.push({description: ""})
        setFormState({...formState})
    }
    
    function removeChecklist(groupIndex, checklistIndex) {
        formState.checklist_groups[groupIndex].checklist.splice(checklistIndex, 1)
        setFormState({...formState})
    }
    
    function onChecklistDescriptionChanged(e, groupIndex, checklistIndex) {
        formState.checklist_groups[groupIndex].checklist[checklistIndex].description = e.target.value
        setFormState({...formState})
    }

    return <Modal
        open={props?.open}
        onClose={() => props?.closeModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div className="modal-wrapper" style={{width: "800px"}}>
            <Card className="modal">
                <div className="modal-header">
                    <h3>{props?.isEdit ? "Edit Vehicle Checklist Template" : "Add Vehicle Checklist Template"}</h3>
                </div>
                <div className="modal-content">
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Name of checklist template</Typography>
                        </InputLabel>
                        <InputBase
                            name="checklist_name"
                            color="secondary"
                            className="input"
                            value={formState?.checklist_name}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    {formState?.checklist_groups?.map((val, i) => {
                        return <Card key={i} className="mb-3 p-3 text-left" variant="outlined">
                            <div className="mb-3 text-left">
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Name of checklist group</Typography>
                                </InputLabel>
                                <div className="flex-center">
                                    <InputBase
                                        name="group_name"
                                        color="secondary"
                                        className="input me-3"
                                        value={formState?.checklist_groups[i].group_name}
                                        onChange={(e) => onGroupNameChanged(e, i)}
                                        fullWidth>
                                    </InputBase>
                                    <Button
                                        onClick={() => removeGroup(i)}
                                        disableElevation>
                                        <Icon style={{color: "#666"}}>cancel</Icon>
                                    </Button>
                                </div>
                            </div>
                            <Card className="mb-3 p-3 text-left" variant="outlined">
                                <div className="mb-3 text-left">
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">Checklist</Typography>
                                    </InputLabel>
                                    {formState?.checklist_groups[i]?.checklist?.map((item, j) => {
                                        return <div key={j} className="flex-center mb-3">
                                            <InputBase
                                                name="description"
                                                color="secondary"
                                                className="input me-3"
                                                value={formState?.checklist_groups[i].checklist[j].description}
                                                onChange={(e) => onChecklistDescriptionChanged(e, i, j)}
                                                fullWidth>
                                            </InputBase>
                                            {formState?.checklist_groups[i]?.checklist?.length != j+1 && <Button
                                                onClick={() => removeChecklist(i, j)}
                                                disableElevation>
                                                <Icon style={{color: "#666"}}>cancel</Icon>
                                            </Button>}
                                            {formState?.checklist_groups[i]?.checklist?.length == j+1 && <Button
                                                variant="contained"
                                                onClick={() => addChecklist(i)}
                                                disableElevation>
                                                <Icon>add</Icon>
                                            </Button>}
                                        </div>
                                    })}
                                </div>
                            </Card>
                        </Card>
                    })}
                    <Button
                        variant="contained"
                        onClick={() => addGroup()}
                        disableElevation>
                        <Icon>add</Icon> Add Checklist Group
                    </Button>
                </div>
                <div className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => sendData()}
                        disableElevation>
                        {isLoading ? <CircularProgressCustom size={26} /> : (props?.isEdit ? "Edit Vehicle Checklist Template" : "Add Vehicle Checklist Template")}
                    </Button>
                </div>
            </Card>
        </div>
    </Modal>
}