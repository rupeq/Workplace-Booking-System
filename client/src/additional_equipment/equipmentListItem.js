import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DescriptionIcon from "@material-ui/icons/Description";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useContext } from "react";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user/userSlice";
import { EquipmentContext } from "./equipmentView";
import WorkIcon from "@material-ui/icons/Work";
import Tooltip from "@material-ui/core/Tooltip";

export const useStyles = makeStyles(() => ({
  mainRow: {
    width: "100px",
  },
  additionalRow: {
    width: "200px",
  },
  officeId: {
    textAlign: "left",
  },
  block: {
    marginBottom: "50px",
  },
}));

function getEquipment(value, element) {
  const handler = {
    tables: "Table",
    chairs: "Chair",
    additional_equipment: element.name,
  };

  return handler[value];
}

export default function EquipmentListItem({
  equipment,
  single_element,
  openDeleteDialog,
  openChangeDialog,
  equipment_manager
}) {
  const {
    inventory_number,
    item_class,
    state,
    workplace_id,
    office_id,
  } = single_element;
  const history = useHistory();
  const classes = useStyles();
  const user = useSelector(selectUser);
  const { alert } = useContext(EquipmentContext);

  const clickHandler = () => {
    if (user && user.user_role === "WM" && user.username === equipment_manager) {
      history.push(`/offices/${office_id}/equipment/${inventory_number}/`);
    } else {
      alert.openSnackbar({
        open: true,
        message: `You have no permissions for this action!`,
        type: "info",
      });
    }
  };

  const handleChange = (handler) => () => {
    handler({
      open: true,
      officeId: office_id,
      equipmentId: inventory_number,
    });
  };

  return (
    <ListItem button onClick={clickHandler}>
      <ListItemIcon>
        <DescriptionIcon />
      </ListItemIcon>
      <ListItemText
        className={classes.mainRow}
        primary={getEquipment(equipment, single_element)}
        secondary={inventory_number}
      />
      <ListItemText
        className={classes.mainRow}
        secondary={`Class: ${item_class}`}
      />
      <ListItemText
        className={classes.additionalRow}
        secondary={`Workplace: ${workplace_id}`}
      />
      <ListItemText className={classes.additionalRow} secondary={state} />
      {user && user.user_role === "WM" && user.username === equipment_manager && (
        <ListItemSecondaryAction>
          <IconButton onClick={handleChange(openChangeDialog)}>
            <Tooltip title="Set usage place">
              <WorkIcon />
            </Tooltip>
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={handleChange(openDeleteDialog)}
          >
            <Tooltip title="Remove equipment">
              <DeleteIcon />
            </Tooltip>
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}
