import React, { useContext, useCallback } from "react";
import _ from "lodash";
import { AppContext } from "../officesView";
import DeleteDialog from "./deleteDialog";
import {APIService} from "../../service/APIService";

export default function DeleteOfficeDialog({ state, setOpen }) {
  const { open, officeId } = state;
  const { offices, alert } = useContext(AppContext);

  const handleClose = useCallback(() => {
    setOpen({ open: false });
  }, [setOpen]);

  const handleDelete = async () => {
    await APIService.deleteOfficeBuilding(officeId).then((response) => {
      if (response === "") {
        _.remove(offices.value, function (object) {
          return object.unique_number === officeId;
        });
        offices.setOffices(offices.value);
        alert.openSnackbar({
          open: true,
          message: "Successfully delete office building!",
          type: "success",
        });
      } else {
        alert.openSnackbar({
          open: true,
          message: response.detail,
          type: "error",
        });
      }
      handleClose();
    });
  };

  return (
    <div>
      <DeleteDialog
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
        name="office building"
      />
    </div>
  );
}
