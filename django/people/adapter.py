import logging
from django.conf import settings
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.adapter import DefaultAccountAdapter

from .models import Person


class MyAccountAdapter(DefaultAccountAdapter):
    def get_login_redirect_url(self, request):
        if not hasattr(request, 'sociallogin'):
            return '/'

        path = settings.LOGIN_REDIRECT_URL
        if settings.DEBUG:
            path = settings.LOGIN_REDIRECT_URL_DEV


        return path.format(request.sociallogin.token.token)

class MyGithubAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        request.sociallogin = sociallogin

    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        try:
            data = {
                "user": user,
                "github_url": sociallogin.account.extra_data['html_url'],
                "avatar_url": sociallogin.account.extra_data['avatar_url'],
                "company": sociallogin.account.extra_data['company'],
                "hireable": sociallogin.account.extra_data['hireable'],
                "bio": sociallogin.account.extra_data['bio'],
                "github_created": sociallogin.account.extra_data['created_at'],
                "github_updated": sociallogin.account.extra_data['updated_at'],
            }
            Person.objects.get_or_create(github_login=sociallogin.account.extra_data['login'], defaults=data)
        except Exception as e:
            logging.error(e)
        return user
