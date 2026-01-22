import { Card, Grid, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getRoute from "../../../helpers/router";
import BaseLayoutCompanyDirectory from "../../base_layout/base-layout-company-directory";
import { getListCompanySwr } from "../../../services/swr/company.swr";

export default function Page() {

    var router = useRouter()

    function openDetail(index) {
        router.push(getRoute('company.directory.detail', {companyId: companyList[index].id}))
    }

    const [isLoading, setLoading] = useState(false)

    // ============================================
    // OFFICES
    // ============================================
    const [companyList, setCompanyList] = useState([])
    var listCompanySwr = getListCompanySwr()
    useEffect(() => {
        if(listCompanySwr?.data?.result) {
            setCompanyList(listCompanySwr?.data?.result)
        }
    }, [listCompanySwr])

    return <BaseLayoutCompanyDirectory title="Company Directory">
        <div className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={12} xl={8}>
                    <Grid container className="page-container">
                        {!isLoading && companyList.map((data, index) => (
                            <Grid item xs={12} lg={4}>
                                <Link href={getRoute('company.directory.detail', {companyId: companyList[index].id})} onClick={() => openDetail(index)}>
                                    <h3 className="card p-4">{data?.name}</h3>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </div>
    </BaseLayoutCompanyDirectory>
}