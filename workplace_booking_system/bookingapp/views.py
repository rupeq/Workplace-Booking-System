from typing import Any, List, TypeVar

import arrow
from django.core.exceptions import EmptyResultSet
from django.db.models import Model, Q
from django.db.models.query import QuerySet
from django.utils import timezone
from notifications.service import remove_notifications
from rest_framework import mixins, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer
from rooms_and_equipment.serializers.workplace import WorkplaceSerializer
from userapp.models import Employee, EmployeeSupervisor, User

from .models import Booking, OfficeUser
from .permissions import IsInOffice
from .serializers import (
    ActionBookingSerializer,
    BookingSerializer,
    OfficeUserSerializer,
    UpdateBookingSerializer,
)
from .service import get_available_workplaces, get_statistic_hours, send_mail

_MT_co = TypeVar("_MT_co", bound=Model, covariant=True)
_IN = TypeVar("_IN")


class BookingView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Booking.objects.all().order_by('-reservation_time')
    default_serializer_class = BookingSerializer
    permission_classes = (IsInOffice,)

    serializer_classes_by_action = {
        "list": BookingSerializer,
        "create": ActionBookingSerializer,
        "retrieve": BookingSerializer,
        "update": UpdateBookingSerializer,
        "delete": BookingSerializer,
    }

    @action(
        methods=['GET'],
        detail=False,
        url_path='free_workplaces',
        url_name='free_workplaces',
    )
    def workplaces(self, request: Request) -> Response:
        user = request.user
        body = request.query_params

        if user.user_role == "EM":
            workplaces = get_available_workplaces(user.username)
            workplaces_id = [workplace.unique_number for workplace in workplaces]

            date_start = body.get("date_start").split(" ")[0]
            date_start = arrow.get(date_start).datetime
            date_end = body.get("date_end").split(" ")[0]
            date_end = arrow.get(date_end).datetime

            bookings = Booking.objects.filter(
                place_id__in=workplaces_id,
            )
            bookings = bookings.filter(
                ~(
                    (
                        Q(booking_date__lt=date_start)
                        & Q(reservation_time__lte=date_start)
                    )
                    | (Q(booking_date__gte=date_end) & Q(reservation_time__gt=date_end))
                ),
            )

            bookings = set(workplaces_id) - set(
                [booking.place_id for booking in bookings]
            )

            return Response(list(bookings))

        return Response(data=[])

    @action(methods=['GET'], detail=False, url_path='statistics', url_name='statistics')
    def statistics(self, request: Request) -> Response:
        user = request.user
        body = request.query_params
        flag = False
        subflag = False

        try:
            user_stat = body.get("user_stat").strip('"')
            new_user = User.objects.filter(username=user_stat).first()
            if new_user is not None:
                user = new_user
                flag = True
        except Exception:
            pass

        username = user.username
        user_role = user.user_role

        try:
            date_start = body.get("date_start").split(".")[0]
            date_start = arrow.get(date_start).datetime
            date_end = body.get("date_end").split(".")[0]
            date_end = arrow.get(date_end).datetime
        except Exception:
            raise EmptyResultSet("Please enter start and end date filters")

        if user_role == "EM":
            data = Booking.objects.filter(
                username=username,
                booking_date__gte=date_start,
                booking_date__lte=date_end,
            )
            btime = get_statistic_hours(data)
            try:
                serializer = BookingSerializer(data, many=True)
                return Response([len(data), serializer.data, btime / 3600])
            except Exception:
                return Response(data=[])
        elif user_role == "ES":
            q = []
            if flag:
                new_qs = Booking.objects.filter(
                    username=username,
                    booking_date__gte=date_start,
                    booking_date__lte=date_end,
                )

            else:
                subflag = True
                supervisor = EmployeeSupervisor.objects.filter(user=user).first()
                employees = Employee.objects.filter(supervisor=supervisor)
                for employee in employees:
                    q.append(
                        (
                            Booking.objects.filter(
                                username=employee.user.username,
                                booking_date__gte=date_start,
                                booking_date__lte=date_end,
                            )
                        )
                    )
                new_qs = q[0]

                for i in range(1, len(q)):
                    new_qs |= q[i]

            try:
                btime = get_statistic_hours(new_qs)
                serializer = BookingSerializer(new_qs, many=True)
                if subflag:
                    return Response(
                        [
                            f"{len(new_qs)} (show all users, because user with such username doesn't exist)",
                            serializer.data,
                            btime / 3600,
                        ]
                    )
                return Response([len(new_qs), serializer.data, btime / 3600])
            except Exception:
                return Response(data=[])

        try:
            if flag:
                data = Booking.objects.filter(
                    username=username,
                    booking_date__gte=date_start,
                    reservation_time__lte=date_end,
                )
            else:
                subflag = True
                data = Booking.objects.filter(
                    booking_date__gte=date_start, reservation_time__lte=date_end
                )

            btime = get_statistic_hours(data)
            serializer = BookingSerializer(data, many=True)
            if subflag:
                return Response(
                    [
                        f"{len(data)} (show all users, because user with such username doesn't exist)",
                        serializer.data,
                        btime / 3600,
                    ]
                )
            return Response([len(data), serializer.data, btime / 3600])
        except Exception:
            return Response(data=[])

    def get_queryset(self) -> QuerySet[_MT_co]:
        request = self.request
        user = request.user

        if user.user_role == "EM":
            return Booking.objects.filter(
                username=user.username, reservation_time__gte=timezone.now()
            )
        elif user.user_role == "ES":
            q = []
            supervisor = EmployeeSupervisor.objects.filter(user=user).first()
            employees = Employee.objects.filter(supervisor=supervisor)
            for employee in employees:
                q.append(
                    (
                        Booking.objects.filter(
                            username=employee.user.username,
                            reservation_time__gte=timezone.now(),
                        )
                    )
                )
            new_qs = q[0]

            for i in range(1, len(q)):
                new_qs |= q[i]

            return new_qs

        return Booking.objects.filter(reservation_time__gte=timezone.now())

    def get_serializer_class(self) -> BaseSerializer[_MT_co]:
        return self.serializer_classes_by_action.get(
            self.action, self.default_serializer_class
        )

    def perform_destroy(self, instance: Any) -> Any:
        instance_id = instance.id
        reason = self.request.data.get("reason", "")
        super().perform_destroy(instance)
        user = User.objects.filter(username=instance.username).first()
        place_id = instance.place_id
        date_start = instance.booking_date
        date_end = instance.reservation_time
        user_employee_email = Employee.objects.filter(user=user).first().email
        send_mail(
            user_employee_email,
            f"Your booking information has been deleted by this reason '{reason}'. There were following:"
            f"Start time of booking place {place_id}: {date_start}, "
            f"End time of booking: {date_end}.",
        )
        remove_notifications(
            self.request.user.username,
            user.username,
            instance_id,
            place_id,
            date_start,
            date_end,
            reason,
        )


class OfficeUserView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = OfficeUser.objects.all()
    serializer_class = OfficeUserSerializer

    def get_queryset(self) -> QuerySet[_MT_co]:
        return OfficeUser.objects.filter(username=self.request.user.username)

    @action(
        methods=['GET'],
        detail=False,
        url_path='available_workplaces',
        url_name='available_workplaces',
    )
    def available_workplaces(self, request: Request) -> Response:
        user = request.user

        if user.user_role == "EM":
            workplaces = get_available_workplaces(user.username)
            return Response(WorkplaceSerializer(workplaces, many=True).data)

        return Response(data=[])
