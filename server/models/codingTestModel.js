let mongoose = require('mongoose');
var Schema = mongoose.Schema;
var codingTests = new Schema({
    title: {
        type: String,
        default: "[Untitled Test]",
        index: true,

    },
    status:{
        type:String,
        default:"draft",
    },
    instructions: {
        type: String,
        default: "",
    },
    questions: {
        type: [],
        default: []
    },
    editorial: {
        type: [],
        default: []
    },
    testFor: {
        type: [],
        default: []
    },
    isTimed: {
        type: Boolean,
        default: false
    },
    testTiming: {
        type: Number,
        default: 10
    },
    isTabsPrevented: {
        type: Boolean,
        default: false

    },
    isCopyPasteBlocked: {
        type: Boolean,
        default: false
    },
    isEditorialReleased: {
        type: Boolean,
        default: false
    },


}, { timestamps: true });
module.exports = mongoose.model('CodingTests', codingTests);
