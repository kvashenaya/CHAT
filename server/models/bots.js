const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const botSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
},{
    timestamps: true
});

var Bots = mongoose.model('Bots', botSchema);


module.exports = Bots;
