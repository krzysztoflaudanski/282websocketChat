const express = require("express");
const path = require('path');
const socket = require('socket.io');
const app = express();
const port = 8000;
const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(port, () => {
    console.log(`Aplikacja jest dostępna pod adresem http://localhost:${port}`);
});

const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('userLogin', (userName) => {
        console.log('User ' + userName + ' has logged in');
        const userObject = { name: userName, id: socket.id };
        users.push(userObject);
        // Informuj innych klientów o zmianie w tablicy users
        io.emit('users', users);
    });
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });
    socket.on('disconnect', () => {
        console.log('Oh, socket ' + socket.id + ' has left');
        const disconnectedUser = users.find(user => user.id === socket.id);

        if (disconnectedUser) {
            const userName = disconnectedUser.name;
            // Usuń użytkownika z tablicy users
            const index = users.indexOf(disconnectedUser);
            users.splice(index, 1);
            console.log('User ' + userName + ' has left');
            // Informuj innych klientów o zmianie w tablicy users
            io.emit('logout', userName);
            console.log(disconnectedUser)
        } else {
            console.log('User not found in the users array');
        }
    });
    console.log('I\'ve added a listener on message and disconnect events \n');
    console.log(users)
});

