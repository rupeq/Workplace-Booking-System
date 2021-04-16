from typing import Any, Optional

from notifications.service import workplace_state_change_notification
from pynamodb.exceptions import DoesNotExist
from rest_framework.exceptions import NotFound
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from userapp.permissions import IsModeratorOrReadOnly

from ..equipment_state import RoomState
from ..exceptions import Conflict
from ..models import OfficeBuilding, Room, Workplace
from ..serializers.workplace import WorkplaceSerializer
from ..service import (
    check_dynamodb_object_exists,
    check_id_equality,
    check_moderator_permission,
    check_state,
)


class ListCreateWorkplaceView(ListCreateAPIView):
    serializer_class = WorkplaceSerializer
    permission_classes = (
        IsAuthenticated,
        IsModeratorOrReadOnly,
    )

    def list(
        self, request: Request, *args: Any, room_id: Optional[str] = None, **kwargs: Any
    ) -> Response:
        workplaces = Workplace.scan((Workplace.room_id == room_id))
        serializer = self.get_serializer(workplaces, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer: WorkplaceSerializer) -> None:
        room_id = self.kwargs["room_id"]

        check_moderator_permission(self.request.user, self.kwargs["office_id"])
        check_id_equality(serializer.validated_data["room_id"], room_id)
        check_dynamodb_object_exists(
            Workplace,
            Workplace.unique_number,
            serializer.validated_data["unique_number"],
        )

        try:
            room = Room.get(serializer.validated_data["room_id"])
            office = OfficeBuilding.get(room.office_id)
        except DoesNotExist:
            raise NotFound

        check_state(
            room.state, [RoomState.DESIGNED.value, RoomState.COMMISSIONED.value]
        )

        if office.state not in [RoomState.DESIGNED.value, RoomState.COMMISSIONED.value]:
            raise Conflict(
                {"message": "Invalid state of office building to create new workplaces"}
            )

        serializer.save()


class WorkplaceDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = WorkplaceSerializer
    permission_classes = (
        IsAuthenticated,
        IsModeratorOrReadOnly,
    )

    def get_object(self) -> Workplace:
        workplace_id = self.kwargs["workplace_id"]
        check_moderator_permission(self.request.user, self.kwargs["office_id"])

        try:
            obj = Workplace.get(workplace_id)
        except Workplace.DoesNotExist:
            raise NotFound

        return obj

    def perform_update(self, serializer: WorkplaceSerializer) -> None:
        workplace_id = self.kwargs["workplace_id"]

        if not serializer.partial:
            room_id = self.kwargs["room_id"]
            check_id_equality(serializer.validated_data["room_id"], room_id)

        serializer.save()

        workplace_state_change_notification(workplace_id)
