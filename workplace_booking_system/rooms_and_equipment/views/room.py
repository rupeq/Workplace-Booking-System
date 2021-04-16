from typing import Any, Optional

from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from userapp.permissions import IsModeratorOrReadOnly

from ..equipment_state import RoomState
from ..models import OfficeBuilding, Room
from ..serializers.room import RoomSerializer
from ..service import (
    check_dynamodb_object_exists,
    check_id_equality,
    check_moderator_permission,
    check_state,
    check_user_is_moderator,
)


class ListCreateRoomView(ListCreateAPIView):
    serializer_class = RoomSerializer
    permission_classes = (
        IsAuthenticated,
        IsModeratorOrReadOnly,
    )

    def list(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        office_id = self.kwargs["office_id"]

        rooms = Room.scan((Room.office_id == office_id))
        serializer = self.get_serializer(rooms, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer: RoomSerializer) -> None:
        office_id = self.kwargs["office_id"]

        check_id_equality(serializer.validated_data["office_id"], office_id)
        check_dynamodb_object_exists(
            Room, Room.unique_number, serializer.validated_data["unique_number"]
        )

        try:
            office = OfficeBuilding.get(serializer.validated_data["office_id"])
        except OfficeBuilding.DoesNotExist:
            raise NotFound

        check_user_is_moderator(
            office.office_moderator_username, self.request.user.username
        )
        check_state(
            office.state, [RoomState.DESIGNED.value, RoomState.COMMISSIONED.value]
        )
        serializer.save()


class RoomDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = RoomSerializer
    permission_classes = (
        IsAuthenticated,
        IsModeratorOrReadOnly,
    )

    def get_object(self) -> Room:
        room_id = self.kwargs["room_id"]
        check_moderator_permission(self.request.user, self.kwargs["office_id"])

        try:
            obj = Room.get(room_id)
        except Room.DoesNotExist:
            raise NotFound

        return obj

    def perform_update(self, serializer: RoomSerializer) -> None:
        if not serializer.partial:
            office_id = self.kwargs["office_id"]
            check_id_equality(serializer.validated_data["office_id"], office_id)

        serializer.save()
