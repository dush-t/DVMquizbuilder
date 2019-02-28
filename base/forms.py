from django import forms
from .models import Member, Post, Comment
import re
from django.core import validators
from django.forms import ModelForm

class ResponseForm(forms.Form):
    queskey = forms.IntegerField()
    anskey = forms.IntegerField()