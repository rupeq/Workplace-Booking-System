import Button from "@material-ui/core/Button";
import React from "react";

export default function ListItemButtonGroup({
  handleClickOpen,
  handleOpenEditPage,
  handleOpenChangeDialog,
  handleOpenDeleteDialog,
}) {
  return (
    <>
      <Button variant="contained" size="small" onClick={handleClickOpen}>
        Details
      </Button>
      <Button variant="contained" size="small" onClick={handleOpenEditPage}>
        Edit
      </Button>
      <Button variant="contained" size="small" onClick={handleOpenChangeDialog}>
        Change state
      </Button>
      <Button
        variant="contained"
        size="small"
        color="secondary"
        onClick={handleOpenDeleteDialog}
      >
        Delete
      </Button>
    </>
  );
}