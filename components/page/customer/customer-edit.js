import BaseLayout from "../../base_layout/base-layout";
import {
  Icon,
  Divider,
  Button,
  OutlinedInput,
  Box,
  Collapse,
  IconButton,
  Typography,
  ButtonBase,
  Paper,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  TextField,
  MenuItem,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";
import {
  getDetailCustomerApi,
  insertFileCustomerLogoApi,
  insertFileCustomerNpwpApi,
  getLogoApi,
  getNpwpApi,
  updateCustomerApi,
} from "../../../services/api/customer.api";
import {
  getDetailCustomerSwr,
  getListCompanyTypeSwr,
} from "../../../services/swr/customer.swr";
import { FileUploadSecureComponent } from "../../base_component/file-upload";
import { dateTimeFormat } from "../../../helpers/general";
import DeleteIcon from "@material-ui/icons/Delete";
import AlertDialog from "../../base_component/dialog";
import useOnclickOutside from "react-cool-onclickoutside";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 10,
    fontSize: 10,
  },
  rootmenu: {
    "& > *": {
      margin: theme.spacing(1),
      fontSize: 10,
    },
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    marginTop: 20,
    maxWidth: "80%",
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },

  labelbase: {
    marginTop: 10,
    fontSize: 12,
  },
  labelbasebold: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "bold",
  },
  inputbase: {
    fontSize: "12px !important",
    height: 40,
  },
  inputbasemultiline: {
    fontSize: "12px !important",
  },
  inputbasero: {
    fontSize: "12px !important",
    height: 40,
    backgroundColor: "#eaecee",
    color: "#000000",
  },

  comboBox: {
    fontSize: "12px",
  },

  comboOptions: {
    fontSize: "12px",
    color: "#000000",
  },
  tablehead: {
    fontSize: "12px",
    color: "#000000",
    fontWeight: "bold",
  },
  tablefooter: {
    color: "#000000",
    fontWeight: "bold",
  },
  tableheadr: {
    fontSize: "12px",
    color: "#000000",
    fontWeight: "bold",
    textAlign: "right",
  },
  tablerow: {
    fontSize: "12px",
    color: "#000000",
  },
  tablerowr: {
    fontSize: "12px",
    color: "#000000",
    textAlign: "right",
  },
  titlecard: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000",
  },
}));

