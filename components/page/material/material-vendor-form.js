import { Button, Card, Icon, IconButton, InputBase, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getListVendorSwr } from "../../../services/swr/vendor.swr";
import { CircularProgressCustom } from "../../base_component/spinner";
import { insertMaterialVendorApi, updateMaterialVendorApi } from "../../../services/api/material.api";
import { Alert } from "@material-ui/lab";
import { getListMaterialSwr } from "../../../services/swr/material.swr";

export default function MaterialVendorForm(props) {

    const [isLoading, setLoading] = useState(false)

    // -------<GET VENDOR>---------
    const [vendorList, setVendorList] = useState([])
    var listVebdorSwr = props?.isAddVendor ? getListVendorSwr({
        page: 1, 
        limit: 200,
        isAccepted: true,
        pendingAcceptance: false,
        orderBy: "vendor_name",
        order: "asc"
    }) : null
    useEffect(() => {
        setLoading(listVebdorSwr?.isLoading)
        if(listVebdorSwr?.data?.result) {
            setVendorList(listVebdorSwr?.data?.result)
        }
    }, [listVebdorSwr])
    // -------<GET VENDOR>---------
    
    // -------<GET MATERIAL>---------
    const [materialList, setMaterialList] = useState([])
    var listMaterialSwr = props?.isAddMaterial ? getListMaterialSwr({
        page: 1, 
        limit: 200,
        isAccepted: true,
        pendingAcceptance: false,
        orderBy: "material_name",
        order: "asc"
    }) : null
    useEffect(() => {
        setLoading(listMaterialSwr?.isLoading)
        if(listMaterialSwr?.data?.result) {
            setMaterialList(listMaterialSwr?.data?.result)
        }
    }, [listMaterialSwr])
    // -------<GET MATERIAL>---------

    // -------<FORM>---------
    const [formState, setFormState] = useState(null)
    const [errorText, setErrorText] = useState(null)

    useEffect(() => {
        if(props?.isEdit) {
            setFormState({...formState, price: props?.data?.price})
        }
    }, [props?.open])
    
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
            if(props?.isEdit) {
                var data = {
                    price: parseFloat(formState?.price)
                }
                updateMaterialVendorApi(data, props?.data?.id).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataUpdated(res)
                }).catch((err) => {
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                var data = {
                    material_id: props?.isAddMaterial ? formState?.material?.id : props?.material?.id,
                    vendor_id: props?.isAddMaterial ? props?.vendor?.id : formState?.vendor?.id,
                    price: parseFloat(formState?.price)
                }
                insertMaterialVendorApi(data).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataInserted(res)
                }).catch((err) => {
                    setErrorText(err)
                    setLoading(false)
                })
            }
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
                    {props?.isAddVendor && <h3>{props?.isEdit ? "Edit Vendor" : "Add Vendor"}</h3>}
                    {props?.isAddMaterial && <h3>{props?.isEdit ? "Edit Material" : "Add Material"}</h3>}
                </div>
                <div className="modal-content">
                    {props?.isAddVendor && <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">{props?.isEdit ? "Vendor" : "Select Vendor"}</Typography>
                        </InputLabel>
                        {props?.isEdit && <InputBase
                            name="vendor"
                            color="secondary"
                            className="input"
                            readOnly={true}
                            disabled={true}
                            value={props?.data?.vendor?.vendor_name}
                            onChange={onChangeInput}
                            fullWidth></InputBase>}
                        {!props?.isEdit && <Autocomplete
                            id="combo-box-demo"
                            options={vendorList}
                            className="input"
                            name="vendor"
                            value={formState?.vendor}
                            onChange={(event, value) => {
                                setFormState({...formState, vendor: value})
                            }}
                            // inputValue={inputValue}
                            // onInputChange={(event, newInputValue) => {
                            //     setInputValue(newInputValue);
                            // }}
                            getOptionLabel={(option) => option.vendor_name}
                            renderInput={(params) => (
                                <div ref={params.InputProps.ref}>
                                    <InputBase className="input" style={{width: "100%"}} type="text" {...params.inputProps} />
                                </div>
                            )}/>}
                    </div>}
                    {props?.isAddMaterial && <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">{props?.isEdit ? "Material" : "Select Material"}</Typography>
                        </InputLabel>
                        {props?.isEdit && <InputBase
                            name="material"
                            color="secondary"
                            className="input"
                            readOnly={true}
                            disabled={true}
                            value={props?.data?.material?.material_name}
                            onChange={onChangeInput}
                            fullWidth></InputBase>}
                        {!props?.isEdit && <Autocomplete
                            id="combo-box-demo"
                            options={materialList}
                            className="input"
                            name="material"
                            value={formState?.material}
                            onChange={(event, value) => {
                                setFormState({...formState, material: value})
                            }}
                            // inputValue={inputValue}
                            // onInputChange={(event, newInputValue) => {
                            //     setInputValue(newInputValue);
                            // }}
                            getOptionLabel={(option) => option.material_name}
                            renderInput={(params) => (
                                <div ref={params.InputProps.ref}>
                                    <InputBase className="input" style={{width: "100%"}} type="text" {...params.inputProps} />
                                </div>
                            )}/>}
                    </div>}
                    <div className="text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Price</Typography>
                        </InputLabel>
                        <InputBase
                            name="price"
                            color="secondary"
                            className="input"
                            value={formState?.price}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
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