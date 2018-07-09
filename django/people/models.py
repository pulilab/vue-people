from django.contrib.auth.models import User
from django.contrib.gis.db import models
from taggit.managers import TaggableManager
from django.contrib.postgres.fields import JSONField
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.dispatch import receiver
from django.db.models.signals import post_save


class Type(models.Model):
    name = models.CharField(max_length=16)
    verbose_name = models.CharField(max_length=32)
    order = models.IntegerField(default=0)
    disabled = models.BooleanField(default=False)

    class Meta:
        verbose_name = "User Type"

    def __str__(self):
        return self.verbose_name


class Person(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    company = models.CharField(max_length=128, blank=True, null=True)
    hireable = models.NullBooleanField()
    github_login = models.CharField(max_length=32)
    github_created = models.DateTimeField(blank=True, null=True)
    github_updated = models.DateTimeField(blank=True, null=True)
    github_url = models.URLField()
    twitter_url = models.URLField(blank=True, null=True)
    website_url = models.URLField(blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    location = models.PointField(blank=True, null=True)
    type = models.ForeignKey(Type, blank=True, null=True, on_delete=models.PROTECT)
    tags = TaggableManager(blank=True)
    created = models.DateTimeField(auto_now=False, auto_now_add=True)
    modified = models.DateTimeField(auto_now=True, auto_now_add=False)
    public_email = models.BooleanField(default=True)
    feature_updates = models.BooleanField(default=True)
    upcoming_events = models.BooleanField(default=True)
    job_opportunities = models.BooleanField(default=True)
    settings = JSONField(default=dict())

    class Meta:
        verbose_name_plural = "People"

    def send_position(self):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "people",
            {
                "type": "send.person",
                "id": self.id
            }
    )

    def __str__(self):
        if self.user:
            return "{} ({}) {}".format(self.user.get_full_name(), self.company, self.user.email)
        else:
            return "This person is missing an associate user: {}".format(self.pk)


class MeetupGroup(models.Model):
    id = models.IntegerField(primary_key=True, editable=False)
    data = JSONField(default=dict())

    def __str__(self):
        return "{}: {} in {}".format(
            self.data.get('urlname', ''), self.data.get('name', ''), self.data.get('country', ''))


class MeetupEvent(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=512)
    group = models.ForeignKey(MeetupGroup, on_delete=models.CASCADE)
    date = models.DateTimeField(verbose_name="UTC Date")
    data = JSONField(default=dict())

    def __str__(self):
        return "[{}] {}".format(self.group.data.get('name', ''), self.data.get('name', ''))


@receiver(post_save, sender=Person)
def update_websocket(sender, instance, created, **kwargs):
    instance.send_position()