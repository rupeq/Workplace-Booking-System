import Grid from "@material-ui/core/Grid";
import React, { useCallback } from "react";
import InputField from "../input/inputField";
import { changeFieldName } from "../../service/changeFieldName";
import Typography from "@material-ui/core/Typography";
import {fieldValidation} from "../workplaces/workplaceDetail";
import {ValidationService} from "../../service/ValidationService";

export default function GridOwnerCompanyBlock({ owner, changeState }) {
  const updateOwnerState = useCallback(
    (field) => (event) => {
      owner[field] = event.target.value;
      changeState(owner);
    },
    [changeState, owner]
  );

  return (
    <>
      <Typography variant="h5">Owner company</Typography>
      {["title", "address"].map((field) => (
        <Grid key={field} item xs={12}>
          <InputField
            label={changeFieldName(field)}
            field={owner[field]}
            error={field === "title" ? fieldValidation(owner[field], ValidationService.validateName) : fieldValidation(owner[field], ValidationService.validateAddress)}
            setField={updateOwnerState(field)}
          />
        </Grid>
      ))}
    </>
  );
}
