from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import NotificationView

router = DefaultRouter()
router.register(r'notifications', NotificationView, "notifications")

urlpatterns = [
    path(
        r'',
        include(
            router.urls,
        ),
    ),
]
