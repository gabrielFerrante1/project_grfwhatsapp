# Generated by Django 4.2.4 on 2023-12-18 10:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0006_alter_chatmessages_from_user_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='AudioAttachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('src', models.TextField()),
            ],
            options={
                'db_table': 'audio_attachments',
            },
        ),
    ]
