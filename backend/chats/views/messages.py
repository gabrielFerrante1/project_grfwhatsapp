from chats.views.base import BaseView
from chats.models import ChatMessages, Chat, AudioAttachment
from chats.serializers import ChatMessageSerializer

from core.sockets import socket

from rest_framework.request import HttpRequest
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from rest_framework.parsers import MultiPartParser

from datetime import datetime
import re
import os
import time
import random


class MessagesView(BaseView):
    def get(self, request: HttpRequest,  chat_id):
        chat = self.chat_belongs_user(
            chat_id=chat_id, user_id=request.user.id)

        other_user_id = chat.from_user.id if chat.from_user.id != request.user.id else chat.to_user.id

        # Marking all unseen messages as seen
        ChatMessages.objects.filter(
            chat_id=chat_id,
            to_user=request.user.id,
            viewed_at__isnull=True
        ).update(viewed_at=datetime.now())

        socket.emit(f"update_as_view_messages_in_chat_{chat_id}", {
            "from_user_id": other_user_id, "date": datetime.now().isoformat()})

        # Update chats from all participants of chat
        socket.emit('update_chats', room=f"user_{request.user.id}")
        socket.emit('update_chats', room=f"user_{other_user_id}")

        messages = ChatMessages.objects.filter(
            chat_id=chat_id, deleted=False).all()

        serializer = ChatMessageSerializer(messages, many=True)

        messagesDates = []
        messagesData = []

        for message in serializer.data:
            created_at = message['created_at'][:-6]

            if created_at not in messagesDates:
                messageCopy = message.copy()

                messagesData.append(
                    {"date": created_at, "messages": [messageCopy]})
                messagesDates.append(created_at)
            else:
                for data in messagesData:
                    if data['date'] == created_at:
                        data.update(
                            {"messages":  data['messages'] + [message]})

        return Response({"data": messagesData})

    def post(self, request: HttpRequest, chat_id):
        # Validators
        chat = self.chat_belongs_user(
            chat_id=chat_id, user_id=request.user.id)

        other_user_id = chat.from_user.id if chat.from_user.id != request.user.id else chat.to_user.id

        self.user_logged_is_blocked(
            from_id=request.user.id, user_id=other_user_id)

        # Send message
        body = request.data.get('body')
        audio = request.FILES.get('audio_file')

        if not audio and not body:
            raise APIException("Envie os paramêtros da requisição")

        # Remove tags html from body
        if body:
            body = re.sub(re.compile('<.*?>'), '', body)

        # Upload audio and attachment on message
        if audio:
            path = os.path.join(
                "assets", "audios", f"user_{request.user.id}_{int(time.time())}{random.randint(1, 1000000000)}.weba")

            with open(os.path.join(os.getcwd(), path), 'wb') as file:
                file.write(audio.read())

            audio_attachment = AudioAttachment.objects.create(
                src=path.replace("\\", "/")
            )

        message = ChatMessages.objects.create(
            chat_id=chat_id,
            body=body,
            from_user_id=request.user.id,
            to_user_id=other_user_id,
            attachment_code='audio' if audio else None,
            attachment_id=audio_attachment.id if audio else None
        )

        # Update viewed_at on chat
        Chat.objects.filter(id=chat_id).update(
            viewed_at=datetime.now()
        )

        serializer = ChatMessageSerializer(message)

        # Add message into room with chat_id
        socket.emit(f'update_messages_in_chat_{chat_id}', data={
                    "message": serializer.data})

        # Update chats from all participants of chat
        socket.emit('update_chats', room=f"user_{request.user.id}")
        socket.emit('update_chats', room=f"user_{other_user_id}")

        return Response({"message": serializer.data})

    def delete(self, request: HttpRequest, chat_id):
        chat = self.chat_belongs_user(
            chat_id=chat_id, user_id=request.user.id)

        other_user_id = chat.from_user.id if chat.from_user.id != request.user.id else chat.to_user.id

        # Soft Delete all messages
        ChatMessages.objects.filter(
            chat_id=chat_id, from_user=request.user.id
        ).update(deleted=True)

        # Update chats from all participants of chat
        socket.emit('update_chats', room=f"user_{request.user.id}")
        socket.emit('update_chats', room=f"user_{other_user_id}")

        # Event delete all messages
        socket.emit(f"delete_messages_in_chat_{chat_id}", data={
                    "user_id": request.user.id})

        return Response({"success": True})


class MessageView(BaseView):
    def delete(self, request: HttpRequest, chat_id, message_id):
        chat = self.chat_belongs_user(
            chat_id=chat_id, user_id=request.user.id)

        other_user_id = chat.from_user.id if chat.from_user.id != request.user.id else chat.to_user.id

        # Soft Delete
        ChatMessages.objects.filter(
            id=message_id, chat_id=chat_id, from_user=request.user.id).update(deleted=True)

        # Event delete all messages of user_id
        socket.emit(f"delete_messages_in_chat_{chat_id}", data={
                    "message_id": message_id})

        # Update chats from all participants of chat
        socket.emit('update_chats', room=f"user_{request.user.id}")
        socket.emit('update_chats', room=f"user_{other_user_id}")

        return Response({"success": True})
