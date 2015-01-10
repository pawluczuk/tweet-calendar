var socket = io.connect('http://localhost');
var userID = Number($('#mainContent').attr('user-id'));

socket.on('group-created', function(data) {
  var response = 'Group created: ' + data.response;
  createAlert(response);
});

socket.on('event-created', function(data) {
  var response = 'Event created: ' + data.response;
  createAlert(response);
});

socket.on('event-deleted', function(data) {
  var response = 'Event deleted: ' + data.response;
  createAlert(response);
});

socket.on('id-request', function(data) {
  socket.emit('id-response', { userID : userID } );
});

socket.on('new-event', function(data) {
  var response = 'New event for you: ' + data.eventID;
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

$("#event-delete-btn").on('click', function(){
  socket.emit('delete-event', { eventID : 10 });
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