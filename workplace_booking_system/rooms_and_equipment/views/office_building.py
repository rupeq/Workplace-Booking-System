from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from userapp.permissions import IsModeratorOrReadOnly

from ..models import OfficeBuilding
from ..serializers.office_building import OfficeBuildingSerializer
from ..service import (
    check_dynamodb_object_exists,
    check_user_is_moderator,
    check_warehouse_manager_exists,
)


@api_view(["GET", "POST"])
@permission_classes(
    (
        IsAuthenticated,
        IsModeratorOrReadOnly,
    )
)
def offices_list(request: Request) -> Response:
    """
    List all offices, or create new office
    """
    if request.method == "GET":
        offices = OfficeBuilding.scan()
        serializer = OfficeBuildingSerializer(offices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        data = request.data
        serializer = OfficeBuildingSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        check_dynamodb_object_exists(
            OfficeBuilding,
            OfficeBuilding.unique_number,
            serializer.validated_data["unique_number"],
        )
        check_warehouse_manager_exists(data.get("warehouse_manager_username", ""))

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes(
    (
        IsAuthenticated,
        IsModeratorOrReadOnly,
    )
)
def office_detail(request: Request, office_id: str) -> Response:
    """
    Retrieve, update or delete office.
    """
    try:
        office = OfficeBuilding.get(office_id)
    except OfficeBuilding.DoesNotExist:
        raise NotFound

    if request.method == "GET":
        serializer = OfficeBuildingSerializer(office)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == "PUT":
        check_user_is_moderator(office.office_moderator_username, request.user.username)
        data = request.data
        serializer = OfficeBuildingSerializer(office, data=data, partial=True)
        serializer.is_valid(raise_exception=True)

        if data.get("warehouse_manager_username", ""):
            check_warehouse_manager_exists(data["warehouse_manager_username"])

        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        check_user_is_moderator(office.office_moderator_username, request.user.username)
        office.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
