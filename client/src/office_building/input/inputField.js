import TextField from "@material-ui/core/TextField";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({
  textField: {
    marginBottom: "10px",
  },
}));

export default function InputField({
  label,
  field,
  setField,
  readOnly = false,
  error = false
}) {
  const classes = useStyles();

  return (
    <TextField
      required
      fullWidth
      error={error}
      id="outlined-basic"
      label={label}
      variant="outlined"
      value={field}
      onChange={setField}
      className={classes.textField}
      InputProps={{
        readOnly: readOnly,
      }}
    />
  );
}
