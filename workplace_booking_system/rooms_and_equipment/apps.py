from django.apps import AppConfig


class RoomsAndEquipmentConfig(AppConfig):
    name = 'rooms_and_equipment'

    def ready(self) -> None:
        from .models import create_dynamodb_tables

        create_dynamodb_tables()
