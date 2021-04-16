import React, { useContext, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useParams } from "react-router";
import {APIService} from "../../service/APIService";
import InputField from "../input/inputField";
import GridAddressBlock from "./gridAddressBlock";
import GridOfficeManagerBlock from "./gridOfficeManagerBlock";
import GridSizeInfoBlock from "./gridSizeInfoBlock";
import GridOwnerCompanyBlock from "./gridOwnerCompanyBlock";
import { empty_office } from "../blankObjects";
import ManageButton from "./manageButton";
import { AppContext } from "../officesView";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/user/userSlice";
import UniverseSelect from "../select/universeSelect";
import { officeState } from "../select/selectChoices";
import Typography from "@material-ui/core/Typography";
import {fieldValidation} from "../workplaces/workplaceDetail";
import {ValidationService} from "../../service/ValidationService";

export const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    minHeight: "300px",
    padding: "40px",
  },
  header: {
    marginBottom: "10px",
  },
  formControl: {
    margin: 0,
  },
  submitButton: {
    minWidth: "150px",
  },
}));

export default function OfficeDetail({ create = false }) {
  const classes = useStyles();
  let { officeId } = useParams();
  const { alert } = useContext(AppContext);
  const history = useHistory();
  const user = useSelector(selectUser);
  const [office, setOffice] = useState(null);

  useEffect(() => {
    async function fetchOffice() {
      await APIService.getOfficeBuilding(officeId).then((response) => {
        if (typeof response.detail === "undefined") {
          alert.openSnackbar({
            open: true,
            message: "Load office building info!",
            type: "success",
          });
          setOffice(response);
        } else {
          alert.openSnackbar({
            open: true,
            message: response.detail,
            type: "error",
          });
          history.push("/offices/");
        }
      });
    }

    if (!create) {
      fetchOffice().then();
    } else {
      if (user && user.user_role === "MO") {
        let copiedOffice = JSON.parse(JSON.stringify(empty_office));
        copiedOffice.office_moderator_username = user.username;
        setOffice(copiedOffice);
      } else {
        history.push("/offices/");
        alert.openSnackbar({
          open: true,
          message: "You have mo permissions for this action",
          type: "error",
        });
      }
    }
    // eslint-disable-next-line
  }, [history, create, officeId]);

  const changeState = (field) => (event) => {
    setOffice({ ...office, [field]: event.target.value });
  };

  const changeNestedObject = (field) => (value) => {
    setOffice({ ...office, [field]: value });
  };

  return (
    <Paper className={classes.paper} elevation={3}>
      {office && (
        <div className={classes.root}>
          <Typography variant={"h2"} className={classes.header}>
            Office
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <InputField
                label={"Unique number"}
                field={office.unique_number}
                error={fieldValidation(office.unique_number, ValidationService.validateUniqueNumber)}
                setField={changeState("unique_number")}
                readOnly={!create}
              />
            </Grid>
            <Grid item xs={6}>
              <InputField
                label={"Name"}
                field={office.name}
                error={fieldValidation(office.name, ValidationService.validateOfficeName)}
                setField={changeState("name")}
              />
            </Grid>
            <Grid item xs={6}>
              <UniverseSelect
                state={office.state}
                changeState={changeState("state")}
                title="State"
                choices={officeState}
              />
            </Grid>
            <Grid item xs={6}>
              <InputField
                label={"Warehouse manager"}
                field={office.warehouse_manager_username}
                error={fieldValidation(office.warehouse_manager_username, ValidationService.validateUsername)}
                setField={changeState("warehouse_manager_username")}
              />
            </Grid>
            <Grid item xs={6}>
              <GridSizeInfoBlock office={office} changeState={changeState} />
            </Grid>
            <Grid item xs={6}>
              <GridOfficeManagerBlock
                office_manager={office.office_manager}
                changeState={changeNestedObject("office_manager")}
              />
            </Grid>
            <Grid item xs={6}>
              <GridOwnerCompanyBlock
                owner={office.owner_company}
                changeState={changeNestedObject("owner_company")}
              />
            </Grid>
            <Grid item xs={6}>
              <GridAddressBlock
                full_address={office.full_address}
                changeState={changeNestedObject("full_address")}
              />
            </Grid>
          </Grid>
          <ManageButton office={office} setOffice={setOffice} create={create} />
        </div>
      )}
    </Paper>
  );
}
