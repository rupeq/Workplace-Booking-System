import React, { useContext, useEffect, useState, useCallback } from "react";
import _ from "lodash";
import { EquipmentContext } from "./equipmentView";
import { APIService } from "../service/APIService";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import {fieldValidation} from "../office_building/workplaces/workplaceDetail";
import {ValidationService} from "../service/ValidationService";
import ValidationError from "../errors/ValidationError";

export default function ChangeUsagePlace({ equipmentAlias, dialog, setOpen }) {
  const { open, officeId, equipmentId } = dialog;
  const { equipment, alert } = useContext(EquipmentContext);
  const [state, setState] = useState("");

  const handleClose = () => {
    setOpen({ open: false });
    setState("");
  };

  const inputFieldValidation = () => {
    let valid = true;

    try {
          ValidationService.validateUniqueNumber(state);
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

  useEffect(() => {
    if (typeof equipmentId !== "undefined") {
      const item = _.find(equipment.value, function (obj) {
        return obj.inventory_number === equipmentId;
      });
      setState(item.workplace_id);
    }
    // eslint-disable-next-line
  }, [equipmentId]);

  const onChange = useCallback((event) => setState(event.target.value), []);

  const updateEquipmentItemWorkplace = async () => {
    if (inputFieldValidation()) {
      await APIService.updateEquipmentItemWorkplace(
          equipmentAlias,
          officeId,
          equipmentId,
          {workplace_id: state}
      ).then((response) => {
        if (typeof response.message === "undefined" && typeof response.detail === "undefined") {
          equipment.setEquipment(
              _.map(equipment.value, function (a) {
                if (a.inventory_number === equipmentId) {
                  a.workplace_id = state;
                }
                return a;
              })
          );
          alert.openSnackbar({
            open: true,
            message: `Set ${equipmentAlias} usage workplace for '${equipmentId}'!`,
            type: "success",
          });
          handleClose();
        } else {
          alert.openSnackbar({
            open: true,
            message: response.message ? response.message : response.detail,
            type: "error",
          });
        }
      });
    }
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Equipment workplace</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Set usage workplace for equipment
          </DialogContentText>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Workplace id"
            variant="outlined"
            value={state}
            error={fieldValidation(state, ValidationService.validateUniqueNumber)}
            onChange={onChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={updateEquipmentItemWorkplace} color="primary">
            Set
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
