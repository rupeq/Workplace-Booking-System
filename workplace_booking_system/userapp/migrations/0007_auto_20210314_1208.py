# Generated by Django 3.1.7 on 2021-03-14 09:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userapp', '0006_auto_20210314_1148'),
    ]

    operations = [
        migrations.AlterField(
            model_name='baseusermodel',
            name='birthdate',
            field=models.DateField(null=True, verbose_name='Date of birth'),
        ),
    ]
