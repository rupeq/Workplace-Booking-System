import { useHistory } from "react-router";
import _ from "lodash";
import Button from "@material-ui/core/Button";
import React, { useContext } from "react";
import { AppContext } from "../officesView";
import { WorkplaceContext } from "./workplacesView";
import { changeFieldName } from "../../service/changeFieldName";
import {APIService} from "../../service/APIService";
import {empty_workplace} from "../blankObjects";
import {ValidationService} from "../../service/ValidationService";
import ValidationError from "../../errors/ValidationError";

export default function WorkplaceDetailButton({
  officeId,
  workplace,
  initialWorkplace,
  create,
}) {
  const history = useHistory();
  const { alert } = useContext(AppContext);
  const { workplaces } = useContext(WorkplaceContext);
  const { room_id, unique_number } = workplace;

  const inputFieldValidation = () => {
    try {
          ValidationService.validateUniqueNumber(workplace.unique_number);
          ValidationService.validateInventoryNumber(workplace.inventory_number);
          ValidationService.validateIndoorLocation(workplace.indoor_location);
    } catch (e) {
        if (e instanceof ValidationError) {
            alert.openSnackbar({
                open: true,
                message: e.message,
                type: "error",
            });
            return false;
        }
    }

    return true;
  };

  const submitChanges = async (event) => {
    event.preventDefault();
    if (JSON.stringify(initialWorkplace) === JSON.stringify(workplace)) {
      alert.openSnackbar({
        open: true,
        message: "Nothing has changed!",
        type: "info",
      });
      history.push(`/offices/${officeId}/rooms/${room_id}/workplaces/`);
      return;
    }

    if (inputFieldValidation()) {
      await APIService
          .updateWorkplace(
              officeId,
              room_id,
              unique_number,
              JSON.stringify(workplace)
          )
          .then((response) => {
            const responseContent = Object.entries(response);

            if (responseContent.length === Object.keys(empty_workplace).length) {
              workplaces.setWorkplaces(
                  _.map(workplaces.value, function (a) {
                    return a.unique_number === unique_number ? workplace : a;
                  })
              );
              history.push(`/offices/${officeId}/rooms/${room_id}/workplaces/`);
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
      await APIService
          .createWorkplace(officeId, room_id, JSON.stringify(workplace))
          .then((response) => {
            const responseContent = Object.entries(response);

            if (responseContent.length === Object.keys(empty_workplace).length) {
              workplaces.value.push(workplace);
              workplaces.setWorkplaces(workplaces.value);
              history.push(`/offices/${officeId}/rooms/${room_id}/workplaces/`);
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
        <Button size="large" variant="outlined" onClick={createOffice}>
          Create
        </Button>
      ) : (
        <Button size="large" variant="outlined" onClick={submitChanges}>
          Save
        </Button>
      )}
    </>
  );
}
