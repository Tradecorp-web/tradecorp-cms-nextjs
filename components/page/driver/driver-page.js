import { Button, ButtonGroup, Card, Divider, Avatar, Grid, TableFooter, TablePagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Icon } from "@material-ui/core";
import { useRouter } from "next/router";
import DriverForm from "./driver-form";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { useEffect, useRef, useState } from "react";
import getRoute from "../../../helpers/router";
import { getListDriverSwr } from "../../../services/swr/driver.swr";
import BaseLayoutDriver from "../../base_layout/base-layout-driver";
import SearchBar from "../../base_component/searchbar";
import AlertDialog from "../../base_component/dialog";
import { IconButton } from "@material-ui/core";
import { deleteDriverApi } from "../../../services/api/driver.api";
import { urlPhoto } from "../../../helpers/general";

export default function Page() {

    const router = useRouter();

    const [openForm, setOpenForm] = useState(false);

    function openDetail(e, url) {
        e.preventDefault();
        router.push(url)
    }

    // ==========================================
    // [START] GET DATA & PAGINATION
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
    var listDriverSwr = getListDriverSwr({
        search: search, 
        page: page+1, 
        limit: limit,
        orderBy: "created_at",
        order: "asc",
    })
    useEffect(() => {
        setLoading(listDriverSwr?.isLoading)
        if(listDriverSwr?.data?.result) {
            setTotal(listDriverSwr?.data?.total)
            setDataList(listDriverSwr?.data?.result)
        }
    }, [listDriverSwr])
    // ------------------------------------------
    // [END] GET DATA & PAGINATION
    // ==========================================

    // *----<Delete Items>----*
    const [isOpenConfirmationDialog, setOpenConfirmationDialog] = useState(false)
    const [deleteIndex, setDeleteIndex] = useState(-1)

    function confirmDelete(index) {
        setDeleteIndex(index)
        setOpenConfirmationDialog(true)
    }

    const deleteData = async () => {
        setOpenConfirmationDialog(false)
        var data = dataList[deleteIndex]
        console.log(data)
        dataList.splice(deleteIndex, 1)
        setDataList(dataList)
        await deleteDriverApi(data?.id)
    }
    // *----<Delete Items>----*

    return <BaseLayoutDriver>
        <AlertDialog 
            title="Delete Item"
            body={`Are you sure you want to delete ${dataList[deleteIndex]?.user?.name}`}
            open={isOpenConfirmationDialog} 
            cancelAction={() => setOpenConfirmationDialog(false)} okAction={deleteData} />
        <div className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={12} xl={8}>
                        <h1 className="mb-3">Drivers</h1>
                        <div className="card no-padding">
                            <div className="p-3 display-space-between">
                                <SearchBar style={{width: "25%", marginRight: 24}} onSearch={(search) => searchData(search)} isLoading={isLoading} />
                                <ButtonGroup variant="outlined" color="default" aria-label="split button">
                                    <Button
                                        onClick={() => setOpenForm(true)}>
                                        <Icon>add</Icon>Add Driver
                                    </Button>
                                </ButtonGroup>
                            </div>
                            <Divider/>
                            <TableContainer component={Card}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={12}>No</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Driver License</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {!isLoading && dataList.map((data, index) => (
                                        <TableRow key={index} hover={true}>
                                            <TableCell onClick={(e) => openDetail(e, getRoute('driver.detail', {id: data?.id}))}>{index + 1 + (page*limit)}</TableCell>
                                            <TableCell onClick={(e) => openDetail(e, getRoute('driver.detail', {id: data?.id}))}>
                                                <div className="flex-center">
                                                    <div className="me-3">
                                                        <Avatar alt={data?.user?.name} src={urlPhoto(data?.user?.photo)} style={{width: "24px", height: "24px"}} />
                                                    </div>
                                                    {data?.user?.name}
                                                </div>
                                            </TableCell>
                                            <TableCell onClick={(e) => openDetail(e, getRoute('driver.detail', {id: data?.id}))}>{data?.driver_license}</TableCell>
                                            <TableCell className="text-right">
                                                <Tooltip title="Delete" placement="top">
                                                    <IconButton size="small" onClick={() => confirmDelete(index)}><Icon>delete</Icon></IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(isLoading) && <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted" align="center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>}
                                    {(!isLoading && dataList?.length <= 0) && <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted" align="center">
                                            No Data
                                        </TableCell>
                                    </TableRow>}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[10, 20, 50, 100]}
                                                colSpan={8}
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
        </div>
        <DriverForm 
            open={openForm} 
            closeModal={() => setOpenForm(false)} 
            dataInserted={(data) => listDriverSwr.mutate()} />
    </BaseLayoutDriver>
}