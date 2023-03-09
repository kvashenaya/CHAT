const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });

function reverseString(str) {
    return str.split("").reverse().join("");
}
async function trainChatBotIA() {
    return new Promise(async (resolve, reject) => {
        manager.addDocument('en', 'goodbye for now', 'greetings.bye');
        manager.addDocument('en', 'bye bye take care', 'greetings.bye');
        manager.addDocument('en', 'okay see you later', 'greetings.bye');
        manager.addDocument('en', 'bye for now', 'greetings.bye');
        manager.addDocument('en', 'i must go', 'greetings.bye');
        manager.addDocument('en', 'hello', 'greetings.hello');
        manager.addDocument('en', 'hi', 'greetings.hello');
        manager.addDocument('en', 'howdy', 'greetings.hello');

        manager.addAnswer('en', 'greetings.bye', 'See you soon!');
        manager.addAnswer('en', 'greetings.hello', 'How can I help you!');

await manager.train();
        manager.save();
        console.log("AI has been trainded")
        resolve(true);
    })
}
async function generateResponseAI(qsm) {
    return new Promise(async (resolve, reject) => {
        response = await manager.process('en', qsm);
        resolve(response);
    })
}

module.exports = {
    trainChatBotIA,
    generateResponseAI
}