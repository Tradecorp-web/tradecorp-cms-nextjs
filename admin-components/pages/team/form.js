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

import {
  insertMasterDataApi,
  updateMasterDataApi,
} from "../../../services/api/master-data.api";

import {
  masterOfficeSwr,
  masterPermissionTempSwr,
} from "../../../services/swr/office.swr";
import { getListUserPosSwr } from "../../../services/swr/user-pos.swr";
import {
  masterDataCategory,
  masterDataSwr,
} from "../../../services/swr/master-data.swr";

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
  const [position, setPosition] = useState(null);
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
  const [disable, setDisable] = useState(false);

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
    //setRight(right.concat(leftChecked))
    setLeft(tmpLeft);
    setChecked(not(checked, leftChecked));
    setData({ ...data, permission: tmpLeft });
  };

  const handleAllRight = () => {
    //setRight(right.concat(left))
    setLeft([]);
    setData({ ...data, permission: [] });
  };

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const onInputChange = (event) => {
    if (event.target.name === "id") {
      setData({
        ...data,
        [event.target.name]: Number(event.target.value),
        ["category"]: "team",
      });
    } else {
      setData({
        ...data,
        [event.target.name]: event.target.value,
      });
    }
  };

  var officeSwr = masterOfficeSwr();
  var teamSwr = masterDataSwr(masterDataCategory.team);
  var templateSwr = masterPermissionTempSwr();
  var userPosSwr = getListUserPosSwr();

  useEffect(() => {
    if (props.user != null) {
      setData({
        id: props.user.id,
        name: props.user.name,
      });
      setDisable(true);

      setTitle({ formTitle: "Edit Team", buttonTitle: "Save Team" });
    } else {
      setData({
        id: null,
        name: null,
      });
      setDisable(false);
      setTitle({ formTitle: "Add Team", buttonTitle: "Add Team" });
    }
  }, [props.open]);

  function checkValidation() {
    var isValid = true;
    var eId = "";
    var eName = "";
    if (data.id == "" || data.id == null) {
      isValid = false;
      eId = "ID can not be empty";
    }
    if (data.name == "" || data.name == null) {
      isValid = false;
      eName = "Name can not be empty";
    }

    setErrorText({
      ...errorText,
      id: eId,
      name: eName,
    });
    return isValid;
  }

  const sendData = () => {
    if (checkValidation()) {
      setLoading(true);

      if (props.user === null) {
        insertMasterDataApi(data)
          .then((res) => {
            setData({
              id: null,
              name: null,
              category: null,
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
        updateMasterDataApi(data, data.id)
          .then((res) => {
            setData({
              id: null,
              name: null,
              category: null,
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
      name: null,
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
                InputProps={{
                  readOnly: disable,
                }}
                name="id"
                label="ID"
                variant="outlined"
                defaultValue={data.id}
                required
                error={errorText.id}
                helperText={errorText.id}
                onChange={onInputChange}
                fullWidth
              />
            </Box>
          </Box>
          <Box className="modal-content">
            <Box className="mb-3">
              <TextField
                name="name"
                label="Name"
                variant="outlined"
                defaultValue={data.name}
                required
                error={errorText.name}
                helperText={errorText.name}
                onChange={onInputChange}
                fullWidth
              />
            </Box>
          </Box>
          <Box className="modal-content">
            <Box className="mb-3">
              <TextField
                name="category"
                label="Category"
                variant="outlined"
                defaultValue="team"
                value="team"
                required
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
