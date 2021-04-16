import Paper from "@material-ui/core/Paper";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import {Typography} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({
  root: {
    padding: "40px",
    marginTop: "20px"
  },
  icon: {
    width: "250px",
    height: "250px"
  },
  pageHeader: {
    marginBottom: "10px"
  }
}));

export default function EmptyPageContent({page, message}) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <SentimentVeryDissatisfiedIcon className={classes.icon}/>
      <Typography variant={"h4"} className={classes.pageHeader}>{page}</Typography>
      <Typography variant={"h5"}>{message}</Typography>
    </Paper>
  );
}