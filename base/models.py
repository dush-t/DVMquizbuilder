from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
import re
import os

class Member(models.Model):
    user = models.OneToOneField(User, unique=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    score = models.IntegerField(default=0)


class Question(models.Model):
    questionkey = models.IntegerField(default=0, unique=False)
    content = models.TextField()
    answer = models.CharField(max_length=50)

    attempted_by = models.ManyToManyField(Member, related_name='questions_attempted', blank=True)
    review_by = models.ManyToManyField(Member, related_name='marked_for_review', blank=True)
    answered_right = models.ManyToManyField(Member, related_name='ans_correctly', blank=True)
    answered_wrong = models.ManyToManyField(Member, related_name="ans_wrongly", blank=True)
    not_attempted_by = models.ManyToManyField(Member, related_name='not_attempted', blank=True)

    score_increment = models.IntegerField(default=10)
    score_decrement = models.IntegerField(default=0)  #For negative marking
    is_image = models.BooleanField(default=False)
    is_mcq = models.BooleanField(default=False)

    def __str__(self):
        return self.content 

class Answer(models.Model):
    parent_question = models.ForeignKey(Question, related_name='answers', on_delete=models.CASCADE)
    content = models.TextField()
    is_correct = models.BooleanField(default=False)
    key = models.IntegerField(default=0)

    def __str__(self):
        return self.content

class Response(models.Model):
    member = models.ForeignKey(Member, related_name="full_response", on_delete=models.CASCADE, blank=True)
    question = models.ForeignKey(Question, related_name="ques_response", on_delete=models.CASCADE, null=True)
    answer_mcq = models.ForeignKey(Answer, related_name='ans_response', on_delete=models.CASCADE, null=True)
    answer_text = models.CharField(max_length=250, blank=True)