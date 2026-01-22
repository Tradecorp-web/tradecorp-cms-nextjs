import { Button, Card, Modal, Box, TextField, makeStyles, Icon, Tooltip, InputAdornment, ButtonGroup } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { checkNull } from "../../../helpers/general";
import { updateContainerAttachmentApi } from "../../../services/api/container-stocks.api";
import { CircularProgressCustom } from "../../base_component/spinner";
import { DropzoneArea } from "material-ui-dropzone";
import { uploadFileSecListenerApi, deleteFileApi, downloadFileSecApi } from "../../../services/api/file.api";

const useStyles = makeStyles((theme) => ({
    
}))

export default function StockContainerAttachmentForm(props) {
    const classes = useStyles()
    
    const [data, setData] = useState({id:null,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
    const [record, setRecord] = useState({field:null,link:null,label:null,ext:null})
    const [isLoading, setLoading] = useState(false)

    const router = useRouter()

    useEffect(() => {
        if(props?.record.field != null) {
            var tmp = props.record.label.split(".")
            setRecord({field:props.record.field, link:props.record.link, label:tmp[0], ext:"."+tmp[1]})
            if (props.record.field == "images") {
                setData({id:props.data.id,csc_certificates:null,images:props.data.images,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
            } else if (props.record.field == "csc_certificates") {
                setData({id:props.data.id,csc_certificates:props.data.csc_certificates,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
            } else if (props.record.field == "specifications") {
                setData({id:props.data.id,csc_certificates:null,images:null,specifications:props.data.specifications,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
            } else if (props.record.field == "contracts") {
                setData({id:props.data.id,csc_certificates:null,images:null,specifications:null,contracts:props.data.contracts,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
            } else if (props.record.field == "invoices") {
                setData({id:props.data.id,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:props.data.invoices,drawings:null,surveys:null,relative_documents:null,original_photos:null})
            } else if (props.record.field == "drawings") {
                setData({id:props.data.id,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:props.data.drawings,surveys:null,relative_documents:null,original_photos:null})
            } else if (props.record.field == "surveys") {
                setData({id:props.data.id,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:props.data.surveys,relative_documents:null,original_photos:null})
            } else if (props.record.field == "relative_documents") {
                setData({id:props.data.id,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:props.data.relative_documents,original_photos:null})
            } else if (props.record.field == "original_photos") {
                setData({id:props.data.id,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:props.data.original_photos})
            }
            setErrorText(null)
        } else {
            setRecord({field:null,link:null,label:null,ext:null})
            setData({id:null,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
            setErrorText(null)
        }
    }, [props?.open])

    const onChangeInput = (e) => {
        if (typeof e.target.value === "string" || e.target.value instanceof String) {
            e.target.value = e.target.value.toUpperCase()
        }
        setRecord({...record, [e.target.name]: e.target.value})
        if (record.field == "images") {
            var list = data.images
            for (var i=0; i<list.length; i++) {
                if (list[i].link == record.link) {
                    list[i].label = e.target.value+record.ext
                }
            }
            setData({...data, images:list})
        } else if (record.field == "csc_certificates") {
            var list = data.csc_certificates
            for (var i=0; i<list.length; i++) {
                if (list[i].link == record.link) {
                    list[i].label = e.target.value+record.ext
                }
            }
            setData({...data, csc_certificates:list})
        } else if (record.field == "specifications") {
            var list = data.specifications
            for (var i=0; i<list.length; i++) {
                if (list[i].link == record.link) {
                    list[i].label = e.target.value+record.ext
                }
            }
            setData({...data, specifications:list})
        } else if (record.field == "contracts") {
            var list = data.contracts
            for (var i=0; i<list.length; i++) {
                if (list[i].link == record.link) {
                    list[i].label = e.target.value+record.ext
                }
            }
            setData({...data, contracts:list})
        } else if (record.field == "invoices") {
            var list = data.invoices
            for (var i=0; i<list.length; i++) {
                if (list[i].link == record.link) {
                    list[i].label = e.target.value+record.ext
                }
            }
            setData({...data, invoices:list})
        } else if (record.field == "drawings") {
            var list = data.drawings
            for (var i=0; i<list.length; i++) {
                if (list[i].link == record.link) {
                    list[i].label = e.target.value+record.ext
                }
            }
            setData({...data, drawings:list})
        } else if (record.field == "surveys") {
            var list = data.surveys
            for (var i=0; i<list.length; i++) {
                if (list[i].link == record.link) {
                    list[i].label = e.target.value+record.ext
                }
            }
            setData({...data, surveys:list})
        } else if (record.field == "relative_documents") {
            var list = data.relative_documents
            for (var i=0; i<list.length; i++) {
                if (list[i].link == record.link) {
                    list[i].label = e.target.value+record.ext
                }
            }
            setData({...data, relative_documents:list})
        } else if (record.field == "original_photos") {
            var list = data.original_photos
            for (var i=0; i<list.length; i++) {
                if (list[i].link == record.link) {
                    list[i].label = e.target.value+record.ext
                }
            }
            setData({...data, original_photos:list})
        }
    }

    const [errorText, setErrorText] = useState(null)

    function checkValidation() {
        var isValid = true
        var eLabel = ""
        if (record.label == "" || record.label == null) {
            isValid = false
            eLabel = "Label can not be empty"
        }
        setErrorText(eLabel)
        return isValid
    }

    const sendData = () => {
        if (!isLoading) {
            if (checkValidation()) {
                setLoading(true)
                updateContainerAttachmentApi(data)
                .then((res) => {
                    setRecord({field:null,link:null,label:null,ext:null})
                    setData({id:null,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
                    setLoading(false)
                    props?.dataRefresh()
                    props?.closeModal()
                })
                .catch((err) => {
                    console.log(err)
                    props?.alert(err)
                    setLoading(false)
                })
            }
        }
    }

    const closeForm = async () => {
        setRecord({field:null,link:null,label:null,ext:null})
        setData({id:null,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
        props?.closeModal()
    }

    return <Modal
        open={props?.open}
        onClose={closeForm}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <Box className="modal-wrapper" style={{width: "500px"}}>
            <Card className="modal">
                <Box className="modal-content">
                    <TextField
                        name="label"
                        variant="outlined"
                        size="small"
                        value={checkNull(record.label)}
                        error={errorText? true : false} 
                        helperText={errorText}
                        onChange={onChangeInput}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                {record.ext}&nbsp;
                                <ButtonGroup variant="text" color="default" aria-label="split button">
                                    <Tooltip title="Save" placement="top">
                                        <Button
                                            size="small"
                                            onClick={sendData}>
                                            <Icon style={{color:"green"}}>done</Icon>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Cancel" placement="top">
                                        <Button
                                            size="small"
                                            onClick={closeForm}>
                                            <Icon style={{color:"red"}}>close</Icon>
                                        </Button>
                                    </Tooltip>
                                </ButtonGroup>
                            </InputAdornment>
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                    />
                </Box>
            </Card>
        </Box>
    </Modal>
}