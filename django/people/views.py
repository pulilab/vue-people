from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.viewsets import GenericViewSet

from .serializers import UserTypeSerializer, PersonSerializer
from .models import Person, Type


class UserTypeViewSet(ListModelMixin, GenericViewSet):
    queryset = Type.objects.all()
    serializer_class = UserTypeSerializer
    permission_classes = []
    authentication_classes = []


class PersonViewSet(ListModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer