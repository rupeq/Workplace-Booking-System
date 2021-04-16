from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.permissions import SAFE_METHODS, BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView
from userapp.models import Employee, EmployeeSupervisor

from .models import Booking, OfficeUser
from .service import get_office

User = get_user_model()


class IsInOffice(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        """
        Return `True` if place user want to book in office under using user, otherwise `False`
        """

        if request.method in SAFE_METHODS and request.user.is_authenticated:
            return True

        if request.method not in SAFE_METHODS:
            user = request.user
            if request.method == 'DELETE' or request.method == 'PUT':
                if user.user_role == "PA" or user.user_role == "DR":
                    return True
                booking_id = request.path.split('/')[-2]
                booking_spec = Booking.objects.filter(id=booking_id).first()
                if user.user_role == "MO":
                    if timezone.now() + timedelta(hours=2) < booking_spec.booking_date:
                        return True
                if user.user_role == "EM":
                    booking_creator = booking_spec.username
                    if booking_creator == user.username:
                        return True
                elif user.user_role == "ES":
                    creator = User.objects.filter(
                        username=Booking.objects.filter(id=booking_id).first().username
                    ).first()
                    supervisor = EmployeeSupervisor.objects.filter(user=user).first()
                    user_under_control = Employee.objects.filter(
                        user=creator, supervisor=supervisor
                    ).first()
                    if user_under_control:
                        return True

            if user.user_role == "EM":
                return True

        return False
