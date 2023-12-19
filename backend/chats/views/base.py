from rest_framework.views import APIView

from django.db.models import Q

from contacts.models import Blocked

from chats.models import Chat
from chats.utils.exceptions import ChatDoesNotBelongUser, UserIsBlocked


class BaseView(APIView):
    def chat_belongs_user(self, chat_id, user_id):
        chat = Chat.objects.filter(Q(id=chat_id) & (Q(from_user=user_id) | Q(
            to_user=user_id))).first()

        if not chat:
            raise ChatDoesNotBelongUser

        return chat

    def user_logged_is_blocked(self, from_id, user_id):
        blocked = Blocked.objects.filter(
            blocked_user=from_id, to_user=user_id).exists()

        if blocked:
            raise UserIsBlocked
