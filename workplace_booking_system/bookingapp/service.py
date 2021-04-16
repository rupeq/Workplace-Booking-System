import smtplib
from datetime import timedelta
from typing import Any, Dict, List, TypeVar

from django.core.mail import EmailMessage
from django.db.models import Model
from django.db.models.query import QuerySet
from django.utils import timezone
from pynamodb.exceptions import DoesNotExist
from rest_framework import serializers
from rooms_and_equipment.enums import WorkplaceType
from rooms_and_equipment.equipment_state import WorkplaceState
from rooms_and_equipment.models import OfficeBuilding, Room, Workplace
from userapp.models import User

from workplace_booking_system.settings import EMAIL_HOST_USER

from .models import Booking, OfficeUser

_MT_co = TypeVar("_MT_co", bound=Model, covariant=True)
MAX_HOURS_PER_MONTH = 96
SECONDS_IN_HOUR = 3600


def send_mail(send_to: str, message: str) -> Any:
    try:
        email = EmailMessage(
            "Booking information",
            message,
            EMAIL_HOST_USER,
            [
                send_to,
            ],
        )
        email.send()
    except smtplib.SMTPRecipientsRefused:
        pass


def get_office(place_id: Any) -> Any:
    try:
        place = Workplace.get(place_id)
        room = Room.get(place.room_id)
        office = OfficeBuilding.get(room.office_id)
    except (
        DoesNotExist,
        AttributeError,
    ):
        return []

    return [place, room, office]


def get_statistic_hours(bookings: QuerySet[_MT_co]) -> timedelta:
    btime = timedelta()
    for i in bookings:
        btime += i.reservation_time - i.booking_date

    return btime


