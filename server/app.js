if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const mongoose = require('mongoose');
const log = console.log;
const faker = require('faker');
const BOTS = require('./db/botInfo');
const connectDB = require('./config/connectDB');
const PORT = 4000;

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});
//connectDB();
mongoose.connect('mongodb://127.0.0.1:27017/test');
// const connect = mongoose.connect(url);
mongoose.Promise = global.Promise;

// connect.then((db) => {
//     console.log("Connected correctly to server");
// }, (err) => { console.log(err); });

const BotsMessages = require('./models/messages');
const Bots = require('./models/bots');
const Users = require('./models/users');

app.use(cors())

let allUsers = [{id: `user${Math.random()}`, name: `default user`, online: true}];
let currentUser = {};
let userMessages = [];

function reverseString(str) {
  return str.split("").reverse().join("");
}

function sendMessage(data, textStr, sock){
  const msgClient = new BotsMessages({
    name: data.name,
    text: data.text,
    side: data.side
  });
  const msgServer = new BotsMessages({
    name: data.name,
    text: textStr,
    side: 'server'
  });
  msgClient.save().then((res) => {
    log(res._doc); 
    sock.emit('messageResponse', res._doc);   
    msgServer.save().then((res) => {
      log(res._doc); 
      sock.emit('messageResponse', res._doc)
  });
});
}

function sendMessageIgnoreBot(data, sock) {
  const msgClient = new BotsMessages({
    name: data.name,
    text: data.text,
    side: data.side
  });    
  msgClient.save().then((res) => {
    //log(res._doc); 
    sock.emit('messageResponse', res._doc);
  });
}
//localStorage.clear();

socketIO.on('connection', (socket) => { 
  const userID = socket.id;
  //BotsMessages.deleteMany({}) 
  BotsMessages.find({}).then(result => {
      const modif = result.map(msg=>msg._doc)
      //log(modif)
      socket.emit('loadMessages', modif)
  })
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();  
    currentUser = {id: userID, name: `${firstName} ${lastName}`, online: true}
    allUsers.push(currentUser);
    log(`User ${currentUser.name} just connected!`) 
    //log('All users: ', allUsers)
    localStorage.setItem('BOTS', JSON.stringify(BOTS.BOTS));
    localStorage.setItem('USERS', JSON.stringify(allUsers));    
    log(currentUser)
    socketIO.emit("getUsers", allUsers);
    socket.emit("getCurrentUser", currentUser);  
    socket.emit("getData", BOTS.BOTS);

    socket.on("messageUser", data=>{
      //log(data)
      userMessages.push(data);
      localStorage.setItem('userMessages', JSON.stringify(userMessages));
      let arr = JSON.parse(localStorage.getItem('userMessages')).filter(mes => mes.idFrom == data.idFrom && mes.idTo == data.idTo)
       socket.emit("messageUserResponse", arr)}
    ) 

    socket.on("message", data => {
      if(data.name === 'Echo bot'){
        sendMessage(data, data.text, socket)
      }
      else if(data.name === 'Reverse bot'){
        const msgClient = new BotsMessages({
          name: data.name,
          text: data.text,
          side: data.side
        });
        const msgServer = new BotsMessages({
          name: data.name,
          text: reverseString(data.text),
          side: 'server'
        });
        msgClient.save().then((res) => {
          //log(res._doc); 
          socket.emit('messageResponse', res._doc);   
          setTimeout(()=>{ msgServer.save().then((res) => {
            //log(res._doc); 
            socket.emit('messageResponse', res._doc)
        })}, 3000) 
        });
      }

      else if(data.name === 'Spam bot'){
        const msgClient = new BotsMessages({
          name: data.name,
          text: data.text,
          side: data.side
        });
        const msgServer = new BotsMessages({
          name: data.name,
          text: 'SPAM',
          side: 'server'
        });
        msgClient.save().then((res) => {
          //log(res._doc); 
          socket.emit('messageResponse', res._doc);   
          setInterval(()=>{msgServer.save().then((res) => {
            //log(res._doc); 
            socket.emit('messageResponse', res._doc)
        })}, Math.floor(Math.random()*(1200-101))+100)
        });
      }

      else if(data.name === 'Ignore bot'){
        sendMessageIgnoreBot(data, socket)
      } 

      else if(data.name === 'Rude bot'){
        sendMessage(data, `I don't care`, socket)
      }
    })
  
    socket.on("typing", data => (
      socket.broadcast.emit("typingResponse", data)
    ))

    socket.on('disconnect', () => {     
      allUsers=allUsers.filter(user=>user.id!==currentUser.id)
      //log(allUsers)
      log(`User ${currentUser.name} disconnected!`) 
    })
});

app.get("/", (req, res) => {
  res.json(`Hello! You can get information about chat bots.` )
}); 
app.get("/botsinfo", (req, res) => {
  res.json(BOTS.BOTS)
});
// app.get("/messagesEchoBot", (req, res) => {
//   res.json(messagesE)
// });

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});