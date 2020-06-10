const request = require('request');
const omdbApiUrl = 'http://www.omdbapi.com/?';
const movieKeyExpr = /^(.+)( \(\d{4}\))?$/;

let tryToDelete = function(message, channel) {
    message.delete().catch(err => {
        channel.send('<Failed to delete message>');
    });
};

let getOmdbOptions = function(config, key) {
    let match = movieKeyExpr.match(key);
    let options = {
        apikey: config.omdbApiUrl,
        type: 'movie',
        t: match[1]
    };
    if (match[2]) options.y = match[2];
    return options;
};

let urlOptions = function(options) {
    return Object.keys(options)
        .map(key => `${key}=${value}`)
        .join('&');
};

let getMovieEntry = async function(config, key) {
    let options = getOmdbOptions(config, key);
    let url = omdbApiUrl + urlOptions(options);
    return await request(url).catch(err => {});
};

let getSuggestionChannel = function(client) {
    return client.channels.get(client.config.suggestionChannel);
};

let formatMessage = function(formatStr, vars) {
    return formatStr.replace(/\$\{(\w+)\}/g, (match, name) => {
        if (vars.hasOwnProperty(name)) return vars[name];
        return match;
    });
};

let generateSuggestionMessage = function(client, entry, description) {
    return formatMessage(client.config.messageFormat, {
        ...entry,
        Description: description || entry.Plot
    });
};

let sendSuggestionMessage = function(client, entry, description) {
    let text = generateSuggestionMessage(client, entry, description);
    let channel = getSuggestionChannel(client);
    channel.send(text);
};

module.exports = {
    tryToDelete,
    getMovieEntry,
    getSuggestionChannel,
    sendSuggestionMessage
};