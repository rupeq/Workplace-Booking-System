import React, { useEffect, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { APIService } from "../../service/APIService";
import LinearProgress from "@material-ui/core/LinearProgress";
import EmptyPageContent from "../../emptyPageContent";
import {useHistory} from "react-router";
import WorkIcon from "@material-ui/icons/Work";
import {Typography} from "@material-ui/core";

export default function AvailableWorkplacesList({ snackbar, openSnackbar }) {
  const [availableWorkplaces, setAvailableWorkplaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      history.push("/SignIn");
      return;
    }

    APIService.getAvailableWorkplaces().then((response) => {
      setLoading(true);
      if (typeof response.detail === "undefined") {
        setAvailableWorkplaces(response);
      }
      setLoading(false);
    });
  }, [history]);

  if (loading) {
    return (
        <LinearProgress />
    );
  }

  if (availableWorkplaces.length < 1) {
    return (
      <EmptyPageContent page="Available workplaces" message="There are no available workplaces for you now"/>
    );
  }

  return (
    <>
      <Typography>All available workplaces in office buildings to which you are attached</Typography>
      <List dense>
        { availableWorkplaces.map((value) => (
          <AvailableWorkplacesListItem
            key={value.unique_number}
            workplace={value}
          />
        ))}
      </List>
    </>
  );
}

function AvailableWorkplacesListItem({
  workplace
}) {

  return (
    <ListItem button>
      <ListItemIcon>
        <WorkIcon />
      </ListItemIcon>
      <ListItemText
        primary={`Room`}
        secondary={`${workplace.room_id}`}
      />
      <ListItemText
        primary={`${workplace.unique_number}`}
      />
    </ListItem>
  );
}
