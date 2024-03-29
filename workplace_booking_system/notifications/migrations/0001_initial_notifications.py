# Generated by Django 3.1.7 on 2021-03-24 13:59

from typing import List

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies: List[str] = []

    operations = [
        migrations.CreateModel(
            name='Notification',
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
                ('title', models.CharField(max_length=50, verbose_name='Title')),
                (
                    'description',
                    models.CharField(max_length=200, verbose_name='Description'),
                ),
                (
                    'username',
                    models.CharField(
                        default='', max_length=50, verbose_name='Username'
                    ),
                ),
                (
                    'occurrence_time',
                    models.DateTimeField(
                        default=django.utils.timezone.now, verbose_name='Occurrence'
                    ),
                ),
                (
                    'is_checked',
                    models.BooleanField(default=False, verbose_name='Checked'),
                ),
            ],
        ),
    ]
