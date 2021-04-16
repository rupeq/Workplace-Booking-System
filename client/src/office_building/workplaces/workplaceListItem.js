import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import React, {useContext} from "react";
import { useStyles } from "../officeListItem";
import WorkIcon from "@material-ui/icons/Work";
import AccordionActions from "@material-ui/core/AccordionActions";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/user/userSlice";
import { changeFieldName } from "../../service/changeFieldName";
import ListItemButtonGroup from "./listItemButtonGroup";
import Button from "@material-ui/core/Button";
import {AppContext} from "../officesView";
import Tooltip from "@material-ui/core/Tooltip";

export default function WorkplaceListItem({
  expanded,
  workplace,
  setExpanded,
  openDeleteDialog,
  openChangeDialog,
  officeModerator,
}) {
  const classes = useStyles();
  const { user_role, username } = useSelector(selectUser);
  const { unique_number, state } = workplace;
  const workplace_image = `https://roomsplan.s3.amazonaws.com/${unique_number}.png`;
  const {alert} = useContext(AppContext);

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded ? unique_number : false);
  };

  const saveIdToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(unique_number);
      alert.openSnackbar({
        open: true,
        message:
          "Workplace id saved to clipboard.",
        type: "info",
      });
    } catch(e) {
      alert.openSnackbar({
        open: true,
        message:
          "Something went wrong. Do not save to clipboard.",
        type: "warning",
      });
    }
  };

  return (
    <>
      <Accordion expanded={expanded === unique_number} onChange={handleChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <WorkIcon />
          <Typography className={classes.heading}>
            {`Workplace '${unique_number}'`}
          </Typography>
          <Typography className={classes.secondaryHeading}>{state}</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <div className={classes.root}>
            <Grid container spacing={3}>
              {["unique_number", "inventory_number", "state"].map((field) => (
                <Grid key={field} item xs={4}>
                  <Paper className={classes.paper}>
                    <b>{changeFieldName(field)}:</b> {workplace[field]}
                  </Paper>
                </Grid>
              ))}
              {[
                "workplace_type",
                "workplace_class",
                "indoor_location",
                "room_id",
              ].map((field) => (
                <Grid key={field} item xs={6}>
                  <Paper className={classes.paper}>
                    <b>{changeFieldName(field)}: </b> {workplace[field]}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </div>
        </AccordionDetails>
        <Divider />
        <Paper variant="outlined">
          <img
              className={classes.image}
              src={workplace_image}
              title="Workplace position inside room"
              alt="No workplace position schema"
          />
        </Paper>
        <Divider />

          <AccordionActions>
            <Tooltip title="Save workplace id to clipboard">
              <Button variant="contained" size="small" onClick={saveIdToClipboard}>
                Save
              </Button>
            </Tooltip>
            {user_role === "MO" && officeModerator === username && (
              <ListItemButtonGroup
                openDeleteDialog={openDeleteDialog}
                openChangeDialog={openChangeDialog}
                workplaceId={unique_number}
              />
            )}
          </AccordionActions>
      </Accordion>
    </>
  );
}
