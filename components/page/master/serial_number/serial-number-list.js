import {
  Button,
  ButtonGroup,
  Card,
  makeStyles,
  Divider,
  Grid,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Box,
  TextField,
  Backdrop,
  CircularProgress,
  Typography,
} from "@material-ui/core";

import Link from "@material-ui/core/Link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import getRoute from "../../../../helpers/router";
import {
  Delete,
  KeyboardArrowUp,
  KeyboardArrowDown,
  CallToAction,
} from "@material-ui/icons";
import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import GrainIcon from "@material-ui/icons/Grain";

import {
  getListMasterSerialApi2,
  getDetailMasterSerialApi,
  getListMasterSerialFilterApi,
} from "../../../../services/api/master-serial.api";
import BaseLayout from "../../../base_layout/base-layout";
import AlertDialog from "../../../base_component/dialog";
import { exportWorkOrder } from "../../../../services/export/export-wo";
import { getMasteData } from "../../../../services/api/master-data.api";
import { masterDataSwr } from "../../../../services/swr/master-data.swr";

import MasterForm from "../../../../admin-components/pages/master/data/form";
import Moment from "moment";

import Form from "./form";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "set",
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  link: {
    display: "flex",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));
var type = "";
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
          {props.row.unit_code}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.unit_type}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.prefix}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.series}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          <Grid container>
            <Grid item xs={4}>
              {props.row.colour_name}
            </Grid>
            <Grid item xs={4}>
              {props?.row?.container_color?.html_code != "" &&
                props.row.ral_colour}
            </Grid>
            <Grid item xs={4}>
              {props?.row?.container_color?.html_code != "" && (
                <CallToAction
                  style={{
                    width: 70,
                    padding: 0,
                    color: props?.row?.container_color?.html_code,
                  }}
                />
              )}
            </Grid>
          </Grid>
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.serial_number}
        </TableCell>
        <TableCell onClick={() => props.clickAction()}>
          {props.row.comments}
        </TableCell>

        <TableCell>
          {/* <IconButton>
            <Delete onClick={() => props.clickDelete()} />
          </IconButton> */}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Page() {
  const router = useRouter();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [serialId, setSerialId] = useState(null);
  const [data, setData] = useState(null);
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rowCount, setRowCount] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [refreshForm, setRefreshForm] = useState(false);
  const [actForm, setActForm] = useState("Add");
  const [dataPrefix, setDataPrefix] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [prefixName, setPrefixName] = useState("TIHU");
  const [newOptionInsert, setNewOptionInsert] = useState(null);

  const [openMaster, setOpenMaster] = useState(false);
  const [master, setMaster] = useState(null);

  var masterSwr = masterDataSwr("");

  // useEffect(async () => {
  //   var prefix = await getMasteData("container_prefix", "id");
  //   setDataPrefix(prefix);
  // }, []);
  useEffect(async () => {
    setPrefixName(router.query.prefix.toUpperCase());
    try {
      var data = await getListMasterSerialFilterApi(
        "prefix",
        router.query.prefix.toUpperCase(),
        "",
        0,
        20
      );
      setRefreshForm(false);
      setRowCount(data.total);
      setListData(data.result);
      setPage(0);
    } catch (err) {
      console.log(err);
    }
  }, [refreshForm]);

  const handleChangePage = async (event, newPage) => {
    try {
      setOpen(true);
      var data = await getListMasterSerialFilterApi(
        "prefix",
        prefixName,
        search,
        newPage,
        rowsPerPage
      );
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
      var data = await getListMasterSerialFilterApi(
        "prefix",
        prefixName,
        search,
        0,
        parseInt(event.target.value, 10)
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

  const doSearch = async () => {
    try {
      setOpen(true);
      var data = await getListMasterSerialFilterApi(
        "prefix",
        prefixName,
        search,
        0,
        rowsPerPage
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

  const editForm = async (id) => {
    var result = await getDetailMasterSerialApi(id);
    setData(result);
    setSerialId(id);
    setOpen(true);
    setActForm("Update");
    setOpen(false);
    setOpenForm(true);
  };

  const exportData = async () => {
    setExportLoading(true);
    try {
      await exportWorkOrder(rowCount);
    } catch (err) {}
    setExportLoading(false);
  };

  const addMaster = (category, form) => {
    setMaster({ id: null, name: null, alias: null, category: category });
    // setLastForm(form);
    // setOpenImport(false);
    setOpenMaster(true);
  };

  const refreshMaster = (update) => {
    masterSwr.mutate();
    setNewOptionInsert(update);
    setOpenForm(true);
    setOpenMaster(false);
  };

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }
  function closeForm() {
    setRefreshForm(true);
    setOpenForm(false);
  }
  return (
    <BaseLayout title="Master Serial Number">
      <Box className="p-5 content-wrapper">
        <Grid
          container
          className="page-container"
          alignItems="left"
          justify="left"
        >
          <Grid item xs={12} lg={12} xl={12}>
            <h1 className="mb-3">Master Serial Number</h1>
            <Box className="card no-padding">
              <Box className="p-3 display-space-between">
                <Box className="search-bar me-3" style={{ width: "25%" }}>
                  <TextField
                    variant="standard"
                    placeholder="Search Unit Code…"
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
                      setActForm("Add");
                    }}
                  >
                    <Icon>add</Icon>Add New Container Serial
                  </Button>
                </ButtonGroup>
              </Box>
              <Box className="mb-3">
                <Grid container>
                  <Grid item xs={2}>
                    <Button
                      style={{ marginLeft: 10 }}
                      variant="outlined"
                      color="primary"
                      onClick={(e) => {
                        openPage(e, getRoute("master.serial_number"));
                      }}
                    >
                      <Typography variant="h5">Back</Typography>
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={10}
                    style={{ textAlign: "center", marginLeft: -10 }}
                  >
                    <Typography variant="h4">Prefix : {prefixName}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Divider />
              <TableContainer component={Card}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width={12}>No</TableCell>
                      <TableCell>Unit Code</TableCell>
                      <TableCell>Unit Type</TableCell>
                      <TableCell>Prefix</TableCell>
                      <TableCell>Series</TableCell>
                      <TableCell>Color</TableCell>
                      <TableCell>Last Serial Number</TableCell>
                      <TableCell>Comment</TableCell>

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
                          colSpan={9}
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
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Box>
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
      </Box>

      <Form
        open={openForm}
        actForm={actForm}
        serialId={serialId}
        prefix={router.query.prefix.toUpperCase()}
        addMaster={(category) => addMaster(category, "insert")}
        newOption={newOptionInsert}
        closeModal={closeForm}
        serialData={data}
      />

      <MasterForm
        open={openMaster}
        closeModal={(updated) => refreshMaster(updated)}
        master={master}
        category={master?.category}
      />
    </BaseLayout>
  );
}

// import {
//   Button,
//   ButtonGroup,
//   Card,
//   makeStyles,
//   Divider,
//   Grid,
//   Icon,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableFooter,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Box,
//   TextField,
//   Backdrop,
//   CircularProgress,
//   Typography,
// } from "@material-ui/core";

// import Link from "@material-ui/core/Link";
// import { useRouter } from "next/router";
// import React, { useEffect, useState } from "react";
// import getRoute from "../../../../helpers/router";
// import {
//   Delete,
//   KeyboardArrowUp,
//   KeyboardArrowDown,
//   CallToAction,
// } from "@material-ui/icons";
// import HomeIcon from "@material-ui/icons/Home";
// import WhatshotIcon from "@material-ui/icons/Whatshot";
// import GrainIcon from "@material-ui/icons/Grain";

// import {
//   getListMasterSerialApi2,
//   getDetailMasterSerialApi,
//   getListMasterSerialFilterApi,
// } from "../../../../services/api/master-serial.api";
// import BaseLayout from "../../../base_layout/base-layout";
// import AlertDialog from "../../../base_component/dialog";
// import { exportWorkOrder } from "../../../../services/export/export-wo";
// import { getMasteData } from "../../../../services/api/master-data.api";
// import { masterDataSwr } from "../../../../services/swr/master-data.swr";

// import MasterForm from "../../../../admin-components/pages/master/data/form";
// import Moment from "moment";

// import Form from "./form";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     "& > *": {
//       borderBottom: "set",
//     },
//   },
//   backdrop: {
//     zIndex: theme.zIndex.drawer + 1,
//     color: "#fff",
//   },
//   link: {
//     display: "flex",
//   },
//   icon: {
//     marginRight: theme.spacing(0.5),
//     width: 20,
//     height: 20,
//   },
// }));
// var type = "";
// function Row(props) {
//   const classes = useStyles();
//   const [open, setOpen] = useState(false);

//   return (
//     <React.Fragment>
//       <TableRow key={props.keys} hover className={classes.root}>
//         <TableCell onClick={() => props.clickAction()}>
//           {props.keys + 1 + props.page * props.rowsPerPage}
//         </TableCell>
//         <TableCell onClick={() => props.clickAction()}>
//           {props.row.unit_code}
//         </TableCell>
//         <TableCell onClick={() => props.clickAction()}>
//           {props.row.unit_type}
//         </TableCell>
//         <TableCell onClick={() => props.clickAction()}>
//           {props.row.prefix}
//         </TableCell>
//         <TableCell onClick={() => props.clickAction()}>
//           {props.row.series}
//         </TableCell>
//         <TableCell onClick={() => props.clickAction()}>
//           <Grid container>
//             <Grid item xs={4}>
//               {props.row.colour_name}
//             </Grid>
//             <Grid item xs={4}>
//               {props?.row?.container_color?.html_code != "" &&
//                 props.row.ral_colour}
//             </Grid>
//             <Grid item xs={4}>
//               {props?.row?.container_color?.html_code != "" && (
//                 <CallToAction
//                   style={{
//                     width: 70,
//                     padding: 0,
//                     color: props?.row?.container_color?.html_code,
//                   }}
//                 />
//               )}
//             </Grid>
//           </Grid>
//         </TableCell>
//         <TableCell onClick={() => props.clickAction()}>
//           {props.row.serial_number}
//         </TableCell>
//         <TableCell onClick={() => props.clickAction()}>
//           {props.row.comments}
//         </TableCell>

//         <TableCell>
//           {/* <IconButton>
//             <Delete onClick={() => props.clickDelete()} />
//           </IconButton> */}
//         </TableCell>
//       </TableRow>
//     </React.Fragment>
//   );
// }

// export default function Page() {
//   const router = useRouter();
//   const classes = useStyles();
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [openDialog, setOpenDialog] = useState(false);
//   const [serialId, setSerialId] = useState(null);
//   const [data, setData] = useState(null);
//   const [listData, setListData] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(20);
//   const [rowCount, setRowCount] = useState(0);
//   const [openForm, setOpenForm] = useState(false);
//   const [refreshForm, setRefreshForm] = useState(false);
//   const [actForm, setActForm] = useState("Add");
//   const [dataPrefix, setDataPrefix] = useState(false);
//   const [exportLoading, setExportLoading] = useState(false);
//   const [prefixName, setPrefixName] = useState("TIHU");
//   const [newOptionInsert, setNewOptionInsert] = useState(null);

//   const [openMaster, setOpenMaster] = useState(false);
//   const [master, setMaster] = useState(null);

//   var masterSwr = masterDataSwr("");

//   // useEffect(async () => {
//   //   var prefix = await getMasteData("container_prefix", "id");
//   //   setDataPrefix(prefix);
//   // }, []);
//   useEffect(async () => {
//     setPrefixName(router.query.prefix.toUpperCase());
//     try {
//       var data = await getListMasterSerialFilterApi(
//         "prefix",
//         router.query.prefix.toUpperCase(),
//         "",
//         0,
//         20
//       );
//       setRefreshForm(false);
//       setRowCount(data.total);
//       setListData(data.result);
//       setPage(0);
//     } catch (err) {
//       console.log(err);
//     }
//   }, [refreshForm]);

//   const handleChangePage = async (event, newPage) => {
//     try {
//       setOpen(true);
//       var data = await getListMasterSerialFilterApi(
//         "prefix",
//         prefixName,
//         search,
//         newPage,
//         rowsPerPage
//       );
//       setRowCount(data.total);
//       setListData(data.result);
//       setPage(newPage);
//       setOpen(false);
//     } catch (err) {
//       console.log(err);
//       setOpen(false);
//     }
//   };

//   const handleChangeRowsPerPage = async (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     try {
//       setOpen(true);
//       var data = await getListMasterSerialFilterApi(
//         "prefix",
//         prefixName,
//         search,
//         0,
//         parseInt(event.target.value, 10)
//       );
//       setRowCount(data.total);
//       setListData(data.result);
//       setPage(0);
//       setOpen(false);
//     } catch (err) {
//       console.log(err);
//       setOpen(false);
//     }
//   };

//   const doSearch = async () => {
//     try {
//       setOpen(true);
//       var data = await getListMasterSerialFilterApi(
//         "prefix",
//         prefixName,
//         search,
//         0,
//         rowsPerPage
//       );
//       setRowCount(data.total);
//       setListData(data.result);
//       setPage(0);
//       setOpen(false);
//     } catch (err) {
//       console.log(err);
//       setOpen(false);
//     }
//   };

//   const editForm = async (id) => {
//     var result = await getDetailMasterSerialApi(id);
//     setData(result);
//     setSerialId(id);
//     setOpen(true);
//     setActForm("Update");
//     setOpen(false);
//     setOpenForm(true);
//   };

//   const exportData = async () => {
//     setExportLoading(true);
//     try {
//       await exportWorkOrder(rowCount);
//     } catch (err) {}
//     setExportLoading(false);
//   };

//   const addMaster = (category, form) => {
//     setMaster({ id: null, name: null, alias: null, category: category });
//     // setLastForm(form);
//     // setOpenImport(false);
//     setOpenMaster(true);
//   };

//   const refreshMaster = (update) => {
//     masterSwr.mutate();
//     setNewOptionInsert(update);
//     setOpenForm(true);
//     setOpenMaster(false);
//   };

//   function openPage(e, route) {
//     e.preventDefault();
//     router.push(route);
//   }
//   function closeForm() {
//     setRefreshForm(true);
//     setOpenForm(false);
//   }
//   return (
//     <BaseLayout title="Master Serial Number">
//       <Box className="p-5 content-wrapper">
//         <Grid
//           container
//           className="page-container"
//           alignItems="left"
//           justify="left"
//         >
//           <Grid item xs={12} lg={12} xl={12}>
//             <h1 className="mb-3">Master Serial Number</h1>
//             <Box className="card no-padding">
//               <Box className="p-3 display-space-between">
//                 <Box className="search-bar me-3" style={{ width: "25%" }}>
//                   <TextField
//                     variant="standard"
//                     placeholder="Search Unit Code…"
//                     className="search-input"
//                     readOnly={open}
//                     defaultValue={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     InputProps={{
//                       "aria-label": "search",
//                       endAdornment: (
//                         <IconButton onClick={doSearch} size="small">
//                           <Icon>search</Icon>
//                         </IconButton>
//                       ),
//                     }}
//                   />
//                 </Box>
//                 <ButtonGroup
//                   variant="outlined"
//                   color="default"
//                   aria-label="split button"
//                 >
//                   <Button
//                     onClick={() => {
//                       setData(null);
//                       setOpenForm(true);
//                       setActForm("Add");
//                     }}
//                   >
//                     <Icon>add</Icon>Add New Container Serial
//                   </Button>
//                 </ButtonGroup>
//               </Box>
//               <Box className="mb-3">
//                 <Grid container>
//                   <Grid item xs={2}>
//                     <Button
//                       style={{ marginLeft: 10 }}
//                       variant="outlined"
//                       color="primary"
//                       onClick={(e) => {
//                         openPage(e, getRoute("master.serial_number"));
//                       }}
//                     >
//                       <Typography variant="h5">Back</Typography>
//                     </Button>
//                   </Grid>
//                   <Grid
//                     item
//                     xs={10}
//                     style={{ textAlign: "center", marginLeft: -10 }}
//                   >
//                     <Typography variant="h4">Prefix : {prefixName}</Typography>
//                   </Grid>
//                 </Grid>
//               </Box>
//               <Divider />
//               <TableContainer component={Card}>
//                 <Table aria-label="simple table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell width={12}>No</TableCell>
//                       <TableCell>Unit Code</TableCell>
//                       <TableCell>Unit Type</TableCell>
//                       <TableCell>Prefix</TableCell>
//                       <TableCell>Series</TableCell>
//                       <TableCell>Color</TableCell>
//                       <TableCell>Last Serial Number</TableCell>
//                       <TableCell>Comment</TableCell>

//                       <TableCell />
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {listData?.map((row, key) => (
//                       <Row
//                         keys={key}
//                         row={row}
//                         clickAction={() => editForm(row.id)}
//                         clickDelete={() => confirmDelete(row.id)}
//                         page={page}
//                         rowsPerPage={rowsPerPage}
//                       />
//                     ))}
//                     {listData?.length == 0 && (
//                       <TableRow>
//                         <TableCell
//                           colSpan={9}
//                           className="text-center text-muted"
//                           align="center"
//                         >
//                           No data to show
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                   <TableFooter>
//                     <TableRow>
//                       <TablePagination
//                         rowsPerPageOptions={[20, 50, 100]}
//                         colSpan={9}
//                         count={rowCount}
//                         rowsPerPage={rowsPerPage}
//                         page={page}
//                         SelectProps={{
//                           inputProps: { "aria-label": "rows per page" },
//                           native: true,
//                         }}
//                         onChangePage={handleChangePage}
//                         onChangeRowsPerPage={handleChangeRowsPerPage}
//                       />
//                     </TableRow>
//                   </TableFooter>
//                 </Table>
//               </TableContainer>
//             </Box>
//           </Grid>
//         </Grid>
//         <Backdrop className={classes.backdrop} open={open}>
//           <CircularProgress color="inherit" />
//         </Backdrop>
//         <AlertDialog
//           open={openDialog}
//           cancelAction={() => setOpenDialog(false)}
//           okAction={() => deleteCoa()}
//           title="Delete confirmation"
//           body="Are you sure want to delete this record?"
//         />
//       </Box>

//       <Form
//         open={openForm}
//         actForm={actForm}
//         serialId={serialId}
//         prefix={router.query.prefix.toUpperCase()}
//         addMaster={(category) => addMaster(category, "insert")}
//         newOption={newOptionInsert}
//         closeModal={closeForm}
//         serialData={data}
//       />

//       <MasterForm
//         open={openMaster}
//         closeModal={(updated) => refreshMaster(updated)}
//         master={master}
//         category={master?.category}
//       />
//     </BaseLayout>
//   );
// }