def check_if_valid(
    user: User, username: str, attrs: Dict, b_id: int = 0, req_user: None = None
) -> None:
    data = get_office(attrs.get("place_id"))
    date_start: Any = attrs.get('booking_date')
    date_end: Any = attrs.get('reservation_time')
    place_id = attrs.get('place_id')

    if req_user and req_user.user_role == "ES":
        if date_start < timezone.now() + timedelta(hours=2):
            raise serializers.ValidationError(
                {
                    "amount": "Less than 2 hours left",
                    "description": [
                        "You can't modify booking, because of less than 2 hours left"
                    ],
                }
            )

    if date_start > date_end:
        raise serializers.ValidationError(
            {
                "amount": "Invalid date!",
                "description": [
                    "The start time of the booking cannot be later than the end time"
                ],
            }
        )

    if date_start < timezone.now():
        raise serializers.ValidationError(
            {
                "amount": "Can't book on this date!",
                "description": ["You cannot book for a time earlier than now"],
            }
        )

    if not data:
        raise serializers.ValidationError(
            {
                "amount": "Invalid workplace id!",
                "description": ["Invalid workplace id!"],
            }
        )
    else:
        office = data[2]
        room = data[1]
        workplace = data[0]

    if office.state != "Commissioned":
        raise serializers.ValidationError(
            {
                "amount": "Invalid office state!",
                "description": [
                    f"Invalid office state '{office.state}' for booking workplaces!"
                ],
            }
        )

    if room.state != "Commissioned":
        raise serializers.ValidationError(
            {
                "amount": "Invalid room state!",
                "description": [
                    f"Invalid room state '{room.state}' for booking workplaces!"
                ],
            }
        )

    if workplace.workplace_type == "Permanent":
        raise serializers.ValidationError(
            {
                "amount": "Invalid workplace type!",
                "description": ["Workplace type must be temporal!"],
            }
        )

    if workplace.state != "Available":
        raise serializers.ValidationError(
            {
                "amount": "Invalid workplace state!",
                "description": ["Workplace state must be available!"],
            }
        )

    if user.user_role == "EM":
        desc = "No such workplace in office belongs to you!"
    else:
        desc = f"No such workplace in office belongs to user {username}!"

    office_in_use = OfficeUser.objects.filter(
        username=username, office_id=office.unique_number
    ).first()

    if not office_in_use:
        raise serializers.ValidationError(
            {
                "amount": "No such workplace in office belongs to you!",
                "description": [desc],
            }
        )

    if date_start < timezone.now() + timedelta(hours=4):
        raise serializers.ValidationError(
            {
                "amount": "Invalid date!",
                "description": [
                    "You can't book or update workspace in less then 4 hours from selected time"
                ],
            }
        )

    if b_id:
        all_booking = (
            Booking.objects.filter(
                booking_date__lte=date_start,
                reservation_time__gte=date_start,
                place_id=place_id,
            )
            .exclude(id=b_id)
            .first()
        )

        all_booking_no_pid = (
            Booking.objects.filter(
                username=username,
                booking_date__lte=date_start,
                reservation_time__gte=date_start,
            )
            .exclude(id=b_id)
            .first()
        )
    else:
        all_booking = Booking.objects.filter(
            booking_date__lte=date_start,
            reservation_time__gte=date_start,
            place_id=place_id,
        ).first()

        all_booking_no_pid = Booking.objects.filter(
            username=username,
            booking_date__lte=date_start,
            reservation_time__gte=date_start,
        ).first()

    if req_user != user:
        desc = f"User {user} has another reservation at this time"
    else:
        desc = "You have another reservation at this time"

    if all_booking_no_pid:
        raise serializers.ValidationError(
            {
                "amount": "Can't book on this date!",
                "description": [desc],
            }
        )

    if all_booking:
        raise serializers.ValidationError(
            {
                "amount": "Can't book on this date!",
                "description": ["Workplace is already booked by another user"],
            }
        )

    if not b_id:
        specific_book = (
            Booking.objects.filter(username=username).order_by('-date').first()
        )

        if specific_book:
            if timezone.now() < specific_book.date + timedelta(hours=4):
                raise serializers.ValidationError(
                    {
                        "amount": "You can't book now",
                        "description": [
                            "More than 4 hours must have passed since your last booking"
                        ],
                    }
                )

    if date_end - date_start > timedelta(days=5):
        raise serializers.ValidationError(
            {
                "amount": "You can't book for such a long time",
                "description": ["You can book a place for less than 5 days"],
            }
        )

    if not b_id:
        month = date_start.month
        delta = date_end - date_start
        deltas = [delta.total_seconds() / SECONDS_IN_HOUR]
        month_users_booking = list(
            Booking.objects.filter(username=username, booking_date__month=month)
        )
        for book in month_users_booking:
            delta = book.reservation_time - book.booking_date
            deltas.append(delta.total_seconds() / SECONDS_IN_HOUR)
        if sum(deltas) >= MAX_HOURS_PER_MONTH:
            raise serializers.ValidationError(
                {
                    "amount": "You can't book for such a long time",
                    "description": [
                        "Amount of booking hours cannot exceed 96 per month"
                    ],
                }
            )
    else:
        month = date_start.month
        delta = date_end - date_start
        deltas = [delta.total_seconds() / SECONDS_IN_HOUR]
        month_users_booking = list(
            Booking.objects.filter(
                username=username, booking_date__month=month
            ).exclude(id=b_id)
        )
        for book in month_users_booking:
            delta = book.reservation_time - book.booking_date
            deltas.append(delta.total_seconds() / SECONDS_IN_HOUR)
        if sum(deltas) >= MAX_HOURS_PER_MONTH:
            raise serializers.ValidationError(
                {
                    "amount": "You can't book for such a long time",
                    "description": [
                        "Amount of booking hours cannot exceed 96 per month"
                    ],
                }
            )


def get_available_workplaces(username: str) -> List[Workplace]:
    user_offices = OfficeUser.objects.filter(username=username)

    rooms: List[Room] = []
    for office in user_offices:
        rooms.extend(Room.scan((Room.office_id == office.office_id)))

    workplaces: List[Workplace] = []
    for room in rooms:
        workplaces.extend(
            Workplace.scan(
                (Workplace.room_id == room.unique_number)
                & (Workplace.workplace_type == WorkplaceType.TEMPORAL.value)
                & (Workplace.state == WorkplaceState.AVAILABLE.value)
            )
        )

    return workplaces
