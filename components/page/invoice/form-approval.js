import {
  Button,
  makeStyles,
  Grid,
  IconButton,
  Typography,
  Box,
  TextField,
  MenuItem,
  Collapse,
  Divider,
  Icon,
  OutlinedInput,
  Card,
  CardHeader,
  Checkbox,
  ListItemIcon,
  List,
  ListItemText,
  ListItem,
  Modal,
  Paper,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Alert } from "@material-ui/lab";
import theme from "react-images-viewer/lib/theme";
import getRoute from "../../../helpers/router";
import { useRouter } from "next/router";

import { useRef } from "react";

import {} from "../../../services/swr/invoice.swr";

import moment from "moment";
import { useEffect, useState } from "react";

import { invoiceFlowNext } from "../../../services/api/invoice.api";

import { insertFlowAppNext } from "../../../services/api/flow.api";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 10,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "left",
    color: theme.palette.text.secondary,
    boxShadow: "none",
  },
  paperLabel: {
    padding: theme.spacing(1),
    textAlign: "left",
    color: theme.palette.text.secondary,
    boxShadow: "none",
    fontSize: "1em",
    fontWeight: "bold",
  },
  paperData: {
    padding: theme.spacing(1),
    textAlign: "left",
    color: theme.palette.text.secondary,
    fontSize: "1em",
    boxShadow: "none",
  },
}));

export default function InvoiceApproval(props) {
  const router = useRouter();
  const classes = useStyles();

  const [messageApprove, setMessageApprove] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [severity, setSeverity] = useState("");
  let btnRef = useRef();

  const closeForm = () => {
    props?.closeModal();
  };
  const messageRecord = (e) => {
    setMessageApprove(e.target.value);
  };

  const approve = async (id) => {
    btnRef.current.setAttribute("disabled", true);
    var app = await invoiceFlowNext(id).then((res) => {
      insertFlowAppNext("invoicing", props?.invData?.invoice_number, {
        description: messageApprove,
      }).then(() => {
        setOpenAlert(true);
        setSeverity("success");
        setAlertMsg("Data sent");
        const timeout = setTimeout(() => {
          closeForm();
        }, 1000);
      });
    });
  };

  return (
    <Modal
      open={props?.open}
      width={400}
      onClose={closeForm}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box className="modal-wrapper" style={{ width: "1000px" }}>
        <Collapse in={openAlert}>
          <Alert
            severity={severity}
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
        <Card className="modal">
          <Box className="modal-header">
            <Grid container>
              <Grid item xs={12}>
                <h3>Invoice View </h3>
              </Grid>
            </Grid>
          </Box>
          <Box className="modal-content">
            <div>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Paper className={classes.paperLabel}>Project code</Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper className={classes.paperData}>
                    {props?.invData?.project_code}
                  </Paper>
                </Grid>

                <Grid item xs={4}>
                  <Paper className={classes.paperData}>
                    {props?.invData?.project_name}
                  </Paper>
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Paper className={classes.paperLabel}>Invoice Number</Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper className={classes.paperData}>
                    {props?.invData?.invoice_number}
                  </Paper>
                </Grid>
                <Grid item xs={2}>
                  <Paper className={classes.paperLabel}>Invoice date</Paper>
                </Grid>
                <Grid item xs={2}>
                  <Paper className={classes.paperData}>
                    {moment(props?.invData?.invoice_date).format("LL")}
                  </Paper>
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Paper className={classes.paperLabel}>Customer name</Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper className={classes.paperData}>
                    {props?.invData?.customer_name}
                  </Paper>
                </Grid>
                <Grid item xs={2}>
                  <Paper className={classes.paperLabel}>Customer Company</Paper>
                </Grid>
                <Grid item xs={2}>
                  <Paper className={classes.paperData}>
                    {props?.invData?.customer_company_name +
                      " " +
                      props?.invData?.customer_company_type}
                  </Paper>
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Paper className={classes.paperLabel}>Invoice Amount</Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper className={classes.paperData}>
                    {props?.invData?.total_payment}
                  </Paper>
                </Grid>
                <Grid item xs={2}>
                  <Paper className={classes.paperLabel}>Remaining Due</Paper>
                </Grid>
                <Grid item xs={2}>
                  <Paper className={classes.paperData}>
                    {props?.invData?.rest_payment}
                  </Paper>
                </Grid>
              </Grid>
              <Grid container spacing={1} className="mt-3">
                <Grid item xs={4}>
                  <Paper className={classes.paperLabel}>Description</Paper>
                </Grid>
                <Grid item xs={2}>
                  <Paper className={classes.paperLabel}>Qty</Paper>
                </Grid>
                <Grid item xs={2}>
                  <Paper className={classes.paperLabel}>UOM</Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper className={classes.paperLabel}> Price</Paper>
                </Grid>
              </Grid>
              <Grid container spacing={1} className="mt-0">
                <Grid item xs={12}>
                  <Paper className={classes.paperLabel}>
                    <Divider />
                  </Paper>
                </Grid>
              </Grid>
              {props?.invData?.description?.map((res) => (
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Paper className={classes.paperData}>
                      {res?.description}
                    </Paper>
                  </Grid>
                  <Grid item xs={2}>
                    <Paper className={classes.paperData}>{res?.quantity}</Paper>
                  </Grid>
                  <Grid item xs={2}>
                    <Paper className={classes.paperData}>{res?.uom}</Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper className={classes.paperData}> {res?.price}</Paper>
                  </Grid>
                </Grid>
              ))}
              <Grid container spacing={1} className="mt-0">
                <Grid item xs={12}>
                  <Paper className={classes.paperLabel}>
                    <Divider />
                  </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid item xs={2}>
                  <h4>Status Invoice :</h4>
                </Grid>
                <Grid item xs={1} style={{ textAlign: "left" }}>
                  {props?.invData?.invoice_status}
                </Grid>
                <Grid item xs={7} style={{ textAlign: "right" }}>
                  <TextField
                    size="small"
                    label="Message"
                    variant="outlined"
                    id="message_approve"
                    name="message_approve"
                    onChange={(e) => messageRecord(e)}
                    fullWidth
                  ></TextField>
                </Grid>
                <Grid item xs={2} style={{ textAlign: "left" }}>
                  <Button
                    ref={btnRef}
                    variant="outlined"
                    color="primary"
                    onClick={() => approve(props?.invData?.id)}
                  >
                    Approve
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Box>
        </Card>
      </Box>
    </Modal>
  );
}
