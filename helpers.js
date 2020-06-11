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

module.exports = {
    tryToDelete,
    getSuggestionChannel,
    sendSuggestionMessage
};