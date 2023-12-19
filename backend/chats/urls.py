from django.urls import path

from chats.views.chats import ChatsView
from chats.views.messages import MessagesView, MessageView


urlpatterns = [
    path('', ChatsView.as_view()),
    path('<int:chat_id>/messages', MessagesView.as_view()),
    path('<int:chat_id>/messages/<int:message_id>', MessageView.as_view())
]