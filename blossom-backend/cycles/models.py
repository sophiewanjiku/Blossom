from django.db import models
from django.conf import settings

class CycleProfile(models.Model):
    """
    One profile per user — stores their cycle settings.
    This is separate from the User model because cycle data
    changes frequently and we want a clean separation.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cycle_profile'
    )

    # Core cycle settings
    average_cycle_length  = models.PositiveSmallIntegerField(default=28)
    average_period_length = models.PositiveSmallIntegerField(default=5)
    last_period_date      = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} — cycle profile"

    class Meta:
        db_table = 'blossom_cycle_profiles'


class DailyLog(models.Model):
    """
    One log per user per day.
    Stores everything the user tracked that day.
    """

    FLOW_CHOICES = [
        ('none',     'None'),
        ('spotting', 'Spotting'),
        ('light',    'Light'),
        ('medium',   'Medium'),
        ('heavy',    'Heavy'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='daily_logs'
    )

    date     = models.DateField()
    flow     = models.CharField(max_length=10, choices=FLOW_CHOICES, default='none')

    # Symptoms stored as a JSON list
    # e.g. ["Cramps", "Bloating", "Headache"]
    symptoms = models.JSONField(default=list, blank=True)

    # Journal fields
    mood     = models.CharField(max_length=50, blank=True)
    energy   = models.CharField(max_length=50, blank=True)
    sleep    = models.CharField(max_length=50, blank=True)
    notes    = models.TextField(blank=True)

    # Basal body temperature in Celsius
    bbt      = models.DecimalField(
        max_digits=4, decimal_places=2,
        null=True, blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'blossom_daily_logs'
        unique_together = ('user', 'date')  # one log per day per user
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.email} — {self.date}"