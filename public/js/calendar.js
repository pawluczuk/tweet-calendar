var socket = io.connect('http://localhost');
socket.on('news', function (data) {
    console.log(data);
});

socket.on('response', function(data) {
	console.log(data);
	var alert = '<div class="alert alert-danger alert-dismissible fade in" role="alert">' + 
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
      ' <span aria-hidden="true">×</span></button>' + 
      '<h4>Oh snap! You got an error!</h4>' +
      '<p>' +
       ' <button type="button" class="btn btn-danger">Take this action</button>' +
        '<button type="button" class="btn btn-default">Or do this</button></p></div>';

	$("#socketReceiver").append(alert);
});

$("#socketBtn").on('click', function() {
	console.log("klik");
	socket.emit('monaEvent', { my: 'data' });
});

$(document).ready(function() {
  var sourcePath = '/resources/users';
  var usersList = '<table>';
  $.getJSON(sourcePath, function(data) {
    $.each(data, function(){
      usersList += '<tr><td>' + this.name + '</td></tr>';
    });
    $("#usersList").html(usersList);
  }); 
});