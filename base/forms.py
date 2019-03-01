from django import forms
import re
from django.core import validators
from django.forms import ModelForm

class ResponseForm(forms.Form):
    queskey = forms.IntegerField()
    anskey = forms.IntegerField()

class AddQuestion(forms.Form):
    question_key = forms.IntegerField()
    question_content = forms.CharField(widget=forms.Textarea)
    option_1 = forms.CharField(widget=forms.Textarea)
    option_2 = forms.CharField(widget=forms.Textarea)
    option_3 = forms.CharField(widget=forms.Textarea)
    option_4 = forms.CharField(widget=forms.Textarea)
    true_option = forms.IntegerField()
