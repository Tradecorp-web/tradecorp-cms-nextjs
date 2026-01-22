import {
  Button,
  Card,
  Grid,
  MenuItem,
  Modal,
  Typography,
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  makeStyles,
  Backdrop,
  CircularProgress,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Input,
  Select,
  Chip,
  LinearProgress,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Delete, Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { saveFileUserApi } from "../../../services/api/file-user.api";
import {
  saveMultiFolderUserApi,
  purgeFolderUserApi,
} from "../../../services/api/folder-user.api";
import { FileDocNoLinkUploadComponent } from "../../base_component/file-upload";
import { DropzoneArea } from "material-ui-dropzone";
import { uploadFileMyApi, deleteFileApi } from "../../../services/api/file.api";
import Moment from "moment";
import { LOCAL_STORAGE_STOP_TIMEOUT } from "../../../helpers/consts";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  progress: {
    marginTop: theme.spacing(2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function DocumentForm(props) {
  const classes = useStyles();

  const [errorText, setErrorText] = useState({
    document_name: null,
    link: null,
  });
  const [isLoading, setLoading] = useState(false);

  const [folder, setFolder] = useState("");
  const [data, setData] = useState({
    id: null,
    document_name: null,
    folder_id: null,
    upload_date: null,
    link: null,
  });
  const [listData, setListData] = useState([]);
  const [listProgress, setListProgress] = useState([]);
  const [listLoadFile, setListLoadFile] = useState([]);
  const [listFolder, setListFolder] = useState([]);
  const [numExisting, setNumExisting] = useState(0);
  //const [uploadDate, setUploadDate] = useState(null);
  const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" });

  var countUp = 0;
  var procList = [];
  var fileList = [];
  var onGoing = [];
  var folderList = [];
  var countSend = 0;

  const onInputChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  // const onUploadedFile = (resp) => {
  //     setData({ ...data, link:resp.link, content_type:resp.content_type, document_name:resp.file_name})
  //     setLink(resp.link)
  // }

  const uploadFile = (file, len, folder_id = "") => {
    uploadFileMyApi(folder, file)
      .then((response) => {
        if (folder_id == "") {
          procList.push({
            ...data,
            link: response.link,
            content_type: response.content_type,
            document_name: response.file_name,
          });
        } else {
          procList.push({
            ...data,
            folder_id: folder_id,
            link: response.link,
            content_type: response.content_type,
            document_name: response.file_name,
          });
        }
        countUp++;
        if (countUp == len) {
          setNumExisting(countUp);
        }
        for (var i = 0; i < onGoing.length; i++) {
          if (onGoing[i] == response.file_name) {
            onGoing.splice(i, 1);
          }
        }
        setListData([...procList]);
        setListProgress([...onGoing]);
      })
      .catch((err) => {
        console.log(err);
        for (var i = 0; i < onGoing.length; i++) {
          if (onGoing[i] == response.file_name) {
            onGoing.splice(i, 1);
          }
        }
        setListProgress([...onGoing]);
      });
  };

  const processListFile = (files, no) => {
    var tmpName = files[no].path;
    var section = tmpName.split("/");
    if (section.length > 1) {
      var folderStack = [];
      for (var i = 0; i < section.length - 1; i++) {
        if (section[i] != "") {
          folderStack.push(section[i]);
        }
      }
      var stack = {
        folder_stack: folderStack,
        parent_id: data.folder_id,
        parent_tree: props.doc.folder,
        teams: props.doc.teams,
        users: props.doc.users,
      };
      saveMultiFolderUserApi(stack)
        .then((res) => {
          for (var i = 0; i < res.ids.length; i++) {
            var found = false;
            for (var j = 0; j < folderList.length; j++) {
              if (res.ids[i] == folderList[j].id) {
                found = true;
              }
            }
            if (!found) {
              folderList.push({ id: res.ids[i], name: res.names[i] });
            }
          }
          var pos = res.ids.length - 1;
          uploadFile(files[no], files.length, res.ids[pos]);
          no++;
          if (no < files.length) {
            processListFile(files, no);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      uploadFile(files[no], files.length);
      no++;
      if (no < files.length) {
        processListFile(files, no);
      }
    }
  };

  const uploadFileProccess = (files) => {
    localStorage.setItem(LOCAL_STORAGE_STOP_TIMEOUT, "1");
    if (files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        fileList.push(files[i].name);
      }
      onGoing = [...fileList];
      setListProgress([...fileList]);
    } else {
      setListProgress([]);
    }
    folderList = [];
    procList = [...listData];
    countUp = numExisting;
    if (files.length > 0) {
      processListFile(files, countUp);
      setListFolder(folderList);
      setListLoadFile([...fileList]);
    }
    localStorage.removeItem(LOCAL_STORAGE_STOP_TIMEOUT);
  };

  const deleteFileProcess = async (link, i) => {
    try {
      var response = await deleteFileApi(link);
      var pos = null;
      var load = [...listLoadFile];
      for (var j = 0; j < load.length; j++) {
        if (listData[i].document_name == load[j]) {
          pos = j;
        }
      }
      if (pos != null) {
        load.splice(pos, 1);
        setListLoadFile(load);
      }
      var list = [...listData];
      list.splice(i, 1);
      setListData(list);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (props.doc != null) {
      var fld = [];
      if (props.doc.folder != "") {
        var tmp = props.doc.folder.split("/");
        for (var i = 0; i < tmp.length; i++) {
          var tmp2 = tmp[i].split("|");
          fld.push(tmp2[0]);
        }
      }
      var path = fld.join("/");
      //path = path.replace(" ","_")
      setFolder(path);
      if (props.doc.id != null) {
        setData({
          id: props.doc.id,
          document_name: props.doc.document_name,
          folder_id: props.doc.folder_id,
          upload_date: props.doc.upload_date,
          link: props.doc.link,
        });
        //setListData([...listData, {id:props.doc.id,document_name:props.doc.document_name,folder_id:props.doc.folder_id,upload_date:props.doc.upload_date,link:props.doc.link}])
        //setUploadDate(Moment(props.doc.upload_date).format("LL"))
        setTitle({ formTitle: "Edit File Name", buttonTitle: "Save" });
      } else {
        setData({
          id: null,
          document_name: null,
          folder_id: props.doc.folder_id,
          upload_date: null,
          link: null,
        });
        //setListData([...listData, {id:null,document_name:null,folder_id:props.doc.folder_id,upload_date:null,link:null}])
        //setUploadDate(Moment().format("LL"))
        setTitle({ formTitle: "Add New File", buttonTitle: "Save" });
      }
    } else {
      setData({
        id: null,
        document_name: null,
        folder_id: null,
        upload_date: null,
        link: null,
      });
      setTitle({ formTitle: "Add New File", buttonTitle: "Save" });
    }
  }, [props.open]);

  function checkValidation(row) {
    var isValid = true;
    var eLink = "";
    if (row.link == "" || row.link == null) {
      isValid = false;
      eLink = "Please select file to share";
    }
    setErrorText({ ...errorText, link: eLink });
    return isValid;
  }

  function checkValidation2() {
    var isValid = true;
    var eName = "";
    if (data.document_name == "" || data.document_name == null) {
      isValid = false;
      eName = "File Name can not be empty";
    }
    setErrorText({ ...errorText, document_name: eName });
    return isValid;
  }

  const sendData = () => {
    countSend = 0;
    setLoading(true);
    listData?.map((row, key) => {
      if (checkValidation(row)) {
        saveFileUserApi(row)
          .then((res) => {
            //setData({id:null,document_name:null,folder_id:props.doc.folder_id,upload_date:null,link:null})
            countSend++;
            if (countSend == listData.length) {
              setListFolder([]);
              setListData([]);
              setLoading(false);
              props?.closeModal();
            }
          })
          .catch((err) => {
            console.log(err);
            //setErrorText(err)
          });
      }
    });
  };

  const sendData2 = () => {
    setLoading(true);
    if (checkValidation2()) {
      saveFileUserApi(data)
        .then((res) => {
          setData({
            id: null,
            document_name: null,
            folder_id: props.doc.folder_id,
            upload_date: null,
            link: null,
          });
          setLoading(false);
          props?.closeModal();
        })
        .catch((err) => {
          console.log(err);
          //setErrorText(err)
          setLoading(false);
        });
    }
  };

  const closeForm = () => {
    // countSend = 0
    // setData({id:null,document_name:null,folder_id:props.doc.folder_id,upload_date:null,link:null})
    // listFolder?.map((row,key) => {
    //     purgeFolderUserApi(row.id).then((res) => {

    //     }).catch((err) => {
    //         console.log(err)
    //     })
    // })
    // listData?.map((row,key) => {
    //     if (row.link != null) {
    //         deleteFileApi(row.link).then((response) => {
    //             countSend++
    //             if (countSend == listData.length) {
    //                 setListData([])
    //             }
    //         }).catch((err) => {
    //             console.log(err)
    //         })
    //     }
    // })
    props?.closeModal();
  };

  return (
    <Modal
      open={props?.open}
      onClose={closeForm}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box className="modal-wrapper" style={{ width: "1000px" }}>
        <Card className="modal">
          <Box className="modal-header">
            <h3>{title.formTitle}</h3>
          </Box>
          {data.id == null && (
            <Box className="modal-content">
              {listProgress.length == 0 && listData.length == 0 && (
                <Box className="mb-3">
                  <DropzoneArea
                    maxFileSize={10000000000}
                    showAlerts={["error"]}
                    filesLimit={1000}
                    showPreviewsInDropzone={false}
                    onChange={uploadFileProccess}
                  />
                </Box>
              )}
              <Box className="mb-3">
                <Paper component="ul" className={classes.paper}>
                  {listData?.map((row, key) => (
                    <li key={key}>
                      <Chip
                        label={row.document_name}
                        onDelete={() => deleteFileProcess(row.link, key)}
                        className={classes.chip}
                      />
                    </li>
                  ))}
                </Paper>
              </Box>
              <Box className="mb-3">
                {listProgress?.map((nama, key) => (
                  <Box className={classes.progress}>
                    <Typography>{nama}</Typography>
                    <LinearProgress />
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          {data.id != null && (
            <Box className="modal-content">
              <Box className="mb-3">
                <TextField
                  name="document_name"
                  label="File Name"
                  variant="outlined"
                  defaultValue={data.document_name}
                  required
                  error={errorText.document_name}
                  helperText={errorText.document_name}
                  onChange={onInputChange}
                  fullWidth
                />
              </Box>
            </Box>
          )}
          <Box className="modal-footer">
            {data.id == null && (
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                // onClick={sendData}
                disableElevation
              >
                {title.buttonTitle}
              </Button>
            )}
            {data.id != null && (
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                // onClick={sendData2}
                disableElevation
              >
                {title.buttonTitle}
              </Button>
            )}
          </Box>
        </Card>
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Modal>
  );
}
