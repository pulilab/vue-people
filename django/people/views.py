from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from .serializers import UserTypeSerializer
from .models import Person, Type


class TestView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"success": True})

    def post(self, request, *args, **kwargs):
        return Response({"success": True})


class PersonViewSet(ListModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    queryset = Person.objects.all()

class UserTypeViewSet(ListModelMixin, GenericViewSet):
    queryset = Type.objects.all()
    serializer_class = UserTypeSerializer
    permission_classes = []
    authentication_classes = []
