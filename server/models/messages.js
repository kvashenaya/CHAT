const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const botMessageSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    side: {
        type: String,
        required: true,
        enum: ['client', 'server',]
    }
},{
    timestamps: true
});

// const userMessageSchema = new Schema({
//     text: {
//         type: String,
//         required: true,
//     }, 
//     idTo: {
//         type: String,
//         required: true,
//     },
//     nameTo: {
//         type: String,
//         required: true,
//     },        
//     idFrom: {
//         type: String,
//         required: true,
//     },
//     nameFrom:{
//         type: String,
//         required: true,
//     }
// },{
//     timestamps: true
// });

var BotsMessages = mongoose.model('BotMessage', botMessageSchema);
//var UsersMessages = mongoose.model('UserMessage', userMessageSchema);

module.exports = BotsMessages;
//module.exports = UsersMessages;