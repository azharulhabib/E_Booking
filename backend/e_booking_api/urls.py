from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView
)
from . import views


router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'admins', views.AdminViewSet, basename='admin')
router.register(r'customers', views.CustomerViewSet, basename='customer')
router.register(r'owners', views.OwnerViewSet, basename='owner')
router.register(r'rentallistings', views.RentalListingViewSet, basename='rentallisting')
router.register(r'customer-booking-historys', views.CustomerBookingHistoryViewSet, basename='customer-booking-history')
router.register(r'owner-booking-historys', views.OwnerBookingHistoryViewSet, basename='owner-booking-history')
router.register(r'bookings', views.BookingViewSet, basename='booking')
router.register(r'payments', views.PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('rental-images/', views.GetRentalImageById.as_view(), name='get_rental_images'),
    path('rental-images/upload/', views.PostRentalImage.as_view(), name='post_rental_image'),
    path('utility-bill-images/', views.GetUtilityBillImageById.as_view(), name='get_utility_bill_images'),
    path('utility-bill-images/upload/', views.PostUtilityBillImage.as_view(), name='post_utility_bill_image'),
    path('login/', views.LoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]