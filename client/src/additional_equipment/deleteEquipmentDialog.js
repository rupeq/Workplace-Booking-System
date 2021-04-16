import React, { useContext } from "react";
import DeleteDialog from "../office_building/dialogs/deleteDialog";
import _ from "lodash";
import { EquipmentContext } from "./equipmentView";
import { APIService } from "../service/APIService";
import { pageElementCount } from "./equipmentList";

export default function DeleteEquipmentDialog({
  itemState,
  state,
  setOpen,
  displayEquipment,
  page,
}) {
  const { open, officeId, equipmentId } = state;
  const { equipment, alert } = useContext(EquipmentContext);

  const handleClose = () => {
    setOpen({ open: false });
  };

  const handleDelete = async () => {
    await APIService.deleteEquipmentItem(itemState, officeId, equipmentId).then(
      (response) => {
        if (response === "") {
          _.remove(equipment.value, function (object) {
            return object.inventory_number === equipmentId;
          });
          equipment.setEquipment(equipment.value);
          displayEquipment(
            equipment.value.slice(
              (page - 1) * pageElementCount,
              page * pageElementCount
            )
          );
          alert.openSnackbar({
            open: true,
            message: "Successfully delete equipment!",
            type: "success",
          });
        } else {
          alert.openSnackbar({
            open: true,
            message: response.detail,
            type: "error",
          });
        }
        handleClose();
      }
    );
  };

  return (
    <div>
      <DeleteDialog
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
        name="equipment"
      />
    </div>
  );
}
