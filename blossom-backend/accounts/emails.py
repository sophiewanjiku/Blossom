from django.core.mail import send_mail
from django.conf import settings
import secrets

def generate_verification_token():
    """
    Creates a cryptographically secure random token.
    secrets.token_urlsafe gives us a URL-safe string —
    safe to put directly in a link without encoding.
    """
    return secrets.token_urlsafe(32)

def send_verification_email(user_email: str, token: str):
    """
    Sends the email verification link.
    In development this prints to the console (EMAIL_BACKEND setting).
    In production swap in SendGrid or similar.
    """
    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    send_mail(
        subject='Verify your Blossom account ✦',
        message=f"""
Welcome to Blossom!

Click the link below to verify your email address:
{verify_url}

This link expires in 24 hours.

If you didn't create a Blossom account, you can safely ignore this email.
        """,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        fail_silently=False,
    )