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
	    	var url = "dash.html";    
			$(location).attr('href',url);
	    	}
	    }

	
	)
})
}

function cookieDropAddUID(UID){
	document.cookie="UID="+UID;
	var x = document.cookie;
	alert(x)
}