from typing import Dict

from rest_framework import serializers

from ..enums import EquipmentClass
from ..equipment_state import RoomState
from ..models import Room
from .base_serializer import BaseSerializer


class RoomSerializer(BaseSerializer):
    dynamodb_model = Room

    unique_number = serializers.CharField(min_length=4, max_length=6)
    floor_number = serializers.IntegerField()
    room_area = serializers.FloatField()
    room_class = serializers.ChoiceField(
        choices=[equip_class.value for equip_class in EquipmentClass]
    )
    total_available_workplace = serializers.IntegerField()
    permanent_workplace = serializers.IntegerField()
    temporal_workplace = serializers.IntegerField()
    MFU = serializers.BooleanField()
    conditioner = serializers.BooleanField()
    room_type = serializers.CharField(max_length=100)
    state = serializers.ChoiceField(choices=[state.value for state in RoomState])
    office_id = serializers.CharField(max_length=6, min_length=4)
