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


def get_or_create_profile(user) -> CycleProfile:
    """
    Helper — gets the user's cycle profile, creating one
    with defaults if it doesn't exist yet.
    get_or_create returns a tuple (object, created)
    so we unpack with [0] to get just the object.
    """
    profile, _ = CycleProfile.objects.get_or_create(user=user)
    return profile


class CycleProfileView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/cycles/profile/  — get cycle settings
    PATCH /api/cycles/profile/ — update cycle settings
    """
    serializer_class   = CycleProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_or_create_profile(self.request.user)


class PredictionView(APIView):
    """
    GET /api/cycles/prediction/

    The main algorithm endpoint.
    Returns everything the dashboard needs:
    current day, phase, next period, fertile window etc.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_or_create_profile(request.user)

        if not profile.last_period_date:
            return Response(
                {'detail': 'Please set your last period date first.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get all logged period dates from history
        # for the smarter multi-cycle prediction
        period_dates = list(
            DailyLog.objects
            .filter(user=request.user)
            .exclude(flow='none')
            .exclude(flow='')
            # Get the first day of each period cluster
            .values_list('date', flat=True)
            .order_by('date')
        )

        # Use history-based prediction if we have data,
        # otherwise fall back to profile settings
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
    """
    GET /api/cycles/calendar/?year=2026&month=6

    Returns all days in a month tagged with their type
    (period, fertile, ovulation, predicted, normal).
    The frontend calendar reads this directly.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_or_create_profile(request.user)

        if not profile.last_period_date:
            return Response(
                {'detail': 'Please set your last period date first.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Read month and year from query params
        # Default to current month if not provided
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
    """
    GET  /api/cycles/logs/         — list all logs
    GET  /api/cycles/logs/?month=6&year=2026 — filtered
    POST /api/cycles/logs/         — create a log
    """
    serializer_class   = DailyLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = DailyLog.objects.filter(user=self.request.user)

        # Optional month/year filter
        month = self.request.query_params.get('month')
        year  = self.request.query_params.get('year')

        if month and year:
            qs = qs.filter(
                date__month=int(month),
                date__year=int(year),
            )

        return qs

    def perform_create(self, serializer):
        # Automatically attach the logged-in user
        serializer.save(user=self.request.user)


class DailyLogDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/cycles/logs/<id>/  — get one log
    PATCH  /api/cycles/logs/<id>/  — update a log
    DELETE /api/cycles/logs/<id>/  — delete a log
    """
    serializer_class   = DailyLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only access their own logs
        return DailyLog.objects.filter(user=self.request.user)


class StartPeriodView(APIView):
    """
    POST /api/cycles/start-period/

    Called when the user taps "Track today" on the dashboard.
    Creates a log for today with flow=medium and updates
    the cycle profile's last_period_date.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        today   = date.today()
        profile = get_or_create_profile(request.user)

        # Create or update today's log
        log, created = DailyLog.objects.update_or_create(
            user=request.user,
            date=today,
            defaults={
                'flow': request.data.get('flow', 'medium'),
            }
        )

        # Update the last period date on the profile
        # Only update if today is earlier than existing date
        # or no date is set yet
        if (
            not profile.last_period_date
            or today < profile.last_period_date
            or (today - profile.last_period_date).days <= 1
        ):
            profile.last_period_date = today
            profile.save(update_fields=['last_period_date'])

        return Response({
            'log':     DailyLogSerializer(log).data,
            'message': 'Period logged successfully.',
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)