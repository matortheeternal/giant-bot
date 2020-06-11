const util = require('util');
const request = util.promisify(require('request'));
const omdbApiUrl = 'http://www.omdbapi.com/?';
const movieKeyExpr = /^(.+)( \(\d{4}\))?$/;

let getOmdbOptions = function(config, search) {
    let match = search.match(movieKeyExpr);
    let options = {
        apikey: config.omdbApiKey,
        type: 'movie',
        t: match[1]
    };
    if (match[2]) options.y = match[2];
    return options;
};

let urlOptions = function(options) {
    return Object.keys(options)
        .map(key => `${key}=${options[key]}`)
        .join('&');
};

let getMovieEntry = async function(config, search) {
    let options = getOmdbOptions(config, search);
    let url = omdbApiUrl + urlOptions(options);
    let response = await request(url);
    return JSON.parse(response.body);
};

module.exports = {getMovieEntry};