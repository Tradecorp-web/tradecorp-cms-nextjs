import {
  Button,
  Card,
  Grid,
  Modal,
  Box,
  TextField,
  makeStyles,
  Backdrop,
  CircularProgress,
  MenuItem,
  Typography,
  IconButton,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState } from "react";

import { Delete, Add } from "@material-ui/icons";
import { v4 as uuid } from "uuid";
import Moment from "moment";
import AlertDialog from "../../../../components/base_component/dialog";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
}));

export default function SalesForm(props) {
  const classes = useStyles();

  function checkValidation() {
    var isValid = true;

    return isValid;
  }
  const [isLoading, setIsLoading] = useState(false);
  const [sumTotalPayment, setSumTotalPayment] = useState(0);
  const [data, setData] = useState({});
  const [dataSend, setDataSend] = useState({});
  const [openConfirmDlg, setOpenConfirmDlg] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [inputList, setInputList] = useState([
    {
      payment_id: null,
      percent: null,
      payment_number: null,
      payment_type: null,
      payment_detail_description: null,
      payment_term_type: null,
      payment_value: null,
    },
  ]);
  const sendData = () => {
    setFormMessage("data will be updated?");
    setDataSend(data);
    setOpenConfirmDlg(true);
    // closeForm();
  };

  const actSend = () => {
    props?.closeModal2(dataSend);
    setOpenConfirmDlg(false);
  };

  const closeForm = () => {
    props?.closeModal3();
  };

  const closeForm2 = () => {
    props?.closeModal3();
  };

  const clickAddRow = () => {
    setInputList([
      ...inputList,
      {
        percent: null,
        payment_id: null,
        payment_number: null,
        payment_type: null,
        payment_detail_description: null,
        payment_term_type: null,
        payment_value: null,
      },
    ]);
  };
  const clickRemoveRow = (i) => {
    var list = [...inputList];
    list.splice(i, 1);
    setInputList(list);
    setData(list);
  };

  const sumPaymentTotal = (list) => {
    var tmpTotal = 0;
    list.map((row) => {
      tmpTotal = tmpTotal + row?.payment_value;
    });
    setSumTotalPayment(tmpTotal);
  };
  const changePaymentMethod = (e, i) => {
    var list = [...inputList];
    list[i]["payment_id"] = uuid();
    list[i]["payment_number"] = i;
    if (e.target.name == "percent") {
      list[i]["payment_term_type"] = "payment term " + e.target.value + " %";
      list[i]["payment_value"] =
        (parseInt(e.target.value) / 100) * props.totalPayment;
      list[i]["payment_detail_description"] =
        "payment term #" + i + " with " + e.target.value + " %";
      list[i]["percent"] = e.target.value;
    } else {
      list[i][e.target.name] = e.target.value;
    }

    setInputList(list);
    setData(list);
  };
  return (
    <Modal
      open={props?.open}
      onClose={closeForm}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box className="modal-wrapper" style={{ width: "400px" }}>
        <Card className="modal">
          <Box className="modal-header">
            <h3>Set Up Payment</h3>
          </Box>
          <Box className="modal-content">
            <Box className="mb-3">
              <Grid
                container
                spacing={2}
                justify="center"
                alignItems="center"
                className={classes.root}
              >
                <Grid item xs={1} sm={1}>
                  <Typography variant="h4" style={{ textAlign: "center" }}>
                    No
                  </Typography>
                </Grid>
                <Grid item xs={5} sm={5}>
                  <Typography variant="h4" style={{ textAlign: "center" }}>
                    Payment Type
                  </Typography>
                </Grid>
                <Grid item xs={4} sm={4}>
                  <Typography variant="h4" style={{ textAlign: "center" }}>
                    Percent
                  </Typography>
                </Grid>
                <Grid item xs={2} sm={2}>
                  <Typography
                    variant="h4"
                    style={{ textAlign: "center" }}
                  ></Typography>
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3">
              <Grid
                container
                spacing={2}
                justify="center"
                alignItems="center"
                className={classes.root}
              >
                {inputList?.map((row, key) => (
                  <React.Fragment>
                    <Grid item xs={1} sm={1}>
                      <Typography variant="h4" style={{ textAlign: "center" }}>
                        {key + 1}
                      </Typography>
                    </Grid>
                    <Grid item xs={5} sm={5}>
                      <TextField
                        select
                        name="payment_type"
                        defaultValue={inputList[key].payment_type}
                        variant="outlined"
                        onChange={(e) => changePaymentMethod(e, key)}
                        fullWidth
                      >
                        <MenuItem value={"dp"}>Down Payment</MenuItem>
                        <MenuItem value={"payment"}>Payment</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={4} sm={4}>
                      <TextField
                        name="percent"
                        type="number"
                        defaultValue={inputList[key].percent}
                        variant="outlined"
                        onChange={(e) => changePaymentMethod(e, key)}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={2} sm={2}>
                      {key != 0 && (
                        <IconButton>
                          <Delete onClick={() => clickRemoveRow(key)} />
                        </IconButton>
                      )}
                    </Grid>
                  </React.Fragment>
                ))}
                <Grid item xs={1} sm={1}></Grid>
                <Grid item xs={4} sm={4} style={{ textAlign: "right" }}>
                  {/* Total */}
                </Grid>
                <Grid item xs={5} sm={5}>
                  <Typography variant="h4" style={{ textAlign: "right" }}>
                    {/* {sumTotalPayment} */}
                  </Typography>
                </Grid>
                <Grid item xs={2} sm={2}></Grid>
                <Grid item xs={12} sm={12}>
                  <Button variant="outlined" color="secondary">
                    <Add onClick={() => clickAddRow()} />
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box className="modal-footer">
            <Grid container>
              <Grid xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disableElevation
                  onClick={sendData}
                >
                  Set Payment
                </Button>
              </Grid>
              <Grid xs={6}>
                <Button
                  variant="contained"
                  color="secendary"
                  fullWidth
                  disableElevation
                  onClick={closeForm2}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Card>
        <AlertDialog
          open={openConfirmDlg}
          cancelAction={() => setOpenConfirmDlg(false)}
          okAction={() => actSend()}
          title="Payment confirmation"
          body={formMessage}
        />
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Modal>
  );
}
