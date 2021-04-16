import { useHistory } from "react-router";
import _ from "lodash";
import Button from "@material-ui/core/Button";
import React, { useContext } from "react";
import { AppContext } from "../officesView";
import { useStyles } from "./officeDetail";
import { changeFieldName } from "../../service/changeFieldName";
import {APIService} from "../../service/APIService";
import {empty_office} from "../blankObjects";
import {ValidationService} from "../../service/ValidationService";
import ValidationError from "../../errors/ValidationError";

export default function ManageButton({ office, setOffice, create }) {
  const history = useHistory();
  const classes = useStyles();
  const { offices, alert } = useContext(AppContext);

  const inputFieldValidation = () => {
    let valid = true;

    try {
          ValidationService.validateUniqueNumber(office.unique_number);
          ValidationService.validateOfficeName(office.name);
          ValidationService.validateUsername(office.warehouse_manager_username);
          ValidationService.validateInteger(office.floors_count);
          ValidationService.validateInteger(office.rentable_floors_count);
          ValidationService.validateFloatNumber(office.building_area);
          ValidationService.validateFloatNumber(office.rentable_area);
          ValidationService.validateName(office.full_address.country);
          ValidationService.validateName(office.full_address.city);
          ValidationService.validateAddress(office.full_address.address);
          ValidationService.validateName(office.owner_company.title);
          ValidationService.validateAddress(office.owner_company.address);
          ValidationService.validateName(office.office_manager.first_name);
          ValidationService.validateName(office.office_manager.last_name);
          ValidationService.validateName(office.office_manager.middle_name);
    } catch (e) {
        if (e instanceof ValidationError) {
            alert.openSnackbar({
                open: true,
                message: e.message,
                type: "error",
            });
            valid = false;
        }
    }

    return valid;
  };

  const displaySerializerError = (responseContent) => {
    let errorMessage;
    const [field, message] = responseContent[0];

    if (!Array.isArray(message)) {
      errorMessage = Object.entries(message)[0][1];
    } else {
      errorMessage = [changeFieldName(field), message].join(": ");
    }
    return errorMessage;
  };

  const submitChanges = async (event) => {
    event.preventDefault();
    if (inputFieldValidation()) {
      await APIService
          .updateOfficeBuilding(office.unique_number, office)
          .then((response) => {
            const responseContent = Object.entries(response);

            if (responseContent.length === Object.keys(empty_office).length) {
              offices.setOffices(
                  _.map(offices.value, function (a) {
                    return a.unique_number === office.unique_number ? office : a;
                  })
              );
              history.push("/offices/");
              alert.openSnackbar({
                open: true,
                message: "Successfully changed!",
                type: "success",
              });
            } else {
              const errorMessage = displaySerializerError(responseContent);
              alert.openSnackbar({
                open: true,
                message: errorMessage,
                type: "error",
              });
            }
          });
    }
  };

  const createOffice = async (event) => {
    event.preventDefault();
    if (inputFieldValidation()) {
      await APIService.createOfficeBuilding(office).then((response) => {
        const responseContent = Object.entries(response);
        if (responseContent.length === Object.keys(empty_office).length) {
          offices.value.push(office);
          offices.setOffices(offices.value);
          history.push("/offices/");
          alert.openSnackbar({
            open: true,
            message: "Successfully created!",
            type: "success",
          });
        } else {
          const errorMessage = displaySerializerError(responseContent);

          alert.openSnackbar({
            open: true,
            message: errorMessage,
            type: "error",
          });
        }
      });
    }
  };

  return (
    <>
      {create ? (
        <Button
          size="large"
          variant="outlined"
          onClick={createOffice}
          className={classes.submitButton}
        >
          Create
        </Button>
      ) : (
        <Button
          size="large"
          variant="outlined"
          onClick={submitChanges}
          className={classes.submitButton}
        >
          Save
        </Button>
      )}
    </>
  );
}
