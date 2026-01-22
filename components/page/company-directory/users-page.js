import { Card, Divider, Grid, Avatar, TableFooter, TablePagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Icon, Link, Button } from "@material-ui/core";
import { useRouter } from "next/router";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { useEffect, useState } from "react";
import BaseLayoutCompanyDirectory from "../../base_layout/base-layout-company-directory";
import SearchBar from "../../base_component/searchbar";
import { masterUserSwr } from "../../../services/swr/user.swr";
import UserForm from "../../../admin-components/pages/user/form";

export default function Page() {

    const router = useRouter();

    const [editData, setEditData] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    
    function openEditData(index) {
        setEditData(dataList[index])
        setOpenForm(true)
    }

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
    var listUserSwr = masterUserSwr({
        search: search, 
        page: page+1, 
        limit: limit,
        orderBy: "name",
        order: "asc",
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
                        <h1 className="mb-3">Manage Users</h1>
                        <div className="card no-padding">
                            <div className="p-3 display-space-between">
                                <SearchBar style={{width: "25%", marginRight: 24}} onSearch={(search) => searchData(search)} isLoading={isLoading} />
                                <Button 
                                    color="default" 
                                    variant="outlined" 
                                    disableElevation 
                                    onClick={() => {
                                        setOpenForm(true)
                                    }}>
                                    <Icon>add</Icon> Add User
                                </Button>
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
                                            <TableCell>Office</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {!isLoading && dataList.map((data, index) => (
                                        <TableRow key={index} hover={true}>
                                            <TableCell onClick={(e) => openEditData(index)}>{index + 1 + (page*limit)}</TableCell>
                                            <TableCell onClick={(e) => openEditData(index)}>
                                                <Avatar alt={data?.name} src={data?.photo} />
                                            </TableCell>
                                            <TableCell onClick={(e) => openEditData(index)}>{data?.name}</TableCell>
                                            <TableCell onClick={(e) => openEditData(index)}>
                                                <Link href={`mailto:${data?.email}`}>{data?.email}</Link>
                                            </TableCell>
                                            <TableCell onClick={(e) => openEditData(index)}>{data?.phone_number}</TableCell>
                                            <TableCell onClick={(e) => openEditData(index)}>{data?.team?.name}</TableCell>
                                            <TableCell onClick={(e) => openEditData(index)}>{data?.position}</TableCell>
                                            <TableCell onClick={(e) => openEditData(index)}>{data?.office?.office_name}</TableCell>
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
        <UserForm 
            open={openForm} 
            closeModal={() => {
                setOpenForm(false)
                listUserSwr.mutate()
            }} 
            user={editData} />
    </BaseLayoutCompanyDirectory>
}