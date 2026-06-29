from rest_framework import serializers
from .models import CycleProfile, DailyLog


class CycleProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CycleProfile
        fields = (
            'id', 'average_cycle_length', 'average_period_length',
            'last_period_date', 'updated_at',
        )
        read_only_fields = ('id', 'updated_at')


class DailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model  = DailyLog
        fields = (
            'id', 'date', 'flow', 'symptoms',
            'mood', 'energy', 'sleep', 'notes',
            'bbt', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_date(self, value):
        """
        Prevent logging future dates.
        A validator is a function that raises an error
        if the data doesn't meet our rules.
        """
        from datetime import date
        if value > date.today():
            raise serializers.ValidationError(
                "You cannot log a future date."
            )
        return value


class PredictionSerializer(serializers.Serializer):
    """
    Read-only serializer for the cycle prediction output.
    Converts the CyclePrediction dataclass into JSON.
    """
    current_day       = serializers.IntegerField()
    total_days        = serializers.IntegerField()
    phase             = serializers.CharField()
    phase_name        = serializers.CharField()
    phase_day         = serializers.IntegerField()
    days_until_period = serializers.IntegerField()
    next_period_date  = serializers.DateField()
    ovulation_date    = serializers.DateField()
    fertile_start     = serializers.DateField()
    fertile_end       = serializers.DateField()
    is_fertile_now    = serializers.BooleanField()
    cycle_length      = serializers.IntegerField()
    period_length     = serializers.IntegerField()


class CalendarDaySerializer(serializers.Serializer):
    date      = serializers.DateField()
    day_type  = serializers.CharField()
    cycle_day = serializers.IntegerField()