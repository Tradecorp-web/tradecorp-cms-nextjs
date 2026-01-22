import {
  Card,
  Grid,
  Icon,
  Link,
  CardContent,
  Typography,
  Box,
  Paper,
  makeStyles,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TableContainer,
  TablePagination,
  IconButton,
} from "@material-ui/core";

import { useRouter } from "next/router";
import getRoute from "../../../../../helpers/router";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";

import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import GrainIcon from "@material-ui/icons/Grain";

import AccountingBaseLayout from "../../../../base_layout/base-layout-sidemenu-accounting";

import {
  getListVendorApi,
  getListVendorLimitApi,
} from "../../../../../services/api/acc-vendor.api";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  backdrop: { zIndex: theme.zIndex.drawer + 1, color: "#fff" },
  link: { display: "flex" },
  icon: { marginRight: theme.spacing(0.5), width: 20, height: 20 },
}));

function Row(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow key={props.keys} hover className={classes.root}>
        <TableCell onClick={() => props.clickAction()}>
          {props.keys + 1 + props.page * props.rowsPerPage}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.vendor_name}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.vendor_address}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.cp_name}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.vendor_phone}
        </TableCell>

        <TableCell>
          <IconButton>
            {/* <Delete onClick={() => props.clickDelete()} /> */}
          </IconButton>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
export default function Page(props) {
  const classes = useStyles();
  const router = useRouter();
  const [rowCount, setRowCount] = useState(0);
  const [listData, setListData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  useEffect(async () => {
    try {
      // setOpen(true);
      var data = await getListVendorLimitApi();
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
    } catch (err) {
      console.log(err);
    }
  }, []);
  const handleChangePage = async (event, newPage) => {
    try {
      // setOpen(true);
      var data = await getListVendorApi(search, newPage, rowsPerPage);
      setRowCount(data.total);
      setListData(data.result);
      setPage(newPage);
      // setOpen(false);
    } catch (err) {
      console.log(err);
      // setOpen(false);
    }
  };
  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    try {
      //   setOpen(true);
      var data = await getListVendorApi(
        search,
        0,
        parseInt(event.target.value, 10)
      );
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      //     setOpen(false);
    } catch (err) {
      console.log(err);
      //  setOpen(false);
    }
  };
  return (
    <AccountingBaseLayout title="Accounting">
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
          onClick={(e) =>
            openPage(e, getRoute("accounting.transaction.purchase"))
          }
          className={classes.menuItem}
        >
          <WhatshotIcon className={classes.icon} />
          Purchase
        </Link>
        <Typography color="textPrimary" className={classes.link}>
          <GrainIcon className={classes.icon} />
          Vendor
        </Typography>
      </Breadcrumbs>
      <div className="p-6 content-wrapper">
        <Grid container spacing={12}>
          <TableContainer component={Card}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell width={12}>No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {listData?.map((row, key) => (
                  <Row
                    keys={key}
                    row={row}
                    // clickAction={() => editForm(row.id)}
                    // clickDelete={() => confirmDelete(row.id)}
                    page={page}
                    rowsPerPage={rowsPerPage}
                  />
                ))}
                {listData?.length == 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted"
                      align="center"
                    >
                      No data to show
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              {/* <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[20, 50, 100]}
                    colSpan={9}
                    count={rowCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter> */}
            </Table>
          </TableContainer>
        </Grid>
      </div>
    </AccountingBaseLayout>
  );
}
