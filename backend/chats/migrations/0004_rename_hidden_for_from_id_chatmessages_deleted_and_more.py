# Generated by Django 4.2.4 on 2023-12-12 19:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0003_chat_viewed_at'),
    ]

    operations = [
        migrations.RenameField(
            model_name='chatmessages',
            old_name='hidden_for_from_id',
            new_name='deleted',
        ),
        migrations.RemoveField(
            model_name='chatmessages',
            name='hidden_for_to_id',
        ),
    ]
