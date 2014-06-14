function init(blackCardId, sessionId, callback) {
  // add new session to db
  // get that/last session from db

  var uri = 'http://37.187.225.223/angel/index.php/api/setGameSession/' +
    getCookie('UID') + '/' + blackCardId + '/' + sessionId + '/' +
    Math.floor((new Date())/1000);

  $.ajax({
    dataType: 'json',
    url: uri,
    success: callback,
    error: function(xhr, status, error) {
      console.log(xhr);
      console.log(status);
      alert(error);
    }
  });
}
