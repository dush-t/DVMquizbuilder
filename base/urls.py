from django.urls import path
from . import views
import re
from django.conf.urls import url, include

urlpatterns = [
    path("", views.index, name="index"),
    path("<str:quizkey>/instructions", views.instructions, name="instructions"),
    path("get_question/<str:quiz_id>/<int:question_key>", views.get_question, name="get_question"),
    
]