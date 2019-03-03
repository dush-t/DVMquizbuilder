function startTimer(){
    var data = $.ajax( {
        type: 'POST',
        url: `/get_time_remaining`,
        data: {
        },
        success: function(data) {       
        }
    
    });
}