import { Button, Card, Icon, InputBase, InputLabel, Link, MenuItem, Modal, Paper, Select, Typography } from "@material-ui/core";

export default function VendorImport(props) {
    return <Modal
        open={props?.open}
        onClose={() => props?.closeModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div className="modal-wrapper" style={{width: "500px"}}>
            <Card className="p-5 text-center">
                <Icon style={{ fontSize: 40 }}>archive</Icon>
                <h3 className="mb-5">Import Vendor</h3>
                <Paper elevation="0" className="bg-grey p-5">
                    <Typography align="center">
                        You can import Vendors Data at once.
                    </Typography>
                    <Typography align="center">
                        If you need file template, you can <Link>Download here</Link>.
                    </Typography>
                    <Typography align="center" className="mt-5">
                        <Button
                            variant="contained"
                            color="primary"
                            disableElevation>
                            Upload File Import
                        </Button>
                    </Typography>
                </Paper>
            </Card>
        </div>
    </Modal>
}