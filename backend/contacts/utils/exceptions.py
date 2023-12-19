from rest_framework.exceptions import APIException

class ContactNotFound(APIException):
    status_code = 404
    default_detail = 'O contato não foi encontrado' 
    default_code = 'contact_not_found'

class UserCannotBlockThemselves(APIException):
    status_code = 401
    default_detail = 'Você não pode se bloquear'
    default_code = 'user_cannot_block_themselves'
