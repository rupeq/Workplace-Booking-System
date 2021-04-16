import Grid from "@material-ui/core/Grid";
import React from "react";
import InputField from "../input/inputField";
import { changeFieldName } from "../../service/changeFieldName";
import Typography from "@material-ui/core/Typography";
import {fieldValidation} from "../workplaces/workplaceDetail";
import {ValidationService} from "../../service/ValidationService";

export default function GridSizeInfoBlock({ office, changeState }) {
  const validatorChoice = (field) => {
      if (field === "building_area" || field === "rentable_area") {
          return ValidationService.validateFloatNumber;
      }

      return ValidationService.validateInteger;
  };

  return (
    <>
      <Typography variant={"h5"}>Measurements</Typography>
      {[
        "building_area",
        "floors_count",
        "rentable_area",
        "rentable_floors_count",
      ].map((field) => (
        <Grid key={field} item xs={12}>
          <InputField
            label={changeFieldName(field)}
            field={office[field]}
            error={fieldValidation(office[field], validatorChoice(field))}
            setField={changeState(field)}
          />
        </Grid>
      ))}
    </>
  );
}
