from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from . import load_env

load_env.load_env()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'peoplebackend.settings')

app = Celery('peoplebackend')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()
