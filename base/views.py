from .models import Member, Question, Answer, Response

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
import re
import datetime

#It is better to pass questions as template context

def instructions(request):
    return render(request, 'base/instructions.html')


def index(request):
    return render(request, 'base/index.html')

def sign_in(request):
    if request.user.is_anonymous:
        return render(request, 'base/sign_in.html')
    else:
        return redirect('/')
        
@login_required(login_url='/sign_in')
def add_to_review(request, queskey):
    current_member = Member.objects.get(user = request.user)
    question = Question.objects.get(questionkey=queskey)
    current_member.marked_for_review.add(question)
    return HttpResponse("Question marked for review") #This needs to be changed later


@login_required(login_url='/sign_in')
def store_answer(request):
    current_member = Member.objects.get(user=request.user)
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

def leaderboard(request):
    leaderboard = Member.objects.order_by('-score')
    ranklist=[]
    for member in leaderboard:
        ranklist.append(member.name)
    data = {
        "ranklist":ranklist
    }
    return JsonResponse(data)

@login_required(login_url='/sign_in')
def result(request):
    current_member = Member.objects.get(user=request.user)
    full_response = current_member.full_response.all()
    if current_member.submitted:
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
    else:
        return render(request, 'base/result.html')

@login_required(login_url='/sign_in')
def get_score(request):
    current_member = Member.objects.get(user=request.user)
    if current_member.submitted:
        data = {"score":current_member.score}
        return JsonResponse(data)
    else:
        return HttpResponse("The user needs to submit first")

#@login_required(login_url='/sign_in')
def get_question(request, queskey):
    current_question = Question.objects.get(questionkey=queskey)

    if current_question.is_mcq == True:
        answerlist = []
        keylist = []
        for answer in current_question.answers.all():
            answerlist.append(answer.content)
            keylist.append(answer.key)
        data = {
            "question":current_question.content,
            "answers":answerlist,
            "keys":keylist,
            "mcq_flag":True,
            "image_flag":current_question.is_image
        }
        return JsonResponse(data)
    else:
        data = {
            "question":current_question.content,
            "mcq_flag":False
        }
        return JsonResponse(data)
        
def get_time_remaining(request):

    current_member = request.user
    start_time = current_member.start_time
    quiz_time = datetime.timedelta(hours = 1, minutes = 0)
    end_time = start_time + quiz_time
    time_remaining = end_time - datetime.datetime.now() # A datetime.timdelta object

    data = {
        "time_remaining":time_remaining,
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
