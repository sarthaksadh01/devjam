let mongoose = require('mongoose');
var Schema = mongoose.Schema;
var submissions = new Schema({
    email: {
        type: String,
        required: [true, "can't be blank"],
        index: true,


    },
 
    subTopicId: {
        type: String,
        required: [true, "can't be blank"],
        index: true,

    },
    fileUrl:{
        type:String,
        default:""
    },
    comment:{
        type:String,
        default:""
    }


}, { timestamps: true });
module.exports = mongoose.model('Submissions', submissions);
