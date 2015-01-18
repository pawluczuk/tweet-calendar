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

$(document).ready(function() {
    //    $.ajax({
    //        url: url, // pobranie grup usera
    //        dataType: 'json',
    //        data: data,
    //        success: callback
    //    });
    //
    //                $("event-user").validate({
    //                   debug: true,
    //                   rules: {
    //                       email: {
    //                           required: true,
    //                           email: true
    //                       },
    //                       messages: {
    //                           email: {
    //                               required: "Please enter a email adress",
    //                               email: "Please enter a valid email address"
    //                           }
    //                       }
    //                   }
    //               });
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next, today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        businessHours: {
            start: '8:00',
            end: '20:00'
        },
        firstDay: 1,
        allDaySlot: false,
        selectable: true,
        defaultView: 'agendaWeek',
        selectHelper: true,
        editable: false,
        selectTimezone: 'Europe/Warsaw',
        axisFormat: 'HH:mm',
        timeFormat: 'HH:mm', // uppercase H for 24-hour clock

        select: function(start, end, allDay) {
            console.log(start);

            endtime = moment(end).format('dddd, MMM d, h:mm');
            starttime = moment(start).format('dddd, MMM d, h:mm');

            var mywhen = starttime + ' - ' + endtime;

            endtime = moment(end).format('YYYY-MM-DD HH:mm:ss');
            starttime = moment(start).format('YYYY-MM-DD HH:mm:ss');

            $('#eventStart').val(starttime);
            $('#eventEnd').val(endtime);
            $('#dailyEvent').val(allDay);
            $('#when').text(mywhen);
            $('#Modalerino').modal('show');
        },
        eventClick: function (calEvent, jsEvent, view) {
            console.log(calEvent.id);
            window.location.href = "event/" + calEvent.id;
        },
        events: '/resources/eventsOwner'

        //                   events: "/resources/events?&start=startDate&end=endDate" {
        //                       $.ajax({
        //                               type: 'POST',
        //                               url: "/resources/events?&start=startDate&end=endDate",
        //                               success: function (response) {
        //                                   if (response == 'True') {
        //                                       $('#calendar').fullCalendar('refetchEvents');
        //                                       alert('Database populated! ');
        //                                   }
        //                                   else {
        //                                       alert('Error, could not populate database!');
        //                                   }
        //                               }
        //                           });
        //
        //                   }
    });
        //                   $.ajax({
        //                       type: 'POST',
        //                       url: "/Home/SaveEvent",
        //                       data: dataRow,
        //                       success: function (response) {
        //                           if (response == 'True') {
        //                               $('#calendar').fullCalendar('refetchEvents');
        //                               alert('New event saved!');
        //                           }
        //                           else {
        //                               alert('Error, could not save event!');
        //                           }
        //                       }
        //                   });

});