from typing import TypeVar

from django.contrib.auth import get_user_model
from django.db.models import Model
from rest_framework import mixins, viewsets, status
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer

from .models import (
    Contract,
    Director,
    Employee,
    EmployeeSupervisor,
    Moderator,
    PlatformAdministrator,
    StructuralUnit,
    WarehouseManager,
)
from .permissions import (
    IsDirectorOrReadOnly,
    IsEmployeeOrReadOnly,
    IsEmployeeSupervisorOrReadOnly,
    IsModeratorOrReadOnly,
    IsPAOrReadOnly,
    IsWarehouseManagerOrReadOnly,
)
from .serializers import (
    ContractSerializer,
    DirectorSerializer,
    EmployeeSerializer,
    EmployeeSupervisorSerializer,
    ListUserSerializer,
    ModeratorSerializer,
    PlatformAdministratorSerializer,
    StructuralUnitSerializer,
    UpdateUserSerializer,
    UserSerializer,
    WarehouseManagerSerializer, GoogleSocialAuthSerializer,
)

User = get_user_model()
_MT_co = TypeVar("_MT_co", bound=Model, covariant=True)


class ContractView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    CRUD for Contract types
    """

    queryset = Contract.objects.all()
    serializer_class = ContractSerializer


class StructuralUnitView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    CRUD for Units
    """

    queryset = StructuralUnit.objects.all()
    serializer_class = StructuralUnitSerializer


class UserView(
    viewsets.GenericViewSet,
    viewsets.mixins.CreateModelMixin,
    viewsets.mixins.ListModelMixin,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.DestroyModelMixin,
    viewsets.mixins.UpdateModelMixin,
):
    """
    Provide jwt register and auth
    """

    queryset = User.objects.filter(is_active=True)

    default_serializer_class = UserSerializer

    serializer_classes_by_action = {
        "list": ListUserSerializer,
        "create": UserSerializer,
        "retrieve": ListUserSerializer,
        "update": UpdateUserSerializer,
    }

    def get_serializer_class(self) -> BaseSerializer[_MT_co]:
        return self.serializer_classes_by_action.get(
            self.action, self.default_serializer_class
        )

    @action(
        methods=['GET'], detail=False, url_path='current_user', url_name='current_user'
    )
    def current_user(self, request: Request) -> Response:
        serializer = ListUserSerializer(request.user)
        return Response(serializer.data)

    @action(
        methods=['GET'], detail=False, url_path='user_profile', url_name='user_profile'
    )
    def profile(self, request: Request) -> Response:
        user_role = request.user.user_role
        if user_role == "DR":
            serializer = DirectorSerializer(
                Director.objects.filter(user=request.user).first()
            )
            return Response(serializer.data)
        elif user_role == "PA":
            serializer = PlatformAdministratorSerializer(
                PlatformAdministrator.objects.filter(user=request.user).first()
            )
            return Response(serializer.data)
        elif user_role == "MO":
            serializer = ModeratorSerializer(
                Moderator.objects.filter(user=request.user).first()
            )
            return Response(serializer.data)
        elif user_role == "ES":
            serializer = EmployeeSupervisorSerializer(
                EmployeeSupervisor.objects.filter(user=request.user).first()
            )
            return Response(serializer.data)
        elif user_role == "EM":
            serializer = EmployeeSerializer(
                Employee.objects.filter(user=request.user).first()
            )
            return Response(serializer.data)
        elif user_role == "WM":
            serializer = WarehouseManagerSerializer(
                WarehouseManager.objects.filter(user=request.user).first()
            )
            return Response(serializer.data)


class DirectorView(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
):
    """
    Director view
    """

    permission_classes = [IsDirectorOrReadOnly, IsAuthenticated]
    queryset = Director.objects.all()
    serializer_class = DirectorSerializer


class PlatformAdministratorView(
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
):
    """
    PA view
    """

    permission_classes = [IsPAOrReadOnly, IsAuthenticated]
    queryset = PlatformAdministrator.objects.all()
    serializer_class = PlatformAdministratorSerializer


class ModeratorView(
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.UpdateModelMixin,
    viewsets.mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """
    Moderator view
    """

    permission_classes = [IsModeratorOrReadOnly, IsAuthenticated]
    queryset = Moderator.objects.all()
    serializer_class = ModeratorSerializer


class EmployeeView(
    viewsets.GenericViewSet,
    viewsets.mixins.ListModelMixin,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.UpdateModelMixin,
):
    """
    Employee view
    """

    permission_classes = [IsEmployeeOrReadOnly, IsAuthenticated]
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class EmployeeSupervisorView(
    viewsets.GenericViewSet,
    viewsets.mixins.ListModelMixin,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.UpdateModelMixin,
):
    """
    Employee Supervisor view
    """

    permission_classes = [IsEmployeeSupervisorOrReadOnly, IsAuthenticated]
    queryset = EmployeeSupervisor.objects.all()
    serializer_class = EmployeeSupervisorSerializer


class WarehouseManagerView(
    viewsets.GenericViewSet,
    viewsets.mixins.ListModelMixin,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.UpdateModelMixin,
):
    """
    Employee Supervisor view
    """

    permission_classes = [IsWarehouseManagerOrReadOnly, IsAuthenticated]
    queryset = WarehouseManager.objects.all()
    serializer_class = WarehouseManagerSerializer


class GoogleSocialAuthView(GenericAPIView):
    serializer_class = GoogleSocialAuthSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = ((serializer.validated_data)['auth_token'])
        return Response(data, status=status.HTTP_200_OK)
