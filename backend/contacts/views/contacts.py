from contacts.views.base import BaseView
from contacts.serializers import ContactDetailsSerializer
from contacts.utils.exceptions import UserCannotBlockThemselves
from contacts.models import Blocked

from accounts.models import User

from rest_framework.request import HttpRequest
from rest_framework.response import Response

class ContactDetailsView(BaseView):
    def get(self, request: HttpRequest, user_id):
        # Validators
        self.user_exists(user_id)

        user_contact = User.objects.filter(id=user_id).first()

        serializer = ContactDetailsSerializer(
            user_contact, context={"logged_user_id": request.user.id})

        return Response({"contact": serializer.data})


class ContactBlockedDetailsView(BaseView):
    def post(self, request: HttpRequest, user_id):
        # Validators
        self.user_exists(user_id)

        if user_id == request.user.id:
            raise UserCannotBlockThemselves

        Blocked.objects.get_or_create(
            blocked_user_id=user_id, to_user_id=request.user.id)

        return Response({"success": True})

    def delete(self, request: HttpRequest, user_id):
        # Validators
        self.user_exists(user_id)

        Blocked.objects.filter(
            blocked_user=user_id, to_user=request.user.id).delete()

        return Response({"success": True})
