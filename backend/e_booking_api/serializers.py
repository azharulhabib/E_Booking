from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import (
    Admin,
    Customer,
    Owner,
    RentalListing,
    RentalImage,
    Favourite,
    BookingHistory,
    Booking,
    Review,
    Payment
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'name', 'slug', 'is_active', 'is_staff')
        read_only_fields = ('id',)
        extra_kwargs = {
            'password': {
                'write_only': True,
                'style': {'input_type': 'password'}
            }
        }
        
    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        
        if password:
            user.set_password(password)
            user.save()
        
        return user
    