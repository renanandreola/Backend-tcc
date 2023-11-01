const { Schema } = require('mongoose');

module.exports = new Schema({
    code: String,
    name: String,
    userEmail: String,
    userName: String,
});