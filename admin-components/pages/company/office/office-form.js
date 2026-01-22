import { Button, Card, InputAdornment, InputBase, InputLabel, MenuItem, Modal, Select, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { insertCompanyOfficeApi, updateCompanyOfficeApi } from "../../../../services/api/company.api";
import { CircularProgressCustom } from "../../../../components/base_component/spinner";
import { accountSwr } from "../../../../services/swr/account.swr";

export default function OfficeForm(props) {

    const [formState, setFormState] = useState(null)
    const account = accountSwr()
    
    useEffect(() => {
        if(props?.open) {
            if(props?.isEdit) {
                console.log(props?.data)
                setFormState({
                    city: props?.data?.city,
                    officeName: props?.data?.office_name,
                    address: props?.data?.address,
                    phoneNumber: props?.data?.phone_number,
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
                city: formState?.city,
                office_name: formState?.officeName,
                company_id: account?.data?.company?.id,
                address: formState?.address,
                phone_number: formState?.phoneNumber,
            }
            console.log(data)
            console.log(account?.data)
            if(props?.isEdit) {
                updateCompanyOfficeApi(data, props?.data?.id).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataUpdated(res)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                insertCompanyOfficeApi(data).then((res) => {
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
                    <h3>{props?.isEdit ? "Edit Office" : "Add Office"}</h3>
                </div>
                <div className="modal-content">
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Name</Typography>
                        </InputLabel>
                        <InputBase
                            name="officeName"
                            color="secondary"
                            className="input"
                            value={formState?.officeName}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">City</Typography>
                        </InputLabel>
                        <InputBase
                            name="city"
                            color="secondary"
                            className="input"
                            value={formState?.city}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Address</Typography>
                        </InputLabel>
                        <InputBase
                            name="address"
                            color="secondary"
                            className="input"
                            value={formState?.address}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Phone Number</Typography>
                        </InputLabel>
                        <InputBase
                            name="phoneNumber"
                            color="secondary"
                            className="input"
                            value={formState?.phoneNumber}
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
                        {isLoading ? <CircularProgressCustom size={26} /> : (props?.isEdit ? "Edit Office" : "Add Office")}
                    </Button>
                </div>
            </Card>
        </div>
    </Modal>
}