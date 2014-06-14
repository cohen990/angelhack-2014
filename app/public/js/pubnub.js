function PubNubInit(){
    var pubnub = PUBNUB.init({
        //publish_key   : 'pub-c-d03f926e-5fb8-43a3-9a7f-4e2427bb4f35',
        //subscribe_key : 'sub-c-aa73bdce-f3bd-11e3-bffd-02ee2ddab7fe'
publish_key : 'demo',
subscribe_key: 'demo'
    })
    return pubnub
}

function subscribe(pubnub, channelName){
    pubnub.subscribe({
         channel : channelName,
         message : function(m){ alert(m) },
        connect: function(m){ }
    })
    alert("sub");
    return pubnub;
}
 
function publish(pubnub, channelName, message) {
    pubnub.publish({
        channel : channelName,
        message : message
    })
    alert("pub");
    return pubnub;
}

function printstuff(message){
    alert("print");
	console.log(message);
	alert(message);
}
