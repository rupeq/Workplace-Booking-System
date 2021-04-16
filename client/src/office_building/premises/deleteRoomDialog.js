import React, { useContext } from "react";
import DeleteDialog from "../dialogs/deleteDialog";
import _ from "lodash";
import { AppContext } from "../officesView";
import { RoomContext } from "./premisesView";
import {APIService} from "../../service/APIService";

export default function DeleteRoomDialog({ state, setOpen }) {
  const { open, officeId, roomId } = state;
  const { rooms } = useContext(RoomContext);
  const { alert } = useContext(AppContext);

  const handleClose = () => {
    setOpen({ open: false });
  };

  const handleDelete = async () => {
    await APIService.deleteOfficeRoom(officeId, roomId).then((response) => {
      if (response === "") {
        _.remove(rooms.value, function (object) {
          return object.unique_number === roomId;
        });
        rooms.setRooms(rooms.value);
        alert.openSnackbar({
          open: true,
          message: "Successfully delete office room!",
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
        handleDelete={handleDelete}
        handleClose={handleClose}
        name="office room"
      />
    </div>
  );
}
