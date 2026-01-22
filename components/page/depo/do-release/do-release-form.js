import { Button, Card, Divider, Grid, Icon, IconButton, InputBase, InputLabel, MenuItem, Modal, Select, Typography } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getListDepoApi } from "../../../../services/api/depo.api";
import { getListCustomerApi } from "../../../../services/api/customer.api";
import { insertDOReleaseApi, updateDOReleaseApi } from "../../../../services/api/do-release.api";
import { getDetailDepoSwr } from "../../../../services/swr/depo.swr";
import { masterDataSwr } from "../../../../services/swr/master-data.swr";
import { CircularProgressCustom } from "../../../base_component/spinner";
import { getListContainerStockSwr } from "../../../../services/swr/container-stock.swr";

export default function DOReleaseForm(props) {

    const [errorText, setErrorText] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [formState, setFormState] = useState(null)
    function onChangeInput(e) {
        var name = e.target.name
        var value = e.target.value
        var temp

        if(name == "category") {
            temp = {...formState, code: `${value.code}-`, [name]: value}
        } else if(name == "destination") {
            var cpArr = []
            value.cp.forEach((item) => {cpArr = [...cpArr, {name: item.name, telp: item.telp}]})
            temp = {...formState, [name]: value, pic: cpArr}
        } else {
            temp = {...formState, [name]: value}
        }
        setFormState(temp)
    }

    const router = useRouter()
    const depoId = router.query.depoSlug
    const [depo, setDepo] = useState([])
    const depoSwr = getDetailDepoSwr(depoId)
    useEffect(() => {
        setDepo(depoSwr?.data ?? [])
    }, [depoSwr.data])

    const [containerTypeOptions, setContainerTypeOptions] = useState([])
    const [sizeOptions, setSizeOptions] = useState([])
    var masterSwr = masterDataSwr("")
    useEffect(() => {
        if(masterSwr?.data) {
        setContainerTypeOptions(masterSwr?.data?.filter(val => val?.category == "container_type") ?? [])
        setSizeOptions(masterSwr?.data?.filter(val => val?.category == "container_size") ?? [])
        }
    }, [masterSwr?.data])

    const [depoDestinations, setDepoDestinations] = useState([])
    const [customers, setCustomers] = useState([])
    useEffect(() => {
        addPic()
        getListCustomerApi({page: 1, limit: 5000}).then(res => setCustomers(res?.result ?? []))
        getListDepoApi({
            page: 1, 
            limit: 200,
            orderBy: "name",
            order: "asc",
            // depoPartnerId: depoId
        }).then(res => setDepoDestinations(res?.result))
    }, [])

    const [stockContainers, setStockContainers] = useState([])
    var listContainerStockSwr = getListContainerStockSwr({
        page: 1, 
        limit: 5000,
        orderBy: "serial_number",
        order: "asc",
        size: formState?.size?.id,
        type: formState?.type?.id,
        depoId: formState?.destination?.id
    })
    useEffect(() => {
      if(listContainerStockSwr?.data?.result) {
        setStockContainers(listContainerStockSwr?.data?.result)
      }
    }, [listContainerStockSwr?.data])
    useEffect(() => {
      setFormState({...formState, stocks: []})
    }, [formState?.type, formState?.size, formState?.destination])
    
    useEffect(() => {
        if(props?.open) {
            if(props?.isEdit) {
                setFormState({
                    // category: categorySwr?.data?.result?.find((val) => val.id == props?.data?.category_id),
                    serialNumber: props?.data?.serial_number,
                    depo: depoDestinations?.find((val) => val.id == props?.data?.depo_id),
                    remarks: props?.data?.remarks,
                })
            }
        }
    }, [props?.open])

    function checkValidation() {
        var isValid = true
        return isValid
    }

    function sendData() {
        if(checkValidation()) {
            setLoading(true);
            console.log(formState)
            var data = {
                ...props?.data,
                depo_id : depo?.id,
                to_depo_id : formState?.destination?.id,
                pic : formState?.pic ?? [],
                release_date : moment(formState?.releaseDate),
                expired_date : moment(formState?.expiredDate),
                release_number : formState?.releaseNumber,
                customer_id : formState?.customer?.id,
                signature_id : formState?.signature?.id,
                size_id : formState?.size?.id,
                type_id : formState?.type?.id,
                stocks : formState?.stocks?.map(item => {
                    return {stock_id: item?.id}
                })
            }
            if(props?.isEdit) {
                updateDOReleaseApi(data, props?.data?.id).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataUpdated(res)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                insertDOReleaseApi(data).then((res) => {
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

    function addPic() {
        setFormState({...formState, pic: [...formState?.pic ?? [], {name: "", telp: ""}]})
    }
    
    function removePicByIndex(index) {
        formState?.pic?.splice(index, 1)
        setFormState({...formState, pic: [...formState?.pic]})
    }

    function addStockList(value) {
        var stock = formState?.stocks?.find((item) => item.id == value.id)
        if(stock == null && (parseInt(formState?.count) ?? 0) > (formState?.stocks?.length ?? 0)) {
            setFormState({...formState, stocks: [...formState?.stocks ?? [], value]})
        }
    }
    
    function removeStockListItemByIndex(index) {
        formState?.stocks?.splice(index, 1)
        setFormState({...formState, stocks: [...formState?.stocks]})
    }

    function closeModal() {
        setFormState(null)
        props?.closeModal()
    }

    return <Modal
        open={props?.open}
        onClose={() => closeModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div className="modal-wrapper" style={{width: "700px"}}>
            <Card className="modal">
                <div className="modal-header">
                    <h3>{props?.isEdit ? "Edit Do Release" : "Add Do Release"}</h3>
                </div>
                <div className="modal-content">
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Release Number</Typography>
                        </InputLabel>
                        <InputBase
                            name="releaseNumber"
                            color="secondary"
                            className="input uppercase"
                            value={formState?.releaseNumber}
                            placeholder="xx.xx.xx.xx"
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <Grid container spacing={3}>
                            <Grid item md={6}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Release Date</Typography>
                                </InputLabel>
                                <InputBase
                                    name="releaseDate"
                                    color="secondary"
                                    type="date"
                                    className="input uppercase"
                                    value={formState?.releaseDate}
                                    onChange={onChangeInput}
                                    fullWidth>
                                </InputBase>
                            </Grid>
                            <Grid item md={6}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Expired Date</Typography>
                                </InputLabel>
                                <InputBase
                                    name="expiredDate"
                                    color="secondary"
                                    type="date"
                                    className="input uppercase"
                                    value={formState?.expiredDate}
                                    onChange={onChangeInput}
                                    fullWidth>
                                </InputBase>
                            </Grid>
                        </Grid>
                    </div>
                    <Card className="mb-3 p-3 text-left" variant="outlined">
                        <div className="display-space-between mb-3">
                            <strong>Release From Depot</strong>
                        </div>
                        <div className="mb-3 text-left">
                            <InputLabel className="pb-1">
                                <Typography variant="caption">Depot</Typography>
                            </InputLabel>
                            <Select
                                labelId="demo-customized-select-label"
                                className="input"
                                placeholder="Select Depot"
                                fullWidth
                                name="destination"
                                value={formState?.destination ?? "none"}
                                onChange={onChangeInput}
                                input={<InputBase />}>
                                <MenuItem value="none"><em className="text-muted">Select Depo</em></MenuItem>
                                {depoDestinations?.map((val, i) => {
                                    return <MenuItem key={val?.id} value={val}>{val?.name}</MenuItem>
                                })}
                            </Select>
                        </div>
                        <Divider />
                        <div className="display-space-between mb-3 mt-3">
                            <strong>PIC</strong>
                            <IconButton size="small" onClick={() => addPic()}><Icon>add</Icon></IconButton>
                        </div>
                        {formState?.pic?.map((pic, index) => (<div className="text-left">
                            <Grid container spacing={3}>
                                <Grid item md={6}>
                                    {index == 0 && <InputLabel className="pb-1">
                                        <Typography variant="caption">Name</Typography>
                                    </InputLabel>}
                                    <InputBase
                                        name="releaseDate"
                                        color="secondary"
                                        className="input"
                                        value={formState?.pic[index]?.name}
                                        onChange={(e) => {
                                            formState.pic[index].name = e.target.value
                                            setFormState({...formState})
                                        }}
                                        fullWidth>
                                    </InputBase>
                                </Grid>
                                <Grid item md={6}>
                                    {index == 0 && <InputLabel className="pb-1">
                                        <Typography variant="caption">Telp</Typography>
                                    </InputLabel>}
                                    <InputBase
                                        name="expiredDate"
                                        color="secondary"
                                        className="input"
                                        value={formState?.pic[index]?.telp}
                                        onChange={(e) => {
                                            formState.pic[index].telp = e.target.value
                                            setFormState({...formState})
                                        }}
                                        fullWidth>
                                    </InputBase>
                                </Grid>
                            </Grid>
                        </div>))}
                    </Card>
                    <Card className="mb-3 p-3 text-left" variant="outlined">
                        <div className="display-space-between mb-3">
                            <strong>Stock to be released</strong>
                        </div>
                        <div className="mb-3 text-left">
                            <InputLabel className="pb-1">
                                <Typography variant="caption">Count</Typography>
                            </InputLabel>
                            <InputBase
                                name="count"
                                color="secondary"
                                className="input uppercase"
                                value={formState?.count}
                                placeholder="0"
                                type="number"
                                onChange={onChangeInput}
                                fullWidth>
                            </InputBase>
                        </div>
                        <div className="mb-3 text-left">
                            <Grid container spacing={3}>
                                <Grid item md={6}>
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">Size</Typography>
                                    </InputLabel>
                                    <Select
                                        labelId="demo-customized-select-label"
                                        className="input"
                                        placeholder="Select Size"
                                        fullWidth
                                        name="size"
                                        value={formState?.size ?? "none"}
                                        onChange={onChangeInput}
                                        input={<InputBase />}
                                        >
                                        <MenuItem value="none"><em className="text-muted">Select Size</em></MenuItem>
                                        {sizeOptions?.map((val, i) => {
                                            return <MenuItem key={val?.id} value={val}>{val?.name}</MenuItem>
                                        })}
                                    </Select>
                                </Grid>
                                <Grid item md={6}>
                                    <InputLabel className="pb-1">
                                        <Typography variant="caption">Type</Typography>
                                    </InputLabel>
                                    <Select
                                        labelId="demo-customized-select-label"
                                        className="input"
                                        placeholder="Select Type"
                                        fullWidth
                                        name="type"
                                        value={formState?.type ?? "none"}
                                        onChange={onChangeInput}
                                        input={<InputBase />}
                                        >
                                        <MenuItem value="none"><em className="text-muted">Select Type</em></MenuItem>
                                        {containerTypeOptions?.map((val, i) => {
                                            return <MenuItem key={val?.id} value={val}>{val?.name}</MenuItem>
                                        })}
                                    </Select>
                                </Grid>
                            </Grid>
                        </div>
                        {(formState?.count ?? 0) > 0 && <div>
                            <div className="display-space-between mb-3">
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Select Stock by Serial Number {formState?.stocks?.length ?? 0}/{formState?.count ?? 0}</Typography>
                                </InputLabel>
                                <Typography variant="caption">{stockContainers.length} stocks available</Typography>
                            </div>
                            <Autocomplete
                                id="combo-box-demo"
                                options={stockContainers}
                                className="input"
                                name="selectStockBySerialNumber"
                                value={null}
                                onChange={(event, value) => {
                                    addStockList(value)
                                    event.target.value = null
                                }}
                                getOptionLabel={(option) => `${option.serial_number} - ${option?.size?.name}/${option?.type?.name}`}
                                renderInput={(params) => (
                                    <div ref={params.InputProps.ref}>
                                        <InputBase className="input" placeholder="TIHU-XXXXXX" style={{width: "100%"}} type="text" {...params.inputProps} />
                                    </div>
                                )}/>
                        </div>}
                        <div className="mt-2" style={{maxHeight: "280px", overflow: "auto"}}>
                            {(formState?.stocks ?? []).map((stock, index) => (
                                <div>
                                    <div className="pt-2 pb-2 display-space-between">
                                        <div><small>{stock?.serial_number}</small></div>
                                        <div>
                                            <IconButton 
                                                className="icon"
                                                size="small"
                                                onClick={() => removeStockListItemByIndex(index)}
                                                >
                                                <Icon>close</Icon>
                                            </IconButton>
                                        </div>
                                    </div>
                                    <Divider/>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Customer</Typography>
                        </InputLabel>
                        <Select
                            labelId="demo-customized-select-label"
                            className="input"
                            placeholder="Select Customer"
                            fullWidth
                            name="customer"
                            value={formState?.customer ?? "none"}
                            onChange={onChangeInput}
                            input={<InputBase />}>
                            <MenuItem value="none"><em className="text-muted">Select Customer</em></MenuItem>
                            {customers?.map((val, i) => {
                                return <MenuItem key={val?.id} value={val}>{val?.name} - {val?.company}</MenuItem>
                            })}
                        </Select>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Remarks</Typography>
                        </InputLabel>
                        <InputBase
                            name="remarks"
                            color="secondary"
                            className="input"
                            value={formState?.remarks}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Signature</Typography>
                        </InputLabel>
                        <Select
                            labelId="demo-customized-select-label"
                            className="input"
                            placeholder=""
                            fullWidth
                            name="signature"
                            value={formState?.signature ?? "none"}
                            onChange={onChangeInput}
                            input={<InputBase />}>
                            <MenuItem value="none"><em className="text-muted">Select Depo</em></MenuItem>
                            {depo?.officers?.map((val, i) => {
                                return <MenuItem key={val?.id} value={val}>{val?.name}</MenuItem>
                            })}
                        </Select>
                    </div>
                </div>
                
                <div className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => sendData()}
                        disableElevation>
                        {isLoading ? <CircularProgressCustom size={26} /> : (props?.isEdit ? "Edit Do Release" : "Add Do Release")}
                    </Button>
                </div>
            </Card>
        </div>
    </Modal>
}