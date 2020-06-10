const {SuggestionAlreadyExists} = require('./errors.js');

const {
    tryToDelete,
    getMovieEntry,
    sendSuggestionMessage
} = require('./helpers.js');

module.exports = {
    ping: async (client, message, args) => {
        let m = await message.reply("Ping?");
        let latency = m.createdTimestamp - message.createdTimestamp;
        let apiLatency = Math.round(client.ws.ping);
        m.edit(`Pong! Latency is ${latency}ms. API Latency is ${apiLatency}ms`);
    },
    say: async (client, message, args) => {
        let sayMessage = args.join(" ");
        tryToDelete(message);
        message.reply(sayMessage);
    },
    suggest: async (client, message, [search, description]) => {
        let entry = await getMovieEntry(search);
        sendSuggestionMessage(client, entry, description);
    }
};