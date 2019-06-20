import time
import requests
import pytz

from datetime import datetime, timedelta
from django.conf import settings
from celery.schedules import crontab
from celery.task import periodic_task
from celery.utils.log import get_task_logger
from requests import HTTPError

from .models import MeetupGroup, MeetupEvent

logger = get_task_logger(__name__)


def sync_groups():
    try:
        r = requests.get('{}?radius=global&topic_id={}&key={}'.format(settings.MEETUP_GROUPS_API_URL,
                                                                      ','.join(settings.MEETUP_TOPIC_IDS),
                                                                      settings.MEETUP_API_KEY))
    except HTTPError:
        pass
    else:
        groups = r.json()

        for group in groups:
            mg, created = MeetupGroup.objects.get_or_create(id=group['id'], defaults=dict(data=group))
            if not created:
                if mg.data != group:
                    mg.data = group
                    mg.save()


def sync_events():
    today = datetime.today()
    next_month_same_day = today + timedelta(days=31)

    for group in MeetupGroup.objects.all():
        if "next_event" in group.data:
            events_url = settings.MEETUP_EVENTS_API_URL.replace('<urlname>', group.data['urlname'])

            try:
                r = requests.get('{}?status=upcoming&no_later_than={}&key={}'.format(
                    events_url, next_month_same_day.isoformat(), settings.MEETUP_API_KEY))
            except HTTPError:
                pass
            else:
                events = r.json()

                for event in events:
                    utc_date = datetime.fromtimestamp(int(event['time']) / 1000, tz=pytz.UTC)
                    me, created = MeetupEvent.objects.get_or_create(id=event['id'],
                                                                    defaults=dict(group=group, date=utc_date, data=event))
                    if not created:
                        if me.data != event:
                            me.data = event
                            me.date = utc_date
                            me.save()
                time.sleep(1)  # anti-throttle


@periodic_task(run_every=crontab(hour=2, minute=15))
def sync_meetup_groups_and_events():
    if not settings.DEBUG and settings.MEETUP_API_KEY and settings.MEETUP_TOPIC_IDS:
        sync_groups()
        sync_events()
