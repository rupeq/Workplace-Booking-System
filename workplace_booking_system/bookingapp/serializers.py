from typing import Any, Dict, TypeVar

from notifications.service import booking_workplace_notification, update_notifications
from rest_framework import serializers
from userapp.models import Employee, User

from .models import Booking, OfficeUser
from .service import check_if_valid, send_mail

_IN = TypeVar("_IN")


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = (
            "id",
            "username",
            "place_id",
            "booking_date",
            "reservation_time",
            "laptop",
            "headphones",
            "keyboard",
            "monitor",
        )


class ActionBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "place_id",
            "date",
            "booking_date",
            "reservation_time",
            "laptop",
            "headphones",
            "keyboard",
            "monitor",
        ]

    def validate(self, attrs: Dict) -> Dict:
        user = self.context["request"].user
        username = user.username
        check_if_valid(user, username, attrs)

        return attrs

    def create(self, validated_data: Dict) -> _IN:
        user = self.context["request"].user
        username = user.username
        date_start = validated_data.get("booking_date")
        date_end = validated_data.get("reservation_time")
        place = validated_data.get("place_id")
        booking = Booking.objects.create(username=username, **validated_data)
        booking.save()
        employee_mail = Employee.objects.filter(user=user).first().email
        booking_workplace_notification(
            username,
            username,
            booking.id,
            place,
            date_start,
            date_end,
            with_supervisor=True,
            with_regular_notifications=True,
        )
        send_mail(
            employee_mail,
            "You have successfully booked a workplace. "
            f"Start time of booking place {place}: {date_start}, End time of booking: {date_end}.",
        )
        return booking


class UpdateBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "place_id",
            "date",
            "booking_date",
            "reservation_time",
            "laptop",
            "headphones",
            "keyboard",
            "monitor",
        ]

    def validate(self, attrs: Dict) -> Dict:
        b_id = self.context["request"].path.split('/')[-2]
        user = self.context["request"].user
        if user.user_role == "EM":
            username = user.username
            creator = user
        else:
            username = Booking.objects.filter(id=b_id).first().username
            u = User.objects.filter(username=username).first()
            creator = u
        check_if_valid(creator, username, attrs, b_id, user)

        return attrs

    def update(self, instance: Any, validated_data: Dict) -> _IN:
        change_by = self.context["request"].user.username
        date_start = validated_data.get('booking_date')
        date_end = validated_data.get('reservation_time')
        place_id = instance.place_id
        user = User.objects.filter(username=instance.username).first()
        booking_user_email = Employee.objects.filter(user=user).first().email

        obj = super().update(instance, validated_data)
        send_mail(
            booking_user_email,
            f"Your booking information has been changed by user {change_by}."
            f"It now looks like this: Start time of booking place {place_id}: {date_start}, "
            f"End time of booking: {date_end}.",
        )
        update_notifications(
            change_by, instance.username, instance.id, place_id, date_start, date_end
        )

        return obj


class OfficeUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfficeUser
        fields = "__all__"
