import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import { useStyles } from "../dialogs/officeDetailDialog";
import { changeFieldName } from "../../service/changeFieldName";

export default function RoomsDetailDialog({ dialog, dialogOpen }) {
  const classes = useStyles();
  const { room } = dialog;
  const { unique_number } = room || {};

  const handleClose = () => {
    dialogOpen({ open: false });
  };

  return (
    <div>
      {dialog.open && (
        <Dialog
          maxWidth={"md"}
          open={dialog.open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Room details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              View information about '{unique_number}' room
            </DialogContentText>
            <div className={classes.root}>
              <Grid container spacing={3}>
                {Object.entries(room).map(([name, value], index) => (
                  <Grid item key={name} xs={6}>
                    <>
                      <b>{changeFieldName(name)}: </b>
                      {value.toString()}
                    </>
                  </Grid>
                ))}
              </Grid>
            </div>
          </DialogContent>
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
