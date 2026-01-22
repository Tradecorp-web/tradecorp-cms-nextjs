import { Card, Icon, IconButton, InputBase, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from "@material-ui/core";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { useEffect, useState } from "react"
import SearchBar from "../../base_component/searchbar";
import { dateTimeFormat } from "../../../helpers/general";
import { CircularProgressCustom } from "../../base_component/spinner";
import { getListMaterialStockHistorySwr } from "../../../services/swr/material.swr"

export default function MaterialStockHistoryTable(props) {

    // ==========================================
    // [START] GET DATA & PAGINATION
    // ------------------------------------------
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(20)
    
    const [search, setSearch] = useState("")
    function serachData(search) {
        setPage(0)
        setSearch(search)
    }
    
    const [isLoading, setLoading] = useState(false)
    const [dataList, setDataList] = useState([])
    var listMaterialStockHistorySwr = getListMaterialStockHistorySwr({
        search: search, 
        page: page+1, 
        limit: limit,
        orderBy: "created_at",
        order: "desc",
    }, props?.materialId)
    useEffect(() => {
        setLoading(listMaterialStockHistorySwr?.isLoading)
        if(listMaterialStockHistorySwr?.data?.result) {
            setTotal(listMaterialStockHistorySwr?.data?.total)
            setDataList(listMaterialStockHistorySwr?.data?.result)
        }
    }, [listMaterialStockHistorySwr])
    // ------------------------------------------
    // [END] GET DATA & PAGINATION
    // ==========================================

    return <div className="card no-padding">
        <div className="p-3 display-space-between">
            <h2>Stock History</h2>
            <SearchBar style={{width: "30%"}} onSearch={(search) => serachData(search)} isLoading={isLoading} />
        </div>
        <TableContainer component={Card} elevation={0}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell width={24}>No</TableCell>
                        <TableCell align="center">Qty</TableCell>
                        <TableCell align="center">Current Stock</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Created At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {!isLoading && dataList.map((data, index) => (
                    <TableRow key={index} hover={true} onClick={(e) => openDetail(e, getRoute('material.detail', {id: data?.id}))}>
                        <TableCell>{index + 1 + (page*limit)}</TableCell>
                        <TableCell align="center">
                            <div className="flex-center" style={{justifyContent: "flex-end"}}>
                                {data?.qty}
                                {data?.qty < 0 && <Icon fontSize="small" color="error">arrow_drop_down</Icon>}
                                {data?.qty > 0 && <Icon fontSize="small" color="secondary">arrow_drop_up</Icon>}
                            </div>
                        </TableCell>
                        <TableCell align="center">{data?.current_stock}</TableCell>
                        <TableCell>{data?.description}</TableCell>
                        <TableCell>{dateTimeFormat(data?.created_at)} {data?.unit}</TableCell>
                    </TableRow>
                ))}
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
}