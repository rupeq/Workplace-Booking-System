import React, { useContext, useState } from "react";
import OfficeListItem from "./officeListItem";
import { AppContext } from "./officesView";

export default function OfficesGroup({
  dialogOpen,
  openDeleteDialog,
  openChangeDialog,
}) {
  const { offices } = useContext(AppContext);
  const [expanded, setExpanded] = useState(false);
  const { value } = offices;

  return (
    <>
      {value.map((office) => (
        <OfficeListItem
          key={office.unique_number}
          office={office}
          expanded={expanded}
          setExpanded={setExpanded}
          dialogOpen={dialogOpen}
          openDeleteDialog={openDeleteDialog}
          openChangeDialog={openChangeDialog}
        />
      ))}
    </>
  );
}
