import Grid from "@material-ui/core/Grid";
import React, { useCallback } from "react";
import InputField from "../input/inputField";
import { changeFieldName } from "../../service/changeFieldName";
import Typography from "@material-ui/core/Typography";
import {fieldValidation} from "../workplaces/workplaceDetail";
import {ValidationService} from "../../service/ValidationService";

export default function GridOfficeManagerBlock({
  office_manager,
  changeState,
}) {
  const updateOfficeManagerState = useCallback(
    (field) => (event) => {
      office_manager[field] = event.target.value;
      changeState(office_manager);
    },
    [changeState, office_manager]
  );

  return (
    <>
      <Typography variant="h5">Office manager</Typography>
      {["first_name", "last_name", "middle_name", "phone_number"].map(
        (field) => (
          <Grid key={field} item xs={12}>
            <InputField
              label={changeFieldName(field)}
              field={office_manager[field]}
              error={field === "phone_number" ? false : fieldValidation(office_manager[field], ValidationService.validateName)}
              setField={updateOfficeManagerState(field)}
            />
          </Grid>
        )
      )}
    </>
  );
}
