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
  insertCompanyTypeApi,
  updateCompanyTypeApi,
} from "../../../services/api/company-type.api";

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

export default function UserForm(props) {
  const classes = useStyles();

  const [errorText, setErrorText] = useState({
    position: null,
  });
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState({
    id: null,
    name: null,
    company_type: null,
  });

  const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" });
  const [disable, setDisable] = useState(false);

  const onInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (props.companyType != null) {
      setData({
        id: props.companyType.id,
        name: props.companyType.name,
        company_type: props.companyType.companyType,
      });
      setDisable(true);

      setTitle({
        formTitle: "Edit Company Type",
        buttonTitle: "Save Company Type",
      });
    } else {
      setData({
        id: null,
        name: null,
        company_type: null,
      });
      setDisable(false);
      setTitle({
        formTitle: "Add Company Type",
        buttonTitle: "Add Company Type",
      });
    }
  }, [props.open]);

  function checkValidation() {
    var isValid = true;
    var eName = "";
    var eCompanyType = "";

    if (data.name == "" || data.name == null) {
      isValid = false;
      eName = "Name can not be empty";
    }
    if (data.company_type == "" || data.company_type == null) {
      isValid = false;
      eName = "Company Type can not be empty";
    }

    setErrorText({
      ...errorText,
      name: eName,
      company_type: eCompanyType,
    });
    return isValid;
  }

  const sendData = () => {
    if (checkValidation()) {
      setLoading(true);
      if (props.companyType === null) {
        insertCompanyTypeApi(data)
          .then((res) => {
            setData({
              id: null,
              name: null,
              company_type: null,
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
        updateCompanyTypeApi(data, data.id)
          .then((res) => {
            setData({
              id: null,
              name: null,
              company_type: null,
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
                name="company_type"
                label="Company Type"
                variant="outlined"
                inputProps={{ style: { textTransform: "uppercase" } }}
                defaultValue={data.company_type}
                required
                error={errorText.company_type}
                helperText={errorText.company_type}
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
                inputProps={{ style: { textTransform: "uppercase" } }}
                defaultValue={data.name}
                required
                error={errorText.name}
                helperText={errorText.name}
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
