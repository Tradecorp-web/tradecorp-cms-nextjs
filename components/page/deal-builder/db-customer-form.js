import {
  Card,
  Modal,
  Typography,
  Box,
  TextField,
  makeStyles,
  Backdrop,
  CircularProgress,
  InputBase,
  InputLabel,
} from "@material-ui/core";
import AlertDialog from "../../base_component/dialog";
import React, { useEffect, useState } from "react";

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

export default function InvoiceForm(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const classes = useStyles();

  const [isLoading, setLoading] = useState(false);

  const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" });

  let param = { limit: 999 };

  useEffect(() => {
    setTitle({ formTitle: "Customer Detail", buttonTitle: "Create" });
  }, [props.open]);

  const closeForm = () => {
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
          <Box className="modal-content">
            <h2 className="mb-3">Details</h2>

            <Box className="mb-3">
              <InputLabel className="pb-1">
                <Typography variant="caption">Customer Detail</Typography>
              </InputLabel>
            </Box>
          </Box>

          <AlertDialog
            open={openDialog}
            cancelAction={() => setOpenDialog(false)}
            okAction={() => sendDataNext()}
            title="Send data confirmation"
            body="Are you sure want to send this record?"
          />
        </Card>
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Modal>
  );
}
