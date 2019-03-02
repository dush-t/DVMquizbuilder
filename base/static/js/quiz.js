var questionNo= 0;
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


// var queskey=0;
// function XML_HTTP(){
//     var request = new XMLHttpRequest();
//     request.open('GET',`/get_question/0`,true);
//     request.onload = function(e) {
//         alert("dfdf");
//         var data = JSON.parse(this.response);
//            console.log(request,status);
//             console.log(data);
//             console.log(e);
        
//                 request.send();
//     }
// }
// XML_HTTP();

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
           var no_of_options = data.answers.length;
           var form = document.querySelectorAll(".questionsView .form .radio_button")[0];
           for(var i = 0; i< no_of_options;i++){
               var radioButton = document.createElement("input");
               radioButton.setAttribute("type","radio");
               radioButton.setAttribute("name","answer");
               radioButton.setAttribute("key",`${data.keys[i]}`);
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
doNext();
});


var review = document.querySelectorAll(".footer-buttons #review")[0];
review.addEventListener("click",function(){
    console.log("Click");
    sendReview(questionNo);

});


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

var next = document.querySelectorAll(".footer-buttons #next")[0];
next.addEventListener("click", doNext);
function doNext(){
    questionNo++;
    document.getElementsByClassName("radio_button")[0].innerHTML="";
    document.getElementsByClassName("question-text")[0].innerHTML="";
    getQuestion(questionNo);
}

var prev = document.querySelectorAll(".footer-buttons #prev")[0];
prev.addEventListener("click", doPrev);
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

