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
  getListUserPosApi,
  getDetailUserPosApi,
  deleteUserPosApi,
} from "../../../services/api/user-pos.api";
import AdminBaseLayout from "../../base_layout/admin_base_layout";
import { Delete } from "@material-ui/icons";
import AlertDialog from "../../../components/base_component/dialog";
import UserForm from "./form";

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

  const deletePosition = async () => {
    setOpenDialog(false);
    try {
      setOpen(true);
      // var res = await deleteUserApi(idData);
      var res = await deleteUserPosApi(idData);
      var data = await getListUserPosApi();
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  useEffect(async () => {
    try {
      setOpen(true);
      // var data = await getListUserApi();
      var data = await getListUserPosApi();
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  }, []);

  const handleChangePage = async (event, newPage) => {
    try {
      setOpen(true);
      // var data = await getListUserApi(newPage, rowsPerPage);
      var data = await getListUserPosApi(newPage, rowsPerPage);
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
      // var data = await getListUserApi(0, parseInt(event.target.value, 10));
      var data = await getListUserPosApi(0, parseInt(event.target.value, 1));
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const refreshListUser = async () => {
    setOpenForm(false);
    try {
      setOpen(true);
      // var data = await getListUserApi(page, rowsPerPage);
      var data = await getListUserPosApi(page, rowsPerPage);
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
    var result = await getDetailUserPosApi(id);
    setData({
      id: id,
      position: result.position,
    });
    setOpen(false);
    setOpenForm(true);
  };

  return (
    <AdminBaseLayout title="User Lists">
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
            <Icon>add</Icon> Add position
          </Button>
          <Box className="card no-padding">
            <TableContainer>
              <Table aria-label="Position List">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: 20 }}>No</TableCell>
                    <TableCell>Position</TableCell>
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
                        {row.position}
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
            okAction={() => deletePosition()}
            title="Delete confirmation"
            body="Are you sure want to delete this record?"
          />
          <UserForm open={openForm} closeModal={refreshListUser} user={data} />
        </Grid>
      </Grid>
    </AdminBaseLayout>
  );
}
