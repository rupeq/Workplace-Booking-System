import React, {useContext, useCallback, useState} from "react";
import { AppContext } from "./bookingView";
import { APIService } from "../service/APIService";
import { useHistory } from "react-router";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {fieldValidation} from "../office_building/workplaces/workplaceDetail";
import {ValidationService} from "../service/ValidationService";
import ValidationError from "../errors/ValidationError";

export default function ConfirmBookingDelete({ state, setOpen }) {
  const { open, bookingId } = state;
  const [reason, setReason] = useState("");
  const { alert } = useContext(AppContext);
  const history = useHistory();

  const handleClose = useCallback(() => {
    setOpen({ open: false });
  }, [setOpen]);

  const inputFieldValidation = () => {
    let valid = true;

    try {
          ValidationService.validateReason(reason);
    } catch (e) {
        if (e instanceof ValidationError) {
            alert.openSnackbar({
                open: true,
                message: e.message,
                type: "error",
            });
            valid = false;
        }
    }

    return valid;
  };

  const handleDelete = async () => {
    if (inputFieldValidation()) {
      await APIService.deleteBooking(bookingId, {reason: reason}).then((response) => {
        if (response === "") {
          alert.openSnackbar({
            open: true,
            message: "Deleted!",
            type: "success",
          });
        } else {
          alert.openSnackbar({
            open: true,
            message: "Don't execute booking deleting",
            type: "error",
          });
        }
        handleClose();
        history.push("/");
      });
    }
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="form-dialog-title">Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you agree to delete this booking?
          </DialogContentText>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Reason"
            variant="outlined"
            value={reason}
            error={fieldValidation(reason, ValidationService.validateReason)}
            onChange={(event) => setReason(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
