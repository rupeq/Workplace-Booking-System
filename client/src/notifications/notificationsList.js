import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { APIService } from "../service/APIService";
import _ from "lodash";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import EmptyPageContent from "../emptyPageContent";
import {useHistory} from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function NotificationList({ snackbar, openSnackbar }) {
  const classes = useStyles();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      history.push("/SignIn");
      return;
    }

    APIService.getNotifications().then((response) => {
      setLoading(true);
      let result = _.filter(response, function (obj) {
        return new Date(obj.occurrence_time) <= new Date();
      });
      result = _.orderBy(result, ['occurrence_time'], ['desc']);
      setNotifications(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
        <LinearProgress />
    );
  }

  if (notifications.length < 1) {
    return (
      <EmptyPageContent page="Notifications" message="Currently no notifications have been created"/>
    );
  }

  return (
    <List dense className={classes.root}>
      {notifications.map((value) => (
        <NotificationListItem
          key={value.id}
          notifications={notifications}
          notification={value}
          setNotifications={setNotifications}
          openSnackbar={openSnackbar}
        />
      ))}
    </List>
  );
}

function NotificationListItem({
  notifications,
  notification,
  setNotifications,
  openSnackbar
}) {
  const { is_checked } = notification;

  const handleToggle = () => {
    if (!is_checked) {
      notification.is_checked = true;
      APIService.updateNotificationStatus(notification.id, {
        is_checked: true,
      }).then();
      let updateNotifications = _.map(notifications, function (obj) {
        return obj.id === notification.id ? notification : obj;
      });

      setNotifications(updateNotifications);
    }
  };

  const handleDelete = async () => {
    await APIService.deleteNotifications(notification.id).then(
      (response) => {
        if (response === "") {
          _.remove(notifications, function (object) {
            return object.id === notification.id;
          });
          openSnackbar({
            open: true,
            message: "Successfully deleted!",
            type: "success",
          });
          setNotifications(notifications);
        }
      }
    );
  };

  return (
    <ListItem key={notification.id} button onClick={handleToggle} title="Mark notification as read">
      <ListItemIcon>
        <NotificationsIcon />
      </ListItemIcon>
      <ListItemText
        primary={`${notification.title}`}
        secondary={`${notification.description}`}
      />
      <ListItemSecondaryAction>

        <Tooltip title="Mark notification as read">
          <Checkbox
            edge="end"
            color="default"
            onChange={handleToggle}
            checked={notification.is_checked}
          />
        </Tooltip>
        <IconButton
          aria-label="delete"
          style={{marginLeft: "10px"}}
        >
          <Tooltip title="Delete notification">
            <DeleteIcon fontSize="small" onClick={handleDelete}/>
          </Tooltip>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
