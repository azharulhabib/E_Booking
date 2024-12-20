from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
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
)


# Create your views here.
class UserViewSet(ModelViewSet):
    """Viewset for User model"""
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    
    def get_permissions(self):
        """Set permissions based on action"""
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]
    
        