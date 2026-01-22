import React from 'react'
import BaseLayout from '../../base_layout/base-layout'
import { ThreeDRotation,OpenWith } from '@material-ui/icons'
import Router from 'next/router'
import { Container,Grid,Menu,MenuList,MenuItem,Box,Card,Icon,Typography,CardActionArea,ButtonGroup,Button,List,ListItem,ListItemIcon,ListItemText,Backdrop,CircularProgress,Dialog,DialogTitle,DialogContent,DialogActions,TextField } from '@material-ui/core'
import Scene from '../../3d/scene'
import Tools from '../../3d/tools'
import Detail from '../../3d/detail'
import { getDesignApi,saveDesignApi } from "../../../services/api/3d.api"
import getRoute from '../../../helpers/router'
import Loading from '../../../components/helper/loading'

window.orbit
window.scenes
window.orbitOff
window.design

class Design extends React.Component {
    constructor(props, context) {
        super(props, context)

        this.state = {
            trans: true,
            camView: true,
            open: false,
            loaded: false,
            dialog: false,
            id: null,
            name: null,
            client: null,
            data: null
        }

        if (props.design) {
            if (props.design.length > 0) {
                getDesignApi(props.design).then((data) => {
                    this.setState({ ...this.state, loaded: true, id: props.design, name: data.name, client: data.client, data: data.data})
                }).catch((err) => {
                    console.log(err)
                    this.setState({ ...this.state, loaded: true})
                })
            }
        }
        
        //const classes = useStyle()
        //const [selTransMode, setTransMode] = React.useState({trans: true})
        //const [switchView, setSwitchView] = React.useState({camView: true})

        //const [moveChk, setMoveChk] = React.useState({moveCam: true})
    }

    componentDidMount = () => {
        if (!this.props.design) {
            this.setState({ ...this.state, loaded: true})
        }
    }

    // componentWillUnmount = () => {
    //     document.removeEventListener("contextmenu", this.handleContextMenu)
    // }

    openPage = (url) => {
        Router.push(url)
    }

    openDialog = () => {
        this.setState({ ...this.state, dialog: true})
    }

    onInputChange = (event) => {
        this.setState({ ...this.state, [event.target.name]:event.target.value})
    }

    handleClose = () => {
        this.setState({ ...this.state, dialog: false})
    }

    saveDesign = () => {
        this.setState({ ...this.state, dialog: false, open: true})
        var data = { id: this.state.id, name: this.state.name, client: this.state.client, data: JSON.stringify(window.design) }
        saveDesignApi(data).then((res) => {
            this.setState({ ...this.state, id: res, open: false})
        }).catch((err) => {
            console.log(err)
            //setErrorText(err)
            this.setState({ ...this.state, open: false})
        })
        // console.log(window.design)
        // var test = JSON.stringify(window.design)
        // console.log(test)
        // console.log(JSON.parse(test))
    }

    transClick = () => {
        if (this.state.trans) {
            this.setState({ ...this.state, trans: false})
        } else {
            this.setState({ ...this.state, trans: true})
        }
        window.scenes.toggleTransMode()
    }
    
    viewClick = () => {
        if (this.state.camView) {
            this.setState({ ...this.state, camView:false})
            //setMoveChk({moveCam:false})
        } else {
            this.setState({ ...this.state, camView:true})
        }
        //window.orbit.enabled = !switchView.moveCam
        //window.orbitOff = switchView.moveCam
        window.scenes.switchCamera()
    }

    /*const toggleCam = () => {
        if (moveChk.moveCam) {
            setMoveChk({moveCam:false})
        } else {
            setMoveChk({moveCam:true})
        }
        window.orbit.enabled = !moveChk.moveCam
        window.orbitOff = moveChk.moveCam
    }*/

    clickAddObj = (type) => {
        window.scenes.addObject(type)
        this.setState({ ...this.state, trans: this.state.trans})
    }

