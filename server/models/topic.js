
/*

   This file contains schema for Topic Table.

 */
let mongoose = require('mongoose');
var Schema = mongoose.Schema;
var topic = new Schema({
    title: {
        type: String,
        index: true, // this make searching fast
        default: "New Topic"

    },
    createdBy: {
        type: String,
        required: true
    },

    // this is to rearrange topics
    priority: {
        type: Number,
        required: [true, "can't be blank"],
    },

    // topic description
    desc: {
        type: String,
        default: ""
    },

    // already in the form of array so no need for priority can be rearranged based on array index
    subTopics: {
        type: [{}],
        default: []
    },

}, { timestamps: true });
module.exports = mongoose.model('Topics', topic);


