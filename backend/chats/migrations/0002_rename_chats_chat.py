# Generated by Django 4.2.4 on 2023-12-09 01:52

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chats', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Chats',
            new_name='Chat',
        ),
    ]
