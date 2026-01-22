import { Button, Card, Grid, Radio, makeStyles, Modal, Typography, TextField, Box, FormGroup, FormControlLabel, Checkbox, Collapse } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState } from "react";
import { getCountryListSwr,getCityListSwr } from "../../../services/swr/countries-cities.swr";
import { saveDepoGroupApi } from "../../../services/api/depo-group.api";
import { CircularProgressCustom } from "../../base_component/spinner";
import { checkNull } from "../../../helpers/general";
import { masterUserSwr } from "../../../services/swr/user.swr"

const useStyles = makeStyles((theme) => ({
    root: {
        margin: "auto",
    },
    choiceUnselect: {
        margin: "auto",
        border: "1px solid black",
        padding: 10,
        opacity: 0.4,
    },
    choiceSelect: {
        margin: "auto",
        border: "1px solid black",
        padding: 10,
        opacity: 1,
    },
}));

export default function DepoGroupForm(props) {
    const classes = useStyles()

    const [data, setData] = useState({
        id: null,
        group_name: null,
        country_id: null,
        not_include_country: [],
        default: null,
        users: [],
    })
    const [title, setTitle] = useState({formTitle:"", buttonTitle:""})
    const [idData, setIdData] = useState(null)

    const [choiceCountry, setChoiceCountry] = useState(0)
    const [choiceClass, setChoiceClass] = useState([classes.choiceUnselect,classes.choiceUnselect])

    const [countryList, setCountryList] = useState([])
    const [countryOptions, setCountryOptions] = useState([])
    const [countryInput, setCountryInput] = useState([])

    const [userList, setUserList] = useState([])
    const [optionUser, setOptionUser] = useState([])
    const [userInput, setUserInput] = useState([])

    var countrySwr = getCountryListSwr("")
    useEffect(() => {
        if (countrySwr?.data) {
            var list = []
            list.push({ id: "", label: "" })
            countrySwr.data.map((item, i) => {
              list.push({ id: item.id, label: item.name })
            })
            setCountryList(countrySwr.data)
            setCountryOptions(list)
        }
    }, [countrySwr?.data])

    var userSwr = masterUserSwr({limit:999})
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
        if(props?.open) {
            if(props?.data != null) {
                var selectCountry = null
                if (props.data.country_id != null && props.data.country_id != undefined && props.data.country_id > 0) {
                    countryOptions.map((item,i) => {
                        if (item.id == props.data.country_id) {
                            selectCountry = item
                        }
                    })
                }
                var user = []
                userList?.map((item,key) => {
                    props.data.users?.map((i,k) => {
                        if (item.id == i) {
                            user.push({id:item.id,label:item.name})
                        }
                    })
                })
                var country = []
                countryList?.map((item,key) => {
                    props.data.not_include_country?.map((i,k) => {
                        if (item.id == i) {
                            country.push({id:item.id,label:item.name})
                        }
                    })
                })
                setData({
                    id: props.data.id,
                    group_name: props.data.group_name,
                    country_id: props.data.country_id,
                    selected_country: selectCountry,
                    not_include_country: props.data.not_include_country,
                    default: props.data.default,
                    users: props.data.users,
                })
                setIdData(props.data.id)
                if (props.data.country_id > 0) {
                    setChoiceCountry(1)
                    setChoiceClass([classes.choiceSelect, classes.choiceUnselect])
                } else if (props.data.not_include_country.length > 0) {
                    setChoiceCountry(2)
                    setChoiceClass([classes.choiceUnselect, classes.choiceSelect])
                }
                setUserInput(user)
                setCountryInput(country)
                setTitle({formTitle:"Edit Location", buttonTitle:"Save Location"})
            } else {
                setData({
                    id: null,
                    group_name: null,
                    country_id: null,
                    selected_country: null,
                    not_include_country: [],
                    default: null,
                    users: [],
                })
                setIdData(null)
                setChoiceCountry(0)
                setChoiceClass([classes.choiceUnselect, classes.choiceUnselect])
                setUserInput([])
                setCountryInput([])
                setTitle({formTitle:"Add New Location", buttonTitle:"Add Location"})
            }
        }
    }, [props?.open])

    const onChangeInput = (e) => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const handleChoice = (event) => {
        setChoiceCountry(event.target.value)
        if (event.target.value == 1) {
            setChoiceClass([classes.choiceSelect, classes.choiceUnselect])
            setData({...data, not_include_country: []})
            setCountryInput([])
        } else if (event.target.value == 2) {
            setChoiceClass([classes.choiceUnselect, classes.choiceSelect])
            setData({...data, country_id: null, selected_country: null})
        }
      }

    const onCountryChange = async (event, value) => {
        setData({...data, country_id: value?.id ?? null, selected_country: value ?? null, group_name: value?.label ?? null})
    }

    const onExcludeChange = (event, value) => {
        setCountryInput(value)
        var list = []
        for (var i=0; i<value.length; i++) {
            list.push(value[i].id)
        }
        setData({ ...data, not_include_country:list})
    }

    const onCheck = (e) => {
        if (e.target.checked) {
            setData({...data, [e.target.name]: e.target.checked, users:[]})
        } else {
            setData({...data, [e.target.name]: e.target.checked})
        }
    }

    const onUserChange = (event, value) => {
        setUserInput(value)
        var list = []
        for (var i=0; i<value.length; i++) {
            list.push(value[i].id)
        }
        setData({ ...data, users:list})
    }

    const [errorText, setErrorText] = useState({
        group_name: null,
        country_id: null,
        not_include_country: null,
        default: null,
        users: null,
    })
    const [isLoading, setLoading] = useState(false)

    function checkValidation() {
        var isValid = true
        var eGroupName = ""
        if (data.group_name == "" || data.group_name == null) {
            isValid = false
            eGroupName = "Group Name can not be empty"
        }
        setErrorText({...errorText, group_name:eGroupName})
        return isValid
    }

    function sendData() {
        if (checkValidation()) {
            setLoading(true)
            saveDepoGroupApi(data,idData)
            .then((res) => {
                setData({
                    id: null,
                    group_name: null,
                    country_id: null,
                    selected_country: null,
                    not_include_country: [],
                    default: null,
                    users: [],
                })
                setLoading(false)
                props?.closeModal()
            })
            .catch((err) => {
                console.log(err)
                props?.alert(err)
                setLoading(false)
            })
        }
    }

    function closeModal() {
        setData({
            id: null,
            group_name: null,
            country_id: null,
            selected_country: null,
            not_include_country: [],
            default: null,
            users: [],
        })
        props?.closeModal()
    }

    return <Modal
        open={props?.open}
        onClose={() => props?.closeModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <Box className="modal-wrapper" style={{width: "700px"}}>
            <Card className="modal">
                <Box className="modal-header">
                    <h3>{title.formTitle}</h3>
                </Box>
                <Box className="modal-content">
                    <Box className="mb-3 text-left">
                        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                            <Grid item xs={6} sm={6}>
                                <Grid item xs={12} sm={12} className={choiceClass[0]}>
                                    <Grid container>
                                        <Grid item xs={2} sm={2}>
                                            <Radio
                                                checked={choiceCountry == 1}
                                                onChange={handleChoice}
                                                value={1}
                                                name="choice_container"
                                            />
                                        </Grid>
                                        <Grid item xs={10} sm={10}>
                                            <Typography variant="h3">Select a Country</Typography>
                                            <Typography variant="body2">Choose specific country</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <Grid item xs={12} sm={12} className={choiceClass[1]}>
                                    <Grid container>
                                        <Grid item xs={2} sm={2}>
                                            <Radio
                                                checked={choiceCountry == 2}
                                                onChange={handleChoice}
                                                value={2}
                                                name="choice_container"
                                            />
                                        </Grid>
                                        <Grid item xs={10} sm={10}>
                                            <Typography variant="h3">All Countries except...</Typography>
                                            <Typography variant="body2">Choose which country to exclude</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                    <Collapse in={choiceCountry == 1} timeout="auto" unmountOnExit>
                        <Box className="mb-3 text-left">
                            <Autocomplete
                                options={countryOptions}
                                autoHighlight
                                value={data.selected_country}
                                getOptionLabel={(option) => option?.label}
                                renderOption={(option) => (<React.Fragment>{option?.label}</React.Fragment>)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Country"
                                        name="country_id"
                                        variant="outlined"
                                        size="small"
                                        error={errorText.country_id? true : false}
                                        helperText={errorText.country_id}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        fullWidth
                                    />
                                )}
                                onChange={(e, v) => onCountryChange(e, v)}
                            />
                        </Box>
                    </Collapse>
                    <Collapse in={choiceCountry == 2} timeout="auto" unmountOnExit>
                        <Box className="mb-3 text-left">
                            <Autocomplete
                                multiple
                                options={countryOptions}
                                value={countryInput}
                                getOptionLabel={(option) => option?.label}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params}
                                        name="not_include_country"
                                        variant="outlined"
                                        label="Exclude country"
                                        error={errorText.not_include_country? true : false} 
                                        helperText={errorText.not_include_country}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        fullWidth
                                    />
                                )}
                                onChange={(e,v) => onExcludeChange(e,v)} 
                            />
                        </Box>
                    </Collapse>
                    <Box className="mb-3 text-left">
                        <TextField
                            label="Location Name"
                            name="group_name"
                            variant="outlined"
                            size="small"
                            required
                            value={checkNull(data.group_name)}
                            error={errorText.group_name? true : false} 
                            helperText={errorText.group_name}
                            onChange={onChangeInput}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                        />
                    </Box>
                    <Box className="mb-3 text-left">
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox checked={data.default} onChange={onCheck} name="default" />}
                                label="All users can view"
                            />
                        </FormGroup>
                    </Box>
                    <Collapse in={data.default ? false : true} timeout="auto" unmountOnExit>
                        <Box className="mb-3 text-left">
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
                                        label="Users who can view"
                                        error={errorText.users? true : false} 
                                        helperText={errorText.users}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        fullWidth
                                    />
                                )}
                                onChange={(e,v) => onUserChange(e,v)} 
                            />
                        </Box>
                    </Collapse>
                </Box>
                
                <Box className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => sendData()}
                        disableElevation>
                        {isLoading ? <CircularProgressCustom size={26} /> : title.buttonTitle}
                    </Button>
                </Box>
            </Card>
        </Box>
    </Modal>
}