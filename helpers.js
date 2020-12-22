const { MessageEmbed } = require('discord.js');
const {getTrailerUrl} = require('./googleService');

let tryToDelete = function(message, channel) {
    if (!channel) channel = message.channel;
    message.delete().catch(err => {
        channel.send('<Failed to delete message>');
    });
};

let getSuggestionChannel = function(client) {
    return client.channels.fetch(client.config.suggestionChannel);
};

let formatMessage = function(formatStr, vars) {
    return formatStr.replace(/\$\{(\w+)\}/g, (match, name) => {
        if (vars.hasOwnProperty(name)) return vars[name];
        return match;
    });
};

let generateSuggestionMessage = async function(client, entry) {
    return formatMessage(client.config.messageFormat, {
        ...entry,
        Description: entry.Plot,
        TrailerUrl: await getTrailerUrl(entry)
    });
};

let sendSuggestionMessage = async function(client, message, entry) {
    let text = await generateSuggestionMessage(client, entry);
    let channel = await getSuggestionChannel(client);
    channel.send(text);
};

let verifyAuthorIsAdmin = async function(message) {
    if ((message.member.permissions & 0x8) > 0) return true;
    message.reply('You must be an admin to use this command.')
    return false;
};

let avatarUrlCache = {};

let getAvatarUrl = async function(user) {
    if (!avatarUrlCache.hasOwnProperty(user.tag)) 
        avatarUrlCache[user.tag] = await user.avatarURL();
    return avatarUrlCache[user.tag];
};

let moveMessage = async function(message, targetChannel) {
    let embed = new MessageEmbed()
        .setColor('#0099ff')
        .setAuthor(message.author.username, await getAvatarUrl(message.author))
        .setDescription(message.content);
    await targetChannel.send(embed);
    await message.delete({ reason: 'message moved' });
};

let getMessagesInRange = async function(channel, firstMessageId, lastMessageId) {
    let messages = [
        await channel.messages.fetch(firstMessageId)
    ];
    let currentMessageId = firstMessageId;
    while (true) {
        let newMessages = (await channel.messages.fetch({
            after: currentMessageId,
            limit: 50
        }, true, true)).array();
        for (let i = newMessages.length - 1; i >= 0; i--) {
            let msg = newMessages[i];
            messages.push(msg);
            if (msg.id === lastMessageId) return messages;
        }
        currentMessageId = messages.slice(-1)[0].id;
    }
};

module.exports = {
    tryToDelete,
    getSuggestionChannel,
    sendSuggestionMessage,
    verifyAuthorIsAdmin,
    moveMessage,
    getMessagesInRange
};