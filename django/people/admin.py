from django.forms import ModelForm
from django.contrib import admin
from prettyjson import PrettyJSONWidget
from .models import Person, Type, MeetupGroup, MeetupEvent



class HasLocationFilter(admin.SimpleListFilter):
    title = 'has location'
    parameter_name = 'has_location'

    def lookups(self, request, model_admin):
        return (
            ('Yes', 'Yes'),
            ('No', 'No'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'Yes':
            return queryset.exclude(location__isnull=True)
        elif self.value() == 'No':
            return queryset.filter(location__isnull=True)
        else:
            return queryset


class JsonForm(ModelForm):
    class Meta:
        model = None
        fields = '__all__'
        widgets = {
            'data': PrettyJSONWidget(attrs={'initial': 'parsed', 'rows': 80, 'cols': 80}),
        }


class MeetupGroupJsonForm(JsonForm):
    class Meta(JsonForm.Meta):
        model = MeetupGroup


class MeetupEventJsonForm(JsonForm):
    class Meta(JsonForm.Meta):
        model = MeetupEvent


@admin.register(MeetupGroup)
class MeetupGroupAdmin(admin.ModelAdmin):
    form = MeetupGroupJsonForm


@admin.register(MeetupEvent)
class MeetupEventAdmin(admin.ModelAdmin):
    form = MeetupEventJsonForm
    ordering = ['date']


admin.site.register(Type)

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('github_login','user_email', 'type', 'created', 'has_location')
    ordering =('github_login', 'type', 'location')
    search_fields = ('github_login', 'user__first_name', 'user__last_name', 'user__email', 'company')
    list_filter = ('type', 'public_email', HasLocationFilter)
    fields = ('bio', 'company', 'github_url', 'twitter_url', 'website_url', 'type', 'public_email')

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'

    def has_location(self, obj):
        return obj.location is not None
    has_location.boolean = True
    has_location.short_description = 'Has location'