from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
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
    
admin.site.register(User, UserAdmin)