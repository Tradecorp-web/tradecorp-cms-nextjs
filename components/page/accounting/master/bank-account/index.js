import {
  Card,
  makeStyles,
  Icon,
  IconButton,
  ButtonGroup,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Grid,
  TextField,
  Tooltip,
  Divider,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
} from "@material-ui/core";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AccountingBaseLayout from "../../../../base_layout/base-layout-accounting";
import AlertDialog from "../../../../base_component/dialog";
import { getListBankAccApi } from "../../../../../services/api/bank-acc.api";
import { Delete, KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";

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
          {props.row.bank_code}
        </TableCell>

        <TableCell onClick={() => props.clickAction()}>
          {props.row.bank_name}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.bankcoa.coa_name}
        </TableCell>

        <TableCell>
          <IconButton>
            <Delete onClick={() => props.clickDelete()} />
          </IconButton>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Page() {
  const [page, setPage] = useState(0);
  const classes = useStyles();
  const [listData, setListData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [idData, setIdData] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rowCount, setRowCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const confirmDelete = (id) => {
    setIdData(id);
    setOpenDialog(true);
  };

  const deletePwd = async () => {
    setOpenDialog(false);
  };
  useEffect(async () => {
    try {
      getListBankAccApi("", 0, 20);
      var data = await getListBankAccApi();
      setListData(data.result);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  }, []);

  const doSearch = async () => {
    try {
      setOpen(true);
      var data = await getListBankAccApi(search, 0, rowsPerPage);
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const refreshListWO = async () => {
    setOpenForm(false);
    try {
      setOpen(true);
      var data = await getListBankAccApi(search, page, rowsPerPage);
      setRowCount(data.total);
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const router = useRouter();
  var ccount = 0;
  // const { dataUsers } = props;
  console.log(listData);
  return (
    <AccountingBaseLayout title="Bank Account">
      <Box className="p-5 content-wrapper">
        <Grid
          container
          className="page-container"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12} lg={12} xl={8}>
            <h1 className="mb-3">Bank Account</h1>
            <Box className="card no-padding">
              <Box className="p-3 display-space-between">
                <Box className="search-bar me-3" style={{ width: "25%" }}>
                  <TextField
                    variant="standard"
                    placeholder="Search Bank Number…"
                    className="search-input"
                    readOnly={open}
                    defaultValue={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                      "aria-label": "search",
                      endAdornment: (
                        <IconButton onClick={doSearch} size="small">
                          <Icon>search</Icon>
                        </IconButton>
                      ),
                    }}
                  />
                </Box>
                <ButtonGroup
                  variant="outlined"
                  color="default"
                  aria-label="split button"
                >
                  <Button
                    onClick={() => {
                      setData(null);
                      setOpenForm(true);
                    }}
                  >
                    <Icon>add</Icon>Create Bank
                  </Button>
                  <Tooltip title="Download Data" placement="top">
                    <Button
                      size="small"
                      aria-label="select merge strategy"
                      // onClick={exportData}
                      aria-haspopup="menu"
                    >
                      {/* {exportLoading && <CircularProgressCustom size={20} />}
                      {!exportLoading && <Icon>download</Icon>} */}
                    </Button>
                  </Tooltip>
                </ButtonGroup>
              </Box>
              <Divider />
              <TableContainer component={Card}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width={12}>No</TableCell>
                      <TableCell>Bank Code</TableCell>
                      <TableCell>Bank Name</TableCell>
                      <TableCell>Coa</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listData?.map((row, key) => (
                      <Row
                        keys={key}
                        row={row}
                        clickAction={() => editForm(row.id)}
                        clickDelete={() => confirmDelete(row.id)}
                        page={page}
                        rowsPerPage={rowsPerPage}
                      />
                    ))}
                    {listData?.length == 0 && (
                      <TableRow>
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
            </Box>
          </Grid>
        </Grid>
        {/* <Backdrop className={classes.backdrop} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop> */}
        <AlertDialog
          open={openDialog}
          cancelAction={() => setOpenDialog(false)}
          okAction={() => deleteWO()}
          title="Delete confirmation"
          body="Are you sure want to delete this record?"
        />
        {/* <WOForm open={openForm} closeModal={refreshListWO} wo={data} /> */}
      </Box>
    </AccountingBaseLayout>
  );
}
