from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin
)
from phonenumber_field.modelfields import PhoneNumberField
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
import re


# Create your models here.
class UserManager(BaseUserManager):
    """Custom User Manager"""
    
    def create_user(self, email, password, **extra_fields):
        '''Create and save a new user'''
        
        if not email:
            raise ValueError('User must have an email address')
        if not password:
            raise ValueError('User must have a password')
        
        try:
            validate_email(email)
        except:
            raise ValidationError('User must have a valid email address')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, password, extra_fields):
        '''Create and save a new superuser'''
        
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")
        
        return self.create_user(email, password, **extra_fields)
    

class User(AbstractBaseUser, PermissionsMixin):
    '''Custom User Model'''
    
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    def __str__(self):
        return self.email
    
class Admin(User):
    is_staff = models.BooleanField(default=True)
    
    def __str__(self):
        return self.email
    
class Customer(User):
    phone_number = PhoneNumberField(unique=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return self.email
    
class Owner(User):
    phone_number = PhoneNumberField(unique=True)
    address = models.CharField(max_length=255)
    
    def __str__(self):
        return self.email
    