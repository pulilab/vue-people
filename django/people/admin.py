from django.contrib import admin

from .models import Person, Type

admin.site.register(Person)
admin.site.register(Type)