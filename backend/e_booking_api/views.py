from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db.models import Q
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
from .serializers import (
    UserSerializer,
    AdminSerializer,
    CustomerSerializer,
    OwnerSerializer,
    RentalListingSerializer,
    RentalImageSerializer,
    FavouriteSerializer,
    BookingHistorySerializer,
    BookingSerializer,
    ReviewSerializer,
    PaymentSerializer
)


# Create your views here.
class UserViewSet(ModelViewSet):
    """Viewset for User model"""
    # queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    
    def get_queryset(self):
        if self.request.user.is_superuser:
            return get_user_model().objects.all()
        return get_user_model().objects.none()
    
    def get_permissions(self):
        """Set permissions based on action"""
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]
    
    def update(self, request, *args, **kwargs):
        """Update user profile"""
        current_user = self.request.user
        user = self.get_object()
        
        if 'is_active' in request.data:
            return Response(
                {'detail': 'You do not have permission to update this profile.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if current_user.id != user.id and not current_user.is_superuser:
            return Response(
                {'detail': 'You do not have permission to update this profile.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        current_user = self.request.user
        user_to_delete = self.get_object()
        
        if not current_user.is_superuser:
            return Response(
                {'detail': 'Only Superusers can delete users.'},
                status=status.HTTP_403_FORBIDDEN,
            )
            
        if user_to_delete.is_superuser:
            return Response(
                {'detail': 'Superusers cannot be deleted.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        return super().destroy(request, *args, **kwargs)
    
    #banning method
    
class AdminViewSet(UserViewSet):
    """Viewset for Admin model"""
    serializer_class = AdminSerializer

    def get_queryset(self):
        """Admin and superusers can access all user objects."""
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Admin.objects.all()
        return Admin.objects.none()


class CustomerViewSet(UserViewSet):
    """Viewset for Customer model"""
    serializer_class = CustomerSerializer

    def get_queryset(self):
        current_user = self.request.user
        
        if current_user.is_superuser or current_user.is_staff:
            return Customer.objects.all()

        # Check if the user is a Customer or Owner
        if hasattr(current_user, "customer") or hasattr(current_user, "owner"):
            # customer_queryset = Customer.objects.all()
            # owner_queryset = Owner.objects.all()
            # return customer_queryset | owner_queryset
            return Customer.objects.all()
            
        return Customer.objects.none()


class OwnerViewSet(UserViewSet):
    """Viewset for Owner model"""
    serializer_class = OwnerSerializer

    def get_queryset(self):
        current_user = self.request.user
        
        if current_user.is_superuser or current_user.is_staff:
            return Owner.objects.all()

        # Check if the user is a Customer or Owner
        if hasattr(current_user, "customer") or hasattr(current_user, "owner"):
            # customer_queryset = Customer.objects.all()
            # owner_queryset = Owner.objects.all()
            # return customer_queryset | owner_queryset
            return Owner.objects.all()
            
        return Owner.objects.none()
        
class RentalListingViewSet(ModelViewSet):
    """Viewset for RentalListing model"""
    queryset = RentalListing.objects.all()
    serializer_class = RentalListingSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get_serializer_class(self):
        if self.action == "upload_image":
            return RentalImageSerializer
        return super().get_serializer_class()
    
    def update(self, request, *args, **kwargs):
        current_user = self.request.user
        listing = self.get_object()
        
        if current_user.id != listing.owner.id and not current_user.is_superuser:
            return Response(
                {'detail': 'You do not have permission to update this listing.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        current_user = self.request.user
        listing_to_delete = self.get_object()
        
        if current_user.id != listing_to_delete.owner.id and not (current_user.is_superuser or current_user.is_staff):
            return Response(
                {'detail': 'You do not have permission to delete this listing.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'], url_path='upload-image')
    def upload_image(self, request, pk=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
