import React, { useCallback, useContext, useEffect, useState } from "react";
import _ from "lodash";
import { AppContext } from "../officesView";
import { officeState } from "../select/selectChoices";
import ChangeDialog from "./changeDialog";
import {APIService} from "../../service/APIService";

export default function ChangeStateDialog({ dialog, setOpen }) {
  const { open, officeId } = dialog;
  const { offices, alert } = useContext(AppContext);
  const [state, setState] = useState("");

  const handleClose = () => {
    setOpen({ open: false });
    setState("");
  };

  useEffect(() => {
    if (typeof officeId !== "undefined") {
      const office = _.find(offices.value, function (obj) {
        return obj.unique_number === officeId;
      });
      setState(office.state);
    }
    // eslint-disable-next-line
  }, [officeId]);

  const onChange = useCallback((event) => setState(event.target.value), []);

  const updateOfficeState = async () => {
    await APIService
      .updateOfficeState(officeId, { state: state })
      .then((response) => {
        if (typeof response.state !== "undefined" && response.state === state) {
          offices.setOffices(
            _.map(offices.value, function (a) {
              if (a.unique_number === officeId) {
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
        choices={officeState}
        onChange={onChange}
        updateState={updateOfficeState}
        name="office building"
      />
    </div>
  );
}
