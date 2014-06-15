function PubNubInit(uid){
    var pubnub = PUBNUB.init({
        publish_key   : 'pub-c-d03f926e-5fb8-43a3-9a7f-4e2427bb4f35',
        subscribe_key : 'sub-c-aa73bdce-f3bd-11e3-bffd-02ee2ddab7fe'
    })
    pubnub.subscribe({
         channel : "globalNewGame",
         message : function(m){ newGameHandler(m) }
    })
}


function newGameHandler(message){
    var res = message.split(",");
    $(document).trigger("newGame", [{sid:res[0],uid:res[1]}]);
}

function publishNewGame(pubnub, sid, uid){
    pubnub.publish({
        channel : "globalNewGame",
        message : sid + ","+uid
    })
}