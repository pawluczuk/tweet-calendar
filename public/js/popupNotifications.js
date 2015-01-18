socket.on('new-tweet', function(data) {
  var response = 'Nowy tweet do wydarzenia: ' + data.eventID;
  createAlert(response);
});

socket.on('tweet-added', function(data) {
  var response = 'Dodales tweet do wydarzenia : ' + data.response;
  createAlert(response);
});

socket.on('group-event-added', function(data) {
  var response = 'Usunales grupe z wydarzenia : ' + data.response;
  createAlert(response);
});

socket.on('event-edited', function(data) {
  var response = 'Edytowales wydarzenie : ' + data.response;
  createAlert(response);
});

socket.on('group-created', function(data) {
  var response = 'Utworzyles nowa grupe : ' + data.response;
  createAlert(response);
});

socket.on('event-created', function(data) {
  var response = 'Utworzyles nowe wydarzenie : ' + data.response;
  createAlert(response);
});

socket.on('emails-added', function(data) {
  var response = 'Dodales maile do wydarzenia: ' + data.response;
  createAlert(response);
});

socket.on('event-deleted', function(data) {
  var response = 'Usunales wydarzenie : ' + data.response;
  createAlert(response);
});

socket.on('id-request', function(data) {
  socket.emit('id-response', { userID : userID } );
});

socket.on('new-event', function(data) {
  var response = 'Nowe wydarzenie w ktorym jestes : ' + data.eventID;
  createAlert(response);
});

socket.on('users-added', function(data) {
  var response = 'Dodales uzytkownikow do wydarzenia : ' + data.response;
  createAlert(response);
});

socket.on('user-added', function(data) {
  var response = 'Zostales dodany do wydarzenia : ' + data.eventID;
  createAlert(response);
});

socket.on('group-added', function(data) {
  var response = 'Grupa dodana do wydarzenia : ' + data.response;
  createAlert(response);
});

socket.on('group-deleted', function(data) {
  var response = 'Grupa usunieta : ' + data.response;
  createAlert(response);
});

socket.on('user-deleted', function(data) {
  var response = 'Zostales usuniety z wydarzenia : ' + data.eventID;
  createAlert(response);
});

socket.on('group-users-added', function(data) {
  var response = 'Dodales uzytkownikow do wydarzenia : ' + data.response;
  createAlert(response);
});

var notificationGenerator = 0;

function createAlert(response) {
  var notificationNo = notificationGenerator;
  notificationGenerator++;
  var alert = '<div class="alert alert-info fade in" role="alert" id='+notificationNo+' >' +
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
      ' <span aria-hidden="true">×</span></button>' +
      '<h4>' + response + '</h4>';

  $("#popup-notifications").append(alert);

  setTimeout(function() {
    $("div[id*="+notificationNo+"]").fadeOut('slow',function(){
      $("div[id*="+notificationNo+"]").remove();
    });
  }, 5000);
}