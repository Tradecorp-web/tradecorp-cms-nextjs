import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getDetailWorkOrderSwr } from "../../../../services/swr/wo.swr";
import BaseLayoutPo from "../../../base_layout/base-layout-po";
import WODetailComponent from "./wo-detail-component";

export default function WODetail() {

    const router = useRouter()
    const woId = router.query.id

    const [wo, setWo] = useState(null)
    const woSwr = getDetailWorkOrderSwr(woId)
    useEffect(() => {
        setWo(woSwr.data)
    }, [woSwr])

    return (
        <BaseLayoutPo title={wo?.wo_number}>
            <WODetailComponent role="purchasing" />
        </BaseLayoutPo>
    )
}