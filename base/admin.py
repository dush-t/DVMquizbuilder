from django.contrib import admin
from .models import Member, Question, Answer, Response
from django.contrib.auth.models import Group
# Register your models here.
admin.autodiscover()
admin.site.register(Member)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Response)