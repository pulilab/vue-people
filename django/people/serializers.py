from rest_framework import serializers
from .models import Type

class UserTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Type
        fields = "__all__"
