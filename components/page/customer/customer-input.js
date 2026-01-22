// import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import BaseLayout from "../../base_layout/base-layout";
import {
  Icon,
  Divider,
  Button,
  TextField,
  OutlinedInput,
  Box,
  Collapse,
  IconButton,
  Typography,
  ButtonBase,
  Paper,
  Grid,
  MenuItem
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";
import {getListCompanyTypeSwr, getListCustomerSwr} from "../../../services/swr/customer.swr";
import Autocomplete, {createFilterOptions} from "@material-ui/lab/Autocomplete";
import {insertCustomerApi} from "../../../services/api/customer.api";
import { getListCustomerReferenceSwr } from "../../../services/swr/customer-reference.swr";
import useOnclickOutside from "react-cool-onclickoutside";

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
    height: 30,
  },
  inputbasemultiline: {
    fontSize: "12px !important",
  },
  inputbasero: {
    fontSize: "12px !important",
    height: 30,
    backgroundColor: "#eaecee",
    color: "#000000",
  },

  comboBox: {
    fontSize: "12px",
    height: 30,
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
const filter = createFilterOptions();


export default function Page() {
  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: "AIzaSyBU_ExlpWlcM2ToV_OAcIIB2cOTLxBBbFs",
  //   // googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
  //
  // });


  const classes = useStyles();
  const router = useRouter();
  const [formState, setFormState] = useState(
      {
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
        companyType: null,
      });
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [disableSave, setDisableSave] = useState(true);
  const [errorText, setErrorText] = useState({
    name : null,
    address : null,
    company_type : null,
    company : null,
    phone_number : null,
    email : null,
    npwp_number : null,
    fax_number : null,
  });
  const [companyTypeList, setCompanyTypeList] = useState([]);
  // const [paymentTermList, setpaymentTermList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [optionCompanyList, setOptionCompanyList] = useState([]);

  const [companyName, setCompanyName] = useState(null);
  const [addressValue, setAddressValue] = useState({
    address: "",
  });

  const handleAddress = (e) => {
    setAddressValue({
      ...addressValue,
      [e.target.name]: e.target.value,
    });
  }

  // const customerId = router.query.id;
  // alert(customerId);
  // const custSwr = getDetailCustomerApi(customerId)

  function checkValidation() {
    let isValid = true;

    let eName = "";
    let eEmail = "";
    let eAddress = "";
    let eCompanyType = "";
    let eCompany = "";
    let ePhoneNumber = "";


    if (formState.name === "" || formState.name == null) {
      isValid = false;
      eName = "Name can not be empty";
    }

    if (formState.email === "" || formState.email == null){
      isValid = false;
      eEmail = "Email can not be empty";
    }

    if (formState.phone_number === "" || formState.phone_number == null) {
      isValid = false;
      ePhoneNumber = "Phone Number can not be empty";
    }

    if (formState.company_type === "" || formState.company_type == null) {
      isValid = false;
      eCompanyType = "Company tpe can not be empty";
    }

    if (formState.company === "" || formState.company == null) {
      isValid = false;
      eCompany = "Company can not be empty";
    }

    // if (data.address === "" || data.address == null) {
    //   isValid = false;
    //   eAddress = "Address can not be empty";
    // }

    setErrorText({
      ...errorText,
      name: eName,
      email: eEmail,
      phoneNumber: ePhoneNumber,
      companyType: eCompanyType,
      company: eCompany,
      // address: eAddress,
    });

    return isValid;
  }




  const sendData = (e) => {
    if (checkValidation()) {
    formState.address = document.getElementById("address").value;
    // alert(JSON.stringify(formState));

      insertCustomerApi(formState)
        .then((res) => {
          setOpen(true);
            setDisableSave(true);
            router.push("/customer/" + res.id).then(r => { return r; });
        })
        .catch((err) => {
          console.log(err);
          setErrorText(err);
        });
    }
  };

  /*Start of SWR*/

  let companyTypeSwr = getListCompanyTypeSwr();
  let companyRefSwr = getListCustomerReferenceSwr();


  /*End of SWR*/

  /*Start of useEffect*/

  useEffect(() => {
    if (companyRefSwr?.data) {
      setCompanyList(companyRefSwr?.data?.result ?? []);
    }
  }, [companyRefSwr]);

  useEffect(() => {
    const list = [];
    companyList.map((item, i) => {
      list.push({
        label: item.company_name,
        sales_id: item.sales_id,
        sales_name: item.customer_reference_sales[0].name,
      });
    });
    setOptionCompanyList(list);
  }, [companyList]);


  // useEffect(() => {
  //   const list = [];
  //   companyList.map((item, i) => {
  //     list.push({
  //       label: item.company,
  //       sales_id: item.sales_id,
  //         // sales_name: item.sales.name,
  //     });
  //   });
  //   setOptionCompanyList(list);
  // }, [companyList]);



  useEffect(() => {
    if (companyTypeSwr?.data) {
      setCompanyTypeList(companyTypeSwr?.data?.result ?? []);
    }
  }, [companyTypeSwr]);

  /*End of useEffect*/


  //function
  const onChangeCompany = (e, v) => {
    if (v !== null) {
      setFormState({
        ...formState,
        company: v.label,
        sales_id: v.sales_id,
      });
    } else {
      setFormState({
        ...formState,
        company: null,
        sales_id: null,
      });
    }
    console.log(formState);
    setDisableSave(false);
    setOpenAlert(false);
  };


  function onChangeInput(e) {
    if (e.target.name !== "") {

      let value = e.target.value;
      setFormState({
        ...formState,
        [e.target.name]: value,
      });
    }
    setDisableSave(false);
    setOpenAlert(false);
  }



  function openPage(e, route) {
    e.preventDefault();
    router.push(route).then(r => { return r; });
  }

  const {ready, value, suggestions: { status, data }, setValue, clearSuggestions,} =
      usePlacesAutocomplete({
        requestOptions: {
          /* Define search scope here */
        },
        debounce: 300,
      });

  const ref = useOnclickOutside(() => {
    // When user clicks outside the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e) => {
    setValue(e.target.value);
    // let x = h;
    // document.getElementById("address").value = x;
  };

  // const handleSelect =
  //     ({ description }) =>
  //         () => {
  //           // When user selects a place, we can replace the keyword without request data from API
  //           // by setting the second parameter to "false"
  //           setValue( description, false);
  //           clearSuggestions();
  //
  //
  //           // Get latitude and longitude via utility functions
  //           getGeocode({ address: description }).then((results) => {
  //             const { lat, lng } = getLatLng(results[0]);
  //             console.log("📍 Coordinates: ", { lat, lng });
  //           });
  //         };

  // const renderSuggestions = () =>
  //     data.map((suggestion) => {
  //       const {
  //         place_id,
  //         structured_formatting: { main_text, secondary_text },
  //       } = suggestion;


        // if (main_text !== formState.company) {
        //   document.getElementById("company").value = main_text;
        // }

        // formState.company = main_text;
        // console.info(formState.company);

      //   document.getElementById("address").value = secondary_text;
      //   return (
      //       <MenuItem key={place_id} onClick={handleSelect(suggestion)} className={classes.comboOptions}>
      //         <strong>{main_text}</strong>
      //         <small>{secondary_text}</small>
      //       </MenuItem>
      //   );
      //
      // });


  function getAddress(){
    let x = document.getElementById("address").value;
    document.getElementById("company-id").innerHTML = x;
    console.info(x)
  }


  return (
  <BaseLayout title="New Customer">
    <div className={classes.root}>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Typography variant="subtitle1">New Customer</Typography>
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
                onClick={(e) =>
                  openPage(e, getRoute("customer.customer-page"))
                }
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
                  open_in_new
                </Icon>
              </ButtonBase>{" "}
            </Box>
            <Box item xs={12} sm={12} container>
              <Box item container direction="column" spacing={2}>
                <Box item>
                  <Typography gutterBottom variant="subtitle1">
                    New Customer
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
                >
                  {alertMsg}
                </Alert>
              </Collapse>
            </Box>
            <Box container spacing={2}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography className={classes.labelbase}>
                      Name
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.labelbase}>
                      Email
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <OutlinedInput
                      id="name"
                      className={classes.inputbase}
                      name="name"
                      type="text"
                      error={errorText.name}
                      helperText={errorText.name}
                      onChange={onChangeInput}
                      fullWidth
                    ></OutlinedInput>
                    {errorText.name}
                  </Grid>
                  <Grid item xs={6}>
                    <OutlinedInput
                        id="email"
                      className={classes.inputbase}
                      name="email"
                      type="email"
                      onChange={onChangeInput}
                      error={errorText.email}
                      helperText={errorText.email}
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
                <Grid item xs={6}>
                  <Typography className={classes.labelbase}>
                    Phone Number
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.labelbase}>
                    Fax Number
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <OutlinedInput
                      id="phone_number"
                      className={classes.inputbase}
                      name="phone_number"
                      type="text"
                      error={errorText.phoneNumber}
                      helperText={errorText.phoneNumber}
                      onChange={onChangeInput}
                      fullWidth
                      required
                  ></OutlinedInput>
                  {errorText.phoneNumber}
                </Grid>
                <Grid item xs={6}>
                  <OutlinedInput
                      id="fax_number"
                      className={classes.inputbase}
                      name="fax_number"
                      type="text"
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
                <Grid item xs={6}>
                  <Typography className={classes.labelbase}>
                    Company Type
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.labelbase}>
                    Company Name
                  </Typography>
                </Grid>
              </Grid>
              </Box>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                      id="company_type"
                      className={classes.comboBox}
                      name="company_type"
                      select
                      size={'small'}
                      variant="outlined"
                      required
                      error={errorText.companyType}
                      defaultValue=""
                      onChange={onChangeInput}
                      fullWidth
                      style={{marginBottom: 10}}
                  >
                    <MenuItem value={""} className={classes.comboOptions}>
                      <em>None</em>
                    </MenuItem>
                    {companyTypeList?.map((row, key) => {
                      return (
                          <MenuItem key={key} value={row.company_type} className={classes.comboOptions}>
                            {row?.company_type} - {row?.name}
                          </MenuItem>
                      );
                    })}
                  </TextField>
                  {errorText.companyType}
                </Grid>

                {/*<Grid item xs={6}>*/}
                {/*  <OutlinedInput*/}
                {/*      id="company"*/}
                {/*      name="company"*/}
                {/*      // onClick={getAddress}*/}
                {/*      className={classes.inputbasemultiline}*/}
                {/*      error={!!errorText.address}*/}
                {/*      helperText={errorText.address}*/}
                {/*      // value={value ? value : custSwr?.data?.address}*/}
                {/*      // value={value}*/}
                {/*      // defaultValue={formState.address}*/}
                {/*      // defaultValue={value ? value : formState.address}*/}

                      {/*onChange={handleInput}*/}
                      {/*disabled={!ready}*/}
                      {/*fullWidth*/}
                      {/*// defaultValue={formState?.address ?? ""}*/}
                  {/*/>*/}
                  {/* We can use the "status" to decide whether we should display the dropdown or not */}
                  {/*{status === "OK" && <ul className={classes.comboOptions}>{renderSuggestions()}</ul>}*/}
                {/*</Grid>*/}
              </Grid>
            </Box>
          </Box>

          <Box container spacing={2}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>
                Address
              </Typography>
            </Box>
            <Box item xs={10}>
                <OutlinedInput
                    id="address"
                    className={classes.inputbase}
                    name="address"
                    type="text"
                    // value={value}
                    // onChange={handleInput}
                    // error={errorText.company}
                    // helperText={errorText.company}
                    // onChange={onChangeInput}
                    fullWidth
                    required
                ></OutlinedInput>
            </Box>

          </Box>
        </Paper>

        <Paper className={classes.paper}>
          <Box container>
            <Box item xs={12} style={{ textAlign: "center" }}>
              <div className={classes.rootmenu}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={(e) => openPage(e, getRoute("customer"))}
                >
                  <Icon style={{ fontSize: 20, color: "yellow" }}>cancel</Icon>
                  Cancel
                </Button>
                <Button
                  disabled={disableSave}
                  onClick={(e) => sendData(e)}
                  variant="contained"
                  color="primary"
                >
                  <ArrowForwardIcon style={{ fontSize: 20, color: "#af601a" }}>save</ArrowForwardIcon>
                  Next
                </Button>
              </div>
            </Box>
          </Box>
        </Paper>
      </div>
    </BaseLayout>
  );
}
