from enum import Enum


class EquipmentClass(Enum):
    A = "A"
    B = "B"
    C = "C"


class WorkplaceType(Enum):
    TEMPORAL = "Temporal"
    PERMANENT = "Permanent"


class AdditionalEquipmentNames(Enum):
    LAPTOP = "Laptop"
    HEADPHONES = "Headphones"
    MONITOR = "Monitor"
    KEYBOARD = "Keyboard"
