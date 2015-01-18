var userID = Number($('#mainContent').attr('user-id'));

socket.on('event-edited', function(data) {
  var response = 'Edytowales wydarzenie : ' + data.response;
  createAlert(response);
});

socket.on('send-notifications', function(data) {
  console.log("data received");
  console.log(data.data);
  socket.emit('notifications-received', {});
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

socket.on('users-deleted', function(data) {
  var response = 'Usunales uzytkownikow z wydarzenia : ' + data.response;
  createAlert(response);
  socket.emit('add-users', {eventID : 51, users : [16, 18]});
});

socket.on('users-added', function(data) {
  var response = 'Dodales uzytkownikow do wydarzenia : ' + data.response;
  createAlert(response);
});

socket.on('user-added', function(data) {
  var response = 'Zostales dodany do wydarzenia : ' + data.eventID;
  createAlert(response);
});

socket.on('user-deleted', function(data) {
  var response = 'Zostales usuniety z wydarzenia : ' + data.eventID;
  createAlert(response);
});

$("#group-create-btn").on('click', function() {
  var group = {};
  group.groupName = 'mona-group3';
  group.ownerID = userID;
  group.groupUsers = [9, 16, 18];
	socket.emit('create-group', group);
});

$("#group-create-btn-invalid").on('click', function() {
  var group = {};
  group.groupName = 'mona-group3';
  //sgroup.ownerID = 9;
  group.groupUsers = [9, 16, 18];
  socket.emit('create-group', group);
});

$("#event-create-btn").on('click', function() {
  var userEvent = {};
  userEvent.eventName = 'Mona Event7';
  userEvent.eventType = 'CONS';
  userEvent.start = '2015-01-12 17:00:00';
  userEvent.end = '2015-01-12 19:00:00';
  userEvent.additionalUsers = [16, 18];
  userEvent.comment = 'Hababababa mona event';
  userEvent.recipient = 17;
  userEvent.sender = userID;
  socket.emit('create-event', userEvent);
});

$("#event-create-btn-invalid").on('click', function() {
  var userEvent = {};
  userEvent.eventName = 'Mona Event7';
  userEvent.eventType = 'CONNNS';
  userEvent.start = '2015-01-12 17:00:00';
  userEvent.end = '2015-01-12 19:00:00';
  userEvent.additionalUsers = [16, 18];
  userEvent.comment = 'Hababababa mona event';
  userEvent.recipient = 17;
  userEvent.sender = userID;
  socket.emit('create-event', userEvent);
});

$("#event-edit-btn-valid").on('click', function() {
  var userEvent = {};
  userEvent.eventID = 84;
  userEvent.eventName = 'Mona edit';
  userEvent.eventType = 'BUSY';
  userEvent.comment = 'EDIT mona event';

  socket.emit('edit-event', userEvent);
});


$("#event-delete-btn").on('click', function(){
  socket.emit('delete-event', { eventID : 49 });
});

$("#users-delete-btn").on('click', function(){
  socket.emit('delete-users', { eventID : 51, users : [16, 18] });
});

$("#add-emails-btn").on('click', function(){
  socket.emit('add-emails', { eventID : 114, users : ["blemiec@gmail.com"] });
});

$(document).ready(function() {
  
});

function createAlert(response) {
  var alert = '<div class="alert alert-info fade in" role="alert">' + 
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
      ' <span aria-hidden="true">×</span></button>' + 
      '<h4>' + response + '</h4>';
      $("#group-create-response").append(alert);
}