from django.contrib import admin

from .models import Booking, OfficeUser

admin.site.register(OfficeUser)
admin.site.register(Booking)
