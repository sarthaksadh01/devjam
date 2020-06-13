let mongoose = require('mongoose');
var Schema = mongoose.Schema;
var admins = new Schema({
    userName: {
        type: String,
        type: String,
        required: [true, "can't be blank"],
        index: true,
        unique: true


    },
    name: {
        type: String

    },
    password: {
        type: String,
        required: [true, "can't be blank"],
    }

}, { timestamps: true });
module.exports = mongoose.model('Admins', admins);
