import exportFromJSON from 'export-from-json'
import { dateFormat } from '../../helpers/general'
import { getListPurchaseOrderApi } from '../api/po.api'

export const exportMaterialIn = async (param) => {

    var data = []

    try {
        var res = await getListPurchaseOrderApi(param)
        res.result.forEach((item, i) => {
            item?.items?.forEach((m, indx) => {
                if((m?.histories?.length ?? 0) > 0) {
                    m?.histories?.forEach((h, idx) => {
                        var obj = {
                            "No": i+1,
                            "PO Date": dateFormat(item?.po_date),
                            "PO Number": item?.po_number,
                            "Material Description": `${m?.material?.material_name}`,
                            "Qty Order": `${m?.qty} ${m?.material?.unit}`,
                            "Vendor": item?.vendor?.vendor_name,
                            "Project": item?.project,
                            "Remarks": item?.remarks,
                            "Delivery Date": `${h?.created_at}`,
                            "Delivery Qty": `${h?.qty}`,
                            "Delivery Order Number": `${h?.delivery_order}`,
                            "Out Standing Order": `${m?.qty - m?.qty_delivered} ${m?.material?.unit}`,
                        }
                        data = [...data, obj]
                    })
                } else {
                    var obj = {
                        "No": i+1,
                        "PO Date": dateFormat(item?.po_date),
                        "PO Number": item?.po_number,
                        "Material Description": `${m?.material?.material_name}`,
                        "Qty Order": `${m?.qty} ${m?.material?.unit}`,
                        "Vendor": item?.vendor?.vendor_name,
                        "Project": item?.project,
                        "Remarks": item?.remarks,
                        "Delivery Date": "-",
                        "Delivery Qty": "-",
                        "Delivery Order Number": "-",
                        "Out Standing Order": `${m?.qty - m?.qty_delivered} ${m?.material?.unit}`,
                    }
                    data = [...data, obj]
                }
            })
        })
        console.log(data)

        const fileName = 'Material Incoming'
        const exportType =  exportFromJSON.types.xls
        exportFromJSON({ data, fileName, exportType })
    } catch (err) {
        console.log(err)
        throw err
    }

}