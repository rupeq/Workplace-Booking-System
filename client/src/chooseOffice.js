import React, { useCallback, useEffect, useState } from "react";
import {APIService} from "./service/APIService";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {useHistory} from "react-router";

export default function ChooseOffice({ dialog, setOpen }) {
  const {open, field} = dialog;
  const history = useHistory();
  const [state, setState] = useState("");
  const [offices, setOffices] = useState([]);

  const handleClose = () => {
    setOpen({ open: false });
    setState("");
  };

  useEffect(() => {
    async function fetchOffices() {
      await APIService.getOfficeBuildings().then(response => {
        setOffices(response);
      });
    }

    fetchOffices().then();
  }, []);

  const openPage = () => {
    if (state !== "") {
      history.push(`/offices/${state}/${field}/`);
    }
  };

  const onChange = useCallback((event) => setState(event.target.value), []);

  return (
    <div>
      <Dialog
      fullWidth={true}
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Open office {field}</DialogTitle>
      <DialogContent>
        {offices &&
          <FormControl
              variant="outlined"
              required={true}
              fullWidth={true}
          >
            <InputLabel id="demo-simple-select-outlined-label">Office</InputLabel>
            <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={state}
                onChange={onChange}
                label="Room class"
            >
              {offices.map((office) => (
                  <MenuItem key={office.unique_number} value={office.unique_number}>
                    {`${office.name} ${office.unique_number}`}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={openPage} color="primary">
          Open
        </Button>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
    </div>
  );
}
