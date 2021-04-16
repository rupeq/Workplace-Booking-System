import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import UniverseSelect from "../select/universeSelect";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import React from "react";

export default function ChangeDialog({
  open,
  handleClose,
  state,
  onChange,
  choices,
  updateState,
  name,
}) {
  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Change state</DialogTitle>
      <DialogContent>
        <DialogContentText>Change {name} state</DialogContentText>
        <UniverseSelect
          state={state}
          changeState={onChange}
          choices={choices}
          title="State"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={updateState} color="primary">
          Change state
        </Button>
      </DialogActions>
    </Dialog>
  );
}
