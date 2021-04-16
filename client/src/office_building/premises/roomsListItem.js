import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import AccordionActions from "@material-ui/core/AccordionActions";
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/user/userSlice";
import RoomIcon from "@material-ui/icons/Room";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { green } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import { useStyles } from "../officeListItem";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { changeFieldName } from "../../service/changeFieldName";
import ListItemButtonGroup from "../listItemButtonGroup";

export const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default function RoomsListItem({
  expanded,
  room,
  setExpanded,
  dialogOpen,
  openDeleteDialog,
  openChangeDialog,
  officeModerator,
}) {
  const classes = useStyles();
  const history = useHistory();
  const user = useSelector(selectUser);
  const { unique_number, MFU, conditioner, state, office_id, floor_number } = room;

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded ? unique_number : false);
  };

  const handleClickOpen = () => {
    dialogOpen({ open: true, room: room });
  };

  const handleOpenDialog = (openDialog) => () => {
    openDialog({ open: true, roomId: unique_number, officeId: office_id });
  };

  const handleOpenEditPage = () => {
    history.push(`/offices/${office_id}/rooms/${unique_number}/`);
  };

  return (
    <>
      <Accordion expanded={expanded === unique_number} onChange={handleChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <RoomIcon />
          <Typography className={classes.heading}>
            {`Room '${unique_number}'`}
          </Typography>
          <Typography className={classes.secondaryHeading}>Floor: {floor_number}, {state}</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <b>Unique number:</b> {unique_number}
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <b>Status: </b> {state}
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Link
                  to={`/offices/${office_id}/rooms/${unique_number}/workplaces`}
                >
                  <Paper
                    className={classes.paper + " " + classes.grayBackground}
                  >
                    <p>Workplaces</p>
                  </Paper>
                </Link>
              </Grid>
              {["floor_number", "room_area", "room_class", "room_type"].map(
                (field) => (
                  <Grid key={field} item xs={3}>
                    <Paper className={classes.paper}>
                      <b>{changeFieldName(field)}:</b> {room[field]}
                    </Paper>
                  </Grid>
                )
              )}
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <FormControlLabel
                    control={<GreenCheckbox checked={MFU} name="checkedG" />}
                    label="MFU"
                  />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <FormControlLabel
                    style={{ margin: "0px" }}
                    control={
                      <GreenCheckbox checked={conditioner} name="checkedG" />
                    }
                    label="Conditioner"
                  />
                </Paper>
              </Grid>
            </Grid>
          </div>
        </AccordionDetails>
        <Divider />
        {user.user_role === "MO" && officeModerator === user.username && (
          <AccordionActions>
            <ListItemButtonGroup
              handleOpenEditPage={handleOpenEditPage}
              handleClickOpen={handleClickOpen}
              handleOpenDeleteDialog={handleOpenDialog(openDeleteDialog)}
              handleOpenChangeDialog={handleOpenDialog(openChangeDialog)}
            />
          </AccordionActions>
        )}
      </Accordion>
    </>
  );
}
