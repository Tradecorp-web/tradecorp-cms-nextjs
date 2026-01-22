import {
  Button,
  Grid,
  Icon,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Backdrop,
  CircularProgress,
  TablePagination,
  TableFooter,
  Divider,
  ButtonGroup, Card,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getListCustomerReferenceApi, deleteCustomerReferenceApi, getDetailCustomerReferenceApi} from "../../../services/api/customer-reference.api";
import BaseLayoutCustomer from "../../base_layout/base-layout-customer";
import { Delete } from "@material-ui/icons";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import AlertDialog from "../../../components/base_component/dialog";
import CustomerReferenceForm from "./form";
import SearchBar from "../../base_component/searchbar";
import {useRouter} from "next/router";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },

}));

export default function Page() {
  const classes = useStyles();
  const router = useRouter();


  /*Start Use State*/

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [idData, setIdData] = useState(null);
  const [data, setData] = useState(null);
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rowCount, setRowCount] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [isLoading, setLoading] = useState(false);

  /*End Use State*/

  /*Start Function*/

  function searchData(search) {
    setPage(0);
    setSearch(search);
  }


  const confirmDelete = (id) => {
    setIdData(id);
    setOpenDialog(true);
  };

  const deleteCustomerReference = async () => {
    setOpenDialog(false);
    try {
      setOpen(true);
      await deleteCustomerReferenceApi(idData);
      let data = await getListCustomerReferenceApi("", 0, 0, orderBy, order);
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };
  const handleChangePage = async (event, newPage) => {
    try {
      setOpen(true);
      let data = await getListCustomerReferenceApi(search, newPage, rowsPerPage, orderBy, order);
      setRowCount(data.total);
      setListData(data.result);
      setPage(newPage);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    try {
      setOpen(true);
      let data = await getListCustomerReferenceApi(search, 0, parseInt(event.target.value, 10), orderBy, order);
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };
  /*End Function*/
  const refreshListCustomerReference = async () => {
    setOpenForm(false);
    try {
      setOpen(true);
      let data = await getListCustomerReferenceApi(search, page, rowsPerPage, orderBy, order);
      setRowCount(data.total);
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const editForm = async (id) => {
    setOpen(true);
    let result = await getDetailCustomerReferenceApi(id);
    setData({
      id: id,
      company_name: result.company_name,
    });
    setOpen(false);
    setOpenForm(true);
  };

  /*Start Use Effect*/

  useEffect(async () => {
    try {
      setOpen(true);
      let data = await getListCustomerReferenceApi();
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  }, []);

  /*End Use Effect*/


  return (
    <BaseLayoutCustomer title="User List">
      <div className="p-5 content-wrapper">
        <Grid
            container
            className="page-container"
            alignItems="center"
            justify="center"
        >
          <Grid item xs={12} lg={12} xl={8}>
            <h1 className="mb-3">Customer References</h1>
            <div className="card no-padding">
              <div className="p-3 display-space-between">
                <SearchBar
                    style={{ width: "25%", marginRight: 24 }}
                    onSearch={(search) => searchData(search)}
                    isLoading={isLoading}
                />

                <ButtonGroup
                    variant="outlined"
                    color="default"
                    aria-label="split button"
                >
                    <Button color="secondary" variant="contained" disableElevation onClick={() => {setData(null);setOpenForm(true);}}>
                      <Icon>add</Icon> Add Company Name
                    </Button>
                </ButtonGroup>
              </div>
              <Divider />
              <TableContainer component="Card">
                <Table aria-label="Customer Reference List">
                  <TableHead>
                    <TableRow>
                      <TableCell>No</TableCell>
                        <TableCell>Company Name</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!isLoading &&
                    listData?.map((row, key) => (
                        <TableRow key={key} hover={true}>
                          <TableCell onClick={() => editForm(row.id)}>
                            {key + 1 + page * rowsPerPage}
                          </TableCell>
                          <TableCell onClick={() => editForm(row.id)}>
                            {row.company_name}
                          </TableCell>
                          <TableCell>
                            <IconButton>
                              <Delete onClick={() => confirmDelete(row.id)} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                    ))}
                    {listData?.length === 0 && (
                        <TableRow>
                          <TableCell colspan={9} align="center">
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
                          onChangePage={handleChangePage}
                          onChangeRowsPerPage={handleChangeRowsPerPage}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>

            </div>
            <ButtonGroup variant="outlined" color="default" aria-label="split button"
                style={
                  {
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 24,
                    marginRight: 15,
                  }
                }>
              <Button color="primary" variant="contained" disableElevation onClick={() => {router.push('customer')}}>
                <KeyboardBackspaceIcon></KeyboardBackspaceIcon> <span className="mx-3">Back To Customer Page</span>
              </Button>
            </ButtonGroup>
            <Backdrop className={classes.backdrop} open={open}>
              <CircularProgress color="inherit" />
            </Backdrop>
            <AlertDialog
                open={openDialog}
                cancelAction={() => setOpenDialog(false)}
                okAction={() => deleteCustomerReference()}
                title="Delete confirmation"
                body="Are you sure want to delete this record?"
            />
            <CustomerReferenceForm open={openForm} closeModal={refreshListCustomerReference} customerReference={data} />
          </Grid>
        </Grid>
      </div>
    </BaseLayoutCustomer>
  );
}
