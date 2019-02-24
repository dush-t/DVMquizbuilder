from .models import Member, Question, Answer, Response

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
import re

#It is better to pass questions as template context

def instructions(request):
    return render(request, 'base/instructions.html')


def index(request):
    return render(request, 'base/index.html')

def add_to_review(request, queskey):
    current_member = Member.objects.get(user = request.user)
    question = Question.objects.get(questionkey=queskey)
    current_member.marked_for_review.add(question)
    return HttpResponse("Question marked for review") #This needs to be changed later



def store_answer(request):
    current_member = Member.objects.get(user=current_user)
    if request.method == 'POST':
        queskey = request.POST.get("queskey")
        question = Question.objects.get(questionkey=queskey)
        try:
            anskey = request.POST.get("anskey")
            answers = question.answers.all()
            answer = answers.get(key=anskey)
            try:
                a = Response.objects.filter(member=current_member, question=question)[0]
                a.answer_mcq = answer
                a.save()
            except:
                a = Response(member=current_member, question=question, answer_mcq=answer)
                a.save()            
        except:
            answer = request.POST.get("answer")
            try:
                a = Response.objects.filter(member=current_member, question=question)[0]
                a.answer_text = answer
                a.save()
            except:
                a = Response(member=current_member, question=question, answer_text=answer)
                a.save() 

def result(request):
    current_member = Member.objects.get(user=request.user)
    full_response = current_member.full_response.all()
    for response in full_response:
        question = response.question
        try:
            if reponse.answer_mcq.is_correct:
                current_member.score = current_member.score + question.score_increment
            else:
                current_member.score = current_member.score - question.score_decrement
        except:
            if response.answer_text == question.answer:
                current_member.score = current_member.score + question.score_increment
            else:
                current_member.score = current_member.score - question.score_decrement

    return render(request, 'base/result.html')


def get_question(request, queskey):
    current_question = Question.objects.get(questionkey=queskey)

    if current_question.is_mcq == True:
        answerlist = []
        for answer in current_question.answers.all():
            answerlist.append(answer.content)
        data = {
            "question":current_question.content,
            "answers":answerlist,
            "mcq_flag":True
        }
        return JsonResponse(data)
    else:
        data = {
            "question":current_question.content,
            "mcq_flag":False
        }
        return JsonResponse(data)
        


#def check_answer(request):
#     member = Member.objects.get(user=request.user)
#     correct_flag = 0
#     if request.method = 'POST':
#         queskey = request.POST.get("queskey")
#         question = Question.objects.get(questionkey=queskey)

#         try:
#             anskey = request.POST.get("anskey")
#             answers = question.answers.all()
#             answer = answers.get(key=anskey)
#             if answer.is_correct:
#                 correct_flag = 1
#             else:
#                 correct_flag = 2
#         except:
#             answer = request.POST.get("answer")
#             if answer == question.answer:
#                 correct_flag = 1
#             else:
#                 correct_flag = 2

        
#         if correct_flag == 1:
#             if question in member.ans_correctly.all():
#                 pass
#             elif question in member.ans_wrongly.all():
#                 member.score = member.score + question.score_increment + question.score_decrement
#                 member.save()
#             else:
#                 member.score = member.score + question.score_increment
#                 member.save()
#         elif correct_flag == 2:
#             if question in member.ans_correctly.all():
#                 member.score = member.score - question.score_increment - question.score_decrement
#                 member.save
#             elif question in member.ans_wrongly.all():
#                 pass
#             else:
#                 member.score = member.score - question.score_decrement
#         else:
#             pass
        
#         return HttpResponse(status=204)
#     else:                                                   #What do I do with this??
#         return HttpResponse("You weren't supposed to be here you know")
