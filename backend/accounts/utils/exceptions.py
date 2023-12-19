from rest_framework.exceptions import APIException

class UserNotFound(APIException):
    status_code = 404
    default_detail = 'O usuário não pode ser econtrado'