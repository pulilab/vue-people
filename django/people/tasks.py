import time
import requests
import pytz

from dateutil import relativedelta
from datetime import datetime
from django.conf import settings
from celery.schedules import crontab
from celery.task import periodic_task
from celery.utils.log import get_task_logger

from .models import MeetupGroup, MeetupEvent

logger = get_task_logger(__name__)

def calculate_utc_local_date(time, utc_offset):
    return datetime.fromtimestamp(((int(time)+int(utc_offset))/1000), tz=pytz.utc)

@periodic_task(run_every=crontab(hour=2, minute=15))
def sync_meetup_groups_and_events():
    if not settings.DEBUG and settings.MEETUP_API_KEY and settings.MEETUP_TOPIC_IDS:
        r = requests.get('{}?radius=global&topic_id={}&key={}'.format(settings.MEETUP_GROUPS_API_URL,
                                                                      ','.join(settings.MEETUP_TOPIC_IDS),
                                                                      settings.MEETUP_API_KEY))
        r.raise_for_status()
        groups = r.json()

        # Sync groups
        for group in groups:
            mg, created = MeetupGroup.objects.get_or_create(id=group['id'], defaults=dict(data=group))
            if not created:
                if mg.data != group:
                    mg.data = group
                    mg.save()

        today = datetime.today()
        next_month_same_day = today + relativedelta.relativedelta(months=1)

        # Sync events
        for group in MeetupGroup.objects.all():
            events_url = settings.MEETUP_EVENTS_API_URL.replace('<urlname>', group.data['urlname'])
            r = requests.get('{}?status=upcoming&no_earlier_than={}&no_later_than={}&key={}'.format(
                events_url, today.isoformat(), next_month_same_day.isoformat(), settings.MEETUP_API_KEY))
            r.raise_for_status()
            events = r.json()
            for event in events:
                local_date = calculate_utc_local_date(event['time'], event['utc_offset'])
                me, created = MeetupEvent.objects.get_or_create(id=event['id'],
                                                                defaults=dict(group=group, date=local_date, data=event))
                if not created:
                    if me.data != event:
                        me.data = event
                        me.date = local_date
                        me.save()
            time.sleep(1)
