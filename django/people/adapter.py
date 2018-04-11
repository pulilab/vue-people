from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.adapter import DefaultAccountAdapter

class MyAccountAdapter(DefaultAccountAdapter):
    def get_login_redirect_url(self, request):
        if not request.sociallogin:
            return '/'
        path = "/user?token={}"
        return path.format(request.sociallogin.token.token)

class MyGithubAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        request.sociallogin = sociallogin
