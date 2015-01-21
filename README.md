# tweet-calendar
Interactive calendar with tweets and realtime notifications


User can register and create its own calendar with four types of meetings. For each meeting, other users or groups can be invited. 
Each change triggers socket.io events that result in real-time notifications, 
e.g. that you have been invited to event or that event you have been invited to has been deleted.

Authentication via passport.js, also used by socket.io (bridge created with passport.socketio module).

Screensot:
![alt tag](https://raw.githubusercontent.com/pawluczuk/tweet-calendar/master/screen.png)
