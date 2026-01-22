import { Button, Card, Grid, InputBase, InputLabel, MenuItem, Modal, Select, Typography } from "@material-ui/core";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { dateFormatInput } from "../../../../helpers/general";
import { getListDepoApi } from "../../../../services/api/depo.api";
import { getListCustomerApi } from "../../../../services/api/customer.api";
import { CircularProgressCustom } from "../../../base_component/spinner";
import { insertLeaseAgreementApi, updateLeaseAgreementApi } from "../../../../services/api/lease-agreement.api";
import { insertOneWayApi, updateOneWayApi } from "../../../../services/api/one-way.api";
import { masterDataSwr } from "../../../../services/swr/master-data.swr";

export default function OneWayForm(props) {

    const [formState, setFormState] = useState(null)

    const router = useRouter()
    const depoId = router.query.depoSlug

    const [typeOptions, setTypeOptions] = useState([])
    const [sizeOptions, setSizeOptions] = useState([])
    var masterSwr = masterDataSwr("")
    useEffect(() => {
        if(masterSwr?.data) {
        setTypeOptions(masterSwr?.data?.filter(val => val?.category == "container_type") ?? [])
        setSizeOptions(masterSwr?.data?.filter(val => val?.category == "container_size") ?? [])
        }
    }, [masterSwr?.data])
    
    useEffect(() => {
        if(props?.open) {
            if(props?.isEdit) {
                setFormState({
                    name: props?.data?.name,
                    originCity: props?.data?.origin_city,
                    destinationCity: props?.data?.destination_city,
                    qty: props?.data?.qty,
                    fromDate: dateFormatInput(props?.data?.from_date),
                    toDate: dateFormatInput(props?.data?.to_date),
                    size: sizeOptions?.find((val) => val.id == props?.size?.id),
                    type: typeOptions?.find((val) => val.id == props?.type?.id),
                    bookingNumber: props?.booking_number,
                    shipping: props?.shipping,
                })
            }
        }
    }, [props?.open])

    const [errorText, setErrorText] = useState(null)
    const [isLoading, setLoading] = useState(false)
    function onChangeInput(e) {
        if(e.target.name == "category") {
            setFormState({...formState, code: `${e.target.value.code}-`, [e.target.name]: e.target.value})
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
                name: formState?.name,
                origin_city: formState?.originCity,
                destination_city: formState?.destinationCity,
                from_date: moment(formState.fromDate),
                to_date: moment(formState.toDate),
                qty: parseInt(formState?.qty),
                size_id: formState?.size?.id,
                type_id: formState?.type?.id,
                booking_number: formState?.bookingNumber,
                shipping: formState?.shipping,
            }
            if(props?.isEdit) {
                updateOneWayApi(data, props?.data?.id).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataUpdated(res)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                insertOneWayApi(data).then((res) => {
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

    return <Modal
        open={props?.open}
        onClose={() => props?.closeModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div className="modal-wrapper" style={{width: "700px"}}>
            <Card className="modal">
                <div className="modal-header">
                    <h3>{props?.isEdit ? "Edit One Way" : "Add One Way"}</h3>
                </div>

                <div className="modal-content">
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">One Way Request Title</Typography>
                        </InputLabel>
                        <InputBase
                            name="name"
                            color="secondary"
                            className="input"
                            value={formState?.name}
                            placeholder="Title"
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <Grid container className="mt-3" spacing={3}>
                            <Grid item md={6}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Origin Location</Typography>
                                </InputLabel>
                                <InputBase
                                    name="originCity"
                                    color="secondary"
                                    className="input"
                                    value={formState?.originCity}
                                    placeholder=""
                                    onChange={onChangeInput}
                                    fullWidth>
                                </InputBase>
                            </Grid>
                            <Grid item md={6}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Destination Location</Typography>
                                </InputLabel>
                                <InputBase
                                    name="destinationCity"
                                    color="secondary"
                                    className="input"
                                    value={formState?.destinationCity}
                                    placeholder=""
                                    onChange={onChangeInput}
                                    fullWidth>
                                </InputBase>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Qty</Typography>
                        </InputLabel>
                        <InputBase
                            name="qty"
                            color="secondary"
                            className="input"
                            value={formState?.qty}
                            type="number"
                            placeholder="0"
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <Grid container className="mt-3" spacing={3}>
                            <Grid item md={6}>
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
                            </Grid>
                            <Grid item md={6}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">To Date</Typography>
                                </InputLabel>
                                <InputBase
                                    name="toDate"
                                    color="secondary"
                                    className="input"
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
                        <Grid container className="mt-3" spacing={3}>
                            <Grid item md={6}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Booking Number</Typography>
                                </InputLabel>
                                <InputBase
                                    name="bookingNumber"
                                    color="secondary"
                                    className="input"
                                    value={formState?.bookingNumber}
                                    placeholder=""
                                    onChange={onChangeInput}
                                    fullWidth>
                                </InputBase>
                            </Grid>
                            <Grid item md={6}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">Shipping</Typography>
                                </InputLabel>
                                <InputBase
                                    name="shipping"
                                    color="secondary"
                                    className="input"
                                    value={formState?.shipping}
                                    placeholder=""
                                    onChange={onChangeInput}
                                    fullWidth>
                                </InputBase>
                            </Grid>
                        </Grid>
                    </div>
                </div>
                
                <div className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => sendData()}
                        disableElevation>
                        {isLoading ? <CircularProgressCustom size={26} /> : (props?.isEdit ? "Edit One Way" : "Add One Way")}
                    </Button>
                </div>
            </Card>
        </div>
    </Modal>
}