import {
  Button,
  Card,
  Modal,
  Box,
  TextField,
  makeStyles,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {saveCustomerReferenceApi} from "../../../services/api/customer-reference.api";

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


export default function CustomerReferenceForm(props) {
  const classes = useStyles();
  const [errorText, setErrorText] = useState({
    company_name: null,
  });
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState({
    id: null,
    company_name: null,
  });

  const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" });

  const onInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value.toUpperCase(),
    });
  };

  useEffect(() => {
    if (props.customerReference != null) {
      setData({
        id: props.customerReference.id,
        company_name: props.customerReference.company_name,
      });
      setTitle({ formTitle: "Edit Customer Reference", buttonTitle: "Save Customer Reference" });
    } else {
      setData({
        id: null,
        company_name: null,
      });
      setTitle({ formTitle: "Add Customer Reference", buttonTitle: "Add Customer Reference" });
    }
  }, [props.open]);

  function checkValidation() {
    let isValid = true;
    let eCompanyName = "";
    if (data.company_name === "" || data.company_name == null) {
      isValid = false;
      eCompanyName = "Company Name can not be empty";
    }
    setErrorText({
      ...errorText,
      company_name: eCompanyName,
    });
    return isValid;
  }

  const sendData = () => {
    if (checkValidation()) {
      setLoading(true);
      saveCustomerReferenceApi(data)
        .then((res) => {
          setData({
            id: null,
            company_name: null,
          });
          setLoading(false);
          props?.closeModal();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const closeForm = () => {
    setData({
      id: null,
      company_name: null,
    });
    setLoading(true);
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
            <h2 className="mb-3">Details</h2>
            <Box className="mb-3">
              <TextField
                name="company_name"
                inputProps={{ style: { textTransform: "uppercase" } }}
                label="Company Name"
                variant="outlined"
                defaultValue={data.company_name}
                required
                error={!!errorText.company_name}
                helperText={errorText.company_name}
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
