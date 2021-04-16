from typing import Any, List

from rest_framework.exceptions import PermissionDenied
from userapp.models import User, WarehouseManager

from .exceptions import Conflict
from .models import OfficeBuilding, Workplace


def check_moderator_permission(user: User, office_id: str) -> None:
    """
    Check moderator permissions for office
    """
    try:
        office = OfficeBuilding.get(office_id)
    except OfficeBuilding.DoesNotExist:
        return

    check_user_is_moderator(office.office_moderator_username, user.username)


def check_warehouse_manager_permission(user: User, office_id: str) -> None:
    """
    Check warehouse manager permissions for office
    """
    try:
        office = OfficeBuilding.get(office_id)
    except OfficeBuilding.DoesNotExist:
        return

    if office.warehouse_manager_username != user.username:
        raise PermissionDenied("You have no access to this office")


def check_user_is_moderator(moderator: str, user: str) -> None:
    """
    Compare that logged in user is moderator with permissions
    """
    if moderator != user:
        raise PermissionDenied("You have no access to this office")


def check_warehouse_manager_exists(warehouse_manager: str) -> None:
    warehouse_manager = WarehouseManager.objects.filter(
        user__username=warehouse_manager
    )

    if not warehouse_manager:
        raise Conflict(
            {
                "warehouse_manager": [
                    "Invalid warehouse manager, such warehouse manager does not exist"
                ]
            }
        )


def check_dynamodb_object_exists(
    dynamodb_model: Any, checked_value: str, new_value: str
) -> None:
    if list(dynamodb_model.scan((checked_value == new_value))):
        raise Conflict({"message": "Such object already exist in system"})


def check_id_equality(serializer_field: str, url_param: str) -> None:
    if serializer_field != url_param:
        raise Conflict({"message": "Mismatched url identifiers and object identifier"})


def check_state(state: str, restrictions: List) -> None:
    if state not in restrictions:
        raise Conflict(
            {"message": "Invalid state of object for execute this operation"}
        )


def get_workplace(workplace_id: str) -> Workplace:
    try:
        return Workplace.get(workplace_id)
    except Workplace.DoesNotExist:
        raise Conflict({"message": "Such workplace does not exists!"})


def check_equipment_usage(equipment_model: Any, workplace_id: str) -> None:
    """
    Check if equipment of given type does not booking for specific workplace
    """

    response = list(
        equipment_model.scan((equipment_model.workplace_id == workplace_id))
    )
    if response:
        raise Conflict(
            {"message": "Such workplace already have active equipment of this type."}
        )
