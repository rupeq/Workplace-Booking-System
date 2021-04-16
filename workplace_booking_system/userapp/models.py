from typing import Dict, List

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField
from rest_framework_simplejwt.tokens import RefreshToken


class Contract(models.Model):
    contract_type = models.CharField(verbose_name=_("Contract type"), max_length=100)
    description = models.TextField(_("Description"), null=True)

    def __str__(self) -> models.CharField:
        return self.contract_type


class StructuralUnit(models.Model):
    name = models.CharField(verbose_name=_("Structural unit"), max_length=50)
    description = models.TextField(_("Description"), null=True)

    def __str__(self) -> models.CharField:
        return self.name


AUTH_PROVIDERS = {'google': 'google', 'email': 'email'}


class User(AbstractUser):
    class Roles(models.TextChoices):
        DIRECTOR = 'DR', _('Director')
        PLATFORM_ADMINISTRATOR = 'PA', _('Platform administrator')
        MODERATOR = 'MO', _('Moderator')
        EMPLOYEESUPERVISOR = 'ES', _('Employee supervisor')
        EMPLOYEE = 'EM', _('Employee')
        WarehouseManager = 'WM', _('Warehouse manager')

    user_role = models.CharField(
        verbose_name=_("User role"), blank=True, choices=Roles.choices, max_length=2
    )
    is_active = models.BooleanField(
        _('active'),
        default=False,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    auth_provider = models.CharField(
        null=False,
        blank=False,
        max_length=255,
        default=AUTH_PROVIDERS.get('email'),
    )

    def save(self, *args: List, **kwargs: Dict) -> None:
        if self.is_superuser:
            self.is_active = True
        super().save(*args, **kwargs)

    def tokens(self) -> Dict:
        refresh = RefreshToken.for_user(self)
        return {'refresh': str(refresh), 'access': str(refresh.access_token)}


class BaseProfileModel(models.Model):
    """
    An abstract model class relevant to all users.
    """

    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_related",
        primary_key=True,
    )
    middle_name = models.CharField(
        verbose_name=_("Middle name"), max_length=50, blank=True
    )

    class Meta:
        abstract = True

    def __str__(self) -> models.CharField:
        if self.user.username:
            return self.user.username
        else:
            return self.user.email


class BaseUserModel(BaseProfileModel):
    """
    Abstract base class containing fields relevant to employees
    """

    class Gender(models.TextChoices):
        DEFAULT = 'D', _('Please, choice a gender')
        MALE = 'M', _('Male')
        FEMALE = 'F', _('Female')

    gender = models.CharField(
        verbose_name=_("Gender"),
        max_length=1,
        choices=Gender.choices,
        default=Gender.DEFAULT,
    )

    birthdate = models.DateField(verbose_name=_("Date of birth"), null=True)
    phone = PhoneNumberField(verbose_name=_("Phone Number"))
    skype = models.CharField(verbose_name=_("Skype"), max_length=50, blank=True)

    structural_unit = models.ForeignKey(
        StructuralUnit,
        on_delete=models.PROTECT,
        related_name="%(app_label)s_%(class)s_related_unit",
        null=True,
    )

    contract_type = models.ForeignKey(
        Contract,
        on_delete=models.PROTECT,
        related_name="%(app_label)s_%(class)s_related_contract",
        null=True,
    )

    date_of_employment = models.DateField(
        verbose_name=_("Date of employment"), auto_now=True
    )

    position = models.CharField(_("Position"), max_length=50)
    email = models.EmailField(verbose_name=_("Email"))


class Director(BaseProfileModel):
    """
    Model containing fields relevant to director
    """

    pass


class WarehouseManager(BaseProfileModel):
    """
    Model containing fields relevant to warehouse manager
    """

    pass


class PlatformAdministrator(BaseProfileModel):
    """
    Model containing fields relevant to platform administrator
    """

    email = models.EmailField(verbose_name=_("Email"))


class Moderator(BaseProfileModel):
    """
    Model containing fields relevant to offices and rooms moderators
    """

    email = models.EmailField(verbose_name=_("Email"))


class EmployeeSupervisor(BaseUserModel):
    """
    Model containing fields relevant to supervisors
    """

    pass


class Employee(BaseUserModel):
    """
    Model containing fields relevant to employees
    """

    supervisor = models.ForeignKey(
        EmployeeSupervisor,
        related_name="%(app_label)s_%(class)s_related_employee",
        on_delete=models.PROTECT,
        null=True,
    )
