module.exports = function(io) {
	io.on('connection', function(socket) {
		socket.emit('news', { hello: 'world' });

		socket.on('monaEvent', function(data) {
			console.log('Mona jest najlepsza! A dane z socketa to : \n');
			console.log(data);
			socket.emit('response', { hello: 'Przestan to klikac!' });
		});
	});
};