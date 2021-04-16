import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

export default function InformationalSnackbar({ snackbar, openSnackbar }) {
  const classes = useStyles();
  const { open, type, message } = snackbar;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    openSnackbar({open: false, type: type, message: message});
  };

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={type}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
