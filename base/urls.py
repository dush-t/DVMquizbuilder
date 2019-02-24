from django.urls import path
from . import views
import re
from django.conf.urls import url, include

urlpatterns = [
    path("", views.index, name="index"),
    path("<str:quizkey>/instructions", name="instructions"),
    
]