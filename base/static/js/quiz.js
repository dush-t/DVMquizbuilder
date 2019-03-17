var questionNo= 0;


// ------------------- Timer and Instructions --------------------

function getTime(){
    var data = $.ajax( {
        type: 'GET',
        url: `/get_time_remaining`,
        data: {
        },
        success: function(data){   
           var obj = JSON.parse;
           var time = data.time_remaining;
           var minutes = parseInt(time/60);
           var seconds = parseInt(time%60);
           setTimer(minutes,seconds);
        }
    });    
}

getTime();
var is_mcq;
//-----------------------------------------------------------------
function getQuestionStatus(){
    var data = $.ajax( {
        type: 'GET',
        url: `/gqs`,
        data: {
        },
        
        success: function(data){
            var buttons = document.querySelectorAll(".question-wrapper .questions-container div");
            // console.log(data);
            // console.log(data.attemptedQues);
            for(var i=0; i< data.attemptedQues.length ; i++){
                // console.log("ds");
                // console.log(data.attemptedQues[i]);
                attempted(data.attemptedQues[i]);
            } 
            for(var i=0; i< data.unattemptedQues.length ; i++){
                //console.log("ds");
                //console.log(data.attemptedQues[i]);
                unattempted(data.unattemptedQues[i]);
            }
            for(var i=0; i< data.reviewQues.length ; i++){
                //console.log("ds");
                //console.log(data.attemptedQues[i]);
                markForReview(data.reviewQues[i]);
            }
            for(var i=0; i< data.reviewAttemptedQues.length ; i++){
                //console.log("ds");
                //console.log(data.attemptedQues[i]);
                attempted_review(data.reviewAttemptedQues[i]);
            } 
            // console.log(data);
            attempted_unattempted();

        }
    });    
}
getQuestionStatus();
//--------------------------------------------------------------

function setTimer(maxtime_min, secondsLeft){
    var timer= document.getElementById("timer");
    var minutesLeft = maxtime_min;
    if(secondsLeft<10)
    timer.innerHTML = `${minutesLeft} : 0${secondsLeft}`   
    else
    timer.innerHTML = `${minutesLeft} : ${secondsLeft}`;
    var timer_interval = setInterval(function(){
        if(secondsLeft == 0){
            minutesLeft -= 1;
            secondsLeft = 60;
        }
        secondsLeft-=1;
        if(secondsLeft<10)
        timer.innerHTML = `${minutesLeft} : 0${secondsLeft}`   
        else
        timer.innerHTML = `${minutesLeft} : ${secondsLeft}`;
    
        if (minutesLeft < 0 || minutesLeft > 30) {
            timeout();
        }
    },1000);
    
    function timeout() {
        clearInterval(timer_interval);
        window.open("/submitquiz", "_self");
        console.log("Still running");
     }
}
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
    if(window.innerWidth <= 500)
    {
        closeNav();
    }
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
            if(data.mcq_flag){
                is_mcq = true;
                var obj = JSON.parse;
                var question_view = document.querySelectorAll(".questionsView .question-text")[0];
                if(data.image_url != 0){
                    var quesImg = document.createElement("img");
                    quesImg.setAttribute("src", data.image_url);
                    quesImg.className = "quesImg";
                    question_view.appendChild(quesImg);
                    question_view.innerHTML += "<br><br>";
                }
                question_view.innerHTML += `${data.question}`;
                console.log(data);
                var no_of_options = data.answers.length;
                var form = document.querySelectorAll(".questionsView .form .radio_button")[0];
                for(var i = 0; i< no_of_options;i++){
                    var radioButton = document.createElement("input");
                    radioButton.setAttribute("type","radio");
                    radioButton.setAttribute("name","answer");
                    radioButton.setAttribute("onclick","buttonDisplay()");
                    radioButton.setAttribute("key",`${data.keys[i]}`);
                    if(data.keys[i] == data.marked_answer){
                        // console.log(radioButton);
                        // new Discovery 
                        radioButton.setAttribute("checked", "checked");
                    }
                    var radioHolder = document.createElement("div");
                    radioHolder.append(radioButton);
                    radioHolder.innerHTML+=`${data.answers[i]}`;
                    form.appendChild(radioHolder);
                }
            }
            else{
                is_mcq = false;
                var obj = JSON.parse;
                var form = document.querySelectorAll(".questionsView .form .radio_button")[0];
                var question_view = document.querySelectorAll(".questionsView .question-text")[0];
                question_view.innerHTML = `${data.question}`;
                var radioButton = document.createElement("input");
                radioButton.setAttribute("type","text");
                radioButton.setAttribute("name","answer");
                if(data.entered_answer != "NULL1234")
                radioButton.setAttribute("value", data.entered_answer);
                var radioHolder = document.createElement("div");
                radioHolder.append(radioButton);
                form.appendChild(radioHolder);
                var txtBox = document.querySelectorAll(".questionsView .form .radio_button .div ,input")[0];
                txtBox.addEventListener("input", buttonDisplay);
                // console.log(data);
            }
            document.getElementById("user-question-header").innerHTML = "Question: " + (questionNo+1);
            buttonDisplay();            
        }
    });
     
}

