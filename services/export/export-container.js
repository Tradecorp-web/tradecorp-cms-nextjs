import exportFromJSON from 'export-from-json'
import Moment from 'moment'
import { getListContainerStock2Api } from '../api/container-stocks.api'
import { countDays, currency } from '../../helpers/general'

export const exportContainerStock = async (param) => {
    var data = []
    try {
        var res = await getListContainerStock2Api(param)
        console.log(res)
        res.result.forEach((item, i) => {
            var obj = {
                "No": i+1,
                "Serial Number": item?.serial_number,
                "Size": item?.size?.name,
                "Type": item?.type?.name,
                "Repair Status": item?.repair_status?.name,
                "Condition": item?.condition?.name,
                "Percentage": item?.percentage? item?.percentage : "",
                "YOM": item?.yom_year? item?.yom_month+"-"+item?.yom_year: "",
                "Gate In Date": item?.gate_in_date? Moment(item?.gate_in_date).format("LL") : "",
                "Days In Stock": countDays(item?.gate_in_date),
                "Location": item?.depo?.name,
                "Sale Status": item?.stock_status.name,
                "Price": currency(item?.selling_price),
                "Owner": item?.owner,
                "Stock Reconcile": item?.stock_reconcile? "Yes" : "No",
                "Remark": item?.remarks,
            }
            data = [...data, obj]
        })
        //console.log(data)

        const fileName = 'ContainerStock_'+Moment().format("DDMMYYYY")
        const exportType =  exportFromJSON.types.xls
        exportFromJSON({ data, fileName, exportType })
    } catch (err) {
        console.log(err)
        throw err
    }

}