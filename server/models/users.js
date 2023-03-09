const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {
        type: String,
        required: true,
    }, 
    name: {
        type: String,
        required: true,
    },
    online: {
        type: Boolean,
        required: true,
    }
},{
    timestamps: true
});

var Users = mongoose.model('Users', userSchema);


module.exports = Users;
