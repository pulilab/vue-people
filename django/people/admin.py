from django.contrib import admin

from .models import Person, Type


admin.site.register(Type)

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('github_login','user_email', 'type')
    ordering =('github_login', 'type')
    search_fields = ('github_login', 'user__first_name', 'user__last_name', 'user__email', 'organisation')
    list_filter = ('type', 'public_email')
    fields = ('is_active', 'bio', 'company', 'github_url', 'twitter_url', 'website_url', 'type', 'public_email')

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'