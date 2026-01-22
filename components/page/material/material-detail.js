import { Divider, Typography, Grid, InputLabel, MenuItem, IconButton, Icon, Button, Link, Card, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Modal, InputBase, Select, Tooltip } from "@material-ui/core";
import { useRouter } from "next/router";
import MaterialLayout from "./material-layout";
import { ImageSectionWithUploading } from "../../../components/base_component/image_section_with_uploading";
import { useEffect, useState } from "react";
import { getDetailMaterialSwr } from "../../../services/swr/material.swr";
import { currency, dateExpired, dateFormat, dateTimeFormat, dateTimeFormatInput } from "../../../helpers/general";
import { deleteMaterialVendorApi, updateMaterialApi } from "../../../services/api/material.api";
import MaterialForm from "./material-form";
import MaterialVendorForm from "./material-vendor-form";
import AlertDialog from "../../base_component/dialog";
import getRoute from "../../../helpers/router";
import moment from "moment";
import MaterialStockHistoryTable from "./material-stock-history-table";

export default function MaterialDetail() {

    const router = useRouter()
    const materialId = router.query.id

    const [material, setMaterial] = useState(null)
    const materialSwr = getDetailMaterialSwr(materialId)
    useEffect(() => {
        setMaterial(materialSwr.data)
    }, [materialSwr])

    const [openFormEdit, setOpenFormEdit] = useState(false)

    function updateData() {
        updateMaterialApi(material, material?.id).then((res) => {
            setMaterial(res)
        })
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
        var data = material?.vendors?.[deleteIndex]
        material?.vendors?.splice(deleteIndex, 1)
        setMaterial(material)
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
        <MaterialLayout materialId={materialId} title="Material Name">
            <div className="display-space-between">
                <h1 className="mb-3 flex-center">
                    <div>{material?.material_name}</div>
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
            <Grid container className="mt-3" spacing={4}>
                <Grid item xs={12} lg={6}>
                    <div variant="outlined" className="p-4 mb-5 card">
                        <h2 className="mb-4">Material</h2>
                        <div className="container-detail-wrapper">
                            <Grid container spacing={2}>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Code</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{material?.code}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Minimum Level Stock</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{material?.minimum_level_stock ?? 0} {material?.unit}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Stock</Typography>
                                        </div>
                                        <div className="flex-center">
                                            <Typography variant="body1">{material?.stock ?? 0} {material?.unit}</Typography>
                                            {((material?.stock < material?.minimum_level_stock)) && <Icon style={{fontSize: 16, marginLeft: 8, color: "red"}}>warning</Icon>}
                                        </div>
                                        {((material?.stock < material?.minimum_level_stock)) && <div>
                                            <small className="text-error">your stock is less than the minimum level</small>
                                        </div>}
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary">Category</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1">{material?.category?.name}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary">Price</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1">{currency(material?.price)}</Typography>
                                            <Typography variant="caption">Updated at {dateFormat(material?.price_last_date)}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary">Price Expiration Date</Typography>
                                        </div>
                                        <div className="flex-center">
                                            <Typography variant="body1">{dateFormat(material?.expiration_date)}</Typography>
                                            {dateExpired(material?.expiration_date) && <Tooltip title="Price is expired" placement="top">
                                                <Icon style={{fontSize: 16, marginLeft: 4, color: "red"}}>warning</Icon>
                                            </Tooltip>}
                                        </div>
                                        {dateExpired(material?.expiration_date) && <div>
                                            <small className="text-error">Price is expired.</small>
                                        </div>}
                                    </div>
                                </Grid>
                            </Grid>
                            <Divider/>
                            <ImageSectionWithUploading 
                                images={material?.images ?? []} 
                                imagesUpdated={(images) => {
                                    material.images = images
                                    setMaterial(material)
                                    updateData()
                                }}/>
                        </div>
                    </div>
                    <MaterialStockHistoryTable materialId={materialId} />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <div className="mb-5 card no-padding">
                        <div className="display-space-between p-4">
                            <h2>Vendors</h2>
                            <Button size="small" onClick={() => setOpenVendorForm(true)} color="default" variant="outlined" disableElevation>
                                <Icon>add</Icon> Add Vendor
                            </Button>
                        </div>
                        <TableContainer component={Card} elevation={0}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={12}>No</TableCell>
                                        <TableCell>Vendor</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Last Update</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {(material?.vendors ?? [])?.map((vendor, index) => (
                                    <TableRow key={index} hover={true}>
                                        <TableCell onClick={() => router.push(getRoute("vendor.detail", {id: vendor?.vendor?.id}))}>{index + 1}</TableCell>
                                        <TableCell onClick={() => router.push(getRoute("vendor.detail", {id: vendor?.vendor?.id}))}>{vendor?.vendor?.vendor_name}</TableCell>
                                        <TableCell onClick={() => router.push(getRoute("vendor.detail", {id: vendor?.vendor?.id}))}>{currency(vendor?.price)}</TableCell>
                                        <TableCell onClick={() => router.push(getRoute("vendor.detail", {id: vendor?.vendor?.id}))}>{moment(vendor?.last_update).format("LLLL")}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => openEditVendorForm(index)}><Icon>edit</Icon></IconButton>
                                            <IconButton className="ms-2" size="small" onClick={() => confirmDeleting(index)}><Icon>delete</Icon></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(material?.vendors?.length <= 0) && <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted" align="center">
                                        No Data
                                    </TableCell>
                                </TableRow>}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </Grid>
            </Grid>
            <MaterialVendorForm 
                material={material}
                closeModal={() => onCloseMaterialVendorForm()} 
                dataInserted={materialSwr?.mutate}
                dataUpdated={materialSwr?.mutate}
                isEdit={editIndex != null}
                isAddVendor={true}
                data={material?.vendors[editIndex]}
                open={openVendorForm}/>
            <MaterialForm 
                open={openFormEdit} 
                closeModal={() => setOpenFormEdit(false)} 
                isEdit={true}
                dataUpdated={materialSwr?.mutate}
                data={material}/>
            <AlertDialog 
                title="Delete Vendor"
                body={`Are you sure you want to delete ${material?.vendors[deleteIndex]?.vendor?.vendor_name}`}
                open={confirmDelete} 
                cancelAction={() => setConfirmDelete(false)} okAction={deleteData} />
        </MaterialLayout>
    )
}