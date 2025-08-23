const io = require('socket.io-client');

const socket = io('http://localhost:4000/api', {
  auth: {
    token: 'your_jwt_token_here'
  }
});

socket.on('connect', () => {
  console.log('✅ Connected to server');
});

socket.on('connection_success', (data) => {
  console.log('✅ Authentication success:', data);
});

socket.on('pong', (data) => {
  console.log('✅ Ping response:', data);
});

socket.on('error', (error) => {
  console.error('❌ Error:', error);
});

// Test after connection
setTimeout(() => {
  socket.emit('ping', (response) => {
    console.log('Ping callback:', response);
  });
  
  socket.emit('join_room', { room: 'test_room' }, (response) => {
    console.log('Join room callback:', response);
  });
}, 1000);