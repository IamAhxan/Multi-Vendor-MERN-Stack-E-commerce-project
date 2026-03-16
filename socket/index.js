import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env',
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // This allows any website to connect; change this to your URL in production
        methods: ["GET", "POST"]
    }
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (receiverId) => {
    return users.find(user => user.userId === receiverId);
}

// Define a message object with a seen property
const createMessage = ({ senderId, receiverId, text, images }) => ({
    senderId,
    receiverId,
    text,
    images,
    seen: false, // This property will track if the message has been seen
});

io.on("connection", (socket) => {
    // when connect
    console.log("a user connected.");
    // take userId and socketId from user
    socket.on("addUser", userId => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    // send and get message
    const messages = {};

    socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
        const message = createMessage({ senderId, receiverId, text, images });
        const user = getUser(receiverId);

        // Store messages in message object
        if (!messages[receiverId]) {
            messages[receiverId] = [message];
        } else {
            messages[receiverId].push(message);
        }

        // Send the mesage to receiver
        io.to(user?.socketId).emit("getMessage", message);
    })

    socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
        const user = getUser(senderId);

        // update the seen flag
        if (messages[senderId]) {
            const message = messages[senderId].find((message) => message.receiverId === receiverId && message.Id === messageId);
            if (message) {
                message.seen = true;
                // Send a message seen event to the sender
                io.to(user?.socketId).emit("messageSeenUpdate", { senderId, receiverId, messageId });
            }
        }
    })

    // update and get last message

    socket.on("updateLastMessage", ({ lastMessage, lastMessageId }) => {
        io.emit("getLastMessage", { lastMessage, lastMessageId });
    });


    // When user disconnects
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });

});




server.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});