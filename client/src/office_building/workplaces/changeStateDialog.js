import React, { useCallback, useContext, useEffect, useState } from "react";
import _ from "lodash";
import { AppContext } from "../officesView";
import { WorkplaceContext } from "./workplacesView";
import { workplaceState } from "../select/selectChoices";
import ChangeDialog from "../dialogs/changeDialog";
import {APIService} from "../../service/APIService";

export default function ChangeStateDialog({ dialog, setOpen }) {
  const { open, roomId, officeId, workplaceId } = dialog;
  const { alert } = useContext(AppContext);
  const { workplaces } = useContext(WorkplaceContext);
  const [state, setState] = useState("");

  const handleClose = () => {
    setOpen({ open: false });
    setState("");
  };

  const onChange = useCallback((event) => setState(event.target.value), []);

  useEffect(() => {
    if (typeof roomId !== "undefined") {
      const workplace = _.find(workplaces.value, function (obj) {
        return obj.unique_number === workplaceId;
      });
      setState(workplace.state);
    }
  }, [roomId, workplaceId, workplaces.value]);

  const updateWorkplaceState = async () => {
    await APIService
      .updateWorkplaceState(
        officeId,
        roomId,
        workplaceId,
        { state: state }
      )
      .then((response) => {
        if (typeof response.state !== "undefined" && response.state === state) {
          workplaces.setWorkplaces(
            _.map(workplaces.value, function (a) {
              if (a.unique_number === workplaceId) {
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
        handleClose={handleClose}
        state={state}
        choices={workplaceState}
        onChange={onChange}
        updateState={updateWorkplaceState}
        name="workplace"
      />
    </div>
  );
}
