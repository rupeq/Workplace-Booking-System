import React, { useState, useEffect, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useHistory, useParams } from "react-router";
import InputField from "../office_building/input/inputField";
import { EquipmentContext } from "./equipmentView";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user/userSlice";
import { useStyles } from "../office_building/edit_office/officeDetail";
import UniverseSelect from "../office_building/select/universeSelect";
import Typography from "@material-ui/core/Typography";
import { APIService } from "../service/APIService";
import { empty_equipment } from "../office_building/blankObjects";
import { changeFieldName } from "../service/changeFieldName";
import {
  additionalEquipment,
  tableClass,
  chairClass,
  equipmentClass,
  equipmentState,
} from "../office_building/select/selectChoices";
import EquipmentDetailButton from "./equipmentDetailButton";
import {fieldValidation} from "../office_building/workplaces/workplaceDetail";
import {ValidationService} from "../service/ValidationService";

const selectValues = (name) => {
  switch (name) {
    case 'tables':
      return tableClass;
    case 'chairs':
      return chairClass;
    default:
      return equipmentClass;
  }
};

export default function EquipmentDetail({ state, create = false }) {
  const classes = useStyles();
  const { officeId, equipmentId } = useParams();
  const { alert } = useContext(EquipmentContext);
  const history = useHistory();
  const user = useSelector(selectUser);
  const [item, setItem] = useState(null);

  useEffect(() => {
    async function fetchEquipmentItem() {
      await APIService.getEquipmentItem(state, officeId, equipmentId).then(
        (response) => {
          if (typeof response.detail === "undefined") {
            alert.openSnackbar({
              open: true,
              message: `Load equipment info!`,
              type: "success",
            });
            setItem(response);
          } else {
            alert.openSnackbar({
              open: true,
              message: response.detail,
              type: "error",
            });
            history.push(`/offices/${officeId}/equipment/`);
          }
        }
      );
    }

    if (!create) {
      fetchEquipmentItem().then();
    } else {
      if (user && user.user_role === "WM") {
        let copiedEquipment = JSON.parse(JSON.stringify(empty_equipment));
        copiedEquipment.office_id = officeId;
        setItem(copiedEquipment);
      } else {
        history.push(`/offices/${officeId}/equipment/`);
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
    setItem({ ...item, [field]: newValue });
  };

  return (
    <Paper className={classes.paper} elevation={3}>
      {item && (
        <div className={classes.root}>
          <Typography variant="h2" className={classes.header}>
            {changeFieldName(state)}
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Grid item xs={12}>
                <InputField
                  label={"Inventory number"}
                  field={item.inventory_number}
                  error={fieldValidation(item.inventory_number, ValidationService.validateInventoryNumber)}
                  setField={changeState("inventory_number")}
                  readOnly={!create}
                />
              </Grid>
              {state === "additional_equipment" && (
                <Grid item xs={12}>
                  <UniverseSelect
                    title="Name"
                    choices={additionalEquipment}
                    state={item.name}
                    changeState={changeState("name")}
                  />
                </Grid>
              )}
            </Grid>
            <Grid item xs={6}>
              <Grid item xs={12}>
                <UniverseSelect
                  title="Class"
                  choices={selectValues(state)}
                  state={item.item_class}
                  changeState={changeState("item_class")}
                />
              </Grid>
              <Grid item xs={12}>
                <UniverseSelect
                  title="State"
                  choices={equipmentState}
                  state={item.state}
                  changeState={changeState("state")}
                />
              </Grid>
            </Grid>
          </Grid>
          <EquipmentDetailButton
            state={state}
            officeId={officeId}
            item={item}
            setItem={setItem}
            create={create}
          />
        </div>
      )}
    </Paper>
  );
}
