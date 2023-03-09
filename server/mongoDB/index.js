const MongoClient = require('mongodb').MongoClient;
//const assert = require('assert');
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'chat';

MongoClient.connect(url).then(client => {

    console.log('Connected correctly to server');
    const db = client.db(dbname);

    dboper.insertMessage(db, { name: "Vadonut", description: "Test"}, "botsMessages")
    .then((result) => {
        console.log("Insert Message:\n", result);
        return dboper.findDocuments(db, "botsMessages");
    })
    .then((result) => {
        console.log("All messages:\n", result);
        return client.close();
    })
    .catch((err) => console.log('Error', err));

})
.catch((err) => console.log('Connection error', err));