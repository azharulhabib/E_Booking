# Generated by Django 5.1.3 on 2024-12-19 22:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('e_booking_api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='slug',
            field=models.SlugField(blank=True, max_length=255, null=True, unique=True),
        ),
    ]
