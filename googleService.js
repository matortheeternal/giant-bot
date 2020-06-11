const util = require('util');
const request = util.promisify(require("request"));
const {parse} = require('node-html-parser');

const baseGoogleUrl = 'https://www.google.com/search?tbm=vid&q=';

let extractUrl = function(href) {
    let match = href.match(/\?q=([^\&]+)/);
    return decodeURIComponent(match[1]);
};

let extractFirstUrl = async function(response) {
    let dom = parse(response.body);
    let main = dom.querySelector('#main');
    let firstResult = main.childNodes[3].querySelector('a');
    return extractUrl(firstResult.getAttribute('href'));
};

let getTrailerUrl = async function(entry) {
    let searchStr = `${entry.Title} ${entry.Year} trailer`;
    let url = baseGoogleUrl + encodeURI(searchStr);
    let response = await request(url);
    if (response.statusCode !== 200) 
        throw new Error('Trailer lookup failed.');
    return await extractFirstUrl(response);
};

module.exports = {getTrailerUrl};