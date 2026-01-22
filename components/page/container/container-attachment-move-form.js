import { Button, Card, Grid, InputBase, InputLabel, MenuItem, Modal, Select, Typography, Box, TextField, FormGroup, FormControlLabel, Checkbox, Chip, FormControl, makeStyles, LinearProgress, IconButton, Icon, Link, Tooltip, InputAdornment, ButtonGroup } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { checkNull } from "../../../helpers/general";
import { updateContainerAttachmentApi } from "../../../services/api/container-stocks.api";
import { CircularProgressCustom } from "../../base_component/spinner";

const useStyles = makeStyles((theme) => ({
    
}))

export default function StockContainerMoveAttachmentForm(props) {
    const classes = useStyles()
    
    const [destination, setDestination] = useState([
        {field:"images",label:"Container Images"},
        {field:"csc_certificates",label:"CSC Certificate"},
        {field:"specifications",label:"Specification"},
        {field:"contracts",label:"Contract"},
        {field:"invoices",label:"Invoice"},
        {field:"drawings",label:"Drawings"},
        {field:"surveys",label:"Surveys"},
        {field:"relative_documents",label:"Relative Documents"},
        {field:"original_photos",label:"Original Photos"},
    ])
    const [choice, setChoice] = useState([])
    const [selected, setSelected] = useState("")
    const [isLoading, setLoading] = useState(false)

    const router = useRouter()

    useEffect(() => {
        if(props?.origin != null) {
            setChoice(destination.filter(val => val?.field != props.origin))
            setSelected("")
        } else {
            setChoice([])
            setSelected("")
        }
    }, [props?.open])

    const changeChoice = (e) => {
        setSelected(e.target.value)
    }

    const sendData = () => {
        if (!isLoading) {
            setLoading(true)
            var data = null
            var from = []
            var to = props.data[selected]?? []
            for (var i=0; i<props.data[props.origin].length; i++) {
                for (var j=0; j<props.list.length; j++) {
                    if (i == props.list[j]) {
                        to.push(props.data[props.origin][i])
                    } else {
                        from.push(props.data[props.origin][i])
                    }
                }
            }
            data = {id: props.data.id,[props.origin]:from, [selected]:to}
            updateContainerAttachmentApi(data)
            .then((res) => {
                setChoice([])
                setSelected("")
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

    const closeForm = async () => {
        setChoice([])
        setSelected("")
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
                    <TextField
                        name="destination"
                        label="Move to"
                        select
                        value={selected}
                        variant="outlined"
                        onChange={changeChoice}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                    >
                        {choice.map((row,key) => {
                            return (<MenuItem value={row.field}>{row.label}</MenuItem>)
                        })}
                    </TextField>
                </Box>
                <Box className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => sendData()}
                        disableElevation>
                        {isLoading ? <CircularProgressCustom size={26} /> : "Send"}
                    </Button>
                </Box>
            </Card>
        </Box>
    </Modal>
}