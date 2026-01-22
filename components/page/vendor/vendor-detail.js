import { Divider, Typography, Grid, IconButton, Icon, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { currency } from "../../../helpers/general";
import getRoute from "../../../helpers/router";
import { deleteMaterialVendorApi } from "../../../services/api/material.api";
import { updateVendorApi } from "../../../services/api/vendor.api";
import { getDetailVendorSwr } from "../../../services/swr/vendor.swr";
import AlertDialog from "../../base_component/dialog";
import { FileViewComponent1 } from "../../base_component/file-upload";
import MaterialVendorForm from "../material/material-vendor-form";
import VendorForm from "./vendor-form";
import ProductLayout from "./vendor-layout";

export default function VendorDetail() {

    const router = useRouter()
    const vendorId = router.query.id

    const [vendor, setVendor] = useState(null)
    const vendorSwr = getDetailVendorSwr(vendorId)
    useEffect(() => {
        setVendor(vendorSwr.data)
    }, [vendorSwr])

    const [openFormEdit, setOpenFormEdit] = useState(false)

    function updateData() {
        updateVendorApi(vendor, vendor?.id).then((res) => {
            setVendor(res)
        }).catch((err) => {})
    }

    const [dialogApproval, setDialogApproval] = useState(false)
    const [approvalAccepted, setApprovalAccepted] = useState(false)
    function approval(accept) {
        setApprovalAccepted(accept)
        setDialogApproval(true)
    }

    const [openVendorForm, setOpenVendorForm] = useState(false);
    function onCloseMaterialVendorForm() {
        setOpenVendorForm(false)
        setDeleteIndex(null)
        setEditIndex(null)
    }

    // --------< Delete Vendor >--------
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);

    function confirmDeleting(index) {
        setDeleteIndex(index)
        setConfirmDelete(true)
    }
    
    async function deleteData() {
        setConfirmDelete(false)
        var data = vendor?.materials?.[deleteIndex]
        vendor?.materials?.splice(deleteIndex, 1)
        setVendor(vendor)
        await deleteMaterialVendorApi(data?.id)
    }
    // --------< Delete Vendor >--------
    
    // --------< Update Vendor >--------
    const [editIndex, setEditIndex] = useState(null);
    function openEditVendorForm(index) {
        setEditIndex(index)
        setOpenVendorForm(true)
    }
    // --------< Update Vendor >--------

    return (
        <ProductLayout vendorId={vendorId} title="Product Name">
            <AlertDialog 
                open={dialogApproval} 
                title={approvalAccepted ? "Accept" : "Reject"}
                body={approvalAccepted ? "Do you want to accept this vendor?" : "Do you want to reject this vendor"}
                cancelAction={() => setDialogApproval(false)}
                okAction={() => {
                    setDialogApproval(false)
                    vendor.is_accepted = approvalAccepted
                    vendor.pending_acceptance = false
                    updateData()
                }} />
            <div className="display-space-between">
                <h1 className="mb-3 flex-center">
                    {(vendor?.logo != null && vendor?.logo != "") && <img src={vendor?.logo} style={{width: 32, height: 32, marginRight: "24px", objectFit: "contain"}}/>}
                    <div>{vendor?.vendor_name}</div>
                </h1>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setOpenFormEdit(true)}
                    disableElevation>
                    <Icon className="me-2">edit</Icon> Edit
                </Button>
            </div>
            <Divider />
            <Grid container className="mt-3" spacing={3}>
                <Grid item lg={12} xl={6}>
                    {vendor?.pending_acceptance}
                    {vendor?.pending_acceptance === true && <div className="p-4 mb-5 card">
                        <h3 className="mb-3">Acceptance Vendor</h3>
                        <p>This is a vendor who has just registered and needs to be reviewed.</p>
                        <p>If this vendor matches your needs, you can click the accept button below, if not please click the reject button.</p>
                        <div className="text-right">
                            <Button
                                variant="contained"
                                disableElevation
                                className="me-3"
                                color="default"
                                onClick={() => approval(false)}>
                                Reject
                            </Button>
                            <Button
                                variant="contained"
                                disableElevation
                                color="primary"
                                onClick={() => approval(true)}>
                                Accept
                            </Button>
                        </div>
                    </div>}
                    <div className="p-4 mb-5 card">
                        <h3 className="mb-3 flex-center">
                            Company
                        </h3>
                        <div className="container-detail-wrapper mb-5">
                            <Grid container spacing={2}>
                                <Grid item lg={3} xl={6}>
                                    <div>
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Company Name</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{vendor?.vendor_name ?? "-"}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={3} xl={6}>
                                    <div>
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Director</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{vendor?.vendor_director ?? "-"}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={3} xl={6}>
                                    <div>
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Telp</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{vendor?.vendor_phone ?? "-"}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={3} xl={6}>
                                    <div>
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Address</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{vendor?.vendor_address ?? "-"}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                        <h3 className="mb-3">Contact Person</h3>
                        <div className="container-detail-wrapper mb-5">
                            <Grid container spacing={2}>
                                <Grid item lg={3} xl={6}>
                                    <div>
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Name</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{vendor?.cp_name ?? "-"}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={3} xl={6}>
                                    <div>
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Phone</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{vendor?.cp_phone ?? "-"}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={3} xl={6}>
                                    <div>
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Email</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{vendor?.cp_email ?? "-"}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                        <h3 className="mb-3">Payment</h3>
                        <div className="container-detail-wrapper mb-5">
                            <Grid container spacing={2}>
                                <Grid item lg={3} xl={6}>
                                    <div>
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Bank Acount</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>
                                                {vendor?.bank_name} {vendor?.bank_account} <br/>
                                                a/n {vendor?.bank_account_holder}
                                            </Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={3} xl={6}>
                                    <div>
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Terms of Payments</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>
                                                {vendor?.term_of_payment?.name}
                                            </Typography>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                        <div className="container-detail-wrapper mb-5">
                            <Grid container spacing={2}>
                                <Grid item lg={3} xl={6}>
                                    <div>
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>VAT (Value Added Tax)</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>
                                                {vendor?.vat ? "Yes" : "No"}
                                            </Typography>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                        <h3 className="mb-3">Files</h3>
                        <div className="container-detail-wrapper">
                            <div className="mb-3">
                                <FileViewComponent1
                                    id="npwpFile"
                                    url={vendor?.npwp}
                                    target="_blank" 
                                    fileUploaded={(val) => {
                                        vendor.npwp = val
                                        updateData()
                                    }}
                                    deleteFile={() => {
                                        vendor.npwp = null
                                        updateData()
                                    }}
                                    name="Nomer Pokok Wajib Pajak (NPWP)"/>
                            </div>
                            <div className="mb-3">
                                <FileViewComponent1
                                    id="siupFile"
                                    className="mb-3"
                                    url={vendor?.siup}
                                    target="_blank" 
                                    fileUploaded={(val) => {
                                        vendor.siup = val
                                        updateData()
                                    }}
                                    deleteFile={() => {
                                        vendor.siup = null
                                        updateData()
                                    }}
                                    name="Surat Ijin Usaha Perdagangan (SIUP)"/>
                            </div>
                            <div className="mb-3">
                                <FileViewComponent1
                                    id="tdpFile"
                                    className="mb-3"
                                    url={vendor?.tdp}
                                    target="_blank" 
                                    fileUploaded={(val) => {
                                        vendor.tdp = val
                                        updateData()
                                    }}
                                    deleteFile={() => {
                                        vendor.tdp = null
                                        updateData()
                                    }}
                                    name="Tanda Daftar Perusahaan (TDP)"/>
                            </div>
                            <div className="mb-3">
                                <FileViewComponent1
                                    id="nibFile"
                                    className="mb-3"
                                    url={vendor?.nib}
                                    target="_blank" 
                                    fileUploaded={(val) => {
                                        vendor.nib = val
                                        updateData()
                                    }}
                                    deleteFile={() => {
                                        vendor.nib = null
                                        updateData()
                                    }}
                                    name="Nomer Induk Berusaha (NIB)"/>
                            </div>
                            <div className="mb-3">
                                <FileViewComponent1
                                    id="skduFile"
                                    className="mb-3"
                                    url={vendor?.skdu}
                                    target="_blank" 
                                    fileUploaded={(val) => {
                                        vendor.skdu = val
                                        updateData()
                                    }}
                                    deleteFile={() => {
                                        vendor.skdu = null
                                        updateData()
                                    }}
                                    name="Surat Keterangan Domisili Usaha (SKDU)"/>
                            </div>
                            <div className="mb-3">
                                <FileViewComponent1
                                    id="coverFile"
                                    className="mb-3"
                                    url={vendor?.book_cover_bank_account}
                                    target="_blank" 
                                    fileUploaded={(val) => {
                                        vendor.book_cover_bank_account = val
                                        updateData()
                                    }}
                                    deleteFile={() => {
                                        vendor.book_cover_bank_account = null
                                        updateData()
                                    }}
                                    name="Photo Cover Buku Rekening Perusahaan"/>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item lg={12} xl={6}>
                    <div variant="outlined" className="mb-5 card no-padding">
                        <div className="display-space-between p-4">
                            <h3>Material Supplied</h3>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setOpenVendorForm(true)}
                                disableElevation>
                                <Icon className="me-2">add</Icon> Add Material
                            </Button>
                        </div>
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={12}>No</TableCell>
                                        <TableCell>Material</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Last Update</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {(vendor?.materials ?? [])?.map((data, index) => (
                                    <TableRow key={index} hover={true}>
                                        <TableCell onClick={(e) => router.push(getRoute('material.detail', {id: data?.material?.id}))}>{index + 1}</TableCell>
                                        <TableCell onClick={(e) => router.push(getRoute('material.detail', {id: data?.material?.id}))}>{data?.material?.material_name}</TableCell>
                                        <TableCell onClick={(e) => router.push(getRoute('material.detail', {id: data?.material?.id}))}>{currency(data?.price)}</TableCell>
                                        <TableCell onClick={(e) => router.push(getRoute('material.detail', {id: data?.material?.id}))}>{moment(data?.last_updated).format("LLLL")}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => openEditVendorForm(index)}><Icon>edit</Icon></IconButton>
                                            <IconButton className="ms-2" size="small" onClick={() => confirmDeleting(index)}><Icon>delete</Icon></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </Grid>
            </Grid>
            <MaterialVendorForm 
                vendor={vendor}
                closeModal={() => onCloseMaterialVendorForm()} 
                dataInserted={vendorSwr?.mutate}
                dataUpdated={vendorSwr?.mutate}
                isEdit={editIndex != null}
                isAddMaterial={true}
                data={vendor?.materials[editIndex]}
                open={openVendorForm}/>
            <VendorForm 
                open={openFormEdit} 
                closeModal={() => setOpenFormEdit(false)} 
                isEdit={true}
                dataUpdated={vendorSwr?.mutate}
                data={vendor}/>
            <AlertDialog 
                title="Delete Vendor"
                body={`Are you sure you want to delete ${vendor?.materials[deleteIndex]?.material?.material_name}`}
                open={confirmDelete} 
                cancelAction={() => setConfirmDelete(false)} okAction={deleteData} />
        </ProductLayout>
    )
}