const express = require('express');
const path = require('path');
const cors = require('cors');
const body_parser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const http = require('http').createServer(app);

app.get('/', (req, res) => {
    res.send('Hello there! Let\'s chat');
})

 mongoose.connect("mongodb+srv://root:root@chat-cluster.gagqs0e.mongodb.net/chat-socket?retryWrites=true&w=majority&appName=Chat-cluster").then(()=>{
    console.log('mongo connected');
 })
 .catch(()=>{
    console.log('error')
 })

var Schema = mongoose.Schema;
var userSchema = new Schema({
    name : {type: String, required: true},
}, {versionKey:false})

var collection = mongoose.model('users', userSchema);
// data={ 
//     name:userName
// }
// collection.insertMany([data])

const io = require('socket.io')(http, {
    cors: {
        origin:'*'
    }
});

app.get('/', (req,res) => {
    res.send('hello')
})

let userList = new Map();

io.on('connection', (socket) => {
    let userName = socket.handshake.query.userName;
    addUser(userName, socket.id);

    socket.broadcast.emit('user-list', [...userList.keys()]);
    socket.emit('user-list', [...userList.keys()]);

    data={ 
        name:userName
    }
    collection.insertMany([data])

    socket.on('message',  (msg) =>{
        socket.broadcast.emit('message-broadcast', {message: msg, userName: userName});
    })

    socket.on('disconnect', (reason) => {
        removeUser(userName, socket.id);
    })
});


function addUser (userName, id){
    if(!userList.has(userName)){
        userList.set(userName, new Set(id));
    }else{
        userList.get(userName).add(id);
    }
}

function deleteUser(userName, id){
    if(userList.has(userName)){
        let userId = userList.get(userName);
        if(userId.size == 0){
            userList.delete(userName);
        }
    }
}

const port = 3000;
http.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})