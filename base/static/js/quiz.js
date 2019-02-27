var questionNo= 0;
function questionDisplay(content){
    var newElement = document.createElement("div");
    newElement.className = "questions";
    var questionsContainer = document.getElementsByClassName("questions-container")[0];
    newElement.innerHTML= content;
    questionsContainer.appendChild(newElement);
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
           console.log(form);
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
