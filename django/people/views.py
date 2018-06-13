from rest_framework.generics import get_object_or_404
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin, CreateModelMixin
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from taggit.models import Tag

from .permission import IsMeOrReadOnly
from .serializers import UserTypeSerializer, PersonSerializer, TagSerialiser
from .models import Person, Type


class UserTypeViewSet(ListModelMixin, GenericViewSet):
    queryset = Type.objects.all()
    serializer_class = UserTypeSerializer
    permission_classes = []
    authentication_classes = []


class PeopleViewSet(ListModelMixin, GenericViewSet):
    queryset = Person.objects.all().select_related('user').prefetch_related('tags')
    serializer_class = PersonSerializer
    permission_classes = []
    authentication_classes = []


class PersonViewSet(ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = [IsMeOrReadOnly]

    def create(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def perform_destroy(self, person):
        person.user.delete()

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        filter_kwargs = {'user': self.request.user.pk}
        obj = get_object_or_404(queryset, **filter_kwargs)

        self.check_object_permissions(self.request, obj)

        return obj


class TagViewSet(ListModelMixin, GenericViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerialiser
    permission_classes = []
    authentication_classes = []
