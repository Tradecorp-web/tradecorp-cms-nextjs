import { Card, Divider, Fab, Grid, Icon, IconButton, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { dateFormat } from "../../../../helpers/general";
import { getDetailDOAcceptanceSwr } from "../../../../services/swr/do-acceptance.swr";
import DoAcceptanceLayout from "./do-acceptance-layout";
import DoAcceptanceListStock from "./do-acceptance-list-stock";

export default function DoAcceptanceDetail(props) {

    const router = useRouter()
    const doId = router.query.id

    function openPage(e, url) {
        e.preventDefault();
        router.push(url)
    }

    const [doAcceptance, setDoAcceptance] = useState(null)
    const doAcceptanceSwr = getDetailDOAcceptanceSwr(doId)
    useEffect(() => {
        setDoAcceptance(doAcceptanceSwr.data)
        console.log(doAcceptanceSwr.data)
    }, [doAcceptanceSwr.data])

    const [openFormEdit, setOpenFormEdit] = useState(false)

    function updateData() {
        updateContainerApi(doAcceptance, doAcceptance?.id).then((res) => {
            setDoAcceptance(res)
        })
    }

    return (
        <DoAcceptanceLayout id={doAcceptance?.id} title={`DO Acceptance: ${doAcceptance?.reference_number}`}>
            <div className="display-space-between">
                <h1 className="mb-3">{doAcceptance?.reference_number}</h1>
                <div>
                    <IconButton 
                        className="icon"
                        onClick={() => {
                            stocksSelected.remo
                            setStocksSelected(stocksSelected)
                            setTest(stocksSelected.length)
                        }}>
                        <Icon color="primary">email</Icon>
                    </IconButton>
                    <IconButton 
                        className="icon"
                        onClick={(e) => openPage(e, `http://localhost/apis/export/do-acceptance?id=${doId}`)}>
                        <Icon color="primary">print</Icon>
                    </IconButton>
                </div>
            </div>
            <Divider />
            <Grid container className="mt-5" spacing={5}>
                <Grid item xl={6} md={6}>
                    <div className="card">
                        <Grid container>
                            <Grid item xl={6} md={6}>
                                <div className="container-detail-wrapper">
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>TO</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>
                                                {doAcceptance?.destination?.name} <br/>
                                                {doAcceptance?.destination?.address} <br/>
                                                {doAcceptance?.destination?.city} <br/>
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Date</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{dateFormat(doAcceptance?.date)}</Typography>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>ATTN</Typography>
                                    </div>
                                    <div>
                                        {doAcceptance?.pic?.map(pic => (
                                            <Typography variant="body1" gutterBottom>{pic?.name} / {pic?.telp}</Typography>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Reference Number</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>{doAcceptance?.reference_number}</Typography>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Customer</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1">{doAcceptance?.customer?.name} - {doAcceptance?.customer?.company}</Typography>
                                        <Typography variant="body1">{doAcceptance?.customer?.phone_number}</Typography>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Created By</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>{doAcceptance?.creator?.name}</Typography>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid item xl={6} md={6}>
                    <DoAcceptanceListStock data={doAcceptance} />
                </Grid>
            </Grid>
        </DoAcceptanceLayout>
    )
}