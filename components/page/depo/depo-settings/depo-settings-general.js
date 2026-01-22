import { Button, Divider, InputBase, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getDetailDepoApi, updateDepoApi } from "../../../../services/api/depo.api";
import { CircularProgressCustom } from "../../../base_component/spinner";
import DepoSettingLayout from "./depo-settings-layout";

export default function DepoSettingGeneral() {

    const router = useRouter()

    const [depo, setDepo] = useState(null)
    const [formState, setFormState] = useState(null)
    const [errorText, setErrorText] = useState(null)
    var [isLoading, setLoading] = useState(true)
    function onChangeInput(e) {
        setFormState({...formState, [e.target.name]: e.target.value})
    }

    function getDepoData() {
        getDetailDepoApi(router.query.depoSlug).then((data) => {
            setDepo(data)
            setFormState({
                name: data?.name,
                address: data?.address,
                city: data?.city,
                telp: data?.telp,
                fax: data?.fax,
                country: data?.country,
                postalCode: data?.postal_code,
            })
            setLoading(false);
        }).catch((err) => {
            setLoading(false);
        })
    }

    useEffect(() => {
        getDepoData()
    }, [])

    function checkValidation() {
        var isValid = true
        return isValid
    }

    function sendData() {
        if(checkValidation()) {
            setLoading(true);
            var data = {
                name: formState?.name,
                address: formState?.address,
                city: formState?.city,
                telp: formState?.telp,
                fax: formState?.fax,
                country: formState?.country,
                postal_code: formState?.postalCode,
            }
            updateDepoApi(data, depo?.id).then((res) => {
                setLoading(false)
            }).catch((err) => {
                console.log(err)
                setErrorText(err)
                setLoading(false)
            })
        }
    }

    return <DepoSettingLayout>
        <Typography variant="h1" gutterBottom>Settings</Typography>
        <Divider />
        <div className="pt-5 pb-5">
            <div className="mb-3">
                <Typography variant="body2" className="mb-2" paragraph>Depo Name</Typography>
                <InputBase
                    color="secondary"
                    className="input input-large"
                    placeholder="Name"
                    name="name"
                    value={formState?.name}
                    onChange={onChangeInput}
                    fullWidth>
                </InputBase>
                <small className="text-error">{errorText?.name}</small>
            </div>
            <div className="mb-3">
                <Typography variant="body2" className="mb-2" paragraph>Address</Typography>
                <InputBase
                    color="secondary"
                    className="input input-large"
                    placeholder="Address"
                    name="address"
                    value={formState?.address}
                    onChange={onChangeInput}
                    fullWidth>
                </InputBase>
                <small className="text-error">{errorText?.address}</small>
            </div>
            <div className="mb-3">
                <Typography variant="body2" className="mb-2" paragraph>City</Typography>
                <InputBase
                    color="secondary"
                    className="input input-large"
                    placeholder="City"
                    name="city"
                    value={formState?.city}
                    onChange={onChangeInput}
                    fullWidth>
                </InputBase>
                <small className="text-error">{errorText?.city}</small>
            </div>
            <div className="mb-3">
                <Typography variant="body2" className="mb-2" paragraph>Country</Typography>
                <InputBase
                    color="secondary"
                    className="input input-large"
                    placeholder="Ex: Indonesia"
                    name="country"
                    value={formState?.country}
                    onChange={onChangeInput}
                    fullWidth>
                </InputBase>
                <small className="text-error">{errorText?.country}</small>
            </div>
            <div className="mb-3">
                <Typography variant="body2" className="mb-2" paragraph>Postal Code</Typography>
                <InputBase
                    color="secondary"
                    className="input input-large"
                    placeholder="Postal Code"
                    name="postalCode"
                    value={formState?.postalCode}
                    onChange={onChangeInput}
                    fullWidth>
                </InputBase>
                <small className="text-error">{errorText?.postalCode}</small>
            </div>
            <div className="mb-3">
                <Typography variant="body2" className="mb-2" paragraph>Telp</Typography>
                <InputBase
                    color="secondary"
                    className="input input-large"
                    placeholder="Telp"
                    name="telp"
                    value={formState?.telp}
                    onChange={onChangeInput}
                    fullWidth>
                </InputBase>
                <small className="text-error">{errorText?.telp}</small>
            </div>
            <div className="mb-3">
                <Typography variant="body2" className="mb-2" paragraph>Fax</Typography>
                <InputBase
                    color="secondary"
                    className="input input-large"
                    placeholder="Fax"
                    name="fax"
                    value={formState?.fax}
                    onChange={onChangeInput}
                    fullWidth>
                </InputBase>
                <small className="text-error">{errorText?.fax}</small>
            </div>
            <Button
                variant="contained"
                disableElevation
                className="ps-3 pe-3"
                disableElevation
                onClick={sendData}
                color="primary">
                {isLoading ? <CircularProgressCustom size={26} /> : "Save"}
            </Button>
        </div>
    </DepoSettingLayout>
}