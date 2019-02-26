from django.urls import path
from . import views
import re
from django.conf.urls import url, include

urlpatterns = [
    path("", views.index, name="index"),
    path("instructions", views.instructions, name="instructions"),
    path("get_question/<int:question_key>", views.get_question, name="get_question"),
    path("get_score", views.get_score, name="get_score"),
    path("get_time_remaining", views.get_time_remaining, name="get_time_remaining")
]