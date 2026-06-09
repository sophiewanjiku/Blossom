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
    We extend Django's built-in AbstractUser instead of
    building auth from scratch. AbstractUser already has
    password hashing, login methods, admin support etc.
    We just add our custom fields on top.
    """

    # Make email the login field instead of username
    email = models.EmailField(unique=True)
    name  = models.CharField(max_length=120, blank=True)

    # Which fairytale world this user chose
    theme = models.CharField(
        max_length=20,
        choices=THEME_CHOICES,
        default='frozen',
    )

    onboarding_complete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    # This tells Django to use email for login
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # needed for createsuperuser

    def __str__(self):
        return self.email

    class Meta:
        db_table = 'blossom_users'