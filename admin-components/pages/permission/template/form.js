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
  import { getListPermission, savePermissionTemplateApi } from "../../../../services/api/office.api";
  
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
  
  export default function TemplateForm(props) {
    const classes = useStyles();

    const [permission, setPermission] = useState([]);
  
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
  
    const [errorText, setErrorText] = useState({name: null});
    const [isLoading, setLoading] = useState(false);
  
    const [data, setData] = useState({id: null, name: null, permissions: []});
  
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
      setLeft(left.concat(right))
      setRight([])
      setData({ ...data, permissions: extractID(tmpLeft) });
    };
  
    const handleCheckedLeft = () => {
      let tmpLeft = left.concat(not(rightChecked, left));
      setLeft(tmpLeft);
      setLeft(left.concat(rightChecked))
      setRight(not(right, rightChecked))
      setChecked(not(checked, rightChecked));
      setData({ ...data, permissions: extractID(tmpLeft) });
    };
  
    const handleCheckedRight = () => {
      let tmpLeft = not(left, leftChecked);
      setRight(right.concat(leftChecked))
      setLeft(tmpLeft);
      setChecked(not(checked, leftChecked));
      setData({ ...data, permissions: extractID(tmpLeft) });
    };
  
    const handleAllRight = () => {
      setRight(right.concat(left))
      setLeft([]);
      setData({ ...data, permissions: [] });
    };
  
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);
  
    const onInputChange = (event) => {
      setData({...data, [event.target.name]: event.target.value});
    };

    useEffect(async () => {
        var res = await getListPermission();
        setPermission([...res]);
        setRight([...res]);
    }, []);

    useEffect(async () => {
        if (props.data != null) {
            setData({id: props.data.id, name: props.data.name, permissions: props.data.permissions});
            var tmpLeft = [];
            props.data.permissions?.map((val,i) => {
                permission.map((item,j) => {
                    if (val == item.id) {
                        tmpLeft.push(item);
                    }
                });
            });
            setLeft(tmpLeft);
            setRight(not(permission, tmpLeft));
            setTitle({ formTitle: "Edit Permission Template", buttonTitle: "Save Template" });
        } else {
            setData({id: null, name: null, permissions: []});
            setLeft([]);
            setRight([...permission]);
            setTitle({ formTitle: "Add Permission Template", buttonTitle: "Create Template" });
        }
    }, [props.open]);
  
    function checkValidation() {
      var isValid = true;
      var eName = "";
      if (data.name == "" || data.name == null) {
        isValid = false;
        eName = "Template Name can not be empty";
      }
      setErrorText({...errorText, name: eName});
      return isValid;
    }
  
    const sendData = () => {
      if (checkValidation()) {
        setLoading(true);
        savePermissionTemplateApi(data).then((res) => {
            setData({id: null, name: null, permissions: []});
            setLeft([]);
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

    function extractID(list) {
        var ids = [];
        list.map((item, i) => {
            ids.push(item.id);
        })
        return ids;
    }
  
    const closeForm = () => {
        setData({id: null, name: null, permissions: []});
        setLeft([]);
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
                  name="name"
                  label="Template Name"
                  variant="outlined"
                  defaultValue={data.name}
                  required
                  error={errorText.name? true : false}
                  helperText={errorText.name}
                  onChange={onInputChange}
                  fullWidth
                />
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
                    <Typography variant="h4">Template's Permission List</Typography>
                  </Grid>
                  <Grid item xs={2} sm={2}></Grid>
                  <Grid item xs={5} sm={5}>
                    <Typography variant="h4">Permission List</Typography>
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
  