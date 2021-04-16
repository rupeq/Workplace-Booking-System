import os
import random
from typing import Dict, List, TypeVar

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

from . import google
from .models import (
    Contract,
    Director,
    Employee,
    EmployeeSupervisor,
    Moderator,
    PlatformAdministrator,
    StructuralUnit,
    WarehouseManager,
)

User = get_user_model()
_IN = TypeVar("_IN")


class ContractSerializer(serializers.Serializer):
    """
    Serializer for Contract
    """

    class Meta:
        model = Contract
        fields = "__all__"


class StructuralUnitSerializer(serializers.Serializer):
    """
    Serializer for Structural Units
    """

    class Meta:
        model = StructuralUnit
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User
    """

    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data: Dict) -> _IN:
        password = validated_data.pop('password')
        user_obj = User(**validated_data)
        user_obj.set_password(password)
        user_obj.save()
        return user_obj


class ListUserSerializer(serializers.ModelSerializer):
    """
    Serializer for User action read
    """

    class Meta:
        model = User
        fields = ('id', 'username', 'user_role')


class UpdateUserSerializer(serializers.ModelSerializer):
    """
    Serializer for User action update
    """

    class Meta:
        model = User
        fields = ('username', 'password')


class DirectorSerializer(serializers.ModelSerializer):
    """
    Serializer implements director model
    """

    user = ListUserSerializer(read_only=True)

    class Meta:
        model = Director
        fields = ('user', 'middle_name')


class WarehouseManagerSerializer(serializers.ModelSerializer):
    """
    Serializer implements Warehouse Manager model
    """

    user = ListUserSerializer(read_only=True)

    class Meta:
        model = WarehouseManager
        fields = ('user', 'middle_name')


class PlatformAdministratorSerializer(serializers.ModelSerializer):
    """
    Serializer implements platform administrator model
    """

    user = ListUserSerializer(read_only=True)

    class Meta:
        model = PlatformAdministrator
        fields = ('user', 'middle_name', 'email')


class ModeratorSerializer(serializers.ModelSerializer):
    """
    Serializer implements moderator model
    """

    user = ListUserSerializer(read_only=True)

    class Meta:
        model = Moderator
        fields = ('user', 'middle_name', 'email')


class EmployeeSupervisorSerializer(serializers.ModelSerializer):
    """
    Serialzier implements supervisor model
    """

    user = ListUserSerializer(read_only=True)

    class Meta:
        model = EmployeeSupervisor
        fields = (
            'user',
            'middle_name',
            'gender',
            'birthdate',
            'phone',
            'skype',
            'structural_unit',
            'contract_type',
            'email',
            'position',
        )


class EmployeeSerializer(serializers.ModelSerializer):
    """
    Serializer implements employee model
    """

    user = ListUserSerializer(read_only=True)

    class Meta:
        model = Employee
        fields = (
            'user',
            'middle_name',
            'supervisor',
            'gender',
            'birthdate',
            'phone',
            'skype',
            'structural_unit',
            'contract_type',
            'email',
            'position',
        )


class GoogleSocialAuthSerializer(serializers.Serializer):
    auth_token = serializers.CharField()

    def validate_auth_token(self, auth_token: str) -> Dict:
        user_data = google.Google.validate(auth_token)
        if user_data.get('sub', None) is None:
            raise serializers.ValidationError(
                'The token is invalid or expired. Please login again.'
            )

        # if user_data['aud'] != os.environ.get('GOOGLE_CLIENT_ID'):
        #     raise AuthenticationFailed('oops, who are you?')

        user_data['provider'] = 'google'
        return register_social_user(**user_data)


def generate_username(name: str) -> str:
    username = "".join(name.split(' ')).lower()
    return username


def register_social_user(
    provider: str, email: str, name: str, *args: List, **kwargs: Dict
) -> Dict:
    filtered_user_by_email = User.objects.filter(username=generate_username(name))
    if filtered_user_by_email.exists():
        if provider == filtered_user_by_email[0].auth_provider:
            registered_user = authenticate(
                username=generate_username(name), password=settings.GOOGLE_CLIENT_SECRET
            )
            return {
                'username': registered_user.username,
                'tokens': registered_user.tokens(),
            }
        else:
            raise AuthenticationFailed(
                detail='Please continue your login using '
                + filtered_user_by_email[0].auth_provider
            )

    else:
        user_data = {
            'username': generate_username(name),
            'email': email,
            'password': settings.GOOGLE_CLIENT_SECRET,
        }
        user = User.objects.create_user(**user_data)
        user.is_verified = True
        user.auth_provider = provider
        user.save()
        new_user = authenticate(
            username=user.username, password=settings.GOOGLE_CLIENT_SECRET
        )
        return {'username': new_user.username, 'tokens': new_user.tokens()}
