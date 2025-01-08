from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
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
from .serializers import (
    UserSerializer,
    AdminSerializer,
    CustomerSerializer,
    OwnerSerializer,
    RentalListingSerializer,
    RentalImageSerializer,
    UtilityImageSerializer,
    CustomerBookingHistorySerializer,
    OwnerBookingHistorySerializer,
    BookingSerializer,
    PaymentSerializer
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView
)


class LoginView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        user = get_user_model().objects.get(email=request.data['email'])
        
        if Customer.objects.filter(id=user.id).exists():
            user_role = 'Customer'
        elif Owner.objects.filter(id=user.id).exists():
            user_role = 'Owner'
        elif Admin.objects.filter(id=user.id).exists():
            user_role = 'Admin'
        elif user.is_superuser:
            user_role = 'Superuser'
        else:
            user_role = 'Unknown'
        
        # Add the user role to the response data
        response.data['user_role'] = user_role
        response.data['user_id'] = user.id
        print(response.data)
        
        return response

# Create your views here.
class UserViewSet(ModelViewSet):
    """Viewset for User model"""
    # queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    
    def get_queryset(self):
        return get_user_model().objects.all()
    
    def get_permissions(self):
        """Set permissions based on action"""
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]
    
    def create(self, request, *args, **kwargs):
        """Create a new user"""
        email = request.data.get('email')
        if get_user_model().objects.filter(email=email).exists():
            return Response(
                {'error': 'User with this email already exists.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        return super().create(request, *args, **kwargs)
    
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
        
        if not (current_user.id == user_to_delete.id or current_user.is_superuser):
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
    
    def create(self, request, *args, **kwargs):
        print(request.data)
        return super().create(request, *args, **kwargs)

class CustomerViewSet(UserViewSet):
    """Viewset for Customer model"""
    serializer_class = CustomerSerializer

class OwnerViewSet(UserViewSet):
    """Viewset for Owner model"""
    serializer_class = OwnerSerializer
        
class RentalListingViewSet(ModelViewSet):
    """Viewset for RentalListing model"""
    serializer_class = RentalListingSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get_queryset(self):
        user = self.request.user
        
        # Check if the user is an owner
        if Owner.objects.filter(id=user.id).exists():
            return RentalListing.objects.filter(owner=user)
        
        # Check if the user is a customer
        elif Customer.objects.filter(id=user.id).exists():
            return RentalListing.objects.filter(approved='accepted')
        
        # Check if the user is staff
        elif user.is_staff:
            return RentalListing.objects.filter(approved='pending')
        
        # If none of the above, return an empty queryset
        else:
            return RentalListing.objects.none()
        
    def create(self, request, *args, **kwargs):
        current_user = self.request.user
        owner = Owner.objects.get(id=current_user.id)
        request.data['owner'] = owner
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        current_user = self.request.user
        listing = self.get_object()
        
        if current_user.id != listing.owner.id and not current_user.is_staff:
            return Response(
                {'detail': 'You do not have permission to update this listing.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        current_user = self.request.user
        listing_to_delete = self.get_object()
        
        if current_user.id != listing_to_delete.owner.id and not current_user.is_staff:
            return Response(
                {'detail': 'You do not have permission to delete this listing.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        return super().destroy(request, *args, **kwargs)

class GetRentalImageById(APIView):
    """Fetch Rental Images by Listing ID"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="listing",
                description="ID of the rental listing",
                required=True,
                type=int,
                location=OpenApiParameter.QUERY,
            )
        ],
        responses={
            200: RentalImageSerializer(many=True),
            400: 'Bad Request - listing parameter is missing.',
            404: 'No images found for this listing.',
        },
    )
    def get(self, request, format=None):
        listing = self.request.query_params.get('listing')
        if not listing:
            return Response(
                {'error': 'listing_id parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        images = RentalImage.objects.filter(listing=listing)
        if images.exists():
            serializer = RentalImageSerializer(images, many=True)
            return Response({'images': serializer.data}, status=status.HTTP_200_OK)
        return Response({'error': 'No images found for this listing.'}, status=status.HTTP_404_NOT_FOUND)


class PostRentalImage(APIView):
    """Upload Rental Image"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=RentalImageSerializer,
        responses={
            201: 'Successfully uploaded image.',
            400: 'Invalid data.',
            500: 'Server error while uploading image.',
        },
    )
    def post(self, request):
        try:
            data = request.data
            serializer = RentalImageSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response({'success': 'Successfully uploaded image'}, status=status.HTTP_201_CREATED)
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {'error': f'Something went wrong: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetUtilityBillImageById(APIView):
    """Fetch Utility Bill Images by Listing ID"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="listing",
                description="ID of the utility bill listing",
                required=True,
                type=int,
                location=OpenApiParameter.QUERY,
            )
        ],
        responses={
            200: UtilityImageSerializer(many=True),
            400: 'Bad Request - listing parameter is missing.',
            404: 'No images found for this listing.',
        },
    )
    def get(self, request, format=None):
        listing = self.request.query_params.get('listing')
        if not listing:
            return Response(
                {'error': 'listing_id parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        images = UtilityBillImage.objects.filter(listing=listing)
        if images.exists():
            serializer = UtilityImageSerializer(images, many=True)
            return Response({'images': serializer.data}, status=status.HTTP_200_OK)
        return Response({'error': 'No images found for this listing.'}, status=status.HTTP_404_NOT_FOUND)


class PostUtilityBillImage(APIView):
    """Upload Utility Bill Image"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=UtilityImageSerializer,
        responses={
            201: 'Successfully uploaded image.',
            400: 'Invalid data.',
            500: 'Server error while uploading image.',
        },
    )
    def post(self, request):
        try:
            data = request.data
            serializer = UtilityImageSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response({'success': 'Successfully uploaded image'}, status=status.HTTP_201_CREATED)
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {'error': f'Something went wrong: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class CustomerBookingHistoryViewSet(ModelViewSet):
    """Viewset for CustomerBookingHistory model"""
    serializer_class = CustomerBookingHistorySerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get_queryset(self):
        user = self.request.user
        
        if Customer.objects.filter(id=user.id).exists():
            return CustomerBookingHistory.objects.filter(customer=user)
        elif user.is_staff:
            return CustomerBookingHistory.objects.all()
        else:
            return CustomerBookingHistory.objects.none()
    
class OwnerBookingHistoryViewSet(ModelViewSet):
    """Viewset for OwnerBookingHistory model"""
    serializer_class = OwnerBookingHistorySerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get_queryset(self):
        user = self.request.user
        
        if Owner.objects.filter(id=user.id).exists():
            return OwnerBookingHistory.objects.filter(owner=user)
        elif user.is_staff:
            return OwnerBookingHistory.objects.all()
        else:
            return OwnerBookingHistory.objects.none()
    
class BookingViewSet(ModelViewSet):
    """Viewset for Booking model"""
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get_queryset(self):
        user = self.request.user
        
        # Check if the user is an owner
        if Owner.objects.filter(id=user.id).exists():
            return Booking.objects.filter(owner=user)
        
        # Check if the user is a customer
        elif Customer.objects.filter(id=user.id).exists():
            return Booking.objects.filter(customer=user)
        
        else:
            return Booking.objects.none()
        
    def create(self, request, *args, **kwargs):
        current_user = self.request.user
        customer = Customer.objects.get(id=current_user.id)
        
        if not customer:
            return Response({'error': 'Customer not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        request.data['customer'] = customer
        return super().create(request, *args, **kwargs)
    
class PaymentViewSet(ModelViewSet):
    """Viewset for Payment model"""
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]