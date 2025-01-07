from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import (
    Admin,
    Customer,
    Owner,
    RentalListing,
    RentalImage,
    UtilityBillImage,
    CustomerBookingHistory,
    OwnerBookingHistory,
    Booking,
    Payment
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'password', 'name', 'phone_number', 'slug', 'is_active', 'is_staff', 'is_superuser')
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
        
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        admin = Admin.objects.create(**validated_data)
        
        if password:
            admin.set_password(password)
            admin.save()
        
        return admin
        
class CustomerSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = Customer
       
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        customer = Customer.objects.create(**validated_data)
        
        if password:
            customer.set_password(password)
            customer.save()
        
        return customer
       
class OwnerSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = Owner
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        owner = Owner.objects.create(**validated_data)
        
        if password:
            owner.set_password(password)
            owner.save()
        
        return owner
        
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
        
class UtilityImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UtilityBillImage
        fields = '__all__'
        read_only_fields = ('id',)
        
class CustomerBookingHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerBookingHistory
        fields = '__all__'
        read_only_fields = ('id',)
        
class OwnerBookingHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnerBookingHistory
        fields = '__all__'
        read_only_fields = ('id',)
        
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('id',)
        
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('id',)