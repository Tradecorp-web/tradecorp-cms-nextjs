import { Divider, Typography, Grid, Avatar, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, Select, ButtonGroup, Card } from "@material-ui/core";
import AccountCircle from '@material-ui/icons/AccountCircle';
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { useEffect, useState } from "react";
import DriverLayout from "./driver-layout";
import { getDetailDriverSwr } from "../../../services/swr/driver.swr";
import { useRouter } from "next/router";
import { dateTimeFormat } from "../../../helpers/general";
import DriverForm from "./driver-form";
import { updateDriverApi } from "../../../services/api/driver.api";
import { getListDriverJobSwr } from "../../../services/swr/driver-job.swr";

export default function DriverDetail(props) {

    const router = useRouter()
    const driverId = router.query.id

    const [driver, setDriver] = useState(null)
    const driverSwr = getDetailDriverSwr(driverId)
    useEffect(() => {
        setDriver(driverSwr.data)
    }, [driverSwr.data])

    const [openFormEdit, setOpenFormEdit] = useState(false)

    function updateData() {
        updateDriverApi(driver, driver?.id).then((res) => {
            setDriver(res)
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
        driverId: driver?.id
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
        <DriverLayout title={driver?.name}>
            <h1 className="mb-3">{driver?.name}</h1>
            <Divider />
            <Grid container className="mt-3" spacing={3}>
                <Grid item md={12} lg={6}>

                    <div variant="outlined" className="p-4 mb-5 card">
                        <div className="display-space-between mb-3">
                            <h3>Driver</h3>
                        </div>
                        <div className="container-detail-wrapper mb-3">
                            {driver?.user?.photo != null && <Avatar alt="Travis Howard" src={driver?.user?.photo} width={40} />}
                            {driver?.user?.photo == null && <AccountCircle style={{color: "#333", fontSize: 40}} />}
                            <Grid container spacing={2} className="mt-3">
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Name</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{driver?.user?.name}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className="mb-3">
                                        <div>
                                            <Typography variant="caption" color="textSecondary" gutterBottom>Driver License</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>{driver?.driver_license}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    
                    <div className="card no-padding">
                        <div className="p-4 display-space-between">
                            <h3>Driver Jobs</h3>
                        </div>
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
            </Grid>

            <DriverForm 
                open={openFormEdit} 
                closeModal={() => setOpenFormEdit(false)} 
                isEdit={true}
                dataUpdated={driverSwr?.mutate}
                data={driver}/>
        </DriverLayout>
    )
}