import React, { createContext, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { selectUser } from "../features/user/userSlice";
import { useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router";
import BookingCreate from "./create_booking/bookingCreate";
import BookingListItem from "./bookingListItem";
import BookingEdit from "./bookingEdit";
import { APIService } from "../service/APIService";
import ConfirmBookingDelete from "./confirmDelete";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export const AppContext = createContext();

export default function BookingView({ snackbar, openSnackbar }) {
  const history = useHistory();
  const classes = useStyles();
  const user = useSelector(selectUser);
  const [bookings, setBooking] = useState([]);
  const [deleteDialog, setOpenDeleteDialog] = useState({ open: false });

  const openBookingPage = () => {
    history.push("/booking/create");
  };

  useEffect(() => {
    async function fetchBooking() {
      await APIService.getBookingInformation().then((response) => {
        if (typeof response.detail !== "undefined") {
          openSnackbar({
            open: true,
            message: "You need to login!",
            type: "info",
          });
          history.push("/SignIn/");
        } else {
          setBooking(response);
        }
      });
    }

    fetchBooking().then();
    // eslint-disable-next-line
  }, [history]);
  return (
    <div className={classes.root}>
      <AppContext.Provider
        value={{
          bookings: { value: bookings, setBooking: setBooking },
          alert: { snackbar: snackbar, openSnackbar: openSnackbar },
        }}
      >
        <ConfirmBookingDelete
          state={deleteDialog}
          setOpen={setOpenDeleteDialog}
        />
        <Switch>
          <Route exact path="/booking/edit/:bookingId/">
            <BookingEdit user={user} openSnackbar={openSnackbar}/>
          </Route>
          <Route exact path="/booking/create">
            <BookingCreate openSnackbar={openSnackbar} bookings={bookings} />
          </Route>
          <Route exact path="/booking/">
            {user && user.user_role === "EM" && (
              <Button variant="outlined" onClick={openBookingPage}>
                Book now
              </Button>
            )}
            <BookingListItem setDeleteState={setOpenDeleteDialog} />
          </Route>
        </Switch>
      </AppContext.Provider>
    </div>
  );
}
