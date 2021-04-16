from typing import Any, Dict, Type, Union

from rest_framework import serializers

from ..models import BaseModel


class BaseSerializer(serializers.Serializer):
    dynamodb_model: Any = None

    def update(self, instance: Any, validated_data: Dict) -> Any:
        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save()
        return instance

    def create(self, validated_data: Dict) -> Type[dynamodb_model]:
        if not self.dynamodb_model:
            raise Exception("Set dynamodb_model failed!")

        table = self.dynamodb_model(**validated_data)
        table.save()
        return table
