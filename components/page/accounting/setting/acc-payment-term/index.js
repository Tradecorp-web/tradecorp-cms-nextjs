import { Grid, Backdrop, CircularProgress, Button } from "@material-ui/core";

import Link from "@material-ui/core/Link";
import { useRouter } from "next/router";
import getRoute from "../../../../../helpers/router";
import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import GrainIcon from "@material-ui/icons/Grain";

import AccountingBaseLayout from "../../../../base_layout/base-layout-sidemenu-accounting";
import AlertDialog from "../../../../base_component/dialog";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Fragment, useState, useEffect } from "react";
import { currency, dateFormat } from "../../../../../helpers/general";

/** table */
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import { getListAccPaymentTermApi } from "../../../../../services/api/acc-payment-term.api";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  odd: {
    backgroundColor: "#faf5f5",
  },
  even: {
    backgroundColor: "#FFFFFF",
  },
}));

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
    backgroundColor: "#faf5f5",
  },
});

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  return (
    <Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">{row.payment_name}</TableCell>
        <TableCell align="left">{row.payment_description}</TableCell>
        <TableCell align="left">{row.method}</TableCell>
        <TableCell align="left">{row.tax_percent}%</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h4" gutterBottom component="div">
                Details
              </Typography>
              <Table
                size="small"
                aria-label="purchases"
                className={classes.odd}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="left" width={10}>
                      No#
                    </TableCell>
                    <TableCell align="left">Payment Type</TableCell>
                    <TableCell align="left">Payment Term Type</TableCell>
                    <TableCell align="left">
                      Payment Detail Description
                    </TableCell>
                    <TableCell align="left">Value</TableCell>
                    <TableCell align="left">Due Date(Days)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.payment_term_details.map((payDetails) => (
                    <TableRow key={payDetails.payment_number}>
                      <TableCell align="left">
                        {payDetails.payment_number}
                      </TableCell>
                      <TableCell align="left">
                        {payDetails.payment_type}
                      </TableCell>
                      <TableCell align="left">
                        {payDetails.payment_term_type}
                      </TableCell>
                      <TableCell align="left">
                        {payDetails.payment_detail_description}
                      </TableCell>
                      <TableCell align="left">
                        {payDetails.payment_value}
                        {payDetails.payment_term_type == "percent" && "%"}
                      </TableCell>
                      <TableCell align="left">
                        {payDetails.days_due_date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}
//code, name, method, default_type, tax, dp, deposit
Row.propTypes = {
  row: PropTypes.shape({
    project_code: PropTypes.string.isRequired,
    customer_code: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    default_type: PropTypes.string.isRequired,
    tax: PropTypes.number.isRequired,
    dp: PropTypes.number.isRequired,
    deposit: PropTypes.number.isRequired,
    details: PropTypes.arrayOf(
      PropTypes.shape({
        customer_code: PropTypes.string.isRequired,
        customer_name: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default function Page() {
  const classes = useStyles();
  const theme = useTheme();

  const router = useRouter();
  const [openDialog, setOpenDialog] = useState("");
  const [rowCount, setRowCount] = useState([]);
  const [listData, setListData] = useState([]);
  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  useEffect(async () => {
    try {
      var data = await getListAccPaymentTermApi();
      setRowCount(data.total);
      setListData(data.result);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <AccountingBaseLayout title="Application Payment Setup">
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
          onClick={(e) => openPage(e, getRoute("accounting.setting"))}
          className={classes.link}
        >
          <WhatshotIcon className={classes.icon} />
          Setup
        </Link>
        <Typography color="textPrimary" className={classes.link}>
          <GrainIcon className={classes.icon} />
          Payment Setup
        </Typography>
      </Breadcrumbs>
      <Box className="p-5 content-wrapper">
        <Grid container className="page-container">
          <Grid item xs={10} lg={10} xl={10}>
            <h1 className="mb-3">Payment Setup</h1>
          </Grid>
          <Grid
            item
            xs={2}
            lg={2}
            xl={2}
            style={{ display: "flex", alignItems: "right" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={(e) =>
                openPage(
                  e,
                  getRoute("accounting.setting.acc-payment-term.input")
                )
              }
            >
              Add Payment Schema
            </Button>
          </Grid>
        </Grid>
        <Grid className="p-5 content-wrapper">
          <Grid
            container
            className="page-container"
            alignItems="left"
            justify="left"
          >
            <Grid item xs={12} lg={12} xl={12}>
              <div className={classes.root}>
                <Paper variant="outlined">
                  <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                      <TableHead>
                        <TableRow>
                          <TableCell width={3} />
                          <TableCell align="left">Payment Name</TableCell>
                          <TableCell align="left">Description</TableCell>
                          <TableCell align="left">Payment Method</TableCell>
                          <TableCell align="left">Tax</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listData.map((row) => (
                          <Row key={row.id} row={row} />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Backdrop className={classes.backdrop} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <AlertDialog
          open={openDialog}
          cancelAction={() => setOpenDialog(false)}
          okAction={() => deleteCoa()}
          title="Delete confirmation"
          body="Are you sure want to delete this record?"
        />
        {/* <CoaForm open={openForm} closeModal={refreshListCoa} coa={data} /> */}
      </Box>
    </AccountingBaseLayout>
  );
}
