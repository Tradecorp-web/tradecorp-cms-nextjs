import exportFromJSON from 'export-from-json'
import Moment from 'moment'
import { getListWOApi } from '../api/wo.api'
import { currency } from '../../helpers/general'

export const exportWorkOrder = async (limit) => {
    var data = []
    try {
        var res = await getListWOApi("",0,limit)
        console.log(res)
        res.result.forEach((item, i) => {
            item?.materials?.forEach((m, indx) => {
                var obj = {
                    "No": i+1,
                    "WO Date": Moment(item?.wo_date).format("LL"),
                    "WO Number": item?.wo_number,
                    "Material Description": `${item?.detail[indx]?.material_name}`,
                    "Qty": `${m?.qty}`,
                    "Unit": `${m?.unit}`,
                    "Unit Price": `${item?.detail[indx]?.price}`,
                    "Total Price": `${item?.detail[indx]?.price*m?.qty}`,
                    "Client": item?.client_id,
                    "Sales": item?.sales_id,
                    "Project": item?.project,
                    "Remarks": item?.remark,
                }
                data = [...data, obj]
            })
        })
        //console.log(data)

        const fileName = 'WorkOrder_'+Moment().format("DDMMYYYY")
        const exportType =  exportFromJSON.types.xls
        exportFromJSON({ data, fileName, exportType })
    } catch (err) {
        console.log(err)
        throw err
    }

}

export const exportWorkMaterial = async (limit) => {
    var data = []
    try {
        var res = await getListWOApi("",0,limit)
        console.log(res)
        res.result.forEach((item, i) => {
            item?.materials?.forEach((m, indx) => {
                if (item?.history != undefined) {
                    for (var j=0; j<item?.history.length; j++) {
                        for (var k=0; k<item?.history[j].material?.length; k++) {
                            if (item?.history[j].material[k].material_id == m?.material_id) {
                                var obj = {
                                    "No": i+1,
                                    "WO Date": Moment(item?.wo_date).format("LL"),
                                    "WO Number": item?.wo_number,
                                    "Material Description": `${item?.detail[indx]?.material_name}`,
                                    "Client": item?.client_id,
                                    "Sales": item?.sales_id,
                                    "Project": item?.project,
                                    "Remarks": item?.remark,
                                    "Total Qty": `${m?.qty}`,
                                    "Unit": `${m?.unit}`,
                                    "Release Qty": `${item?.history[j].material[k].qty}`,
                                    "Release By": `${item?.history[j].name}`,
                                    "Release Date": Moment(item?.history[j].release_date).format("LL"),
                                }
                                data = [...data, obj]
                            }
                        }
                    }
                } else {
                    var obj = {
                        "No": i+1,
                        "WO Date": Moment(item?.wo_date).format("LL"),
                        "WO Number": item?.wo_number,
                        "Material Description": `${item?.detail[indx]?.material_name}`,
                        "Client": item?.client_id,
                        "Sales": item?.sales_id,
                        "Project": item?.project,
                        "Remarks": item?.remark,
                        "Total Qty": `${m?.qty}`,
                        "Unit": `${m?.unit}`,
                        "Release Qty": "-",
                        "Release By": "-",
                        "Release Date": "-",
                    }
                    data = [...data, obj]
                }
            })
        })
        //console.log(data)

        const fileName = 'WorkOrder_'+Moment().format("DDMMYYYY")
        const exportType =  exportFromJSON.types.xls
        exportFromJSON({ data, fileName, exportType })
    } catch (err) {
        console.log(err)
        throw err
    }

}