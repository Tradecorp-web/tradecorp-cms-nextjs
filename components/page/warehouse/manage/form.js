import { Button, Card, Grid, MenuItem, Modal, Typography, Box, TextField, Paper, List, ListItem, ListItemText, ListItemIcon, Checkbox, makeStyles, Backdrop, CircularProgress } from "@material-ui/core"
import { useEffect, useState } from "react"
import { saveWHApi } from "../../../../services/api/warehouse.api"
import { masterUserSwr } from "../../../../services/swr/user.swr"

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

export default function WarehouseForm(props) {
    const classes = useStyles()

    const [userList, setUserList] = useState([])
    const [user, setUser] = useState(null)

    const [errorText, setErrorText] = useState({warehouse_name:null,pic_id:null,remark:null})
    const [isLoading, setLoading] = useState(false)

    const [data, setData] = useState({id:null,warehouse_name:null,pic_id:null,remark:null})

    const [title, setTitle] = useState({formTitle:"",buttonTitle:""})

    const onInputChange = (event) => {
        setData({ ...data, pic_id: user, [event.target.name]:event.target.value})
    }

    const onUserChange = (event) => {
        setUser(event.target.value)
        setData({ ...data, pic_id: event.target.value})
    }
    
    var userSwr = masterUserSwr()
    
    useEffect(() => {
        if (userSwr?.data) {
            setUserList(userSwr?.data?.result ?? [])
        }
    }, [userSwr])

    useEffect(() => {
        if (props.warehouse != null) {
            setData({id:props.warehouse.id,warehouse_name:props.warehouse.warehouse_name,pic_id:props.warehouse.pic_id,remark:props.warehouse.remark})
            setUser(props.warehouse.pic_id)
            setTitle({formTitle:"Edit Warehouse",buttonTitle:"Save Warehouse"})
        } else {
            setData({id:null,warehouse_name:null,pic_id:null,remark:null})
            setUser(null)
            setTitle({formTitle:"Add Warehouse",buttonTitle:"Add Warehouse"})
        }
    }, [props.open])

    function checkValidation() {
        var isValid = true
        var eWarehousename = "", ePIC = "", eRemark = ""
        if(data.warehouse_name == "" || data.warehouse_name == null) {
            isValid = false
            eWarehousename = "Warehouse can not be empty"
        }
        if(data.pic_id == "" || data.pic_id == null) {
            isValid = false
            ePIC = "Please select PIC"
        }
        // if(data.remark == "" || data.remark == null) {
        //     isValid = false
        //     eRemark = "Remark can not be empty"
        // }
        setErrorText({ ...errorText, warehouse_name:eWarehousename, pic_id:ePIC, remark:eRemark})
        return isValid
    }

    const sendData = () => {
        if(checkValidation()) {
            setLoading(true)
            saveWHApi(data).then((res) => {
                setData({id:null,warehouse_name:null,pic_id:null,remark:null})
                setUser(null)
                setLoading(false)
                props?.closeModal()
            }).catch((err) => {
                console.log(err)
                //setErrorText(err)
                setLoading(false)
            })
        }
    }

    const closeForm = () => {
        setData({id:null,warehouse_name:null,pic_id:null,remark:null})
        setUser(null)
        props?.closeModal()
    }

    return ( <Modal
        open={props?.open}
        onClose={closeForm}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <Box className="modal-wrapper" style={{width: "700px"}}>
            <Card className="modal">
                <Box className="modal-header">
                    <h3>{title.formTitle}</h3>
                </Box>
                <Box className="modal-content">
                    <h2 className="mb-3">Details</h2>
                    <Box className="mb-3">
                        <TextField 
                            name="warehouse_name" 
                            label="Warehouse" 
                            variant="outlined" 
                            defaultValue={data.warehouse_name} 
                            required 
                            error={errorText.warehouse_name} 
                            helperText={errorText.warehouse_name} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="pic_id" 
                            select
                            label="PIC" 
                            variant="outlined" 
                            value={user} 
                            required 
                            error={errorText.pic_id} 
                            helperText={errorText.pic_id} 
                            onChange={onUserChange} 
                            fullWidth 
                        >
                        <MenuItem value={null}><em>None</em></MenuItem>
                        {userList?.map((row, key) => {
                            return <MenuItem value={row.id}>
                                {row?.name}
                            </MenuItem>
                        })}
                        </TextField>
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="remark" 
                            label="Remarks" 
                            variant="outlined" 
                            defaultValue={data.remark} 
                            error={errorText.remark} 
                            helperText={errorText.remark} 
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