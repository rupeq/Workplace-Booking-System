export let empty_office = {
  unique_number: "",
  name: "",
  full_address: { country: "", city: "", address: "" },
  building_area: "",
  floors_count: "",
  rentable_area: "",
  rentable_floors_count: "",
  owner_company: { title: "", address: "" },
  office_manager: {
    first_name: "",
    last_name: "",
    middle_name: "",
    phone_number: "",
  },
  state: "",
  office_moderator_username: "",
  warehouse_manager_username: "",
};

export let empty_room = {
  unique_number: "",
  floor_number: "",
  room_area: "",
  room_class: "",
  total_available_workplace: "",
  permanent_workplace: "",
  temporal_workplace: "",
  MFU: false,
  conditioner: false,
  room_type: "",
  state: "",
  office_id: "",
};

export let empty_workplace = {
  unique_number: "",
  inventory_number: "",
  workplace_type: "",
  workplace_class: "",
  indoor_location: "",
  state: "",
  room_id: "",
};

export let empty_equipment = {
  inventory_number: "",
  state: "",
  item_class: "",
  office_id: "",
  workplace_id: "",
  name: "",
};
