# Generated by Django 4.2.4 on 2023-12-15 16:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contacts', '0002_remove_contact_blocked_blocked'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blocked',
            name='blocked_user',
            field=models.ForeignKey(db_column='blocked_id', on_delete=django.db.models.deletion.CASCADE, related_name='Blockeds_from_id', to=settings.AUTH_USER_MODEL),
        ),
    ]
