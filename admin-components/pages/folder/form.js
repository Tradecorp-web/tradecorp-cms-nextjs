import { Button, Card, Grid, MenuItem, Modal, Typography, Box, TextField, Paper, List, ListItem, ListItemText, ListItemIcon, Checkbox, makeStyles, Backdrop, CircularProgress, IconButton, InputAdornment, FormControl, InputLabel, Input, Select, Chip } from "@material-ui/core"
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Delete, Add } from '@material-ui/icons'
import React, { useEffect, useState } from "react"
import { saveFolderApi } from "../../../services/api/folder.api"
import { masterDataCategory, masterDataSwr } from "../../../services/swr/master-data.swr"
import { masterUserSwr } from "../../../services/swr/user.swr"
import Moment from 'moment'

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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
  }))

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        },
    },
};

export default function FolderForm(props) {
    const classes = useStyles()

    const [teamList, setTeamList] = useState([])
    const [userList, setUserList] = useState([])

    const [teamInput, setTeamInput] = useState([])
    const [userInput, setUserInput] = useState([])

    const [errorText, setErrorText] = useState({folder_name:null,teams:null,users:null})
    const [isLoading, setLoading] = useState(false)

    const [data, setData] = useState({id:null,folder_name:null,teams:[],users:[]})
    const [title, setTitle] = useState({formTitle:"",buttonTitle:""})

    const onInputChange = (event) => {
        setData({ ...data, [event.target.name]:event.target.value})
    }

    const onTeamChange = (event) => {
        setTeamInput(event.target.value)
        var list = []
        var raw = event.target.value
        for (var i=0; i<raw.length; i++) {
            list.push(raw[i].id)
        }
        setData({ ...data, teams:list})
    }

    const onUserChange = (event) => {
        setUserInput(event.target.value)
        var list = []
        var raw = event.target.value
        for (var i=0; i<raw.length; i++) {
            list.push(raw[i].id)
        }
        setData({ ...data, users:list})
    }

    var teamSwr = masterDataSwr(masterDataCategory.team)
    var userSwr = masterUserSwr()

    useEffect(() => {
        if (teamSwr?.data) {
            setTeamList(teamSwr?.data ?? [])
        }
    }, [teamSwr])

    useEffect(() => {
        if (userSwr?.data?.result) {
            setUserList(userSwr?.data?.result ?? [])
        }
    }, [userSwr])

    useEffect(() => {
        if (props.folder != null) {
            setData({id:props.folder.id,folder_name:props.folder.folder_name,teams:props.folder.teams,users:props.folder.users})
            var team = []
            teamList?.map((item,key) => {
                props.folder.teams?.map((i,k) => {
                    if (item.id == i) {
                        team.push(item)
                    }
                })
            })
            setTeamInput(team)
            var user = []
            userList?.map((item,key) => {
                props.folder.users?.map((i,k) => {
                    if (item.id == i) {
                        user.push(item)
                    }
                })
            })
            setUserInput(user)
            setTitle({formTitle:"Edit Folder Share",buttonTitle:"Save"})
        } else {
            setData({id:null,folder_name:null,teams:[],users:[]})
            setTeamInput([])
            setUserInput([])
            setTitle({formTitle:"Add New Folder",buttonTitle:"Save"})
        }
    }, [props.open])

    function checkValidation() {
        var isValid = true
        var eName = "", eTeams = "", eUsers = ""
        if(data.folder_name == "" || data.folder_name == null) {
            isValid = false
            eName = "Folder Name can not be empty"
        }
        // if(data.teams.length == 0) {
        //     isValid = false
        //     eTeams = "Teams can not be empty"
        // }
        // if(data.users.length == 0) {
        //     isValid = false
        //     eUsers = "Users can not be empty"
        // }
        setErrorText({ ...errorText, folder_name:eName, teams:eTeams, users:eUsers})
        return isValid
    }

    const sendData = () => {
        if(checkValidation()) {
            setLoading(true)
            saveFolderApi(data).then((res) => {
                setData({id:null,folder_name:null,teams:[],users:[]})
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
        setData({id:null,folder_name:null,teams:[],users:[]})
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
                    <h2 className="mb-3">Details</h2>
                    <Box className="mb-3">
                        <TextField 
                            name="folder_name" 
                            label="Folder Name" 
                            variant="outlined" 
                            defaultValue={data.folder_name} 
                            required 
                            error={errorText.folder_name} 
                            helperText={errorText.folder_name} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                    <h2 className="mb-3 mt-5">Share to</h2>
                    <Box className="mb-3">
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="team-label">Teams</InputLabel>
                            <Select
                                labelId="team-label"
                                name="teams"
                                multiple
                                value={teamInput}
                                onChange={onTeamChange}
                                input={<Input id="select-multiple-chip" />}
                                renderValue={(selected) => (
                                    <Box className={classes.chips}>
                                        {selected.map((value,key) => (
                                            <Chip key={value.id} label={value?.name} className={classes.chip} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                                >
                                {teamList.map((row, key) => (
                                    <MenuItem key={row.id} value={row} >
                                        {row?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box className="mb-3">
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="user-label">Users</InputLabel>
                            <Select
                                labelId="user-label"
                                name="users"
                                multiple
                                value={userInput}
                                onChange={onUserChange}
                                input={<Input id="select-multiple-chip" />}
                                renderValue={(selected) => (
                                    <Box className={classes.chips}>
                                        {selected.map((value,key) => (
                                            <Chip key={value.id} label={value?.name} className={classes.chip} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                                >
                                {userList.map((row, key) => (
                                    <MenuItem key={row.id} value={row} >
                                        {row?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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