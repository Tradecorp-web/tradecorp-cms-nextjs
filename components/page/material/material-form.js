import { Button, Card, InputAdornment, InputBase, InputLabel, MenuItem, Modal, Select, Typography } from "@material-ui/core";
import { findGridDataContainerFromCurrent } from "@material-ui/data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import { dateFormatInput } from "../../../helpers/general";
import { insertMaterialApi, updateMaterialApi } from "../../../services/api/material.api";
import { getListMaterialCategorySwr } from "../../../services/swr/material-category.swr";
import { CircularProgressCustom } from "../../base_component/spinner";

export default function MaterialForm(props) {

    const [formState, setFormState] = useState(null)

    const [categories, setCategories] = useState([])
    var categorySwr = getListMaterialCategorySwr({ page: 1, limit: 200, orderBy: "name", order: "asc" })
    useEffect(() => {
        if(categorySwr?.data?.result) {
            setCategories(categorySwr?.data?.result ?? [])
        }
    }, [categorySwr])
    
    useEffect(() => {
        if(props?.open) {
            if(props?.isEdit) {
                setFormState({
                    category: categorySwr?.data?.result?.find((val) => val.id == props?.data?.category_id),
                    name: props?.data?.material_name,
                    code: props?.data?.code,
                    unit: props?.data?.unit,
                    stock: props?.data?.stock,
                    minimumLevelStock: props?.data?.minimum_level_stock,
                    price: props?.data?.price,
                    expirationDate: dateFormatInput(props?.data?.expiration_date)
                })
            }
        }
    }, [props?.open])

    const [errorText, setErrorText] = useState(null)
    const [isLoading, setLoading] = useState(false)
    function onChangeInput(e) {
        if(e.target.name == "category") {
            setFormState({...formState, code: `${e.target.value.code}-`, [e.target.name]: e.target.value})
        } else {
            setFormState({...formState, [e.target.name]: e.target.value})
        }
    }

    function checkValidation() {
        var isValid = true
        return isValid
    }

    function sendData() {
        if(checkValidation()) {
            setLoading(true);
            var data = {
                ...props?.data,
                material_name: formState?.name,
                category_id: formState?.category?.id,
                code: formState?.code,
                stock: parseFloat(formState?.stock),
                minimum_level_stock: parseFloat(formState?.minimumLevelStock),
                unit: formState?.unit,
                price: parseFloat(formState?.price),
                expiration_date: dateFormatInput(formState?.expirationDate),
                price_last_date: props?.isEdit 
                    ? (formState?.price != props?.data?.price?.toString() ? moment() : moment(Date.parse(props?.data?.price_last_date))) 
                    : null
            }
            if(props?.isEdit) {
                updateMaterialApi(data, props?.data?.id).then((res) => {
                    setLoading(false)
                    closeModal()
                    props?.dataUpdated(res)
                }).catch((err) => {
                    console.log(err)
                    setErrorText(err)
                    setLoading(false)
                })
            } else {
                insertMaterialApi(data).then((res) => {
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
                    <h3>{props?.isEdit ? "Edit Material" : "Add Material"}</h3>
                </div>
                <div className="modal-content">
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Select Category</Typography>
                        </InputLabel>
                        <Select
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
                        </Select>
                    </div>
                    {(formState?.category != null) && <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Material Code</Typography>
                        </InputLabel>
                        <InputBase
                            color="secondary"
                            name="code"
                            className="input"
                            placeholder={`${formState?.category?.code}-`}
                            value={formState?.code}
                            onChange={onChangeInput}
                            inputProps={{
                                startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
                            }}
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
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Unit</Typography>
                        </InputLabel>
                        <InputBase
                            color="secondary"
                            className="input"
                            name="unit"
                            placeholder="pcs"
                            value={formState?.unit}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Minimum Level Stock</Typography>
                        </InputLabel>
                        <InputBase
                            color="secondary"
                            className="input"
                            name="minimumLevelStock"
                            placeholder="0"
                            value={formState?.minimumLevelStock}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Stock</Typography>
                        </InputLabel>
                        <InputBase
                            color="secondary"
                            className="input"
                            name="stock"
                            placeholder="0"
                            value={formState?.stock}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Price Expiration Date</Typography>
                        </InputLabel>
                        <InputBase
                            color="secondary"
                            className="input"
                            type="date"
                            name="expirationDate"
                            value={formState?.expirationDate}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                    <div className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Price</Typography>
                        </InputLabel>
                        <InputBase
                            color="secondary"
                            className="input"
                            placeholder="100000"
                            type="number"
                            name="price"
                            value={formState?.price}
                            onChange={onChangeInput}
                            fullWidth>
                        </InputBase>
                    </div>
                </div>
                <div className="modal-footer">
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => sendData()}
                        disableElevation>
                        {isLoading ? <CircularProgressCustom size={26} /> : (props?.isEdit ? "Edit Material" : "Add Material")}
                    </Button>
                </div>
            </Card>
        </div>
    </Modal>
}