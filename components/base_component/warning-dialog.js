import React from "react";
import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Divider,
} from "@material-ui/core";

export default function WarningDialog(props) {
  return (
    <Dialog
      open={props.open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className="p-3">
        <Typography style={{ fontWeight: 700, fontSize: 18 }}>
          {props.title}
        </Typography>
      </DialogTitle>
      <DialogContent className="p-3">
        <DialogContentText id="alert-dialog-description">
          {props.body}
        </DialogContentText>
      </DialogContent>
      <Divider />
      <DialogActions className="p-3">
        <Button
          onClick={() => props.cancelAction()}
          color="primary"
          size="small"
          variant="contained"
          disableElevation
          autoFocus
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
