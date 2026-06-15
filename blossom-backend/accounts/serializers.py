from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """
    Handles new user registration.
    password and password2 are write_only — they go IN
    but are never sent back in any response.
    """
    password  = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ('email', 'name', 'password', 'password2', 'theme')
        extra_kwargs = {'theme': {'required': False}}

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        email    = validated_data['email']

        # Auto-generate username from email prefix
        base     = email.split('@')[0]
        username = base
        counter  = 1
        # Keep trying until we find a unique username
        while User.objects.filter(username=username).exists():
            username = f"{base}{counter}"
            counter += 1

        user = User(username=username, **validated_data)
        user.set_password(password)  # hashes it — NEVER store plain text
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    """
    Just validates that email and password fields are present.
    Actual authentication happens in the view.
    """
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Used for GET /me/ and PATCH /me/
    read_only_fields can never be changed via API.
    """
    class Meta:
        model  = User
        fields = (
            'id', 'email', 'name', 'theme',
            'date_of_birth', 'cycle_length', 'last_period_date',
            'health_conditions', 'onboarding_complete',
            'email_verified', 'created_at',
        )
        read_only_fields = ('id', 'email', 'email_verified', 'created_at')


class OnboardingSerializer(serializers.ModelSerializer):
    """
    Handles the onboarding PATCH — only these fields
    are allowed to be updated through this endpoint.
    """
    class Meta:
        model  = User
        fields = (
            'date_of_birth', 'cycle_length', 'last_period_date',
            'health_conditions', 'theme', 'onboarding_complete',
        )