export default function CustomerEditPage() {
  const classes = useStyles();
  const router = useRouter();

  /* Start of useState */

  const [formState, setFormState] = useState({
    id: null,
    phone_number: null,
    company_type: null,
    customer_code: null,
    email: null,
    fax_number: null,
    address: null,
    company: null,
    name: null,
  });
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [errorText, setErrorText] = useState({
    name: null,
    address: null,
    company_type: null,
    company: null,
    phone_number: null,
    email: null,
    npwp_number: null,
    fax_number: null,
  });
  const [companyType, setCompanyType] = useState(null);
  const [companyTypeList, setCompanyTypeList] = useState([]);
  const [fileLogoList, setFileLogoList] = useState(null);
  const [fileNpwpList, setFileNpwpList] = useState(null);
  const [fileLogoUpload, setFileLogoUpload] = useState({
    file_id: null,
    file_description: null,
    link: null,
    attachment: null,
    content_type: null,
  });
  const [fileNpwpUpload, setFileNpwpUpload] = useState({
    file_id: null,
    file_description: null,
    link: null,
    attachment: null,
    content_type: null,
  });
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [isOpenConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);
        console.log("📍 Coordinates: ", { lat, lng });
      });
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <MenuItem
          key={place_id}
          onClick={handleSelect(suggestion)}
          className={classes.comboOptions}
        >
          <strong>{main_text}</strong>
          <small>{secondary_text}</small>
        </MenuItem>
      );
    });

  /* End of useState */

  /*Start of SWR*/

  const companyTypeSwr = getListCompanyTypeSwr();
  const customerId = router.query.id;
  const custSwr = getDetailCustomerSwr(customerId);

  /*End of SWR*/

  /* Start of useEffect */

  useEffect(async () => {
    try {
      if (custSwr?.data) {
        document.getElementById("name").value = custSwr?.data?.name;
        document.getElementById("address").value = custSwr?.data?.address;
        document.getElementById("company_type").value =
          custSwr?.data?.company_type;
        document.getElementById("phone_number").value =
          custSwr?.data?.phone_number;
        document.getElementById("email").value = custSwr?.data?.email;
        document.getElementById("fax_number").value = custSwr?.data?.fax_number;
        document.getElementById("company").value = custSwr?.data?.company;
        setFormState({
          ...formState,
          name: custSwr?.data?.name,
          address: custSwr?.data?.address,
          company_type: custSwr?.data?.company_type,
          phone_number: custSwr?.data?.phone_number,
          email: custSwr?.data?.email,
          fax_number: custSwr?.data?.fax_number,
          company: custSwr?.data?.company,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }, [custSwr?.data]);

  useEffect(() => {
    if (companyTypeSwr?.data) {
      setCompanyTypeList(companyTypeSwr?.data?.result ?? []);
    }
  }, [companyTypeSwr?.data]);

  useEffect(async () => {
    try {
      let dataLogoCustomer = await getDetailCustomerApi(customerId);
      setFileLogoList(dataLogoCustomer.customer_logo_file);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(async () => {
    try {
      let dataNpwpCustomer = await getDetailCustomerApi(customerId);
      setFileNpwpList(dataNpwpCustomer.customer_npwp_file);
    } catch (err) {
      console.log(err);
    }
  }, []);

  /* End of useEffect */

  /* Start of function */

  const onChangeInput = (event) => {
    setFormState({
      ...formState,
      companyType: companyType,

      [event.target.name]: event.target.value,
    });
  };

  function confirmDelete(index) {
    setDeleteIndex(index);
    setOpenConfirmationDialog(true);
  }

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

  const onLogoUploaded = (res) => {
    console.info("fileLogoUpload", fileLogoUpload);
    if (res != null) {
      setFileLogoUpload({
        ...fileLogoUpload,
        link: res.link,
        attachment: res.file_name,
        content_type: res.content_type,
        deleted_at: null,
      });
      // fileLogoList.push({
      fileListData.push({
        file_id: "",
        link: res.link,
        attachment: res.attachment,
        content_type: res.content_type,
      });
    }
  };

  const onNpwpUploaded = (res) => {
    if (res != null) {
      setFileNpwpUpload({
        ...fileNpwpUpload,
        link: res.link,
        attachment: res.file_name,
        content_type: res.content_type,
        deleted_at: null,
      });
      fileListData.push({
        file_id: "",
        link: res.link,
        attachment: res.attachment,
        content_type: res.content_type,
      });
    }
  };

  const getFileDelete = () => {
    setFileLogoUpload({
      ...fileLogoUpload,
    });
  };

  const deleteLogoFile = (id) => {
    setFileLogoUpload({
      ...fileLogoUpload,
      deleted_at: id,
    });
  };

  const deleteNpwpFile = (id) => {
    setFileNpwpUpload({
      ...fileNpwpUpload,
      deleted_at: id,
    });
  };

  const sendLogoFile = (id) => {
    // if (checkValidation()) {
    insertFileCustomerLogoApi(id, fileLogoUpload)
      .then((res) => {
        setFileLogoList(res.customer_logo_file);
        setFileLogoUpload({
          file_id: null,
          file_description: null,
          link: null,
          attachment: null,
          content_type: null,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };

  const sendNpwpFile = (id) => {
    // if (checkValidation()) {
    insertFileCustomerNpwpApi(id, fileNpwpUpload)
      .then((res) => {
        setFileNpwpList(res.customer_npwp_file);
        setFileNpwpUpload({
          file_id: null,
          file_description: null,
          link: null,
          attachment: null,
          content_type: null,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };

  function checkValidation() {
    let isValid = true;

    let eName = "";
    let eEmail = "";
    let eAddress = "";
    let eCompanyType = "";
    let ePhoneNumber = "";

    if (formState.name === "" || formState.name == null) {
      isValid = false;
      eName = "Name cannot be empty";
    }

    if (formState.email === "" || formState.email == null) {
      isValid = false;
      eEmail = "Email cannot be empty";
    }

    if (formState.phone_number === "" || formState.phone_number == null) {
      isValid = false;
      ePhoneNumber = "Phone Number cannot be empty";
    }

    if (formState.company_type === "" || formState.company_type == null) {
      isValid = false;
      eCompanyType = "Company Type cannot be empty";
    }

    formState.address = document.getElementById("address").value;
    if (formState.address === "" || formState.address == null) {
      isValid = false;
      eAddress = "Address cannot be empty";
    }

    setErrorText({
      ...errorText,
      name: eName,
      email: eEmail,
      address: eAddress,
      company_type: eCompanyType,
      phone_number: ePhoneNumber,
    });
    console.log("errorText", errorText);
    return isValid;
  }

  const sendData = (id) => {
    if (checkValidation()) {
      formState.address = document.getElementById("address").value;
      updateCustomerApi(formState, id)
        .then((res) => {
          router.push("/customer/customer-page");
        })
        .catch((err) => {
          console.log(err);
          setErrorText(err);
        });
    }
  };

  function openPage(e, route) {
    e.preventDefault();
    router.push(route).then((r) => {
      return r;
    });
  }

  /* End of Function */

  return (
    <BaseLayout title="Add Customer">
      <div className={classes.root}>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Typography variant="subtitle1">Customer</Typography>
          </Box>
        </Box>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Divider />
          </Box>
        </Box>
        <Box container>
          <Box item xs={12} style={{ textAlign: "center" }}>
            <div className={classes.rootmenu}>
              <Button
                variant="contained"
                onClick={(e) => openPage(e, getRoute("customer"))}
              >
                <Icon style={{ fontSize: 20, color: "#999" }}>home</Icon>
              </Button>
              <Button
                variant="contained"
                color="default"
                onClick={(e) => openPage(e, getRoute("customer.customer-page"))}
              >
                <Icon style={{ fontSize: 20, color: "yellow" }}>
                  pending_actions
                </Icon>
                Customer List
              </Button>
            </div>
          </Box>
        </Box>

        <Paper className={classes.paper}>
          <Box container spacing={2}>
            <Box item>
              <ButtonBase>
                <Icon style={{ fontSize: 30, color: "#5d6d7e" }}>
                  visibility
                </Icon>
              </ButtonBase>{" "}
            </Box>
            <Box item xs={12} sm container>
              <Box item xs container direction="column" spacing={2}>
                <Box item xs>
                  <Typography gutterBottom variant="subtitle1">
                    Customer
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box container spacing={2}>
            <Box item xs={6} style={{ textAlign: "center" }}>
              <Collapse in={open}>
                <Alert
                  severity="success"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  Insert data success!
                </Alert>
              </Collapse>
              <Collapse in={openAlert}>
                <Alert
                  severity="warning"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpenAlert(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                ></Alert>
              </Collapse>
              <AlertDialog
                title="Delete Item"
                body={`Are you sure you want to delete this?`}
                open={isOpenConfirmationDialog}
                cancelAction={() => setOpenConfirmationDialog(false)}
                okAction=""
              />
            </Box>
            <Box container spacing={2}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item={true} xs={6}>
                    <Typography className={classes.labelbase}>Name</Typography>
                  </Grid>
                  <Grid item={true} xs={6}>
                    <Typography className={classes.labelbase}>Email</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={2}>
                  <Grid item={true} xs={6}>
                    <OutlinedInput
                      id="name"
                      className={classes.inputbase}
                      name="name"
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      // defaultValue={custSwr?.formState?.name ?? ""}
                      type="text"
                      error={!!errorText.name}
                      required
                      helperText={errorText.name}
                      onChange={onChangeInput}
                      fullWidth
                    ></OutlinedInput>
                    {errorText.name}
                  </Grid>
                  <Grid item={true} xs={6}>
                    <OutlinedInput
                      id="email"
                      className={classes.inputbase}
                      name="email"
                      type="email"
                      onChange={onChangeInput}
                      // defaultValue={custSwr?.formState?.email ?? ""}
                      error={!!errorText.email}
                      helpertext={errorText.email}
                      fullWidth
                    ></OutlinedInput>
                    {errorText.email}
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>

          <Box container spacing={2}>
            <Box>
              <Grid container spacing={2}>
                <Grid item={true} xs={6}>
                  <Typography className={classes.labelbase}>
                    Phone Number
                  </Typography>
                </Grid>
                <Grid item={true} xs={6}>
                  <Typography className={classes.labelbase}>
                    Fax Number
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Grid container spacing={2}>
                <Grid item={true} xs={6}>
                  <OutlinedInput
                    id="phone_number"
                    className={classes.inputbase}
                    name="phone_number"
                    type="text"
                    // defaultValue={formState?.phone_number ?? ""}
                    error={!!errorText.phone_number}
                    helperText={errorText.phone_number}
                    onChange={onChangeInput}
                    fullWidth
                  ></OutlinedInput>
                  {errorText.phone_number}
                </Grid>
                <Grid item={true} xs={6}>
                  <OutlinedInput
                    id="fax_number"
                    className={classes.inputbase}
                    name="fax_number"
                    type="text"
                    // defaultValue={custSwr?.formState?.fax_number ?? ""}
                    onChange={onChangeInput}
                    fullWidth
                  ></OutlinedInput>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box container spacing={2}>
            <Box>
              <Grid container spacing={2}>
                <Grid item={true} xs={6}>
                  <Typography className={classes.labelbase}>
                    Company Type
                  </Typography>
                </Grid>
                <Grid item={true} xs={6}>
                  <Typography className={classes.labelbase}>
                    Company Name
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Grid container spacing={2}>
                <Grid item={true} xs={6}>
                  <TextField
                    id="company_type"
                    className={classes.comboBox}
                    name="company_type"
                    select
                    size={"small"}
                    variant="outlined"
                    required
                    // defaultValue={custSwr?.formState?.company_type}
                    value={formState.company_type}
                    onChange={onChangeInput}
                    error={!!errorText.company_type}
                    helpertext={errorText.company_type}
                    fullWidth
                  >
                    <MenuItem
                      id="company_type"
                      className={classes.comboOptions}
                      value="null"
                    >
                      <em>None</em>
                    </MenuItem>
                    {companyTypeList?.map((row, key) => {
                      return (
                        <MenuItem
                          key={key}
                          value={row.company_type}
                          className={classes.comboOptions}
                        >
                          {row?.company_type} - {row?.name}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                  {errorText.company_type}
                </Grid>
                <Grid item={true} xs={6}>
                  <OutlinedInput
                    id="company"
                    className={classes.inputbasero}
                    name="company"
                    type="text"
                    onChange={onChangeInput}
                    error={!!errorText.company}
                    helpertext={errorText.company}
                    fullWidth
                    readOnly={true}
                  ></OutlinedInput>
                  {!!errorText.company}
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box container spacing={2}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>Address</Typography>
            </Box>
            <Box item xs={10}>
              {/*{isLoaded &&  */}
              {/*    <div ref={ref} className={classes.root}>*/}
              <OutlinedInput
                id="address"
                name="address"
                className={classes.inputbasemultiline}
                error={!!errorText.address}
                helperText={errorText.address}
                value={value ? value : custSwr?.data?.address}
                // defaultValue={formState.address}
                // defaultValue={value ? value : formState.address}

                onChange={handleInput}
                // disabled={!ready}
                placeholder="Type the customer address here"
                fullWidth
                // defaultValue={formState?.address ?? ""}
              />
              {/* We can use the "status" to decide whether we should display the dropdown or not */}
              {status === "OK" && (
                <ul className={classes.comboOptions}>{renderSuggestions()}</ul>
              )}
              {/*</div>*/}
              {/*}*/}
              {errorText.address}
            </Box>
          </Box>
        </Paper>

        <Paper className={classes.paper}>
          <Box container>
            <Box item xs={12} style={{ textAlign: "center" }}>
              <div className={classes.rootmenu}>
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography className={classes.labelbase}>
                        Customer Logo
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box>
                  <Grid container spacing={2} xs={12}>
                    <Grid item xs={11} sm={11}>
                      <FileUploadSecureComponent
                        id="customerLogo"
                        path="customer/logo"
                        fileUploaded={(res) => onLogoUploaded(res)}
                        url={fileLogoUpload.link}
                        deleteFile={() => onLogoUploaded(null)}
                      />
                    </Grid>
                    <Grid item xs={1} sm={1}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => sendLogoFile(custSwr?.data?.id)}
                      >
                        Upload
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                <Box className="mb-3">
                  <TableContainer component={Paper}>
                    <Table stickyHeader aria-label="Item Description">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">No</TableCell>
                          <TableCell align="left">File Name</TableCell>
                          <TableCell align="left">Upload Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fileLogoList != null &&
                          fileLogoList?.map((row, key) => (
                            <TableRow hover>
                              <TableCell key={row + key} align="left">
                                {key + 1}
                              </TableCell>
                              <TableCell key={row + key} align="left">
                                {row.attachment} {row.uom}
                              </TableCell>
                              <TableCell key={row + key} align="left">
                                {dateTimeFormat(row.send_date)}
                              </TableCell>
                              <TableCell>
                                {row.thumbnail != null && (
                                  <Box>
                                    <Link
                                      onClick={() =>
                                        downloadLogo(customerId, row.file_id)
                                      }
                                    >
                                      <Typography
                                        variant="h5"
                                        component="h5"
                                        style={{ wordWrap: "anywhere" }}
                                      >
                                        {row.attachment}
                                      </Typography>
                                    </Link>
                                  </Box>
                                )}
                              </TableCell>

                              <TableCell key={row + key} align="left">
                                <IconButton
                                  aria-label="close"
                                  color="inherit"
                                  size="small"
                                  onMouseEnter={() => getFileDelete()}
                                  onClick={() => confirmDelete(key)}
                                >
                                  <DeleteIcon fontSize="inherit" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </div>
            </Box>
          </Box>
        </Paper>

        <Paper className={classes.paper}>
          <Box container>
            <Box item xs={12} style={{ textAlign: "center" }}>
              <div className={classes.rootmenu}>
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography className={classes.labelbase}>
                        Taxpayer Identification Number (NPWP) File
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={11}>
                      <FileUploadSecureComponent
                        id="customerNpwp"
                        path="customer/npwp"
                        fileUploaded={(res) => onNpwpUploaded(res)}
                        url={fileNpwpUpload.link}
                        deleteFile={() => onNpwpUploaded(null)}
                      />
                    </Grid>
                    <Grid item xs={1} sm={1}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => sendNpwpFile(custSwr?.data?.id)}
                      >
                        Upload
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                <Box className="mb-3">
                  <TableContainer component={Paper}>
                    <Table stickyHeader aria-label="Item Description">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">No</TableCell>
                          <TableCell align="left">File Name</TableCell>
                          <TableCell align="left">Upload Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fileNpwpList != null &&
                          fileNpwpList?.map((row, key) => (
                            <TableRow hover>
                              <TableCell key={row + key} align="left">
                                {key + 1}
                              </TableCell>
                              <TableCell key={row + key} align="left">
                                {row.attachment} {row.uom}
                              </TableCell>
                              <TableCell key={row + key} align="left">
                                {dateTimeFormat(row.send_date)}
                              </TableCell>
                              <TableCell>
                                {row.thumbnail != null && (
                                  <Box>
                                    <Link
                                      onClick={() =>
                                        downloadNpwp(customerId, row.file_id)
                                      }
                                    >
                                      <Typography
                                        variant="h5"
                                        component="h5"
                                        style={{ wordWrap: "anywhere" }}
                                      >
                                        {row.attachment}
                                      </Typography>
                                    </Link>
                                  </Box>
                                )}
                                {/* {row.attachment == null && (
                            <Link
                              onClick={() => downloadFile(soId, row.file_id)}
                            >
                              {row.attachment}
                            </Link>
                          )} */}
                              </TableCell>
                              <TableCell key={row.file_id} align="left">
                                <IconButton
                                  aria-label="close"
                                  color="inherit"
                                  size="small"
                                  onMouseEnter={() => getFileDelete()}
                                  onClick={() =>
                                    deleteNpwpFile(custSwr?.data?.id)
                                  }
                                >
                                  <DeleteIcon fontSize="inherit" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </div>
              <Grid container>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    // disabled={}
                    onClick={() => sendData(custSwr?.data?.id)}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </div>
    </BaseLayout>
  );
}
