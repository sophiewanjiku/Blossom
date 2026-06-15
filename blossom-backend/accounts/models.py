from django.contrib.auth.models import AbstractUser
from django.db import models

THEME_CHOICES = [
    ('frozen',     'Frozen'),
    ('tiana',      'Tiana'),
    ('rapunzel',   'Rapunzel'),
    ('cinderella', 'Cinderella'),
]

class User(AbstractUser):
    """
    We extend AbstractUser so we keep all of Django's built-in
    auth logic (password hashing, sessions, admin) and just
    add our custom fields on top.
    """
    email    = models.EmailField(unique=True)
    name     = models.CharField(max_length=120, blank=True)
    theme    = models.CharField(max_length=20, choices=THEME_CHOICES, default='frozen')

    # Onboarding fields — all optional so user can skip
    date_of_birth      = models.DateField(null=True, blank=True)
    cycle_length       = models.PositiveSmallIntegerField(default=28)
    last_period_date   = models.DateField(null=True, blank=True)
    health_conditions  = models.JSONField(default=list, blank=True)
    # JSONField stores a Python list as JSON in Postgres
    # e.g. ["PCOS", "Endometriosis"]

    onboarding_complete = models.BooleanField(default=False)

    # Email verification
    email_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Tell Django to use email for login instead of username
    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    class Meta:
        db_table = 'blossom_users'