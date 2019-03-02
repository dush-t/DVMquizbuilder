var questionNo= 0;

// ------------------- Timer and Instructions --------------------
var maxtime_min = 30;
var timer= document.getElementById("timer");
var minutesLeft = maxtime_min;
var secondsLeft = 0;
timer.innerHTML = `${minutesLeft} : ${secondsLeft}`;

document.querySelector(".start-button").addEventListener("click", function() {
    document.querySelector(".instructions-page").style.animation = "fade-instructions 0.2s ease forwards";
    document.querySelector(".instructions-page").style.zIndex = "0";
    // document.querySelector(".instructions-page").style.display = "none";
});

document.querySelector(".start-button").addEventListener("click", function() {
    setInterval(function(){
        if(secondsLeft == 0){
            minutesLeft -= 1;
            secondsLeft = 60;
        }
        secondsLeft-=1;
        timer.innerHTML = `${minutesLeft} : ${secondsLeft}`;
    },1000);
    console.log("Timer called on click");
    // startquiz();
});
// ---------------------------------------------------

function questionDisplay(content){
    var newElement = document.createElement("div");
    newElement.className = "questions";
    var questionsContainer = document.getElementsByClassName("questions-container")[0];
    newElement.innerHTML= content;
    newElement.setAttribute("onclick", "navQues("+(content-1)+")");
    questionsContainer.appendChild(newElement);
}
function incrementQuestionNo(){
    //code for ruuning closed loop for question number;
}

var numOfQuestions = 20;
for(var i= 1; i<=numOfQuestions ; i++){
    questionDisplay(i);
}

function navQues(quesNo)
{
    questionNo = quesNo;
    document.getElementsByClassName("radio_button")[0].innerHTML="";
    document.getElementsByClassName("question-text")[0].innerHTML="";
    getQuestion(quesNo);
}

function getQuestion(quesNo){   
    var data = $.ajax( {
        type: 'GET',
        url: `/get_question/${quesNo}`,
        data: {
        },
        success: function(data) {
           var obj = JSON.parse;
           var question_view = document.querySelectorAll(".questionsView .question-text")[0];
           question_view.innerHTML = `${data.question}`;
           console.log(data);
           var no_of_options = data.answers.length;
           var form = document.querySelectorAll(".questionsView .form .radio_button")[0];
           for(var i = 0; i< no_of_options;i++){
               var radioButton = document.createElement("input");
               radioButton.setAttribute("type","radio");
               radioButton.setAttribute("name","answer");
               radioButton.setAttribute("key",`${data.keys[i]}`);
               if(data.keys[i] == data.marked_answer){
                   console.log(radioButton);
                   // new Discovery 
                   radioButton.setAttribute("checked", "checked");
               }
               var radioHolder = document.createElement("div");
               radioHolder.append(radioButton);
               radioHolder.innerHTML+=`${data.answers[i]}`;
               form.appendChild(radioHolder);
           }            
        }
    });
     
}
getQuestion(questionNo);

function sendAnswer(quesNo,key){
    var data = $.ajax( {
        type: 'POST',
        url: `/store_response`,
        data: {
            "queskey" : quesNo,
            "anskey" : key
        },
        success: function(data) {             
        }
    
    });
}
var checkedKey;
function SaveAndNext(){
    var form = document.querySelectorAll(".questionsView .form .radio_button .div ,input");
    var checked_radio;
    for(var i=0; i<form.length ;i++){
        if(form[i].checked){
            checked_radio =  form[i];
            checkedKey = i;
        }
    }
    var post_key = checked_radio.getAttribute("key");
    return post_key;
}
var saveAndNext = document.querySelectorAll(".footer-buttons #save-next")[0];

saveAndNext.addEventListener("click",function(){
var key = SaveAndNext();
sendAnswer(questionNo , key);
localStorage.setItem("ans"+questionNo, checkedKey);
attempted(questionNo);
doNext();
});


var review = document.querySelectorAll(".footer-buttons #review")[0];
review.addEventListener("click",function(){
    console.log("Click");
    sendReview(questionNo);
    markForReview(questionNo);
});

function attempted(questionNo){
    var buttons = document.querySelectorAll(".question-wrapper .questions-container div");
    buttons[questionNo].className = "items attempted";
    sendAttempted(questionNo);
}

function unattempted(questionNo){
    var buttons = document.querySelectorAll(".question-wrapper .questions-container div");
    buttons[questionNo].className = "items not-attempted";
    sendUnattempted(questionNo);
}

function markForReview(questionNo){
    var buttons = document.querySelectorAll(".question-wrapper .questions-container div");
    buttons[questionNo].className = "items to-be-reviewed";
    sendReview(questionNo);
}

function sendReview(quesNo){
    var data = $.ajax( {
        type: 'POST',
        url: '/atr',
        data: {
            "queskey" : quesNo
        },
        success: function(data) {             
        }
    });
}
function sendAttempted(quesNo){
    var data = $.ajax( {
        type: 'POST',
        url: '/ata',
        data: {
            "queskey" : quesNo
        },
        success: function(data) {             
        }       
    });
}
function sendUnattempted(quesNo){
    var data = $.ajax( {
        type: 'POST',
        url: '/atna',
        data: {
            "queskey" : quesNo
        },
        success: function(data) {             
        }
    });
}

var next = document.querySelectorAll(".footer-buttons #next")[0];
next.addEventListener("click", nextques);
function nextques(){
    var buttons = document.querySelectorAll(".question-wrapper .questions-container div");
    if(buttons[questionNo].className != "items attempted" && buttons[questionNo].className != "items to-be-reviewed"){
        unattempted(questionNo);
    }
    doNext();
}
function doNext(){
    questionNo++;
    document.getElementsByClassName("radio_button")[0].innerHTML="";
    document.getElementsByClassName("question-text")[0].innerHTML="";
    getQuestion(questionNo);
}

var prev = document.querySelectorAll(".footer-buttons #prev")[0];
prev.addEventListener("click", prevques);

function prevques(){
    var buttons = document.querySelectorAll(".question-wrapper .questions-container div");
    if(buttons[questionNo].className != "items attempted" && buttons[questionNo].className != "items to-be-reviewed"){
        unattempted(questionNo);
    }
    doPrev();
}
function doPrev(){
    questionNo--;
    document.getElementsByClassName("radio_button")[0].innerHTML="";
    document.getElementsByClassName("question-text")[0].innerHTML="";
    getQuestion(questionNo);
}

// ------------------  Ham-menu handler  --------------------
const nav = document.querySelector(".nav-menu");

document.querySelector(".ham").addEventListener("click", () => {
    nav.style.left = "0"; 
    console.log('ham launched');
})
document.querySelector("#close-nav").addEventListener("click", () => {
    nav.style.left = "-100%";
});
// --------------------------------------------------------
// hard refresh 