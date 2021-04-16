import random
import string

from .enums import EquipmentClass
from .equipment_state import RoomState, WorkplaceState
from .models import Room, Workplace


def generate_unique_id(
    size: int = 6, chars: str = string.ascii_lowercase + string.digits
) -> str:
    return ''.join(random.choice(chars) for _ in range(size))


def generate_room(
    office_id: str,
    floor_number: int,
    total_available_workplace: int,
    temporal_workplaces: int,
    permanent_workplaces: int,
) -> None:
    room = Room(
        unique_number=generate_unique_id(random.randint(4, 6)),
        floor_number=floor_number,
        room_area=random.randint(40, 200),
        room_class=EquipmentClass.A.value,
        MFU=random.choice([True, False]),
        conditioner=random.choice([True, False]),
        room_type=random.choice(["cube", "open space"]),
        state=RoomState.COMMISSIONED.value,
        office_id=office_id,
    )

    room.total_available_workplace = total_available_workplace
    room.temporal_workplace = temporal_workplaces
    room.permanent_workplace = permanent_workplaces
    room.save()


def generate_workplace(workplace_type: str, room_id: str) -> None:
    workplace = Workplace(
        unique_number=generate_unique_id(random.randint(4, 6)),
        inventory_number=generate_unique_id(10),
        workplace_type=workplace_type,
        workplace_class=random.choice(
            [equip_class.value for equip_class in EquipmentClass]
        ),
        indoor_location="not information",
        state=WorkplaceState.AVAILABLE.value,
        room_id=room_id,
    )

    workplace.save()
