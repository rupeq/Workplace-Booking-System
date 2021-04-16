import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { empty_booking } from "../blankObjects";
import { useHistory } from "react-router";
import { selectUser } from "../../features/user/userSlice";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { APIService } from "../../service/APIService";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import BookingEquipmentView from "../bookingEquipment";
import _ from "lodash";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    width: 400,
  },
  paper: {
    minHeight: "200px",
    padding: "40px",
    marginTop: "40px",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  equipment: {
    textAlign: "left",
    padding: "10px 40px",
  },
}));

export default function BookingCreate({ openSnackbar, bookings }) {
  const classes = useStyles();
  const history = useHistory();
  const user = useSelector(selectUser);
  const [dateDisable, setDateDisable] = useState(true);
  const [workplaceDisable, setWorkplaceDisabled] = useState(true);
  const [booking, setBooking] = useState(null);
  const [updateChoices, setUpdateChoices] = useState(false);
  const [workplaceChoices, setWorkplaceChoices] = useState([]);

  useEffect(() => {
    if (user && user.user_role === "EM") {
      const sortedBookings = _.orderBy(bookings, ['reservation_time'],['desc']);
      if (sortedBookings.length === 0) {
        let bookingCopy = JSON.parse(JSON.stringify(empty_booking));
        bookingCopy.username = user.username;
        setBooking(bookingCopy);
      }
      else {
        setBooking(sortedBookings[0]);
      }
    } else {
      history.push("/");
      openSnackbar({
        open: true,
        message: "You have mo permissions for this action",
        type: "error",
      });
    }
    // eslint-disable-next-line
  }, [history]);

  const createBooking = async (event) => {
    event.preventDefault();
    if (booking.place_id === "") {
      openSnackbar({
          open: true,
          message: "Empty workplace id",
          type: "error",
        });
      return;
    }

    await APIService.createBooking(booking).then((response) => {
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

  const enableInputs = (field) => {
    if (field === "booking_date") {
      setDateDisable(false);
      if (updateChoices) {
        APIService
          .getFreeWorkplaces(booking.booking_date, booking.reservation_time)
          .then((response) => {
            if (response) {
              setWorkplaceChoices(response);
            }
          });
      }
    }

    if (field === "reservation_time") {
      setWorkplaceDisabled(false);
      setUpdateChoices(true);
      APIService
        .getFreeWorkplaces(booking.booking_date, booking.reservation_time)
        .then((response) => {
          if (response) {
            setWorkplaceChoices(response);
          }
        });
    }


  };

  const changeValue = (field, check = false) => (event) => {
    const newValue = !check ? event.target.value : event.target.checked;
    setBooking({ ...booking, [field]: newValue });

    enableInputs(field);
  };

  return (
    <>
      <Paper className={classes.paper} elevation={3}>
        {
        booking &&
          <div>
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
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  onChange={changeValue("reservation_time")}
                  id="booking_date"
                  label="Booking end"
                  type="datetime-local"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={dateDisable}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl variant="outlined" style={{width: "100%"}}>
                  <InputLabel id="demo-simple-select-outlined-label">Workplace</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={booking.place_id}
                    onChange={changeValue("place_id")}
                    label="Workplace"
                    disabled={workplaceDisable}
                  >
                    {
                      workplaceChoices.map((workplace) => (
                         <MenuItem key={workplace} value={workplace}>{workplace}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <Button variant="outlined" onClick={createBooking}>
                  Reservate
                </Button>
              </Grid>
            </Grid>
            <BookingEquipmentView
              booking={booking}
              changeValue={changeValue}
            />
          </div>
        }
      </Paper>
    </>
  );
}
