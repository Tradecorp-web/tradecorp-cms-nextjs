import BaseLayout from "../../base_layout/base-layout";
import {
  Icon,
  Divider,
  Button,
  Box,
  Collapse,
  IconButton,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Dialog,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";
import { insertCustomerApi } from "../../../services/api/customer.api";
import { getListCustomerSwr } from "../../../services/swr/customer.swr";
import { accountSwr } from "../../../services/swr/account.swr";

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
  labelbase: {
    marginTop: 10,
    fontSize: 12,
  },
  inputbase: {
    fontSize: "12px !important",
    height: 35,
  },
  comboBox: {
    fontSize: "12px",
    height: 30,
  },
  comboOptions: {
    fontSize: "12px",
    color: "#000000",
  },
}));
const filter = createFilterOptions();

export default function Page() {
  //const

  const [companyName, setCompanyName] = useState(null);
  const classes = useStyles();
  const router = useRouter();
  const [formState, setFormState] = useState({
    id: null,
    phone_number: null,
    payment_lease: null,
    payment_sale: null,
    payment_service: null,
    company_type: null,
    customer_code: null,
    email: null,
    fax_number: null,
    address: null,
    company: null,
    name: null,
    sales_id: null,
    customer_logo_file: [],
    customer_npwp_file: [],
  });
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [disableSave, setDisableSave] = useState(true);
  const [errorText, setErrorText] = useState({
    company: null,
  });

  const [companyList, setCompanyList] = useState([]);
  const [optionCompanyList, setOptionCompanyList] = useState([]);

  const [openModal, setOpenModal] = useState(false);

  const { data, error, mutate } = accountSwr();

  const {
    data: customerData,
    error: customerError,
    mutate: customerMutate,
  } = getListCustomerSwr();

  const handleClickOpen = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  function checkValidation() {
    let isValid = true;

    let eCompany = "";

    formState.company = document.getElementById("company").value;

    let convertToUpperCase = formState.company.toUpperCase();

    let removeWhiteSpace = convertToUpperCase.replace(/[.,\s]/g, "");

    if (
      formState.company === customerData.result.map((item) => item.company) ||
      customerData.result
        .map((item) => item.company.replace(/\s+/g, ""))
        .includes(removeWhiteSpace)
    ) {
      isValid = false;
      handleClickOpen();
    }

    if (formState.company === "" || formState.company == null) {
      isValid = false;
      eCompany = "Company cannot be empty";
    }

    setErrorText({
      ...errorText,
      eCompany: eCompany,
    });
    return isValid;
  }

  const sendData = (e) => {
    if (checkValidation()) {
      formState.company = document.getElementById("company").value;
      insertCustomerApi(formState, 2)
        .then((res) => {
          if (res !== 0) {
            setOpen(true);
            setDisableSave(true);
            router.push("/customer/" + res.id).then((r) => {
              return r;
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setErrorText(err);
        });
    }
  };

  /*Start of SWR*/

  let companySwr = getListCustomerSwr();

  /*End of SWR*/

  /*Start of useEffect*/

  useEffect(() => {
    if (companySwr?.data) {
      setCompanyList(companySwr?.data?.result ?? []);
    }
  }, [companySwr]);

  let dataCust = companySwr?.data?.result;

  let uniqueDataCust = dataCust?.filter(
    (v, i, a) => a.findIndex((t) => t.company === v.company) === i
  );

  useEffect(() => {
    const list = [];

    if (uniqueDataCust) {
      uniqueDataCust.forEach((item) => {
        list.push({
          label: item.company,
          sales_id: item.sales_id,
          sales_name: item.sales?.name ?? "salesman not found",
        });
      });
      setOptionCompanyList(list);
    }
  }, [companyList]);

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

    setDisableSave(false);
    setOpenAlert(false);
  };

  function openPage(e, route) {
    e.preventDefault();
    router.push(route).then((r) => {
      return r;
    });
  }

  return (
    <BaseLayout title="Search Customer Company">
      <div className={classes.root}>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Typography variant="subtitle1">Search Customer Company</Typography>
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
              <Dialog
                open={openModal}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    The Company Already Exists
                  </DialogContentText>
                </DialogContent>
              </Dialog>
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
            <Box item xs={12} sm={12} container>
              <Box item container direction="column" spacing={2}>
                <Box item>
                  <Typography align="center" gutterBottom variant="subtitle1">
                    Search Or Add Customer Company
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
            </Box>
            <Box container spacing={2}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item={true} xs={12}>
                    <Autocomplete
                      id="company"
                      variant="outlined"
                      name="company"
                      value={companyName}
                      helperText={errorText.eCompany}
                      error={!!errorText.eCompany}
                      renderOption={(option) => (
                        <MenuItem className={classes.comboOptions}>
                          {option.label + " - " + option.sales_name}
                        </MenuItem>
                      )}
                      getOptionDisabled={(option) =>
                        option.sales_name !== data?.name
                      }
                      options={optionCompanyList}
                      onChange={(e, v) => onChangeCompany(e, v)}
                      getOptionLabel={(option) => {
                        if (typeof option === "string") {
                          return option;
                        }
                        if (option.inputValue) {
                          return option.inputValue;
                        }
                        // Regular option
                        return option.label;
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                        const { inputValue } = params;
                        // Suggest the creation of a new value
                        const isExisting = options.some(
                          (option) => inputValue === option.label
                        );
                        if (inputValue !== "" && !isExisting) {
                          filtered.push({
                            inputValue: params.inputValue,
                            label: inputValue,
                          });
                        }
                        return filtered;
                      }}
                      selectOnFocus
                      handleHomeEndKeys
                      freeSolo
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            style: { textTransform: "uppercase" },
                          }}
                          name="company"
                          label="Company Name"
                        />
                      )}
                    />
                    {errorText.eCompany}
                  </Grid>
                </Grid>
              </Box>
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
                  // disabled={disableSave}
                  onClick={(e) => sendData(e)}
                  variant="contained"
                  color="primary"
                >
                  <ArrowForwardIcon style={{ fontSize: 20, color: "#af601a" }}>
                    Next
                  </ArrowForwardIcon>
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
