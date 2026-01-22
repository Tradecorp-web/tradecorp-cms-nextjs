import { Button, Card, InputBase, InputLabel, Modal, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { insertVehicleCategoryApi, updateVehicleCategoryApi } from "../../../services/api/vehicle-category.api";
import { CircularProgressCustom } from "../../base_component/spinner";

export default function VehicleCategoryForm(props) {

    const [formState, setFormState] = useState(null)
    
    useEffect(() => {
        if(props?.open) {
            if(props?.isEdit) {
                console.log(props?.data)
                setFormState({
                    name : props?.data?.name,
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
            var data = {
                ...props?.data,
                name : formState?.name,
            }
            if(props?.isEdit) {
                updateVehicleCategoryApi(data, props?.data?.id).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataUpdated(res)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                insertVehicleCategoryApi(data).then((res) => {
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
        <div className="modal-wrapper" style={{width: "500px"}}>
            <Card className="modal">
                <div className="modal-header">
                    <h3>{props?.isEdit ? "Edit Vehicle Category" : "Add Vehicle Category"}</h3>
                </div>
                <div className="modal-content">
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Name</Typography>
                        </InputLabel>
                        <InputBase
                            name="name"
                            color="secondary"
                            className="input"
                            value={formState?.name}
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
                        {isLoading ? <CircularProgressCustom size={26} /> : (props?.isEdit ? "Edit Vehicle Category" : "Add Vehicle Category")}
                    </Button>
                </div>
            </Card>
        </div>
    </Modal>
}