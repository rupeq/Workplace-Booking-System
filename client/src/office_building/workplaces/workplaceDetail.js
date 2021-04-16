import React, { useState, useEffect, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useHistory, useParams } from "react-router";
import InputField from "../input/inputField";
import { empty_workplace } from "../blankObjects";
import { AppContext } from "../officesView";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/user/userSlice";
import { useStyles } from "../edit_office/officeDetail";
import UniverseSelect from "../select/universeSelect";
import WorkplaceDetailButton from "./workplaceDetailButton";
import {
  workplaceClass,
  workplaceState,
  workplaceType,
} from "../select/selectChoices";
import Typography from "@material-ui/core/Typography";
import {APIService} from "../../service/APIService";
import {ValidationService} from "../../service/ValidationService";

export const fieldValidation = (value, validator) => {
  try {
      return !validator(value);
  } catch (e) {
      return true;
  }
};

export default function WorkplaceDetail({ create = false }) {
  const classes = useStyles();
  const { officeId, roomId, workplaceId } = useParams();
  const { alert } = useContext(AppContext);
  const history = useHistory();
  const user = useSelector(selectUser);
  const [workplace, setWorkplace] = useState(null);
  const [initialWorkplace, setInitialWorkplace] = useState(null);

  useEffect(() => {
    async function fetchWorkplace() {
      await APIService.getWorkplace(officeId, roomId, workplaceId).then((response) => {
        if (typeof response.detail === "undefined") {
          alert.openSnackbar({
            open: true,
            message: "Load workplace info!",
            type: "success",
          });
          setWorkplace(response);
          setInitialWorkplace(response);
        } else {
          alert.openSnackbar({
            open: true,
            message: response.detail,
            type: "error",
          });
          history.push(`/offices/${officeId}/rooms/${roomId}/workplaces/`);
        }
      });
    }

    if (!create) {
      fetchWorkplace().then();
    } else {
      if (user && user.user_role === "MO") {
        let copiedWorkplace = JSON.parse(JSON.stringify(empty_workplace));
        copiedWorkplace.room_id = roomId;
        setWorkplace(copiedWorkplace);
      } else {
        history.push(`/offices/${officeId}/rooms/${roomId}/workplaces/`);
        alert.openSnackbar({
          open: true,
          message: "You have mo permissions for this action",
          type: "error",
        });
      }
    }
    // eslint-disable-next-line
  }, [history, create, officeId]);

  const changeState = (field, check = false) => (event) => {
    const newValue = !check ? event.target.value : event.target.checked;
    setWorkplace({ ...workplace, [field]: newValue });
  };

  return (
    <Paper className={classes.paper} elevation={3}>
      {workplace && (
        <div className={classes.root}>
          <Typography variant={"h2"} className={classes.header}>
            Workplace
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <InputField
                label={"Unique number"}
                field={workplace.unique_number}
                error={fieldValidation(workplace.unique_number, ValidationService.validateUniqueNumber)}
                setField={changeState("unique_number")}
                readOnly={!create}
              />
            </Grid>
            <Grid item xs={6}>
              <InputField
                label={"Inventory number:"}
                field={workplace.inventory_number}
                error={fieldValidation(workplace.inventory_number, ValidationService.validateInventoryNumber)}
                setField={changeState("inventory_number")}
              />
            </Grid>
            <Grid item xs={6}>
              <Grid item xs={12}>
                <UniverseSelect
                  title="State"
                  choices={workplaceState}
                  state={workplace.state}
                  changeState={changeState("state")}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  label={"Indoor location"}
                  field={workplace.indoor_location}
                  error={fieldValidation(workplace.indoor_location, ValidationService.validateIndoorLocation)}
                  setField={changeState("indoor_location")}
                />
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid item xs={12}>
                <UniverseSelect
                  title="Type"
                  choices={workplaceType}
                  state={workplace.workplace_type}
                  changeState={changeState("workplace_type")}
                />
              </Grid>
              <Grid item xs={12}>
                <UniverseSelect
                  title="Class"
                  choices={workplaceClass}
                  state={workplace.workplace_class}
                  changeState={changeState("workplace_class")}
                />
              </Grid>
            </Grid>
          </Grid>
          <WorkplaceDetailButton
            officeId={officeId}
            workplace={workplace}
            initialWorkplace={initialWorkplace}
            create={create}
          />
        </div>
      )}
    </Paper>
  );
}
