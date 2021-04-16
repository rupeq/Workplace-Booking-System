from rest_framework.permissions import SAFE_METHODS, BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView

from .models import (
    Director,
    Employee,
    EmployeeSupervisor,
    Moderator,
    PlatformAdministrator,
    WarehouseManager,
)


class IsDirectorOrReadOnly(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        """
        Return `True` if director or method in safe methods and user is authenticated, `False` otherwise.
        """
        return bool(
            request.method in SAFE_METHODS
            and request.user.is_authenticated
            or Director.objects.filter(user=request.user).first()
        )


class IsPAOrReadOnly(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        """
        Return `True` if Platform Administrator or method in safe methods and user is authenticated, `False` otherwise.
        """
        return bool(
            request.method in SAFE_METHODS
            and request.user.is_authenticated
            or PlatformAdministrator.objects.filter(user=request.user).first()
        )


class IsModeratorOrReadOnly(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        """
        Return `True` if moderator or method in safe methods and user is authenticated, `False` otherwise.
        """
        return bool(
            request.method in SAFE_METHODS
            and request.user.is_authenticated
            or Moderator.objects.filter(user=request.user).first()
        )


class IsEmployeeOrReadOnly(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        """
        Return `True` if employee or method in safe methods and user is authenticated, `False` otherwise.
        """
        return bool(
            request.method in SAFE_METHODS
            and request.user.is_authenticated
            or Employee.objects.filter(user=request.user).first()
        )


class IsEmployeeSupervisorOrReadOnly(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        """
        Return `True` if employee supervisor or method in safe methods and user is authenticated, `False` otherwise.
        """
        return bool(
            request.method in SAFE_METHODS
            and request.user.is_authenticated
            or EmployeeSupervisor.objects.filter(user=request.user).first()
        )


class IsWarehouseManagerOrReadOnly(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        """
        Return `True` if warehouse manager or method in safe methods and user is authenticated, `False` otherwise.
        """
        return bool(
            request.method in SAFE_METHODS
            and request.user.is_authenticated
            or WarehouseManager.objects.filter(user=request.user).first()
        )
