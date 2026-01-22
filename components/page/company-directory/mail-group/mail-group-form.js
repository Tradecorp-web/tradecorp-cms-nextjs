import { Button, Card, Divider, Grid, Icon, IconButton, InputBase, InputLabel, MenuItem, Modal, Select, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { CircularProgressCustom } from "../../../base_component/spinner";
import { insertMailGroupApi, updateMailGroupApi } from "../../../../services/api/mail-group.api";
import { getListUserApi2 } from "../../../../services/api/user.api";
import { Autocomplete } from "@material-ui/lab";

export default function MailGroupForm(props) {

    const [formState, setFormState] = useState(null)

    const [userOptions, setUserOptions] = useState([])
    useEffect(() => {
        getListUserApi2({
            page: 1, 
            limit: 200,
            orderBy: "name",
            order: "asc",
        }).then(res => {
            setUserOptions(res?.result ?? [])
        })
    }, [])
    
    useEffect(() => {
        if(props?.open) {
            if(props?.isEdit) {
                console.log(props?.data)
                console.log({
                    groupName: props?.data?.group_name,
                    subject: props?.data?.subject,
                    users: props?.data?.users?.map((item) => {
                        return item?.user
                    }),
                })
                setFormState({
                    groupName: props?.data?.group_name,
                    subject: props?.data?.subject,
                    users: props?.data?.users?.map((item) => {
                        return item?.user
                    }),
                })
            }
        }
    }, [props?.open])

    const [errorText, setErrorText] = useState(null)
    const [isLoading, setLoading] = useState(false)
    function onChangeInput(e) {
        if(e.target.name == "category") {
            setFormState({...formState, code: `${e.target.value.code}-`, [e.target.name]: e.target.value})
        } else {
            setFormState({...formState, [e.target.name]: e.target.value})
        }
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
                group_name: formState?.groupName,
                subject: formState?.subject,
                users: formState?.users?.map((item) => {
                    return {user_id: item.id}
                }),
            }
            if(props?.isEdit) {
                updateMailGroupApi(data, props?.data?.id).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataUpdated(res)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                insertMailGroupApi(data).then((res) => {
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

    function addUser(value) {
        setFormState({...formState, users: [...formState?.users ?? [], value]})
    }
    
    function removeUserItemByIndex(index) {
        formState?.users?.splice(index, 1)
        setFormState({...formState, users: [...formState?.users]})
    }

    return <Modal
        open={props?.open}
        onClose={() => props?.closeModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div className="modal-wrapper" style={{width: "700px"}}>
            <Card className="modal">
                <div className="modal-header">
                    <h3>{props?.isEdit ? "Edit Mail Group" : "Add Mail Group"}</h3>
                </div>

                <div className="modal-content">
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Group Name</Typography>
                        </InputLabel>
                        <InputBase
                            name="groupName"
                            color="secondary"
                            className="input"
                            value={formState?.groupName}
                            placeholder="Group Name"
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Subject</Typography>
                        </InputLabel>
                        <InputBase
                            name="subject"
                            color="secondary"
                            className="input"
                            value={formState?.subject}
                            placeholder="Subject"
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Select User</Typography>
                        </InputLabel>
                        <Autocomplete
                            id="combo-box-demo"
                            options={userOptions}
                            className="input"
                            name="users"
                            value={null}
                            onChange={(event, value) => {
                                addUser(value)
                                event.target.value = null
                            }}
                            getOptionLabel={(option) => `${option?.name} - ${option?.position}`}
                            renderInput={(params) => (
                                <div ref={params.InputProps.ref}>
                                    <InputBase className="input" placeholder="Type name" style={{width: "100%"}} type="text" {...params.inputProps} />
                                </div>
                            )}/>
                    </div>
                    <div className="mt-2" style={{maxHeight: "280px", overflow: "auto"}}>
                        {(formState?.users ?? []).map((user, index) => (
                            <div>
                                <div className="pt-2 pb-2 display-space-between">
                                    <div>
                                        <div>{user?.name} - {user?.position}</div>
                                        <small>{user?.email}</small>
                                    </div>
                                    <div>
                                        <IconButton 
                                            className="icon"
                                            size="small"
                                            onClick={() => removeUserItemByIndex(index)}
                                            >
                                            <Icon>close</Icon>
                                        </IconButton>
                                    </div>
                                </div>
                                <Divider/>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => sendData()}
                        disableElevation>
                        {isLoading ? <CircularProgressCustom size={26} /> : (props?.isEdit ? "Edit Mail Group" : "Add Mail Group")}
                    </Button>
                </div>
            </Card>
        </div>
    </Modal>
}