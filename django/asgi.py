"""
ASGI entrypoint. Configures Django and then runs the application
defined in the ASGI_APPLICATION setting.
"""

import os
import django
from channels.routing import get_default_application
from peoplebackend import load_env

load_env.load_env()


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "peoplebackend.settings")
django.setup()
application = get_default_application()
