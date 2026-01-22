import { Modal, Card, Button, Icon, Paper, Typography, Link } from "@material-ui/core";
import { useState } from "react";
import { CircularProgressCustom } from "./spinner";

export default function ExportDataModal(props) {

    const [isLoading, setLoading] = useState(false)

    function closeModal() {
        props?.onClose()
    }

    return <Modal
        open={props?.open}
        onClose={() => closeModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div className="modal-wrapper" style={{width: "700px"}}>
            <Card className="modal">
                <div className="modal-header">
                    <h3>{props?.title ?? "Export Data"}</h3>
                </div>
                <div className="modal-content">
                    <Paper elevation="0" className="bg-grey p-5">
                        <Typography align="center">
                            You can import many container stock data at once.
                        </Typography>
                        <Typography align="center">
                            If you need file template, you can <Link className="text-hover">Download here</Link>.
                        </Typography>
                        <Typography align="center" className="mt-3">
                            <Button
                                variant="contained"
                                color="secondary"
                                // onClick={() => sendData()}
                                disableElevation>
                                <Icon fontSize="small" className="me-2">download</Icon> {isLoading ? <CircularProgressCustom size={26} /> : "Export Data"}
                            </Button>
                        </Typography>
                    </Paper>
                </div>
            </Card>
        </div>
    </Modal>

}