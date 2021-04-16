import React, { useContext } from "react";
import DeleteDialog from "../dialogs/deleteDialog";
import _ from "lodash";
import { AppContext } from "../officesView";
import { WorkplaceContext } from "./workplacesView";
import {APIService} from "../../service/APIService";

export default function DeleteWorkplaceDialog({ state, setOpen }) {
  const { open, officeId, roomId, workplaceId } = state;
  const { workplaces } = useContext(WorkplaceContext);
  const { alert } = useContext(AppContext);

  const handleClose = () => {
    setOpen({ open: false });
  };

  const handleDelete = async () => {
    await APIService.deleteWorkplace(officeId, roomId, workplaceId).then((response) => {
      if (response === "") {
        _.remove(workplaces.value, function (object) {
          return object.unique_number === workplaceId;
        });
        workplaces.setWorkplaces(workplaces.value);
        alert.openSnackbar({
          open: true,
          message: "Successfully delete workplace!",
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
        name="workplace"
      />
    </div>
  );
}
