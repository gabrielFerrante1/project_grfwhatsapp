import socketio
from datetime import datetime
from chats.models import ChatMessages

socket = socketio.Server(cors_allowed_origins='*')


# Auth - Sockets
@socket.event
def joinUserRoom(sid, data):
    socket.enter_room(sid, f"user_{data.get('id')}")

# Chat - Sockets
@socket.event
def userViewedMessages(sid, data): 
    ChatMessages.objects.filter(
        from_user=data.get('from_user_id'), viewed_at__isnull=True).update(
        viewed_at=datetime.now()
    )
    
    socket.emit('update_chats', room=f"user_{data.get('from_user_id')}")
    socket.emit(f"update_as_view_messages_in_chat_{data.get('chat_id')}", {
                "from_user_id": data.get('from_user_id'), "date": datetime.now().isoformat()}, room=f"user_{ data.get('from_user_id')}")




# Testes
@socket.event
def send_audio_to_other_user(sid, data):
    print(data.get('stream'))