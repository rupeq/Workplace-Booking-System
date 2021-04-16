import Grid from "@material-ui/core/Grid";
import React, { useCallback } from "react";
import InputField from "../input/inputField";
import { changeFieldName } from "../../service/changeFieldName";
import Typography from "@material-ui/core/Typography";
import {ValidationService} from "../../service/ValidationService";
import {fieldValidation} from "../workplaces/workplaceDetail";

export default function GridAddressBlock({ full_address, changeState }) {
  const updateAddressState = useCallback(
    (field) => (event) => {
      full_address[field] = event.target.value;
      changeState(full_address);
    },
    [changeState, full_address]
  );

  const validatorChoice = (field) => {
      if (field === "city" || field === "country") {
          return ValidationService.validateName;
      }

      return ValidationService.validateAddress;
  };

  return (
    <>
      <Typography variant="h5">Full address</Typography>
      {["country", "city", "address"].map((field) => (
        <Grid key={field} item xs={12}>
          <InputField
            label={changeFieldName(field)}
            field={full_address[field]}
            error={fieldValidation(full_address[field], validatorChoice(field))}
            setField={updateAddressState(field)}
          />
        </Grid>
      ))}
    </>
  );
}
