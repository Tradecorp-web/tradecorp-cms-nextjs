import { Button, Card, Grid, FormControlLabel, Checkbox, InputBase, InputLabel, MenuItem, Modal, Select, Tooltip, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { uploadFileApi } from "../../../services/api/file.api";
import { insertVendorApi, updateVendorApi } from "../../../services/api/vendor.api";
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
    const [vat, setVat] = useState(false)
    
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
            setVat(props?.data?.vat)
            
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
            
            setLogoUrl(props?.data?.logo)
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
        setVat(false)
        
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
                ...props?.data,
                logo: logoUrl,
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
                vat: vat,
                to_payment: termOfPayment?.id,
                npwp: npwpUrl,
                siup: siupUrl,
                tdp: tdpUrl,
                nib: nibUrl,
                skdu: skduUrl,
                book_cover_bank_account: coverBookUrl
            }
            if(props?.isEdit) {
                updateVendorApi(data, props?.data?.id).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataUpdated(res)
                }).catch((err) => {
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                insertVendorApi(data).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataInserted(res)
                }).catch((err) => {
                    setErrorText(err)
                    setLoading(false)
                })
            }
        }
    }

    return <Modal
        open={props?.open}
        onClose={closeModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div className="modal-wrapper" style={{width: "700px"}}>
            <Card className="modal">
                <div className="modal-header">
                    <h3>{props?.isEdit ? "Edit Vendor" : "Add Vendor"}</h3>
                </div>
                <div className="modal-content">
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
                            value={termOfPayment ?? "none"}
                            onChange={(e) => setTermOfPayment(e.target.value)}>
                            <MenuItem value="none" disabled><em>Select Term of Payment</em></MenuItem>
                            {termOfPayments?.map((val, i) => {
                                return <MenuItem key={val?.id} value={val}>
                                    {val?.name}
                                </MenuItem>
                            })}
                        </Select>
                    </div>
                    <div className="mb-3">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">VAT is charged for this Vendor</Typography>
                        </InputLabel>
                        <FormControlLabel
                            control={<Checkbox
                                checked={vat}
                                onChange={(e) => setVat(!vat)}
                                name="vat"/>}
                            label="Check this check if this vendor is charged with VAT"/>
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
                <div className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => sendData()}
                        disableElevation>
                        {isLoading ? <CircularProgressCustom size={26} /> : (props?.isEdit ? "Edit Vendor" : "Add Vendor")}
                    </Button>
                </div>
            </Card>
        </div>
    </Modal>
}