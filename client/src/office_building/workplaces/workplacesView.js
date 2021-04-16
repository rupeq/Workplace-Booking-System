import React, { createContext, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { useHistory, useParams } from "react-router";
import WorkplacesGroup from "./workplacesGroup";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Button } from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/user/userSlice";
import { useStyles } from "../officesView";
import WorkplaceDetail from "./workplaceDetail";
import ChangeStateDialog from "./changeStateDialog";
import DeleteRoomDialog from "./deleteWorkplaceDialog";
import {APIService} from "../../service/APIService";
import EmptyPageContent from "../../emptyPageContent";
import LinearProgress from "@material-ui/core/LinearProgress";

export const WorkplaceContext = createContext();

export default function WorkplacesView({ openSnackbar, office }) {
  const classes = useStyles();
  const history = useHistory();
  const user = useSelector(selectUser);
  const { officeId, roomId } = useParams();
  const [room, setRoom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workplaces, setWorkplaces] = useState(null);
  const [deleteDialog, setOpenDeleteDialog] = useState({ open: false });
  const [changeDialog, setOpenChangeDialog] = useState({ open: false });

  const openCreatePage = () => {
    if (user.username !== office.office_moderator_username) {
      openSnackbar({
        open: true,
        message:
          "You don't have permissions for creating workplaces for this office building!",
        type: "info",
      });
    } else if (!["Designed", "Commissioned"].includes(room.state)) {
      openSnackbar({
        open: true,
        message: `Can't create workplace in office with '${room.state}' state`,
        type: "info",
      });
    } else {
      history.push(`/offices/${officeId}/rooms/${roomId}/workplaces/create`);
    }
  };

  useEffect(() => {
    async function fetchWorkplaces() {
      setLoading(true);
      await APIService.getWorkplaces(officeId, roomId).then((response) => {
        if (typeof response.detail !== "undefined") {
          openSnackbar({
            open: true,
            message: "You need to login!",
            type: "info",
          });
          history.push("/SignIn/");
        } else {
          setWorkplaces(response);
          APIService
            .getOfficeRoom(officeId, roomId)
            .then((response) => setRoom(response));
        }
        setLoading(false);
      });
    }

    fetchWorkplaces().then();
  }, [history, officeId, openSnackbar, roomId]);

  if (loading) {
    return (
        <LinearProgress />
    );
  }

  return (
    <div>
      <WorkplaceContext.Provider
        value={{
          workplaces: { value: workplaces, setWorkplaces: setWorkplaces },
        }}
      >
        <ChangeStateDialog
          dialog={changeDialog}
          setOpen={setOpenChangeDialog}
        />
        <DeleteRoomDialog state={deleteDialog} setOpen={setOpenDeleteDialog} />
        <Switch>
          <Route
            exact
            path={"/offices/:officeId/rooms/:roomId/workplaces/create"}
          >
            <WorkplaceDetail create={true} />
          </Route>
          <Route
            path={"/offices/:officeId/rooms/:roomId/workplaces/:workplaceId"}
          >
            <WorkplaceDetail />
          </Route>
          <Route exact path="/offices/:officeId/rooms/:roomId/workplaces">
            {loading ? <h1>Hello</h1> : (
              <>
                {user && user.user_role === "MO" && (
                    <ButtonGroup
                        aria-label="outlined primary button group"
                        className={classes.buttonGroupMargin}
                    >
                      <Button onClick={openCreatePage}>
                        <AddBoxIcon/> Create
                      </Button>
                      <Button disabled>Future option</Button>
                    </ButtonGroup>
                )}
                { workplaces.length < 1 ?
                  <EmptyPageContent page="Office workplaces" message="Currently no workplaces have been created in this room"/> :
                  <WorkplacesGroup
                      workplaces={workplaces}
                      officeModerator={office.office_moderator_username}
                      openDeleteDialog={setOpenDeleteDialog}
                      openChangeDialog={setOpenChangeDialog}
                  />
                }
              </>
            )
          }
          </Route>
        </Switch>
      </WorkplaceContext.Provider>
    </div>
  );
}
