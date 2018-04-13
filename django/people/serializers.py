from django.contrib.auth.models import User
from rest_framework import serializers
from taggit_serializer.serializers import (TagListSerializerField,
                                           TaggitSerializer)
from .models import Type, Person


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("last_login", "first_name", "last_name", "email")

class UserTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Type
        fields = "__all__"


class PersonSerializer(TaggitSerializer, serializers.ModelSerializer):
    tags = TagListSerializerField()
    user = UserSerializer()

    class Meta:
        model = Person
        fields = "__all__"
