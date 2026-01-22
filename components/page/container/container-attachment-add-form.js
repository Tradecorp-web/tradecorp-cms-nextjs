import { Button, Card, Grid, InputBase, InputLabel, MenuItem, Modal, Select, Typography, Box, TextField, FormGroup, FormControlLabel, Checkbox, Chip, FormControl, makeStyles, LinearProgress, IconButton, Icon, Link, Tooltip, InputAdornment, ButtonGroup } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useState, createRef } from "react";
import { checkNull } from "../../../helpers/general";
import { updateContainerAttachmentApi, replaceContainerImageApi } from "../../../services/api/container-stocks.api";
import { CircularProgressCustom } from "../../base_component/spinner";
import { DropZoneComponent } from "../../base_component/file-upload";

const useStyles = makeStyles((theme) => ({
    
}))

export default function StockContainerAddAttachmentForm(props) {
    const classes = useStyles()
    
    const [title, setTitle] = useState("")
    const [data, setData] = useState({id:null,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
    const [record, setRecord] = useState({field:null,path:null})
    const [isLoading, setLoading] = useState(false)

    const router = useRouter()

    useEffect(() => {
        if(props?.field != null) {
            if (props.field == "images") {
                setRecord({field:props.field, path:"container"})
                setData({id:props.data.id,csc_certificates:null,images:props.data.images,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
                if (props.replace) {
                    setTitle("Replace Container Images")
                } else {
                    setTitle("Container Images")
                }
            } else if (props.field == "csc_certificates") {
                setRecord({field:props.field, path:"csc"})
                setData({id:props.data.id,csc_certificates:props.data.csc_certificates,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
                setTitle("CSC Certificate")
            } else if (props.field == "specifications") {
                setRecord({field:props.field, path:"container_spec"})
                setData({id:props.data.id,csc_certificates:null,images:null,specifications:props.data.specifications,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
                setTitle("Specification")
            } else if (props.field == "contracts") {
                setRecord({field:props.field, path:"container_contract"})
                setData({id:props.data.id,csc_certificates:null,images:null,specifications:null,contracts:props.data.contracts,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
                setTitle("Contract")
            } else if (props.field == "invoices") {
                setRecord({field:props.field, path:"container_invoice"})
                setData({id:props.data.id,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:props.data.invoices,drawings:null,surveys:null,relative_documents:null,original_photos:null})
                setTitle("Invoice")
            } else if (props.field == "drawings") {
                setRecord({field:props.field, path:"container_drawings"})
                setData({id:props.data.id,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:props.data.drawings,surveys:null,relative_documents:null,original_photos:null})
                setTitle("Drawings")
            } else if (props.field == "surveys") {
                setRecord({field:props.field, path:"container_surveys"})
                setData({id:props.data.id,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:props.data.surveys,relative_documents:null,original_photos:null})
                setTitle("Surveys")
            } else if (props.field == "relative_documents") {
                setRecord({field:props.field, path:"container_others"})
                setData({id:props.data.id,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:props.data.relative_documents,original_photos:null})
                setTitle("Relative Documents")
            } else if (props.field == "original_photos") {
                setRecord({field:props.field, path:"container_original_photos"})
                setData({id:props.data.id,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:props.data.original_photos})
                setTitle("Original Photos")
            }
        } else {
            setRecord({field:null,path:null})
            setData({id:null,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
            setTitle("")
        }
    }, [props?.open])

    const onChangeUpload = (res,name) => {
        var result = []
        if (name == "images") {
            if (!props.replace) {
                if (data.images != null) {
                    result = data.images
                }
            }
        } else if (name == "csc_certificates") {
            if (data.csc_certificates != null) {
                result = data.csc_certificates
            }
        } else if (name == "specifications") {
            if (data.specifications != null) {
                result = data.specifications
            }
        } else if (name == "contracts") {
            if (data.contracts != null) {
                result = data.contracts
            }
        } else if (name == "invoices") {
            if (data.invoices) {
                result = data.invoices
            }
        } else if (name == "drawings") {
            if (data.drawings != null) {
                result = data.drawings
            }
        } else if (name == "surveys") {
            if (data.surveys != null) {
                result = data.surveys
            }
        } else if (name == "relative_documents") {
            if (data.relative_documents != null) {
                result = data.relative_documents
            }
        } else if (name == "original_photos") {
            if (data.original_photos != null) {
                result = data.original_photos
            }
        }
        res?.map((row,i) => {
            result.push({label:row.name, content_type:row.content_type, link:row.link, thumbnail:null})
        })
        setData({...data, [name]:result})
    }

    const sendData = () => {
        if (!isLoading) {
            setLoading(true)
            if (props.replace) {
                replaceContainerImageApi(data)
                .then((res) => {
                    setRecord({field:null,path:null})
                    setData({id:null,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
                    setTitle("")
                    setLoading(false)
                    props?.dataRefresh()
                    props?.closeModal()
                })
                .catch((err) => {
                    console.log(err)
                    props?.alert(err)
                    setLoading(false)
                })
            } else {
                updateContainerAttachmentApi(data)
                .then((res) => {
                    setRecord({field:null,path:null})
                    setData({id:null,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
                    setTitle("")
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
        setRecord({field:null,path:null})
        setData({id:null,csc_certificates:null,images:null,specifications:null,contracts:null,invoices:null,drawings:null,surveys:null,relative_documents:null,original_photos:null})
        setTitle("")
        props?.closeModal()
    }

    return <Modal
        open={props?.open}
        onClose={closeForm}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <Box className="modal-wrapper" style={{width: "700px"}}>
            <Card className="modal">
                <Box className="modal-content">
                    <InputLabel>{title}</InputLabel>
                    <DropZoneComponent
                        id={record.field}
                        exportList={(res) => onChangeUpload(res,record.field)}
                        data={[]}
                        path={record.path}
                    />
                </Box>
                <Box className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => sendData()}
                        disableElevation>
                        {isLoading ? <CircularProgressCustom size={26} /> : "Add"}
                    </Button>
                </Box>
            </Card>
        </Box>
    </Modal>
}