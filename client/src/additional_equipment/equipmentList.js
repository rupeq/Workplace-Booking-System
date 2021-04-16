import React, { useContext, useEffect, useState } from "react";
import { APIService } from "../service/APIService";
import List from "@material-ui/core/List";
import EquipmentListItem from "./equipmentListItem";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import { EquipmentContext } from "./equipmentView";
import DeleteEquipmentDialog from "./deleteEquipmentDialog";
import Pagination from "@material-ui/lab/Pagination";
import ChangeUsagePlace from "./setUsagePlaceDialog";
import LinearProgress from "@material-ui/core/LinearProgress";
import EmptyPageContent from "../emptyPageContent";
import {changeFieldName} from "../service/changeFieldName";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "1000px",
    margin: "auto",
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    minHeight: "600px",
  },
  header: {
    textAlign: "left",
  },
}));

export const pageElementCount = 10;

export default function EquipmentList({ state, officeId, equipment_manager }) {
  const classes = useStyles();
  const { equipment } = useContext(EquipmentContext);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [displayEquipment, setDisplayEquipment] = useState([]);
  const [deleteDialog, setOpenDeleteDialog] = useState({ open: false });
  const [changeDialog, openChangeDialog] = useState({ open: false });

  useEffect(() => {
    APIService.getEquipment(state, officeId).then((response) => {
      setLoading(true);
      if (Array.isArray(response)) {
        equipment.setEquipment(response);
        setDisplayEquipment(
          response.slice((page - 1) * pageElementCount, page * pageElementCount)
        );
      }
      setLoading(false);
    });
    // eslint-disable-next-line
  }, [state, officeId]);

  if (loading) {
    return (
        <LinearProgress />
    );
  }

  if (displayEquipment.length < 1) {
    return (
      <EmptyPageContent page={changeFieldName(state)} message={`Currently no such equipment have been created`}/>
    );
  }

  return (
    <>
      {displayEquipment && (
        <>
          <DeleteEquipmentDialog
            itemState={state}
            state={deleteDialog}
            setOpen={setOpenDeleteDialog}
            displayEquipment={setDisplayEquipment}
            page={page}
          />
          <ChangeUsagePlace
            equipmentAlias={state}
            dialog={changeDialog}
            setOpen={openChangeDialog}
          />
          <div className={classes.container}>
            <div className={classes.root}>
              <List component="nav" aria-label="main mailbox folders">
                {displayEquipment.map((element) => (
                  <EquipmentListItem
                    key={element.inventory_number}
                    single_element={element}
                    equipment={state}
                    openDeleteDialog={setOpenDeleteDialog}
                    openChangeDialog={openChangeDialog}
                    equipment_manager={equipment_manager}
                  />
                ))}
              </List>
              <Divider />
            </div>
          </div>
          <div>
            <PaginationControlled
              page={page}
              setPage={setPage}
              equipment={equipment}
              setEquipment={setDisplayEquipment}
            />
          </div>
        </>
      )}
    </>
  );
}

export function PaginationControlled({
  page,
  setPage,
  equipment,
  setEquipment,
}) {
  const handleChange = (event, value) => {
    setPage(value);
    setEquipment(
      equipment.value.slice(
        (value - 1) * pageElementCount,
        value * pageElementCount
      )
    );
  };

  return (
    <div>
      <Pagination
        page={page}
        count={Math.trunc(equipment.value.length / pageElementCount) + 1}
        variant="outlined"
        shape="rounded"
        style={{ float: "right" }}
        onChange={handleChange}
      />
    </div>
  );
}
