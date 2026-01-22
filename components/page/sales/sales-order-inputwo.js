import BaseLayout from "../../base_layout/base-layout";

import {
  Icon,
  Divider,
  Button,
  TextField,
  OutlinedInput,
  Card,
  Box,
  MenuItem,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AlertDialog from "../../base_component/dialog";

import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import { Delete, Add } from "@material-ui/icons";

import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";

import { getListQuoteSwr } from "../../../services/swr/quote.swr";
import FileForm from "./file-form";

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
  comboOptions: {
    fontSize: "12px",
    color: "#000000",
  },
  tablehead: {
    fontSize: "12px",
    color: "#000000",
    fontWeight: "bold",
  },
  tablerow: {
    fontSize: "12px",
    color: "#000000",
  },
  titlecard: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function Page() {
  const classes = useStyles();
  const router = useRouter();
  const [openForm, setOpenForm] = useState(false);
  const [isLoading, setLoading] = useState(false);

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  const styleObj = {
    fontSize: "12px",
    color: "#212f3c",
    textAlign: "left",
    paddingTop: "10px",
  };
  const styleObjData = {
    fontSize: "12px",
    color: "#000000",
    textAlign: "left",
    paddingTop: "10px",
  };

  const [quoteList, setQuoteList] = useState([]);
  const [optionQuoteList, setOptionQuoteList] = useState([]);
  const [selectedProjectCode, setSelectedProjectCode] = useState([]);

  let param = { limit: 999 };
  var quoteSwr = getListQuoteSwr(param);
  useEffect(() => {
    if (quoteSwr?.data) {
      setQuoteList(quoteSwr?.data.result ?? []);
    }
  }, [quoteSwr]);

  useEffect(() => {
    var list = [];
    list.push({ id: "", label: "" });
    quoteList.map((item, i) => {
      list.push({
        id: item.project_code + "|" + item.customer_id,
        label: item.project_code + " " + item.name,
      });
    });
    setOptionQuoteList(list);
  }, [quoteList]);

  const onProjectCodeChange = (event, value, extra) => {
    if (value != null) {
      var objekval = Object.values(value);
      setSelectedProjectCode({
        id: objekval[0],
        label: objekval[1],
      });
    } else {
      setSelectedProjectCode({
        id: "",
        label: "",
      });
    }
  };

  const refreshListDoc = async () => {
    setOpenForm(false);
  };
  const newForm = () => {
    setOpenForm(true);
  };

  const sendData = () => {
    alert("test");
  };

  return (
    <BaseLayout title="Input WO">
      <div className={classes.root}>
        <Box container spacing={2}>
          <Box item xs={12}>
            <Typography variant="subtitle1">Input Work Order</Typography>
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
                onClick={(e) => openPage(e, getRoute("sales"))}
              >
                <Icon style={{ fontSize: 20, color: "#999" }}>home</Icon>
              </Button>
              <Button
                variant="contained"
                color="default"
                onClick={(e) => openPage(e, getRoute("sales.sales-order-edit"))}
              >
                <Icon style={{ fontSize: 20, color: "yellow" }}>edit</Icon>
                {"  "}
                Sales Order
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
            <Box item xs={12} sm container>
              <Box item xs container direction="column" spacing={2}>
                <Box item xs>
                  <Typography gutterBottom variant="subtitle1">
                    Input Work Order
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box container spacing={2} xs={12}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>
                Project Code
              </Typography>
            </Box>
            <Box item xs={10}>
              <OutlinedInput
                readOnly="true"
                className={classes.inputbasero}
                size="small"
                name="project_code"
                type="text"
                fullWidth
              ></OutlinedInput>
            </Box>
          </Box>
          <Box container spacing={2}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>Order Date</Typography>
            </Box>
            <Box item xs={2}>
              <OutlinedInput
                readOnly="true"
                className={classes.inputbasero}
                size="small"
                name="order_date"
                color="grey"
                type="date"
              ></OutlinedInput>
            </Box>
          </Box>

          <Box container spacing={2}>
            <Box>
              <Typography className={classes.labelbase}>
                Customer Name
              </Typography>
            </Box>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <OutlinedInput
                    readOnly="true"
                    defaultValue="Customer Name"
                    className={classes.inputbasero}
                    name="customer_name"
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
                <Grid item xs={3}>
                  <OutlinedInput
                    readOnly="true"
                    defaultValue="Customer Code"
                    className={classes.inputbasero}
                    name="customer_code"
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box container spacing={2}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>Sales</Typography>
            </Box>
            <Box item xs={10}>
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <OutlinedInput
                    readOnly="true"
                    defaultValue="Sales Name"
                    className={classes.inputbasero}
                    name="sales_name"
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
                <Grid item xs={3}>
                  <OutlinedInput
                    readOnly="true"
                    defaultValue="Sales Code"
                    className={classes.inputbasero}
                    name="sales_code"
                    type="text"
                    fullWidth
                  ></OutlinedInput>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box container spacing={2}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>
                Project Description
              </Typography>
            </Box>
            <Box item xs={10}>
              <OutlinedInput
                className={classes.inputbasemultiline}
                defaultValue="Project Description"
                rowsMax={5}
                multiline
                name="project_description"
                type="textare"
                fullWidth
              ></OutlinedInput>
            </Box>
          </Box>
        </Paper>

        <Paper className={classes.paper}>
          <Box container spacing={2} xs={12}>
            <Box item xs={2}>
              <Typography className={classes.labelbase}>
                Container Serial Number
              </Typography>
            </Box>
            <Box item xs={10}>
              <Autocomplete
                className={classes.inputbase}
                defaultValue="Small"
                variant="outlined"
                size="small"
                name="project_code"
                label="Project Code"
                options={optionQuoteList}
                autoHighlight
                onChange={(e, v) => onProjectCodeChange(e, v, true)}
                getOptionLabel={(option) => option?.label}
                renderOption={(option) => (
                  <Typography className={classes.comboOptions}>
                    {option?.label}
                  </Typography>
                )}
                renderInput={(params) => {
                  params.inputProps.className = classes.comboOptions;
                  return (
                    <TextField className={classes.inputbase} {...params} />
                  );
                }}
              />
            </Box>
          </Box>

          <Box className="modal-wrapper" style={{ width: "auto" }}>
            <Card className="modal">
              <Box className="modal-content">
                <h2 className="mb-3">Details</h2>
                <Box className="mb-3">
                  <TextField
                    disabled="disabled"
                    name="wo_number"
                    label="Work Order Number"
                    variant="outlined"
                    required
                    fullWidth
                  />
                </Box>
                <Box className="mb-3">
                  <TextField
                    name="wo_date"
                    label="Work Order Date"
                    variant="outlined"
                    disabled={true}
                    fullWidth
                  />
                </Box>
                <Box className="mb-3">
                  <TextField
                    disabled
                    label="Client"
                    variant="outlined"
                    fullWidth
                  />
                </Box>
                <Box className="mb-3">
                  <TextField
                    disabled
                    name="sales_name"
                    label="Sales"
                    variant="outlined"
                    required
                    fullWidth
                  />
                </Box>
                <div className="mb-3">
                  <TextField
                    disabled
                    name="project_code"
                    label="Project Code"
                    variant="outlined"
                    required
                    fullWidth
                  />
                </div>
                <Box className="mb-3">
                  <TextField
                    disabled
                    name="project"
                    label="Project"
                    variant="outlined"
                    fullWidth
                  />
                </Box>

                <div className="mb-3">
                  <TextField
                    disabled
                    name="product_id"
                    select
                    label="Product"
                    variant="outlined"
                    fullWidth
                  >
                    <MenuItem value={null}>
                      <em>None</em>
                    </MenuItem>
                  </TextField>
                </div>
                <Box className="mb-3">
                  <TextField
                    disabled
                    name="remark"
                    label="Remarks"
                    variant="outlined"
                    fullWidth
                  />
                </Box>
                <h2 className="mb-3 mt-5">Materials</h2>
                <Box className="mb-3">
                  <Grid
                    container
                    spacing={2}
                    justify="center"
                    alignItems="center"
                    className={classes.root}
                  >
                    <Grid item xs={5} sm={5}>
                      <Typography variant="h4">Material</Typography>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <Typography variant="h4">Prices</Typography>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <Typography variant="h4">Quantity</Typography>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <Typography variant="h4">Remark</Typography>
                    </Grid>
                    <Grid item xs={1} sm={1}></Grid>
                    <React.Fragment>
                      <Grid item xs={5} sm={5}></Grid>
                      <Grid item xs={2} sm={2}></Grid>
                      <Grid item xs={2} sm={2}>
                        <TextField
                          name="qty"
                          type="number"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={2} sm={2}>
                        <TextField name="remark" variant="outlined" fullWidth />
                      </Grid>
                      <Grid item xs={1} sm={1}></Grid>
                    </React.Fragment>
                    <Grid item xs={12} sm={12}>
                      <IconButton>
                        <Add />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              <AlertDialog
                title="Send data confirmation"
                body="Are you sure want to create work order ?"
              />
            </Card>
            <Backdrop className={classes.backdrop} open={isLoading}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </Box>
        </Paper>

        <Paper className={classes.paper}>
          <Box container>
            <Box item xs={12} style={{ textAlign: "center" }}>
              <div className={classes.rootmenu}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={(e) =>
                    openPage(e, getRoute("sales.sales-order-ongoing"))
                  }
                >
                  <Icon style={{ fontSize: 20, color: "yellow" }}>cancel</Icon>
                  {"  "}
                  Cancel
                </Button>
                <Button onClick={sendData} variant="contained" color="primary">
                  <Icon style={{ fontSize: 20, color: "#af601a" }}>save</Icon>
                  {"  "}
                  Save
                </Button>
              </div>
            </Box>
          </Box>
        </Paper>
      </div>

      <FileForm open={openForm} closeModal={refreshListDoc} />
    </BaseLayout>
  );
}
