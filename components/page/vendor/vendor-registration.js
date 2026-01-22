import { Button, Card, Divider, Grid, Icon, IconButton, InputBase, InputLabel, MenuItem, Modal, Select, Tooltip, Typography } from "@material-ui/core";
import Head from "next/head";
import { useEffect, useState } from "react";
import { registerVendorApi } from "../../../services/api/vendor.api";
import { masterDataCategory, masterDataSwr } from "../../../services/swr/master-data.swr";
import { FileUploadComponent1, ImageUploadArea } from "../../base_component/file-upload";
import { CircularProgressCustom } from "../../base_component/spinner";


// ==============================
// PROPS
// ------------------------------
// open: Boolean
// closeModal: Function
// isEdit: Boolean
// dataUpdated: Function(vendorData)
// ==============================

export default function VendorForm(props) {

    const [termOfPayments, setTermOfPayments] = useState([])
    const [termOfPayment, setTermOfPayment] = useState(null)
    var termOfPaymentSwr = masterDataSwr(masterDataCategory.termOfPayment)
    useEffect(() => {
        if(termOfPaymentSwr?.data) {
            setTermOfPayments(termOfPaymentSwr?.data ?? [])
        }
        if(props?.isEdit) {
            setTermOfPayment(termOfPaymentSwr?.data?.find((val) => val.id == props?.data?.to_payment))
        }
    }, [termOfPaymentSwr])

    const [vendorName, setVendorName] = useState("")
    const [vendorDirector, setVendorDirector] = useState("")
    const [vendorTelp, setVendorTelp] = useState("")
    const [vendorAddress, setVendorAddress] = useState("")
    const [materialSupplied, setMaterialSupplied] = useState("")
    const [cpName, setCpName] = useState("")
    const [cpPhoneNumber, setCpPhoneNumber] = useState("")
    const [cpEmail, setCpEmail] = useState("")
    const [bankName, setBankName] = useState("")
    const [bankHolderAccount, setBankHolderAcount] = useState("")
    const [bankNumber, setBankNumber] = useState("")
    
    const [vendorNameError, setVendorNameError] = useState("")
    const [vendorDirectorError, setVendorDirectorError] = useState("")
    const [vendorTelpError, setVendorTelpError] = useState("")
    const [vendorAddressError, setVendorAddressError] = useState("")
    const [materialSuppliedError, setMaterialSuppliedError] = useState("")
    const [cpNameError, setCpNameError] = useState("")
    const [cpPhoneNumberError, setCpPhoneNumberError] = useState("")
    const [cpEmailError, setCpEmailError] = useState("")
    const [bankNameError, setBankNameError] = useState("")
    const [bankHolderAccountError, setBankHolderAcountError] = useState("")
    const [bankNumberError, setBankNumberError] = useState("")
    
    const [npwpUrl, setNpwpUrl] = useState(null)
    const [siupUrl, setSiupUrl] = useState(null)
    const [tdpUrl, setTdpUrl] = useState(null)
    const [nibUrl, setNibUrl] = useState(null)
    const [skduUrl, setSkduUrl] = useState(null)
    const [coverBookUrl, setCoverBookUrl] = useState(null)
    
    const [logoUrl, setLogoUrl] = useState(null)

    const [errorText, setErrorText] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [isRegisterSuccess, setRegisterSuccess] = useState(false)

    function checkValidation() {
        var isValid = true
        return isValid
    }

    useEffect(() => {
        if(props?.isEdit) {
            setVendorName(props?.data?.vendor_name)
            setVendorDirector(props?.data?.vendor_director)
            setVendorTelp(props?.data?.vendor_phone)
            setVendorAddress(props?.data?.vendor_address)
            setMaterialSupplied(props?.data?.material_supplied)
            setCpName(props?.data?.cp_name)
            setCpPhoneNumber(props?.data?.cp_phone)
            setCpEmail(props?.data?.cp_email)
            setBankName(props?.data?.bank_name)
            setBankHolderAcount(props?.data?.bank_account_holder)
            setBankNumber(props?.data?.bank_account)
            
            setVendorNameError("")
            setVendorDirectorError("")
            setVendorTelpError("")
            setVendorAddressError("")
            setMaterialSuppliedError("")
            setCpNameError("")
            setCpPhoneNumberError("")
            setCpEmailError("")
            setBankNameError("")
            setBankHolderAcountError("")
            setBankNumberError("")
            
            setNpwpUrl(props?.data?.npwp)
            setSiupUrl(props?.data?.siup)
            setTdpUrl(props?.data?.tdp)
            setNibUrl(props?.data?.nib)
            setSkduUrl(props?.data?.skdu)
            setCoverBookUrl(props?.data?.book_cover_bank_account)
        }
    }, [props])

    function closeModal() {
        setVendorName("")
        setVendorDirector("")
        setVendorTelp("")
        setVendorAddress("")
        setMaterialSupplied("")
        setCpName("")
        setCpPhoneNumber("")
        setCpEmail("")
        setBankName("")
        setBankHolderAcount("")
        setBankNumber("")
        
        setVendorNameError("")
        setVendorDirectorError("")
        setVendorTelpError("")
        setVendorAddressError("")
        setMaterialSuppliedError("")
        setCpNameError("")
        setCpPhoneNumberError("")
        setCpEmailError("")
        setBankNameError("")
        setBankHolderAcountError("")
        setBankNumberError("")
        
        setNpwpUrl(null)
        setSiupUrl(null)
        setTdpUrl(null)
        setNibUrl(null)
        setSkduUrl(null)
        setCoverBookUrl(null)
        props?.closeModal()
    }

    function sendData() {
        if(checkValidation()) {
            setLoading(true);
            var data = {
                logo: logoUrl,
                company_id: "bbaecc1f-6151-44b8-9be5-debe77d40676",
                vendor_name: vendorName,
                vendor_phone: vendorTelp,
                vendor_address: vendorAddress,
                vendor_director: vendorDirector,
                cp_name: cpName,
                cp_phone: cpPhoneNumber,
                cp_email: cpEmail,
                bank_name: bankName,
                bank_account: bankNumber,
                bank_account_holder: bankHolderAccount,
                to_payment: termOfPayment?.id,
                npwp: npwpUrl,
                siup: siupUrl,
                tdp: tdpUrl,
                nib: nibUrl,
                skdu: skduUrl,
                book_cover_bank_account: coverBookUrl
            }
            registerVendorApi(data).then((res) => {
                setLoading(false)
                setRegisterSuccess(true)
                closeModal()
                props?.dataInserted(res)
            }).catch((err) => {
                setErrorText(err)
                setLoading(false)
            })
        }
    }

    return <Grid
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
        {isRegisterSuccess && <div className="card p-5" style={{width: "700px", marginTop: 100, marginBottom: 100, borderTop: "4px solid #88181B"}}>
            <img style={{ width: '200px'}} className="mb-6" src="/logo.png"/>
            <div className="mb-5">
                <h1>Registration Success</h1>
                <div>
                    <p>Terima kasih, pendaftaran anda sudah berhasil. kami akan melakukan pengecekan untuk informasi anda.</p>
                </div>
                <div className="text-muted">
                    <p><i>Thank you, your registration has been successful. we will check for your information.</i></p>
                </div>
            </div>
        </div>}
        {!isRegisterSuccess && <div className="card p-5" style={{width: "700px", marginTop: 100, marginBottom: 100, borderTop: "4px solid #88181B"}}>
            <img style={{ width: '200px'}} className="mb-6" src="/logo.png"/>
            <div className="mb-5">
                <h1>Vendor Registration Form</h1>
                <div>
                    <p>Mengisi Formulir Pendataan dan Pemilihan Vendor PT Tradecorp Indonesia.</p>
                    <p>Nama dan foto yang terkait dengan akun Google Anda akan direkam saat Anda mengunggah file dan mengirimkan formulir ini</p>
                </div>
                <div className="text-muted">
                    <p><i>Filling Form for Data Collection and Vendor Selection PT Tradecorp Indonesia.</i></p>
                    <p><i>The name and photo associated with your Google account will be recorded when you upload files and submit this form</i></p>
                </div>
            </div>
            <Divider/>
            <div className="mt-5">
                <h2 className="mb-3">Company</h2>
                <div className="mb-3">
                    <InputLabel className="pb-1">
                        <Typography variant="caption">Company Name</Typography>
                    </InputLabel>
                    <InputBase
                        color="secondary"
                        className="input"
                        placeholder="Company Name"
                        value={vendorName}
                        error={vendorNameError != ""}
                        onChange={(e) => setVendorName(e.target.value)}
                        fullWidth>
                    </InputBase>
                    <small className="text-error">{vendorNameError}</small>
                </div>
                <div className="mb-3">
                    <InputLabel className="pb-1">
                        <Typography variant="caption">Material Supplied</Typography>
                    </InputLabel>
                    <InputBase
                        color="secondary"
                        className="input"
                        placeholder="Material Supplied"
                        value={materialSupplied}
                        error={materialSuppliedError != ""}
                        onChange={(e) => setMaterialSupplied(e.target.value)}
                        fullWidth>
                    </InputBase>
                    <small className="text-error">{materialSuppliedError}</small>
                </div>
                <div className="mb-3">
                    <InputLabel className="pb-1">
                        <Typography variant="caption">Director of Company</Typography>
                    </InputLabel>
                    <InputBase
                        color="secondary"
                        className="input"
                        placeholder="Director of Company"
                        value={vendorDirector}
                        error={vendorDirectorError != ""}
                        onChange={(e) => setVendorDirector(e.target.value)}
                        fullWidth>
                    </InputBase>
                    <small className="text-error">{vendorDirectorError}</small>
                </div>
                <div className="mb-3">
                    <InputLabel className="pb-1">
                        <Typography variant="caption">Telp</Typography>
                    </InputLabel>
                    <InputBase
                        color="secondary"
                        className="input"
                        placeholder="Telp"
                        value={vendorTelp}
                        error={vendorTelpError != ""}
                        onChange={(e) => setVendorTelp(e.target.value)}
                        fullWidth>
                    </InputBase>
                    <small className="text-error">{vendorTelpError}</small>
                </div>
                <div className="mb-3">
                    <InputLabel className="pb-1">
                        <Typography variant="caption">Address</Typography>
                    </InputLabel>
                    <InputBase
                        color="secondary"
                        className="input"
                        placeholder="Address"
                        value={vendorAddress}
                        error={vendorAddressError != ""}
                        onChange={(e) => setVendorAddress(e.target.value)}
                        fullWidth>
                    </InputBase>
                    <small className="text-error">{vendorAddressError}</small>
                </div>
                <h2 className="mb-3 mt-5">Contact Person</h2>
                <div className="mb-3">
                    <InputLabel className="pb-1">
                        <Typography variant="caption">Name</Typography>
                    </InputLabel>
                    <InputBase
                        color="secondary"
                        className="input"
                        placeholder="Contact Person"
                        value={cpName}
                        error={cpNameError != ""}
                        onChange={(e) => setCpName(e.target.value)}
                        fullWidth>
                    </InputBase>
                    <small className="text-error">{cpNameError}</small>
                </div>
                <div className="mb-3">
                    <InputLabel className="pb-1">
                        <Typography variant="caption">Phone Number</Typography>
                    </InputLabel>
                    <InputBase
                        color="secondary"
                        className="input"
                        placeholder="Phone Number"
                        value={cpPhoneNumber}
                        error={cpPhoneNumberError != ""}
                        onChange={(e) => setCpPhoneNumber(e.target.value)}
                        fullWidth>
                    </InputBase>
                    <small className="text-error">{cpPhoneNumberError}</small>
                </div>
                <div className="mb-3">
                    <InputLabel className="pb-1">
                        <Typography variant="caption">Email</Typography>
                    </InputLabel>
                    <InputBase
                        color="secondary"
                        className="input"
                        placeholder="Email"
                        value={cpEmail}
                        error={cpEmailError != ""}
                        onChange={(e) => setCpEmail(e.target.value)}
                        fullWidth>
                    </InputBase>
                    <small className="text-error">{cpEmailError}</small>
                </div>
                <h2 className="mb-3 mt-5">Payment</h2>
                <div className="mb-3">
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <InputLabel className="pb-1">
                                <Typography variant="caption">Bank Name</Typography>
                            </InputLabel>
                            <InputBase
                                color="secondary"
                                className="input"
                                placeholder="Bank Name"
                                value={bankName}
                                error={bankNameError != ""}
                                onChange={(e) => setBankName(e.target.value)}
                                fullWidth>
                            </InputBase>
                            <small className="text-error">{bankNameError}</small>
                        </Grid>
                        <Grid item xs={4}>
                            <InputLabel className="pb-1">
                                <Typography variant="caption">Bank Holder Account</Typography>
                            </InputLabel>
                            <InputBase
                                color="secondary"
                                className="input"
                                placeholder="Bank Holder Account"
                                value={bankHolderAccount}
                                error={bankHolderAccountError != ""}
                                onChange={(e) => setBankHolderAcount(e.target.value)}
                                fullWidth>
                            </InputBase>
                            <small className="text-error">{bankHolderAccountError}</small>
                        </Grid>
                        <Grid item xs={4}>
                            <InputLabel className="pb-1">
                                <Typography variant="caption">Bank Number</Typography>
                            </InputLabel>
                            <InputBase
                                color="secondary"
                                className="input"
                                placeholder="Bank Number"
                                value={bankNumber}
                                error={bankNumberError != ""}
                                onChange={(e) => setBankNumber(e.target.value)}
                                fullWidth>
                            </InputBase>
                            <small className="text-error">{bankNumberError}</small>
                        </Grid>
                    </Grid>
                </div>
                <div className="mb-3">
                    <InputLabel className="pb-1">
                        <Typography variant="caption">Term of Payment</Typography>
                    </InputLabel>
                    <Select
                        labelId="demo-customized-select-label"
                        className="input"
                        placeholder="Select Vendor"
                        fullWidth
                        id="demo-customized-select"
                        input={<InputBase />}
                        value={termOfPayment}
                        onChange={(e) => setTermOfPayment(e.target.value)}>
                        <MenuItem value={null}><em>None</em></MenuItem>
                        {termOfPayments?.map((val, i) => {
                            return <MenuItem value={val}>
                                {val?.name}
                            </MenuItem>
                        })}
                    </Select>
                </div>
                <h2 className="mb-3 mt-5">Files</h2>
                <div className="text-left mb-5">
                    <div className="mb-3">
                        <Typography className="mb-2">Nomer Pokok Wajib Pajak (NPWP)*</Typography>
                        <FileUploadComponent1 
                            id="npwpFile"
                            fileUploaded={(url) => setNpwpUrl(url)}
                            url={npwpUrl}
                            deleteFile={() => setNpwpUrl(null)}/>
                    </div>
                    <div className="mb-3">
                        <Typography className="mb-2">Surat Ijin Usaha Perdagangan (SIUP)*</Typography>
                        <FileUploadComponent1 
                            id="siupFile"
                            fileUploaded={(url) => setSiupUrl(url)}
                            url={siupUrl}
                            deleteFile={() => setSiupUrl(null)}/>
                    </div>
                    <div className="mb-3">
                        <Typography className="mb-2">Tanda Daftar Perusahaan (TDP) *</Typography>
                        <FileUploadComponent1 
                            id="tdpFile"
                            fileUploaded={(url) => setTdpUrl(url)}
                            url={tdpUrl}
                            deleteFile={() => setTdpUrl(null)}/>
                    </div>
                    <div className="mb-3">
                        <Typography className="mb-2">Nomer Induk Berusaha (NIB) *</Typography>
                        <FileUploadComponent1 
                            id="nibFile"
                            fileUploaded={(url) => setNibUrl(url)}
                            url={nibUrl}
                            deleteFile={() => setNibUrl(null)}/>
                    </div>
                    <div className="mb-3">
                        <Typography className="mb-2">Surat Keterangan Domisili Usaha (SKDU) *</Typography>
                        <FileUploadComponent1 
                            id="skduFile"
                            fileUploaded={(url) => setSkduUrl(url)}
                            url={skduUrl}
                            deleteFile={() => setSkduUrl(null)}/>
                    </div>
                    <div className="mb-3">
                        <Typography className="mb-2">Photo Cover Buku Rekening Perusahaan *</Typography>
                        <FileUploadComponent1 
                            id="coverFile"
                            fileUploaded={(url) => setCoverBookUrl(url)}
                            url={coverBookUrl}
                            deleteFile={() => setCoverBookUrl(null)}/>
                    </div>
                </div>
                <h2 className="mb-3 mt-5">Company Logo</h2>
                <ImageUploadArea 
                    id="logoCompany"
                    fileUploaded={(url) => setLogoUrl(url)}
                    url={logoUrl}/>
            </div>
            <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => sendData()}
                disableElevation>
                {isLoading ? <CircularProgressCustom size={26} /> : "Submit"}
            </Button>
        </div>}
    </Grid>
}