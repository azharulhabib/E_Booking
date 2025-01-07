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
    
    def create_user(self, email, password, name, phone_number, **extra_fields):

        if not email:
            raise ValueError("The Email field must be set")
        if not password:
            raise ValueError("The Password field must be set")
        
        try:
            validate_email(email)
        except:
            raise ValidationError('User must have a valid email address')
        
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, password, name, phone_number, **extra_fields):

        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        
        return self.create_user(email, password, name, phone_number, **extra_fields)
    

class User(AbstractBaseUser, PermissionsMixin):
    '''Custom User Model'''
    
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    phone_number = PhoneNumberField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone_number']
    
    def _pass_valid(self, password):
        """Private method for testing valid password"""
        if password:
            if (len(password) < 8 or
                not re.search(r"[a-z]", password) or
                not re.search(r"[A-Z]", password) or
                not re.search(r"[0-9]", password) or
                not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password)):
                raise ValidationError('Password must contain at least 8 characters, '
                                      'including an uppercase letter, a lowercase letter, '
                                      'a number, and a special character.')

    def set_password(self, raw_password):
        """Validates raw password before hashing"""
        self._pass_valid(raw_password)
        super().set_password(raw_password)

    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.email
    
class Admin(User):
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.is_staff = True
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.email
    
class Customer(User):
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.email
    
class Owner(User):
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.email
    
class RentalListing(models.Model):
    APPROVED = [
        ('accepted', 'Accepted'),
        ('pending', 'Pending'),
        ('rejected', 'Rejected')
    ]
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    booking_schedule = models.DateField()
    home_size = models.IntegerField()
    floor = models.CharField(max_length=255)
    approved = models.CharField(
        max_length=10,
        choices=APPROVED,
        default='pending',
    )
    availability_status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
class RentalImage(models.Model):
    listing = models.ForeignKey(RentalListing, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='house_images/')
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.listing.title
    
class UtilityBillImage(models.Model):
    listing = models.ForeignKey(RentalListing, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='utility_bills/')
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.listing.title
    
    
class CustomerBookingHistory(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    listing = models.ForeignKey('RentalListing', on_delete=models.CASCADE)
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Booking History: {self.customer.email} - {self.listing.title}"
    
class OwnerBookingHistory(models.Model):
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE)
    listing = models.ForeignKey('RentalListing', on_delete=models.CASCADE)
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Booking History: {self.owner.email} - {self.listing.title}"
    
class Booking(models.Model):
    STATUS = [
        ('accepted', 'Accepted'),
        ('pending', 'Pending'),
        ('rejected', 'Rejected')
    ]
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE)
    listing = models.ForeignKey('RentalListing', on_delete=models.CASCADE)
    booked_status = models.CharField(
        max_length=10,
        choices=STATUS,
        default='pending',
    )
    start_date = models.DateField()
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Booking: {self.customer.email} - {self.listing.title}"
    
    
class Payment(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    payment_status = models.BooleanField(default=True)
    
    def save(self, *args, **kwargs):
        """Running Validators before saving"""
        self.full_clean()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Payment: {self.customer.email} - {self.amount}"