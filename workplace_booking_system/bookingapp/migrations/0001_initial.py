# Generated by Django 3.1.7 on 2021-03-14 13:50
from typing import Any, List

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies: List[Any] = []

    operations = [
        migrations.CreateModel(
            name='Booking',
            fields=[
                (
                    'id',
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID',
                    ),
                ),
                ('username', models.CharField(max_length=50, verbose_name='Username')),
                ('place_id', models.CharField(max_length=6, verbose_name='Place')),
                ('date', models.DateField(auto_now=True, verbose_name='Date')),
                ('booking_date', models.DateTimeField(verbose_name='Booking date')),
                (
                    'reservation_time',
                    models.DateTimeField(
                        verbose_name='For how long is the reservation'
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name='OfficeUser',
            fields=[
                (
                    'id',
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID',
                    ),
                ),
                ('username', models.CharField(max_length=50, verbose_name='Username')),
                ('office_id', models.CharField(max_length=6, verbose_name='Office')),
            ],
        ),
    ]
