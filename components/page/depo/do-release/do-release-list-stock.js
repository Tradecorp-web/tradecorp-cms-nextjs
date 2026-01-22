import { Card, Icon, IconButton, Link, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from "@material-ui/core";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import getRoute from "../../../../helpers/router";
import SearchBar from "../../../base_component/searchbar";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { filterableGridColumnsIdsSelector } from "@material-ui/data-grid";

export default function DoReleaseListStock(props) {

    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(10)

    const [dataList, setDataList] = useState([])

    useEffect(() => {
        setDataList(props?.data?.stocks)
    }, [props?.data])

    function filter(search) {
        var filter = props?.data?.stocks?.filter(val => {
            return val.container.serial_number.toLowerCase().includes(search.toLowerCase())
        })
        setDataList([...filter])
    }

    return (
        <div className="card no-padding">
            <div className="p-3 display-space-between">
                <h2>Containers</h2>
                <SearchBar style={{width: "230px"}} onSearch={(search) => filter(search)} />
            </div>
            <TableContainer component={Card} elevation={0}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell width={24}>No</TableCell>
                            <TableCell align="center">Serial Number</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {dataList?.slice(page*limit, (page+1)*limit)?.map((stock, index) => (
                        <TableRow key={index}>
                            <TableCell width={24}>{index+1+(page*limit)}</TableCell>
                            <TableCell align="center">{stock?.container?.serial_number}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[10, 20, 50, 100]}
                                colSpan={8}
                                count={dataList?.length ?? 0}
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
    )
}