import { Button, Card, Grid, MenuItem, Modal, Typography, Box, TextField, Paper, List, ListItem, ListItemText, ListItemIcon, Checkbox, makeStyles, Backdrop, CircularProgress, IconButton, InputAdornment } from "@material-ui/core"
import { Delete, Add } from '@material-ui/icons'
import React, { useEffect, useState } from "react"
import { addHistoryApi } from "../../../../services/api/wo.api"
import { insertMaterialStockHistoryApi } from "../../../../services/api/material.api"
import { FileUploadComponent1 } from "../../../base_component/file-upload"
import Moment from 'moment'
import { v4 } from 'uuid'

const useStyles = makeStyles((theme) => ({
    root: {
      margin: 'auto',
    },
    paper: {
      width: 250,
      height: 300,
      overflow: 'auto',
    },
    button: {
      margin: theme.spacing(0.5, 0),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
  }))

export default function ReleaseForm(props) {
    const classes = useStyles()

    const [materialList, setMaterialList] = useState([{material_id:null,qty:null,unit:null}])
    const [detailList, setDetailList] = useState([{id:null,code:null,material_name:null}])
    const [historyList, seHistoryList] = useState([])
    const [usedList, setUsedList] = useState([])
    const [inputList, setInputList] = useState([])

    const [errorText, setErrorText] = useState({name:null,error:[]})
    const [isLoading, setLoading] = useState(false)

    const [data, setData] = useState({id:null,wo_number:null,project:null,remark:null,materials:[],detail:[],history:[]})
    const [newId, setNewId] = useState(null)
    const [newDate, setNewDate] = useState(null)
    const [woDate, setWoDate] = useState(null)
    const [newName, setNewName] = useState(null)

    const onInputChange = (event) => {
        setNewName(event.target.value)
    }

    const onMaterialInput = (event,key,id,url) => {
        var list = [...inputList]
        if (list[key]["material_id"] == null) {
            list[key]["material_id"] = id
        }
        if (event != null) {
            if (event.target.name == "qty") {
                list[key][event.target.name] = parseInt(event.target.value)
                list[key]["unit"] = materialList[key].unit
            } else {
                list[key][event.target.name] = event.target.value
            }
        } else {
            list[key]["image"] = url
        }
        setInputList(list)
    }

    useEffect(() => {
        if (props.wo != null) {
            setNewId(v4())
            setNewDate(Moment())
            setMaterialList(props.wo.materials)
            setDetailList(props.wo.detail)
            if (props.wo.history != undefined) {
                seHistoryList(props.wo.history)
                setData({id:props.wo.id,wo_number:props.wo.wo_number,project:props.wo.project,remark:props.wo.remark,materials:props.wo.materials,detail:props.wo.detail,history:props.wo.history})
            } else {
                setData({id:props.wo.id,wo_number:props.wo.wo_number,project:props.wo.project,remark:props.wo.remark,materials:props.wo.materials,detail:props.wo.detail,history:[]})
            }
            setWoDate(Moment(props.wo.wo_date).format("LL"))
            var list = []
            var error = []
            var used = []
            for (var i=0; i<props.wo.materials.length; i++) {
                list.push({material_id:null,qty:null,unit:null,image:null})
                error.push({qty:null,name:null})
                if (props.wo.history != undefined) {
                    var histQty = 0
                    for (var j=0; j<props.wo.history.length; j++) {
                        for (var k=0; k<props.wo.history[j].material.length; k++) {
                            if (props.wo.history[j].material[k].material_id == props.wo.materials[i].material_id) {
                                histQty += props.wo.history[j].material[k].qty
                            }
                        }
                    }
                    used.push({qty:histQty})
                } else {
                    used.push({qty:0})
                }
            }
            setInputList(list)
            setUsedList(used)
            setErrorText({...errorText, error:error})
        }
    }, [props.open])

    function checkValidation() {
        var isValid = true
        var eName = "", eQty = []
        if(newName == "" || newName == null) {
            isValid = false
            eName = "Name can not be empty"
        }
        for (var i=0; i<inputList.length; i++) {
            eQty.push({msg:""})
            if(inputList[i].qty != 0 && inputList[i].qty != null) {
                var histQty = 0;
                for (var j=0; j<historyList.length; j++) {
                    for (var k=0; k<historyList[j].material.length; k++)
                    if (historyList[j].material[k].material_id == inputList[i].material_id) {
                        histQty += historyList[j].material[k].qty
                    }
                }
                histQty += inputList[i].qty
                for (var j=0; j<materialList.length; j++) {
                    if (materialList[j].material_id == inputList[i].material_id) {
                        if (histQty > materialList[j].qty) {
                            eQty[i]["msg"] = "Max is "+(materialList[j].qty-usedList[i].qty)
                        }
                    }
                }
            }
        }
        setErrorText({name:eName, error:eQty})
        return isValid
    }

    const sendData = () => {
        var material = []
        for (var i=0;i<inputList.length;i++) {
            if (inputList[i].qty > 0) {
                material.push(inputList[i])
            }
        }
        var history = [...historyList]
        history.push({id:newId,material:material,name:newName,release_date:newDate})
        var dataLocal = {...data}
        dataLocal.history = history
        setData(dataLocal)
        if(checkValidation()) {
            setLoading(true)
            addHistoryApi(dataLocal).then((res) => {
                for (var i=0; i<material.length; i++) {
                    var param = {qty:-material[i].qty,description:"Outgoing stock for Work Order ("+dataLocal.wo_number+")"}
                    insertMaterialStockHistoryApi(param,material[i].material_id).then((res) => {
                        if (i == material.length-1) {
                            setData({id:null,wo_number:null,project:null,remark:null,materials:[],detail:[],history:[]})
                            setLoading(false)
                            props?.closeModal()
                        }
                    }).catch((err) => {
                        console.log(err)
                        setLoading(false)
                    })
                }
            }).catch((err) => {
                console.log(err)
                //setErrorText(err)
                setLoading(false)
            })
        }
    }

    const closeForm = () => {
        setData({id:null,wo_number:null,project:null,remark:null,materials:[],detail:[],history:[]})
        props?.closeModal()
    }

    return ( <Modal
        open={props?.open}
        onClose={closeForm}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <Box className="modal-wrapper" style={{width: "1000px"}}>
            <Card className="modal">
                <Box className="modal-header">
                    <h3>Release Form</h3>
                </Box>
                <Box className="modal-content">
                    <h2 className="mb-3">Details</h2>
                    <Grid container className="page-container">
                        <Grid item lg={4}>
                            <Box className="mb-3">
                                <Box className="mb-1"><small className="text-muted">WO Number</small></Box>
                                <Box>{data.wo_number}</Box>
                            </Box>
                            <Box>
                                <Box className="mb-1"><small className="text-muted">WO Date</small></Box>
                                <Box>{woDate}</Box>
                            </Box>
                        </Grid>
                        <Grid item lg={8}>
                            <Box className="mb-3">
                                <Box className="mb-1"><small className="text-muted">Project</small></Box>
                                <Box className="flex-center">{data.project}</Box>
                            </Box>
                            <Box>
                                <Box className="mb-1"><small className="text-muted">Remarks</small></Box>
                                <Box>{data.remark}</Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <h2 className="mb-3 mt-5">Form</h2>
                    <Box className="mb-3">
                        <TextField 
                            name="name" 
                            label="Name" 
                            variant="outlined" 
                            defaultValue={newName} 
                            required 
                            error={errorText.name} 
                            helperText={errorText.name} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                    <h2 className="mb-3 mt-5">Materials</h2>
                    <Box className="mb-3">
                        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                            <Grid item xs={4} sm={4}><Typography variant="h4">Material</Typography></Grid>
                            <Grid item xs={1} sm={1}><Typography variant="h4">Total</Typography></Grid>
                            <Grid item xs={1} sm={1}><Typography variant="h4">Used</Typography></Grid>
                            <Grid item xs={2} sm={2}><Typography variant="h4">Release</Typography></Grid>
                            <Grid item xs={4} sm={4}><Typography variant="h4">Image</Typography></Grid>
                            {materialList?.map((row, key) => (
                                    <React.Fragment>
                                        <Grid item xs={4} sm={4}>{materialList[key]?.detail?.code} {materialList[key]?.detail?.material_name}</Grid>
                                        <Grid item xs={1} sm={1}>{row.qty} {row.unit}</Grid>
                                        <Grid item xs={1} sm={1}>{usedList[key]?.qty} {row.unit}</Grid>
                                        <Grid item xs={2} sm={2}>
                                            <TextField 
                                                name="qty" 
                                                type="number" 
                                                variant="outlined" 
                                                inputProps={{ 
                                                    min: 0,
                                                    max: row.qty-usedList[key]?.qty
                                                }}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">{row.unit}</InputAdornment>
                                                }}
                                                error={errorText.error[key]?.msg} 
                                                helperText={errorText.error[key]?.msg} 
                                                onChange={(e) => onMaterialInput(e,key,row.material_id,null)} 
                                            />
                                        </Grid>
                                        <Grid item xs={4} sm={4}>
                                        <FileUploadComponent1 
                                            id="image"
                                            path="material-history"
                                            fileUploaded={(url) => onMaterialInput(null,key,row.material_id,url)}
                                            url={inputList[key]?.image}
                                            deleteFile={() => onMaterialInput(null,key,row.material_id,null)}/>
                                        </Grid>
                                    </React.Fragment>
                            ))}
                        </Grid>
                    </Box>
                </Box>
                <Box className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={sendData}
                        disableElevation>
                        Save
                    </Button>
                </Box>
            </Card>
            <Backdrop className={classes.backdrop} open={isLoading}>
                    <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    </Modal> )
}