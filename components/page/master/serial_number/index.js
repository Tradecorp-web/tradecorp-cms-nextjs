import {
  Button,
  ButtonGroup,
  Card,
  makeStyles,
  Divider,
  Grid,
  Icon,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Box,
  TextField,
  Backdrop,
  CircularProgress,
  Menu,
  MenuItem,
} from "@material-ui/core";

import Link from "@material-ui/core/Link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import getRoute from "../../../../helpers/router";
import AlertDialog from "../../../base_component/dialog";
import BaseLayout from "../../../base_layout/base-layout";

import {
  getMasteData,
  insertMasterDataApi,
} from "../../../../services/api/master-data.api";

import { masterDataSwr } from "../../../../services/swr/master-data.swr";

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
//https://www.bic-code.org/bic-codes/tihu/
export default function Page() {
  const router = useRouter();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [dataPrefix, setDataPrefix] = useState(false);
  const [openPrefixDialog, setOpenPrefixDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [inputList, setInputList] = useState(false);
  const [masterData, setMasterData] = useState(false);

  const [sizeOptions, setSizeOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  var masterSwr = masterDataSwr("");

  useEffect(() => {
    if (masterSwr?.data) {
      setSizeOptions(
        masterSwr?.data?.filter((val) => val?.category == "container_size") ??
          []
      );
      setTypeOptions(
        masterSwr?.data?.filter((val) => val?.category == "container_type") ??
          []
      );
      setMasterData(masterSwr?.data);
    }
  }, [masterSwr?.data]);

  useEffect(async () => {
    var prefix = await getMasteData("container_prefix", "id");
    setDataPrefix(prefix);
    setInputList({
      name: null,
      alias: null,
      category: "container_prefix",
    });
    setOpen(false);
  }, [open]);

  const getPrefix = async (e, prefName) => {
    openPage(e, getRoute("master.serial_number.prefix", { prefix: prefName }));
  };
  /**
   *
   *  openPage(e, getRoute("quotein"));
   */

  const onInputChange = (e) => {
    setInputList({
      ...inputList,
      name: e.target.value.toUpperCase(),
      alias: e.target.value.toUpperCase(),
    });
  };
  const openSaveDlg = () => {
    setOpenSaveDialog(true);
  };
  const savePrefix = () => {
    var save = insertMasterDataApi(inputList).then((res) => {
      setOpenSaveDialog(false);
      setOpenPrefixDialog(false);
      setOpen(true);
    });
  };

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
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
          <Grid item xs={12} lg={12} xl={12} style={{ textAlign: "center" }}>
            <h1 className="mb-3">Master Serial Number</h1>
            <Box className="card no-padding">
              <Box className="p-3 display-space-between">
                <Box className="search-bar me-3" style={{ width: "25%" }}></Box>
                <ButtonGroup
                  variant="outlined"
                  color="default"
                  aria-label="split button"
                >
                  <Button
                    onClick={() => {
                      setOpenPrefixDialog(true);
                    }}
                  >
                    <Icon>add</Icon>Add Prefix
                  </Button>
                </ButtonGroup>
              </Box>
              <Box className="mb-3">
                {dataPrefix &&
                  dataPrefix?.map((res) => (
                    <Button
                      variant="outlined"
                      style={{ marginLeft: 10, padding: 50 }}
                      size="large"
                      color="primary"
                      onClick={(e) => getPrefix(e, res?.name)}
                    >
                      {res?.name}
                    </Button>
                  ))}
              </Box>
              <Divider />
            </Box>
          </Grid>
        </Grid>
        <Backdrop className={classes.backdrop} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>

      <Dialog
        fullWidth
        maxWidth="md"
        open={openPrefixDialog}
        onClose={() => {
          setOpenPrefixDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add new Prefix</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Fill new prefix in textbox
          </DialogContentText>

          <TextField
            variant="outlined"
            id="prefix"
            name="prefix"
            fullWidth
            inputProps={{ style: { textTransform: "uppercase" } }}
            onChange={(e) => {
              onInputChange(e);
            }}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenPrefixDialog(false);
            }}
            color="primary"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              openSaveDlg();
            }}
            variant="contained"
            color="primary"
            autoFocus
          >
            Save Prefix
          </Button>
        </DialogActions>
      </Dialog>

      <AlertDialog
        open={openSaveDialog}
        cancelAction={() => setOpenSaveDialog(false)}
        okAction={() => savePrefix()}
        title="Save confirmation"
        body="Are you sure want to save this prefix?"
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
//   Dialog,
//   DialogTitle,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   Box,
//   TextField,
//   Backdrop,
//   CircularProgress,
//   Menu,
//   MenuItem,
// } from "@material-ui/core";

// import Link from "@material-ui/core/Link";
// import { useRouter } from "next/router";
// import React, { useEffect, useState } from "react";
// import getRoute from "../../../../helpers/router";
// import AlertDialog from "../../../base_component/dialog";
// import BaseLayout from "../../../base_layout/base-layout";

// import {
//   getMasteData,
//   insertMasterDataApi,
// } from "../../../../services/api/master-data.api";

// import { masterDataSwr } from "../../../../services/swr/master-data.swr";

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
// //https://www.bic-code.org/bic-codes/tihu/
// export default function Page() {
//   const router = useRouter();
//   const classes = useStyles();
//   const [open, setOpen] = useState(false);
//   const [dataPrefix, setDataPrefix] = useState(false);
//   const [openPrefixDialog, setOpenPrefixDialog] = useState(false);
//   const [openSaveDialog, setOpenSaveDialog] = useState(false);
//   const [inputList, setInputList] = useState(false);
//   const [masterData, setMasterData] = useState(false);

//   const [sizeOptions, setSizeOptions] = useState([]);
//   const [typeOptions, setTypeOptions] = useState([]);

//   var masterSwr = masterDataSwr("");

//   useEffect(() => {
//     if (masterSwr?.data) {
//       setSizeOptions(
//         masterSwr?.data?.filter((val) => val?.category == "container_size") ??
//           []
//       );
//       setTypeOptions(
//         masterSwr?.data?.filter((val) => val?.category == "container_type") ??
//           []
//       );
//       setMasterData(masterSwr?.data);
//     }
//   }, [masterSwr?.data]);

//   useEffect(async () => {
//     var prefix = await getMasteData("container_prefix", "id");
//     setDataPrefix(prefix);
//     setInputList({
//       name: null,
//       alias: null,
//       category: "container_prefix",
//     });
//     setOpen(false);
//   }, [open]);

//   const getPrefix = async (e, prefName) => {
//     openPage(e, getRoute("master.serial_number.prefix", { prefix: prefName }));
//   };
//   /**
//    *
//    *  openPage(e, getRoute("quotein"));
//    */

//   const onInputChange = (e) => {
//     setInputList({
//       ...inputList,
//       name: e.target.value.toUpperCase(),
//       alias: e.target.value.toUpperCase(),
//     });
//   };
//   const openSaveDlg = () => {
//     setOpenSaveDialog(true);
//   };
//   const savePrefix = () => {
//     var save = insertMasterDataApi(inputList).then((res) => {
//       setOpenSaveDialog(false);
//       setOpenPrefixDialog(false);
//       setOpen(true);
//     });
//   };

//   function openPage(e, route) {
//     e.preventDefault();
//     router.push(route);
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
//           <Grid item xs={12} lg={12} xl={12} style={{ textAlign: "center" }}>
//             <h1 className="mb-3">Master Serial Number</h1>
//             <Box className="card no-padding">
//               <Box className="p-3 display-space-between">
//                 <Box className="search-bar me-3" style={{ width: "25%" }}></Box>
//                 <ButtonGroup
//                   variant="outlined"
//                   color="default"
//                   aria-label="split button"
//                 >
//                   <Button
//                     onClick={() => {
//                       setOpenPrefixDialog(true);
//                     }}
//                   >
//                     <Icon>add</Icon>Add Prefix
//                   </Button>
//                 </ButtonGroup>
//               </Box>
//               <Box className="mb-3">
//                 {dataPrefix &&
//                   dataPrefix?.map((res) => (
//                     <Button
//                       variant="outlined"
//                       style={{ marginLeft: 10, padding: 50 }}
//                       size="large"
//                       color="primary"
//                       onClick={(e) => getPrefix(e, res?.name)}
//                     >
//                       {res?.name}
//                     </Button>
//                   ))}
//               </Box>
//               <Divider />
//             </Box>
//           </Grid>
//         </Grid>
//         <Backdrop className={classes.backdrop} open={open}>
//           <CircularProgress color="inherit" />
//         </Backdrop>
//       </Box>

//       <Dialog
//         fullWidth
//         maxWidth="md"
//         open={openPrefixDialog}
//         onClose={() => {
//           setOpenPrefixDialog(false);
//         }}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">Add new Prefix</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Fill new prefix in textbox
//           </DialogContentText>

//           <TextField
//             variant="outlined"
//             id="prefix"
//             name="prefix"
//             fullWidth
//             inputProps={{ style: { textTransform: "uppercase" } }}
//             onChange={(e) => {
//               onInputChange(e);
//             }}
//           ></TextField>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => {
//               setOpenPrefixDialog(false);
//             }}
//             color="primary"
//           >
//             Close
//           </Button>
//           <Button
//             onClick={() => {
//               openSaveDlg();
//             }}
//             variant="contained"
//             color="primary"
//             autoFocus
//           >
//             Save Prefix
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <AlertDialog
//         open={openSaveDialog}
//         cancelAction={() => setOpenSaveDialog(false)}
//         okAction={() => savePrefix()}
//         title="Save confirmation"
//         body="Are you sure want to save this prefix?"
//       />
//     </BaseLayout>
//   );
// }
