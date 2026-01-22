import { Divider, Typography, Grid, InputLabel, MenuItem, IconButton, Icon, Button, Link, Card, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Modal, InputBase, Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import ProductLayout from "./product-layout";
import { getDetailProductSwr } from "../../../services/swr/product.swr";
import { useRouter } from "next/router";
import { currency } from "../../../helpers/general";
import ProductForm from "./product-form";
import { updateProductApi } from "../../../services/api/product.api";
import { ImageSectionWithUploading } from "../../base_component/image_section_with_uploading";

export default function ProductDetail(props) {

    const router = useRouter()
    const productId = router.query.id

    const [product, setProduct] = useState(null)
    const productSwr = getDetailProductSwr(productId)
    useEffect(() => {
        setProduct(productSwr.data)
    }, [productSwr.data])

    const [openFormEdit, setOpenFormEdit] = useState(false)

    function updateData() {
        updateProductApi(product, product?.id).then((res) => {
            setProduct(res)
        })
    }

    return (
        <ProductLayout serialNumber={props?.serialNumber} title="Product Name">
            <div className="display-space-between mb-3">
                <h1 className="mb-3">{product?.name}</h1>
                <Button
                    variant="outlined" 
                    size="small"
                    onClick={() => setOpenFormEdit(true)}
                    color="default">
                    <Icon className="me-2">edit</Icon>Edit Product
                </Button>
            </div>
            <Divider />
            <Grid container className="mt-3" spacing={3}>
                <Grid item xl={6} md={6}>
                    <div variant="outlined" className="p-4 mb-5 card">
                        <div className="display-space-between mb-3">
                            <h3>Product</h3>
                        </div>
                        <div className="container-detail-wrapper mb-3">
                            <Grid container spacing={2}>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Code</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{product?.code}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Category</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{product?.category?.name}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Price Estimated</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{currency(product?.price)}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                            <ImageSectionWithUploading 
                                images={product?.images ?? []} 
                                imagesUpdated={(images) => {
                                    product.images = images
                                    setProduct(product)
                                    updateData()
                                }}/>
                        </div>
                    </div>
                </Grid>
                <Grid item xl={6} md={6}>
                    <div className="mb-5 card no-padding">
                        <div className="display-space-between p-4">
                            <h2>Material Used</h2>
                        </div>
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={12}>No</TableCell>
                                        <TableCell>Material</TableCell>
                                        <TableCell width={80}>Qty</TableCell>
                                        <TableCell width={300} align="right">Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {(product?.materials ?? []).map((item, i) => (
                                    <TableRow key={i} hover={true} onClick={(e) => openDetail(e, getRoute('product.detail', {id: 12}))}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>{item?.material?.material_name}</TableCell>
                                        <TableCell>{item?.qty} {item?.material?.unit}</TableCell>
                                        <TableCell align="right">{currency(item?.qty * item?.material?.price)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3} align="right">
                                        Total Estimated Price
                                    </TableCell>
                                    <TableCell align="right">
                                        <strong>{currency(product?.price)}</strong>
                                    </TableCell>
                                </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </Grid>
            </Grid>

            <ProductForm 
                open={openFormEdit} 
                closeModal={() => setOpenFormEdit(false)} 
                isEdit={true}
                dataUpdated={productSwr?.mutate}
                data={product}/>
        </ProductLayout>
    )
}