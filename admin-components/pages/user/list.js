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
  TextField,
  Divider,
  TableSortLabel,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  getListUserApi,
  deleteUserApi,
  getDetailUserApi,
} from "../../../services/api/user.api";
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
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [idData, setIdData] = useState(null);
  const [data, setData] = useState(null);
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rowCount, setRowCount] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("username");

  const confirmDelete = (id) => {
    setIdData(id);
    setOpenDialog(true);
  };

  const deleteUser = async () => {
    setOpenDialog(false);
    try {
      setOpen(true);
      var res = await deleteUserApi(idData);
      var data = await getListUserApi("", 0, 0, orderBy, order);
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
      var data = await getListUserApi("", 0, 0, orderBy, order);
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
      var data = await getListUserApi(search, newPage, rowsPerPage, orderBy, order);
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
      var data = await getListUserApi(search, 0, parseInt(event.target.value, 10), orderBy, order);
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const doSearch = async () => {
    try {
      setOpen(true);
      var data = await getListUserApi(search, 0, rowsPerPage, orderBy, order);
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
      var data = await getListUserApi(search, page, rowsPerPage, orderBy, order);
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
    var result = await getDetailUserApi(id);
    setData({
      id: id,
      username: result.username,
      password: null,
      name: result.name,
      position: result.position,
      email: result.email,
      office: result.office_id,
      team: result.team_id,
      permission: result.permission,
    });
    setOpen(false);
    setOpenForm(true);
  };

  const changeSort = async (field) => {
    const isAsc = orderBy === field && order === "asc"
    var ord
    if (isAsc) {
      ord = "desc"
    } else {
      ord = "asc"
    }
    //setOrder(isAsc ? "desc" : "asc")
    setOrderBy(field)
    setOrder(ord)
    try {
      setOpen(true);
      var data = await getListUserApi(search, page, rowsPerPage, field, ord);
      setRowCount(data.total);
      setListData(data.result);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  }

  return (
    <AdminBaseLayout title="User List">
      <Grid container spacing={4}>
        <Grid item lg={12}>
          <Box className="card no-padding">
            <Box className="display-space-between">
              <Box className="search-bar me-3" style={{ width: "25%", marginLeft: 10 }}>
                <TextField
                  variant="standard"
                  placeholder="Search…"
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
                    disableUnderline: true,
                  }}
                />
              </Box>
              <Box style={{ marginTop: 15, marginRight: 10 }}>
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
                  <Icon>add</Icon> Add User
                </Button>
              </Box>
            </Box>
            <Divider />
            <TableContainer>
              <Table aria-label="User List">
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell
                      key="username"
                      sortDirection={orderBy === "username" ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === "username"}
                        direction={orderBy === "username" ? order : "asc"}
                        onClick={() => changeSort("username")}
                      >
                        Username
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      key="name"
                      sortDirection={orderBy === "name" ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === "name"}
                        direction={orderBy === "name" ? order : "asc"}
                        onClick={() => changeSort("name")}
                      >
                        Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      key="user_position"
                      sortDirection={orderBy === "user_position" ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === "user_position"}
                        direction={orderBy === "user_position" ? order : "asc"}
                        onClick={() => changeSort("user_position")}
                      >
                        Position
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      key="email"
                      sortDirection={orderBy === "email" ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === "email"}
                        direction={orderBy === "email" ? order : "asc"}
                        onClick={() => changeSort("email")}
                      >
                        Email
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      key="office"
                      sortDirection={orderBy === "office" ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === "office"}
                        direction={orderBy === "office" ? order : "asc"}
                        onClick={() => changeSort("office")}
                      >
                        Office
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      key="team"
                      sortDirection={orderBy === "team" ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === "team"}
                        direction={orderBy === "team" ? order : "asc"}
                        onClick={() => changeSort("team")}
                      >
                        Team
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Depo</TableCell>
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
                        {row.username}
                      </TableCell>
                      <TableCell onClick={() => editForm(row.id)}>
                        {row.name}
                      </TableCell>
                      <TableCell onClick={() => editForm(row.id)}>
                        {row?.user_position != null
                          ? row?.user_position?.position
                          : row?.position + " *"}
                      </TableCell>
                      <TableCell onClick={() => editForm(row.id)}>
                        {row.email}
                      </TableCell>
                      <TableCell onClick={() => editForm(row.id)}>
                        {row.office?.office_name}
                      </TableCell>
                      <TableCell onClick={() => editForm(row.id)}>
                        {row.team?.name}
                      </TableCell>
                      <TableCell onClick={() => editForm(row.id)}></TableCell>
                      <TableCell>
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
            okAction={() => deleteUser()}
            title="Delete confirmation"
            body="Are you sure want to delete this record?"
          />
          <UserForm open={openForm} closeModal={refreshListUser} user={data} />
        </Grid>
      </Grid>
    </AdminBaseLayout>
  );
}
