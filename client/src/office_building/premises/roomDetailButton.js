import { useHistory } from "react-router";
import _ from "lodash";
import Button from "@material-ui/core/Button";
import React, { useContext } from "react";
import { RoomContext } from "./premisesView";
import { AppContext } from "../officesView";
import { changeFieldName } from "../../service/changeFieldName";
import { useStyles } from "../edit_office/officeDetail";
import {APIService} from "../../service/APIService";
import {empty_room} from "../blankObjects";
import {ValidationService} from "../../service/ValidationService";
import ValidationError from "../../errors/ValidationError";

export default function RoomDetailButton({ room, setRoom, create }) {
  const history = useHistory();
  const classes = useStyles();
  const { rooms } = useContext(RoomContext);
  const { alert } = useContext(AppContext);
  const { office_id, unique_number } = room;

  const inputFieldValidation = () => {
    let valid = true;

    try {
        ValidationService.validateUniqueNumber(unique_number);
        ValidationService.validateRoomType(room.room_type);
        ValidationService.validateInteger(room.floor_number);
        ValidationService.validateInteger(room.total_available_workplace);
        ValidationService.validateInteger(room.permanent_workplace);
        ValidationService.validateInteger(room.temporal_workplace);
        ValidationService.validateFloatNumber(room.room_area);
        validateWorkplaceNumber();
    } catch (e) {
        if (e instanceof ValidationError) {
            alert.openSnackbar({
                open: true,
                message: e.message,
                type: "error",
            });
            valid = false;
        }
    }

    return valid;
  };

  const validateWorkplaceNumber = () => {
    if (parseInt(room.total_available_workplace) !== parseInt(room.permanent_workplace) + parseInt(room.temporal_workplace)) {
        throw new ValidationError("Invalid number of temporal and permanent workplaces");
    }
  };

  const submitChanges = async (event) => {
    event.preventDefault();
    if (inputFieldValidation()) {
      await APIService
          .updateOfficeRoom(office_id, unique_number, room)
          .then((response) => {
            const responseContent = Object.entries(response);

            if (responseContent.length === Object.keys(empty_room).length) {
              rooms.setRooms(
                  _.map(rooms.value, function (a) {
                    return a.unique_number === unique_number ? room : a;
                  })
              );
              history.push(`/offices/${office_id}/rooms/`);
              alert.openSnackbar({
                open: true,
                message: "Successfully changed!",
                type: "success",
              });
            } else {
              const [field, message] = responseContent[0];
              const errorMessage = [changeFieldName(field), message].join(": ");
              alert.openSnackbar({
                open: true,
                message: errorMessage,
                type: "error",
              });
            }
          });
    }
  };

  const createOffice = async (event) => {
    event.preventDefault();
    if (inputFieldValidation()) {
      await APIService.createOfficeRoom(office_id, room).then((response) => {
        const responseContent = Object.entries(response);

        if (responseContent.length === Object.keys(empty_room).length) {
          rooms.value.push(room);
          rooms.setRooms(rooms.value);
          history.push(`/offices/${office_id}/rooms/`);
          alert.openSnackbar({
            open: true,
            message: "Successfully created!",
            type: "success",
          });
        } else {
          const [field, message] = responseContent[0];
          const errorMessage = [changeFieldName(field), message].join(": ");

          alert.openSnackbar({
            open: true,
            message: errorMessage,
            type: "error",
          });
        }
      });
    }
  };

  return (
    <>
      {create ? (
        <Button
          size="large"
          variant="outlined"
          onClick={createOffice}
          className={classes.submitButton}
        >
          Create
        </Button>
      ) : (
        <Button
          size="large"
          variant="outlined"
          onClick={submitChanges}
          className={classes.submitButton}
        >
          Save
        </Button>
      )}
    </>
  );
}
