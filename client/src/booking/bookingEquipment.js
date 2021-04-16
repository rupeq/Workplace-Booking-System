import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import React from "react";
import { useStyles } from "./create_booking/bookingCreate";

export default function BookingEquipmentView({ booking, changeValue }) {
  const classes = useStyles();
  const { laptop, monitor, headphones, keyboard } = booking;

  return (
    <div style={{ marginTop: "40px" }}>
      <Typography
        variant="h4"
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        Equipment
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Paper className={classes.equipment}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={monitor}
                  onChange={changeValue("monitor", true)}
                  color="default"
                />
              }
              label="Monitor"
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.equipment}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={headphones}
                  onChange={changeValue("headphones", true)}
                  color="default"
                />
              }
              label="Headphones"
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.equipment}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={laptop}
                  onChange={changeValue("laptop", true)}
                  color="default"
                />
              }
              label="Laptop"
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.equipment}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={keyboard}
                  onChange={changeValue("keyboard", true)}
                  color="default"
                />
              }
              label="Keyboard"
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
