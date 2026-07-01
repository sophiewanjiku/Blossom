from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.core.cache import cache
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from .serializers import (
    RegisterSerializer,
    UserProfileSerializer,
    OnboardingSerializer,
)
from .emails import (
    send_verification_email,
    send_password_reset_email,
    generate_token,
)

User = get_user_model()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access':  str(refresh.access_token),
    }


# ============================================================
# REGISTER
# ============================================================

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.save()

        # Generate verification token and store in Redis
        # Key: email_verify_{token} → user id, expires 24hrs
        token = generate_token()
        cache.set(f'email_verify_{token}', user.id, timeout=60 * 60 * 24)

        try:
            send_verification_email(user.email, token)
        except Exception:
            pass  # don't fail registration if email fails in dev

        return Response({
            'user':    UserProfileSerializer(user).data,
            **get_tokens_for_user(user),
            'message': 'Account created. Check your email to verify.',
        }, status=status.HTTP_201_CREATED)


# ============================================================
# LOGIN
# ============================================================

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email    = request.data.get('email', '').lower().strip()
        password = request.data.get('password', '')

        if not email or not password:
            return Response(
                {'detail': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=email, password=password)

        if not user:
            return Response(
                {'detail': 'No account found with these credentials.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {'detail': 'This account has been deactivated.'},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response({
            'user': UserProfileSerializer(user).data,
            **get_tokens_for_user(user),
        })


# ============================================================
# EMAIL VERIFICATION
# ============================================================

class VerifyEmailView(APIView):
    """
    GET /api/accounts/verify-email/?token=xxxxx

    Called when the user clicks the link in their email.
    We look up the token in Redis, find the user,
    mark them verified, delete the token.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.query_params.get('token', '').strip()

        if not token:
            return Response(
                {'detail': 'Token is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Look up token in Redis
        user_id = cache.get(f'email_verify_{token}')

        if not user_id:
            return Response(
                {'detail': 'This link has expired or is invalid. Please request a new one.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Mark verified and delete token — one use only
        user.email_verified = True
        user.save(update_fields=['email_verified'])
        cache.delete(f'email_verify_{token}')

        return Response({
            'detail': 'Email verified successfully.',
            'email':  user.email,
        })


class ResendVerificationView(APIView):
    """POST /api/accounts/resend-verification/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if user.email_verified:
            return Response({'detail': 'Email is already verified.'})

        token = generate_token()
        cache.set(f'email_verify_{token}', user.id, timeout=60 * 60 * 24)

        try:
            send_verification_email(user.email, token)
        except Exception:
            return Response(
                {'detail': 'Failed to send email. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({'detail': 'Verification email sent.'})


# ============================================================
# FORGOT PASSWORD
# ============================================================

class ForgotPasswordView(APIView):
    """
    POST /api/accounts/forgot-password/

    User submits their email.
    We generate a reset token, store it in Redis,
    and send a reset link.

    Important: we always return 200 even if the email
    doesn't exist — this prevents email enumeration attacks
    (attackers figuring out which emails are registered).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').lower().strip()

        if not email:
            return Response(
                {'detail': 'Email is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
            token = generate_token()
            # Key: pwd_reset_{token} → user id, expires 1hr
            cache.set(f'pwd_reset_{token}', user.id, timeout=60 * 60)
            send_password_reset_email(user.email, token)
        except User.DoesNotExist:
            pass  # silent — don't reveal whether email exists

        # Always return the same response
        return Response({
            'detail': 'If an account exists with that email, a reset link has been sent.'
        })


class ResetPasswordView(APIView):
    """
    POST /api/accounts/reset-password/

    Called when the user submits their new password.
    Requires the token from the email link.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        token     = request.data.get('token', '').strip()
        password  = request.data.get('password', '')
        password2 = request.data.get('password2', '')

        if not token or not password or not password2:
            return Response(
                {'detail': 'Token, password and confirm password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if password != password2:
            return Response(
                {'detail': 'Passwords do not match.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Look up token
        user_id = cache.get(f'pwd_reset_{token}')
        if not user_id:
            return Response(
                {'detail': 'This reset link has expired or is invalid.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Validate password against Django's validators
        try:
            validate_password(password, user)
        except ValidationError as e:
            return Response(
                {'detail': list(e.messages)},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Set new password and delete token
        user.set_password(password)
        user.save()
        cache.delete(f'pwd_reset_{token}')

        return Response({'detail': 'Password reset successfully. You can now sign in.'})


# ============================================================
# PROFILE + ONBOARDING
# ============================================================

class ProfileView(generics.RetrieveUpdateAPIView):
    """GET + PATCH /api/accounts/me/"""
    serializer_class   = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class OnboardingView(APIView):
    """PATCH /api/accounts/onboarding/"""
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = OnboardingSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save(onboarding_complete=True)
        return Response({
            'user':    UserProfileSerializer(request.user).data,
            'message': 'Profile updated.',
        })


class ResendVerificationView(APIView):
    """POST /api/accounts/resend-verification/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.email_verified:
            return Response({'detail': 'Email already verified.'})

        token = generate_token()
        cache.set(f'email_verify_{token}', user.id, timeout=60 * 60 * 24)

        try:
            send_verification_email(user.email, token)
        except Exception:
            return Response(
                {'detail': 'Failed to send email.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({'detail': 'Verification email sent.'})