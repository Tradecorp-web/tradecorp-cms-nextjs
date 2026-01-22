import { Button, Card, Table, TableBody, IconButton, Icon, TableHead, TableContainer, TableRow, TableCell, InputBase, InputLabel, MenuItem, Modal, Select, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { insertDriverApi, updateDriverApi } from "../../../services/api/driver.api";
import { saveUserApi } from "../../../services/api/user.api";
import { CircularProgressCustom } from "../../base_component/spinner";

export default function DriverForm(props) {

    const [formState, setFormState] = useState(null)
    const [user, setUser] = useState(null)
    
    useEffect(() => {
        if(props?.open) {
            if(props?.isEdit) {
                setFormState({
                    username: props?.data?.user?.username,
                    password: props?.data?.user?.password,
                    name: props?.data?.user?.name,
                    position: props?.data?.user?.position,
                    email: props?.data?.user?.email,
                    driverLicense: props?.data?.driver_license,
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
            var user = {
                ...props?.data?.user,
                username: formState?.username,
                password: formState?.password,
                name: formState?.name,
                position: formState?.position,
                email: formState?.email,
            }
            setLoading(true);
            if(props?.isEdit) {
                saveUserApi(user).then((res) => {
                    sendDriverData(res?.id)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                saveUserApi(user).then((res) => {
                    sendDriverData(res?.id)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            }
        }
    }
    
    function sendDriverData(userId) {
        if(checkValidation()) {
            var data = {
                "user_id" : userId,
                "driver_license" : formState?.driverLicense,
                "vehicle_id" : null
            }
            setLoading(true);
            if(props?.isEdit) {
                updateDriverApi(data, props?.data?.id).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataUpdated(res)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                insertDriverApi(data).then((res) => {
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
                    <h3>{props?.isEdit ? "Edit Driver" : "Add Driver"}</h3>
                </div>
                <div className="modal-content">
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Full Name</Typography>
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
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Username</Typography>
                        </InputLabel>
                        <InputBase
                            name="username"
                            color="secondary"
                            className="input"
                            value={formState?.username}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Email</Typography>
                        </InputLabel>
                        <InputBase
                            name="email"
                            color="secondary"
                            className="input"
                            type="email"
                            value={formState?.email}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Driver License</Typography>
                        </InputLabel>
                        <InputBase
                            name="driverLicense"
                            color="secondary"
                            className="input"
                            value={formState?.driverLicense}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Password</Typography>
                        </InputLabel>
                        <InputBase
                            name="password"
                            color="secondary"
                            className="input"
                            type="password"
                            value={formState?.password}
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
                        {isLoading ? <CircularProgressCustom size={26} /> : (props?.isEdit ? "Edit Driver" : "Add Driver")}
                    </Button>
                </div>
            </Card>
        </div>
    </Modal>
}