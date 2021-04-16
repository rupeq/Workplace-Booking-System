import React from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({
  errorPage: {
    "h1, h2 ": {
      textAlign: "center",
    },
  },
}));

export function Error404() {
  const location = useLocation();
  const classes = useStyles();

  return (
    <div className={classes.errorPage}>
      <h1>404 Resource not found</h1>
      <h2>at '{location.pathname}'</h2>
    </div>
  );
}
