import { Button, Card, Icon, Link, Modal, InputBase, Paper, Typography } from "@material-ui/core";
import { useState } from "react";
import readXlsxFile from 'read-excel-file'
import { dateFormatInput } from "../../../helpers/general";
import { insertMaterialApi } from "../../../services/api/material.api";

export default function MaterialImport(props) {

    var id = props?.id ?? "materialImportId"

    const [data, setData] = useState([])
    const [fileName, setFileName] = useState("")
    const [completed, setCompleted] = useState(0)
    const [uploading, setUploading] = useState(false)

    const selectFile = async (e) => {
        const file = e.target.files[0]
        var split = e.target.value.split("\\")
        setFileName(split[split.length-1])
        console.log(split[split.length-1])
        try {
            var rows = await readXlsxFile(file)
            setData([...rows])
            data.splice(0, 1)
            document.getElementById(id).value = null
        } catch (err) {
            console.log(err)
        }
    }

    const importData = async (index) => {
        setUploading(true)
        var param = {
            material_name: data[index][0],
            code: data[index][1],
            unit: data[index][2],
            stock: data[index][3],
            minimum_level_stock: data[index][4],
            price: data[index][5],
            expiration_date: data[index][6]
        }
        await insertMaterialApi(param)
        setCompleted(index + 1)
        if(index < data.length-1) {
            importData(index+1)
        } else {
            setUploading(false)
            setFileName("")
            setData([])
        }
    }

    return <Modal
        open={props?.open}
        onClose={uploading ? null : () => props?.closeModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div className="modal-wrapper" style={{width: "600px"}}>
            <Card className="modal">
                <div className="modal-content text-center">
                    <Icon style={{ fontSize: 40 }}>archive</Icon>
                    <h3 className="mb-5">Import Material</h3>
                    <Paper elevation={0} className="bg-grey p-5">
                        <Typography align="center">
                            You can import Materials Data at once.
                        </Typography>
                        <Typography align="center">
                            If you need file template, you can <Link href="/import-file/import-material-template.xlsx"><strong>Download here</strong></Link>.
                        </Typography>
                        {uploading && <Typography align="center" className="mt-5">
                            Importing... {completed}/{data.length} completed
                        </Typography>}
                        {(!uploading && data.length > 0) && <div>
                            <Typography align="center" className="mb-3 mt-5">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => importData(0)}
                                    disableElevation>
                                    Import {data.length-1} rows of data from "{fileName}"
                                </Button>
                            </Typography>
                            <Button
                                variant="contained"
                                color="default"
                                onClick={() => document.getElementById(id).click()}
                                disableElevation>
                                Change other files
                            </Button>
                        </div>}
                        {(data.length <= 0) && <Typography align="center" className="mt-5">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => document.getElementById(id).click()}
                                disableElevation>
                                Upload File Import
                            </Button>
                        </Typography>}
                        <InputBase
                            onChange={selectFile}
                            style={{display: "none"}}
                            id={id}
                            type="file"
                            accept="image/png, image/jpeg"/>
                    </Paper>
                </div>
            </Card>
        </div>
    </Modal>
}