from django.db import models
from django.utils.translation import gettext_lazy as _


class OfficeUser(models.Model):
    """
    Model implements relations between user and office
    """

    username = models.CharField(_("Username"), max_length=50)
    office_id = models.CharField(_("Office"), max_length=6)

    def __str__(self) -> str:
        return f"{self.username} - {self.office_id}"


class Booking(models.Model):
    """
    Model implements information about booking
    """

    username = models.CharField(_("Username"), max_length=50)
    place_id = models.CharField(_("Place"), max_length=6)
    date = models.DateTimeField(_("Date"), auto_now=True)
    booking_date = models.DateTimeField(_("Booking start"))
    reservation_time = models.DateTimeField(_("Booking end"))
    laptop = models.BooleanField(_("Laptop"), default=False)
    headphones = models.BooleanField(_("Headphones"), default=False)
    monitor = models.BooleanField(_("Monitor"), default=False)
    keyboard = models.BooleanField(_("Keyboard"), default=False)

    def __str__(self) -> str:
        return f"{self.username} - {self.place_id} ({self.booking_date} | {self.reservation_time}"
