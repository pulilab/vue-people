from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from people.serializers import PersonDetailSerializer
from people.models import Person

class PersonConsumer(JsonWebsocketConsumer):

    def connect(self):
        self.accept()
        async_to_sync(self.channel_layer.group_add)("people", self.channel_name)
        self.send_json(content={"handshake": "all fine"})

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)("people", self.channel_name)

    def send_person(self, event):
        person = Person.objects.get(id=event['id'])
        p = PersonDetailSerializer(person).data
        self.send_json({
            "person": p
        })
