# Generated by Django 4.2.4 on 2023-12-11 20:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0002_rename_chats_chat'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='viewed_at',
            field=models.DateTimeField(null=True),
        ),
    ]