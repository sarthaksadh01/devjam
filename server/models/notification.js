let mongoose = require('mongoose');
var Schema = mongoose.Schema;
var notifications = new Schema({
    email: {
        type: String,
        required: [true, "can't be blank"],
        index: true,
    },
    notificationType:{
        type:String,
        default:""
    },
    title:{
        type:String,
        default:""
    },
    text: {
        type: String,
        default:""

    },
    isUrl:{
        type:Boolean,
        default:false
    },
    url: {
        type: String,
        default:""
    },
    isRead:{
        type:Boolean,
        default:false
    }
  

}, { timestamps: true });
module.exports = mongoose.model('Notifications', notifications);