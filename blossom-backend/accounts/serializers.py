from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    """
    A serializer converts between Python objects and JSON.
    This one validates registration data and creates a User.
    """

    password  = serializers.CharField(
        write_only=True,  # never sent back in responses
        validators=[validate_password]
    )
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

        user = User(username=email.split('@')[0], **validated_data)
        user.set_password(password)  # hashes it — never store plain text
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ('id', 'email', 'name', 'theme', 'onboarding_complete', 'created_at')
        read_only_fields = ('id', 'email', 'created_at')