const {SuggestionAlreadyExists} = require('./errors.js');

const {
    tryToDelete,
    getMovieEntry,
    getSuggestionChannel,
    sendSuggestionMessage
} = require('./helpers.js');

module.exports = {
    ping: async (client, config, message, args) => {
        let m = await message.reply("Ping?");
        let latency = m.createdTimestamp - message.createdTimestamp;
        let apiLatency = Math.round(client.ws.ping);
        m.edit(`Pong! Latency is ${latency}ms. API Latency is ${apiLatency}ms`);
    },
    say: async (client, config, message, args) => {
        let sayMessage = args.join(" ");
        tryToDelete(message);
        message.reply(sayMessage);
    },
    suggest: async (client, config, message, [key, description]) => {
        let entry = await getMovieEntry(key);
        let channel = getSuggestionChannel(client, config);
        let messageTitle = `${entry.Title} (${entry.Year})`;
        let suggestionMsg = getSuggestionMessage(channel, messageTitle);
        if (suggestionMsg) throw new SuggestionAlreadyExists(messageTitle);
        sendSuggestionMessage(config, channel, entry, description);
    }
};