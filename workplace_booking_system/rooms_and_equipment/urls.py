from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from .views.equipment import (
    AdditionalEquipmentDetailView,
    ChairDetailView,
    ListCreateAdditionalEquipmentView,
    ListCreateChairView,
    ListCreateTableView,
    TableDetailView,
)
from .views.office_building import office_detail, offices_list
from .views.room import ListCreateRoomView, RoomDetailView
from .views.workplace import ListCreateWorkplaceView, WorkplaceDetailView

app_name = 'rooms_and_equipment'
urlpatterns = [
    path('offices/', offices_list, name='offices'),
    path('offices/<str:office_id>/', office_detail, name='office-detail'),
    path('offices/<str:office_id>/rooms/', ListCreateRoomView.as_view(), name='rooms'),
    path(
        'offices/<str:office_id>/rooms/<str:room_id>/',
        RoomDetailView.as_view(),
        name='room-detail',
    ),
    path(
        'offices/<str:office_id>/rooms/<str:room_id>/workplaces/',
        ListCreateWorkplaceView.as_view(),
        name='workplace',
    ),
    path(
        'offices/<str:office_id>/rooms/<str:room_id>/workplaces/<str:workplace_id>/',
        WorkplaceDetailView.as_view(),
        name='workplace-detail',
    ),
    path(
        'offices/<str:office_id>/tables/', ListCreateTableView.as_view(), name='tables'
    ),
    path(
        'offices/<str:office_id>/tables/<str:inventory_number>/',
        TableDetailView.as_view(),
        name='table-detail',
    ),
    path(
        'offices/<str:office_id>/chairs/', ListCreateChairView.as_view(), name='chairs'
    ),
    path(
        'offices/<str:office_id>/chairs/<str:inventory_number>/',
        ChairDetailView.as_view(),
        name='chair-detail',
    ),
    path(
        'offices/<str:office_id>/additional_equipment/',
        ListCreateAdditionalEquipmentView.as_view(),
        name='additional_equipment',
    ),
    path(
        'offices/<str:office_id>/additional_equipment/<str:inventory_number>/',
        AdditionalEquipmentDetailView.as_view(),
        name='additional_equipment-detail',
    ),
]

urlpatterns = format_suffix_patterns(urlpatterns)
