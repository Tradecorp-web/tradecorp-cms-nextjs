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
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { saveUserApi } from "../../../../services/api/user.api";
import {
  updateUserPosApi,
  insertUserPosApi,
} from "../../../../services/api/user-pos.api";
import {
  updateMasterProjectApi,
  insertMasterProjectApi,
} from "../../../../services/api/master-project.api";

import {
  masterOfficeSwr,
  masterPermissionTempSwr,
} from "../../../../services/swr/office.swr";
import { getListUserPosSwr } from "../../../../services/swr/user-pos.swr";
import {
  masterDataCategory,
  masterDataSwr,
} from "../../../../services/swr/master-data.swr";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  paper: {
    width: 250,
    height: 300,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function not(a, b) {
  return a.filter((value) => b.findIndex((o) => o.id == value.id) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.findIndex((o) => o.id == value.id) !== -1);
}

export default function UserForm(props) {
  const classes = useStyles();

  const [officeList, setOfficeList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [templateList, setTemplateList] = useState([]);
  const [template, setTemplate] = useState("");
  const [userPosList, setUserPosList] = useState([]);

  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  const [office, setOffice] = useState(null);
  const [masterProject, setMasterProject] = useState(null);
  const [team, setTeam] = useState(null);

  const [errorText, setErrorText] = useState({
    position: null,
  });
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState({
    id: null,
    position: null,
  });

  const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" });

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleAllLeft = () => {
    let tmpLeft = left.concat(not(right, left));
    setLeft(tmpLeft);
    //setLeft(left.concat(right))
    //setRight([])
    setData({ ...data, permission: tmpLeft });
  };

  const handleCheckedLeft = () => {
    let tmpLeft = left.concat(not(rightChecked, left));
    setLeft(tmpLeft);
    //setLeft(left.concat(rightChecked))
    //setRight(not(right, rightChecked))
    setChecked(not(checked, rightChecked));
    setData({ ...data, permission: tmpLeft });
  };

  const handleCheckedRight = () => {
    let tmpLeft = not(left, leftChecked);
    setLeft(tmpLeft);
    setChecked(not(checked, leftChecked));
    setData({ ...data, permission: tmpLeft });
  };

  const handleAllRight = () => {
    setLeft([]);
    setData({ ...data, permission: [] });
  };

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const onInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  var officeSwr = masterOfficeSwr();
  var teamSwr = masterDataSwr(masterDataCategory.team);
  var templateSwr = masterPermissionTempSwr();
  var userPosSwr = getListUserPosSwr();

  useEffect(() => {
    if (props.master != null) {
      setData({
        id: props.master.id,
        project_code: props.master.project_code,
        project_name: props.master.project_name,
      });
      setTitle({ formTitle: "Edit Master", buttonTitle: "Save Master" });
    } else {
      setData({
        id: null,
        project_code: null,
        project_name: null,
      });

      setTitle({ formTitle: "Add Master", buttonTitle: "Add Master" });
    }
  }, [props.open]);

  function checkValidation() {
    var isValid = true;
    var eProjectCode = "";
    if (data.project_code == "" || data.project_code == null) {
      isValid = false;
      eProjectCode = "Project code can not be empty";
    }
    var eProjectName = "";
    if (data.project_name == "" || data.project_name == null) {
      isValid = false;
      eProjectName = "Project name can not be empty";
    }

    setErrorText({
      ...errorText,
      project_code: eProjectCode,
      project_name: eProjectName,
    });
    return isValid;
  }

  const sendData = () => {
    if (checkValidation()) {
      setLoading(true);
      if (data.id === null) {
        insertMasterProjectApi(data)
          .then((res) => {
            setData({
              id: null,
              project_code: null,
              project_name: null,
            });
            setLoading(false);
            props?.closeModal();
          })
          .catch((err) => {
            console.log(err);
            //setErrorText(err)
            setLoading(false);
          });
      } else {
        updateMasterProjectApi(data, data.id)
          .then((res) => {
            setData({
              project_code: null,
              project_name: null,
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
    }
  };

  const closeForm = () => {
    setData({
      id: null,
      position: null,
    });
    console.log("tutup");
    props?.closeModal();
  };

  return (
    <Modal
      open={props?.open}
      onClose={closeForm}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box className="modal-wrapper" style={{ width: "700px" }}>
        <Card className="modal">
          <Box className="modal-header">
            <h3>{title.formTitle}</h3>
          </Box>
          <Box className="modal-content">
            <Box className="mb-3">
              <TextField
                name="project_code"
                label="Project Code"
                variant="outlined"
                defaultValue={data.project_code}
                required
                error={errorText.project_code}
                helperText={errorText.project_code}
                onChange={onInputChange}
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                name="project_name"
                label="Project Name"
                variant="outlined"
                defaultValue={data.project_name}
                required
                error={errorText.project_name}
                helperText={errorText.project_name}
                onChange={onInputChange}
                fullWidth
              />
            </Box>
          </Box>
          <Box className="modal-footer">
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={sendData}
              disableElevation
            >
              {title.buttonTitle}
            </Button>
          </Box>
        </Card>
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Modal>
  );
}
