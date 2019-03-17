getOverview();
document.querySelector(".overview").addEventListener("click", () => {
    document.querySelector(".display-overview").style.display = "block";
    document.querySelector(".display-leaderboard").style.display = "none";
})

var counter = 0;
document.querySelector(".leaderboard").addEventListener("click", () => {
    document.querySelector(".display-overview").style.display = "none";
    document.querySelector(".display-leaderboard").style.display = "table";
    if(counter == 0) {
        getLeaderboard();
        counter++;
    }
})



function getOverview(){
    var data = $.ajax( {
        type: 'GET',
        url: `/get_result`,
        data: {
        },
        
        success: function(data){
            document.querySelector("#user-name").innerHTML = "Name: " + data.name;
            document.querySelector("#score").innerHTML = "Score: " + data.score;
            document.querySelector("#line-1").innerHTML = "Attempted: " + (data.correct + data.incorrect);
            document.querySelector("#line-2").innerHTML = "Unattempted: " + data.unattempted;
            document.querySelector("#line-3").innerHTML = "Correct: " + data.correct;
            document.querySelector("#line-4").innerHTML = "Incorrect: " + data.incorrect;
            document.querySelector("#rank").innerHTML = data.rank;
        }
    });
}


function getLeaderboard(){
    var data = $.ajax( {
        type: 'GET',
        url: `/get_leaderboard`,
        data: {
        },
        
        success: function(data){
            var table = document.querySelector(".display-leaderboard");
            var lastScore;
            var repeatCount = 0;
            for(var i = 0; i < data.ranklist.length; i++)
            {
                if(lastScore == data.scorelist[i]){
                    repeatCount++;
                    var tr = document.createElement("tr");
                    var td = document.createElement("td");
                    var rank = document.createTextNode(i+1-repeatCount);
                    td.appendChild(rank);
                    tr.appendChild(td);
                    var td = document.createElement("td");
                    var name = document.createTextNode(data.ranklist[i]);
                    td.appendChild(name);
                    tr.appendChild(td);
                    var td = document.createElement("td");
                    var score = document.createTextNode(data.scorelist[i]);
                    td.appendChild(score);
                    tr.appendChild(td);
                    table.appendChild(tr);
                }
                else {
                    repeatCount = 0;
                    var tr = document.createElement("tr");
                    var td = document.createElement("td");
                    var rank = document.createTextNode(i+1);
                    td.appendChild(rank);
                    tr.appendChild(td);
                    var td = document.createElement("td");
                    var name = document.createTextNode(data.ranklist[i]);
                    td.appendChild(name);
                    tr.appendChild(td);
                    var td = document.createElement("td");
                    var score = document.createTextNode(data.scorelist[i]);
                    td.appendChild(score);
                    tr.appendChild(td);
                    table.appendChild(tr);
                }
                lastScore = data.scorelist[i];
            }
        }
    });
}