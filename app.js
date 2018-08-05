// server.js
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket) {
  socket.on('room', function(room) {
    var roomID = room;
    console.log('connecting to room', room);
    socket.join(room);
    let msg = {
      room: room,
      message: 'joined'
    }
    io.sockets.in(roomID).emit('message', msg);

  });
  
  socket.on('mobile', function (data) {
    console.log('Incoming message from mobile:', data);
    io.sockets.in(data.room).emit('message', data);
  });
  
  socket.on('incoming_files',function (data) {
    console.log('Incoming message from incoming_files:', data);
    io.sockets.in(data.room).emit('incoming_files', data);
  })
  
  socket.on('disconnectAll',function (data) {
    console.log(data);
    io.sockets.in(data.room).emit('message', data);
    socket.disconnect(true);
    
  })
});

var listener = http.listen(process.env.PORT || 3001, function() {
  console.log('listening on localhost'+ listener.address().port);
});

