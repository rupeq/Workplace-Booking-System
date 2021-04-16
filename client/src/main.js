import React, {useCallback, useEffect, useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import BusinessTwoToneIcon from "@material-ui/icons/BusinessTwoTone";
import EventSeatIcon from '@material-ui/icons/EventSeat';
import RoomIcon from "@material-ui/icons/Room";
import { Link, useHistory } from "react-router-dom";
import ChooseOffice from "./chooseOffice";
import LaptopIcon from "@material-ui/icons/Laptop";
import NotificationsIcon from '@material-ui/icons/Notifications';
import WorkIcon from "@material-ui/icons/Work";
import {useSelector} from "react-redux";
import {selectUser} from "./features/user/userSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 300,
    width: 300,
    marginTop: "20px",
    padding: "10px",
  },
  cursor: {
    cursor: "pointer",
  },
  link: {
    textDecoration: "none",
  },
  media: {
    height: 250,
    width: 300,
  },
}));

export default function Main() {
  const classes = useStyles();
  const history = useHistory();
  const user = useSelector(selectUser);
  const [openDialog, setOpen] = useState({open: false});

  const handleOpen = useCallback((field) => () => {
    setOpen({open: true, field: field});
  }, []);

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      history.push("/SignIn");
    }
  }, [history]);

  return (
    <>
      {openDialog.open &&
        <ChooseOffice dialog={openDialog} setOpen={setOpen}/>
      }
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={6}>
            <Grid item>
              <Link to="/offices" className={classes.link}>
                <Paper className={classes.paper}>
                  <Typography variant={"h5"}>Offices</Typography>
                  <BusinessTwoToneIcon className={classes.media} />
                </Paper>
              </Link>
            </Grid>
            <Grid item>
              <Paper className={`${classes.paper} ${classes.cursor}`} onClick={handleOpen("rooms")}>
                <Typography variant={"h5"}>Rooms</Typography>
                <RoomIcon className={classes.media} />
              </Paper>
            </Grid>
            { user && user.user_role === "EM" &&
              <Grid item>
                <Link to="available_workplaces" className={classes.link}>
                  <Paper className={classes.paper}>
                    <Typography variant={"h5"}>Available workplaces</Typography>
                    <WorkIcon className={classes.media}/>
                  </Paper>
                </Link>
              </Grid>
            }
            <Grid item>
              <Paper className={`${classes.paper} ${classes.cursor}`} onClick={handleOpen("equipment")}>
                <Typography variant={"h5"}>Equipment</Typography>
                <LaptopIcon className={classes.media} />
              </Paper>
            </Grid>
            <Grid item>
              <Link to="/notifications" className={classes.link}>
                <Paper className={classes.paper}>
                  <Typography variant={"h5"}>Notifications</Typography>
                  <NotificationsIcon className={classes.media} />
                </Paper>
              </Link>
            </Grid>
            <Grid item>
              <Link to="/booking" className={classes.link}>
                <Paper className={classes.paper}>
                  <Typography variant={"h5"}>Booking</Typography>
                  <EventSeatIcon className={classes.media} />
                </Paper>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
