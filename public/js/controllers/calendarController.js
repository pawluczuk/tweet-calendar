angular.module('tweetCalendarApp.controllers').controller('CalendarCtrl', function($http, $scope){
    $scope.event = {};
    $scope.invitedEvents = { };

    socket.on('add-users', function()
    {
        var response = 'Dodano Cie do grupy: ' + data.response;
        console.log(response);
        $('#calendar').fullCalendar('refetchEvents');
    });

    socket.on('event-created', function(data) {
        var response = 'Utworzyles nowe wydarzenie : ' + data.response;
        console.log(response);
        $('#calendar').fullCalendar('refetchEvents');
    });

    $scope.saveEvent = function()
    {
        $scope.event.start = $('#eventStart').val();
        $scope.event.end = $('#eventEnd').val();
        $scope.event.ownerId = $('#ownerId').val();

        socket.emit('create-event', $scope.event);

        $('#Modalerino').modal('hide');
        $scope.event = {};
    }
});