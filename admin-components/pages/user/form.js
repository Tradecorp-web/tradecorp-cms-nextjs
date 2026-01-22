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
import { saveUserApi } from "../../../services/api/user.api";
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
    username: null,
    password: null,
    name: null,
    position: null,
    email: null,
    office: null,
    team: null,
  });
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState({
    id: null,
    username: null,
    password: null,
    name: null,
    position: null,
    email: null,
    office: null,
    team: null,
    permission: [],
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

  const changeTemplate = (event) => {
    setTemplate(event.target.value);
    if (event.target.value != null) {
      templateList?.map((row) => {
        if (row.id == event.target.value) {
          setRight(row.permissions_list);
        }
      });
    } else {
      setRight([]);
    }
  };

  const onInputChange = (event) => {
    setData({
      ...data,
      office: office,
      team: team,
      [event.target.name]: event.target.value,
    });
  };

  const onOfficeChange = (event) => {
    setOffice(event.target.value);
    setData({ ...data, office: event.target.value });
  };
  const onPositionChange = (event) => {
    setPosition(event.target.value);
    setData({ ...data, position: event.target.value });
  };

  const onTeamChange = (event) => {
    setTeam(event.target.value);
    setData({ ...data, team: event.target.value });
  };

  var officeSwr = masterOfficeSwr();
  var teamSwr = masterDataSwr(masterDataCategory.team);
  var templateSwr = masterPermissionTempSwr();
  var userPosSwr = getListUserPosSwr();

  useEffect(() => {
    if (officeSwr?.data) {
      setOfficeList(officeSwr?.data?.result ?? []);
    }
  }, [officeSwr]);

  useEffect(() => {
    if (teamSwr?.data) {
      var tm = teamSwr.data;
      var pos = tm.length - 1;
      if (tm[pos].id == 8999) {
        tm.pop();
      }
      setTeamList(tm);
    }
  }, [teamSwr]);

  useEffect(() => {
    if (templateSwr?.data) {
      setTemplateList(templateSwr?.data?.result ?? []);
    }
  }, [templateSwr]);
  useEffect(() => {
    if (userPosSwr?.data) {
      setUserPosList(userPosSwr?.data?.result ?? []);
    }
  });

  useEffect(() => {
    if (props.user != null) {
      setData({
        id: props.user.id,
        username: props.user.username,
        password: null,
        name: props.user.name,
        position: props.user.position,
        email: props.user.email,
        office: props.user.office,
        team: props.user.team,
        permission: props.user.permission,
      });
      setPosition(props.user.position);
      setOffice(props.user.office);
      setTeam(props.user.team);
      setTemplate("");
      setLeft(props.user.permission);
      setRight([]);
      setTitle({ formTitle: "Edit User", buttonTitle: "Save User" });
    } else {
      setData({
        id: null,
        username: null,
        password: null,
        name: null,
        position: null,
        email: null,
        office: null,
        team: null,
        permission: [],
      });
      setOffice(null);
      setTeam(null);
      setTemplate("");
      setLeft([]);
      setRight([]);
      setTitle({ formTitle: "Add User", buttonTitle: "Add User" });
    }
  }, [props.open]);

  function checkValidation() {
    var isValid = true;
    var eUsername = "",
      ePassword = "",
      eName = "",
      ePosition = "",
      eEmail = "",
      eOffice = "",
      eTeam = "";
    if (data.username == "" || data.username == null) {
      isValid = false;
      eUsername = "User Name can not be empty";
    }
    // if(data.password == "" || data.password == null) {
    //     isValid = false
    //     ePassword = "Password can not be empty"
    // }
    if (data.name == "" || data.name == null) {
      isValid = false;
      eName = "Full Name can not be empty";
    }
    // if(data.position == "" || data.position == null) {
    //     isValid = false
    //     ePosition = "Job Position can not be empty"
    // }
    // if(data.email == "" || data.email == null) {
    //     isValid = false
    //     eEmail = "E-Mail can not be empty"
    // }
    // if(data.office == "" || data.office == null) {
    //     isValid = false
    //     eOffice = "Please select Office"
    // }
    // if(data.team == "" || data.team == null) {
    //     isValid = false
    //     eTeam = "Please select Team"
    // }
    setErrorText({
      ...errorText,
      username: eUsername,
      password: ePassword,
      name: eName,
      position: ePosition,
      email: eEmail,
      office: eOffice,
      team: eTeam,
    });
    return isValid;
  }

  const sendData = () => {
    if (checkValidation()) {
      setLoading(true);
      saveUserApi(data)
        .then((res) => {
          setData({
            id: null,
            username: null,
            password: null,
            name: null,
            position: null,
            email: null,
            office: null,
            team: null,
            permission: [],
          });
          setOffice(null);
          setTeam(null);
          setTemplate("");
          setLeft([]);
          setRight([]);
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
    setData({
      id: null,
      username: null,
      password: null,
      name: null,
      position: null,
      email: null,
      office: null,
      team: null,
      permission: [],
    });
    setOffice(null);
    setTeam(null);
    setTemplate("");
    setLeft([]);
    setRight([]);
    console.log("tutup");
    props?.closeModal();
  };

  const customList = (items) => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        {items?.map((value) => {
          const labelId = `transfer-list-item-${value?.id}-label`;
          return (
            <ListItem
              key={value?.id}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value?.name}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

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
            <h2 className="mb-3">Details</h2>
            <Box className="mb-3">
              <TextField
                name="username"
                label="User Name"
                variant="outlined"
                defaultValue={data.username}
                required
                error={errorText.username? true : false}
                helperText={errorText.username}
                onChange={onInputChange}
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                error={errorText.password? true : false}
                helperText={errorText.password}
                onChange={onInputChange}
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                name="name"
                label="Full Name"
                variant="outlined"
                defaultValue={data.name}
                required
                error={errorText.name? true : false}
                helperText={errorText.name}
                onChange={onInputChange}
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                name="position"
                select
                label="Job Position"
                variant="outlined"
                value={position}
                error={errorText.position? true : false}
                helperText={errorText.position}
                onChange={onPositionChange}
                fullWidth
              >
                <MenuItem value={null}>
                  <em>None</em>
                </MenuItem>
                {userPosList?.map((row, key) => {
                  return <MenuItem value={row.id}>{row?.position}</MenuItem>;
                })}
              </TextField>
              {/* <TextField
                name="position"
                label="Job Position"
                variant="outlined"
                defaultValue={data.position}
                error={errorText.position}
                helperText={errorText.position}
                onChange={onInputChange}
                fullWidth
              /> */}
            </Box>
            <Box className="mb-3">
              <TextField
                name="email"
                label="E-mail"
                variant="outlined"
                defaultValue={data.email}
                error={errorText.email? true : false}
                helperText={errorText.email}
                onChange={onInputChange}
                fullWidth
              />
            </Box>
            <Box className="mb-3">
              <TextField
                name="office"
                select
                label="Office"
                variant="outlined"
                value={office}
                error={errorText.office? true : false}
                helperText={errorText.office}
                onChange={onOfficeChange}
                fullWidth
              >
                <MenuItem value={null}>
                  <em>None</em>
                </MenuItem>
                {officeList?.map((row, key) => {
                  return <MenuItem value={row.id}>{row?.office_name}</MenuItem>;
                })}
              </TextField>
            </Box>
            <Box className="mb-3">
              <TextField
                name="team"
                select
                label="Team"
                variant="outlined"
                value={team}
                error={errorText.team? true : false}
                helperText={errorText.team}
                onChange={onTeamChange}
                fullWidth
              >
                <MenuItem value={null}>
                  <em>None</em>
                </MenuItem>
                {teamList?.map((row, key) => {
                  return <MenuItem value={row.id}>{row?.name}</MenuItem>;
                })}
              </TextField>
            </Box>
            <h2 className="mb-3 mt-5">Access Permission</h2>
            <Box className="mb-3">
              <Grid
                container
                spacing={2}
                justify="center"
                alignItems="center"
                className={classes.root}
              >
                <Grid item xs={5} sm={5}>
                  <Typography variant="h4">User's Permission List</Typography>
                </Grid>
                <Grid item xs={2} sm={2}></Grid>
                <Grid item xs={5} sm={5}>
                  <TextField
                    id="template"
                    select
                    label="Template"
                    variant="outlined"
                    value={template}
                    error={false}
                    helperText=""
                    onChange={changeTemplate}
                    fullWidth
                  >
                    <MenuItem value={null}>
                      <em>None</em>
                    </MenuItem>
                    {templateList?.map((row, key) => {
                      return <MenuItem value={row.id}>{row?.name}</MenuItem>;
                    })}
                  </TextField>
                </Grid>
                <Grid item xs={5} sm={5}>
                  {customList(left)}
                </Grid>
                <Grid item xs={2} sm={2}>
                  <Grid container direction="column" alignItems="center">
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={handleAllLeft}
                      disabled={right.length === 0}
                      aria-label="move all left"
                    >
                      ≪
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={handleCheckedLeft}
                      disabled={rightChecked.length === 0}
                      aria-label="move selected left"
                    >
                      &lt;
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={handleCheckedRight}
                      disabled={leftChecked.length === 0}
                      aria-label="move selected right"
                    >
                      &gt;
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={handleAllRight}
                      disabled={left.length === 0}
                      aria-label="move all right"
                    >
                      ≫
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={5} sm={5}>
                  {customList(right)}
                </Grid>
              </Grid>
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
