import React, { useCallback, useContext, useEffect, useState } from "react";
import _ from "lodash";
import { AppContext } from "../officesView";
import { RoomContext } from "./premisesView";
import { officeState } from "../select/selectChoices";
import ChangeDialog from "../dialogs/changeDialog";
import {APIService} from "../../service/APIService";

export default function ChangeStateDialog({ dialog, setOpen }) {
  const { open, roomId, officeId } = dialog;
  const { alert } = useContext(AppContext);
  const { rooms } = useContext(RoomContext);
  const [state, setState] = useState("");

  const handleClose = () => {
    setOpen({ open: false });
    setState("");
  };

  const onChange = useCallback((event) => setState(event.target.value), []);

  useEffect(() => {
    if (typeof roomId !== "undefined") {
      const room = _.find(rooms.value, function (obj) {
        return obj.unique_number === roomId;
      });
      setState(room.state);
    }
    // eslint-disable-next-line
  }, [roomId]);

  const updateRoomState = async () => {
    await APIService
      .updateRoomState(officeId, roomId, { state: state })
      .then((response) => {
        if (typeof response.state !== "undefined" && response.state === state) {
          rooms.setRooms(
            _.map(rooms.value, function (a) {
              if (a.unique_number === roomId) {
                a.state = state;
              }
              return a;
            })
          );
          alert.openSnackbar({
            open: true,
            message: "State changed!",
            type: "success",
          });
          handleClose();
        } else {
          alert.openSnackbar({
            open: true,
            message: "Invalid building state!",
            type: "error",
          });
        }
      });
  };

  return (
    <div>
      <ChangeDialog
        open={open}
        updateState={updateRoomState}
        onChange={onChange}
        choices={officeState}
        state={state}
        handleClose={handleClose}
        name="office room"
      />
    </div>
  );
}
