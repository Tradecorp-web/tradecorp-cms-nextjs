import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Delete,Edit } from '@material-ui/icons'
import { List,ListItem,ListItemText,ListItemSecondaryAction,Grid,IconButton,Typography,Button,Dialog,DialogTitle,DialogContent,DialogActions,TextField } from '@material-ui/core'
import AlertDialog from "../base_component/dialog"

window.objects
window.scenes
window.selObject
window.design

const useStyles = makeStyles((theme) => ({
    listFont: {
        fontSize: '12px',
        width: '180px',
        color: '#88181B'
    },
    listHeadFont: {
        fontSize: '14px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#88181B'
    },
    listTotal: {
        fontSize: '14px',
        fontWeight: 'bold'
    },
    listTitle: {
        marginTop: '15px',
        textTransform: 'uppercase'
    },
    pageTitle: {
        color: '#88181B',
        margin: '20px'
    }
}))

export default function Details() {
    const classes = useStyles()
    const [listMat, setListMat] = React.useState([])
    const [selMat, setSelMat] = React.useState(null)
    const [open, setOpen] = React.useState(false)
    const [name, setName] = React.useState(null)
    const [openDialog, setOpenDialog] = React.useState(false)

    const selectMaterial = (id) => {
        setSelMat(id)
        window.scenes.selectObject(id)
    }

    const editName = (id) => {
        setSelMat(id)
        window.scenes.selectObject(id)
        for (var i=0; i<window.objects.length; i++) {
            if (window.objects[i].uuid == id) {
                setName(window.objects[i].userData.label)
                setOpen(true)
            }
        }
    }

    const confirmDelete = (id) => {
        setSelMat(id)
        window.scenes.selectObject(id)
        for (var i=0; i<window.objects.length; i++) {
            if (window.objects[i].uuid == id) {
                setName(window.objects[i].userData.label)
                setOpenDialog(true)
            }
        }
    }

    const onInputChange = (event) => {
        setName(event.target.value)
    }

    const close = () => {
        setOpen(false)
    }

    const saveRename = () => {
        for (var i=0; i<window.objects.length; i++) {
            if (window.objects[i].uuid == window.selObject) {
                window.objects[i].userData.label = name
            }
        }
        for (var i=0; i<window.design.length; i++) {
            if (window.design[i].uuid == window.selObject) {
                window.design[i].label = name
            }
        }
        setOpen(false)
    }

    const deleteMaterial = () => {
        window.scenes.deleteObject(selMat)
        setOpenDialog(false)
    }

    useEffect(() => {
        setListMat(window.objects)
    }, [window.objects])

    return (
        <Grid container>
            <Grid item xs={12} sm={12}>
                <Typography variant="h4" align="center" className={classes.listTitle}>Component List</Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
                <List>
                    <ListItem>
                        <ListItemText primary="Product" className={classes.listHeadFont} disableTypography={true} />
                        <ListItemText primary="Price" className={classes.listHeadFont} disableTypography={true} />
                    </ListItem>
                    {listMat?.map((item) => (
                        <ListItem button
                        selected={window.selObject == item.uuid}
                        onClick={() => selectMaterial(item.uuid)}>
                            <ListItemText primary={item.userData.label} className={classes.listFont} disableTypography={true} />
                            <ListItemText primary="Rp. xx.xxx.xxx,-" className={classes.listFont} disableTypography={true} />
                            <ListItemSecondaryAction>
                                {item.name != "container" &&
                                <IconButton edge="end">
                                    <Edit fontSize="small" onClick={() => editName(item.uuid)} />
                                    <Delete fontSize="small" onClick={() => confirmDelete(item.uuid)} />
                                </IconButton>}
                            </ListItemSecondaryAction>
                        </ListItem>
                    )) ?? ""}
                    <ListItem>
                        <ListItemText primary="Estimation Price" className={classes.listTotal} disableTypography={true} />
                        <ListItemText primary="Rp. xx.xxx.xxx,-" className={classes.listTotal} disableTypography={true} />
                    </ListItem>
                </List>
            </Grid>
            <Grid item xs={12} sm={12} align="center">
                <Button variant="contained" color="primary" fullWidth={true}>Submit</Button>
            </Grid>
            <Grid item xs={12} sm={12} align="center">
            <Typography variant="h2" align="center" className={classes.pageTitle}>3D Mockup</Typography>
            </Grid>
            <Dialog open={open} aria-describedby="alert-dialog-description">
                <DialogTitle id="form-dialog-title"><Typography variant="h1">Rename Component</Typography></DialogTitle>
                <DialogContent>
                    <TextField 
                        name="name" 
                        label="Name" 
                        variant="outlined" 
                        defaultValue={name}  
                        onChange={onInputChange} 
                        fullWidth 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} color="default" disableElevation>Cancel</Button>
                    <Button onClick={saveRename} color="primary" variant="contained" disableElevation autoFocus>Save</Button>
                </DialogActions>
            </Dialog>
            <AlertDialog open={openDialog} cancelAction={() => setOpenDialog(false)} okAction={() => deleteMaterial()} title="Delete confirmation" body={"Are you sure want to delete "+name+"?"} />
        </Grid>
    )
}