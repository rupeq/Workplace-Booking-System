import React, { useCallback } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { changeFieldName } from "../../service/changeFieldName";

export const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& p": {
      margin: "0px",
    },
  },
}));

export default function OfficeDetailDialog({ dialog, dialogOpen }) {
  const classes = useStyles();
  const { office } = dialog;
  const {
    name,
    owner_company,
    full_address,
    office_manager,
    office_moderator_username,
    warehouse_manager_username,
  } = office || {};

  const handleClose = useCallback(() => {
    dialogOpen({ open: false });
  }, [dialogOpen]);

  return (
    <div>
      {dialog.open && (
        <Dialog
          open={dialog.open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Office details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              View information about '{name}' office
            </DialogContentText>
            <div className={classes.root}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <b>Office name:</b> {name}
                </Grid>
                <Grid item xs={12}>
                  <b>Owner company:</b> '{owner_company.title}'{" "}
                  {owner_company.address}
                </Grid>
                {[
                  "unique_number",
                  "state",
                  "building_area",
                  "rentable_area",
                  "floors_count",
                  "rentable_floors_count",
                ].map((field) => (
                  <Grid key={field} item xs={6}>
                    <b>{changeFieldName(field)}:</b> {office[field]}
                  </Grid>
                ))}
                <Grid item xs={6}>
                  <p>
                    <b>Country:</b> {full_address.country}
                  </p>
                  <p>
                    <b>City:</b> {full_address.city}
                  </p>
                  <p>
                    <b>Address:</b> {full_address.address}
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <p>
                    <b>Contact manager:</b>
                  </p>
                  {office_manager.last_name} {office_manager.first_name}{" "}
                  {office_manager.middle_name}
                  <p>{office_manager.phone_number}</p>
                </Grid>
                <Grid item xs={6}>
                  <b>Office moderator:</b> {office_moderator_username}
                </Grid>
                <Grid item xs={6}>
                  <b>Warehouse manager:</b> {warehouse_manager_username}
                </Grid>
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