    refreshRender = () => {
        this.setState({ ...this.state, trans: this.state.trans})
    }

    render = () => {
        var classes = {
            topContainer: {
                padding: '0 50px',
                backgroundColor: '#f2f2f2'
            },
            topMenu: {
                display: 'flex',
                padding: 0
            },
            topMenuItem: {
                fontWeight: 'bold',
                width: '120px',
                justifyContent: 'center'
            },
            mainDesign: {
                position: 'relative'
            },
            transToolbar: {
                position: 'absolute',
                top: '10px',
                left: '40px'
            },
            camToolbar: {
                position: 'absolute',
                top: '10px',
                right: '40px'
            },
            camFont: {
                fontSize: '12px'
            },
            backdrop: {
                zIndex: 999,
                color: '#fff'
            },
            textfield: {
                marginBottom: '20px'
            }
        }

        if (!this.state.loaded) {
            return <Loading />
        }
        
        return (
            <BaseLayout title="3D Design">
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} style={classes.topContainer}>
                        <MenuList style={classes.topMenu}>
                            <MenuItem style={classes.topMenuItem} onClick={() => this.openPage(getRoute("3d"))}>Home</MenuItem>
                            <MenuItem style={classes.topMenuItem} onClick={this.openDialog}>Save</MenuItem>
                            <MenuItem style={classes.topMenuItem}>Reset</MenuItem>
                            <MenuItem style={classes.topMenuItem}>Delete</MenuItem>
                        </MenuList>
                    </Grid>
                    <Grid item xs={12} sm={12}>

                    </Grid>
                    <Grid item xs={12} sm={2} id="side_tool">
                        <Tools clickDoor={() => this.clickAddObj("door")} clickWindow={() => this.clickAddObj("window")} clickACOut={() => this.clickAddObj("ac-outdoor")} />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Container style={classes.mainDesign}>
                            <List style={classes.transToolbar}>
                                <ListItem button
                                selected={this.state.trans === true}
                                onClick={this.transClick}>
                                    <ListItemIcon><OpenWith/></ListItemIcon>
                                </ListItem>
                                <ListItem button
                                selected={this.state.trans === false}
                                onClick={this.transClick}>
                                    <ListItemIcon><ThreeDRotation/></ListItemIcon>
                                </ListItem>
                            </List>
                            <List style={classes.camToolbar}>
                                <ListItem button
                                selected={this.state.camView === true}
                                onClick={this.viewClick}>
                                    <ListItemText primary="Perspective" style={classes.camFont} disableTypography={true} />
                                </ListItem>
                                <ListItem button
                                selected={this.state.camView === false}
                                onClick={this.viewClick}>
                                    <ListItemText primary="Top View" style={classes.camFont} disableTypography={true} />
                                </ListItem>
                            </List>
                            <Scene refresh={this.refreshRender} data={this.state.data} />
                        </Container>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Detail />
                    </Grid>
                </Grid>
                <Backdrop style={classes.backdrop} open={this.state.open}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Dialog open={this.state.dialog} aria-describedby="alert-dialog-description">
                    <DialogTitle id="form-dialog-title"><Typography variant="h1">3D Design Info</Typography></DialogTitle>
                    <DialogContent>
                        <TextField style={classes.textfield}
                            name="name" 
                            label="Name" 
                            variant="outlined" 
                            defaultValue={this.state.name}  
                            onChange={this.onInputChange} 
                            fullWidth 
                        />
                        <TextField style={classes.textfield}
                            name="client" 
                            label="Client" 
                            variant="outlined" 
                            defaultValue={this.state.client}  
                            onChange={this.onInputChange} 
                            fullWidth 
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="default" disableElevation>Cancel</Button>
                        <Button onClick={this.saveDesign} color="primary" variant="contained" disableElevation autoFocus>Save 3D Design</Button>
                    </DialogActions>
                </Dialog>
            </BaseLayout>
        )
    }
}

export default Design