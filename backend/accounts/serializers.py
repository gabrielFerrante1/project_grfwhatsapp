from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Custom claims
        token['user_name'] = user.name
        token['user_email'] = user.email
        token['user_avatar'] = user.avatar

        return token
