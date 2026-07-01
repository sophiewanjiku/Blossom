from django.urls import path
from .views import (
    CycleProfileView,
    PredictionView,
    CalendarView,
    DailyLogListCreateView,
    DailyLogDetailView,
    StartPeriodView,
)

urlpatterns = [
    path('profile/',       CycleProfileView.as_view(),      name='cycle-profile'),
    path('prediction/',    PredictionView.as_view(),         name='prediction'),
    path('calendar/',      CalendarView.as_view(),           name='calendar'),
    path('logs/',          DailyLogListCreateView.as_view(), name='logs'),
    path('logs/<int:pk>/', DailyLogDetailView.as_view(),     name='log-detail'),
    path('start-period/',  StartPeriodView.as_view(),        name='start-period'),
]