from rest_framework import serializers

from contacts.models import Contact, Blocked

from accounts.models import User


class ContactsSerializer(serializers.ModelSerializer):
    user_data = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Contact
        fields = (
            'id',
            'name',
            'blocked',
            'user',
            'to',
            'user_data'
        )
        extra_kwargs = {
            'user': {'write_only': True},
            'to': {'write_only': True}
        }

    def get_user_data(self, obj):
        return {
            'id': obj.to.id,
            'name': obj.to.name,
            'avatar': obj.to.avatar,
            'email': obj.to.email
        }

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.blocked = validated_data.get('blocked', instance.blocked)
        instance.save()

        return instance


class ContactDetailsSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    blocked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'avatar',
            'name',
            'email',
            'blocked'
        )

    def get_name(self, obj):
        logged_user_id = self.context.get('logged_user_id')

        contact = Contact.objects.filter(
            user_id=obj.id,
            to_id=logged_user_id
        ).first()

        return contact.name if contact else obj.name

    def get_blocked(self, obj):
        logged_user_id = self.context.get('logged_user_id')

        return Blocked.objects.filter(blocked_user=obj.id, to_user=logged_user_id).exists()
