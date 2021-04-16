from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ContractView,
    DirectorView,
    EmployeeSupervisorView,
    EmployeeView,
    ModeratorView,
    PlatformAdministratorView,
    StructuralUnitView,
    UserView,
    WarehouseManagerView, GoogleSocialAuthView,
)

router = DefaultRouter()
router.register(r'users', UserView, basename="users")
router.register(r'contracts', ContractView, basename="contracts")
router.register(r'units', StructuralUnitView, basename="units")
router.register(r'directors', DirectorView, basename="directors")
router.register(r'administrators', PlatformAdministratorView, basename="administrators")
router.register(r'moderators', ModeratorView, basename="moderators")
router.register(r'employees', EmployeeView, basename="employees")
router.register(r'supervisors', EmployeeSupervisorView, basename="supervisors")
router.register(r'managers', WarehouseManagerView, basename="warehouse_managers")

urlpatterns = [
    path(r'', include(router.urls)),
    path('google/', GoogleSocialAuthView.as_view()),
]
