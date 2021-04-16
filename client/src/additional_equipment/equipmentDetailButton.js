import { useHistory } from "react-router";
import _ from "lodash";
import Button from "@material-ui/core/Button";
import React, { useContext } from "react";
import { EquipmentContext } from "./equipmentView";
import { changeFieldName } from "../service/changeFieldName";
import { APIService } from "../service/APIService";
import {ValidationService} from "../service/ValidationService";
import ValidationError from "../errors/ValidationError";

export default function EquipmentDetailButton({
  state,
  officeId,
  item,
  setItem,
  create,
}) {
  const history = useHistory();
  const { equipment, alert } = useContext(EquipmentContext);
  const { inventory_number } = item;

  const inputFieldValidation = () => {
    let valid = true;

    try {
          ValidationService.validateInventoryNumber(inventory_number);
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

  const submitChanges = async (event) => {
    event.preventDefault();
    if (inputFieldValidation()) {
      await APIService.updateEquipmentItem(
          state,
          officeId,
          inventory_number,
          item
      ).then((response) => {
        const responseContent = Object.entries(response);

        if (responseContent.length === 5 || responseContent.length === 6) {
          equipment.setEquipment(
              _.map(equipment.value, function (a) {
                return a.inventory_number === inventory_number ? item : a;
              })
          );
          history.push(`/offices/${officeId}/equipment/`);
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
      await APIService.createEquipmentItem(state, officeId, item).then(
          (response) => {
            const responseContent = Object.entries(response);

            if (responseContent.length === 5 || responseContent.length === 6) {
              equipment.value.push(item);
              equipment.setEquipment(equipment.value);
              history.push(`/offices/${officeId}/equipment/`);
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
          }
      );
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
