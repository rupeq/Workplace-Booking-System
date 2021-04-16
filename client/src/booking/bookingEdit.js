import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { useHistory, useParams } from "react-router";
import { Button } from "@material-ui/core";
import { APIService } from "../service/APIService";
import Paper from "@material-ui/core/Paper";
import { useStyles } from "./create_booking/bookingCreate";
import BookingEquipmentView from "./bookingEquipment";
import Typography from "@material-ui/core/Typography";

export default function BookingEdit({user, openSnackbar}) {
  let { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [initialBooking, setInitialBooking] = useState(null);
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    async function fetchBook() {
      await APIService.getBookInformation(bookingId).then((res) => {
        res.reservation_time = res.reservation_time.split("+")[0];
        res.booking_date = res.booking_date.split("+")[0];
        setBooking(res);
        setInitialBooking(res);
      });
    }

    fetchBook().then();
  }, [history, bookingId]);

  const changeValue = (field, check = false) => (event) => {
    const newValue = !check ? event.target.value : event.target.checked;
    setBooking({ ...booking, [field]: newValue });
  };

  const editBooking = async (event) => {
    event.preventDefault();
    if (JSON.stringify(initialBooking) === JSON.stringify(booking)) {
      openSnackbar({
        open: true,
        message: "Nothing has changed!",
        type: "info",
      });
      history.push("/");
      return;
    }

    await APIService.updateBookInformation(bookingId, booking)
      .then((response) => {
        if (
        typeof response.detail === "undefined" &&
        typeof response.amount === "undefined"
      ) {
        openSnackbar({
          open: true,
          message: "Success!",
          type: "info",
        });
        history.push("/");
      } else {
        openSnackbar({
          open: true,
          message:
            typeof response.amount === "undefined"
              ? response.detail
              : response.description,
          type: "error",
        });
      }
     });
  };

  return (
    <Paper className={classes.paper} elevation={3}>
      <div>
        {booking && (
          <>
            <Typography
              variant="h4"
              style={{ textAlign: "center", marginBottom: "40px" }}
            >
              Booking
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <TextField
                  onChange={changeValue("booking_date")}
                  id="booking_date"
                  label="Booking start"
                  type="datetime-local"
                  defaultValue={booking.booking_date}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  onChange={changeValue("reservation_time")}
                  id="reservation_time"
                  label="Booking end"
                  type="datetime-local"
                  defaultValue={booking.reservation_time}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  required
                  id="place_id"
                  label="Workplace id"
                  defaultValue={booking.place_id}
                  InputProps={{
                    readOnly: user.user_role !== "MO",
                  }}
                  onChange={changeValue("place_id")}
                />
              </Grid>
              <Grid item xs={4}>
                <Button onClick={editBooking} variant="outlined">
                  Change booking
                </Button>
              </Grid>
            </Grid>
            <BookingEquipmentView booking={booking} changeValue={changeValue} />
          </>
        )}
      </div>
    </Paper>
  );
}
