from django.db import models

from accounts.models import User

class Chat (models.Model):
    from_user = models.ForeignKey(
        User, related_name='Chats_from_user_id', on_delete=models.CASCADE)
    to_user = models.ForeignKey(
        User, related_name='Chats_to_user_id', on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chats'


class ChatMessages (models.Model):
    body = models.TextField(null=True)
    deleted = models.BooleanField(default=False)
    attachment_code = models.CharField(max_length=45, null=True)
    attachment_id = models.IntegerField(null=True)
    viewed_at = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    from_user = models.ForeignKey(
        User,  related_name='ChatMessages_from_user_id', on_delete=models.CASCADE)
    to_user = models.ForeignKey(
        User,   related_name='ChatMessages_to_user_id', on_delete=models.CASCADE)
    chat = models.ForeignKey(
        Chat, related_name='ChatMessages_chat_id', on_delete=models.CASCADE)

    class Meta:
        db_table = 'chat_messages'

# Attachments
class AudioAttachment (models.Model):
    src = models.TextField()

    class Meta:
        db_table = 'audio_attachments'
    