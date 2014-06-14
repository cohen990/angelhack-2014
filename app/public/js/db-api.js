function Get3BlackCards(callback) {
	var uri = "http://37.187.225.223/angel/index.php/api/getRandomBlackCard/3";
	var _data = [];
	var _returnData;

	$.ajax({
	    dataType: "json",
	    url: uri,
	    success: callback
	});

/*
	var card1= {
		text:"London is like the world capital of {0}.",
		id:"1"
	};
	var card2 = {
		text:"There's nothing quite like {0}.",
		id:"2"
	};
	var card3 = {
		text:"Lorem ipsum {0} blah blah blah.",
		id:"3"
	};

	result = [card1,card2,card3];

	return result;*/
	return(_returnData);
}

// Takes a blackList - a list of whiteCard IDs and if any of the white cards it
// grabs from the databse is in the blackList then it discards them and gets a
// new one.
function GetWhiteHand(blackList){
	// call api to get a white hand
	var card1= {
		text:"A pit of unfiltered hatred.",
		id:"1"
	};
	var card2 = {
		text:"You're mum's ironing board.",
		id:"2"
	};
	var card3 = {
		text:"Hitler in a bunny suit.",
		id:"3"
	};
	var card4 = {
		text:"An erection chasing you down the hall.",
		id:"4"
	};
	var card5 = {
		text:"Coffee.",
		id:"5"
	};

	result = [card1,card2,card3,card4,card5];
	return result;
}
window.onload=function(){
	Get3BlackCards();
}
