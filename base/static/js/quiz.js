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
var queskey=0;
function XML_HTTP(){
    var request = new XMLHttpRequest();
    request.open('GET',`/get_question/0`,true);
    request.onload = function(e) {
        alert("dfdf");
        var data = JSON.parse(this.response);
           console.log(request,status);
            console.log(data);
            console.log(e);
        
                request.send();
    }
}
XML_HTTP();
function getQuestion(){   
  
    var data = $.ajax( {
        type: 'GET',
        url: '/get_question/0',
        data: {
        },
        success: function(data) {
            // console.log(data);
            var obj = JSON.parse;
           console.log(data); 
           console.log(data.question);
                     
        }
        
    });
     
}
getQuestion();