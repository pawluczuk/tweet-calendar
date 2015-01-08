var socket = io.connect('http://localhost');
socket.on('news', function (data) {
    console.log(data);
});

socket.on('response', function(data) {
	console.log(data);
});

$("#socketBtn").on('click', function() {
	console.log("klik");
	socket.emit('monaEvent', { my: 'data' });
});