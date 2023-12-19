from rest_framework.views import APIView

from accounts.models import User
from accounts.utils.exceptions import UserNotFound

from contacts.models import Contact
from contacts.utils.exceptions import ContactNotFound


class BaseView(APIView):
    def contact_exists(self, user_id, contact_id) -> Contact:
        contact = Contact.objects.filter(
            id=contact_id, user_id=user_id).first()

        if not contact:
            raise ContactNotFound

        return contact

    def user_exists(self, id) -> User:
        user = User.objects.filter(id=id).first()

        if not user:
            raise UserNotFound

        return user
