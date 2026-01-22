import { Avatar, Button, Card, Container, Divider, Grid, Icon, IconButton, InputBase, List, ListItem, ListItemIcon, ListItemText, Modal, TextField, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getDetailDepoApi } from "../../../../services/api/depo.api";
import DepoSettingLayout from "./depo-settings-layout";

export default function DepoSettingOperationOfficer() {

    const router = useRouter()
    function linkToPage(e, routerSlug) {
        e.preventDefault()
        router.push(routerSlug)
    }

    var [isLoading, setLoading] = useState(true)
    var [depo, setDepo] = useState(null)

    function getDepoData() {
        getDetailDepoApi(router.query.depoSlug).then((data) => {
            setDepo(data)
            setLoading(false);
        }).catch((err) => {
            setLoading(false);
        })
    }

    useEffect(() => {
        getDepoData()
    }, [])
    
    const [open, setOpen] = useState(false);
    const openModal = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const modal = (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            <div className="modal-wrapper" style={{width: "400px"}}>
                <Card className="p-5 text-center">
                    <Icon style={{ fontSize: 40 }}>group_add</Icon>
                    <h3 className="mb-5">Add Operation Officer to {depo?.name}</h3>
                    <InputBase
                        color="secondary"
                        className="input"
                        placeholder="Enter Officer Name"
                        fullWidth>
                    </InputBase>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        disableElevation>
                        Add Operation Officer
                    </Button>
                </Card>
            </div>
        </Modal>
    )

    return <DepoSettingLayout>
        <div className="display-space-between">
            <Typography variant="h1" gutterBottom>Operation Officer</Typography>
            {/* <Button
                variant="contained"
                disableElevation
                color="primary"
                onClick={openModal}>
                <Icon>add</Icon> Add Officer
            </Button> */}
        </div>
        <Divider />
        <div className="pt-5 pb-5">
            <Card variant="outlined">
                {(depo?.officers ?? [])?.map((val, i) => {
                    return (
                        <div>
                            {(i > 0) && <Divider/>}
                            <div className="p-4 display-space-between">
                                <div className="flex-center">
                                    <Avatar alt={val?.name} className="me-3" src={val?.photo} />
                                    <div>
                                        <Typography variant="h3">{val?.name}</Typography>
                                        <Typography variant="body1" color="textSecondary">Operation Officer</Typography>
                                    </div>
                                </div>
                                {/* <IconButton size="small">
                                    <Icon>cancel</Icon>
                                </IconButton> */}
                            </div>
                        </div>
                    )
                })}
            </Card>
        </div>
        {modal}
    </DepoSettingLayout>
}