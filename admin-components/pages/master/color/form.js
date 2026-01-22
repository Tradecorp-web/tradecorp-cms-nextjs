import { Button, Card, Grid, MenuItem, Modal, Typography, Box, TextField, Paper, List, ListItem, ListItemText, ListItemIcon, Checkbox, makeStyles, Backdrop, CircularProgress, IconButton, InputAdornment } from "@material-ui/core"
import { Delete, Add } from '@material-ui/icons'
import React, { useEffect, useState } from "react"
import { saveColorCodesApi } from "../../../../services/api/color-codes.api"
import { checkNull } from "../../../../helpers/general"

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

    const [errorText, setErrorText] = useState({ral_code:null,name_english:null,html_code:null,name_german:null,name_french:null,name_spanish:null,name_italian:null,name_nederlands:null})
    const [isLoading, setLoading] = useState(false)
    const [idData, setIdData] = useState(null)
    const [data, setData] = useState({ral_code:null,name_english:null,html_code:null,name_german:null,name_french:null,name_spanish:null,name_italian:null,name_nederlands:null})
    const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" })
    const [disable, setDisable] = useState(false)

    const onInputChange = (event) => {
        setData({...data,[event.target.name]: event.target.value})
    }

    useEffect(() => {
        if (props.color != null) {
            setData({ral_code:props.color.ral_code, name_english:props.color.name_english, html_code:props.color.html_code, name_german:props.color.name_german, name_french:props.color.name_french, name_spanish:props.color.name_spanish, name_italian:props.color.name_italian, name_nederlands:props.color.name_nederlands})
            setDisable(true)
            setIdData(props.color.ral_code)
            setTitle({ formTitle: "Edit Master Color", buttonTitle: "Save" })
        } else {
            setData({ral_code:null,name_english:null,html_code:null,name_german:null,name_french:null,name_spanish:null,name_italian:null,name_nederlands:null})
            setDisable(false)
            setIdData(null)
            setTitle({ formTitle: "Add Master Color", buttonTitle: "Add" })
        }
    }, [props.open])

    function checkValidation() {
        var isValid = true
        var eRALCode = "", eNameEnglish = ""
        if (data.ral_code == "" || data.ral_code == null) {
            isValid = false
            eRALCode = "RAL Code can not be empty"
        }
        if (data.name_english == "" || data.name_english == null) {
            isValid = false
            eNameEnglish = "Name English can not be empty"
        }
        setErrorText({...errorText, ral_code: eRALCode, name_english: eNameEnglish})
        return isValid
    }

    const sendData = () => {
        if (checkValidation()) {
            setLoading(true)
            saveColorCodesApi(data,idData).then((res) => {
                setData({ral_code:null,name_english:null,html_code:null,name_german:null,name_french:null,name_spanish:null,name_italian:null,name_nederlands:null})
                setLoading(false)
                props?.closeModal()
            }).catch((err) => {
                console.log(err)
                props?.alert(err)
                setLoading(false)
            })
        }
    }

    const closeForm = () => {
        setData({ral_code:null,name_english:null,html_code:null,name_german:null,name_french:null,name_spanish:null,name_italian:null,name_nederlands:null})
        props?.closeModal()
    }

    return ( <Modal
        open={props?.open}
        onClose={closeForm}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <Box className="modal-wrapper" style={{width: "500px"}}>
            <Card className="modal">
                <Box className="modal-header">
                    <h3>{title.formTitle}</h3>
                </Box>
                <Box className="modal-content">
                    <Box className="mb-3">
                        <TextField 
                            name="ral_code" 
                            label="RAL Code" 
                            variant="outlined" 
                            value={checkNull(data.ral_code)}
                            required
                            disabled={disable}
                            error={errorText.ral_code? true : false} 
                            helperText={errorText.ral_code} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="html_code" 
                            label="HTML Code" 
                            variant="outlined" 
                            value={checkNull(data.html_code)}
                            required
                            error={errorText.html_code? true : false} 
                            helperText={errorText.html_code} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="name_english" 
                            label="Name English" 
                            variant="outlined" 
                            value={checkNull(data.name_english)} 
                            required 
                            error={errorText.name_english? true : false} 
                            helperText={errorText.name_english} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="name_german" 
                            label="Name Deutsch" 
                            variant="outlined" 
                            value={checkNull(data.name_german)} 
                            required 
                            error={errorText.name_german? true : false} 
                            helperText={errorText.name_german} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="name_french" 
                            label="Name Francais" 
                            variant="outlined" 
                            value={checkNull(data.name_french)} 
                            required 
                            error={errorText.name_french? true : false} 
                            helperText={errorText.name_french} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="name_spanish" 
                            label="Name Espanol" 
                            variant="outlined" 
                            value={checkNull(data.name_spanish)} 
                            required 
                            error={errorText.name_spanish? true : false} 
                            helperText={errorText.name_spanish} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="name_italiano" 
                            label="Name Italiano" 
                            variant="outlined" 
                            value={checkNull(data.name_italian)} 
                            required 
                            error={errorText.name_italian? true : false} 
                            helperText={errorText.name_italian} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="name_nederlands" 
                            label="Name Nederlands" 
                            variant="outlined" 
                            value={checkNull(data.name_nederlands)} 
                            required 
                            error={errorText.name_nederlands? true : false} 
                            helperText={errorText.name_nederlands} 
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