import os
from typing import Any

from pynamodb.attributes import (
    BooleanAttribute,
    MapAttribute,
    NumberAttribute,
    UnicodeAttribute,
)
from pynamodb.models import Model

from .enums import EquipmentClass, WorkplaceType
from .equipment_state import EquipmentState, RoomState, WorkplaceState

HOST = "http://dynamodb-local:8000"


class BaseModel(Model):
    class Meta:
        host = HOST


class Company(MapAttribute):
    """
    Company MapAttribute field for OfficeBuilding model
    """

    title = UnicodeAttribute()
    address = UnicodeAttribute()


class OfficeManager(MapAttribute):
    """
    OfficeManager MapAttribute field for OfficeBuilding model
    """

    first_name = UnicodeAttribute()
    last_name = UnicodeAttribute()
    middle_name = UnicodeAttribute(null=True)
    phone_number = UnicodeAttribute(null=True)


class Address(MapAttribute):
    """
    Address of office building
    """

    country = UnicodeAttribute()
    city = UnicodeAttribute()
    address = UnicodeAttribute()


class OfficeBuilding(BaseModel):
    """
    DynamoDB model for Office building
    """

    class Meta(BaseModel.Meta):
        table_name = "office_building"

    unique_number = UnicodeAttribute(hash_key=True)
    name = UnicodeAttribute()
    full_address = Address()
    building_area = NumberAttribute(default=0)
    floors_count = NumberAttribute(default=1)
    rentable_area = NumberAttribute(default=0)
    rentable_floors_count = NumberAttribute(default=0)
    owner_company = Company()
    office_manager = OfficeManager()
    state = UnicodeAttribute(default=RoomState.DESIGNED.value)
    office_moderator_username = UnicodeAttribute()
    warehouse_manager_username = UnicodeAttribute(default="")


class Room(BaseModel):
    """
    DynamoDB model for room
    """

    class Meta(BaseModel.Meta):
        table_name = "room"

    unique_number = UnicodeAttribute(hash_key=True)
    floor_number = NumberAttribute()
    room_area = NumberAttribute(default=0)
    room_class = UnicodeAttribute(default=EquipmentClass.A.value)
    total_available_workplace = NumberAttribute(default=0)
    permanent_workplace = NumberAttribute(default=0)
    temporal_workplace = NumberAttribute(default=0)
    MFU = BooleanAttribute(default=False)
    conditioner = BooleanAttribute(default=False)
    room_type = UnicodeAttribute()
    state = UnicodeAttribute(default=RoomState.DESIGNED.value)
    office_id = UnicodeAttribute()


class Workplace(BaseModel):
    """
    DynamoDB model for workspace
    """

    class Meta(BaseModel.Meta):
        table_name = "workplace"

    unique_number = UnicodeAttribute(hash_key=True)
    inventory_number = UnicodeAttribute()
    workplace_type = UnicodeAttribute(default=WorkplaceType.PERMANENT.value)
    workplace_class = UnicodeAttribute(default=EquipmentClass.A.value)
    indoor_location = UnicodeAttribute()
    state = UnicodeAttribute(default=WorkplaceState.DESIGNED.value)
    room_id = UnicodeAttribute()


class WorkplaceEquipmentModel(BaseModel):
    inventory_number = UnicodeAttribute(hash_key=True)
    item_class = UnicodeAttribute(default=EquipmentClass.A.value)
    state = UnicodeAttribute(default=EquipmentState.AVAILABLE.value)
    office_id = UnicodeAttribute()
    workplace_id = UnicodeAttribute()


class Table(WorkplaceEquipmentModel):
    """
    DynamoDB model for table
    """

    class Meta(BaseModel.Meta):
        table_name = "table"


class Chair(WorkplaceEquipmentModel):
    """
    DynamoDB model for chair
    """

    class Meta(BaseModel.Meta):
        table_name = "chair"


class AdditionalEquipment(WorkplaceEquipmentModel):
    """
    DynamoDB model for additional equipment (laptop, keyboard, headphones, monitor)
    """

    class Meta(BaseModel.Meta):
        table_name = "additional_equipment"

    name = UnicodeAttribute()


def create_dynamodb_tables(*args: Any) -> None:
    """
    Create all DynamoDB tables if not exists
    """
    models = [OfficeBuilding, Room, Workplace, Table, Chair, AdditionalEquipment]

    for model in models:
        if not model.exists():
            model.create_table(read_capacity_units=1, write_capacity_units=1, wait=True)
