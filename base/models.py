from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
import re
import os

class Member(models.Model):
    user = models.OneToOneField(User, unique=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    
class Question(models.Model):
    content = models.TextField()
    answer = models.CharField(max_length=50)
    answered_by = models.ManyToManyField(Member, related_name='questions_answered', blank=True)
    score_increment = models.IntegerField(default=10)

    def __str__(self):
        return self.content
    