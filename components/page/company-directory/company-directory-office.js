import { Button, ButtonGroup, Card, Divider, Grid, Avatar, TableFooter, TablePagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Icon, Link, Select, InputBase, MenuItem } from "@material-ui/core";
import { useRouter } from "next/router";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { useEffect, useState } from "react";
import getRoute from "../../../helpers/router";
import BaseLayoutCompanyDirectory from "../../base_layout/base-layout-company-directory";
import SearchBar from "../../base_component/searchbar";
import { IconButton } from "@material-ui/core";
import AlertDialog from "../../base_component/dialog";
import { deleteProductApi } from "../../../services/api/product.api";
import { masterUserSwr } from "../../../services/swr/user.swr";
import { masterOfficeSwr } from "../../../services/swr/office.swr";

export default function Page() {

    const router = useRouter();
    const companyId = router.query.companyId

    function openDetail(e, url) {
        e.preventDefault();
        router.push(url)
    }

    const [showUsers, setShowUsers] = useState(false)

    function selectOffice(officeIndex) {
        setShowUsers(true)
        setOfficeSelected({...officesList[officeIndex]})
    }
    
    function unselectOffice() {
        setShowUsers(false)
        setOfficeSelected(null)
    }

    // ============================================
    // OFFICES
    // ============================================
    const [officeSelected, setOfficeSelected] = useState([])
    const [officesList, setOfficesList] = useState([])
    var listOfficesSwr = masterOfficeSwr({
        search: search, 
        page: page+1, 
        limit: limit,
        orderBy: "name",
        order: "asc",
        company: companyId,
    })
    useEffect(() => {
        if(listOfficesSwr?.data?.result) {
            setTotal(listOfficesSwr?.data?.total)
            setOfficesList(listOfficesSwr?.data?.result)
        }
        console.log(listOfficesSwr?.data?.result)
    }, [listOfficesSwr])

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
    var listUserSwr = masterUserSwr({
        search: search, 
        page: page+1, 
        limit: limit,
        orderBy: "name",
        order: "asc",
        companyId: officeSelected?.company?.id,
        officeId: officeSelected?.id,
    })
    useEffect(() => {
        setLoading(listUserSwr?.isLoading)
        if(listUserSwr?.data?.result) {
            setTotal(listUserSwr?.data?.total)
            setDataList(listUserSwr?.data?.result)
        }
    }, [listUserSwr])
    // ------------------------------------------
    // [END] GET DATA & PAGINATION
    // ==========================================

    return <BaseLayoutCompanyDirectory title="Company Directory">
        <div className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={12} xl={8}>
                    <h1 className="mb-3">Company Offices</h1>
                    {!showUsers && <div className="card no-padding mb-5">
                        <div className="p-3 display-space-between">
                            <SearchBar style={{width: "25%", marginRight: 24}} onSearch={(search) => searchData(search)} isLoading={isLoading} />
                        </div>
                        <Divider/>
                        <TableContainer component={Card}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={12}>No</TableCell>
                                        <TableCell>Company</TableCell>
                                        <TableCell>Office</TableCell>
                                        <TableCell>Telp</TableCell>
                                        <TableCell>City</TableCell>
                                        <TableCell>Address</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {!isLoading && officesList.map((data, index) => (
                                    <TableRow hover={true} onClick={() => selectOffice(index)}>
                                        <TableCell>{index + 1 + (page*limit)}</TableCell>
                                        <TableCell>{data?.company?.name}</TableCell>
                                        <TableCell>{data?.office_name}</TableCell>
                                        <TableCell>{data?.phone_number}</TableCell>
                                        <TableCell>{data?.city}</TableCell>
                                        <TableCell>{data?.address}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>}
                    {showUsers && <div className="card no-padding">
                        <div className="p-3 flex-center">

                            <IconButton onClick={unselectOffice} size="small" className="me-3"><Icon>arrow_back</Icon></IconButton>
                            <SearchBar style={{width: "25%", marginRight: 24}} onSearch={(search) => searchData(search)} isLoading={isLoading} />
                            <Select
                                className="input input-rounded me-3"
                                fullWidth
                                style={{width: "350px", marginRight: 24}}
                                name="size"
                                value={officeSelected ?? {}}
                                placeholder="Select Office"
                                onChange={(e) => setOfficeSelected(e.target.value)}
                                input={<InputBase placeholder="Select Office" />}>
                                <MenuItem value={{}} selected>All Office</MenuItem>
                                {officesList?.map((item, i) => {
                                    return <MenuItem key={item} value={item}>{item?.company?.name} - {item?.office_name}</MenuItem>
                                })}
                                </Select>
                        </div>
                        <Divider/>
                        <TableContainer component={Card}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={12}>No</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Phone Number</TableCell>
                                        <TableCell>Team</TableCell>
                                        <TableCell>Position</TableCell>
                                        <TableCell>Company</TableCell>
                                        <TableCell>Office</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {!isLoading && dataList.map((data, index) => (
                                    <TableRow>
                                        <TableCell>{index + 1 + (page*limit)}</TableCell>
                                        <TableCell>
                                            <Avatar alt={data?.name} src={data?.photo} />
                                        </TableCell>
                                        <TableCell>{data?.name}</TableCell>
                                        <TableCell>
                                            <Link href={`mailto:${data?.email}`}>{data?.email}</Link>
                                        </TableCell>
                                        <TableCell>{data?.phone_number}</TableCell>
                                        <TableCell>{data?.team?.name}</TableCell>
                                        <TableCell>{data?.position}</TableCell>
                                        <TableCell>{data?.company?.name}</TableCell>
                                        <TableCell>{data?.office?.office_name}</TableCell>
                                    </TableRow>
                                ))}
                                {(isLoading) && <TableRow>
                                    <TableCell colSpan={9} className="text-center text-muted" align="center">
                                        Loading...
                                    </TableCell>
                                </TableRow>}
                                {(!isLoading && dataList?.length <= 0) && <TableRow>
                                    <TableCell colSpan={9} className="text-center text-muted" align="center">
                                        No Data
                                    </TableCell>
                                </TableRow>}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[10, 20, 50, 100]}
                                            colSpan={9}
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
                    </div>}
                </Grid>
            </Grid>
        </div>
    </BaseLayoutCompanyDirectory>
}