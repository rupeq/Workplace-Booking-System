import InputLabel from "@material-ui/core/InputLabel";
import { useStyles } from "../input/inputField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import React from "react";

export default function UniverseSelect({ state, changeState, choices, title }) {
  const classes = useStyles();

  return (
    <FormControl
      variant="outlined"
      required={true}
      fullWidth={true}
      className={classes.textField}
    >
      <InputLabel id="demo-simple-select-outlined-label">{title}</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={state}
        onChange={changeState}
        label="Room class"
      >
        {choices.map((choice) => (
          <MenuItem key={choice[1]} value={choice[0]}>
            {choice[1]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
