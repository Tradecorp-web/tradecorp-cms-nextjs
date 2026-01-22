import { Divider, Typography, Grid, Paper, IconButton, Icon, Button, Link, TableContainer, Table, TableHead, TableRow, TableCell, Tooltip, TableBody, InputBase, ButtonGroup } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { getDetailLeaseAgreementSwr } from "../../../../services/swr/lease-agreement.swr";
import BaseLayoutStockContainer from "../../../base_layout/base-layout-stock-container";
import { updateLeaseAgreementApi, sendMailLeaseAgreementBefroeExpirationApi } from "../../../../services/api/lease-agreement.api";
import LeaseAgreementForm from "./lease-agreement-form";
import { dateFormat, rupiah } from "../../../../helpers/general";
import LeaseAgreementAddStock from "./lease-agreement-add-stock";
import { FileViewComponent1 } from "../../../base_component/file-upload";
import { updateContainerApi } from "../../../../services/api/container-stocks.api";
import LeaseAgreementImportStock from "./lease-agreement-import-stock";

export default function LeaseAgreementDetail() {

    const router = useRouter()
    const leaseAgreementId = router.query.id

    const [leaseAgreement, setLeaseAgreement] = useState(null)
    const leaseAgreementSwr = getDetailLeaseAgreementSwr(leaseAgreementId)
    useEffect(() => {
        if((leaseAgreementSwr?.data?.container_list?.length ?? 0) == 1) {
            if(leaseAgreementSwr?.data?.container_list[0]?.serial_number == null) {
                leaseAgreementSwr.data.container_list = []
            }
        }
        setLeaseAgreement(leaseAgreementSwr?.data)
    }, [leaseAgreementSwr.data])

    const [openFormEdit, setOpenFormEdit] = useState(false)

    function updateData() {
        console.log(leaseAgreement)
        updateLeaseAgreementApi(leaseAgreement, leaseAgreement?.id).then((res) => {
            console.log(res)
            if((res?.container_list?.length ?? 0) == 1) {
                if(res?.container_list[0]?.serial_number == null) {
                    res.container_list = []
                }
            }
            setLeaseAgreement(res)
        })
    }

    function markAsLease() {
        leaseAgreement.status = "leased"
        updateData()
        updateContainersStatus(1003)
    }
    
    function markAsFinished() {
        leaseAgreement.status = "finished"
        updateData()
        updateContainersStatus(1005)
    }

    function updateContainersStatus(status) {
        leaseAgreement?.container_list?.map((item, index) => {
            item.container.stock_status_id = status
            updateContainerApi(item?.container, item?.container?.id).then((res) => {
                if(index == leaseAgreement?.container_list?.length - 1) {
                    leaseAgreementSwr.mutate()
                }
            })
        })
    }

    const textAreaRef = useRef(null)
    const [isCoppied, setCoppied] = useState(false)

    function copyMailToClipboard() {
        var dummy = document.createElement("textarea")
        document.body.appendChild(dummy)
        dummy.value = getMailList()
        dummy.select()
        document.execCommand("copy")
        document.body.removeChild(dummy)
        setCoppied(true)
        setTimeout(() => {
            setCoppied(false)
        }, 500);
    }

    function getMailList() {
        var mailList = "";
        leaseAgreement?.emails?.forEach(item => {
            mailList += `${item};`
        });
        return mailList
    }

    const [showAddContainerStock, setShowAddContainerStock] = useState(false)
    const [showImportContainerStock, setShowImportContainerStock] = useState(false)

    return (
        <BaseLayoutStockContainer serialNumber={leaseAgreement?.serial_number} title={` ${leaseAgreement?.title}`}>
            <textarea type="hidden" ref={textAreaRef} value='Some text to copy 23' style={{display: "none"}}/>
            <div className="p-5 content-wrapper">
                <Grid container className="page-container" alignItems="center" justify="center" spacing={3}>
                    <Grid item xs={12} lg={10} xl={6}>
                        <h1 className="mb-3">Lease Agreement Detail</h1>
                        <Button
                            className="mb-3"
                            variant="outlined" 
                            size="small"
                            onClick={() => sendMailLeaseAgreementBefroeExpirationApi(leaseAgreement?.id)}
                            color="default">
                            <Icon className="me-2">verified_user</Icon> Test Sending Mail
                        </Button>
                        <div variant="outlined" className="p-4 mb-5 card">
                            <div className="container-detail-wrapper">
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Lease Agreement Title</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>{leaseAgreement?.title}</Typography>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Created by</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>{leaseAgreement?.creator?.name}</Typography>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Customer</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>{leaseAgreement?.customer?.company}</Typography>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Depo</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>{leaseAgreement?.depo?.name}</Typography>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>From Date</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>{dateFormat(leaseAgreement?.from_date)}</Typography>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>To Date</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>{dateFormat(leaseAgreement?.to_date)}</Typography>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Termination Notice</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>{dateFormat(leaseAgreement?.termination_notice)}</Typography>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Rent Fee/Unit</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>{rupiah(leaseAgreement?.rent_fee ?? 0)}</Typography>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Deposit</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>{rupiah(leaseAgreement?.deposit ?? 0)}</Typography>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Email list to notice</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>
                                            {leaseAgreement?.emails?.map((val, index) => {
                                                if(index == 0) return <Link href={`mailto:${val}`} target="_blank">{val}</Link>
                                                return <Link href={`mailto:${val}`} target="_blank">, {val}</Link>
                                            })}
                                        </Typography>
                                        <Button
                                            variant="outlined" 
                                            size="small"
                                            onClick={() => copyMailToClipboard()}
                                            color="default">
                                            <Icon className="me-2">content_copy</Icon> Copy Email List
                                        </Button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Status</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>{leaseAgreement?.status ?? "-"}</Typography>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="mb-1">
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Lease Agreement Document</Typography>
                                    </div>
                                    <div>
                                        <FileViewComponent1
                                            id="document"
                                            url={leaseAgreement?.document}
                                            target="_blank" 
                                            path="lease-agreement-document"
                                            fileUploaded={(val) => {
                                                leaseAgreement.document = val
                                                updateData()
                                            }}
                                            deleteFile={() => {
                                                leaseAgreement.document = null;
                                                updateData()
                                            }}
                                            name={leaseAgreement?.document != null && leaseAgreement?.document != "" ? "Lease Agreement Document" : "No file selected"}/>
                                    </div>
                                </div>
                                {leaseAgreement?.status == "draft" && <div>
                                    <Button
                                        variant="outlined" 
                                        size="small"
                                        className="mb-3"
                                        onClick={() => setOpenFormEdit(true)}
                                        color="default">
                                        Edit Data
                                    </Button>
                                    <Divider />
                                    <p>Change the status of the container in the list below to lease by clicking this button</p>
                                    <Button
                                        variant="outlined" 
                                        size="small"
                                        onClick={() => markAsLease()}
                                        color="default">
                                        <Icon className="me-2">verified_user</Icon> Mark As Leased
                                    </Button>
                                </div>}
                                {leaseAgreement?.status == "leased" && <div>
                                    <Divider />
                                    <p>If the lease period is over, click the button below to return the container status in the list below to sale stock</p>
                                    <Button
                                        variant="outlined" 
                                        size="small"
                                        onClick={() => markAsFinished()}
                                        color="default">
                                        <Icon className="me-2">verified_user</Icon> Mark As Finished
                                    </Button>
                                </div>}
                            </div>
                        </div>

                        {showAddContainerStock && <div className="mb-5">
                            <LeaseAgreementAddStock
                                open={showAddContainerStock}
                                close={() => setShowAddContainerStock(false)}
                                containerList={leaseAgreement?.container_list}
                                onDataAdded={async (data) => {
                                    var result = data?.map((val, i) => {
                                        return {
                                            container_id: val?.id,
                                            container: val
                                        }
                                    })
                                    leaseAgreement.container_list = [...result]
                                    await updateData()
                                    setShowAddContainerStock(false)
                                }}/>
                        </div>}
                        
                        {showImportContainerStock && <div className="mb-5">
                            <LeaseAgreementImportStock
                                open={showImportContainerStock}
                                close={() => setShowImportContainerStock(false)}
                                containerList={leaseAgreement?.container_list}
                                onDataAdded={async (data) => {
                                    var result = data?.map((val, i) => {
                                        return {
                                            container_id: val?.id,
                                        }
                                    })
                                    leaseAgreement.container_list = leaseAgreement.container_list.concat(result)
                                    await updateData()
                                    setShowImportContainerStock(false)
                                }}/>
                        </div>}

                        {!showAddContainerStock && !showImportContainerStock && <div className="card no-padding">
                            <div className="p-3 display-space-between">
                                <h3>Container List</h3>
                            </div>
                            <Divider />
                            <div className="p-3 display-space-between">
                                <div className="flex-center me-3" style={{flexGrow: 1}}>
                                    <InputBase 
                                        style={{width: "300px", marginRight: 24}}
                                        className="input input-rounded bold" 
                                        fullWidth 
                                        name="title"
                                        // value={formState?.title ?? ""}
                                        // onChange={onChangeInput}
                                        placeholder="Serial Number"/>
                                </div>
                                {leaseAgreement?.status == "draft" && <ButtonGroup variant="outlined" color="default"aria-label="split button">
                                    <Button
                                        onClick={() => setShowAddContainerStock(true)}>
                                        <Icon className="me-2">edit</Icon> Update Container List
                                    </Button>
                                    <Button
                                        onClick={() => setShowImportContainerStock(true)}>
                                        <Icon className="me-2">upload</Icon> Import
                                    </Button>
                                </ButtonGroup>}
                            </div>
                            <Divider />

                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={12}>No</TableCell>
                                            <TableCell>Serial Number</TableCell>
                                            <TableCell>Size/Type</TableCell>
                                            <TableCell>YOM</TableCell>
                                            <TableCell>Location</TableCell>
                                            <TableCell>Sale Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {leaseAgreement?.container_list?.map((data, index) => (
                                        <TableRow key={index} hover={true}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>{data?.container?.serial_number}</TableCell>
                                            <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>{data?.container?.size?.name}/{data?.container?.type?.name}</TableCell>
                                            <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>{data?.container?.yom_year}</TableCell>
                                            <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>
                                                {data?.container?.depo?.name}
                                            </TableCell>
                                            <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>{data?.container?.stock_status?.name}</TableCell>
                                        </TableRow>
                                    ))}
                                    {(leaseAgreement?.container_list?.length <= 0) && <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted" align="center">
                                            No Data
                                        </TableCell>
                                    </TableRow>}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>}
                    </Grid>
                </Grid>
            </div>

            <LeaseAgreementForm 
                open={openFormEdit} 
                closeModal={() => setOpenFormEdit(false)} 
                isEdit={true}
                dataUpdated={leaseAgreementSwr?.mutate}
                data={leaseAgreement}/>
        </BaseLayoutStockContainer>
    )
}