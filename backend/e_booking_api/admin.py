from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User,
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

from .forms import CustomUserCreationForm

class UserAdmin(BaseUserAdmin):
    """Custom User Admin"""
    list_display = ('email', 'name')
    ordering = ['email']
    list_filter = ('groups',)
    prepopulated_fields = {"slug": ("name",)}

    #Fields to be displayed on the user detail page
    fieldsets = (
        (None, {
            'fields': ('email', 'password', 'slug')
        }),
        ('Personal_info', {
            'fields': ('name',)
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
            'fields': ('email', 'name', 'slug', 'password1', 'password2', 'is_active', 'is_staff')
        }),
    )
    
# Admin admin
class AdminAdmin(UserAdmin):
    """Custom Admin for Admin Model"""
    list_display = ('email', 'name', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Admin Specific Info', {
            'fields': (),
        }),
    )

# Customer admin
class CustomerAdmin(UserAdmin):
    """Custom Admin for Customer Model"""
    list_display = ('email', 'name', 'phone_number', 'address')
    fieldsets = UserAdmin.fieldsets + (
        ('Customer Specific Info', {
            'fields': ('phone_number', 'address'),
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Customer Specific Info', {
            'fields': ('phone_number', 'address'),
        }),
    )

# Owner admin
class OwnerAdmin(UserAdmin):
    """Custom Admin for Owner Model"""
    list_display = ('email', 'name', 'phone_number', 'address', 'total_earning')
    fieldsets = UserAdmin.fieldsets + (
        ('Owner Specific Info', {
            'fields': ('phone_number', 'address', 'total_earning'),
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Owner Specific Info', {
            'fields': ('phone_number', 'address', 'total_earning'),
        }),
    )
    
class RentalListingAdmin(admin.ModelAdmin):
    """Custom Admin for RentalListing Model"""
    list_display = ('title', 'owner')
    prepopulated_fields = {"slug": ("title",)}

# Register models with their custom admin classes
admin.site.register(User, UserAdmin)
admin.site.register(Admin, AdminAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Owner, OwnerAdmin)
admin.site.register(RentalListing, RentalListingAdmin)
admin.site.register(RentalImage)
admin.site.register(Favourite)
admin.site.register(BookingHistory)
admin.site.register(Booking)
admin.site.register(Review)
admin.site.register(Payment)