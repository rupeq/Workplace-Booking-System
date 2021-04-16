import React, { useEffect, useState, createContext } from "react";
import { Route, Switch } from "react-router-dom";
import {Button} from "@material-ui/core";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { useHistory, useParams } from "react-router";
import DeleteRoomDialog from "./deleteRoomDialog";
import ChangeStateDialog from "./changeStateDialog";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/user/userSlice";
import { useStyles } from "../officesView";
import RoomsGroup from "./roomsGroup";
import RoomsDetailDialog from "./roomDetailDialog";
import RoomDetail from "./roomDetail";
import WorkplacesView from "../workplaces/workplacesView";
import EmptyPageContent from "../../emptyPageContent";
import LinearProgress from "@material-ui/core/LinearProgress";
import {APIService} from "../../service/APIService";
import _ from "lodash";

export const RoomContext = createContext();

export default function RoomView({ openSnackbar }) {
  const classes = useStyles();
  const history = useHistory();
  let { officeId } = useParams();
  const user = useSelector(selectUser);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [office, setOffice] = useState([]);
  const [dialog, dialogOpen] = useState(false);
  const [deleteDialog, setOpenDeleteDialog] = useState({ open: false });
  const [changeDialog, setOpenChangeDialog] = useState({ open: false });

  const openCreatePage = () => {
    if (user.username !== office.office_moderator_username) {
      openSnackbar({
        open: true,
        message:
          "You don't have permissions for creating rooms for this office building!",
        type: "info",
      });
    } else if (!["Designed", "Commissioned"].includes(office.state)) {
      openSnackbar({
        open: true,
        message: `Can't create room in office with '${office.state}' state`,
        type: "info",
      });
    } else {
      history.push(`/offices/${officeId}/rooms/create/`);
    }
  };

  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      await APIService.getOfficeRooms(officeId).then((response) => {
        if (typeof response.detail !== "undefined") {
          openSnackbar({
            open: true,
            message: "You need to login!",
            type: "info",
          });
          history.push("/SignIn/");
        } else {
          const response_rooms = _.sortBy(response, ["floor_number"]);
          setRooms(response_rooms);
          APIService.getOfficeBuilding(officeId).then((response) => setOffice(response));
        }
        setLoading(false);
      });
    }

    fetchRooms().then();
    // eslint-disable-next-line
  }, [history]);

  if (loading) {
    return (
        <LinearProgress />
    );
  }

  return (
    <div>
      <RoomContext.Provider
        value={{
          rooms: { value: rooms, setRooms: setRooms },
        }}
      >
        <RoomsDetailDialog dialog={dialog} dialogOpen={dialogOpen} />
        <ChangeStateDialog
          dialog={changeDialog}
          setOpen={setOpenChangeDialog}
        />
        <DeleteRoomDialog state={deleteDialog} setOpen={setOpenDeleteDialog} />
        <Switch>
          <Route path={"/offices/:officeId/rooms/:roomId/workplaces"}>
            <WorkplacesView openSnackbar={openSnackbar} office={office} />
          </Route>
          <Route exact path={"/offices/:officeId/rooms/create"}>
            <RoomDetail create={true} />
          </Route>
          <Route path={"/offices/:officeId/rooms/:roomId"}>
            <RoomDetail />
          </Route>
          <Route exact path="/offices/:officeId/rooms">
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
            {rooms.length < 1 ?
              <EmptyPageContent page="Office rooms" message="Currently no rooms have been created"/> :
              <RoomsGroup
                  officeModerator={office.office_moderator_username}
                  dialogOpen={dialogOpen}
                  openDeleteDialog={setOpenDeleteDialog}
                  openChangeDialog={setOpenChangeDialog}
              />
            }
          </Route>
        </Switch>
      </RoomContext.Provider>
    </div>
  );
}