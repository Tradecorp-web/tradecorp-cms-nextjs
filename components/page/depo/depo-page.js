import { Tooltip, Avatar, Grid, Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Divider, TableFooter, TablePagination, IconButton, Icon, ButtonGroup, Button, Popper, ClickAwayListener, Box, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
// import { getListDepoSwr } from "../../../services/swr/depo.swr";
import { getListDepoGApi } from "../../../services/api/depo.api"
import BaseLayoutDepoLocation from "../../base_layout/base-layout-depo-location"
import DepoForm from './depo-form';
import { accountSwr } from "../../../services/swr/account.swr";
import SearchBar from "../../base_component/searchbar";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { AvatarGroup } from "@material-ui/lab";
import AlertDialog from "../../base_component/dialog";
import { isPermit } from "../../../helpers/general";
import getRoute from "../../../helpers/router";
import { LOCAL_STORAGE_DEPO_GROUP } from "../../../helpers/consts"
import { getDepoNewsSwr, getListDepo2GSwr, getListDepoGCountrySwr } from "../../../services/swr/depo.swr"
import { getCityListApi } from "../../../services/api/countries-cities.api"
import { deleteDepoApi } from '../../../services/api/depo.api';
import { getDetailDepoGroupApi } from '../../../services/api/depo-group.api';

import { Scrollbars } from "react-custom-scrollbars"

const useStyles = makeStyles((theme) => ({
    newsSection: {
        color: "#000",
        height: "calc(100vh - 150px)",
    },
}));

export default function DepoPage() {
    const classes = useStyles()
    const account = accountSwr()

    function linkToDetailPage(depo, e, routerSlug) {
        e.preventDefault()
        router.push(routerSlug)
    }

    const router = useRouter()
    const group = router.query.depoSlug


    const [isFormEdit, setFormEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [depoGroupDetail, setDepoGroupDetail] = useState(false);

    function openEditData(index) {
        setEditData(dataList[index])
        setFormEdit(true)
        setOpenForm(true)
    }

    // ==========================================
    // [START] GET DATA & PAGINATION
    // ------------------------------------------
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(20)
    const [cntCountry, setCntCountry] = useState([{ country_id: null, country: null, city_id: null, city: null }])
    const [search, setSearch] = useState("")
    function searchData(search) {
        setPage(0)
        setSearch(search)
    }

    const [isLoading, setLoading] = useState(false)
    const [dataList, setDataList] = useState([])
    // var listDepoSwr = getListDepoSwr({
    //     search: search, 
    //     page: page+1, 
    //     limit: limit,
    //     orderBy: "name",
    //     order: "asc",
    // })
    var listDepoSwr = getListDepo2GSwr({
        search: search,
        page: page + 1,
        limit: limit,
        orderBy: "name",
        order: "asc",
    }, group)
 
    var dataDepoCountryG = getListDepoGCountrySwr({ group: group })
    var dCG = []
    useEffect(() => {
        var country, city = ""
        // if (dataDepoCountryG) {
       
            dataDepoCountryG?.data?.result?.map(async (res) => {
                if (res?.country_id != null) {
                    await getCityListApi(res?.country_id).then((resCity) => {
                        country = resCity?.name;
                        city = resCity?.cities?.find((resFind) => resFind.id == res?.city_id)?.name;
                    })
                }
                dCG.push({
                    country_id: res?.country_id,
                    country: country,
                    city_id: res?.city_id,
                    city: city,
                })
                // alert(JSON.stringify(dCG))
                setCntCountry(dCG)
                
            })
        // }
    },[dataDepoCountryG?.data?.result])
    // useEffect(() => {
    //     setLoading(listDepoSwr?.isLoading)
    //     if(listDepoSwr?.data?.result) {
    //     setTotal(listDepoSwr?.data?.total)
    //     setDataList(listDepoSwr?.data?.result)

    //     }
    // }, [listDepoSwr])

    useEffect(async () => {
        try {
            localStorage.setItem(LOCAL_STORAGE_DEPO_GROUP, group)
            setLoading(true);
            //   listDepoSwr.mutate();
            // var data = await getListDepoGApi({
            //         search: search, 
            //         page: page+1, 
            //         limit: limit,
            //         orderBy: "name",
            //         order: "asc",
            //     }, group)
            if (typeof listDepoSwr?.data?.result != "undefined") {
                setTotal(listDepoSwr?.data?.total)
                setDataList(listDepoSwr?.data?.result)
                setLoading(false);
            }

        } catch (err) {
            console.log(err)
        }
    }, [listDepoSwr]);
    useEffect(async () => {
        var depoGroupDetail = await getDetailDepoGroupApi(group)
        setDepoGroupDetail(depoGroupDetail)
    }, [group])
    // useEffect(async () => {
    //     try {
    //         localStorage.setItem(LOCAL_STORAGE_DEPO_GROUP, group)
    //         var data = await getListDepoGApi({
    //                 search: search, 
    //                 page: page+1, 
    //                 limit: limit,
    //                 orderBy: "name",
    //                 order: "asc",
    //             }, group)
    //         setTotal(data.total)
    //         setDataList(data.result)
    //     } catch (err) {
    //         console.log(err)
    //     }
    // });
    // useEffect(async () => {

    //     try {
    //         localStorage.setItem(LOCAL_STORAGE_DEPO_GROUP, group)
    //         var data = await getListDepoGApi({
    //                 search: search, 
    //                 page: page+1, 
    //                 limit: limit,
    //                 orderBy: "name",
    //                 order: "asc",
    //             }, group)
    //         setTotal(data.total)
    //         setDataList(data.result)
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }, [limit]);
    // useEffect(async () => {
    //     try {
    //         localStorage.setItem(LOCAL_STORAGE_DEPO_GROUP, group)
    //         var data = await getListDepoGApi({
    //                 search: search, 
    //                 page: page+1, 
    //                 limit: limit,
    //                 orderBy: "name",
    //                 order: "asc",
    //             }, group)
    //         setTotal(data.total)
    //         setDataList(data.result)
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }, [page]);

    // useEffect(async () => {
    //     try {
    //         localStorage.setItem(LOCAL_STORAGE_DEPO_GROUP, group)
    //         var data = await getListDepoGApi({
    //                 search: search, 
    //                 page: page+1, 
    //                 limit: limit,
    //                 orderBy: "name",
    //                 order: "asc",
    //             }, group)
    //         setTotal(data.total)
    //         setDataList(data.result)
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }, [search]);

    const refreshList = async () => {
        listDepoSwr.mutate();
        //     try {
        //         var data = await getListDepoGApi({
        //             search: search, 
        //             page: page+1, 
        //             limit: limit,
        //             orderBy: "name",
        //             order: "asc",
        //         }, group)
        //         setTotal(data.total)
        //         setDataList(data.result)
        //     } catch (err) {
        //         console.log(err)
        //     }
    }

    function changeFilter() {
        setPage(0)
    }
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
        await deleteDepoApi(data?.id)
    }
    // *----<Delete Items>----*

    const [depoNews, setDepoNews] = useState(null)
    const depoNewsSwr = getDepoNewsSwr()
    useEffect(() => {
        setDepoNews(depoNewsSwr.data)
    }, [depoNewsSwr.data])


    return <BaseLayoutDepoLocation title="Depot">
        <AlertDialog
            title="Delete Item"
            body={`Are you sure you want to delete ${dataList[deleteIndex]?.name}`}
            open={isOpenConfirmationDialog}
            cancelAction={() => setOpenConfirmationDialog(false)} okAction={deleteData} />
        <Box className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="baseline" justify="center">
                <Grid item xs={12} md={9} lg={9} xl={9}>
                    <h1 className="mb-3">Depot {depoGroupDetail && depoGroupDetail?.group_name}</h1>
                    <Box className="card no-padding">
                        <Box className="p-3 display-space-between">
                            <SearchBar
                                style={{ width: "25%", marginRight: 24 }}
                                onSearch={(search) => searchData(search)}
                                isLoading={isLoading}
                                placeholder="Search Depot..." />
                            <Box className="flex-center me-3" style={{ flexGrow: 1 }}>
                            </Box>
                            <ButtonGroup variant="outlined" color="default" aria-label="split button">
                                <Button onClick={() => {
                                    setEditData(null)
                                    setFormEdit(false)
                                    setOpenForm(true)
                                }}>
                                    <Icon>add</Icon>Add Depot
                                </Button>
                            </ButtonGroup>
                        </Box>
                        <Divider />
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={12}>No</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Depot</TableCell>
                                        <TableCell>Country</TableCell>
                                        <TableCell>City</TableCell>
                                        <TableCell>Teu</TableCell>
                                        <TableCell>Officer</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {!isLoading && dataList.map((depo, index) => (
                                        <TableRow hover={true} key={index}>
                                            <TableCell onClick={(e) => linkToDetailPage(depo, e, getRoute("depo.detail", { depoSlug: depo?.id }))}>{index + 1 + (page * limit)}</TableCell>
                                            <TableCell onClick={(e) => linkToDetailPage(depo, e, getRoute("depo.detail", { depoSlug: depo?.id }))}>{depo?.name}</TableCell>
                                            <TableCell onClick={(e) => linkToDetailPage(depo, e, getRoute("depo.detail", { depoSlug: depo?.id }))}>{depo?.is_own ? 'Tradecorp' : '3rd Party'}</TableCell>
                                            <TableCell onClick={(e) => linkToDetailPage(depo, e, getRoute("depo.detail", { depoSlug: depo?.id }))}>{depo?.country_id != null ? cntCountry?.find((res)=>res?.country_id == depo?.country_id)?.country  : ""}</TableCell>
                                            <TableCell onClick={(e) => linkToDetailPage(depo, e, getRoute("depo.detail", { depoSlug: depo?.id }))}>{depo?.city_id != null ? cntCountry?.find((res)=>res?.city_id == depo?.city_id)?.city  : ""}</TableCell>
                                            <TableCell onClick={(e) => linkToDetailPage(depo, e, getRoute("depo.detail", { depoSlug: depo?.id }))}>{depo?.number_of_teu} teu</TableCell>
                                            <TableCell>
                                                <AvatarGroup max={4}>
                                                    {depo.officers.map((officer, index) => (
                                                        <Tooltip title={officer?.name} placement="top">
                                                            <Avatar alt="Dika" style={{ width: 32, height: 32 }} src={officer?.photo} />
                                                        </Tooltip>
                                                    ))}
                                                </AvatarGroup>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Edit" placement="top">
                                                    <IconButton size="small" onClick={() => openEditData(index)}><Icon>edit</Icon></IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete" placement="top">
                                                    <IconButton size="small" onClick={() => confirmDelete(index)}><Icon>delete</Icon></IconButton>
                                                </Tooltip>
                                            </TableCell>
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
                                            ActionsComponent={TablePaginationActions} />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={3}>
                    <Box className="ms-5" style={{ background: "#fefefe", padding: "24px" }}>
                        <h2 className="mb-3">News</h2>
                        <Divider />
                        <Scrollbars
                            autoHide
                            autoHeight
                            autoHeightMin={600}
                            renderView={(props) => (
                                <Box {...props} className={classes.newsSection} />
                            )}
                        >

                            {depoNews?.map((news) => (
                                <Box className="mt-3">
                                    <Box className="pb-3">
                                        <a href={news?.link} target="_blank">
                                            <Box className="text-hover">
                                                {news?.title?.rendered}
                                            </Box>
                                            <Box className="mb-1">
                                                <small>{news?.uagb_excerpt}</small>
                                            </Box>
                                        </a>
                                    </Box>
                                    <Divider />
                                </Box>
                            ))}
                        </Scrollbars>
                    </Box>
                </Grid>
            </Grid>
        </Box>
        <DepoForm
            open={openForm}
            isEdit={isFormEdit}
            data={editData}
            group={group}
            closeModal={() => setOpenForm(false)}
            dataInserted={refreshList}
            dataUpdated={refreshList} />
    </BaseLayoutDepoLocation>
}