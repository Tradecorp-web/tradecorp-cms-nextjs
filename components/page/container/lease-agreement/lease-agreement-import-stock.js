import { Button, ButtonGroup, Divider, Icon, InputBase, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { masterDataSwr } from "../../../../services/swr/master-data.swr";
import readXlsxFile from 'read-excel-file'
import { getDetailContainerStockBySnApi, insertContainerApi } from "../../../../services/api/container-stocks.api";

export default function LeaseAgreementImportStock(props) {

    function confirmContainerListSelected() {
        var d = data?.filter(item => item?.importable ?? false)
        props?.onDataAdded(d ?? [])
    }

    const [data, setData] = useState([])
    const [fileName, setFileName] = useState("")
    const selectFile = async (e) => {
        const file = e.target.files[0]
        var split = e.target.value.split("\\")
        setFileName(split[split.length-1])
        try {
            var rows = await readXlsxFile(file)
            var arr = [...rows]
            arr.splice(0, 1)
            document.getElementById("importFileId").value = null
            setData(arr)
        } catch (err) {
        }
    }

    const [isChecking, setChecking] = useState(false)
    const checkContainer = async (e) => {
        setChecking(true)
        data?.forEach(async (item, index) => {
            try {
                var res = await getDetailContainerStockBySnApi(item[0])
                if(res != null)
                    data[index].status = "Ready"
                    data[index].id = res?.id
                    data[index].importable = true
            } catch (err) {
                data[index].status = "Not available in stock"
                data[index].importable = false
            }
            setData([...data])
        })
        setChecking(false)
    }

    const [masterData, setMasterData] = useState([])
    var masterSwr = masterDataSwr("")
    useEffect(() => {
        if(masterSwr?.data) {
            setMasterData(masterSwr?.data)
        }
    }, [masterSwr?.data])

    const [isUploading, setUploading] = useState(false)
    const importData = async (index) => {
        index = index ?? 0
        if(data[index].importable) {
            if(index < data.length-1) {
                importData(index+1)
            } else {
                setUploading(false)
                setFileName("")
                confirmContainerListSelected()
            }
        } else {
            setUploading(true)
            var teu = 1;
            if(data[index][1].toString() == '20') teu = 1;
            if(data[index][1].toString() == '40') teu = 2;
    
            var param = {
                serial_number: data[index][0],
                size_id: masterData?.find(val => val.name.toLowerCase() == data[index][1].toString().toLowerCase())?.id ?? null,
                teu: teu,
                type_id: masterData?.find(val => val.name.toLowerCase() == data[index][2].toString().toLowerCase())?.id ?? null,
                stock_status_id: masterData?.find(val => val.name.toLowerCase() == data[index][3].toString().toLowerCase())?.id ?? null,
                repair_status_id: masterData?.find(val => val.name.toLowerCase() == data[index][4].toString().toLowerCase())?.id ?? null,
                condition_id: masterData?.find(val => val.name.toLowerCase() == data[index][5].toString().toLowerCase())?.id ?? null,
                percentage: data[index][6],
                yom_month: data[index][7],
                yom_year: data[index][8],
                csc_month: data[index][9],
                csc_year: data[index][10],
                remarks: data[index][11],
            }
            var res = await insertContainerApi(param)
            // setCompleted(index + 1)
            
            data[index].status = "Ready"
            data[index].id = res?.id
            data[index].importable = true
            setData([...data])

            if(index < data.length-1) {
                importData(index+1)
            } else {
                setUploading(false)
                setFileName("")
                confirmContainerListSelected()
            }
        }
    }

    return <div>
        {data.length <= 0 && <div className="card no-padding">
            <div className="p-3 display-space-between">
                <h3>Import Contianer Stocks</h3>
                <ButtonGroup variant="outlined" color="default"aria-label="split button">
                    <Button
                        onClick={() => props?.close()}>
                        <Icon>close_circle</Icon>
                    </Button>
                </ButtonGroup>
            </div>
            <Divider />
            <div className="p-5">
                <Typography align="center">
                    You can import Container Stocks Data at once.
                </Typography>
                <Typography align="center">
                    If you need file template, you can <Link href="/import-file/import-stock-template.xlsx"><strong>Download here</strong></Link>.
                </Typography>
                <Typography align="center" className="mt-3">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => document.getElementById("importFileId").click()}
                        disableElevation>
                        Upload File Import
                    </Button>
                    <InputBase
                        onChange={selectFile}
                        style={{display: "none"}}
                        id="importFileId"
                        type="file"
                        accept="image/png, image/jpeg"/>
                </Typography>
            </div>
        </div>}
        {data.length > 0 && <div className="card no-padding">
            <div className="p-3 display-space-between">
                <h3>List of Selected Containers</h3>
                <ButtonGroup variant="outlined" color="default"aria-label="split button">
                    <Button
                        onClick={() => checkContainer()}>
                        Check Item
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
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item[0]}</TableCell>
                            <TableCell>{item[1]}/{item[2]}</TableCell>
                            <TableCell>{item[7]}-{item[8]}</TableCell>
                            <TableCell>
                                {item?.status}
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="p-3 display-space-between">
                <div>Make sure containers in the list is correct</div>
                <ButtonGroup variant="contained" disableElevation={true} color="secondary"aria-label="split button">
                    <Button
                        onClick={() => importData()}>
                        <Icon className="me-2">check_circle</Icon>Save Container List
                    </Button>
                </ButtonGroup>
            </div>
        </div>}
    </div>
}