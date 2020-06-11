const {
    tryToDelete,
    sendSuggestionMessage
} = require('./helpers');

const {getMovieEntry} = require('./omdbService');

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
    suggest: async (client, message, args) => {
        let search = args.join(' ');
        let entry = await getMovieEntry(client.config, search);
        if (entry.Error) return message.reply('Could not find movie: ' + search);
        sendSuggestionMessage(client, message, entry);
    }
};