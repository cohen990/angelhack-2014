function dostuff(){
	$(".loginform").submit(function(eparam){
	eparam.preventDefault();

	var uname = $(".username").val();
	var uri = "http://37.187.225.223/angel/index.php/api/getLoginInformation/" + uname;
	console.log(uri);
	$.ajax({
	    dataType: "json",
	    url: uri,
	    success: function(data){
	    	cookieDropAddUID(data);
	    	var url = "black-cards.html";    
			$(location).attr('href',url);
	    	}
	    }

	
	)
})
}

function cookieDropAddUID(UID){
	document.cookie="UID="+UID;
	var x = document.cookie;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}