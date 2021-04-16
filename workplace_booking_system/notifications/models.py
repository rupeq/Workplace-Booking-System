from django.db import models
from django.utils import timezone


class Notification(models.Model):
    """
    Basic notification model
    """

    title = models.CharField("Title", max_length=150)
    description = models.CharField("Description", max_length=200)
    username = models.CharField("Username", max_length=50, default="")
    occurrence_time = models.DateTimeField("Occurrence", default=timezone.now)
    booking_id = models.IntegerField(default=0)
    is_checked = models.BooleanField("Checked", default=False)

    def __str__(self) -> str:
        return (
            f"{self.booking_id} - {self.username} - {self.title} - {self.description}"
        )
