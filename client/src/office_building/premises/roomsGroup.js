import React, { useContext, useState } from "react";
import RoomsListItem from "./roomsListItem";
import { RoomContext } from "./premisesView";

export default function RoomsGroup({
  officeModerator,
  dialogOpen,
  openDeleteDialog,
  openChangeDialog,
}) {
  const { rooms } = useContext(RoomContext);
  const [expanded, setExpanded] = useState(false);
  const { value } = rooms;

  return (
    <>
      {value.map((room) => (
        <RoomsListItem
          key={room.unique_number}
          room={room}
          expanded={expanded}
          setExpanded={setExpanded}
          dialogOpen={dialogOpen}
          openDeleteDialog={openDeleteDialog}
          openChangeDialog={openChangeDialog}
          officeModerator={officeModerator}
        />
      ))}
    </>
  );
}
