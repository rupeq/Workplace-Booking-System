from typing import Dict

from rest_framework import serializers

from ..enums import EquipmentClass, WorkplaceType
from ..equipment_state import WorkplaceState
from ..models import Workplace
from .base_serializer import BaseSerializer


class WorkplaceSerializer(BaseSerializer):
    dynamodb_model = Workplace

    unique_number = serializers.CharField(min_length=4, max_length=6)
    inventory_number = serializers.CharField()
    workplace_type = serializers.ChoiceField(
        choices=[state.value for state in WorkplaceType]
    )
    workplace_class = serializers.ChoiceField(
        choices=[equip_class.value for equip_class in EquipmentClass]
    )
    indoor_location = serializers.CharField()
    state = serializers.ChoiceField(choices=[state.value for state in WorkplaceState])
    room_id = serializers.CharField(max_length=6, min_length=4)
