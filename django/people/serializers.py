from django.contrib.auth.models import User
from rest_framework import serializers
from taggit_serializer.serializers import (TagListSerializerField,
                                           TaggitSerializer)
from .models import Type, Person


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
