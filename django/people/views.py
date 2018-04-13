from rest_framework.generics import get_object_or_404
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin, CreateModelMixin
from rest_framework.viewsets import GenericViewSet

from .serializers import UserTypeSerializer, PersonSerializer
from .models import Person, Type


class UserTypeViewSet(ListModelMixin, GenericViewSet):
    queryset = Type.objects.all()
    serializer_class = UserTypeSerializer
    permission_classes = []
    authentication_classes = []


class PeopleViewSet(ListModelMixin, GenericViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = []
    authentication_classes = []

