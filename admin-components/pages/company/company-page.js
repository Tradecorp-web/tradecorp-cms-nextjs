import { Button, Select, MenuItem, Grid, InputBase, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { accountApi } from "../../../services/api/account.api";
import { getDetailCompanyApi, getListCompanyOfficeApi, updateCompanyApi } from "../../../services/api/company.api";
import AdminBaseLayout from "../../base_layout/admin_base_layout";
import { CircularProgressCustom } from "../../../components/base_component/spinner";

export default function Page(props) {
    
    const [isLoading, setLoading] = useState(false)
    const [formState, setFormState] = useState(null)
    function onChangeInput(e) {
        setFormState({...formState, [e.target.name]: e.target.value})
    }
    const [errorTextState, setErrorTextState] = useState(null)

    const [account, setAccount] = useState(null)
    useEffect(async () => {
        var res = await accountApi()
        setAccount(res)

        var comp = await getDetailCompanyApi(res?.company?.id)
        setCompany(comp)
        
        var offc = await getListCompanyOfficeApi({ page: 1, limit: 200, orderBy: "office_name", order: "asc" })
        setOffices(offc?.result)

        console.log(comp)
        setFormState({
            head_office_id: comp.head_office_id,
            name: comp.name,
            country: comp.country,
            website: comp.website,
        })
        console.log({
            head_office_id: comp.head_office_id,
            name: comp.name,
            country: comp.country,
            website: comp.website,
        })
    }, [])
    
    const [offices, setOffices] = useState([])
    const [company, setCompany] = useState(null)

    function isValid() {
        var err = {}
        var isValid = true
        if(formState?.name == null || formState?.name == "") {
            err = {...err, name: "Company name can't be empty"}
            isValid = false
        }
        if(formState?.country == null || formState?.country == "") {
            err = {...err, country: "Country can't be empty"}
            isValid = false
        }
        if(formState?.head_office_id == null || formState?.head_office_id == "") {
            err = {...err, head_office_id: "Head Office can't be empty"}
            isValid = false
        }
        console.log(err)
        setErrorTextState(err)
        return isValid
    }

    const saveChanges = async () => {
        if(isValid()) {
            setLoading(true)
            try {
                var res = await updateCompanyApi(formState)
            } catch (err) {
                setErrorTextState({...errorTextState, error: err})
            }
            setLoading(false)
        }
    }

    return <AdminBaseLayout title="Company">
        <Grid container>
            <Grid item lg={6}>
                <div className="card card-hover mb-3">
                    <h3 className="mb-4">Company Information</h3>
                    <form noValidate autoComplete="off">
                        <div className="mb-3">
                            <Typography variant="body2" className="mb-2" paragraph>Company Name</Typography>
                            <InputBase
                                color="secondary"
                                className="input"
                                placeholder="Company Name"
                                name="name"
                                value={formState?.name}
                                error={errorTextState?.name}
                                onChange={onChangeInput}
                                fullWidth>
                            </InputBase>
                            <small className="text-error">{errorTextState?.name}</small>
                        </div>
                        <div className="mb-4">
                            <Typography variant="body2" className="mb-2" paragraph>Country</Typography>
                            <InputBase
                                color="secondary"
                                className="input"
                                placeholder="Country"
                                name="country"
                                value={formState?.country}
                                error={errorTextState?.country}
                                onChange={onChangeInput}
                                fullWidth>
                            </InputBase>
                            <small className="text-error">{errorTextState?.country}</small>
                        </div>
                        <div className="mb-4">
                            <Typography variant="body2" className="mb-2" paragraph>Webiste</Typography>
                            <InputBase
                                color="secondary"
                                className="input"
                                placeholder="Country"
                                name="website"
                                value={formState?.website}
                                error={errorTextState?.website}
                                onChange={onChangeInput}
                                fullWidth>
                            </InputBase>
                            <small className="text-error">{errorTextState?.website}</small>
                        </div>
                        <div className="mb-3 text-left">
                            <Typography variant="body2" className="mb-2" paragraph>Head Office</Typography>
                            <Select
                                labelId="demo-customized-select-label"
                                className="input"
                                placeholder="Select Vendor"
                                fullWidth
                                name="head_office_id"
                                value={formState?.head_office_id ?? "none"}
                                error={errorTextState?.head_office_id}
                                onChange={onChangeInput}
                                input={<InputBase />}>
                                <MenuItem value="none"><em className="text-muted">Select Office</em></MenuItem>
                                {offices?.map((val, i) => {
                                    return <MenuItem key={val?.id} value={val?.id}>{val?.office_name}</MenuItem>
                                })}
                            </Select>
                            <small className="text-error">{errorTextState?.head_office_id}</small>
                        </div>
                        <div className="text-center mb-3"><small className="text-error">{errorTextState?.error}</small></div>
                        <Grid
                            justify="center"
                            container>
                            <Button 
                                variant="contained" 
                                size="large"
                                color="primary"
                                fullWidth={true}
                                disabled={isLoading}
                                onClick={saveChanges}
                                disableElevation={true}>
                                {isLoading ? <CircularProgressCustom size={26} /> : "Save Changes"}
                            </Button>
                        </Grid>
                    </form>
                </div>
            </Grid>
        </Grid>
    </AdminBaseLayout>
}