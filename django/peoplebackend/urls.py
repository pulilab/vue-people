"""peoplebackend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.documentation import include_docs_urls

from people.views import UserTypeViewSet, PersonViewSet, PeopleViewSet, TagViewSet, \
    MeetupGroupViewSet, MeetupEventViewSet, PeopleSearchViewSet, UserViewSet

router = DefaultRouter()
router.register(r'api/user-type', UserTypeViewSet)
router.register(r'api/user', UserViewSet)
router.register(r'api/people', PeopleViewSet)
router.register(r'api/person', PersonViewSet)
router.register(r'api/search', PeopleSearchViewSet)
router.register(r'api/tags', TagViewSet)
router.register(r'api/meetup/groups', MeetupGroupViewSet)
router.register(r'api/meetup/events', MeetupEventViewSet)
urlpatterns = router.urls

admin.site.site_header = 'Vue People Backend'
urlpatterns += [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('api/', include("simple-feedback.urls")),
]

if settings.DEBUG:  # pragma: no cover
    urlpatterns.append(path(r'api/docs/', include_docs_urls(title='Vue People API',
                                                            description='Private API',
                                                            authentication_classes=[],
                                                            permission_classes=[]
                                                            )))
