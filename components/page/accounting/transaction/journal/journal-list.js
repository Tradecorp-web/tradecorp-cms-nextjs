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
  getDetailAccTrxJournalApi,
} from "../../../../../services/api/acc-trx-journal.api";
import { getListAccTrxJournalSwr } from "../../../../../services/swr/acc-trx-journal.swr";

import Moment from "moment";
import JurnalEditForm from "./journal-edit-form";

const useStyles = makeStyles((theme) => ({
  breadcrumb: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function Row(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const router = useRouter();

  return (
    <React.Fragment>
      <TableRow key={props.keys} hover className={classes.root}>
        <TableCell onClick={() => props.clickAction()}>
          {props.keys + 1 + props.page * props.rowsPerPage}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {Moment(props.row.trx_date).format("LL")}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.project_code}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props?.row?.reference_number}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props?.row?.remarks}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props?.row?.team?.name}
        </TableCell>
        <TableCell align={"center"}>
          {/* <IconButton style={{ color: "#2196f3" }}>
            <Assignment onClick={(e) => openPage(e, getRoute("sales"))} />
          </IconButton> */}
          {/* <IconButton style={{ color: "#FF0000" }}>
            <Delete onClick={() => props.clickDelete()} />
          </IconButton> */}
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
      var dataTrx = await getListAccTrxJournalApi();
      setRowCount(dataTrx.total);
      setListData(dataTrx.result);
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
      team_code: result?.team_code,
      team_name: result?.team?.name,
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
          <Typography color="textPrimary">Journal List</Typography>
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
            <Card className="{classes.root}">
              <CardHeader title="transaksi" subheader="journal"></CardHeader>
              <CardContent>
                <TableContainer component={Card}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow key="X1">
                        <TableCell width={12}>No</TableCell>
                        <TableCell>Trx Date</TableCell>
                        <TableCell>Project Code</TableCell>
                        <TableCell>Reference Number</TableCell>
                        <TableCell>Remark</TableCell>
                        <TableCell>Team</TableCell>
                        <TableCell></TableCell>
                        {/* <TableCell align={"center"}>Action</TableCell> */}
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
