from rest_framework import serializers

from ..enums import AdditionalEquipmentNames, EquipmentClass
from ..equipment_state import EquipmentState
from ..models import AdditionalEquipment, Chair, Table
from .base_serializer import BaseSerializer


class EquipmentSerializer(BaseSerializer):
    inventory_number = serializers.CharField()
    item_class = serializers.ChoiceField(
        choices=[state.value for state in EquipmentClass]
    )
    state = serializers.ChoiceField(choices=[state.value for state in EquipmentState])
    office_id = serializers.CharField(max_length=6, min_length=4)
    workplace_id = serializers.CharField(max_length=6, min_length=4, allow_blank=True)


class TableSerializer(EquipmentSerializer):
    dynamodb_model = Table


class ChairSerializer(EquipmentSerializer):
    dynamodb_model = Chair


class AdditionalEquipmentSerializer(EquipmentSerializer):
    dynamodb_model = AdditionalEquipment

    name = serializers.ChoiceField(
        choices=[state.value for state in AdditionalEquipmentNames]
    )
