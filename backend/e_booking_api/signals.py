from django.db.models.signals import pre_save, post_save
from django.contrib.auth.models import Group
from django.dispatch import receiver
from django.utils.text import slugify
from .models import User, RentalListing

@receiver(post_save, sender=User)
def save_user_slug(sender, instance, created, **kwargs):
    """Create slug for user using name"""
    if created or (slugify(instance.name) != instance.slug):
        instance.slug = slugify(instance.name)
        instance.save()

@receiver(post_save, sender=User)
def set_user_default_group(sender, instance, created, **kwargs):
    if created and instance.pk:
        default_group, _ = Group.objects.get_or_create(name="Default")
        instance.groups.add(default_group)
        
@receiver(post_save, sender=RentalListing)
def save_listing_slug(sender, instance, created, **kwargs):
    if created or (slugify(instance.title) != instance.slug):
        instance.slug = slugify(instance.title)
        instance.save()