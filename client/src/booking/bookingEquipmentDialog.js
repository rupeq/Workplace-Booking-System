import React, { useCallback } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default function BookingEquipmentDetailDialog({ dialog, dialogOpen }) {
  const { booking } = dialog;
  const {
    monitor,
    headphones,
    laptop,
    keyboard,
    username
  } = booking || {};

  const handleClose = useCallback(() => {
    dialogOpen({ open: false });
  }, [dialogOpen]);

  return (
    <div>
      {dialog.open && (
        <Dialog
          fullWidth
          maxWidth="sm"
          open={dialog.open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Booking equipment details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              View '{username}' booking equipment
            </DialogContentText>
          </DialogContent>
          <div style={{margin: "20px"}}>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={monitor}
                    color="default"
                  />
                }
                label="Monitor"
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={keyboard}
                    color="default"
                  />
                }
                label="Keyboard"
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={laptop}
                    color="default"
                  />
                }
                label="Laptop"
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={headphones}
                    color="default"
                  />
                }
                label="Headphones"
              />
            </div>
          </div>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