window.addEventListener("keypress", function(e) {
    if(e.key == "Enter")
    e.preventDefault();
});
getQuestion(questionNo);

window.addEventListener("resize", function (){
    if(window.innerWidth <= 670){
        
    }
});
function sendAnswer(quesNo,key){
    if(is_mcq){
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
    else{
        var data = $.ajax( {
            type: 'POST',
            url: `/store_response`,
            data: {
                "queskey" : quesNo,
                "answer" : key
            },
            success: function(data) {             
            }
        });
    }
}
var checkedKey;
function SaveAndNext(){
    var form = document.querySelectorAll(".questionsView .form .radio_button .div ,input");
    var checked_radio;
    if(is_mcq){
        for(var i=0; i<form.length ;i++){
            if(form[i].checked){
                checked_radio =  form[i];
                checkedKey = i;
            }
        }
        var post_key = checked_radio.getAttribute("key");
    }
    else{
        var post_key = form[0].value;
    }
    return post_key;
}

var saveAndNext = document.querySelectorAll(".footer-buttons #save-next")[0];

saveAndNext.addEventListener("click",function(){
var key = SaveAndNext();
sendAnswer(questionNo , key);
attempted(questionNo);
doNext();
});


var saveAndReview = document.querySelectorAll(".footer-buttons #save-review")[0];
saveAndReview.addEventListener("click",function(){
    var key = SaveAndNext();
    sendAnswer(questionNo , key);
    sendAnswer_Review(questionNo , key);
    attempted_review(questionNo);
    doNext();
    });


var review = document.querySelectorAll(".footer-buttons #review")[0];
review.addEventListener("click",function(){
    sendReview(questionNo);
    markForReview(questionNo);
    doNext();
});

function attempted(questionNo){
    var buttons = document.querySelectorAll(".question-wrapper .questions-container div");
    buttons[questionNo].className = "items attempted";
    sendAttempted(questionNo);
}

function attempted_review(questionNo){
    var buttons = document.querySelectorAll(".question-wrapper .questions-container div");
    buttons[questionNo].className = "items attempted-review";
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

function sendAnswer_Review(quesNo, key){
    var data = $.ajax( {
        type: 'POST',
        url: '/atar',
        data: {
            "queskey" : quesNo,
            "anskey" : key
        },
        success: function(data) {  
            console.log("sent");           
        }
    });
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
    attempted_unattempted();
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
const nav = document.querySelector(".question-wrapper");
var navCount = 0;
document.querySelector(".ham").addEventListener("click", () => {
    if(navCount == 0){
        openNav();
    }
    else {
        closeNav();
    }
});

function openNav() {
    nav.style.left = "0";
    navCount = 1;
    var ham = document.querySelector(".ham");

    ham.firstElementChild.style.transform = "rotate(45deg)";
    ham.lastElementChild.style.transform = "rotate(-45deg)";
    ham.firstElementChild.nextElementSibling.style.opacity = "0";
    
}

function closeNav() {
    nav.style.left = "-80%";
    navCount = 0;

    var ham = document.querySelector(".ham");

    ham.firstElementChild.style.transform = "rotate(0deg)";
    ham.lastElementChild.style.transform = "rotate(0deg)";
    ham.firstElementChild.nextElementSibling.style.opacity = "1";
}
// --------------------------------------------------------
// hard refresh 




function buttonDisplay(){
    var prevBtn = document.getElementById("prev");
    var save_nextBtn = document.getElementById("save-next");
    var nextBtn = document.getElementById("next");
    var reviewBtn = document.getElementById("review");
    var save_reviewBtn = document.getElementById("save-review");
    var submitBtn = document.getElementById("submit");
    var clearBtn = document.getElementById("clear");
    var form = document.querySelectorAll(".questionsView .form .radio_button .div ,input");
    var attempted = false;
    if(is_mcq){
        for(var i=0; i<form.length ;i++){
            if(form[i].checked){
                attempted = true;
            }
        }
    }
    else{
        if(form[0].value != "")
        attempted = true;
        else
        attempted = false;
    }
    if(questionNo == numOfQuestions-1){
        nextBtn.style.display = "none";
        save_nextBtn.style.display = "none";
        reviewBtn.style.display = "flex";
        save_reviewBtn.style.display = "none";

        if(attempted){
            nextBtn.style.display = "none";
            reviewBtn.style.display = "none";
            save_nextBtn.style.display = "none";
            save_reviewBtn.style.display = "none";
            clearBtn.style.display = "flex";
        }
        else{
            save_nextBtn.style.display = "none";
            save_reviewBtn.style.display = "none";
            nextBtn.style.display = "none";
            reviewBtn.style.display = "flex";
            clearBtn.style.display = "none";
        }
    }
    else{
        nextBtn.style.display = "flex";
        save_nextBtn.style.display = "flex";
        reviewBtn.style.display = "flex";
        save_reviewBtn.style.display = "flex";

        if(attempted){
            nextBtn.style.display = "none";
            reviewBtn.style.display = "none";
            save_nextBtn.style.display = "flex";
            save_reviewBtn.style.display = "flex";
            clearBtn.style.display = "flex";
        }
        else{
            save_nextBtn.style.display = "none";
            save_reviewBtn.style.display = "none";
            nextBtn.style.display = "flex";
            reviewBtn.style.display = "flex";
            clearBtn.style.display = "none";
        }
    }
    if(questionNo == 0)
        prevBtn.style.display = "none";
    else
        prevBtn.style.display = "flex";
}
var clear = document.querySelectorAll(".footer-buttons #clear")[0];
clear.addEventListener("click", clear_response);
function clear_response(){
    var form = document.querySelectorAll(".questionsView .form .radio_button .div ,input");
    if(is_mcq){
        for(var i=0; i<form.length ;i++){
            form[i].checked = false;
        }
    }
    else{
        form[0].value = "";
    }
    unattempted(questionNo);
    buttonDisplay();
    sendClearResponse(questionNo);
}


function sendClearResponse(quesNo){
    var data = $.ajax( {
        type: 'POST',
        url: '/delete_response',
        data: {
            "queskey" : quesNo
        },
        success: function(data) {             
        }
    });
}

function attempted_unattempted(){
    var noAttempt = document.getElementById("attempted");
    var noUnattempt = document.getElementById("unattempted");
    var data = $.ajax( {
        type: 'GET',
        url: `/gqs`,
        data: {
        },
        
        success: function(data){
            var atmpt = data.attemptedQues.length + data.reviewAttemptedQues.length;
            noAttempt.innerHTML = "ATTEMPTED: " + atmpt;
            noUnattempt.innerHTML = "UNATTEMPTED: " + (numOfQuestions - atmpt);
        }
    });
}
attempted_unattempted();


function submitQuiz(){
    var submitConfirmation = confirm("Do you really want to submit!");
    if(submitConfirmation == true)
    window.open("/submitquiz", "_self");
}