import { Button, Card, Grid, MenuItem, Modal, Typography, Box, TextField, Paper, List, ListItem, ListItemText, ListItemIcon, Checkbox, makeStyles, Backdrop, CircularProgress, IconButton, InputAdornment } from "@material-ui/core"
import { Delete, Add } from '@material-ui/icons'
import React, { useEffect, useState } from "react"
import { getMasterDataApi, saveMasterDataApi } from "../../../../services/api/master-data.api"

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

export default function MasterForm(props) {
    const classes = useStyles()

    const [errorText, setErrorText] = useState({id:null,name:null,alias:null,category:null})
    const [isLoading, setLoading] = useState(false)
    const [optionCategory, setOptionCategory] = useState([])
    const [data, setData] = useState({id:null,name:null,alias:null,category:null})
    const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" })

    const onInputChange = (event) => {
        setData({...data,[event.target.name]: event.target.value})
    }

    useEffect(async () => {
        var data = await getMasterDataApi("", 0, 999)
        setOptionCategory(data?.result)
    }, [])

    useEffect(() => {
        if (props.master != null) {
            setData({id: props.master.id, name: props.master.name, alias: props.master.alias, category: props.master.category})
            if (props.master.id != null) {
                setTitle({ formTitle: "Edit Master Data", buttonTitle: "Save" })
            } else {
                setTitle({ formTitle: "Add Master Data", buttonTitle: "Add" })
            }
        } else {
            if (props.category != null) {
                setData({id:null,name:null,alias:null,category:props.category})
            } else {
                setData({id:null,name:null,alias:null,category:null})
            }
            setTitle({ formTitle: "Add Master Data", buttonTitle: "Add" })
        }
    }, [props.open])

    function checkValidation() {
        var isValid = true
        var eId = "", eName = "", eAlias = "", eCategory = ""
        // if (data.id == "" || data.id == null) {
        //     isValid = false
        //     eId = "ID can not be empty"
        // }
        if (data.name == "" || data.name == null) {
            isValid = false
            eName = "Name can not be empty"
        }
        // if(data.alias == "" || data.alias == null) {
        //     isValid = false
        //     eAlias = "Alias can not be empty"
        // }
        if(data.category == "" || data.category == null) {
            isValid = false
            eCategory = "Category can not be empty"
        }
        setErrorText({...errorText, id: eId, name: eName, alias: eAlias, category: eCategory})
        return isValid
    }

    const sendData = () => {
        if(checkValidation()) {
            setLoading(true)
            saveMasterDataApi(data).then((res) => {
                var out = {id:res,name:data.name,alias:data.alias,category:data.category}
                setData({id:null,name:null,alias:null,category:null})
                setLoading(false)
                props?.closeModal(out)
            }).catch((err) => {
                console.log(err)
                //setErrorText(err)
                setLoading(false)
            })
        }
    }

    const closeForm = () => {
        setData({id:null,name:null,alias:null,category:null})
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
                    <h3>{title.formTitle}</h3>
                </Box>
                <Box className="modal-content">
                    <Box className="mb-3">
                        <TextField 
                            name="id" 
                            label="ID" 
                            variant="outlined" 
                            defaultValue={data.id? data.id : "Generated"} 
                            disabled
                            error={errorText.id? true : false} 
                            helperText={errorText.id} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                    <Box className="mb-3">
                        <TextField
                            name="category"
                            label="Category"
                            select
                            variant="outlined"
                            value={data.category}
                            required
                            disabled={data.category? true : false}
                            InputLabelProps={{
                                shrink: data.category? true : false,
                            }}
                            error={errorText.category? true : false}
                            helperText={errorText.category} 
                            onChange={onInputChange}
                            fullWidth
                            >
                            {optionCategory?.map((row, key) => {
                                return (
                                    <MenuItem value={row?.category}>{row?.category}</MenuItem>
                                )
                            })}
                        </TextField>
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="name" 
                            label="Name" 
                            variant="outlined" 
                            defaultValue={data.name} 
                            required 
                            error={errorText.name? true : false} 
                            helperText={errorText.name} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="alias" 
                            label="Alias" 
                            variant="outlined" 
                            defaultValue={data.alias} 
                            error={errorText.alias? true : false} 
                            helperText={errorText.alias} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                </Box>
                <Box className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={sendData}
                        disableElevation>
                        {title.buttonTitle}
                    </Button>
                </Box>
            </Card>
            <Backdrop className={classes.backdrop} open={isLoading}>
                    <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    </Modal> )
}