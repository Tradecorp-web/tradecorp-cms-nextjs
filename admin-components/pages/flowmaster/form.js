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
  FormControlLabel,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { getListUserPosSwr } from "../../../services/swr/user-pos.swr";
import {
  updateFlowStatusApi,
  insertFlowStatusApi,
} from "../../../services/api/ref-flow-status.api";

import {
  masterDataCategory,
  masterDataSwr,
} from "../../../services/swr/master-data.swr";

import {
  masterPermissionSwr,
  getIdModulSwr,
} from "../../../services/swr/master-permission.swr";

//==new

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
  const router = useRouter();
  const classes = useStyles();
  const modul = router.query.modul;
  const [officeList, setOfficeList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [templateList, setTemplateList] = useState([]);
  const [template, setTemplate] = useState("");
  const [userPosList, setUserPosList] = useState([]);
  const [userPermissionList, setUserPermissionList] = useState([]);
  const [idModule, setIdModule] = useState("");
  // const [modul, setModul] = useState("");

  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  const [office, setOffice] = useState(null);
  const [position, setPosition] = useState(null);
  const [team, setTeam] = useState(null);
  const [finalCheck, setFinalCheck] = useState(false);

  const [errorText, setErrorText] = useState({
    position: null,
  });
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState({
    id: null,
    position: null,
  });

  const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" });

  const onInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };
  const onInputNumChange = (event) => {
    setData({
      ...data,
      [event.target.name]: Number(event.target.value),
    });
  };
  const handleChange = (event) => {
    setFinalCheck(event.target.checked);
    if (event.target.checked === true) {
      setData({
        ...data,
        [event.target.name]: true,
      });
    } else {
      setData({
        ...data,
        [event.target.name]: false,
      });
    }
  };

  var idModulSwr = getIdModulSwr(modul);
  var userPosSwr = getListUserPosSwr();
  var teamSwr = masterDataSwr("team", "name");
  var refPermissionSwr = masterPermissionSwr();

  useEffect(() => {
    setTeamList(teamSwr);
  }, [teamSwr]);
  useEffect(() => {
    setIdModule(idModulSwr);
  }, [idModulSwr]);

  useEffect(() => {
    setUserPosList(userPosSwr);
  }, [userPosSwr]);

  useEffect(() => {
    setUserPermissionList(refPermissionSwr);
  }, [refPermissionSwr]);

  useEffect(() => {
    if (props.user != null) {
      setData({
        id: props.user.id,
        modul_id: idModule?.data?.id,
        acive: true,
        position_id: props.user.position_id,
        team_id: props.user.team_id,
        status: props.user.status,
        final: props.user.final,
      });
      if (props.user.final) {
        setFinalCheck(true);
      } else {
        setFinalCheck(false);
      }
      setPosition(props.user.position);

      setTitle({
        formTitle: "Edit Flow Master",
        buttonTitle: "Save Flow Master",
      });
    } else {
      setData({
        id: null,
        modul_id: idModule?.data?.id,
        active: true,
        position_id: null,
        team_id: null,
        status: null,
        final: false,
      });

      setTitle({
        formTitle: "Add Flow Master",
        buttonTitle: "Add Flow Master",
      });
    }
  }, [props.open]);

  function checkValidation() {
    var isValid = true;
    var ePositionId = "";
    var eTeamId = "";

    if (data.position_id == "" || data.position_id == null) {
      isValid = false;
      ePositionId = "Position  can not be empty";
    }
    if (data.team_id == "" || data.team_id == null) {
      isValid = false;
      eTeamId = "Team can not be empty";
    }

    setErrorText({
      ...errorText,
      position_id: ePositionId,
      team_id: eTeamId,
    });
    return isValid;
  }

  const sendData = () => {
    if (checkValidation()) {
      setLoading(true);

      if (data.id === null) {
        insertFlowStatusApi(data)
          .then((res) => {
            setData({
              id: null,
              modul_id: idModule?.data?.id,
              active: true,
              position_id: null,
              team_id: null,
              status: null,
              final: false,
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
        updateFlowStatusApi(data, data.id)
          .then((res) => {
            setData({
              id: null,
              modul_id: idModule?.data?.id,
              active: true,
              position_id: null,
              team_id: null,
              status: null,
              final: false,
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
      modul_id: idModule?.data?.id,
      active: true,
      position_id: null,
      team_id: null,
      status: null,
      final: false,
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
                name="position_id"
                select
                label="Position"
                variant="outlined"
                defaultValue={data.position_id}
                error={errorText.position_id}
                helperText={errorText.position_id}
                onChange={onInputChange}
                fullWidth
              >
                {userPosList?.data?.result?.map((row, key) => {
                  return <MenuItem value={row.id}>{row?.position}</MenuItem>;
                })}
              </TextField>
            </Box>
            <Box className="mb-3">
              <TextField
                name="status"
                select
                label="Status"
                variant="outlined"
                defaultValue={data.status}
                error={errorText.status}
                helperText={errorText.status}
                onChange={onInputNumChange}
                fullWidth
              >
                {[...Array(10)].map((e, i) => {
                  return <MenuItem value={i}>{i}</MenuItem>;
                })}
              </TextField>
            </Box>
            <Box className="mb-3">
              <TextField
                name="team_id"
                select
                label="Team"
                variant="outlined"
                defaultValue={data.team_id}
                error={errorText.team_id}
                helperText={errorText.team_id}
                onChange={onInputNumChange}
                fullWidth
              >
                {teamList?.data?.map((row, key) => {
                  if (row.id != 8999)
                    return <MenuItem value={row.id}>{row?.name}</MenuItem>;
                })}
              </TextField>
            </Box>
            <Box className="mb-3">
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={finalCheck}
                    onChange={handleChange}
                    name="final"
                    color="primary"
                  />
                }
                label="Final"
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
