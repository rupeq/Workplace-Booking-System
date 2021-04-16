import React, { useContext, useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@material-ui/core";
import { AppContext } from "./bookingView";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user/userSlice";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { APIService } from "../service/APIService";
import { Button } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { empty_statistic } from "./blankObjects";
import Tooltip from "@material-ui/core/Tooltip";
import DetailsIcon from "@material-ui/icons/Details";
import BookingEquipmentDetailDialog from "./bookingEquipmentDialog";

export const useStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
}));

export default function BookingListItem({ setDeleteState }) {
  const user = useSelector(selectUser);
  const { bookings } = useContext(AppContext);
  const { value } = bookings;
  const classes = useStyles();
  const history = useHistory();
  const [statistic, setStatistic] = useState(null);
  const [statisticNum, setStatisticNum] = useState(null);
  const [statisticHour, setStatisticHour] = useState(null);
  const [modalStatistic, setModal] = useState(false);
  const [detailDialog, openDetailDialog] = useState({ open: false });

  useEffect(() => {
    let statisticCopy = JSON.parse(JSON.stringify(empty_statistic));
    setStatistic(statisticCopy);
  }, [history]);

  const deleteBooking = (unique_id) => async (event) => {
    event.preventDefault();
    setDeleteState({ open: true, bookingId: unique_id });
  };

  const editBooking = (unique_id) => (event) => {
    event.preventDefault();
    history.push(`booking/edit/${unique_id}/`);
  };

  const openDetail = (booking) => () => {
    openDetailDialog({open: true, booking: booking});
  };

  let defaultDate = new Date();

  const getStatistic = async (event) => {
    event.preventDefault();
    await APIService.getStatistic(JSON.stringify(statistic.username), JSON.stringify(statistic.date_start), JSON.stringify(statistic.date_end)
    ).then((response) => { setStatisticNum(response[0]); bookings.setBooking(response[1]); setStatisticHour(response[2]); 
    });
  };

  const resetFilter = async (event) => {
    event.preventDefault();
    statistic.username = "";
    statistic.date_start = new Date(defaultDate);
    statistic.date_end = new Date(defaultDate);
    setModal(false);
    setStatisticNum(null);
    setStatisticHour(null);
    await APIService.getBookingInformation().then((response) => {
      bookings.setBooking(response);
    });
  };

  const changeDateStart = (value) => {
    statistic.date_start = new Date(value);
  };

  const changeDateEnd = (value) => {
    statistic.date_end = new Date(value);
  };
  const changeUserStat = (value) => { statistic.username = value; };

  const showModal = (event) => {
    event.preventDefault();
    setModal(!modalStatistic);
  };

  let ModalStat;

  if (modalStatistic) {
    ModalStat = (
      <div>
        <br />
        <TextField
          onChange={(e) => changeUserStat(e.target.value)}
          id="user_stat"
          label="username"
          // eslint-disable-next-line no-mixed-spaces-and-tabs
	      InputProps={{
            defaultValue: user.user_role === "EM" ? user.username : "",
            readOnly: user.user_role === "EM" ? true : false,
          }}
        />
        <TextField
          onChange={(e) => changeDateStart(e.target.value)}
          required
          id="datetime-local"
          label="Start"
          type="datetime-local"
          defaultValue={defaultDate}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />{" "}
        <TextField
          onChange={(e) => changeDateEnd(e.target.value)}
          required
          id="datetime-local"
          label="End"
          type="datetime-local"
          defaultValue={defaultDate}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="outlined" onClick={getStatistic}>
          Show statistic
        </Button>
        <Button variant="outlined" onClick={resetFilter}>
          Reset filters
        </Button>
      </div>
    );
  } else {
    ModalStat = <div></div>;
  }

  let StatCount;

  if (statisticNum && statisticHour) { StatCount = <h3>Total count of booking number - {statisticNum}, booking hours - {statisticHour}</h3>; }
  else if (statisticNum) { StatCount = <h3>Total count of booking number - {statisticNum}</h3>; }
  
  return (
    <>
      <Button onClick={showModal} variant="outlined">
        Statistic
      </Button>
      {ModalStat}
      <BookingEquipmentDetailDialog dialog={detailDialog} dialogOpen={openDetailDialog}/>
	    {StatCount}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Author</TableCell>
              <TableCell>Time start</TableCell>
              <TableCell>Time end</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {value.map((booking) => {
              let booking_start =
                booking.booking_date.split("T")[0] +
                " " +
                booking.booking_date.split("T")[1];
              let booking_end =
                booking.reservation_time.split("T")[0] +
                " " +
                booking.reservation_time.split("T")[1];
              const id = booking.id;

              const detailBtn = (
                <IconButton
                  aria-label="details"
                  onClick={openDetail(booking)}
                >
                  <Tooltip title="Booking equipment details">
                    <DetailsIcon />
                  </Tooltip>
                </IconButton>
              );
              const editBtn = (
                <IconButton
                  aria-label="edit"
                  value={booking.id}
                  onClick={editBooking(booking.id)}
                >
                  <Tooltip title="Edit booking">
                    <EditIcon fontSize="small"/>
                  </Tooltip>
                </IconButton>
              );
              const deleteBtn = (
                <IconButton
                  aria-label="delete"
                  value={booking.id}
                  onClick={deleteBooking(booking.id)}
                >
                  <Tooltip title="Remove booking">
                    <DeleteIcon fontSize="small" />
                  </Tooltip>
                </IconButton>
              );
              return (
                <TableRow key={id}>
                  <TableCell>{booking.username}</TableCell>
                  <TableCell>{booking_start}</TableCell>
                  <TableCell>{booking_end}</TableCell>
                  <TableCell>
                    {detailBtn}
                    {editBtn}
                    {deleteBtn}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
