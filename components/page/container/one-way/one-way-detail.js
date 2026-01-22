import { Typography, Grid, IconButton, Icon, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, InputBase, ButtonGroup } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getDetailOneWaySwr } from "../../../../services/swr/one-way.swr";
import BaseLayoutStockContainer from "../../../base_layout/base-layout-stock-container";
import { updateOneWayApi } from "../../../../services/api/one-way.api";
import OneWayForm from "./one-way-form";
import OneWayAddStock from "./one-way-add-stock";
import { dateFormat } from "../../../../helpers/general";
import OneWayImportStock from "./one-way-import-stock";

export default function OneWayDetail() {

    const router = useRouter()
    const oneWayId = router.query.id

    const [oneWay, setOneWay] = useState(null)
    const oneWaySwr = getDetailOneWaySwr(oneWayId)
    useEffect(() => {
        if((oneWaySwr?.data?.container_list?.length ?? 0) == 1) {
            if(oneWaySwr?.data?.container_list[0]?.serial_number == null) {
                oneWaySwr.data.container_list = []
            }
        }
        setOneWay(oneWaySwr.data)
    }, [oneWaySwr.data])

    const [openFormEdit, setOpenFormEdit] = useState(false)

    function updateData() {
        updateOneWayApi(oneWay, oneWay?.id).then((res) => {
            if((res?.container_list?.length ?? 0) == 1) {
                if(res?.container_list[0]?.serial_number == null) {
                    res.container_list = []
                }
            }
            setOneWay(res)
        })
    }

    function markAsLease() {
        oneWay.status = "leased"
        updateData()
        updateContainersStatus(1003)
    }
    
    function markAsFinished() {
        oneWay.status = "finished"
        updateData()
        updateContainersStatus(1005)
    }

    function updateContainersStatus(status) {
        oneWay?.container_list?.map((item, index) => {
            item.container.stock_status_id = status
            updateContainerApi(item?.container, item?.container?.id).then((res) => {
                if(index == oneWay?.container_list?.length - 1) {
                    oneWaySwr.mutate()
                }
            })
        })
    }

    const [showAddContainerStock, setShowAddContainerStock] = useState(false)
    const [showImportContainerStock, setShowImportContainerStock] = useState(false)

    return (
        <BaseLayoutStockContainer serialNumber={oneWay?.name} title={`${oneWay?.name}`}>
            <div className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="center" justify="center" spacing={3}>
                <Grid item xs={12} lg={10} xl={6}>
                    <h1 className="mb-3">One Way Detail</h1>
                    <div variant="outlined" className="p-4 mb-5 card">
                        <div className="container-detail-wrapper">
                            <div className="mb-3">
                                <div>
                                    <Typography variant="caption" color="textSecondary" gutterBottom>One Way Request</Typography>
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>{oneWay?.name ?? "-"}</Typography>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div>
                                    <Typography variant="caption" color="textSecondary" gutterBottom>Origin Location</Typography>
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>{oneWay?.origin_city ?? "-"}</Typography>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div>
                                    <Typography variant="caption" color="textSecondary" gutterBottom>Destination Location</Typography>
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>{oneWay?.destination_city ?? "-"}</Typography>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div>
                                    <Typography variant="caption" color="textSecondary" gutterBottom>Booking Number</Typography>
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>{oneWay?.booking_number ?? "-"}</Typography>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div>
                                    <Typography variant="caption" color="textSecondary" gutterBottom>Shipping</Typography>
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>{oneWay?.shipping ?? "-"}</Typography>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div>
                                    <Typography variant="caption" color="textSecondary" gutterBottom>From Date</Typography>
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>{dateFormat(oneWay?.from_date)}</Typography>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div>
                                    <Typography variant="caption" color="textSecondary" gutterBottom>To Date</Typography>
                                </div>
                                <div>
                                    <Typography variant="body1" gutterBottom>{dateFormat(oneWay?.to_date)}</Typography>
                                </div>
                            </div>
                            <Button
                                variant="outlined" 
                                size="small"
                                onClick={() => setOpenFormEdit(true)}
                                color="default">
                                Edit Data
                            </Button>
                        </div>
                    </div>

                    {showAddContainerStock && <div className="mb-5">
                        <OneWayAddStock
                            open={showAddContainerStock}
                            close={() => setShowAddContainerStock(false)}
                            containerList={oneWay?.container_list ?? []}
                            onDataAdded={async (data) => {
                                var result = data?.map((val, i) => {
                                    return {
                                        container_id: val?.id,
                                        container: val
                                    }
                                })
                                oneWay.container_list = [...result]
                                await updateData()
                                setOneWay({...oneWay})
                                setShowAddContainerStock(false)
                            }}/>
                    </div>}
                        
                    {showImportContainerStock && <div className="mb-5">
                        <OneWayImportStock
                            open={showImportContainerStock}
                            close={() => setShowImportContainerStock(false)}
                            containerList={oneWay?.container_list}
                            onDataAdded={async (data) => {
                                var result = data?.map((val, i) => {
                                    return {
                                        container_id: val?.id,
                                    }
                                })
                                console.log(oneWay.container_list)
                                oneWay.container_list = oneWay.container_list.concat(result)
                                console.log(oneWay.container_list)
                                await updateData()
                                setShowImportContainerStock(false)
                            }}/>
                    </div>}

                    {!showAddContainerStock && !showImportContainerStock && <div className="card no-padding">
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
                            <ButtonGroup variant="outlined" color="default"aria-label="split button">
                                <Button
                                    onClick={() => setShowAddContainerStock(true)}>
                                    <Icon className="me-2">edit</Icon> Update Container List
                                </Button>
                                <Button
                                    onClick={() => setShowImportContainerStock(true)}>
                                    <Icon className="me-2">upload</Icon> Import
                                </Button>
                            </ButtonGroup>
                        </div>

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
                                {oneWay?.container_list?.map((data, index) => (
                                    <TableRow key={index} hover={true}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>{data?.container?.serial_number}</TableCell>
                                        <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>{data?.container?.size?.name}/{data?.container?.type?.name}</TableCell>
                                        <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>{data?.container?.yom_year}</TableCell>
                                        <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>{data?.container?.depo?.name}</TableCell>
                                        <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>{data?.container?.stock_status?.name}</TableCell>
                                    </TableRow>
                                ))}
                                {(oneWay?.container_list?.length <= 0) && <TableRow>
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

        <OneWayForm 
            open={openFormEdit} 
            closeModal={() => setOpenFormEdit(false)} 
            isEdit={true}
            dataUpdated={oneWaySwr?.mutate}
            data={oneWay}/>
        </BaseLayoutStockContainer>
    )
}