from django.urls import path
from . import views
import re
from django.conf.urls import url, include

urlpatterns = [
    path("", views.index, name="index"),
    path("instructions", views.instructions, name="instructions"),
    path("get_question/<int:queskey>", views.get_question, name="get_question"),
    path("get_score", views.get_score, name="get_score"),
    path("get_time_remaining", views.get_time_remaining, name="get_time_remaining"),
    path("leaderboard", views.leaderboard, name="leaderboard"),
    path("sign_in", views.sign_in, name="sign_in"),
    path("store_response", views.store_response, name="store_response"),
    path("test", views.test, name="test"),
    path("atr", views.add_to_review, name="add_to_review"),
    path("atna", views.add_to_not_attempted, name="add_to_not_attempted"),
    path("ata", views.add_to_attempted, name="add_to_attempted"),
    path("gqs", views.get_question_status, name="get_question_status")
]