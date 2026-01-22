import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getDetailPurchaseOrderSwr } from "../../../../services/swr/po.swr";
import BaseLayoutWarehouse from "../../../base_layout/base-layout-warehouse";
import PODetailComponent from "../../po/po-detail-component";

export default function MaterialInDetail() {

    const router = useRouter()
    const poId = router.query.id

    const [po, setPo] = useState(null)
    const poSwr = getDetailPurchaseOrderSwr(poId)
    useEffect(() => {
        setPo(poSwr.data)
    }, [poSwr])

    return (
        <BaseLayoutWarehouse title={po?.po_number}>
            <PODetailComponent role="warehouse" />
        </BaseLayoutWarehouse>
    )
}