import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  Paper,
  TableBody,
  Tab,
  List,
  ListItem,
  ListItemText,
  Link,
  Button,
  IconButton,
  ButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@material-ui/core";
import { React, useEffect, useState } from "react";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Edit,
  Delete,
  Add,
  InsertDriveFile,
  CallToAction,
  ArrowBack,
  ViewHeadline,
} from "@material-ui/icons";

import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";

import BaseLayout from "../../base_layout/base-layout";
import {
  FileUploadSecureComponent,
  DropZoneComponent,
} from "../../base_component/file-upload";

import {
  getListOrderIdQuoteStatusApi,
  updateStatusOrderQuoteIdApi,
} from "../../../services/api/order-quote.api";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    fontSize: "1.2em",
    fontWeight: "bold",
  },
  rootItem: {
    //background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    // borderRadius: 3,
    // boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "#595959",
    padding: "0 10px !important",
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

// alert(JSON.stringify(dataOrder));
// useEffect(() => {
//   setListFile({
//     quote_in_images: [
//       {
//         name: null,
//         progress: null,
//         link: null,
//         content_type: null,
//         loading: -1,
//       },
//     ],
//   });
// }, [listFile]);

export default function ContainerOrdersForm(props) {
  const [dataList, setDataList] = useState(false);
  // var dataOrder = getListOrderIdQuoteStatusSwr("*", "production");
  // alert(JSON.stringify(dataOrder));
  const router = useRouter();
  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [listFile, setListFile] = useState(false);

  useEffect(() => {
    setListFile({ quote_in_images: [] });
  }, []);
  useEffect(async () => {
    var data = await getListOrderIdQuoteStatusApi("*", "general-build");
    setDataList(data);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChangeUpload = (res, name) => {
    var result = [];
    res?.map((row, i) => {
      result.push({
        label: row.name,
        content_type: row.content_type,
        link: row.link,
        thumbnail: null,
      });
    });

    setData({ ...data, [name]: result });
  };

  return (
    <BaseLayout title="Quotation">
      <Box className="p-5 content-wraper">
        <Card className={classes.root}>
          <CardHeader
            style={{ fontSize: "1.5em" }}
            title="Build Quote"
            subheader="Shanghai Hyundai Precision Industry (HK) Ltd."
          ></CardHeader>
          <CardContent>
            <Grid container>
              {/* <Grid item xs="3">
                <Typography
                  variant="body2"
                  style={{ fontWeight: "bold", fontSize: "1.1em" }}
                  color="textSecondary"
                  component="p"
                >
                  Container List
                </Typography>
                <List>
                  <ListItem className={classes.rootItem}>
                    <ListItemText primary="General Purpose" secondary="20DC" />
                  </ListItem>
                  <ListItem className={classes.rootItem}>
                    <ListItemText primary="General Purpose" secondary="40DC" />
                  </ListItem>
                  <ListItem className={classes.rootItem}>
                    <ListItemText primary="High Cube" secondary="40HC" />
                  </ListItem>
                </List>
              </Grid> */}
              <Grid item xs="12">
                <Card className={classes.root}>
                  <CardContent>
                    <Grid container>
                      <Grid item xs={12} style={{ align: "right" }}>
                        <Button onClick={(e) => openPage(e, getRoute("home"))}>
                          <ArrowBack />
                        </Button>
                      </Grid>
                    </Grid>

                    <TableContainer component={Paper}>
                      <Table
                        className={classes.table}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">No</TableCell>
                            <TableCell align="center">Type</TableCell>
                            <TableCell align="center">Size</TableCell>
                            <TableCell colSpan={2} align="center">
                              Color
                            </TableCell>
                            <TableCell width={20} align="center">
                              Serial from
                            </TableCell>
                            <TableCell width={20} align="center">
                              Serial to
                            </TableCell>
                            <TableCell align="center">Logo</TableCell>
                            <TableCell align="center">Pre sold</TableCell>
                            <TableCell align="center">CSC Plate</TableCell>
                            <TableCell align="center">Specification</TableCell>
                            <TableCell align="center">
                              Other Specification
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dataList?.result?.map((row, key) => (
                            <TableRow key={key}>
                              <TableCell>{key + 1}</TableCell>
                              <TableCell>{row?.container_type_data}</TableCell>
                              <TableCell>{row?.unit_code}</TableCell>
                              <TableCell align="right">
                                {row?.container_color?.ral_code}
                                {row?.container_color?.name_english}
                              </TableCell>
                              <TableCell align="left" width={70}>
                                <CallToAction
                                  style={{
                                    padding: 0,
                                    width: 70,
                                    color: row?.container_color?.html_code,
                                  }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                {row?.container_number_from}
                              </TableCell>
                              <TableCell align="center">
                                {row?.container_number_to}
                              </TableCell>
                              <TableCell align="center">
                                {row?.order_quote_files[0]?.file_description ==
                                  "company_logo" ||
                                row?.order_quote_files[1]?.file_description ==
                                  "company_logo"
                                  ? "Yes"
                                  : "No"}
                              </TableCell>
                              <TableCell>{row?.customer?.company}</TableCell>
                              <TableCell align="center">
                                {" "}
                                {row?.order_quote_files[0]?.file_description ==
                                  "csc_certified" ||
                                row?.order_quote_files[1]?.file_description ==
                                  "csc_certified"
                                  ? "Yes"
                                  : "No"}
                              </TableCell>
                              <TableCell align="center">
                                {row?.container_specifications?.map(
                                  (rowSpec, key) =>
                                    key <
                                    row?.container_specifications?.length - 1
                                      ? rowSpec?.specification + ", "
                                      : rowSpec?.specification
                                )}
                              </TableCell>
                              <TableCell align="center">
                                {row?.other_specification}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Grid container style={{ marginTop: 10 }}>
                      <Grid item xs={6} style={{ textAlign: "left" }}></Grid>
                      <Grid item xs={6} style={{ textAlign: "right" }}></Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Container Specification
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Fill in the Specification description and upload pictures or files
          </DialogContentText>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                style={{ fontWeight: "bold", fontSize: ".8em" }}
                color="textSecondary"
                component="p"
              >
                Upload Company Logo
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <FileUploadSecureComponent
                id="image"
                path="sales"
                // fileUploaded={(res) => onUploaded(res)}
                // url={fileUpload.link}
                // deleteFile={() => onUploaded(null)}
              />
            </Grid>
          </Grid>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                style={{ fontWeight: "bold", fontSize: ".8em" }}
                color="textSecondary"
                component="p"
              >
                Upload CSC
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <FileUploadSecureComponent
                label="CSC Certified"
                id="image"
                path="sales"
                // fileUploaded={(res) => onUploaded(res)}
                // url={fileUpload.link}
                // deleteFile={() => onUploaded(null)}
              />
            </Grid>
          </Grid>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              {
                <TextField
                  label="Specification"
                  name="specification"
                  id="specification"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  multiline
                  rows={4}
                  fullWidth
                />
              }
            </Grid>
          </Grid>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <InputLabel shrink={true}>Images / Files</InputLabel>
              <DropZoneComponent
                id="images"
                // exportList={(res) => onChangeUpload(res, "quote_in_images")}
                data={listFile?.quote_in_images}
                path="quote_in_images"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleClose}
            color="primary"
            autoFocus
          >
            Save Specification
          </Button>
        </DialogActions>
      </Dialog>
    </BaseLayout>
  );
}
