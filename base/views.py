from .models import Member, Question, Answer, Response
from .forms import AddQuestion

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
import re
import datetime

#It is better to pass questions as template context

def test(request):
    return render(request, 'base/reponse.html')

def instructions(request):
    return render(request, 'base/instructions.html')


def index(request):
    return render(request, 'base/index.html')

def sign_in(request):
    if request.user.is_anonymous:
        return render(request, 'base/sign_in.html')
    else:
        return redirect('/')

# def create_member(request, user):
#     name = user.first_name + " " + user.last_name
#     if Member.objects.filter(user=user).exists():
#         return redirect('/') #Redirect to wherever you want the user to go to after logging in.
#     else:
#         new_member = Member(user = user, name=name)
#         return redirect('/') #Redirect to wherever you want the user to go to after logging in.
        

@csrf_exempt
def add_to_review(request):
    current_member = Member.objects.get(user = request.user)
    if request.method == "POST":
        queskey = request.POST.get("queskey")    
        question = Question.objects.get(questionkey=queskey)
        current_member.marked_for_review.add(question)
        return HttpResponse("Question marked for review") #This needs to be changed later
    else:
        q = current_member.marked_for_review.all()
        atrlist = []
        for question in q:
            atrlist.append(question.questionkey)
        data = {
            "atrlist" : atrlist
        }
        return JsonResponse(data)

@csrf_exempt
def add_to_not_attempted(request):
    current_member = Member.objects.get(user = request.user)
    if request.method == "POST":
        queskey = request.POST.get("queskey")     
        question = Question.objects.get(questionkey=queskey)
        current_member.not_attempted.add(question)
        return HttpResponse("Question added to not attempted") #This needs to be changed later
    else:
        q = current_member.not_attempted.all()
        atnalist = []
        for question in q:
            atnalist.append(question.questionkey)
        data = {
            "atnalist" : atnalist
        }
        return JsonResponse(data)

@csrf_exempt
def add_to_attempted(request):
    current_member = Member.objects.get(user = request.user)
    if request.method == "POST":
        queskey = request.POST.get("queskey")    
        question = Question.objects.get(questionkey=queskey)
        current_member.questions_attempted.add(question)
        return HttpResponse("Question added to attempted") #This needs to be changed later
    else:
        q = current_member.questions_attempted.all()
        atalist = []
        for question in q:
            atalist.append(question.questionkey)
        data = {
            "atalist" : atalist
        }
        return JsonResponse(data)


@csrf_exempt
def get_question_status(request):
    current_member = Member.objects.get(user = request.user)
    atrlist = []
    atnalist = []
    atalist = []
    arlist = []

    for question in current_member.marked_for_review.all(): #Add to review
        atrlist.append(question.questionkey)
    for question in current_member.not_attempted.all():  #Add to not_attempted
        atnalist.append(question.questionkey)
    for question in current_member.questions_attempted.all():  #Add to attempted
        atalist.append(question.questionkey)

    review_questions = current_member.marked_for_review.all()
    attempted_questions = current_member.questions_attempted.all()
    ar_questions = review_questions.intersection(attempted_questions)
    for question in ar_questions:
        arlist.append(question.questionkey)
    
    data = {
        "reviewQues" : atrlist,
        "attemptedQues" : atalist,
        "unattemptedQues" : atnalist,
        "reviewAttemptedQues" : arlist
    }
    return JsonResponse(data)


@csrf_exempt
#@login_required(login_url='/sign_in')
def store_response(request):
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
        return HttpResponse("Answer stored")

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

@staff_member_required
def add_question(request):
    if request.method == "POST":
        form = AddQuestion(request.POST)
        if form.is_valid():
            ques_content = form.cleaned_data.get("question_content")
            key = form.cleaned_data.get("question_key")
            question = Question(questionkey=key, content=ques_content, is_mcq=True)
            question.save()
            question = Question.objects.get(questionkey=key)

            for i in range(4):
                content = form.cleaned_data.get("option_" + str(i+1))
                answer = Answer(parent_question=question, content=content, key=i+1)
                answer.save()
            
            true_key = form.cleaned_data.get("true_option")
            answer = question.answers.get(key=true_key)
            answer.is_correct = True
            answer.save()
            return redirect("/add_question")
        else:
            return HttpResponse("Please check the data you have entered")
    else:
        form = AddQuestion()
        return render(request, 'base/add_question.html', {"form":form})

            
    ##LET THIS BE A REMINDER TO THOSE WHO FORGET THAT LOOPS EXIST - 
    ##

            # op1_content = form.cleaned_data.get("option_1")
            # answer = Answer(parent_question=question, content=op1_content, key=1)
            # answer.save()

            # op2_content = form.cleaned_data.get("option_2")
            # answer = Answer(parent_question=question, content=op2_content, key=2)
            # answer.save()

            # op3_content = form.cleaned_data.get("option_3")
            # answer = Answer(parent_question=question, content=op1_content, key=3)
            # answer.save()

            # op1_content = form.cleaned_data.get("option_1")
            # answer = Answer(parent_question=question, content=op1_content, key=1)
            # answer.save()































