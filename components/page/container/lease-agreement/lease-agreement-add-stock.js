import { Button, ButtonGroup, Card, Divider, Grid, Icon, IconButton, InputBase, InputLabel, MenuItem, Modal, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Tooltip, Typography } from "@material-ui/core";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { useEffect, useState } from "react";
import { getListContainerStockSwr } from "../../../../services/swr/container-stock.swr";
import { masterDataSwr } from "../../../../services/swr/master-data.swr";

export default function LeaseAgreementAddStock(props) {

    useEffect(() => {
        if(props?.open) {
            var data = props?.containerList?.map((val, i) => {
                return val?.container
            })
            setSelectedContainers([...data])
        }
    }, [])

    const [formState, setFormState] = useState(null)
    function onChangeInput(e) {
      setFormState({...formState, [e.target.name]: e.target.value})
    }

    // ==========================================
    // [START] GET DATA & PAGINATION
    // ------------------------------------------
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(10)
    
    const [size, setSize] = useState("")
    const [yom, setYom] = useState("")
    const [status, setStatus] = useState("")
    const [condition, setCondition] = useState("")
    
    const [isLoading, setLoading] = useState(false)
    const [dataList, setDataList] = useState([])
    var listContainerStockSwr = getListContainerStockSwr({
        page: page+1, 
        limit: limit,
        orderBy: "serial_number",
        order: "asc",
        size: size,
        yom: yom,
        status: status,
        condition: condition,
    })
    useEffect(() => {
        setLoading(listContainerStockSwr?.isLoading)
        if(listContainerStockSwr?.data?.result) {
        setTotal(listContainerStockSwr?.data?.total)
        setDataList(listContainerStockSwr?.data?.result)
        }
    }, [listContainerStockSwr])

    const [conditionOptions, setConditionOptions] = useState([])
    const [statusOptions, setStatusOptions] = useState([])
    const [sizeOptions, setSizeOptions] = useState([])
    var masterSwr = masterDataSwr("")
    useEffect(() => {
        if(masterSwr?.data) {
        setConditionOptions(masterSwr?.data?.filter(val => val?.category == "condition") ?? [])
        setStatusOptions(masterSwr?.data?.filter(val => val?.category == "stock_status") ?? [])
        setSizeOptions(masterSwr?.data?.filter(val => val?.category == "container_size") ?? [])
        }
    }, [masterSwr?.data])

    function changeFilter() {
        setPage(0)
        setSize(formState?.size?.id)
        setYom(formState?.yom)
        setStatus(formState?.status?.id)
        setCondition(formState?.condition?.id)
    }
    // ------------------------------------------
    // [END] GET DATA & PAGINATION
    // ==========================================
    
    const [isShowSelectedContainers, setIsShowSelectedContainers] = useState(false)
    const [selectedContainers, setSelectedContainers] = useState([])
    function addContainer(index) {
        setSelectedContainers([...selectedContainers, dataList[index]])
    }
    function minContainer(index) {
        var idx = selectedContainers?.findIndex((item) => item.id == dataList[index].id)
        selectedContainers.splice(idx, 1)
        setSelectedContainers([...selectedContainers])
    }
    function deleteContainerByIndex(index) {
        console.log(selectedContainers)
        selectedContainers.splice(index, 1)
        setSelectedContainers([...selectedContainers])
    }

    function isContainerSelected(index) {
        var result = false
        for(var i=0; i<selectedContainers?.length; i++) {
            result = dataList[index].serial_number == selectedContainers[i].serial_number
            if(result) break
        }
        return result
    }

    function confirmContainerListSelected() {
        props?.onDataAdded(selectedContainers ?? [])
    }

    return <div>
        {!isShowSelectedContainers && <div className="card no-padding">
            <div className="p-3 display-space-between">
                <h3>Select Contianer From Stocks</h3>
                <ButtonGroup variant="outlined" color="default"aria-label="split button">
                    <Button
                        onClick={() => setIsShowSelectedContainers(true)}>
                        Show Selected Container: {selectedContainers?.length}
                    </Button>
                    <Button
                        onClick={() => props?.close()}>
                        <Icon>close_circle</Icon>
                    </Button>
                </ButtonGroup>
            </div>
            <Divider />
            <div className="p-3 display-space-between">
                <div className="flex-center me-3" style={{flexGrow: 1}}>
                    <Select
                        className="input input-rounded me-3"
                        fullWidth
                        style={{width: "100px", marginRight: 24}}
                        name="size"
                        value={formState?.size ?? "Select Size"}
                        onChange={onChangeInput}
                        input={<InputBase placeholder="Select Size" />}>
                        <MenuItem value="all" selected>All Size</MenuItem>
                        {sizeOptions?.map((item, i) => {
                            return <MenuItem key={item} value={item}>{item?.name}</MenuItem>
                        })}
                    </Select>
                    <InputBase 
                        className="input input-rounded bold uppercase" 
                        fullWidth 
                        max="9999"
                        style={{width: "100px", marginRight: 24}}
                        type="number"
                        name="yom"
                        value={formState?.yom ?? ""}
                        onChange={onChangeInput}
                        placeholder="2010"/>
                    <Select
                        className="input input-rounded me-3"
                        fullWidth
                        name="status"
                        style={{width: "180px", marginRight: 24}}
                        value={formState?.status ?? "Select Status"}
                        onChange={onChangeInput}
                        input={<InputBase placeholder="Select Status" />}>
                        <MenuItem value="all" selected>All Status</MenuItem>
                        {statusOptions?.map((item, i) => {
                            return <MenuItem key={item} value={item}>{item?.name}</MenuItem>
                        })}
                    </Select>
                    <Select
                        className="input input-rounded me-3"
                        fullWidth
                        name="condition"
                        style={{width: "180px", marginRight: 24}}
                        value={formState?.condition ?? "Select Condition"}
                        onChange={onChangeInput}
                        input={<InputBase placeholder="Select Condition" />}>
                        <MenuItem value="all" selected>All Condition</MenuItem>
                        {conditionOptions?.map((item, i) => {
                            return <MenuItem key={item} value={item}>{item?.name}</MenuItem>
                        })}
                    </Select>
                    <Button 
                        color="primary" 
                        fullWidth 
                        variant="contained" 
                        style={{width: "100px", marginRight: 24, borderRadius: 50}}
                        onClick={changeFilter}
                        disabled={isLoading}
                        disableElevation>
                        Filter
                    </Button>
                </div>
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
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {!isLoading && dataList.map((data, index) => (
                        <TableRow key={index} hover={true}>
                            <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>{index + 1 + (page*limit)}</TableCell>
                            <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>{data?.serial_number}</TableCell>
                            <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>{data?.size?.name}/{data?.type?.name}</TableCell>
                            <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>{data?.yom_year}</TableCell>
                            <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>{data?.depo?.name}</TableCell>
                            <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>{data?.stock_status?.name}</TableCell>
                            <TableCell onClick={() => !isContainerSelected(index) ? addContainer(index) : minContainer(index)}>
                                {!isContainerSelected(index) && <IconButton
                                    onClick={() => addContainer(index)}
                                    color="secondary"
                                    size="small">
                                    <Icon>add_circle</Icon>
                                </IconButton>}
                                {isContainerSelected(index) && <IconButton
                                    onClick={() => minContainer(index)}
                                    color="default"
                                    size="small">
                                    <Icon>remove_circle</Icon>
                                </IconButton>}
                            </TableCell>
                        </TableRow>
                    ))}
                    {(isLoading) && <TableRow>
                        <TableCell colSpan={15} className="text-center text-muted" align="center">
                            Loading...
                        </TableCell>
                    </TableRow>}
                    {(!isLoading && dataList?.length <= 0) && <TableRow>
                        <TableCell colSpan={15} className="text-center text-muted" align="center">
                            No Data
                        </TableCell>
                    </TableRow>}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[10, 20, 50, 100]}
                                colSpan={15}
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
            <div className="p-3 display-space-between">
                <div>Make sure containers in the list is correct</div>
                <ButtonGroup variant="contained" disableElevation={true} color="secondary"aria-label="split button">
                    <Button
                        onClick={() => confirmContainerListSelected()}>
                        <Icon className="me-2">check_circle</Icon>Save Container List
                    </Button>
                </ButtonGroup>
            </div>
        </div>}
        {isShowSelectedContainers && <div className="card no-padding">
            <div className="p-3 display-space-between">
                <h3>List of Selected Containers</h3>
                <ButtonGroup variant="outlined" color="default"aria-label="split button">
                    <Button
                        onClick={() => setIsShowSelectedContainers(false)}>
                        Select Other Containers
                    </Button>
                    <Button
                        onClick={() => props?.close()}>
                        <Icon>close_circle</Icon>
                    </Button>
                </ButtonGroup>
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
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {!isLoading && selectedContainers.map((data, index) => (
                        <TableRow key={index} hover={true}>
                            <TableCell onClick={() => deleteContainerByIndex(index)}>{index + 1 + (page*limit)}</TableCell>
                            <TableCell onClick={() => deleteContainerByIndex(index)}>{data?.serial_number}</TableCell>
                            <TableCell onClick={() => deleteContainerByIndex(index)}>{data?.size?.name}/{data?.type?.name}</TableCell>
                            <TableCell onClick={() => deleteContainerByIndex(index)}>{data?.yom_year}</TableCell>
                            <TableCell onClick={() => deleteContainerByIndex(index)}>{data?.depo?.name}</TableCell>
                            <TableCell onClick={() => deleteContainerByIndex(index)}>{data?.stock_status?.name}</TableCell>
                            <TableCell onClick={() => deleteContainerByIndex(index)}>
                                <IconButton
                                    onClick={() => deleteContainerByIndex(index)}
                                    color="default"
                                    size="small">
                                    <Icon>remove_circle</Icon>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {(isLoading) && <TableRow>
                        <TableCell colSpan={15} className="text-center text-muted" align="center">
                            Loading...
                        </TableCell>
                    </TableRow>}
                    {(!isLoading && selectedContainers?.length <= 0) && <TableRow>
                        <TableCell colSpan={15} className="text-center text-muted" align="center">
                            No Data
                        </TableCell>
                    </TableRow>}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[10, 20, 50, 100]}
                                colSpan={15}
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
            <div className="p-3 display-space-between">
                <div>Make sure containers in the list is correct</div>
                <ButtonGroup variant="contained" disableElevation={true} color="secondary"aria-label="split button">
                    <Button
                        onClick={() => confirmContainerListSelected()}>
                        <Icon className="me-2">check_circle</Icon>Save Container List
                    </Button>
                </ButtonGroup>
            </div>
        </div>}
    </div>
}