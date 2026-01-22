import { Card, Divider, Fab, Grid, Icon, IconButton, Link, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Tooltip, Typography } from "@material-ui/core";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { PDFViewer } from "@react-pdf/renderer";
import jsPDF from "jspdf";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Pdf from "react-to-pdf";
import { dateFormat } from "../../../../helpers/general";
import MyDocument from "../../../../services/export/export-do-release-pdf";
import { getDetailDOReleaseSwr } from "../../../../services/swr/do-release.swr";
import DoReleaseLayout from "./do-release-layout";
import DoReleaseListStock from "./do-release-list-stock";

export default function DoReleaseDetail(props) {

    const router = useRouter()
    const doId = router.query.id

    function openPage(e, url) {
        e.preventDefault();
        router.push(url)
    }

    const [doRelease, setDoRelease] = useState(null)
    const doReleaseSwr = getDetailDOReleaseSwr(doId)
    useEffect(() => {
        setDoRelease(doReleaseSwr.data)
        console.log(doReleaseSwr.data)
    }, [doReleaseSwr.data])

    const [openFormEdit, setOpenFormEdit] = useState(false)

    function updateData() {
        updateContainerApi(doRelease, doRelease?.id).then((res) => {
            setDoRelease(res)
        })
    }

    const ref = React.createRef();

    return (
        <DoReleaseLayout id={doRelease?.id} title={`DO Release: ${doRelease?.release_number}`}>
            <div className="display-space-between">
                <h1 className="mb-3">{doRelease?.release_number}</h1>
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
                        onClick={(e) => openPage(e, `http://localhost/apis/export/do-release?id=${doId}`)}>
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
                                                {doRelease?.destination?.name} <br/>
                                                {doRelease?.destination?.address} <br/>
                                                {doRelease?.destination?.city} <br/>
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Release Date</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{dateFormat(doRelease?.release_date)}</Typography>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Expired Date</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{dateFormat(doRelease?.expired_date)}</Typography>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>ATTN</Typography>
                                    </div>
                                    <div>
                                        {doRelease?.pic?.map(pic => (
                                            <Typography variant="body1" gutterBottom>{pic?.name} / {pic?.telp}</Typography>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Release Number</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>{doRelease?.release_number}</Typography>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Customer</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1">{doRelease?.customer?.name} - {doRelease?.customer?.company}</Typography>
                                        <Typography variant="body1">{doRelease?.customer?.phone_number}</Typography>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Created By</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>{doRelease?.creator?.name}</Typography>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid item xl={6} md={6}>
                    <DoReleaseListStock data={doRelease} />
                </Grid>
            </Grid>
        </DoReleaseLayout>
    )
}