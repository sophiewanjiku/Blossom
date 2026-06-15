from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    VerifyEmailView,
    ProfileView,
    OnboardingView,
    ResendVerificationView,
)

urlpatterns = [
    path('register/',             RegisterView.as_view(),            name='register'),
    path('login/',                LoginView.as_view(),               name='login'),
    path('verify-email/',         VerifyEmailView.as_view(),         name='verify-email'),
    path('resend-verification/',  ResendVerificationView.as_view(),  name='resend-verification'),
    path('me/',                   ProfileView.as_view(),             name='profile'),
    path('onboarding/',           OnboardingView.as_view(),          name='onboarding'),
    path('token/refresh/',        TokenRefreshView.as_view(),        name='token-refresh'),
]