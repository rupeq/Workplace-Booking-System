from typing import Any

from django.contrib import admin
from django.core.exceptions import ValidationError
from django.http import HttpRequest

from .models import (
    Contract,
    Director,
    Employee,
    EmployeeSupervisor,
    Moderator,
    PlatformAdministrator,
    StructuralUnit,
    User,
    WarehouseManager,
)

admin.site.register(PlatformAdministrator)
admin.site.register(Moderator)
admin.site.register(Director)
admin.site.register(Contract)
admin.site.register(StructuralUnit)
admin.site.register(EmployeeSupervisor)
admin.site.register(WarehouseManager)


@admin.register(Employee)
class EmployeeModel(admin.ModelAdmin):
    """
    Customize Employee view in django admin
    """

    list_display = (
        'user',
        'gender',
        'phone',
        'skype',
        'structural_unit',
        'position',
        'email',
    )
    list_filter = ('structural_unit',)
    search_fields = ("email__startswith",)
    fields = (
        'user',
        'middle_name',
        'gender',
        'birthdate',
        'phone',
        'skype',
        'structural_unit',
        'contract_type',
        'position',
        'email',
        'supervisor',
    )

    readonly_fields = ('date_of_employment',)

    def save_model(
        self, request: HttpRequest, obj: Employee, form: Any, change: Any
    ) -> None:
        """
        Given a model instance save it to the database.
        """
        unit = obj.structural_unit
        supervisor_unit = obj.supervisor.structural_unit

        if supervisor_unit == unit:
            super().save_model(request, obj, form, change)
        else:
            raise ValidationError(
                "User's unit and unit of supervisor must be the same!"
            )


@admin.register(User)
class UserModel(admin.ModelAdmin):
    """
    Customize user view in django admin
    """

    list_display = (
        'username',
        'password',
        'is_staff',
        'is_superuser',
        'user_role',
        'is_active',
    )
    list_filter = ('user_role',)
    search_fields = ("username__startswith",)
    fields = (
        'username',
        'password',
        'first_name',
        'last_name',
        'is_staff',
        'is_superuser',
        'user_role',
        'is_active',
    )

    def save_model(
        self, request: HttpRequest, obj: User, form: Any, change: Any
    ) -> None:
        """
        Given a model instance save it to the database.
        """
        user = User.objects.get(id=obj.id)
        user_role = obj.user_role
        change_role(user, obj)

        if not user_role:
            return super().save_model(request, obj, form, change)

        if user_role == "DR":
            Director.objects.create(user=user)
        elif user_role == "PA":
            obj.is_staff = True
            obj.is_superuser = True
            obj.save()
            PlatformAdministrator.objects.create(
                user=user, email="Write your email address"
            )
        elif user_role == "MO":
            Moderator.objects.create(user=user)
        elif user_role == "EM":
            Employee.objects.create(
                user=user,
                phone="Enter a phone number",
                skype="Enter your skype id",
                email="Write your email address",
            )
        elif user_role == "ES":
            EmployeeSupervisor.objects.create(
                user=user,
                phone="Enter a phone number",
                skype="Enter your skype id",
                email="Write your email address",
            )
        elif user_role == "WM":
            WarehouseManager.objects.create(user=user)

        super().save_model(request, obj, form, change)


def change_role(user: User, obj: User) -> None:
    if Director.objects.filter(user=user).first():
        Director.objects.filter(user=user).delete()
    if Director.objects.filter(user=user).first():
        Director.objects.filter(user=user).delete()
    elif PlatformAdministrator.objects.filter(user=user).first():
        obj.is_staff = False
        obj.is_superuser = False
        obj.save()
        PlatformAdministrator.objects.filter(user=user).delete()
    elif Moderator.objects.filter(user=user).first():
        Moderator.objects.filter(user=user).delete()
    elif Employee.objects.filter(user=user).first():
        Employee.objects.filter(user=user).delete()
    elif EmployeeSupervisor.objects.filter(user=user).first():
        EmployeeSupervisor.objects.filter(user=user).delete()
    elif WarehouseManager.objects.filter(user=user).first():
        WarehouseManager.objects.filter(user=user).delete()
