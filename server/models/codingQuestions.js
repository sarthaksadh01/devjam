let mongoose = require('mongoose');
var Schema = mongoose.Schema;
var codingTestQestions = new Schema({
    title: {
        type: String,
        default: "[Untitled Test]",
        index: true,

    },
    imageUrl:{
        type:String,
        default:""

    },
    desc:{
        type:String,
        default:"draft",
    },
    constraints: {
        type: String,
        default: "",
    },
    points:{
        type:Number,
        default:0
    },
    execTime: {
        type: Number,
        default: 3,
    },
    sampleInput: {
        type: String,
        default: "",
    },
    sampleOutput: {
        type: String,
        default: "",
    },
    testCases:{
        type:[],
        default:[]
    },
    difficulty:{
        type:String,
        default:"easy"
    },
    questionType:{
        type:String,
        default:"coding"
    },
    enableJavascript:{
        type:Boolean,
        default:false
    }


}, { timestamps: true });
module.exports = mongoose.model('CodingTestQuestions', codingTestQestions);
