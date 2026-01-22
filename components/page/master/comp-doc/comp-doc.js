import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, TextField, Grid, IconButton } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import {
  getDetailMasterCompletedDocumentNameApi,
  saveMasterComponentDocumentApi,
} from "../../../../services/api/master-completed-document.api";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function CompDoc(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [openSave, setOpenSave] = React.useState(false);
  const [data, setData] = React.useState("");
  const [dataSave, setDataSave] = React.useState({ id: null, nam: null });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    props.closeModal();
    setOpen(false);
  };
  const nameChange = (e) => {
    setData({ name: e.target.value });
  };
  const saveMaster = async () => {
    if (data.name != "") {
      var getName = await getDetailMasterCompletedDocumentNameApi(
        data.name
      ).then((res) => {
        if (res != null) {
          if (res.name.toLowerCase() != data.name.toLowerCase()) {
            saveMasterComponentDocumentApi(data).then((res) => {
              setDataSave({ id: res.id, name: res.name });
              setOpenSave(false);
              props.closeModal();
              setOpen(false);
            });
          } else {
            setOpenSave(true);
          }
        } else {
          saveMasterComponentDocumentApi(data).then((res) => {
            setDataSave({ id: res.id, name: res.name });
            setOpenSave(false);
            props.closeModal();
            setOpen(false);
          });
        }
      });
    }
  };
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Add master type document</h2>
      <Collapse in={openSave}>
        <Alert
          severity="warning"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenSave(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Data already exists...
        </Alert>
      </Collapse>
      <Grid container>
        <Grid item xs={12}>
          <TextField
            //  style={{ marginLeft: 10 }}
            variant="outlined"
            id="name"
            name="name"
            onChange={(e) => nameChange(e)}
            InputLabelProps={{ shrink: true }}
            //  inputProps={{ style: { textTransform: "uppercase" } }}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={6} style={{ textAlign: "left" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleClose()}
            style={{ marginTop: 10 }}
          >
            Close
          </Button>
        </Grid>
        <Grid item xs={6} style={{ textAlign: "right" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => saveMaster()}
            style={{ marginTop: 10 }}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </div>
  );

  return (
    <div>
      <button
        type="button"
        onClick={handleOpen}
        variant="outlined"
        style={{ marginLeft: 10 }}
        color="primary"
      >
        Add Document Type
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
