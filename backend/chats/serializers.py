from rest_framework import serializers
from django.db.models.query import Q

from contacts.models import Contact

from accounts.models import User

from chats.models import Chat, ChatMessages, AudioAttachment


class ChatsSerializer(serializers.ModelSerializer):
    type_chat = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    unseen_count = serializers.SerializerMethodField()
    viewed_at = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ['id', 'from_user_id', 'to_user_id', 'type_chat', 'title', 'avatar',
                  'unseen_count', 'viewed_at', 'last_message']

    def get_type_chat(self, _chat):
        return 'message'

    def get_title(self, chat):
        user_id = self.context.get('user_id')
        other_user_id = chat.from_user.id

        if user_id != chat.to_user.id:
            other_user_id = chat.to_user.id

        contact = Contact.objects.filter(
            user_id=other_user_id, to_id=user_id).first()
        user = User.objects.filter(id=other_user_id).first()

        return contact.name if contact else user.name

    def get_avatar(self, chat):
        user_id = self.context.get('user_id')
        other_user_id = chat.from_user.id

        if user_id != chat.to_user.id:
            other_user_id = chat.to_user.id

        user = User.objects.filter(id=other_user_id).first()

        return user.avatar

    def get_unseen_count(self, chat):
        unseen_count = ChatMessages.objects.filter(
            chat_id=chat.id, to_user=self.context.get('user_id'), viewed_at__isnull=True).count()

        return unseen_count

    def get_viewed_at(self, message):
        if not message.viewed_at:
            return None

        return message.viewed_at.strftime('%d/%m/%Y %H:%M')

    def get_last_message(self, chat):
        last_message = ChatMessages.objects.filter(
            chat_id=chat.id, deleted=False).last()

        if not last_message:
            return None

        serializer = ChatMessageSerializer(last_message)

        return serializer.data


class ChatMessageSerializer(serializers.ModelSerializer): 
    viewed_at = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    attachments = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessages
        fields = ['id', 'body', 'deleted',
                  'from_user', 'to_user', 'attachments', 'viewed_at', 'created_at']

    def get_attachments(self, message):
        audio = None

        if message.attachment_code == 'audio':
            audioData = AudioAttachment.objects.values('src').filter(
                id=message.attachment_id).first()
            audio = {"src": audioData.get('src')}

        return {"audio": audio}

    def get_viewed_at(self, message):
        if not message.viewed_at:
            return None

        return message.viewed_at.strftime('%d/%m/%Y %H:%M')

    def get_created_at(self, message):
        if not message.created_at:
            return None

        return message.created_at.strftime('%d/%m/%Y %H:%M')
