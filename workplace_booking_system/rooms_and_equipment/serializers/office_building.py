from typing import Dict

from django.core.validators import RegexValidator
from rest_framework import serializers

from ..equipment_state import RoomState
from ..models import OfficeBuilding
from .base_serializer import BaseSerializer


class CompanySerializer(serializers.Serializer):
    title = serializers.CharField(max_length=100)
    address = serializers.CharField(max_length=200, required=False)


class OfficeManagerSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    middle_name = serializers.CharField(max_length=100, required=False)

    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.",
    )
    phone_number = serializers.CharField(validators=[phone_regex], max_length=17)


class AddressSerializer(serializers.Serializer):
    country = serializers.CharField(max_length=50)
    city = serializers.CharField(max_length=50)
    address = serializers.CharField(max_length=200)


class OfficeBuildingSerializer(BaseSerializer):
    dynamodb_model = OfficeBuilding

    unique_number = serializers.CharField(min_length=4, max_length=6)
    name = serializers.CharField(max_length=100, required=False)
    full_address = AddressSerializer()
    building_area = serializers.FloatField()
    floors_count = serializers.IntegerField()
    rentable_area = serializers.FloatField()
    rentable_floors_count = serializers.IntegerField()
    state = serializers.ChoiceField(choices=[state.value for state in RoomState])
    owner_company = CompanySerializer()
    office_manager = OfficeManagerSerializer()
    office_moderator_username = serializers.CharField()
    warehouse_manager_username = serializers.CharField()
