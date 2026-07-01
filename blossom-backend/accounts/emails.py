import secrets
from django.core.mail import send_mail
from django.conf import settings


def generate_token() -> str:
    """
    Generates a cryptographically secure random token.
    secrets.token_urlsafe produces a URL-safe string —
    safe to put directly in a link without encoding.
    32 bytes = 43 characters of randomness.
    """
    return secrets.token_urlsafe(32)


def send_verification_email(user_email: str, token: str):
    """
    Sends the email verification link.
    In development this prints to the console.
    In production swap EMAIL_BACKEND for SendGrid.
    """
    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    send_mail(
        subject='Verify your Blossom account ✦',
        message=f"""
Welcome to Blossom.

Click the link below to verify your email address:
{verify_url}

This link expires in 24 hours.

If you did not create a Blossom account, you can safely ignore this email.
        """,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        fail_silently=False,
    )


def send_password_reset_email(user_email: str, token: str):
    """
    Sends the password reset link.
    """
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"

    send_mail(
        subject='Reset your Blossom password',
        message=f"""
You requested a password reset for your Blossom account.

Click the link below to set a new password:
{reset_url}

This link expires in 1 hour.

If you did not request this, you can safely ignore this email.
Your password will not change.
        """,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        fail_silently=False,
    )