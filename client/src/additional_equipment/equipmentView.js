import React, {createContext, useEffect, useState} from "react";
import { Button } from "@material-ui/core";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import EventSeatIcon from "@material-ui/icons/EventSeat";
import LaptopIcon from "@material-ui/icons/Laptop";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { useParams, useHistory } from "react-router";
import EquipmentList from "./equipmentList";
import Typography from "@material-ui/core/Typography";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { Route, Switch } from "react-router-dom";
import EquipmentDetail from "./equipmentDetail";
import { useStyles } from "./equipmentListItem";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user/userSlice";
import {APIService} from "../service/APIService";
const states = ["tables", "chairs", "additional_equipment"];

export const EquipmentContext = createContext();

export default function EquipmentView({ snackbar, openSnackbar }) {
  const { officeId } = useParams();
  const [state, setState] = useState(states[0]);
  const history = useHistory();
  const classes = useStyles();
  const [equipment, setEquipment] = useState([]);
  const user = useSelector(selectUser);
  const [office, setOffice] = useState(null);

  useEffect(() => {
    async function fetchOffice() {
      await APIService.getOfficeBuilding(officeId).then((response) => {
        setOffice(response);
      });
    }

    fetchOffice().then();
  }, []);

  const changeState = (value) => () => {
    setState(value);
  };

  const openCreateView = () => {
    history.push(`/offices/${officeId}/equipment/create`);
  };

  return (
    <div>
      <EquipmentContext.Provider
        value={{
          equipment: { value: equipment, setEquipment: setEquipment },
          alert: { snackbar: snackbar, openSnackbar: openSnackbar },
        }}
      >
        <Switch>
          <Route path="/offices/:officeId/equipment/create/">
            <EquipmentDetail state={state} create={true} />
          </Route>
          <Route path="/offices/:officeId/equipment/:equipmentId/">
            <EquipmentDetail state={state} />
          </Route>
          <Route path="/offices/:officeId/equipment/">
            <Typography variant="h3" className={classes.officeId}>
              Office: {officeId}
            </Typography>
            <div className={classes.block}>
              {user && user.user_role === "WM" && office && office.warehouse_manager_username === user.username && (
                <ButtonGroup aria-label="outlined primary button group">
                  <Button onClick={openCreateView}>
                    <AddBoxIcon /> Create
                  </Button>
                  <Button disabled>Future option</Button>
                </ButtonGroup>
              )}
            </div>
            <ButtonGroup aria-label="outlined primary button group" style={{marginBottom: "20px"}}>
              <Button onClick={changeState(states[0])}>
                <AssignmentIcon /> Table
              </Button>
              <Button onClick={changeState(states[1])}>
                <EventSeatIcon /> Chair
              </Button>
              <Button onClick={changeState(states[2])}>
                <LaptopIcon /> Additional equipment
              </Button>
            </ButtonGroup>
            <EquipmentList state={state} officeId={officeId} equipment_manager={office && office.warehouse_manager_username}/>
          </Route>
        </Switch>
      </EquipmentContext.Provider>
    </div>
  );
}
