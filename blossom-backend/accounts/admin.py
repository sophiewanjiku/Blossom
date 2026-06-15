from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class BlossomUserAdmin(UserAdmin):
    # These are the columns shown in the user list in /admin
    list_display  = ('email', 'name', 'theme', 'email_verified', 'onboarding_complete', 'created_at')
    list_filter   = ('theme', 'email_verified', 'onboarding_complete')
    search_fields = ('email', 'name', 'username')
    ordering      = ('-created_at',)

    # Add our custom fields to the edit form in admin
    fieldsets = UserAdmin.fieldsets + (
        ('Blossom profile', {
            'fields': (
                'theme', 'date_of_birth', 'cycle_length',
                'last_period_date', 'health_conditions',
                'email_verified', 'onboarding_complete',
            )
        }),
    )