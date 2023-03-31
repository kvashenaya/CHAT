const mongoose = require('mongoose');

const connectDB = () => {
    try {
        mongoose.connect('mongodb+srv://kvasha:Alina1702@cluster0.wed20lw.mongodb.net/?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB