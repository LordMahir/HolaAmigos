// // server.js
// const express = require('express');
// const app = express();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);

// // Serve client-side files
// app.use(express.static('public'));

// // Socket.io connection event
// io.on('connection', (socket) => {
//   console.log('IOT connected.');

//   // Data event handler
//   socket.on('data', (data) => {
//     console.log('Received data of a sensor :', data);
//   });

//   // Disconnect event handler
//   socket.on('disconnect', () => {
//     console.log('IOT disconnected.');
//   });
// });

// // POST request endpoint
// app.post('/data', (req, res) => {
//   console.log('Transmitting data...');

//   // Emit the event in the socket connection
//   io.emit('dataTransfer');

//   res.send('POST request received.');
// });

// // Start the server
// const port = 3001;
// server.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Store connected clients with their MAC addresses
const connectedClients = {};

// Socket.io connection event
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle client registration with MAC address
  socket.on('register', (mac) => {
    console.log('Client registered:', mac);
    connectedClients[mac] = socket.id;
  });

  // Data event handler
  socket.on('data', (data) => {
    console.log('Received data of a sensor :', data);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    // Remove the client from connectedClients
    const mac = Object.keys(connectedClients).find(
      (key) => connectedClients[key] === socket.id
    );
    if (mac) {
      delete connectedClients[mac];
    }
  });
});

// POST request endpoint
app.post('/data', (req, res) => {
  console.log('Received POST request');

  // Emit event to specific clients based on MAC addresses
  const macAddresses = ['b8:27:eb:af:d0:a2']; // Example MAC addresses
  macAddresses.forEach((mac) => {
    const socketId = connectedClients[mac];
    if (socketId) {
      io.to(socketId).emit('dataTransfer');
    }
  });

  res.send('POST request received.');
});

// Start the server
const port = 3001;
http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
