let mongoose = require('mongoose');
var Schema = mongoose.Schema;
var course = new Schema({
    title: {
        type: String,
        index: true, // this make searching fast
        default: "New Course"

    },
    desc:{
        type:String,
        default:"Test Desc"
    },
    startDate:{
        type:String,
        default: new Date()
    },
    endDate:{
        type:String,
        default: new Date()
    },
    events:{
        type:[],
        default:[]
    },
    courseFor:{
        type:[],
        default:[]
    },
    status:{
        type:String,
        default:"draft"

    }


}, { timestamps: true });
module.exports = mongoose.model('Courses', course);