import { Button, Grid, InputBase, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import AdminBaseLayout from "../../../base_layout/admin_base_layout";

export default function Page(props) {

    const [officeName, setOfficeName] = useState("")
    const [officeNameErrorText, setOfficeNameErrorText] = useState("")
    const [city, setCity] = useState("")
    const [cityErrorText, setCityErrorText] = useState("")
    const [address, setAddress] = useState("")
    const [addressErrorText, setAddressErrorText] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [errorText, setErrorText] = useState("")

    useEffect(() => {
        setOfficeNameErrorText("")
    }, [officeNameErrorText])

    useEffect(() => {
        setCityErrorText("")
    }, [cityErrorText])
    
    useEffect(() => {
        setAddressErrorText("")
    }, [addressErrorText])

    return <AdminBaseLayout title="Warehouse">
        <Grid container spacing={4}>
            <Grid item lg={4}>
                <div className="card card-hover mb-3">
                    <h3 className="mb-4">Warehouse Information</h3>
                    <form noValidate autoComplete="off">
                        <div className="mb-3">
                            <Typography variant="body2" className="mb-2" paragraph>Warehouse Name</Typography>
                            <InputBase
                                color="secondary"
                                className="input input-large"
                                placeholder="Warehouse Name"
                                value={officeName}
                                error={officeNameErrorText != ""}
                                onChange={(e) => setOfficeName(e.target.value)}
                                fullWidth>
                            </InputBase>
                            <small className="text-error">{officeNameErrorText}</small>
                        </div>
                        <div className="mb-4">
                            <Typography variant="body2" className="mb-2" paragraph>City</Typography>
                            <InputBase
                                color="secondary"
                                className="input input-large"
                                placeholder="City"
                                value={city}
                                error={cityErrorText != ""}
                                onChange={(e) => setCity(e.target.value)}
                                fullWidth>
                            </InputBase>
                            <small className="text-error">{cityErrorText}</small>
                        </div>
                        <div className="mb-4">
                            <Typography variant="body2" className="mb-2" paragraph>Address</Typography>
                            <InputBase
                                color="secondary"
                                className="input input-large"
                                placeholder="Address"
                                value={address}
                                error={addressErrorText != ""}
                                onChange={(e) => setAddress(e.target.value)}
                                fullWidth>
                            </InputBase>
                            <small className="text-error">{addressErrorText}</small>
                        </div>
                        <div className="text-center mb-3"><small className="text-error">{errorText}</small></div>
                        <Grid
                            justify="center"
                            container>
                            <Button 
                                variant="contained" 
                                size="large"
                                color="primary"
                                fullWidth={true}
                                disableElevation={true}>
                                Save Changes
                            </Button>
                        </Grid>
                    </form>
                </div>
            </Grid>
        </Grid>
    </AdminBaseLayout>
}