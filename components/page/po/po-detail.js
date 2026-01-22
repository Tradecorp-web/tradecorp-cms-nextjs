import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getDetailPurchaseOrderSwr } from "../../../services/swr/po.swr";
import BaseLayoutPo from "../../base_layout/base-layout-po";
import PODetailComponent from "./po-detail-component";

export default function PODetail() {

    const router = useRouter()
    const poId = router.query.id

    const [po, setPo] = useState(null)
    const poSwr = getDetailPurchaseOrderSwr(poId)
    useEffect(() => {
        setPo(poSwr.data)
        console.log(poSwr.data)
    }, [poSwr])

    return (
        <BaseLayoutPo title={po?.po_number}>
            <PODetailComponent role="purchasing" />
        </BaseLayoutPo>
    )
}