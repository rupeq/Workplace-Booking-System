from enum import Enum


class RoomState(Enum):
    DESIGNED = "Designed"
    COMMISSIONED = "Commissioned"
    OUT_OF_SERVICE = "Out of service"
    NOT_AVAILABLE = "Not available"


class WorkplaceState(Enum):
    DESIGNED = "Designed"
    MOUNTED = "Mounted"
    AVAILABLE = "Available"
    BEING_REPAIRED = "Being repaired"
    NOT_AVAILABLE = "Not available"
    OUT_OF_SERVICE = "Out of service"


class EquipmentState(Enum):
    AVAILABLE = "Available"
    BEING_REPAIRED = "Being repaired"
    NOT_AVAILABLE = "Not available"
    OUT_OF_SERVICE = "Out of service"
