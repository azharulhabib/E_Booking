from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from . import views


router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'admins', views.AdminViewSet, basename='admin')
router.register(r'customers', views.CustomerViewSet, basename='customer')
router.register(r'owners', views.OwnerViewSet, basename='owner')
router.register(r'rentallistings', views.RentalListingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]