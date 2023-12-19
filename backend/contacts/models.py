from django.db import models

from accounts.models import User


class Contact(models.Model):
    name = models.TextField(max_length=100)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='Contacts_user_id')
    to = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='Contacts_to_id')

    class Meta:
        db_table = "contacts"


class Blocked (models.Model):
    blocked_user = models.ForeignKey(
        User, related_name='Blockeds_blocked_user_id', on_delete=models.CASCADE)
    to_user = models.ForeignKey(
        User,  related_name='Blockeds_to_user_id', on_delete=models.CASCADE)

    class Meta:
        db_table = 'blockeds'
