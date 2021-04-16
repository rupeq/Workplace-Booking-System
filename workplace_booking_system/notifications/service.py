from datetime import timedelta
from typing import Any, List, Optional

from bookingapp.models import Booking
from bookingapp.service import get_office
from django.utils import timezone
from userapp.models import Employee

from .models import Notification


def booking_workplace_notification(
    changed_by: str,
    username: str,
    booking_id: int,
    place_id: Optional[Any],
    booking_date: Any,
    reservation_time: Any,
    *,
    action: str = "created",
    with_supervisor: bool = False,
    with_regular_notifications: bool = False,
) -> None:
    """
    Create notifications for employee and his supervisor
    """
    notifications = [
        Notification(
            username=username,
            booking_id=booking_id,
            title="Booking workplace",
            description=f"Booking was {action} by '{changed_by}' for '{place_id}' workplace from {booking_date} to {reservation_time}",
        )
    ]

    if with_supervisor:
        if (
            new_notification := supervisor_notification(
                changed_by,
                username,
                booking_id,
                place_id,
                booking_date,
                reservation_time,
                action,
            )
        ) is not None:
            notifications.append(new_notification)

    if with_regular_notifications:
        notifications.extend(
            notification_border_points(
                username, booking_id, place_id, booking_date, reservation_time
            )
        )

    notifications.extend(
        staff_notification(
            username, booking_id, place_id, booking_date, reservation_time, action
        )
    )

    Notification.objects.bulk_create(notifications)


def supervisor_notification(
    changed_by: str,
    username: str,
    booking_id: int,
    place_id: Optional[Any],
    booking_date: Any,
    reservation_time: Any,
    action: str,
) -> Optional[Notification]:
    """
    Notify employee supervisor about creating, deleting and updating employee workplace booking
    """
    try:
        employee = Employee.objects.get(user__username=username)
        supervisor = employee.supervisor

        if not supervisor:
            return None

        description = f"Employee '{username}' {action} booking workplace '{place_id}' from {booking_date} to {reservation_time}"

        if changed_by == supervisor.user.username:
            description = f"Employee booking was {action} for workplace '{place_id}' from {booking_date} to {reservation_time}"

        return Notification(
            username=supervisor.user.username,
            booking_id=booking_id,
            title="Employee booking workplace",
            description=description,
        )
    except Employee.DoesNotExist:
        return None


def notification_border_points(
    username: str,
    booking_id: int,
    place_id: Optional[Any],
    booking_date: Any,
    reservation_time: Any,
) -> List:
    """
    Preparation of a notification 5, 2, 1 days before booking start and before 4 hours and 15 minutes
    """
    days = [5, 2, 1]
    delta = booking_date - timezone.now()

    notification_days = [day for day in days if day < delta.days]

    notifications = []
    for day in notification_days:
        notifications.append(
            regular_employee_notification(
                username,
                timedelta(days=day),
                booking_id,
                place_id,
                booking_date,
                reservation_time,
            )
        )

    notifications.append(
        regular_employee_notification(
            username,
            timedelta(hours=4),
            booking_id,
            place_id,
            booking_date,
            reservation_time,
        )
    )
    notifications.append(
        regular_employee_notification(
            username,
            timedelta(minutes=15),
            booking_id,
            place_id,
            booking_date,
            reservation_time,
        )
    )

    return notifications


def regular_employee_notification(
    username: str,
    waiting_time: timedelta,
    booking_id: int,
    place_id: Optional[Any],
    booking_date: Any,
    reservation_time: Any,
) -> Notification:
    """
    Create notification instance for regular employee notifications
    """
    return Notification(
        username=username,
        occurrence_time=booking_date - waiting_time,
        booking_id=booking_id,
        title="Regular notification",
        description=f"Waiting time: {waiting_time}. You booking workplace '{place_id}' from {booking_date} to {reservation_time}",
    )


def update_notifications(
    changed_by: str,
    username: str,
    booking_id: int,
    place_id: Optional[Any],
    booking_date: Any,
    reservation_time: Any,
) -> None:
    Notification.objects.filter(
        booking_id=booking_id, occurrence_time__gt=timezone.now()
    ).delete()

    booking_workplace_notification(
        changed_by,
        username,
        booking_id,
        place_id,
        booking_date,
        reservation_time,
        action="updated",
        with_supervisor=True,
        with_regular_notifications=True,
    )


def remove_notifications(
    change_by: str,
    username: str,
    booking_id: int,
    place_id: Optional[Any],
    booking_date: Any,
    reservation_time: Any,
    reason: str,
) -> None:
    Notification.objects.filter(
        booking_id=booking_id, occurrence_time__gt=timezone.now()
    ).delete()
    booking_workplace_notification(
        change_by,
        username,
        booking_id,
        place_id,
        booking_date,
        reservation_time,
        action=f"deleted (reason: {reason})",
        with_supervisor=True,
    )


def workplace_state_change_notification(workplace_id: str) -> None:
    bookings = Booking.objects.filter(place_id=workplace_id)

    notifications = []

    for booking in bookings:
        notifications.append(
            Notification(
                username=booking.username,
                booking_id=booking.id,
                title="Workplace information changed",
                description=f"Workplace '{workplace_id}' information was changed by moderator",
            )
        )

    Notification.objects.bulk_create(notifications)


def staff_notification(
    username: str,
    booking_id: int,
    place_id: Optional[Any],
    booking_date: Any,
    reservation_time: Any,
    operation: str,
) -> List[Notification]:
    """
    After booking notification for office moderator and warehouse manager
    """
    notifications = []

    office = get_office(place_id)
    if office:
        for staff in ["warehouse_manager_username", "office_moderator_username"]:
            if staff_username := getattr(office[-1], staff, ""):
                notifications.append(
                    Notification(
                        username=staff_username,
                        booking_id=booking_id,
                        title=f"Booking in your office: '{office[-1].name}' ({office[-1].unique_number})",
                        description=f"User('{username}') workplace booking {operation} for '{place_id}' from {booking_date} to {reservation_time}",
                    )
                )

    return notifications
