from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User,
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

from .forms import CustomUserCreationForm

class UserAdmin(BaseUserAdmin):
    """Custom User Admin"""
    list_display = ('email', 'name')
    ordering = ['email']
    list_filter = ('groups',)
    prepopulated_fields = {"slug": ("email",)}

    #Fields to be displayed on the user detail page
    fieldsets = (
        (None, {
            'fields': ('email', 'password', 'slug')
        }),
        ('Personal_info', {
            'fields': ('name', 'phone_number')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'groups', 'user_permissions')
        }),
        ('Important dates', {
            'fields': ('last_login',)
        }),
    )

    add_form = CustomUserCreationForm
    # Fields to be displayed in user creation form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'phone_number', 'slug', 'password1', 'password2', 'is_active', 'is_staff')
        }),
    )
    
    
class RentalListingAdmin(admin.ModelAdmin):
    """Custom Admin for RentalListing Model"""
    list_display = ('title', 'owner')
    prepopulated_fields = {"slug": ("title",)}

# Register models with their custom admin classes
admin.site.register(User, UserAdmin)
admin.site.register(Admin)
admin.site.register(Customer)
admin.site.register(Owner)
admin.site.register(RentalListing, RentalListingAdmin)
admin.site.register(RentalImage)
admin.site.register(UtilityBillImage)
admin.site.register(CustomerBookingHistory)
admin.site.register(OwnerBookingHistory)
admin.site.register(Booking)
admin.site.register(Payment)