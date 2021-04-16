import React, { useState } from "react";
import WorkplaceListItem from "./workplaceListItem";

export default function WorkplacesGroup({
  workplaces,
  officeModerator,
  openDeleteDialog,
  openChangeDialog,
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {workplaces.map((workplace) => (
        <WorkplaceListItem
          key={workplace.unique_number}
          workplace={workplace}
          expanded={expanded}
          setExpanded={setExpanded}
          openDeleteDialog={openDeleteDialog}
          openChangeDialog={openChangeDialog}
          officeModerator={officeModerator}
        />
      ))}
    </>
  );
}
