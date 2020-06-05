/*

    This file contains schema for Profiles Table.

 */

let mongoose = require('mongoose');
var Schema = mongoose.Schema;
var profiles = new Schema({
    name: {
        type: String,
        default:"",
        index: true, // this make searching fast

    },
    createdBy:{
        type:String,
        required:true
    },
    title: {
        type: String,
        default:""
    },
    designation: {
        type: String
    },
    profileImage: {
        type:String,
        default:""
    },
    youtubeProfile:{
        type:String,
        default:""
    },
    githubProfile:{
        type:String,
        default:""
    },
    specialization:{
        type:String,
        default:""
    },
    technicalSkills: {
        type:[String],
        default:[]
    },
    hobbies:{
        type:[String],
        default:[]
    },
    education:{
        type:[
            /*{
                university: "",
                branch: "",
                comment: ""
            }*/
        ],
        default:[]

    },
    
    experience: {
        type: [
            /*{
                company: "",
                position: "",
                startDate: new Date(),
                endDate: new Date(),
                isPresent: false,
                desc: ""
            }*/

        ],
        default:[]
    },
    softSkills:{
        type:[

            /*{
                name: "",
                rating: 1,
                comment: ""
            }*/

        ],
        default:[]

    },
    hardSkills:{
        type:[
           /* {
                name:"",
                subSkills: [
                    {
                        name: "",
                        experience: 1,
                        rating: 1,
        
                    }
                ]
            }*/
        ],
        default:[]
    }
}, { timestamps: true });
module.exports = mongoose.model('Profiles', profiles);