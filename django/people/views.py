from datetime import date, timedelta

from rest_framework.generics import get_object_or_404
from rest_framework.mixins import ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, \
    DestroyModelMixin
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from taggit.models import Tag

from .permission import IsMeOrReadOnly
from .serializers import UserTypeSerializer, PersonDetailSerializer, TagSerialiser, MeetupGroupSerialiser, \
    MeetupEventSerialiser, PersonListSerializer, PeopleSearchSerializer
from .models import Person, Type, MeetupGroup, MeetupEvent


class UserTypeViewSet(ListModelMixin, GenericViewSet):
    queryset = Type.objects.all()
    serializer_class = UserTypeSerializer
    permission_classes = []
    authentication_classes = []


class PeopleViewSet(ListModelMixin, GenericViewSet):
    queryset = Person.objects.exclude(location=None).select_related('user')
    serializer_class = PersonListSerializer
    permission_classes = []
    authentication_classes = []


class UserViewSet(ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin, GenericViewSet):
    queryset = Person.objects.all().select_related('user').prefetch_related('tags')
    serializer_class = PersonDetailSerializer
    permission_classes = [IsMeOrReadOnly]

    def list(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def perform_destroy(self, person):
        person.user.delete()

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        filter_kwargs = {'user': self.request.user.pk}
        obj = get_object_or_404(queryset, **filter_kwargs)

        self.check_object_permissions(self.request, obj)

        return obj


class PersonViewSet(RetrieveModelMixin, GenericViewSet):
    queryset = Person.objects.all().select_related('user').prefetch_related('tags')
    serializer_class = PersonDetailSerializer
    permission_classes = []
    authentication_classes = []


class PeopleSearchViewSet(ModelViewSet):
    queryset = Person.objects.none()
    serializer_class = PeopleSearchSerializer
    permission_classes = []
    authentication_classes = []

    def get_queryset(self):
        queryset = self.queryset
        tags = self.request.query_params.getlist('tag', None)
        if tags is not None:
            queryset = Person.objects.exclude(location=None).select_related('user').filter(tags__id__in=tags).distinct()
        return queryset


class TagViewSet(ListModelMixin, GenericViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerialiser
    permission_classes = []
    authentication_classes = []


class MeetupGroupViewSet(ListModelMixin, GenericViewSet):
    queryset = MeetupGroup.objects.all()
    serializer_class = MeetupGroupSerialiser
    permission_classes = []
    authentication_classes = []


class MeetupEventViewSet(ListModelMixin, GenericViewSet):
    queryset = MeetupEvent.objects.filter(date__gt=date.today() - timedelta(1))
    serializer_class = MeetupEventSerialiser
    permission_classes = []
    authentication_classes = []
