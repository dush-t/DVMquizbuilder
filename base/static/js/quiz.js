var questionNo= 0;
function questionDisplay(content){
    var newElement = document.createElement("div");
    newElement.className = "questions";
    var questionsContainer = document.getElementsByClassName("questions-container")[0];
    newElement.innerHTML= content;
    questionsContainer.appendChild(newElement);
}
function incrementQuestionNo(){
    //code for ruuning closed loop for question number;
}

var numOfQuestions = 20;
for(var i= 1; i<=numOfQuestions ; i++){
    questionDisplay(i);
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
            // console.log(data);
            var obj = JSON.parse;
           console.log(data); 
           console.log(data.question);
           var question_view = document.querySelectorAll(".questionsView .question-text")[0];
           question_view.innerHTML = `${data.question}`;
           var no_of_options = data.answers.length;
           console.log(no_of_options);
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
 console.log(data);
}

function SaveAndNext(){
    var form = document.querySelectorAll(".questionsView .form .radio_button .div ,input");
    var checked_radio;
    for(var i=0; i<form.length ;i++){
        if(form[i].checked){
            console.log(form[i]);
            checked_radio =  form[i];
        }
    }
    var post_key = checked_radio.getAttribute("key");
    return post_key;
}
var saveAndNext = document.querySelectorAll(".footer-buttons #save-next")[0];
saveAndNext.addEventListener("click",function(){
var key = SaveAndNext();
console.log(key);
sendAnswer(questionNo , key);

});


