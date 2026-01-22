import {
  Butt,
  Grid,
  Icon,
  Link,
  CardContent,
  Typography,
  Box,
  Button,
  ButtonGroup,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Card,
  CardHeader,
  Breadcrumbs,
  makeStyles,
} from "@material-ui/core";

import React, { useEffect, useState } from "react";
import AccountingBaseLayout from "../../../../base_layout/base-layout-sidemenu-accounting";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { useRouter } from "next/router";
import getRoute from "../../../../../helpers/router";

import {
  getListAccTrxJournalApi,
  getListAccTrxJournalOrderApi,
  getDetailAccTrxJournalApi,
} from "../../../../../services/api/acc-trx-journal.api";

import Moment from "moment";
import { currency } from "../../../../../helpers/general";
import JurnalEditForm from "./journal-edit-form";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  breadcrumb: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  odd: {
    backgroundColor: "#faf5f5",
  },
  even: {
    backgroundColor: "#FFFFFF",
  },
}));

function Row(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const router = useRouter();
  var classname = classes.odd;
  if (props.row.group_number % 2 == 0) {
    classname = classes.even;
  }
  return (
    <React.Fragment>
      <TableRow key={props.keys} hover className={classname}>
        <TableCell onClick={() => props.clickAction()}>
          {props.keys + 1 + props.page * props.rowsPerPage}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {Moment(props.row.trx_date).format("LL")}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.reference_number}
        </TableCell>
        <TableCell align="center" onClick={() => props.clickAction()}>
          {props.row.coa_code}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.coa_name}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.remark_detail}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.subsidiary_code}
        </TableCell>
        <TableCell align="right" onClick={() => props.clickAction()}>
          {props.row.debit > 0 && currency(props.row.debit)}
        </TableCell>
        <TableCell align="right" onClick={() => props.clickAction()}>
          {props.row.credit > 0 && currency(props.row.credit)}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Page(props) {
  const router = useRouter();

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [listData, setListData] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rowCount, setRowCount] = useState(0);

  const [optionPeriod, setOptionPeriod] = useState([]);
  const refreshListJurnal = () => {
    setOpenForm(false);
  };

  function addJournal(e, route) {
    alert("Add journal transaction");
  }
  // var dataTrx = getListAccTrxJournalSwr();
  useEffect(async () => {
    try {
      var dataTrx = await getListAccTrxJournalOrderApi(
        "",
        0,
        0,
        "reference_number"
      );
      setRowCount(dataTrx.total);
      var dataDetail = [];
      var number = 0;
      dataTrx.result.map((row, key) => {
        number++;
        row.details.map((row2, key) => {
          dataDetail.push({
            group_number: number,
            reference_number: row.reference_number,
            trx_date: row.trx_date,
            coa_code: row2.coa_code,
            coa_name: row2.coa_name,
            remark_detail: row2.remark_detail,
            subsidiary_code: row2.subsidiary_code,
            debit: row2.debit,
            credit: row2.credit,
          });
        });
      });
      setListData(dataDetail);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const editForm = async (id) => {
    var result = await getDetailAccTrxJournalApi(id);
    setData({
      id: id,
      trx_date: result.trx_date,
      reference_number: result.reference_number,
      reference_document: result.reference_document,
      project_code: result.project_code,
      remarks: result.remarks,
      team_code: result.team_code,
      team_name: result.team.name,
      details: result.details,
    });
    setOpenForm(true);
  };
  return (
    <AccountingBaseLayout title="Accounting">
      <div className={classes.breadcrumb}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link
            color="inherit"
            onClick={(e) => openPage(e, getRoute("accounting"))}
          >
            Accounting dashboard
          </Link>
          <Link
            color="inherit"
            onClick={(e) =>
              openPage(e, getRoute("accounting.transaction.journal"))
            }
          >
            Transaction
          </Link>
          <Typography color="textPrimary">General Ledger</Typography>
        </Breadcrumbs>
      </div>

      <div className="p-5 content-wrapper">
        <Grid
          container
          className="page-container"
          alignItems="center"
          justify="center"
        >
          {/* No	Trx Code	Acc Code	Acc Name	Description	Debet	Credit */}
          <Grid item lg={12}>
            <Card className={classes.root}>
              <CardHeader title="General" subheader="Ledger"></CardHeader>
              <CardContent>
                <TableContainer component={Card}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow key="X1">
                        <TableCell width={12}>No</TableCell>
                        <TableCell>Trx Date</TableCell>
                        <TableCell>Trx Code</TableCell>
                        <TableCell align="center">Coa Code</TableCell>
                        <TableCell>Coa Name</TableCell>
                        <TableCell>Remark</TableCell>
                        <TableCell>Subsidiary Code</TableCell>
                        <TableCell align="right">Debit</TableCell>
                        <TableCell align="right">Credit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listData?.map((row, key) => (
                        <Row
                          keys={key}
                          row={row}
                          clickAction={() => editForm(row.id)}
                          page={page}
                          rowsPerPage={rowsPerPage}
                        />
                      ))}
                      {listData?.length === 0 && (
                        <TableRow key="X2">
                          <TableCell
                            colspan={9}
                            className="text-center text-muted"
                            align="center"
                          >
                            No data to show
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                    <TableFooter>
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
                          // onChangePage={handleChangePage}
                          // onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <JurnalEditForm
            open={openForm}
            closeModal={refreshListJurnal}
            jurnal={data}
          />
        </Grid>
      </div>
    </AccountingBaseLayout>
  );
}
