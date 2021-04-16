import React, { useEffect, useState, createContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import OfficesGroup from "./officesGroup";
import OfficeDetailDialog from "./dialogs/officeDetailDialog";
import { Route, Switch } from "react-router-dom";
import UpdateOffice from "./updateOffice";
import CreateOffice from "./createOffice";
import { Button } from "@material-ui/core";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { useHistory } from "react-router";
import DeleteOfficeDialog from "./dialogs/deleteOfficeDialog";
import ChangeStateDialog from "./dialogs/changeStateDialog";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user/userSlice";
import RoomView from "./premises/premisesView";
import {APIService} from "../service/APIService";
import EquipmentView from "../additional_equipment/equipmentView";
import LinearProgress from "@material-ui/core/LinearProgress";
import EmptyPageContent from "../emptyPageContent";
import _ from "lodash";

export const useStyles = makeStyles(() => ({
  root: {
    width: "80%",
    margin: "Auto",
    padding: "20px 0px",
  },
  buttonGroupMargin: {
    marginBottom: "10px",
  },
}));

export const AppContext = createContext();

export default function OfficeView({ snackbar, openSnackbar }) {
  const classes = useStyles();
  const history = useHistory();
  const user = useSelector(selectUser);
  const [offices, setOffices] = useState([]);
  const [dialog, dialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setOpenDeleteDialog] = useState({ open: false });
  const [changeDialog, setOpenChangeDialog] = useState({ open: false });

  const openCreatePage = () => {
    history.push("/offices/create/");
  };

  useEffect(() => {
    async function fetchOffices() {
      await APIService.getOfficeBuildings().then((response) => {
        setLoading(true);
        if (typeof response.detail !== "undefined") {
          openSnackbar({
            open: true,
            message: "You need to login!",
            type: "info",
          });
          history.push("/SignIn/");
        } else {
          const response_offices = _.sortBy(response, ["full_address.country", "full_address.city"]);
          setOffices(response_offices);
        }
        setLoading(false);
      });
    }

    fetchOffices().then();
  }, [history, openSnackbar]);

  if (loading) {
    return (
        <LinearProgress />
    );
  }

  return (
    <div className={classes.root}>
      <AppContext.Provider
        value={{
          offices: { value: offices, setOffices: setOffices },
          alert: { snackbar: snackbar, openSnackbar: openSnackbar },
        }}
      >
        <OfficeDetailDialog dialog={dialog} dialogOpen={dialogOpen} />
        <ChangeStateDialog
          dialog={changeDialog}
          setOpen={setOpenChangeDialog}
        />
        <DeleteOfficeDialog
          state={deleteDialog}
          setOpen={setOpenDeleteDialog}
        />
        <Switch>
          <Route path="/offices/:officeId/rooms/">
            <RoomView openSnackbar={openSnackbar} />
          </Route>
          <Route path="/offices/:officeId/equipment/">
            <EquipmentView snackbar={snackbar} openSnackbar={openSnackbar} />
          </Route>
          <Route exact path="/offices/create">
            <CreateOffice />
          </Route>
          <Route path="/offices/:officeId">
            <UpdateOffice />
          </Route>
          <Route exact path="/offices/">
            {user && user.user_role === "MO" && (
              <ButtonGroup
                aria-label="outlined primary button group"
                className={classes.buttonGroupMargin}
              >
                <Button onClick={openCreatePage}>
                  <AddBoxIcon /> Create
                </Button>
                <Button disabled>Future option</Button>
              </ButtonGroup>
            )}
            { offices.length < 1 ?
              <EmptyPageContent page="Office buildings" message="Currently no office buildings have been created"/> :
              <OfficesGroup
                  dialogOpen={dialogOpen}
                  openDeleteDialog={setOpenDeleteDialog}
                  openChangeDialog={setOpenChangeDialog}
              />
            }
          </Route>
        </Switch>
      </AppContext.Provider>
    </div>
  );
}
