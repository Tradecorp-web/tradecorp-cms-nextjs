import { Button, Card, Grid, Icon, IconButton, InputBase, InputLabel, Modal, Typography, TextField, Box, Radio } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState } from "react";
import { getCountryListSwr,getCityListSwr } from "../../../services/swr/countries-cities.swr";
import { insertDepoApi, updateDepoApi } from "../../../services/api/depo.api";
import { getDetailDepoGroupApi } from "../../../services/api/depo-group.api";
import { CircularProgressCustom } from "../../base_component/spinner";

export default function DepoForm(props) {

    const [formState, setFormState] = useState(null)

    const [cityParam, setCityParam] = useState(102)
    const [countryOptions, setCountryOptions] = useState([])
    const [cityOptions, setCityOptions] = useState([])
    const [countryList, setCountryList] = useState([])
    const [groupData, setGroupData] = useState(null)
    const [choiceDepot, setChoiceDepot] = useState(0)

    useEffect(async () => {
        try {
            var data = await getDetailDepoGroupApi(props.group)
            setGroupData(data)
        } catch(err) {
            console.log(err)
        }
    }, [])

    var countrySwr = getCountryListSwr()
    useEffect(() => {
    
        if (countrySwr?.data && (groupData?.country_id || groupData?.not_include_country)) {
            var country = []
            if (groupData.country_id > 0) {
                country = countrySwr.data.filter(val => val?.id == groupData.country_id)
            } else if (groupData.not_include_country.length > 0) {
                country = countrySwr.data
                groupData.not_include_country.map((item, i) => {
                    country = country.filter(val => val?.id != item)
                })
            }
            var list = []
            list.push({ id: "", label: "" })
            country.map((item, i) => {
              list.push({ id: item.id, label: item.name })
            })
            setCountryList(country)
            setCountryOptions(list)
        }
       
        if(  groupData != null ){
             if(groupData?.not_include_country?.length == 0 && groupData.country_id < 1){
                var country = countrySwr?.data
                var list = []
                list.push({ id: "", label: "" })
                if(country != undefined){
                    country.map((item, i) => {
                        list.push({ id: item.id, label: item.name })
                      })
                      setCountryList(country)
                      setCountryOptions(list)
                }
                
             }
        }
    }, [countrySwr?.data, groupData])

    var citySwr = getCityListSwr(cityParam)
    useEffect(() => {
        if (citySwr?.data) {
            var city = [...cityOptions]
            var list = []
            citySwr.data.cities.map((item, i) => {
              list.push({ id: item.id, label: item.name })
            })
            city[cityParam] = {id:cityParam, cities:list}
            setCityOptions(city)
            if (cityParam == 102) {
                // Australia
                setCityParam(14)
            } else if (cityParam == 14) {
                // Hong Kong
                setCityParam(98)
            } else if (cityParam == 98) {
                // US
                setCityParam(233)
            }
        }
    }, [citySwr?.data])

    useEffect(() => {
        if(props?.open) {
            if(props?.isEdit) {
                console.log(props?.data)
                var selectCountry = null
                var selectCity = null
                if (props.data.country_id != null && props.data.country_id != undefined && props.data.country_id > 0) {
                    countryOptions.map((item,i) => {
                        if (item.id == props.data.country_id) {
                            selectCountry = item
                        }
                    })
                    if (props.data.city_id != null && props.data.city_id > 0) {
                        var city = [...cityOptions]
                        if (city[props.data.country_id] == undefined) {
                            setCityParam(props.data.country_id)
                        }
                        city[props.data.country_id]?.cities.map((item,i) => {
                            if (item.id == props.data.city_id) {
                                selectCity = item
                            }
                        })
                    }
                }
                setFormState({
                    name: props?.data?.name,
                    address: props?.data?.address,
                    selected_country: selectCountry,
                    country_id: props?.data?.country_id,
                    selected_city: selectCity,
                    city_id: props?.data?.city_id,
                    is_own: props?.data?.is_own,
                    telp: props?.data?.telp,
                    fax: props?.data?.fax,
                    postalCode: props?.data?.postal_code,
                    email: props?.data?.email,
                    cp: props?.data?.cp ?? [],
                })
                if (props?.data?.is_own == true) {
                    setChoiceDepot(1)
                } else if (props?.data?.is_own == false) {
                    setChoiceDepot(2)
                }
            } else {
                setFormState(null)
                setChoiceDepot(0)
            }
        }
    }, [props?.open])

    const onCountryCityChange = async (event, value, tipe) => {
        if (tipe == "country") {
            setFormState({...formState, country_id: value?.id ?? null, selected_country: value ?? null})
            if (value != null) {
                var city = [...cityOptions]
                if (city[value.id] == undefined) {
                    setCityParam(value.id)
                }
            }
        } else if (tipe == "city") {
            setFormState({...formState, city_id: value?.id ?? null, selected_city: value ?? null})
        }
    }

    const handleChoice = (event) => {
        var val = event.target.value == 1 ? true : false 
        setChoiceDepot(event.target.value)
        setFormState({...formState, is_own: val})
    }

    const [errorText, setErrorText] = useState(null)
    const [isLoading, setLoading] = useState(false)
    function onChangeInput(e) {
        setFormState({...formState, [e.target.name]: e.target.value})
    }

    function checkValidation() {
        var isValid = true
        return isValid
    }

    function sendData() {
        if(checkValidation()) {
            setLoading(true);
            var data = {
                ...props?.data,
                name: formState?.name,
                address: formState?.address,
                country_id: formState?.country_id,
                city_id: formState?.city_id,
                is_own: formState?.is_own,
                depo_group_id:props?.group,
                depo_partner_id: props?.depoPartnerId ?? null,
                telp: formState?.telp,
                fax: formState?.fax,
                postal_code: formState?.postalCode,
                email: formState?.email,
                cp : formState?.cp ?? [],
            }
            if(props?.isEdit) {
                updateDepoApi(data, props?.data?.id).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataUpdated(res)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                insertDepoApi(data).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataInserted(res)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            }
        }
    }

    function closeModal() {
        setFormState(null)
        props?.closeModal()
    }

    const onCPChange = (event, i) => {
        var list = [...formState.cp]
        list[i][event.target.name] = event.target.value
        setFormState({...formState, cp: list})
      }
    
    const clickAddRow = () => {
        setFormState({...formState, cp: [...formState?.cp ?? [], {name: "", email: "", telp: ""}]})
    }
    
    function clickRemoveRow(index) {
        var list = [...formState.cp]
        list.splice(index, 1)
        setFormState({...formState, cp: list})
    }

    return <Modal
        open={props?.open}
        onClose={() => props?.closeModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <Box className="modal-wrapper" style={{width: "700px"}}>
            <Card className="modal">
                <Box className="modal-header">
                    <h3>{props?.isEdit ? "Edit Depot" : "Add Depot"}</h3>
                </Box>

                <Box className="modal-content">
                    <Box className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Name</Typography>
                        </InputLabel>
                        <TextField
                            name="name"
                            variant="outlined"
                            size="small"
                            required
                            value={formState?.name}
                            placeholder="Depo Name"
                            onChange={onChangeInput}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                        />
                    </Box>
                    <Box className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Address</Typography>
                        </InputLabel>
                        <TextField
                            name="address"
                            variant="outlined"
                            size="small"
                            value={formState?.address}
                            onChange={onChangeInput}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                        />
                    </Box>
                    <Box className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Country</Typography>
                        </InputLabel>
                        <Autocomplete
                            options={countryOptions}
                            autoHighlight
                            value={formState?.selected_country}
                            getOptionLabel={(option) => option?.label}
                            renderOption={(option) => (<React.Fragment>{option?.label}</React.Fragment>)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    name="country_id"
                                    variant="outlined"
                                    size="small"
                                    error={errorText?.country_id? true : false}
                                    fullWidth
                                />
                            )}
                            onChange={(e, v) => onCountryCityChange(e, v, "country")}
                        />
                    </Box>
                    <Box className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">City</Typography>
                        </InputLabel>
                        <Autocomplete
                            options={cityOptions[formState?.country_id]?.cities ?? [{id: "", label: ""}]}
                            autoHighlight
                            value={formState?.selected_city}
                            getOptionLabel={(option) => option?.label}
                            renderOption={(option) => (<React.Fragment>{option?.label}</React.Fragment>)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    name="city_id"
                                    variant="outlined"
                                    size="small"
                                    error={errorText?.city_id? true : false}
                                    fullWidth
                                />
                            )}
                            onChange={(e, v) => onCountryCityChange(e, v, "city")}
                        />
                    </Box>
                    <Box className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Postal Code</Typography>
                        </InputLabel>
                        <TextField
                            name="postalCode"
                            variant="outlined"
                            size="small"
                            value={formState?.postalCode}
                            placeholder="Postal Code"
                            onChange={onChangeInput}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                        />
                    </Box>
                    <Box className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Phone</Typography>
                        </InputLabel>
                        <TextField
                            name="telp"
                            variant="outlined"
                            size="small"
                            value={formState?.telp}
                            onChange={onChangeInput}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                        />
                    </Box>
                    <Box className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Fax</Typography>
                        </InputLabel>
                        <TextField
                            name="fax"
                            variant="outlined"
                            size="small"
                            value={formState?.fax}
                            onChange={onChangeInput}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                        />
                    </Box>
                    <Box className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">E-mail</Typography>
                        </InputLabel>
                        <TextField
                            name="email"
                            variant="outlined"
                            size="small"
                            value={formState?.email}
                            onChange={onChangeInput}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                        />
                    </Box>
                    <Card className="mb-3 p-1 text-left" variant="outlined">
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={6}>
                                <Grid item xs={12} sm={12}>
                                    <Grid container justify="center" alignItems="center">
                                        <Grid item xs={2} sm={2}>
                                            <Radio
                                                checked={choiceDepot == 1}
                                                onChange={handleChoice}
                                                value={1}
                                                name="choice_own"
                                            />
                                        </Grid>
                                        <Grid item xs={10} sm={10}>
                                            <Typography variant="body2">Depot owned by Tradecorp</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <Grid item xs={12} sm={12}>
                                    <Grid container justify="center" alignItems="center">
                                        <Grid item xs={2} sm={2}>
                                            <Radio
                                                checked={choiceDepot == 2}
                                                onChange={handleChoice}
                                                value={2}
                                                name="choice_own"
                                            />
                                        </Grid>
                                        <Grid item xs={10} sm={10}>
                                            <Typography variant="body2">3rd party depot</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                    <Card className="mb-3 p-2 text-left" variant="outlined">
                        <Box className="mb-3 display-space-between">
                            <strong>Contact Persons</strong>
                            <IconButton size="small" onClick={() => clickAddRow()}><Icon>add</Icon></IconButton>
                        </Box>
                        <Box className="mb-1 text-left">
                            <Grid container spacing={2} justify="center" alignItems="center">
                            {formState?.cp?.map((cp, index) => (
                                <React.Fragment>
                                    <Grid item md={4}>
                                        <TextField
                                            name="name"
                                            label="Name"
                                            variant="outlined"
                                            size="small"
                                            value={formState?.cp[index]?.name}
                                            onChange={(e) => onCPChange(e,index)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item md={4}>
                                        <TextField
                                            name="email"
                                            label="E-mail"
                                            variant="outlined"
                                            size="small"
                                            value={formState?.cp[index]?.email}
                                            onChange={(e) => onCPChange(e,index)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item md={3}>
                                        <TextField
                                            name="telp"
                                            label="Phone"
                                            variant="outlined"
                                            size="small"
                                            value={formState?.cp[index]?.telp}
                                            onChange={(e) => onCPChange(e,index)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item md={1}>
                                        <IconButton size="small" onClick={() => clickRemoveRow(index)}><Icon>delete</Icon></IconButton>
                                    </Grid>
                                </React.Fragment>))}
                            </Grid>
                        </Box>
                    </Card>
                </Box>
                
                <Box className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => sendData()}
                        disableElevation>
                        {isLoading ? <CircularProgressCustom size={26} /> : (props?.isEdit ? "Save Depot" : "Add Depot")}
                    </Button>
                </Box>
            </Card>
        </Box>
    </Modal>
}