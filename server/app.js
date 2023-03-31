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

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

// app.use((req, res, next) => {
//   connectDB();
// })
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/test');
const conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));

const BotsMessages = require('./models/messages');
const Bots = require('./models/bots');
const Users = require('./models/users');

app.use(cors());

// const Bot1 = new Bots({
//   name: "Echo bot",
//   description: "Send me message and you will receive the same answer.",
//   photo: "https://smart-gadget.club/image/cache/catalog/Products/fun/Emo-Robot-AI/emo-robot-1-800x800.jpg",
//   status: "online" 
// });
// const Bot2 = new Bots({
//   name: "Reverse bot",
//   description: "Hello! I am reverse bot, and I can reflect your messages.",
//   photo: "https://images.techinsider.ru/upload/img_cache/fe0/fe07b308ac30fd2df95205a28f887039_ce_1920x1278x0x941_cropped_666x444.jpg",
//   status: "online"
// });
// const Bot3 = new Bots({
//   name: "Spam bot",
//   description: "If you text me at once, you will receive not very informative information.",
//   photo: "https://habrastorage.org/getpro/megamozg/post_images/e49/ea7/6f3/e49ea76f3a9bda552e1c974d22e47e4e.jpg",
//   status: "online"
// });
// const Bot4 = new Bots({
//   name: "Ignore bot",
//   description: "My function is ignore you. That's it.",
//   photo: "https://static6.depositphotos.com/1020482/665/i/600/depositphotos_6659363-stock-photo-robot-and-giving-ok.jpg",
//   status: "online"
// });
// const Bot5 = new Bots({
//   name: "Rude bot",
//   description: "You shouldn't have wroten me at all.",
//   photo: "https://wpapers.ru/wallpapers/3d/Rendering/11990/1280x1024_%D0%A2%D0%B5%D1%80%D0%BC%D0%B8%D0%BD%D0%B0%D1%82%D0%BE%D1%80.jpg",
//   status: "offline"
// });
     
// Bot1.save().then(() => {Bot2.save(); Bot3.save(); Bot4.save(); Bot5.save();});
// Bots.deleteMany({}).then(()=>
// Bots.find({}).then(result => {
//    log(result);
//   });
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
// Users.deleteMany({}).then(()=>{
//   Users.find({}).then(result => {
//     log(`All users ${result}`) 
//   });
// });

socketIO.on('connection', (socket) => {   
  socket.on('newUser', u=>{
    const userID = socket.id;
    const user = new Users({
      id: userID,
      name: u,
      online: true
    });
    user.save().then(() => {
      Users.findOne({id: userID}).then((result)=>{
        socket.emit("getCurrentUser", result);
        log(`User ${result.name} just connected!`); 
      });      
      Users.find({}).then(result => {
        socketIO.emit("getUsers", result);
        //log(`All users ${result}`);
      });  
    });     
  });  
  Bots.find({}).then(result => {
    //console.log(result[0]["_doc"]);
    socket.emit("getData", result);
  });

  // BotsMessages.find({}).then(result => {
  //     const modif = result.map(msg=>msg._doc)
  //     socket.emit('loadMessages', modif)
  //})

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
  res.json("BOTS.BOTS")
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});