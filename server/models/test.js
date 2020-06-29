let mongoose = require('mongoose');
var Schema = mongoose.Schema;
var test = new Schema({
    title: {
        type: String,
        index: true, // this make searching fast
        default: "New Test"

    },
    desc:{
        type:String,
        default:"Test Desc"
    },
    isTimed:{
        type: Boolean,
        default:false,
    },
    testTiming:{
        type:Number,
        default:10
    },
    isShuffle:{
        type:Boolean,
        default:false
    },
    questions:{
        type:[],
        default:[]
    },
    testFor:{
        type:[],
        default:[]
    },
    status:{
        type:String,
        default:"draft"

    }


}, { timestamps: true });
module.exports = mongoose.model('Tests', test);