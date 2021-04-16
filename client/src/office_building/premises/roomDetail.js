import React, { useState, useEffect, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useHistory, useParams } from "react-router";
import InputField from "../input/inputField";
import { empty_room } from "../blankObjects";
import { AppContext } from "../officesView";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/user/userSlice";
import { useStyles } from "../edit_office/officeDetail";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { GreenCheckbox } from "./roomsListItem";
import RoomDetailButton from "./roomDetailButton";
import UniverseSelect from "../select/universeSelect";
import { officeState, roomClass } from "../select/selectChoices";
import { changeFieldName } from "../../service/changeFieldName";
import Typography from "@material-ui/core/Typography";
import {APIService} from "../../service/APIService";
import {ValidationService} from "../../service/ValidationService";
import {fieldValidation} from "../workplaces/workplaceDetail";

export default function RoomDetail({ create = false }) {
  const classes = useStyles();
  let { officeId, roomId } = useParams();
  const { alert } = useContext(AppContext);
  const history = useHistory();
  const user = useSelector(selectUser);
  const [room, setRoom] = useState(null);

  const fieldValidator = (field) => {
    switch (field) {
      case 'room_type':
        return ValidationService.validateRoomType;
      case 'room_area':
        return ValidationService.validateFloatNumber;
      default:
        return ValidationService.validateInteger;
    }
  };

  useEffect(() => {
    async function fetchOfficeRoom() {
      await APIService.getOfficeRoom(officeId, roomId).then((response) => {
        if (typeof response.detail === "undefined") {
          alert.openSnackbar({
            open: true,
            message: "Load office room info!",
            type: "success",
          });
          setRoom(response);
        } else {
          alert.openSnackbar({
            open: true,
            message: response.detail,
            type: "error",
          });
          history.push(`/offices/${officeId}/rooms/`);
        }
      });
    }

    if (!create) {
      fetchOfficeRoom().then();
    } else {
      if (user && user.user_role === "MO") {
        let copiedRoom = JSON.parse(JSON.stringify(empty_room));
        copiedRoom.office_id = officeId;
        setRoom(copiedRoom);
      } else {
        history.push(`/offices/${officeId}/rooms/`);
        alert.openSnackbar({
          open: true,
          message: "You have mo permissions for this action",
          type: "error",
        });
      }
    }
    // eslint-disable-next-line
  }, [history, create, officeId]);

  const changeState = (field, check = false) => (event) => {
    const newValue = !check ? event.target.value : event.target.checked;
    setRoom({...room, [field]: newValue});
  };

  return (
    <Paper className={classes.paper} elevation={3}>
      {room && (
        <div className={classes.root}>
          <Typography variant={"h2"} className={classes.header}>
            Room
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <InputField
                label={"Unique number"}
                field={room.unique_number}
                error={fieldValidation(room.unique_number, ValidationService.validateUniqueNumber)}
                setField={changeState("unique_number")}
                readOnly={!create}
              />
            </Grid>
            <Grid item xs={6}>
              <UniverseSelect
                title="Room state"
                state={room.state}
                changeState={changeState("state")}
                choices={officeState}
              />
            </Grid>
            <Grid item xs={6}>
              {["floor_number", "room_area", "room_type"].map((field) => (
                <Grid key={field} item xs={12}>
                  <InputField
                    label={changeFieldName(field)}
                    field={room[field]}
                    error={fieldValidation(room[field], fieldValidator(field))}
                    setField={changeState(field)}
                  />
                </Grid>
              ))}
            </Grid>
            <Grid item xs={6}>
              {[
                "total_available_workplace",
                "permanent_workplace",
                "temporal_workplace",
              ].map((field) => (
                <Grid key={field} item xs={12}>
                  <InputField
                    label={changeFieldName(field)}
                    field={room[field]}
                    error={fieldValidation(room[field], fieldValidator(field))}
                    setField={changeState(field)}
                  />
                </Grid>
              ))}
            </Grid>
            <Grid item xs={4}>
              <UniverseSelect
                title="Room class"
                state={room.room_class}
                changeState={changeState("room_class")}
                choices={roomClass}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <GreenCheckbox
                    checked={room.MFU}
                    name="checkedG"
                    onChange={changeState("MFU", true)}
                  />
                }
                label="MFU"
              />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                className={classes.formControl}
                control={
                  <GreenCheckbox
                    checked={room.conditioner}
                    name="checkedG"
                    onChange={changeState("conditioner", true)}
                  />
                }
                label="Conditioner"
              />
            </Grid>
          </Grid>
          <RoomDetailButton room={room} setRoom={setRoom} create={create} />
        </div>
      )}
    </Paper>
  );
}
