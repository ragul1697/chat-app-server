const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
const Message = require('./models/Message');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

dotenv.config();
mongoose.connect(process.env.MONGO_DB_URI);

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

io.on('connection', socket => {
  console.log('New client connected');

  socket.on('message', async (data) => {
    const message = new Message(data);
    await message.save();
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});