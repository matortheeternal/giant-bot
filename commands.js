const { MessageEmbed } = require('discord.js');
const {
    tryToDelete,
    sendSuggestionMessage,
    verifyAuthorIsAdmin,
    moveMessage,
    getMessagesInRange
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
    },
    bulkMove: async (client, message, args) => {
        if (args.length < 3) return message.reply('Invalid arguments.');
        let [firstMessageId, lastMessageId, targetChannelName] = args;
        if (!await verifyAuthorIsAdmin(message)) return;
        let sourceChannel = message.channel;
        let m = await message.reply(`Scanning messages after ${firstMessageId} and before ${lastMessageId}`);
        let messages = await getMessagesInRange(sourceChannel, firstMessageId, lastMessageId);
        m.edit(`Moving ${messages.length} messages to ${targetChannelName}`);
        let targetChannel = await message.guild.channels.resolve(targetChannelName.slice(2, -1));
        await targetChannel.send(new MessageEmbed()
            .setColor('#ff9900')
            .setDescription(`${messages.length} messages moved from <#${sourceChannel.id}>`));
        for (let msg of messages) await moveMessage(msg, targetChannel);
        m.edit(`Moved ${messages.length} messages to ${targetChannelName}`);
    }
};