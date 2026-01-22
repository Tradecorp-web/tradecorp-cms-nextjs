import { Button, Grid, InputBase, InputLabel, MenuItem, Select, Typography } from "@material-ui/core";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from 'next/router'
import { requestApi } from "../services/api/main.api";
import { CircularProgressCustom } from "../components/base_component/spinner";

export default function Page() {

    const router = useRouter() 
    var language = router?.query?.language
    var sourceUrl = router?.query?.sourceUrl
    var sourceSite = router?.query?.sourceSite

    const products = [
        'General Purpose', 
        'Hige Cube', 
        'Side Opening', 
        'Mini', 
        'Pallet Wide', 
        'Duocon', 
        'Double Door', 
        'Bulker',
        'Refigerated',
        'Offshore DNV',
        'Half Height',
        'Open Top',
        'Flat Rack',
        'Portacamp',
        'Coal Bin',
        'Tank',
        'Dangerous Goods',
        'Fuel Storage',
        'Medical',
        'Storage',
        'Modular',
        'Insulated',
        'Roll Trailer',
        'Shelter',
        'Cafe',
        'Shop'
    ]

    const conditionOptions = {
        "id": ['Baru', 'Bekas'],
        "en": ['New', 'Used'],
    }

    const [formState, setFormState] = useState(null)
    const [errorText, setErrorText] = useState(null)
    function onChangeInput (e) {
        setFormState({ ...formState, [e.target.name]: e.target.value})
    }

    const [isLoading, setLoading] = useState()
    const sendData = async () => {
        if(checkValidation()) {
            var date = new Date()
            var y = date.getFullYear()
            var m = date.getMonth()
            var d = date.getDate()
            var data = {
                "product": formState.product,
                "condition": formState.condition,
                "price": parseFloat(formState.price),
                "name": formState.name,
                "phone_number": formState.phoneNumber,
                "email": formState.email,
                "city": formState.city,
                "province": formState.province,
                "country": formState.country,
                "noted": formState.noted,
                "language": language,
                "source_url": sourceUrl,
                "source_site": sourceSite,
                "date": y + "/" + m + "/" + d,
                "time": `${date.getHours()}:${date.getMinutes()}`,
                "user_agent": navigator.userAgent,
            }
            setLoading(true)
            try {
                await insertTCIFormApi(data)
                // setFormState({})
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        }
    }

    function checkValidation() {
        var isValid = true;
        setErrorText(null)

        if(formState?.product == null) {
            isValid = false
            setErrorText({...errorText, product: "Harus diisi"})
        }
        
        if(formState?.condition == null) {
            isValid = false
            setErrorText({...errorText, condition: "Harus diisi"})
        }
        
        if(formState?.price == null) {
            isValid = false
            setErrorText({...errorText, price: "Harus diisi"})
        }
        
        if(formState?.name == null) {
            isValid = false
            setErrorText({...errorText, name: "Harus diisi"})
        }
        
        if(formState?.phoneNumber == null) {
            isValid = false
            setErrorText({...errorText, phoneNumber: "Harus diisi"})
        }

        if(formState?.email == null) {
            isValid = false
            setErrorText({...errorText, email: "Harus diisi"})
        }

        if(formState?.city == null) {
            isValid = false
            setErrorText({...errorText, city: "Harus diisi"})
        }

        if(formState?.province == null) {
            isValid = false
            setErrorText({...errorText, province: "Harus diisi"})
        }

        if(formState?.country == null) {
            isValid = false
            setErrorText({...errorText, country: "Harus diisi"})
        }
        
        if(formState?.noted == null) {
            isValid = false
            setErrorText({...errorText, noted: "Harus diisi"})
        }

        return isValid;

    }

    const insertTCIFormApi = async (data) => {
        try {
            const response = await requestApi({
                url: `${process.env.NEXT_PUBLIC_REST_API_URL}/tci-form`,
                method: 'POST',
                body: data,
                isAuth: true
            })
            return response
        } catch (err) {
            throw err
        }
    };

    return (
        <>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                style={{ minHeight: '100vh' }}>
                <Head>
                    <title>Vendor Registration Form - PT Tradecorp Indonesia</title>
                    <link rel="icon" href="https://kontainerindonesia.co.id/wp-content/uploads/2021/02/cropped-favicon-tradecorp-32x32.png" />            
                    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet"/>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                </Head>
                <div className="card p-5" style={{width: "700px", marginTop: 100, marginBottom: 100, borderTop: "4px solid #88181B"}}>
                    <div className="mt-5">
                        <div className="mb-3">
                            <InputLabel className="pb-1">
                                <Typography variant="body1" className="label-bold">Produk</Typography>
                            </InputLabel>
                            <Select
                                labelId="demo-customized-select-label"
                                className="input"
                                placeholder="Select Vendor"
                                fullWidth
                                id="demo-customized-select"
                                name="product"
                                input={<InputBase />}
                                value={formState?.product}
                                onChange={(e) => onChangeInput(e)}>
                                <MenuItem value={null}><em>None</em></MenuItem>
                                {products?.map((val, i) => {
                                    return <MenuItem key={i} value={val}>
                                        {val}
                                    </MenuItem>
                                })}
                            </Select>
                        </div>
                        <div className="mb-3">
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <InputLabel className="pb-1">
                                        <Typography variant="body1" className="label-bold">Kondisi</Typography>
                                    </InputLabel>
                                    <Select
                                        labelId="demo-customized-select-label"
                                        className="input"
                                        placeholder="Select Vendor"
                                        fullWidth
                                        id="demo-customized-select"
                                        name="condition"
                                        input={<InputBase />}
                                        value={formState?.condition}
                                        onChange={(e) => onChangeInput(e)}>
                                        <MenuItem value={null}><em>None</em></MenuItem>
                                        {conditionOptions[language ?? "en"]?.map((val, i) => {
                                            return <MenuItem key={i} value={val}>
                                                {val}
                                            </MenuItem>
                                        })}
                                    </Select>
                                </Grid>
                                <Grid item xs={6}>
                                    <InputLabel className="pb-1">
                                        <Typography variant="body1" className="label-bold">Harga</Typography>
                                    </InputLabel>
                                    <InputBase
                                        color="secondary"
                                        className="input"
                                        placeholder="0"
                                        name="price"
                                        value={formState?.price}
                                        onChange={(e) => onChangeInput(e)}
                                        fullWidth>
                                    </InputBase>
                                    {/* <small className="text-error">{bankHolderAccountError}</small> */}
                                </Grid>
                            </Grid>
                        </div>
                        <div className="mb-3">
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <InputLabel className="pb-1">
                                        <Typography variant="body1" className="label-bold">Nama</Typography>
                                    </InputLabel>
                                    <InputBase
                                        color="secondary"
                                        className="input"
                                        name="name"
                                        value={formState?.name}
                                        onChange={(e) => onChangeInput(e)}
                                        fullWidth>
                                    </InputBase>
                                    {/* <small className="text-error">{bankHolderAccountError}</small> */}
                                </Grid>
                                <Grid item xs={6}>
                                    <InputLabel className="pb-1">
                                        <Typography variant="body1" className="label-bold">No Telp</Typography>
                                    </InputLabel>
                                    <InputBase
                                        color="secondary"
                                        className="input"
                                        name="phoneNumber"
                                        value={formState?.phoneNumber}
                                        onChange={(e) => onChangeInput(e)}
                                        fullWidth>
                                    </InputBase>
                                    {/* <small className="text-error">{bankHolderAccountError}</small> */}
                                </Grid>
                            </Grid>
                        </div>
                        <div className="mb-3">
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <InputLabel className="pb-1">
                                        <Typography variant="body1" className="label-bold">Email</Typography>
                                    </InputLabel>
                                    <InputBase
                                        color="secondary"
                                        className="input"
                                        name="email"
                                        value={formState?.email}
                                        onChange={(e) => onChangeInput(e)}
                                        fullWidth>
                                    </InputBase>
                                    {/* <small className="text-error">{bankHolderAccountError}</small> */}
                                </Grid>
                                <Grid item xs={6}>
                                    <InputLabel className="pb-1">
                                        <Typography variant="body1" className="label-bold">Kota</Typography>
                                    </InputLabel>
                                    <InputBase
                                        color="secondary"
                                        className="input"
                                        name="city"
                                        value={formState?.city}
                                        onChange={(e) => onChangeInput(e)}
                                        fullWidth>
                                    </InputBase>
                                    {/* <small className="text-error">{bankHolderAccountError}</small> */}
                                </Grid>
                            </Grid>
                        </div>
                        <div className="mb-3">
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <InputLabel className="pb-1">
                                        <Typography variant="body1" className="label-bold">Provinsi</Typography>
                                    </InputLabel>
                                    <InputBase
                                        color="secondary"
                                        className="input"
                                        name="province"
                                        value={formState?.province}
                                        onChange={(e) => onChangeInput(e)}
                                        fullWidth>
                                    </InputBase>
                                    {/* <small className="text-error">{bankHolderAccountError}</small> */}
                                </Grid>
                                <Grid item xs={6}>
                                    <InputLabel className="pb-1">
                                        <Typography variant="body1" className="label-bold">Negara</Typography>
                                    </InputLabel>
                                    <InputBase
                                        color="secondary"
                                        className="input"
                                        name="country"
                                        value={formState?.country}
                                        onChange={(e) => onChangeInput(e)}
                                        fullWidth>
                                    </InputBase>
                                    {/* <small className="text-error">{bankHolderAccountError}</small> */}
                                </Grid>
                            </Grid>
                        </div>
                        <div className="mb-3">
                            <InputLabel className="pb-1">
                                <Typography variant="body1" className="label-bold">Pesan</Typography>
                            </InputLabel>
                            <InputBase
                                color="secondary"
                                className="input"
                                name="noted"
                                multiline
                                rows={4}
                                value={formState?.noted}
                                onChange={(e) => onChangeInput(e)}
                                fullWidth>
                            </InputBase>
                            {/* <small className="text-error">{bankHolderAccountError}</small> */}
                        </div>
                    </div>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => sendData()}
                        disableElevation>
                        {isLoading ? <CircularProgressCustom size={26} /> : "Submit"}
                    </Button>
                </div>
            </Grid>

            {/*language=CSS*/}
            <style jsx>{`
                .label-bold {
                    font-weight: 700 !important;
                }
            `}</style>
        </>
    )
}