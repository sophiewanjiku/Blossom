from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.core.cache import cache

from .serializers import (
    RegisterSerializer,
    UserProfileSerializer,
    OnboardingSerializer,
)
from .emails import send_verification_email, generate_verification_token

User = get_user_model()


def get_tokens_for_user(user):
    """
    Helper — generates a fresh JWT pair for a user.
    We call this after register AND after login.
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access':  str(refresh.access_token),
    }


class RegisterView(APIView):
    """
    POST /api/accounts/register/

    1. Validate the submitted data
    2. Create the user
    3. Send a verification email
    4. Return JWT tokens so the user is logged in immediately
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        # Generate a verification token and store it in Redis
        # Cache key: verify_{token} → user id, expires in 24 hours
        token = generate_verification_token()
        cache.set(f'verify_{token}', user.id, timeout=60 * 60 * 24)

        # Send the email (prints to console in development)
        try:
            send_verification_email(user.email, token)
        except Exception:
            # Don't fail registration if email fails in dev
            pass

        return Response({
            'user':   UserProfileSerializer(user).data,
            **get_tokens_for_user(user),
            'message': 'Account created. Check your email to verify your address.',
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    POST /api/accounts/login/

    authenticate() is Django's built-in function —
    it checks the email + password against the database
    and returns the User object if correct, or None if not.
    """
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


class VerifyEmailView(APIView):
    """
    GET /api/accounts/verify-email/?token=xxxxx

    The frontend calls this when the user clicks the link
    in their email. We look up the token in Redis,
    find the user, and mark them as verified.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.query_params.get('token')
        if not token:
            return Response(
                {'detail': 'Token is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Look up token in Redis cache
        user_id = cache.get(f'verify_{token}')
        if not user_id:
            return Response(
                {'detail': 'This link has expired or is invalid.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
            user.email_verified = True
            user.save(update_fields=['email_verified'])
            # Delete the token — one-time use only
            cache.delete(f'verify_{token}')
            return Response({'detail': 'Email verified successfully.'})
        except User.DoesNotExist:
            return Response(
                {'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/accounts/me/  — returns the logged-in user's profile
    PATCH /api/accounts/me/ — updates name, theme etc.

    IsAuthenticated means only logged-in users can call this.
    The JWT token in the Authorization header identifies who they are.
    """
    serializer_class   = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # request.user is automatically set by JWTAuthentication
        return self.request.user


class OnboardingView(APIView):
    """
    PATCH /api/accounts/onboarding/

    Called when the user completes (or skips) onboarding.
    Saves dob, cycle length, last period, health conditions, theme.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = OnboardingSerializer(
            request.user,
            data=request.data,
            partial=True   # partial=True means fields are optional
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # If they submitted, mark onboarding as complete
        serializer.save(onboarding_complete=True)

        return Response({
            'user': UserProfileSerializer(request.user).data,
            'message': 'Profile updated.',
        })


class ResendVerificationView(APIView):
    """
    POST /api/accounts/resend-verification/

    User can request a new verification email if they
    lost the first one.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if user.email_verified:
            return Response({'detail': 'Email already verified.'})

        token = generate_verification_token()
        cache.set(f'verify_{token}', user.id, timeout=60 * 60 * 24)

        try:
            send_verification_email(user.email, token)
        except Exception as e:
            return Response(
                {'detail': 'Failed to send email.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({'detail': 'Verification email sent.'})