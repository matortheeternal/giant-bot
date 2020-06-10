class SuggestionAlreadyExists extends Error {
    constructor(key) {
        this.message = `Suggestion already exists: ${key}`;
    };
}

module.exports = {
    SuggestionAlreadyExists
};