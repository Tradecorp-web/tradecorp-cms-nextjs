import {
  makeStyles,
  Grid,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Backdrop,
  CircularProgress,
  Paper,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";

import DbSupplierForm from "./db-supplier-form";
import DbCustomerForm from "./db-customer-form";
import BaseLayout from "../../base_layout/base-layout-deal-builder";

import { red, green } from "@material-ui/core/colors";
import Avatar from "@material-ui/core/Avatar";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },

  media: {
    height: 0,
    paddingTop: "0%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  avatar2: {
    backgroundColor: green[500],
  },
}));

export default function Page() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState(null);

  const [openDbSupplierForm, setOpenDbSupplierForm] = useState(false);
  const [openDbCustomerForm, setOpenDbCustomerForm] = useState(false);

  const confirmDelete = (id) => {
    setIdData(id);
    setOpenDialog(true);
  };

  const DetailDbSupplierForm = async (id) => {
    setOpenDbSupplierForm(true);
  };
  const DetailDbCustomerForm = async (id) => {
    setOpenDbCustomerForm(true);
  };

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  const rows = [
    createData(
      "China International Marine Container Group Co., Ltd. (CIMC)",
      "done",
      "",
      "done"
    ),
    createData(
      "Singamas Container Holdings Ltd. (SINGAMAS)",
      "done",
      "",
      "done"
    ),
    createData("CXIC Group Containers Co., Ltd. (CXIC)", "", "done", ""),
    createData("China Eastern Containers (CEC) ", "", "done", ""),
    createData("W&K Container Inc.", "", "done", "done"),
    createData(
      "Daikin Transportation and Refrigeration Systems.",
      "done",
      "done",
      "done"
    ),
    createData("Maersk Container Industry (MCI)", "done", "", "done"),
    createData(
      "TLS Offshore Containers International Pvt Ltd.",
      "",
      "done",
      "done"
    ),
  ];

  const rows2 = [
    createData("Rijae Industri Boga, PT. ", "done", "", "done"),
    createData("Nusantara Leaf, PT.", "done", "", "done"),
    createData("Alfa Media", "", "done", ""),
    createData("Ganda Makmur", "", "done", ""),
    createData("Lapakkarya Nusantara", "", "done", "done"),
    createData("Anithins Food", "done", "done", "done"),
    createData("Vijay Kumar", "done", "", "done"),
    createData("Yashashi Shop", "", "done", "done"),
  ];

  const refreshDataDbSupplier = async () => {
    setOpenDbSupplierForm(false);
  };
  const refreshDataDbCustomer = async () => {
    setOpenDbCustomerForm(false);
  };

  return (
    <BaseLayout title="Deal Builder">
      <Grid container spacing={10}>
        <Grid justify="left" alignItems="left" item xs={10} sm={10}>
          <Typography variant="h1">
            <br />
            Dashboard
          </Typography>
        </Grid>
        <Grid justify="right" alignItems="right" item xs={2} sm={2}></Grid>
      </Grid>
      <Grid container spacing={5} justify="center">
        <Grid item xs={12}>
          <Card className={classes.root}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  S
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title="Supplier"
              subheader="Container provider supplier"
            />
            <CardMedia
              className={classes.media}
              image="/static/images/cards/paella.jpg"
              title="Paella dish"
            />
            <CardContent>
              <Grid
                container
                className="page-container"
                alignItems="center"
                justify="center"
              >
                <Grid item xs={12} lg={12} xl={8}>
                  <Box className="card no-padding">
                    <TableContainer component={Paper}>
                      <Table
                        className={classes.table}
                        size="small"
                        aria-label="a dense table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>Supplier</TableCell>
                            <TableCell align="right">10 feet</TableCell>
                            <TableCell align="right">20 feet</TableCell>
                            <TableCell align="right">40 feet</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row) => (
                            <TableRow key={row.name} hover>
                              <TableCell
                                component="th"
                                scope="row"
                                onClick={() => DetailDbSupplierForm(row.name)}
                              >
                                {row.name}
                              </TableCell>
                              <TableCell
                                align="right"
                                onClick={() => DetailDbSupplierForm(row.name)}
                              >
                                <Icon className="me-2">{row.calories}</Icon>
                              </TableCell>
                              <TableCell
                                align="right"
                                onClick={() => DetailDbSupplierForm(row.name)}
                              >
                                <Icon className="me-2">{row.fat}</Icon>
                              </TableCell>
                              <TableCell align="right">
                                <Icon className="me-2">{row.carbs}</Icon>
                              </TableCell>
                              <TableCell align="right">
                                <Icon className="me-2">{row.protein}</Icon>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card className={classes.root}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar2}>
                  C
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title="Customer"
              subheader="Potential customer for buy container"
            />
            <CardMedia
              className={classes.media}
              image="/static/images/cards/paella.jpg"
              title="Paella dish"
            />
            <CardContent>
              <Grid
                container
                className="page-container"
                alignItems="center"
                justify="center"
              >
                <Grid item xs={12} lg={12} xl={8}>
                  <Box className="card no-padding">
                    <TableContainer component={Paper}>
                      <Table
                        className={classes.table}
                        size="small"
                        aria-label="a dense table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              Customer potential for Container buyer
                            </TableCell>
                            <TableCell align="right">10 feet</TableCell>
                            <TableCell align="right">20 feet</TableCell>
                            <TableCell align="right">40 feet</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows2.map((row) => (
                            <TableRow key={row.name} hover>
                              <TableCell
                                component="th"
                                scope="row"
                                onClick={() => DetailDbCustomerForm(row.name)}
                              >
                                {row.name}
                              </TableCell>
                              <TableCell
                                align="right"
                                onClick={() => DetailDbCustomerForm(row.name)}
                              >
                                <Icon className="me-2">{row.calories}</Icon>
                              </TableCell>
                              <TableCell
                                align="right"
                                onClick={() => DetailDbCustomerForm(row.name)}
                              >
                                <Icon className="me-2">{row.fat}</Icon>
                              </TableCell>
                              <TableCell
                                align="right"
                                onClick={() => DetailDbCustomerForm(row.name)}
                              >
                                <Icon className="me-2">{row.carbs}</Icon>
                              </TableCell>
                              <TableCell
                                align="right"
                                hover
                                onClick={() => DetailDbCustomerForm(row.name)}
                              >
                                <Icon className="me-2">{row.protein}</Icon>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box className="p-5 content-wrapper">
        <Backdrop className={classes.backdrop} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <DbSupplierForm
          open={openDbSupplierForm}
          closeModal={refreshDataDbSupplier}
          dbSupplier={data}
        />
        <DbCustomerForm
          open={openDbCustomerForm}
          closeModal={refreshDataDbCustomer}
          dbSupplier={data}
        />
      </Box>
    </BaseLayout>
  );
}
