# Generated by Django 4.2.4 on 2023-12-12 15:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contacts', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contact',
            name='blocked',
        ),
        migrations.CreateModel(
            name='Blocked',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('blocked_user', models.ForeignKey(db_column='blocked_user_id', on_delete=django.db.models.deletion.CASCADE, related_name='Blockeds_from_id', to=settings.AUTH_USER_MODEL)),
                ('to_user', models.ForeignKey(db_column='to_id', on_delete=django.db.models.deletion.CASCADE, related_name='Blockeds_to_id', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'blockeds',
            },
        ),
    ]