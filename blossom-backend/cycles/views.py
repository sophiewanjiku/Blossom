from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import date

from .models import CycleProfile, DailyLog
from .serializers import (
    CycleProfileSerializer,
    DailyLogSerializer,
    PredictionSerializer,
    CalendarDaySerializer,
)
from .algorithm import predict_cycle, predict_cycle_from_history, get_calendar_month


def get_or_create_profile(user):
    profile, _ = CycleProfile.objects.get_or_create(
        user=user,
        defaults={
            'average_cycle_length':  28,
            'average_period_length': 5,
        }
    )
    return profile


class CycleProfileView(generics.RetrieveUpdateAPIView):
    """GET + PATCH /api/cycles/profile/"""
    serializer_class   = CycleProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_or_create_profile(self.request.user)


class PredictionView(APIView):
    """GET /api/cycles/prediction/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_or_create_profile(request.user)

        # If no last_period_date set, return a safe default
        # so the frontend doesn't crash
        if not profile.last_period_date:
            return Response({
                'current_day':       1,
                'total_days':        28,
                'phase':             'menstrual',
                'phase_name':        'Menstrual Phase',
                'phase_day':         1,
                'days_until_period': 28,
                'next_period_date':  None,
                'ovulation_date':    None,
                'fertile_start':     None,
                'fertile_end':       None,
                'is_fertile_now':    False,
                'cycle_length':      28,
                'period_length':     5,
                'no_data':           True,
            })

        # Use history if available, otherwise use profile settings
        period_dates = list(
            DailyLog.objects
            .filter(user=request.user)
            .exclude(flow='none')
            .exclude(flow='')
            .values_list('date', flat=True)
            .order_by('date')
        )

        if len(period_dates) >= 2:
            prediction = predict_cycle_from_history(
                period_dates=period_dates,
                period_length=profile.average_period_length,
            )
        else:
            prediction = predict_cycle(
                last_period_date=profile.last_period_date,
                cycle_length=profile.average_cycle_length,
                period_length=profile.average_period_length,
            )

        serializer = PredictionSerializer(prediction)
        return Response(serializer.data)


class CalendarView(APIView):
    """GET /api/cycles/calendar/?year=2026&month=6"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_or_create_profile(request.user)

        if not profile.last_period_date:
            return Response([])  # empty calendar until data exists

        today = date.today()
        try:
            year  = int(request.query_params.get('year',  today.year))
            month = int(request.query_params.get('month', today.month))
        except ValueError:
            return Response(
                {'detail': 'Invalid year or month.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        calendar_days = get_calendar_month(
            last_period_date=profile.last_period_date,
            cycle_length=profile.average_cycle_length,
            period_length=profile.average_period_length,
            year=year,
            month=month,
        )

        serializer = CalendarDaySerializer(calendar_days, many=True)
        return Response(serializer.data)


class DailyLogListCreateView(generics.ListCreateAPIView):
    """GET + POST /api/cycles/logs/"""
    serializer_class   = DailyLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs    = DailyLog.objects.filter(user=self.request.user)
        month = self.request.query_params.get('month')
        year  = self.request.query_params.get('year')
        if month and year:
            qs = qs.filter(
                date__month=int(month),
                date__year=int(year),
            )
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DailyLogDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET + PATCH + DELETE /api/cycles/logs/<id>/"""
    serializer_class   = DailyLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DailyLog.objects.filter(user=self.request.user)


class StartPeriodView(APIView):
    """POST /api/cycles/start-period/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        today   = date.today()
        profile = get_or_create_profile(request.user)

        log, created = DailyLog.objects.update_or_create(
            user=request.user,
            date=today,
            defaults={'flow': request.data.get('flow', 'medium')}
        )

        # Update last period date on profile
        if not profile.last_period_date or today <= profile.last_period_date:
            profile.last_period_date = today
            profile.save(update_fields=['last_period_date'])

        return Response({
            'log':     DailyLogSerializer(log).data,
            'message': 'Logged successfully.',
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)