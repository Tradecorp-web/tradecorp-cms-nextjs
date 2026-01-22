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
  Box,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  deleteCompanyTypeApi,
  getDetailCompanyTypeApi,
  getListCompanyTypeApi,
} from "../../../services/api/company-type.api";
import AdminBaseLayout from "../../base_layout/admin_base_layout";
import { Delete } from "@material-ui/icons";
import AlertDialog from "../../../components/base_component/dialog";
import CompanyTypeForm from "./form";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function Page() {
  const router = useRouter();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [idData, setIdData] = useState(null);
  const [data, setData] = useState(null);
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rowCount, setRowCount] = useState(0);
  const [openForm, setOpenForm] = useState(false);

  const confirmDelete = (id) => {
    setIdData(id);
    setOpenDialog(true);
  };

  const deleteCompanyType = async () => {
    setOpenDialog(false);
    try {
      setOpen(true);
      var res = await deleteCompanyTypeApi(idData);
      var data = await getListCompanyTypeApi();
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const handleChangePage = async (event, newPage) => {
    try {
      setOpen(true);
      var data = await getListCompanyTypeApi(newPage, rowsPerPage);
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
      var data = await getListCompanyTypeApi(
        0,
        parseInt(event.target.value, 1)
      );
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  useEffect(async () => {
    try {
      setOpen(true);
      var data = await getListCompanyTypeApi();

      setRowCount(data.total);
      setListData(data.result);

      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  }, []);

  const refreshList = async () => {
    setOpenForm(false);
    try {
      setOpen(true);
      var data = await getListCompanyTypeApi();
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
    var result = await getDetailCompanyTypeApi(id);

    setData({
      id: id,
      name: result.name,
      companyType: result.company_type,
    });

    setOpen(false);
    setOpenForm(true);
  };

  return (
    <AdminBaseLayout title="Company Type Lists">
      <Grid container spacing={4}>
        <Grid item lg={12}>
          <Button
            color="secondary"
            variant="contained"
            disableElevation
            className="mb-4"
            onClick={() => {
              setData(null);
              setOpenForm(true);
            }}
          >
            <Icon>add</Icon> Add Company Type
          </Button>
          <Box className="card no-padding">
            <TableContainer>
              <Table aria-label="Team List">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: 20 }}>No</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listData?.map((row, key) => (
                    <TableRow key={key} hover>
                      <TableCell onClick={() => editForm(row.id)}>
                        {key + 1 + page * rowsPerPage}
                      </TableCell>
                      <TableCell onClick={() => editForm(row.id)}>
                        {row.company_type}
                      </TableCell>
                      <TableCell onClick={() => editForm(row.id)}>
                        {row.name}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton>
                          <Delete onClick={() => confirmDelete(row.id)} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {listData?.length == 0 && (
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
          </Box>
          <Backdrop className={classes.backdrop} open={open}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <AlertDialog
            open={openDialog}
            cancelAction={() => setOpenDialog(false)}
            okAction={() => deleteCompanyType()}
            title="Delete confirmation"
            body="Are you sure want to delete this record?"
          />

          <CompanyTypeForm
            open={openForm}
            closeModal={refreshList}
            companyType={data}
          />
        </Grid>
      </Grid>
    </AdminBaseLayout>
  );
}
