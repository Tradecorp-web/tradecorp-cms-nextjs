import { Button, Card, Table, TableBody, IconButton, Icon, TableHead, TableContainer, TableRow, TableCell, InputBase, InputLabel, MenuItem, Modal, Select, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { currency } from "../../../helpers/general";
import { insertProductApi, updateProductApi } from "../../../services/api/product.api";
import { getListMaterialSwr } from "../../../services/swr/material.swr";
import { getListProductCategorySwr } from "../../../services/swr/product-category.swr";
import { CircularProgressCustom } from "../../base_component/spinner";
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function ProductForm(props) {

    const [formState, setFormState] = useState(null)

    const [categories, setCategories] = useState([])
    var categorySwr = getListProductCategorySwr({ page: 1, limit: 200, orderBy: "name", order: "asc" })
    useEffect(() => {
        if(categorySwr?.data?.result) {
            setCategories(categorySwr?.data?.result ?? [])
        }
    }, [categorySwr?.data?.result])
    
    const [materials, setMaterials] = useState([])
    var materialSwr = getListMaterialSwr({ page: 1, limit: 200, orderBy: "material_name", order: "asc" })
    useEffect(() => {
        if(materialSwr?.data?.result) {
            setMaterials(materialSwr?.data?.result ?? [])
        }
    }, [materialSwr?.data?.result])
    
    useEffect(() => {
        if(props?.open) {
            if(props?.isEdit) {
                setFormState({
                    category: categorySwr?.data?.result?.find((val) => val.id == props?.data?.category_id),
                    name: props?.data?.name,
                    code: props?.data?.code,
                    images: props?.data?.images,
                    materials: props?.data?.materials,
                    price: props?.data?.price,
                })
            }
        }
    }, [props?.open])

    const [errorText, setErrorText] = useState(null)
    const [isLoading, setLoading] = useState(false)
    function onChangeInput(e) {
        if(e.target.name == "category") {
            setFormState({...formState, code: `${e.target.value.code}-`, [e.target.name]: e.target.value})
        } else if (e.target.name == "material") {
            addMaterialSelected(e.target.value)
        } else {
            setFormState({...formState, [e.target.name]: e.target.value})
        }
    }

    function onChangeQtyMaterial(e, index) {
        formState.materials[index].qty = parseFloat(e.target.value)
        setFormState({...formState})
    }

    function removeMaterial(index) {
        formState?.materials?.splice(index, 1)
        setFormState({...formState})
    }

    function addMaterialSelected(data) {
        if(data != null) {
            var index = (formState?.materials?.findIndex(val => val.material_id == data.id)) ?? -1
            if(index < 0) {
                setFormState({
                    ...formState, 
                    materials: [
                        ...(formState?.materials ?? []), 
                        {
                            material_id: data?.id,
                            material: data,
                            qty: 0
                        }
                    ]
                })
            }
        }
    }

    function totalPriceEstimated() {
        var result = 0;
        formState?.materials?.forEach(val => {
            result += (val?.qty ?? 0) * val?.material?.price
        })
        return result;
    }

    function checkValidation() {
        var isValid = true
        return isValid
    }

    function sendData() {
        if(checkValidation()) {
            var data = {
                ...props?.data,
                name: formState?.name,
                category_id: formState?.category?.id,
                code: formState?.code,
                price: totalPriceEstimated(),
                images: formState?.images ?? [],
                materials: formState?.materials ?? []
            }
            setLoading(true);
            if(props?.isEdit) {
                updateProductApi(data, props?.data?.id).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataUpdated(res)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                insertProductApi(data).then((res) => {
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
                    <h3>{props?.isEdit ? "Edit Product" : "Add Product"}</h3>
                </div>
                <div className="modal-content">
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Select Category</Typography>
                        </InputLabel>
                        <Autocomplete
                            id="combo-box-demo"
                            options={categories}
                            className="input"
                            name="category"
                            value={formState?.vendor}
                            onChange={(event, value) => {
                                setFormState({...formState, category: value})
                            }}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <div ref={params.InputProps.ref}>
                                    <InputBase className="input" style={{width: "100%"}} type="text" {...params.inputProps} />
                                </div>
                            )}/>
                        {/* <Select
                            labelId="demo-customized-select-label"
                            className="input"
                            placeholder="Select Vendor"
                            fullWidth
                            name="category"
                            value={formState?.category ?? "none"}
                            onChange={onChangeInput}
                            input={<InputBase />}
                            >
                            <MenuItem value="none"><em className="text-muted">Select Category</em></MenuItem>
                            {categories?.map((val, i) => {
                                return <MenuItem key={val?.id} value={val}>{val?.name}</MenuItem>
                            })}
                        </Select> */}
                    </div>
                    {(formState?.category != null) && <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Product Code</Typography>
                        </InputLabel>
                        <InputBase
                            color="secondary"
                            name="code"
                            className="input"
                            placeholder={`${formState?.category?.code}-`}
                            value={formState?.code}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>}
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Name</Typography>
                        </InputLabel>
                        <InputBase
                            name="name"
                            color="secondary"
                            className="input"
                            value={formState?.name}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <Card className="p-3" variant="outlined">
                        <div className="text-left">
                            <h3>Materials Used</h3>
                            <Typography className="mb-3" variant="body2">Choose the material used and the quantity to make this product</Typography>
                            <Autocomplete
                                id="combo-box-demo"
                                options={materials}
                                className="input"
                                name="vendor"
                                value=""
                                onChange={(event, value) => {
                                    addMaterialSelected(value)
                                }}
                                // inputValue={inputValue}
                                // onInputChange={(event, newInputValue) => {
                                //     addMaterialSelected(newInputValue)
                                // }}
                                getOptionLabel={(option) => option.material_name}
                                renderInput={(params) => (
                                    <div ref={params.InputProps.ref}>
                                        <InputBase 
                                            className="input" 
                                            style={{width: "100%"}} 
                                            type="text" 
                                            placeholder="Select Material"
                                            {...params.inputProps} />
                                    </div>
                                )}/>
                        </div>
                        <Card variant="outlined" className="mt-3">
                            <TableContainer component={Card} elevation={0}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Material</TableCell>
                                            <TableCell>Qty</TableCell>
                                            <TableCell align="right">Total Price</TableCell>
                                            <TableCell width={20}></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(formState?.materials?.length ?? 0) < 1 && <TableRow>
                                            <TableCell colSpan={4}><div className="text-center text-muted">No material selected</div></TableCell>
                                        </TableRow>}
                                        {formState?.materials?.map((item, i) => {
                                            return <TableRow key={i}>
                                                <TableCell>
                                                    {formState?.materials[i]?.material?.material_name}
                                                </TableCell>
                                                <TableCell width={150}>
                                                    <InputBase
                                                        color="secondary"
                                                        className="input"
                                                        placeholder="0"
                                                        type="number"
                                                        name="qty"
                                                        inputProps={{
                                                            min: 0,
                                                        }}
                                                        value={formState?.materials[i]?.qty}
                                                        onChange={(e) => onChangeQtyMaterial(e, i)}
                                                        fullWidth>
                                                    </InputBase>
                                                </TableCell>
                                                <TableCell align="right">
                                                    {currency(formState?.materials[i]?.material?.price * (formState?.materials[i]?.qty ?? 0))}/<span className="text-muted">{formState?.materials[i]?.qty}{formState?.materials[i]?.material?.unit}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton size="small" className="p-o" onClick={() => removeMaterial(i)}>
                                                        <Icon>remove_circle</Icon>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        })}
                                        <TableRow>
                                            <TableCell colSpan={2} align="right">Total</TableCell>
                                            <TableCell align="right">{currency(totalPriceEstimated())}</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>
                    </Card>
                </div>
                <div className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => sendData()}
                        disableElevation>
                        {isLoading ? <CircularProgressCustom size={26} /> : (props?.isEdit ? "Edit Product" : "Add Product")}
                    </Button>
                </div>
            </Card>
        </div>
    </Modal>
}