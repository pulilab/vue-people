from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path

from people.consumers import PersonConsumer

application = ProtocolTypeRouter({
    "websocket":
        URLRouter([
            path('ws-people', PersonConsumer)
        ])
})