from django.urls import path

from contacts.views.contacts import ContactDetailsView, ContactBlockedDetailsView

urlpatterns = [
    path('users/<int:user_id>', ContactDetailsView.as_view()),
    path('users/<int:user_id>/blockeds', ContactBlockedDetailsView.as_view())
]
