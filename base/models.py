from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
import re
import os

class Member(models.Model):
    user = models.OneToOneField(User, unique=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)

class Quiz(models.Model):
    quiz_id = models.CharField(max_length=30)

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='question')
    questionkey = models.IntegerField(default=0, unique=False)
    content = models.TextField()
    answer = models.CharField(max_length=50)
    answered_by = models.ManyToManyField(Member, related_name='questions_answered', blank=True)
    score_increment = models.IntegerField(default=10)
    is_image = models.BooleanField(default=False)
    is_mcq = models.BooleanField(default=False)
    def __str__(self):
        return self.content 

class Answer(models.Model):
    question = models.ForeignKey(Question, related_name='answer')
    content = models.TextField()
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.content
    