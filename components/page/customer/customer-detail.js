import {
    Button,
    Card,
    Modal,
    Box,
    TextField,
    makeStyles,
    Backdrop,
    CircularProgress,
    Link,
    Typography,
    Grid,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {saveCustomerReferenceApi} from "../../../services/api/customer-reference.api";
import Image from "next/image";
import {getDetailCustomerApi, getLogoApi, getNpwpApi} from "../../../services/api/customer.api";
import {useRouter} from "next/router";
import {getDetailCustomerSwr} from "../../../services/swr/customer.swr";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: "auto",
    },
    paper: {
        width: 250,
        height: 300,
        overflow: "auto",
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
}));


export default function CustomerDetailForm(props) {
    const classes = useStyles();
    const router = useRouter();

    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState({
        id: null,
        phone_number : null,
        company_type : null,
        customer_code : null,
        email : null,
        fax_number : null,
        address : null,
        company : null,
        name : null,
        npwp_number :null,
        customer_logo_file :[],
        customer_npwp_file :[],
    });

    const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" });
    const [fileLogoList, setFileLogoList] = useState(null);
    const [fileNpwpList, setFileNpwpList] = useState(null);

    const onInputChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };

    useEffect(() => {
        if (props.customerDetail != null) {
            setData({
                id: props.customerDetail.id,
                phone_number : props.customerDetail.phone_number,
                company_type : props.customerDetail.company_type,
                customer_code : props.customerDetail.customer_code,
                email : props.customerDetail.email,
                fax_number : props.customerDetail.fax_number,
                address : props.customerDetail.address,
                company : props.customerDetail.company,
                name : props.customerDetail.name,
                customer_logo_file : props.customerDetail.customer_logo_file,
                customer_npwp_file : props.customerDetail.customer_npwp_file,
            });


            setTitle({ formTitle: "View Customer Detail" });
        }
    }, [props.open]);



    let customerDetailSwr = getDetailCustomerSwr(data?.id);
    // console.log(data.id);

    useEffect(async () => {
        if (props.customerDetail != null) {
            let dataLogoCustomer = await getDetailCustomerApi(props.customerDetail.id);
            setFileLogoList(dataLogoCustomer.customer_logo_file);
        }
    }, [props.open]);


    useEffect(async () => {
        if (props.customerDetail != null) {
            let dataNpwpCustomer = await getDetailCustomerApi(props.customerDetail.id);
            setFileNpwpList(dataNpwpCustomer.customer_npwp_file);
        }
    }, [props.open]);


    const closeForm = () => {
        setData({
            id: null,
            phone_number : null,
            company_type : null,
            customer_code : null,
            email : null,
            fax_number : null,
            address : null,
            company : null,
            name : null,
            npwp_number :null,
            customer_logo_file :[],
            customer_npwp_file :[],
        });
        props?.closeModal();
    };

    const downloadLogo = async (id, file_id) => {
        try {
            let response = await getLogoApi(id, file_id);
            if (response.status === 200) {
                let reader = response.body.getReader();
                let contenttype = response.headers.get("Content-Type");
                let chunks = [];
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }
                    chunks.push(value);
                }
                let content = new Blob(chunks, { type: contenttype });
                let url = window.URL.createObjectURL(content);
                let tmpLink = document.createElement("a");
                tmpLink.href = url;
                tmpLink.setAttribute("target", "_blank");
                tmpLink.click();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const downloadNpwp = async (id, file_id) => {
        try {
            let response = await getNpwpApi(id, file_id);
            if (response.status === 200) {
                let reader = response.body.getReader();
                let contenttype = response.headers.get("Content-Type");
                let chunks = [];
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }
                    chunks.push(value);
                }
                let content = new Blob(chunks, { type: contenttype });
                let url = window.URL.createObjectURL(content);
                let tmpLink = document.createElement("a");
                tmpLink.href = url;
                tmpLink.setAttribute("target", "_blank");
                tmpLink.click();
            }
        } catch (err) {
            console.log(err);
        }
    };



    return (
        <Modal
            open={props?.open}
            onClose={closeForm}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <Box className="modal-wrapper" style={{ width: "700px" }}>
                <Card className="modal">
                    <Box className="modal-header">
                        <h3>{title.formTitle}</h3>
                    </Box>
                    <Box className="modal-content">
                        <Grid container className="mb-3">
                            <Grid item xs={12} sm={6} alignItems="flex-start">
                                <Typography variant="h5" gutterBottom>Logo Customer:</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} alignItems="flex-start">
                                <Box>
                                    {fileLogoList?.map((row, key) => (
                                        <Box key={key} className="mb-3">
                                                <Link onClick={() => downloadLogo(props.customerDetail.id, row.file_id)}>
                                                    <Typography
                                                        variant="h5"
                                                        component="h5"
                                                        style={{ wordWrap: "anywhere" }}
                                                    >
                                                    </Typography>
                                                    {row.attachment ?? "No File"}
                                                </Link>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container className="mb-3">
                            <Grid item xs={12} sm={6} alignItems="flex-start">
                                <Typography variant="h5" gutterBottom>Tax Identifier Number (NPWP):</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} alignItems="flex-start">
                                <Box>
                                    {fileNpwpList?.map((row, key) => (
                                        <Box key={key} className="mb-3">
                                            <Link onClick={() => downloadNpwp(props.customerDetail.id, row.file_id)}>
                                                <Typography
                                                    variant="h5"
                                                    component="h5"
                                                    style={{ wordWrap: "anywhere" }}
                                                >
                                                </Typography>
                                                {row.attachment ?? "No File"}
                                            </Link>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>

                        <Box className="mb-3">
                            <TextField
                                label="Customer Code"
                                variant="outlined"
                                value={data.customer_code}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Box>
                        <Box className="mb-3">
                            <TextField
                                label="Email"
                                variant="outlined"
                                value={data.email}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Box>
                        <Box className="mb-3">
                            <TextField
                                label="Phone Number"
                                variant="outlined"
                                value={data.phone_number}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Box>
                        <Box className="mb-3">
                            <TextField
                                label="Fax Number"
                                variant="outlined"
                                value={data.fax_number}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Box>
                        <Box className="mb-3">
                            <TextField
                                label="Address"
                                variant="outlined"
                                value={data.address}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Box>
                        <Box className="mb-3">
                            <TextField
                                label="Name"
                                variant="outlined"
                                value={data.name}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Box>
                        <Box className="mb-3">
                            <TextField
                                label="Company Type"
                                variant="outlined"
                                value={data.company_type}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Box>
                        <Box className="mb-3">
                            <TextField
                                label="Company Name"
                                variant="outlined"
                                value={data.company}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Box>
                    </Box>

                </Card>
                <Backdrop className={classes.backdrop} open={isLoading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Box>
        </Modal>
    );
}
