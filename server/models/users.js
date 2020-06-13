let mongoose = require('mongoose');
var Schema = mongoose.Schema;
var users = new Schema({
    email: {
        type: String,
        required: [true, "can't be blank"],
        index: true,
        unique: true


    },
 
    name: {
        type: String,
        default:""

    },
    imageUrl:{
        type:String,
        default:""
    },
    isSocialLogin:{
        type:Boolean,
        default:false
    },
    password: {
        type: String,
        default:""
    }

}, { timestamps: true });
module.exports = mongoose.model('Users', users);
