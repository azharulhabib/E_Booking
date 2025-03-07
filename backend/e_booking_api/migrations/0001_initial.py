# Generated by Django 5.1.3 on 2025-01-07 08:16

import django.db.models.deletion
import phonenumber_field.modelfields
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('phone_number', phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('slug', models.SlugField(blank=True, max_length=255, null=True, unique=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RentalListing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('address', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('state', models.CharField(max_length=255)),
                ('booking_schedule', models.DateField()),
                ('home_size', models.IntegerField()),
                ('floor', models.CharField(max_length=255)),
                ('approved', models.CharField(choices=[('accepted', 'Accepted'), ('pending', 'Pending'), ('rejected', 'Rejected')], default='pending', max_length=10)),
                ('availability_status', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('slug', models.SlugField(blank=True, max_length=255, null=True, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
            bases=('e_booking_api.user',),
        ),
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
            bases=('e_booking_api.user',),
        ),
        migrations.CreateModel(
            name='Owner',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
            bases=('e_booking_api.user',),
        ),
        migrations.CreateModel(
            name='RentalImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='house_images/')),
                ('listing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='e_booking_api.rentallisting')),
            ],
        ),
        migrations.CreateModel(
            name='UtilityBillImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='utility_bills/')),
                ('listing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='e_booking_api.rentallisting')),
            ],
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('payment_date', models.DateField()),
                ('payment_status', models.BooleanField(default=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='e_booking_api.customer')),
            ],
        ),
        migrations.CreateModel(
            name='CustomerBookingHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('listing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='e_booking_api.rentallisting')),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='e_booking_api.customer')),
            ],
        ),
        migrations.AddField(
            model_name='rentallisting',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='e_booking_api.owner'),
        ),
        migrations.CreateModel(
            name='OwnerBookingHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('listing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='e_booking_api.rentallisting')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='e_booking_api.owner')),
            ],
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('booked_status', models.CharField(choices=[('accepted', 'Accepted'), ('pending', 'Pending'), ('rejected', 'Rejected')], default='pending', max_length=10)),
                ('start_date', models.DateField()),
                ('listing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='e_booking_api.rentallisting')),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='e_booking_api.customer')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='e_booking_api.owner')),
            ],
        ),
    ]
