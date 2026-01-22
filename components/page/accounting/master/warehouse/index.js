import {
  Button,
  ButtonGroup,
  Card,
  makeStyles,
  Divider,
  Grid,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Box,
  TextField,
  Backdrop,
  CircularProgress,
  Collapse,
  Tooltip,
  CardHeader,
  CardContent,
  Paper,
} from "@material-ui/core";

import Link from "@material-ui/core/Link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import getRoute from "../../../../../helpers/router";
import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import GrainIcon from "@material-ui/icons/Grain";

import AccountingBaseLayout from "../../../../base_layout/base-layout-sidemenu-accounting";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";

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
  link: {
    display: "flex",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));

export default function Page() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  useEffect(async () => {
    try {
      setOpen(true);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  }, []);

  const router = useRouter();

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  function createData(code, name, location, height, width, length) {
    return { code, name, location, height, width, length };
  }

  const rows = [
    createData(
      "WHCK01",
      "Cakung Warehouse #1",
      "Jalan Rorotan Babek TNI 1",
      10,
      100,
      200
    ),
    createData(
      "WHCK02",
      "Cakung Warehouse #2",
      "Jalan Rorotan Babek TNI 2",
      0,
      2000,
      2000
    ),
  ];

  return (
    <AccountingBaseLayout title="Chart of Account">
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          color="inherit"
          button
          onClick={(e) => openPage(e, getRoute("accounting"))}
          className={classes.menuItem}
        >
          <HomeIcon className={classes.icon} />
          Dashboard
        </Link>
        <Link
          color="inherit"
          button
          onClick={(e) => openPage(e, getRoute("accounting.master"))}
          className={classes.link}
        >
          <WhatshotIcon className={classes.icon} />
          Master
        </Link>
        <Typography color="textPrimary" className={classes.link}>
          <GrainIcon className={classes.icon} />
          Warehouse
        </Typography>
      </Breadcrumbs>
      <Card className={classes.root}>
        <CardHeader title="Warehouse"></CardHeader>
        <CardContent>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="center">Size (w x h x l) </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.code}>
                    <TableCell component="th" scope="row" width={10}>
                      {row.code}
                    </TableCell>
                    <TableCell align="left" width={210}>
                      {row.name}
                    </TableCell>
                    <TableCell align="left" width={210}>
                      {row.location}
                    </TableCell>
                    <TableCell align="left" width={100}>
                      {row.width} m x {row.height} m x {row.length} m
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </AccountingBaseLayout>
  );
}
