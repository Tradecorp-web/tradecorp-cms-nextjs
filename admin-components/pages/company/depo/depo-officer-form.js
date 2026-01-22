import { Button, Card, Icon, IconButton, InputBase, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Alert } from "@material-ui/lab";
import { masterUserSwr } from "../../../../services/swr/user.swr";
import { CircularProgressCustom } from "../../../../components/base_component/spinner";
import { addDepoOfficerApi } from "../../../../services/api/depo.api";
import { useRouter } from "next/router";

export default function DepoOfficerForm(props) {

    const [isLoading, setLoading] = useState(false)

    // -------<GET VENDOR>---------
    const [userList, setUserList] = useState([])
    var listUserSwr = masterUserSwr()
    useEffect(() => {
        setLoading(listUserSwr?.isLoading)
        if(listUserSwr?.data?.result) {
            setUserList(listUserSwr?.data?.result)
        }
    }, [listUserSwr.data])
    // -------<GET VENDOR>---------

    // -------<FORM>---------
    const [formState, setFormState] = useState(null)
    const [errorText, setErrorText] = useState(null)
    
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
            addDepoOfficerApi(props?.depoId, formState?.user?.id).then((res) => {
                setLoading(false)
                closeModal()
                props?.dataInserted(res)
            }).catch((err) => {
                setErrorText(err)
                setLoading(false)
            })
        }
    }
    // -------<FORM>---------

    function closeModal() {
        setFormState(null)
        setErrorText(null)
        props?.closeModal()
    }

    return <Modal
        open={props?.open}
        onClose={() => closeModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div className="modal-wrapper" style={{width: "500px"}}>
            <Card className="modal">
                <div className="modal-header">
                    <h3>Add Officer</h3>
                </div>
                <div className="modal-content">
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Select Officer</Typography>
                        </InputLabel>
                        <Autocomplete
                            id="combo-box-demo"
                            options={userList}
                            className="input"
                            name="user"
                            value={formState?.user}
                            onChange={(event, value) => {
                                setFormState({...formState, user: value})
                            }}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <div ref={params.InputProps.ref}>
                                    <InputBase className="input" style={{width: "100%"}} type="text" {...params.inputProps} />
                                </div>
                            )}/>
                    </div>
                </div>
                {errorText && <Alert 
                    severity="error" 
                    action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {setErrorText(null)}}>
                          <Icon>close</Icon>
                        </IconButton>
                    }
                    style={{borderRadius: 0}}>
                    {errorText}
                </Alert>}
                <div className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => sendData()}
                        disableElevation>
                        {isLoading ? <CircularProgressCustom size={26} /> : "Save"}
                    </Button>
                </div>
            </Card>
        </div>
    </Modal>
}