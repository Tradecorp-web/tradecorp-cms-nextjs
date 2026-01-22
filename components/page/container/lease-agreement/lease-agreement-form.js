import { Button, Card, Grid, Icon, IconButton, InputBase, InputLabel, Link, MenuItem, Modal, Select, Typography } from "@material-ui/core";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { dateFormatInput } from "../../../../helpers/general";
import { getListDepoApi } from "../../../../services/api/depo.api";
import { getListCustomerApi } from "../../../../services/api/customer.api";
import { CircularProgressCustom } from "../../../base_component/spinner";
import { insertLeaseAgreementApi, updateLeaseAgreementApi } from "../../../../services/api/lease-agreement.api";
import { FileViewComponent1 } from "../../../base_component/file-upload";
import getRoute from "../../../../helpers/router";
import { accountSwr } from "../../../../services/swr/account.swr";

export default function LeaseAgreementForm(props) {

    const [formState, setFormState] = useState(null)
    const account = accountSwr()

    const router = useRouter()

    function toOtherPage(e, slug) {
        e.preventDefault()
        router.push(slug)
    }

    const periodDurationOptions = ["Daily", "Weekly", "Monthly", "Annual"]

    const [depoOptions, setDepoOptions] = useState([])
    const [customerOptions, setCustomerOptions] = useState([])
    useEffect(() => {
        getListDepoApi({
            page: 1, 
            limit: 200,
            orderBy: "name",
            order: "asc",
        }).then(res => {
            setDepoOptions(res?.result ?? [])
        })
        getListCustomerApi({
            page: 1, 
            limit: 200,
            orderBy: "name",
            order: "asc",
        }).then(res => {
            setCustomerOptions(res?.result ?? [])
        })
    }, [])
    
    useEffect(() => {
        if(props?.open) {
            if(props?.isEdit) {
                setFormState({
                    title: props?.data?.title,
                    depo: depoOptions?.find((val) => val.id == props?.data?.depo_id),
                    customer: customerOptions?.find((val) => val.id == props?.data?.customer_id),
                    fromDate: dateFormatInput(props?.data?.from_date),
                    duration: props?.data?.duration,
                    durationPeriod: props?.data?.duration_period,
                    toDate: dateFormatInput(props?.data?.to_date),
                    terminationNotice: dateFormatInput(props?.data?.termination_notice),
                    terminateDuration: props?.data?.terminate_duration,
                    terminateDurationPeriod: props?.data?.terminate_duration_period,
                    rentFee: props?.data?.rent_fee,
                    deposit: props?.data?.deposit,
                    status: props?.data?.status,
                    container_list: props?.data?.container_list,
                    emails: props?.data?.emails,
                    document: props?.data?.document,
                })
            } else {
                setFormState({...formState, emails: [...formState?.emails ?? [], account?.data?.email]})
            }
        }
    }, [props?.open])

    const [errorText, setErrorText] = useState(null)
    const [isLoading, setLoading] = useState(false)
    function onChangeInput(e) {
        if(e.target.name == "category") {
            setFormState({...formState, code: `${e.target.value.code}-`, [e.target.name]: e.target.value})
        } else if((e.target.name == "duration" && formState?.durationPeriod != null) || (e.target.name == "durationPeriod" && formState?.duration != null)) {
            var formStateTemp = {...formState, [e.target.name]: e.target.value}
            var duration = parseInt(formStateTemp?.duration)
            var period = "days"
            if(formStateTemp?.durationPeriod == "Daily") period = "days"
            if(formStateTemp?.durationPeriod == "Weekly") {
                duration *= 7
                period = "days"
            }
            if(formStateTemp?.durationPeriod == "Monthly") period = "months"
            if(formStateTemp?.durationPeriod == "Annual") period = "year"
            var toDate = moment(formStateTemp?.fromDate).add(duration, period);
            formStateTemp = {...formStateTemp, toDate: dateFormatInput(toDate)}
            setFormState({...formStateTemp})
        } else if((e.target.name == "terminateDuration" && formState?.terminateDurationPeriod != null) || (e.target.name == "terminateDurationPeriod" && formState?.terminateDuration != null)) {
            var formStateTemp = {...formState, [e.target.name]: e.target.value}
            var terminateDuration = parseInt(formStateTemp?.terminateDuration)
            var period = "days"
            if(formStateTemp?.terminateDurationPeriod == "Daily") period = "days"
            if(formStateTemp?.terminateDurationPeriod == "Weekly") {
                terminateDuration *= 7
                period = "days"
            }
            if(formStateTemp?.terminateDurationPeriod == "Monthly") period = "months"
            if(formStateTemp?.terminateDurationPeriod == "Annual") period = "year"
            var terminationNotice = moment(formStateTemp?.toDate).add(-(terminateDuration), period);
            formStateTemp = {...formStateTemp, terminationNotice: dateFormatInput(terminationNotice)}
            setFormState({...formStateTemp})
        } else {
            setFormState({...formState, [e.target.name]: e.target.value})
        }
    }

    function checkValidation() {
        var isValid = true
        return isValid
    }

    function sendData() {
        if(checkValidation()) {
            setLoading(true);
            var teu = 1;
            if(formState?.size?.name == '20') teu = 1;
            if(formState?.size?.name == '40') teu = 2;

            var data = {
                ...props?.data,
                title: formState?.title,
                depo_id: formState?.depo?.id,
                customer_id: formState?.customer?.id,
                from_date: moment(formState.fromDate),
                duration: parseInt(formState.duration),
                duration_period: formState.durationPeriod,
                to_date: moment(formState.toDate),
                termination_notice: moment(formState?.terminationNotice),
                terminate_duration: parseInt(formState.terminateDuration),
                terminate_duration_period: formState.terminateDurationPeriod,
                rent_fee: parseInt(formState?.rentFee),
                deposit: parseInt(formState?.deposit),
                status: formState?.status ?? "draft",
                container_list: formState?.container_list,
                emails: formState?.emails,
                document: formState?.document,
            }
            if(props?.isEdit) {
                updateLeaseAgreementApi(data, props?.data?.id).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataUpdated(res)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                insertLeaseAgreementApi(data).then((res) => {
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


    function addEmail() {
        setFormState({...formState, emails: [...formState?.emails ?? [], ""]})
    }
    
    function removeEmailByIndex(index) {
        formState?.emails?.splice(index, 1)
        setFormState({...formState, emails: [...formState?.emails]})
    }

    return <Modal
        open={props?.open}
        onClose={() => closeModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div className="modal-wrapper" style={{width: "700px"}}>
            <Card className="modal">
                <div className="modal-header">
                    <h3>{props?.isEdit ? "Edit Lease Agreement" : "Add Lease Agreement"}</h3>
                </div>

                <div className="modal-content">
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Lease Agreement Title</Typography>
                        </InputLabel>
                        <InputBase
                            name="title"
                            color="secondary"
                            className="input"
                            value={formState?.title}
                            placeholder="Title"
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Depo</Typography>
                        </InputLabel>
                        <Select
                            labelId="demo-customized-select-label"
                            className="input"
                            placeholder="Select Depo"
                            fullWidth
                            name="depo"
                            value={formState?.depo ?? "none"}
                            onChange={onChangeInput}
                            input={<InputBase />}>
                            <MenuItem value="none"><em className="text-muted">Select Depo</em></MenuItem>
                            {depoOptions?.map((val, i) => {
                                return <MenuItem key={val?.id} value={val}>{val?.name}</MenuItem>
                            })}
                        </Select>
                    </div>
                    <div className="mb-3 text-left">
                        <div className="display-space-between mb-2">
                            <InputLabel className="pb-1">
                                <Typography variant="caption">Customer</Typography>
                            </InputLabel>
                            <Link 
                                href={getRoute('customer')} target="_blank">
                                <div className="flex-center">
                                    <Icon className="me-2" fontSize="small">person_add</Icon> <small>Add Customer</small>
                                </div>
                            </Link>
                        </div>
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
                            {customerOptions?.map((val, i) => {
                                return <MenuItem key={val?.id} value={val}>{val?.company}</MenuItem>
                            })}
                        </Select>
                    </div>
                    <div className="mb-3 text-left">
                        <Grid container spacing={3}>
                            <Grid item md={6}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Rent Fee/unit</Typography>
                                </InputLabel>
                                <InputBase
                                    name="rentFee"
                                    color="secondary"
                                    className="input"
                                    value={formState?.rentFee}
                                    type="number"
                                    placeholder="0"
                                    onChange={onChangeInput}
                                    fullWidth>
                                </InputBase>
                            </Grid>
                            <Grid item md={6}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Deposit/unit</Typography>
                                </InputLabel>
                                <InputBase
                                    name="deposit"
                                    color="secondary"
                                    className="input"
                                    value={formState?.deposit}
                                    type="number"
                                    placeholder="0"
                                    onChange={onChangeInput}
                                    fullWidth>
                                </InputBase>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">From Date</Typography>
                        </InputLabel>
                        <InputBase
                            name="fromDate"
                            color="secondary"
                            className="input"
                            value={formState?.fromDate}
                            type="date"
                            placeholder="0"
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <Grid container spacing={3}>
                            <Grid item md={4}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Duration</Typography>
                                </InputLabel>
                                <InputBase
                                    name="duration"
                                    color="secondary"
                                    className="input"
                                    value={formState?.duration}
                                    placeholder="0"
                                    onChange={onChangeInput}
                                    fullWidth>
                                </InputBase>
                            </Grid>
                            <Grid item md={4}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Period {formState?.durationPeriod?.name}</Typography>
                                </InputLabel>
                                <Select
                                    labelId="demo-customized-select-label"
                                    className="input"
                                    placeholder="Select Period"
                                    fullWidth
                                    name="durationPeriod"
                                    value={formState?.durationPeriod ?? "none"}
                                    onChange={onChangeInput}
                                    input={<InputBase />}>
                                    <MenuItem value="none"><em className="text-muted">Select Period</em></MenuItem>
                                    {periodDurationOptions?.map((val, i) => {
                                        return <MenuItem key={i} value={val}>{val}</MenuItem>
                                    })}
                                </Select>
                            </Grid>
                            <Grid item md={4}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">To Date</Typography>
                                </InputLabel>
                                <InputBase
                                    name="toDate"
                                    color="secondary"
                                    className="input"
                                    disabled={true}
                                    value={formState?.toDate}
                                    type="date"
                                    placeholder="0"
                                    onChange={onChangeInput}
                                    fullWidth>
                                </InputBase>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="mb-3 text-left">
                        <Grid container spacing={3}>
                            <Grid item md={4}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Terminate Duration</Typography>
                                </InputLabel>
                                <InputBase
                                    name="terminateDuration"
                                    color="secondary"
                                    className="input"
                                    value={formState?.terminateDuration}
                                    placeholder="0"
                                    onChange={onChangeInput}
                                    fullWidth>
                                </InputBase>
                            </Grid>
                            <Grid item md={4}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Period {formState?.terminateDurationPeriod?.name}</Typography>
                                </InputLabel>
                                <Select
                                    labelId="demo-customized-select-label"
                                    className="input"
                                    placeholder="Select Period"
                                    fullWidth
                                    name="terminateDurationPeriod"
                                    value={formState?.terminateDurationPeriod ?? "none"}
                                    onChange={onChangeInput}
                                    input={<InputBase />}>
                                    <MenuItem value="none"><em className="text-muted">Select Period</em></MenuItem>
                                    {periodDurationOptions?.map((val, i) => {
                                        return <MenuItem key={i} value={val}>{val}</MenuItem>
                                    })}
                                </Select>
                            </Grid>
                            <Grid item md={4}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Termination Notice Date</Typography>
                                </InputLabel>
                                <InputBase
                                    name="terminationNotice"
                                    color="secondary"
                                    className="input"
                                    disabled={true}
                                    value={formState?.terminationNotice}
                                    type="date"
                                    placeholder="0"
                                    onChange={onChangeInput}
                                    fullWidth>
                                </InputBase>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="mb-3">
                        <FileViewComponent1
                            id="document"
                            url={formState?.document}
                            target="_blank" 
                            path="lease-agreement-document"
                            fileUploaded={(val) => {
                                setFormState({...formState, document: val})
                            }}
                            deleteFile={() => {
                                setFormState({...formState, document: null})
                            }}
                            name="Lease Agreement Document"/>
                    </div>
                    <div className="mb-3 text-left">
                        <div className="display-space-between pb-1">
                            <InputLabel>
                                <Typography variant="caption">Email list for notice</Typography>
                            </InputLabel>
                            <IconButton 
                                className="icon"
                                size="small"
                                onClick={addEmail}>
                                <Icon>add_circle</Icon>
                            </IconButton>
                        </div>
                        {formState?.emails?.map((val, index) => {
                            return <div className="mb-3">
                                <InputBase
                                    color="secondary"
                                    className="input"
                                    value={val}
                                    placeholder="Email"
                                    onChange={(e) => {
                                        formState.emails[index] = e.target.value
                                        setFormState({...formState})
                                    }}
                                    fullWidth>
                                </InputBase>
                            </div>
                        })}
                    </div>
                </div>
                
                <div className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => sendData()}
                        disableElevation>
                        {isLoading ? <CircularProgressCustom size={26} /> : (props?.isEdit ? "Edit Lease Agreement" : "Add Lease Agreement")}
                    </Button>
                </div>
            </Card>
        </div>
    </Modal>
}