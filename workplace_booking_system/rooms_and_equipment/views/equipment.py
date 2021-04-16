from typing import Any, Optional, Type, TypeVar, cast

from rest_framework.exceptions import NotFound
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from userapp.permissions import IsModeratorOrReadOnly, IsWarehouseManagerOrReadOnly

from ..exceptions import Conflict
from ..models import AdditionalEquipment, Chair, Room, Table, Workplace
from ..serializers.equipment import (
    AdditionalEquipmentSerializer,
    ChairSerializer,
    TableSerializer,
)
from ..service import (
    check_equipment_usage,
    check_id_equality,
    check_warehouse_manager_permission,
    get_workplace,
)


class ListCreateEquipmentView(ListCreateAPIView):
    dynamodb_model: Any = None
    permission_classes = (
        IsAuthenticated,
        IsWarehouseManagerOrReadOnly,
    )

    def list(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        office_id = self.kwargs["office_id"]

        tables = self.dynamodb_model.scan((self.dynamodb_model.office_id == office_id))
        serializer = self.get_serializer(tables, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer: Any) -> None:
        office_id = self.kwargs["office_id"]

        check_warehouse_manager_permission(self.request.user, office_id)
        check_id_equality(serializer.validated_data["office_id"], office_id)

        if list(
            self.dynamodb_model.scan(
                (
                    self.dynamodb_model.inventory_number
                    == serializer.validated_data["inventory_number"]
                )
            )
        ):
            raise Conflict(
                {"message": "Item with such inventory_number already exist in system"}
            )

        serializer.save()


class EquipmentDetailView(RetrieveUpdateDestroyAPIView):
    dynamodb_model: Any = None
    permission_classes = (
        IsAuthenticated,
        IsWarehouseManagerOrReadOnly,
    )

    def get_object(self) -> Type[dynamodb_model]:
        inventory_number = self.kwargs["inventory_number"]
        check_warehouse_manager_permission(self.request.user, self.kwargs["office_id"])

        try:
            obj = self.dynamodb_model.get(inventory_number)
        except self.dynamodb_model.DoesNotExist:
            raise NotFound

        return obj

    def perform_update(self, serializer: Any) -> None:
        office_id = self.kwargs["office_id"]

        if not serializer.partial:
            check_id_equality(serializer.validated_data["office_id"], office_id)
        else:
            if workplace_id := serializer.validated_data.get("workplace_id", None):
                workplace = get_workplace(workplace_id)
                room = Room.get(workplace.room_id)

                check_id_equality(room.office_id, office_id)
                check_equipment_usage(self.dynamodb_model, workplace_id)

        serializer.save()


class ListCreateTableView(ListCreateEquipmentView):
    serializer_class = TableSerializer
    dynamodb_model = Table


class TableDetailView(EquipmentDetailView):
    serializer_class = TableSerializer
    dynamodb_model = Table


class ListCreateChairView(ListCreateEquipmentView):
    serializer_class = ChairSerializer
    dynamodb_model = Chair


class ChairDetailView(EquipmentDetailView):
    serializer_class = ChairSerializer
    dynamodb_model = Chair


class ListCreateAdditionalEquipmentView(ListCreateEquipmentView):
    serializer_class = AdditionalEquipmentSerializer
    dynamodb_model = AdditionalEquipment


class AdditionalEquipmentDetailView(EquipmentDetailView):
    serializer_class = AdditionalEquipmentSerializer
    dynamodb_model = AdditionalEquipment
