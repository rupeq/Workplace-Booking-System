import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import BusinessTwoToneIcon from "@material-ui/icons/BusinessTwoTone";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import AccordionActions from "@material-ui/core/AccordionActions";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user/userSlice";
import { Link } from "react-router-dom";
import ListItemButtonGroup from "./listItemButtonGroup";
import {changeFieldName} from "../service/changeFieldName";

export const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: "10px",
  },
  itemBody: {
    flexGrow: 1,
  },
  paper: {
    padding: "20px 40px",
    textAlign: "left",
    color: theme.palette.text.primary,
    "& p": {
      margin: "0px",
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    marginLeft: "10px",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  grayBackground: {
    background: "gray",
    textAlign: "center",
  },
  image: {
    width: "100%"
  }
}));

export default function OfficeListItem({
  expanded,
  office,
  setExpanded,
  dialogOpen,
  openDeleteDialog,
  openChangeDialog,
}) {
  const classes = useStyles();
  const history = useHistory();
  const user = useSelector(selectUser);
  const { country, city, address } = office.full_address;
  const {
    first_name,
    last_name,
    middle_name,
    phone_number,
  } = office.office_manager;
  const { name, unique_number, state } = office;
  const officeOwner = office.owner_company;

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded ? unique_number : false);
  };

  const handleClickOpen = () => {
    dialogOpen({ open: true, office: office });
  };

  const handleOpenDialog = (openDialog) => () => {
    openDialog({ open: true, officeId: unique_number });
  };

  const handleOpenEditPage = () => {
    history.push(`/offices/${unique_number}/`);
  };

  return (
    <>
      <Accordion expanded={expanded === unique_number} onChange={handleChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <BusinessTwoToneIcon />
          <Typography className={classes.heading}>
            {`Office '${name}'`}
          </Typography>
          <Typography className={classes.secondaryHeading}>
            {`${country}, ${city}, ${address}`}
          </Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <b>Office name:</b> {name}
                </Paper>
              </Grid>
              {
                ["rooms", "equipment"].map(field => (
                   <Grid key={field} item xs={3}>
                    <Link to={`/offices/${unique_number}/${field}/`}>
                      <Paper
                        className={classes.paper + " " + classes.grayBackground}
                      >
                        <p>{changeFieldName(field)}</p>
                      </Paper>
                    </Link>
                  </Grid>
                ))
              }
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <b>Owner company:</b> '{officeOwner.title}'{" "}
                  {officeOwner.address}
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <b>Id:</b> {unique_number}
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <b>Status: </b> {state}
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <p>
                    <b>Country:</b> {country}
                  </p>
                  <p>
                    <b>City:</b> {city}
                  </p>
                  <p>
                    <b>Address:</b> {address}
                  </p>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <p>
                    <b>Contact manager:</b>
                  </p>
                  {last_name} {first_name} {middle_name}
                  <p>{phone_number}</p>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </AccordionDetails>
        <Divider />
        {user.user_role === "MO" &&
          office.office_moderator_username === user.username && (
            <AccordionActions>
              <ListItemButtonGroup
                handleClickOpen={handleClickOpen}
                handleOpenChangeDialog={handleOpenDialog(openChangeDialog)}
                handleOpenDeleteDialog={handleOpenDialog(openDeleteDialog)}
                handleOpenEditPage={handleOpenEditPage}
              />
            </AccordionActions>
          )}
      </Accordion>
    </>
  );
}
