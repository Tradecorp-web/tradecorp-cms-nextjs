import { Button, Card, Grid, MenuItem, Modal, Typography, Box, TextField, Paper, List, ListItem, ListItemText, ListItemIcon, Checkbox, makeStyles, Backdrop, CircularProgress, IconButton, InputAdornment } from "@material-ui/core"
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Delete, Add } from '@material-ui/icons'
import React, { useEffect, useState } from "react"
import { savePwdApi } from "../../../services/api/pwd.api"
import { masterDataCategory, masterDataSwr } from "../../../services/swr/master-data.swr"
import { masterUserSwr } from "../../../services/swr/user.swr"

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

export default function PwdForm(props) {
    const classes = useStyles()

    const [teamList, setTeamList] = useState([])
    const [userList, setUserList] = useState([])

    const [optionTeam, setOptionTeam] = useState([])
    const [optionUser, setOptionUser] = useState([])

    const [teamInput, setTeamInput] = useState([])
    const [userInput, setUserInput] = useState([])

    const [errorText, setErrorText] = useState({category:null,app_url:null,username:null,password:null,teams:null,users:null})
    const [isLoading, setLoading] = useState(false)

    const [data, setData] = useState({id:null,category:null,app_url:null,username:null,password:null,teams:[],users:[]})
    const [title, setTitle] = useState({formTitle:"",buttonTitle:""})

    const [url, setUrl] = useState(false)

    const onInputChange = (event) => {
        setData({ ...data, [event.target.name]:event.target.value})
    }

    const onCatChange = (event,value) => {
        if (value == "URL") {
            setUrl(true)
        } else {
            setUrl(false)
        }
        setData({ ...data, category:value})
    }

    const onTeamChange = (event,value) => {
        setTeamInput(value)
        var list = []
        for (var i=0; i<value.length; i++) {
            list.push(value[i].id)
        }
        setData({ ...data, teams:list})
    }

    const onUserChange = (event,value) => {
        setUserInput(value)
        var list = []
        for (var i=0; i<value.length; i++) {
            list.push(value[i].id)
        }
        setData({ ...data, users:list})
    }

    var teamSwr = masterDataSwr(masterDataCategory.team,"id")
    var userSwr = masterUserSwr()

    useEffect(() => {
        if (teamSwr?.data) {
            setTeamList(teamSwr?.data ?? [])
        }
    }, [teamSwr])

    useEffect(() => {
        var list = []
        list.push({id:"",label:""})
        teamList.map((item,i) => {
            list.push({id:item.id,label:item.name})
        })
        setOptionTeam(list)
    }, [teamList])

    useEffect(() => {
        if (userSwr?.data?.result) {
            setUserList(userSwr?.data?.result ?? [])
        }
    }, [userSwr])

    useEffect(() => {
        var list = []
        list.push({id:"",label:""})
        userList.map((item,i) => {
            list.push({id:item.id,label:item.name})
        })
        setOptionUser(list)
    }, [userList])

    useEffect(() => {
        if (props.pwd != null) {
            setData({id:props.pwd.id,category:props.pwd.category,app_url:props.pwd.app_url,username:props.pwd.username,password:props.pwd.password,teams:props.pwd.teams,users:props.pwd.users})
            var team = []
            teamList?.map((item,key) => {
                props.pwd.teams?.map((i,k) => {
                    if (item.id == i) {
                        team.push({id:item.id,label:item.name})
                    }
                })
            })
            setTeamInput(team)
            var user = []
            userList?.map((item,key) => {
                props.pwd.users?.map((i,k) => {
                    if (item.id == i) {
                        user.push({id:item.id,label:item.name})
                    }
                })
            })
            setUserInput(user)
            setTitle({formTitle:"Edit Password",buttonTitle:"Save"})
            if (props.pwd.category == "URL") {
                setUrl(true)
            }
        } else {
            setData({id:null,category:null,app_url:null,username:null,password:null,teams:[],users:[]})
            setTeamInput([])
            setUserInput([])
            setTitle({formTitle:"New Password",buttonTitle:"Save"})
        }
    }, [props.open])

    function checkValidation() {
        var isValid = true
        var eCategory = "", eAppURL = "", eUsername = "", ePassword = "", eTeams = "", eUsers = ""
        if(data.category == "" || data.category == null) {
            isValid = false
            eCategory = "Category can not be empty"
        }
        if(data.app_url == "" || data.app_url == null) {
            isValid = false
            eAppURL = "App / URL can not be empty"
        }
        if(data.username == "" || data.username == null) {
            isValid = false
            eUsername = "Username can not be empty"
        }
        if(data.password == "" || data.password == null) {
            isValid = false
            ePassword = "Password can not be empty"
        }
        // if(data.teams.length == 0) {
        //     isValid = false
        //     eTeams = "Teams can not be empty"
        // }
        // if(data.users.length == 0) {
        //     isValid = false
        //     eUsers = "Users can not be empty"
        // }
        setErrorText({ ...errorText, category:eCategory, app_url:eAppURL, username:eUsername, password:ePassword, teams:eTeams, users:eUsers})
        return isValid
    }

    const sendData = () => {
        if(checkValidation()) {
            setLoading(true)
            savePwdApi(data).then((res) => {
                setData({id:null,app_url:null,username:null,password:null,teams:[],users:[]})
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
        setData({d:null,app_url:null,username:null,password:null,teams:[],users:[]})
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
                        <Autocomplete 
                            id="category"
                            freeSolo
                            options={["App","URL","[or free type]"]}
                            getOptionDisabled={(option) => option === "[or free type]"}
                            value={data.category}
                            renderInput={(params) => (
                                <TextField 
                                    {...params}
                                    required
                                    name="category"
                                    variant="outlined"
                                    label="Category"
                                    error={errorText.category} 
                                    helperText={errorText.category}
                                />
                            )}
                            onChange={(e,v) => onCatChange(e,v)} 
                        />
                    </Box>
                    <Box className="mb-3">
                        {url && 
                        <TextField 
                            name="app_url" 
                            label="App / URL" 
                            variant="outlined" 
                            defaultValue={data.app_url} 
                            required 
                            error={errorText.app_url} 
                            helperText={errorText.app_url} 
                            onChange={onInputChange} 
                            InputProps={{
                                startAdornment: <InputAdornment position="start">http://</InputAdornment>
                            }}
                            fullWidth 
                        />}
                        {url == false && 
                        <TextField 
                            name="app_url" 
                            label="App / URL" 
                            variant="outlined" 
                            defaultValue={data.app_url} 
                            required 
                            error={errorText.app_url} 
                            helperText={errorText.app_url} 
                            onChange={onInputChange} 
                            fullWidth 
                        />}
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="username" 
                            label="Username"
                            variant="outlined" 
                            defaultValue={data.username} 
                            required 
                            error={errorText.username} 
                            helperText={errorText.username} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                    <Box className="mb-3">
                        <TextField 
                            name="password" 
                            label="Password"
                            variant="outlined" 
                            defaultValue={data.password} 
                            required 
                            error={errorText.password} 
                            helperText={errorText.password} 
                            onChange={onInputChange} 
                            fullWidth 
                        />
                    </Box>
                    <h2 className="mb-3 mt-5">Share to</h2>
                    <Box className="mb-3">
                        <Autocomplete
                            multiple
                            options={optionTeam}
                            value={teamInput}
                            getOptionLabel={(option) => option?.label}
                            renderInput={(params) => (
                                <TextField 
                                    {...params}
                                    name="teams"
                                    variant="outlined"
                                    label="Teams"
                                    error={errorText.teams} 
                                    helperText={errorText.teams}
                                />
                            )}
                            onChange={(e,v) => onTeamChange(e,v)} 
                        />
                    </Box>
                    <Box className="mb-3">
                        <Autocomplete
                            multiple
                            options={optionUser}
                            value={userInput}
                            getOptionLabel={(option) => option?.label}
                            renderInput={(params) => (
                                <TextField 
                                    {...params}
                                    name="users"
                                    variant="outlined"
                                    label="Users"
                                    error={errorText.users} 
                                    helperText={errorText.users}
                                />
                            )}
                            onChange={(e,v) => onUserChange(e,v)} 
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