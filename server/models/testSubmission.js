let mongoose = require('mongoose');
var Schema = mongoose.Schema;
var submission = new Schema({
    email: {
        type: String,
        required: [true, "can't be blank"],
        index: true,

    },
    testId:{
        type: String,
        required: [true, "can't be blank"],
        index: true,

    },
    ans:{
        type:[],
        default:[]

    },
    isTimed:{
        type:Boolean,
        default:false
    },
    testTiming:{
        type: Number,
        default:10

    },
    isOver:{
        type:Boolean,
        default:false
    },
    progress:{
        type:Number,
        default:0
    },
    completedOnTime:{
        type:Boolean
    },
    isStarted:{
        type:Boolean,
        default:true

    },
    isReleased:{
        type:Boolean,
        default:false
    },
    finalMarks:{
        type:Number,
        default:0
    }

}, { timestamps: true });
module.exports = mongoose.model('SubmissionsTest', submission);