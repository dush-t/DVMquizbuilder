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
    // var imgURL = '../images/cancel.png';
    // document.getElementsByClassName("ham")[0].style.background = "url('../images/cancel.png')";
}

function closeNav() {
    nav.style.left = "-80%";
    navCount = 0;
    // var imgURL = '../images/menu.png';
    // document.getElementsByClassName("ham")[0].style.background = "url('../images/menu.png')";
}

function getData(){
    var data = $.ajax( {
        type: 'GET',
        url: `/leaderboard`,
        data: {
        },
        
        success: function(data){
        //print data 
        console.log(data);
        }
    });
}
getData();