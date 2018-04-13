from rest_framework import serializers
from .models import Type


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
