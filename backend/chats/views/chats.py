from rest_framework.request import HttpRequest
from rest_framework.response import Response
from rest_framework.exceptions import APIException

from django.db.models import Q

from chats.serializers import ChatsSerializer
from chats.views.base import BaseView
from chats.models import Chat 

from accounts.models import User

from core.sockets import socket


class ChatsView (BaseView):
    def get(self, request: HttpRequest):
        user_id = request.user.id

        chats = Chat.objects.filter(Q(from_user=user_id) | Q(
            to_user=user_id)).order_by('-viewed_at')

        serializer = ChatsSerializer(
            chats, many=True, context={'user_id': user_id})

        return Response({"chats": serializer.data})

    def post(self, request: HttpRequest):
        user_id = request.user.id

        # Params
        email_other_user = request.data.get('email')

        user_other = User.objects.values('id').filter(
            email=email_other_user).first()

        if not user_other:
            raise APIException("O usuário não existe")

        if Chat.objects.filter(
            (Q(from_user=user_id) & Q(to_user=user_other.get('id'))) |
            (Q(from_user=user_other.get('id')) & Q(to_user=user_id))
        ).exists():
            raise APIException("A conversa com esse usuário já existe")

        Chat.objects.create(
            from_user_id=user_id,
            to_user_id=user_other.get('id')
        )

        # Update chats from all participants of chat
        socket.emit('update_chats', room=f"user_{user_id}")
        socket.emit('update_chats', room=f"user_{user_other.get('id')}")

        return Response({"success": True})
