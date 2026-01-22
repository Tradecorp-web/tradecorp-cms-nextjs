import { Divider, Typography, Grid, Icon, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination } from "@material-ui/core";
import { useEffect, useState } from "react";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { useRouter } from "next/router";
import { dateFormat, dateTimeFormat } from "../../../helpers/general";
import { ImageSectionWithUploading } from "../../base_component/image_section_with_uploading";
import VehicleForm from "./vehicle-form";
import VehicleLayout from "./vehicle-layout";
import { updateVehicleApi } from "../../../services/api/vehicle.api";
import { getDetailVehicleSwr } from "../../../services/swr/vehicle.swr";
import { getListDriverJobSwr } from "../../../services/swr/driver-job.swr";
import VehicleChecklist from "./vehicle-checklist";

export default function VehicleDetail(props) {

    const router = useRouter()
    const vehicleId = router.query.id

    const [vehicle, setVehicle] = useState(null)
    const vehicleSwr = getDetailVehicleSwr(vehicleId)
    useEffect(() => {
        setVehicle(vehicleSwr.data)
    }, [vehicleSwr.data])

    const [openFormEdit, setOpenFormEdit] = useState(false)

    function updateData() {
        updateVehicleApi(vehicle, vehicle?.id).then((res) => {
            setVehicle(res)
        })
    }

    // ==========================================
    // [START] GET DATA DRIVER JOB & PAGINATION
    // ------------------------------------------
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(20)
    
    const [search, setSearch] = useState("")
    function searchData(search) {
        setPage(0)
        setSearch(search)
    }
    
    const [isLoading, setLoading] = useState(false)
    const [dataList, setDataList] = useState([])
    var listDriverJobSwr = getListDriverJobSwr({
        search: search, 
        page: page+1,
        limit: limit,
        orderBy: "created_at",
        order: "asc",
        vehicleId: vehicle?.id
    })
    useEffect(() => {
        setLoading(listDriverJobSwr?.isLoading)
        if(listDriverJobSwr?.data?.result) {
            setTotal(listDriverJobSwr?.data?.total)
            setDataList(listDriverJobSwr?.data?.result)
        }
    }, [listDriverJobSwr])
    // ------------------------------------------
    // [END] GET DATA DRIVER JOB & PAGINATION
    // ==========================================

    return (
        <VehicleLayout serialNumber={props?.serialNumber} title={`${vehicle?.category?.name ?? "Vehicle"} ${vehicle?.vehicle_registration_number}`}>
            <Grid container spacing={3}>

                <Grid item md={12} lg={6}>
                    <div variant="outlined" className="mb-5 card p-0">
                        <div className="display-space-between p-4">
                            <h3>Vehicle</h3>
                            <Button
                                variant="outlined" 
                                size="small"
                                onClick={() => setOpenFormEdit(true)}
                                color="default">
                                <Icon className="me-2">edit</Icon>Edit Vehicle
                            </Button>
                        </div>
                        <Divider />
                        <div className="container-detail-wrapper p-4">
                            <Grid container spacing={2}>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Category</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{vehicle?.category?.name}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Cashis Number</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{vehicle?.cashis_number}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Plat No</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{vehicle?.vehicle_registration_number}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Inspection Number</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{vehicle?.inspection_number}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={8}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Inspection Number Registration Certificate</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{vehicle?.inspection_number_registration_certificate}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Inspection Expiry Date</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{dateFormat(vehicle?.inspection_expiry_date)}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                            <ImageSectionWithUploading 
                                images={vehicle?.images ?? []} 
                                imagesUpdated={(images) => {
                                    vehicle.images = images
                                    setVehicle(vehicle)
                                    updateData()
                                }}/>
                        </div>
                    </div>

                    <div className="card no-padding">
                        <div className="p-4 display-space-between">
                            <h3>Jobs</h3>
                        </div>
                        <Divider/>
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={12}>No</TableCell>
                                        <TableCell width={150}>Job Number</TableCell>
                                        <TableCell>Vehicle</TableCell>
                                        <TableCell>Schedule</TableCell>
                                        <TableCell>Started At</TableCell>
                                        <TableCell>Finished At</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {!isLoading && dataList.map((data, index) => (
                                    <TableRow key={index} hover={true}>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('driver.job.detail', {id: data?.id}))}>{index + 1 + (page*limit)}</TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('driver.job.detail', {id: data?.id}))}>{data?.job_number}</TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('driver.job.detail', {id: data?.id}))}>
                                            {data?.vehicle?.category?.name} <br />
                                            <small className="text-muted">{data?.vehicle?.vehicle_registration_number}</small>
                                        </TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('driver.job.detail', {id: data?.id}))}>{dateTimeFormat(data?.schedule)}</TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('driver.job.detail', {id: data?.id}))}>{dateTimeFormat(data?.started_at)}</TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('driver.job.detail', {id: data?.id}))}>{dateTimeFormat(data?.finished_at)}</TableCell>
                                        <TableCell onClick={(e) => openDetail(e, getRoute('driver.job.detail', {id: data?.id}))}>{data?.status}</TableCell>
                                    </TableRow>
                                ))}
                                {(isLoading) && <TableRow>
                                    <TableCell colSpan={10} className="text-center text-muted" align="center">
                                        Loading...
                                    </TableCell>
                                </TableRow>}
                                {(!isLoading && dataList?.length <= 0) && <TableRow>
                                    <TableCell colSpan={10} className="text-center text-muted" align="center">
                                        No Data
                                    </TableCell>
                                </TableRow>}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[10, 20, 50, 100]}
                                            colSpan={10}
                                            count={total}
                                            rowsPerPage={limit}
                                            page={page}
                                            SelectProps={{
                                                inputProps: { 'aria-label': 'rows per page' },
                                                native: true,
                                            }}
                                            onChangePage={(e, page) => setPage(page)}
                                            onChangeRowsPerPage={(e) => {
                                                setPage(0)
                                                setLimit(parseInt(e.target.value))
                                            }}
                                            ActionsComponent={TablePaginationActions}/>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </div>
                </Grid>


                <Grid item md={12} lg={6}>
                    <VehicleChecklist vehicleId={vehicleId} />
                </Grid>

            </Grid>

            <VehicleForm 
                open={openFormEdit} 
                closeModal={() => setOpenFormEdit(false)} 
                isEdit={true}
                dataUpdated={vehicleSwr?.mutate}
                data={vehicle}/>
        </VehicleLayout>
    )
}