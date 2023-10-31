const { Schema } = require('mongoose');

module.exports = new Schema({
    name: String,
    chatId: Number
});