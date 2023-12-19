from rest_framework.exceptions import APIException


class ChatDoesNotBelongUser(APIException):
    status_code = 401
    default_detail = 'O chat não pertence ao usuário'
    default_code = 'chat_does_not_belong_to_user'

class UserIsBlocked(APIException):
    status_code = 401
    default_detail = 'Você não pode enviar mensagem a esse usuário'
    default_code = 'you_cant_send_message'


class UserIsBlocked(APIException):
    status_code = 401
    default_detail = 'Você não pode enviar mensagem a esse usuário'
    default_code = 'you_cant_send_message'
