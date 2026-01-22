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
  Link,
  Breadcrumbs,
  Typography,
} from "@material-ui/core";
import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";
import { useEffect, useState } from "react";
import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import GrainIcon from "@material-ui/icons/Grain";
import {
  getListUserPosApi,
  getDetailUserPosApi,
  deleteUserPosApi,
} from "../../../services/api/user-pos.api";
import {
  getListFlowStatusApi,
  getDetailFlowStatusApi,
  deleteFlowStatusApi,
} from "../../../services/api/ref-flow-status.api";
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
  const modul = router.query.modul;
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
  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }
  const deletePosition = async () => {
    setOpenDialog(false);
    try {
      setOpen(true);
      // var res = await deleteUserApi(idData);
      var res = await deleteFlowStatusApi(idData);
      var data = await getListFlowStatusApi(modul);
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
      var data = await getListFlowStatusApi(modul);
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
      var data = await getListFlowStatusApi(modul);
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
      var data = await getListFlowStatusApi(modul);
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
      var data = await getListFlowStatusApi(modul);
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
    var result = await getDetailFlowStatusApi(id);
    setData({
      id: id,
      modul_id: result.modul_id,
      position_id: result.position_id,
      team_id: result.team_id,
      status: result.status,
      final: result.final,
      active: result.active,
    });
    setOpen(false);
    setOpenForm(true);
  };

  return (
    <AdminBaseLayout title="Flow Master">
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          color="inherit"
          button
          onClick={(e) => openPage(e, getRoute("admin.dashboard"))}
          className={classes.menuItem}
        >
          <HomeIcon className={classes.icon} />
          Dashboard
        </Link>
        <Link
          color="inherit"
          button
          onClick={(e) => openPage(e, getRoute("admin.flowmaster"))}
          className={classes.link}
        >
          <WhatshotIcon className={classes.icon} />
          Modul
        </Link>
        <Typography color="textPrimary" className={classes.link}>
          <GrainIcon className={classes.icon} />
          List Flow Master
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={4}>
        <Grid item lg={10}></Grid>
        <Grid item lg={2}>
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
            <Icon>add</Icon> Add flow master
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item lg={12}>
          <Box className="card no-padding">
            <TableContainer>
              <Table aria-label="Flow List">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: 20 }}>No</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Status Flow</TableCell>
                    <TableCell>Status Final</TableCell>
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
                        {row?.team?.name}
                      </TableCell>
                      <TableCell onClick={() => editForm(row.id)}>
                        {row?.position?.position}
                      </TableCell>
                      <TableCell onClick={() => editForm(row.id)}>
                        {row?.status}
                      </TableCell>
                      <TableCell onClick={() => editForm(row.id)}>
                        {row?.final ? (
                          <Icon color="error">link_off</Icon>
                        ) : (
                          <Icon>link</Icon>
                        )}
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
