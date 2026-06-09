from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .serializers import RegisterSerializer, UserProfileSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """POST /api/accounts/register/"""
    queryset         = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]  # no auth needed to register

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Give the new user a JWT immediately so they're logged in
        refresh = RefreshToken.for_user(user)
        return Response({
            'user':    UserProfileSerializer(user).data,
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """POST /api/accounts/login/"""
    permission_classes = [AllowAny]

    def post(self, request):
        email    = request.data.get('email', '').lower().strip()
        password = request.data.get('password', '')

        # authenticate() checks the password hash
        user = authenticate(request, username=email, password=password)

        if not user:
            return Response(
                {'detail': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            'user':    UserProfileSerializer(user).data,
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
        })


class ProfileView(generics.RetrieveUpdateAPIView):
    """GET / PATCH /api/accounts/me/"""
    serializer_class   = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user  # return the currently logged-in user