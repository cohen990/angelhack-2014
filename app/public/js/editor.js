
$(".edit").click(function(){
	$.ajax({
	  type: "GET",
	  url: "/editor/serverEditor/"+$(this).attr("id")
	})
	  .done(function( data ) {
	    	setShadow(data,800,600,"test title","html")

	  });

});

var setShadow = function(content,wwidth,wheight,title,type){

Shadowbox.open({
    content:    content,
    player:     type,
    title:      title,
    height:     wheight,
    width:      wwidth
});

}