from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BookingView, OfficeUserView

router = DefaultRouter()
router.register(r'booking', BookingView, "booking")
router.register(r'useroffices', OfficeUserView, "useroffices")

urlpatterns = [
    path(
        r'',
        include(
            router.urls,
        ),
    ),
]
