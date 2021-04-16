import { useHistory, useParams } from "react-router";
import Button from "@material-ui/core/Button";
import React from "react";

export default function ListItemButtonGroup({
  workplaceId,
  openDeleteDialog,
  openChangeDialog,
}) {
  const history = useHistory();
  const { officeId, roomId } = useParams();

  const handleOpenEditPage = () => {
    history.push(
      `/offices/${officeId}/rooms/${roomId}/workplaces/${workplaceId}/`
    );
  };

  const handleOpenDialog = (openDialog) => () => {
    openDialog({
      open: true,
      roomId: roomId,
      officeId: officeId,
      workplaceId: workplaceId,
    });
  };

  return (
    <>
      <Button variant="contained" size="small" onClick={handleOpenEditPage}>
        Edit
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={handleOpenDialog(openChangeDialog)}
      >
        Change state
      </Button>
      <Button
        variant="contained"
        size="small"
        color="secondary"
        onClick={handleOpenDialog(openDeleteDialog)}
      >
        Delete
      </Button>
    </>
  );
}
