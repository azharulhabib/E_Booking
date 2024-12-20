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
        fields = ('id', 'email', 'password', 'name', 'slug', 'is_active', 'is_staff')
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
    
class AdminSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = Admin
        fields = UserSerializer.Meta.fields + ()
        
class CustomerSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = Customer
        fields = UserSerializer.Meta.fields + ('phone_number', 'address')
        
class OwnerSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = Owner
        fields = UserSerializer.Meta.fields + ('phone_number', 'address', 'total_earning')
        
class RentalListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentalListing
        fields = '__all__'
        read_only_fields = ('id',)
        
class RentalImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentalImage
        fields = '__all__'
        read_only_fields = ('id',)
        extra_kwargs = {
            'image': {'required': True}
        }
        
    def validate_rental_image(self, value):
        max_size = 5 * 1024 * 1024
        valid_file_types = ['image/jpeg', 'image/png']
        
        if value.size > max_size:
            raise serializers.ValidationError('File size must be less than 5MB.')
        
        if value.content_type not in valid_file_types:
            raise serializers.ValidationError('File type must be JPEG or PNG.')
        
        return value
    
class FavouriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favourite
        fields = '__all__'
        read_only_fields = ('id',)
        
class BookingHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingHistory
        fields = '__all__'
        read_only_fields = ('id',)
        
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('id',)
        
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('id',)
        
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('id',)