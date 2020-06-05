/* 

This file is used to connect to database
& contain functions to execute all required 
features.
 
*/

const mongoose = require('mongoose')
var ObjectID = require('mongodb').ObjectID;

mongoose.connect(require("./config").dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, () => {
    console.log('connected to db')
}).catch((err) => {
    console.log(err)
})

const Topics = require("./models/topic")
const Profiles = require("./models/profile")
const Admins = require("./models/admin")



/* 

  Function to get all the topics for content route

*/

async function getContent(id) {
    return new Promise((resolve, reject) => {
        Topics.find({ createdBy: id }).
            sort({ priority: 'desc' }).
            exec((err, topics) => {
                if (err) reject(err);
                resolve(topics);
            })
    })

}

/* 
  Function to get single topic based on topic Id
*/

async function getTopic(_id) {
    return new Promise((resolve, reject) => {
        Topics.findOne({ _id }).then((topic) => {
            resolve(topic);

        }).catch((err) => {
            reject(err);

        })

    })
}

/* 
  Function to get single video based on video Id
*/

async function getSubtopic(topicId, subTopicId) {
    return new Promise((resolve, reject) => {
        Topics.findOne({ _id: topicId }).then((doc) => {
            resolve(doc.subTopics.find((subTopic) => {
                return subTopic.subTopicId == subTopicId
            }))
        }).catch((err) => {
            reject(err);
        })

    })
}


/*

  Function to save topic in the topics table

*/
async function saveTopic(topicDetails) {
    return new Promise((resolve, reject) => {

        Topics.findOne({}).sort("-priority").exec((err, topic) => {
            if (err) reject(err);
            topicDetails['priority'] = topic != null ? topic['priority'] + 1 : 0;
            var _topic = new Topics(topicDetails);
            _topic.save().then((doc) => {
                resolve(doc);
            }).catch((err) => {
                reject(err);

            })

        })


    })

}

/*

  Function to save new subtopic 

*/

async function insertSubtopic(topicId, detail = {}) {

    return new Promise((resolve, reject) => {
        var _id = ObjectID();
        detail['subTopicId'] = _id;
        Topics.findOneAndUpdate({ _id: topicId }, {
            $push: {
                subTopics: detail
            }
        }).then((doc) => {
            resolve(_id);
        }).catch((err) => {
            reject(err);
        })

    })
}

/*

   Function to remove subtopic from  the subtopic array
   in topic table

 */

async function removeSubTopic(topicId, subTopicId, ) {
    return new Promise((resolve, reject) => {
        Topics.updateOne({ _id: topicId }, { $pull: { subTopics: { subTopicId } } }, (err, doc) => {
            if (err) reject(err);
            resolve(doc);

        });

    });
}

/*

   Function to remove topic based on the topic id
   in topic table

 */

async function removeTopic(topicId) {
    return new Promise((resolve, reject) => {
        Topics.deleteOne({ _id: topicId }).then((value) => {
            resolve(value);
        }).catch((err) => {
            reject(err);
        })

    });

}

/*

   Function to update topic based on the topic id
   in topic table

 */

async function updateTopic(topic) {
    return new Promise((resolve, reject) => {
        Topics.findOneAndUpdate({ _id: topic._id }, topic).then((value) => {
            resolve(value);
        }).catch((err) => {
            reject(err);
        })

    });

}

/*

   Function to update subtopic based first on topic id 
   to find parent topic & then find the required sub topic 
   from subtopics array & assign new data

 */

async function updateSubtopic(topicId, subTopicId, data) {
    return new Promise((resolve, reject) => {
        Topics.findOne({ _id: topicId }).then((doc) => {
            for (var i = 0; i < doc.subTopics.length; i++) {
                if (doc.subTopics[i].subTopicId == subTopicId) {
                    doc.subTopics[i] = data;
                    break;
                }
            }
            Topics.updateOne({ _id: topicId }, doc).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        }).catch((err) => {
            reject(err);
        })

    });

}

/*

   Function to get all profiles in the profile table
   of a particular admin based on admin id.

 */

async function getProfiles(id) {
    return new Promise((resolve, reject) => {
        Profiles.find({ createdBy: id }).then((doc) => {
            resolve(doc);
        }).catch((err) => {
            reject(err);
        })

    })
}

/*

   Function to update profile based on profile id 

 */

async function updateProfile(doc) {
    return new Promise((resolve, reject) => {
        Profiles.findOneAndUpdate({ _id: doc._id }, doc).then((doc) => {
            resolve(doc);
        }).catch((err) => {
            reject(err);
        })

    })
}

/*

   Function to get single profile using its unique profile id

 */

async function getSingleProfile(_id) {
    return new Promise((resolve, reject) => {
        Profiles.findOne({ _id }).then((doc) => {
            resolve(doc);
        }).catch((err) => {
            reject(err);
        })

    })
}

/*

   Function to create new profile

 */

async function createProfile(doc) {
    return new Promise((resolve, reject) => {
        var _profile = new Profiles(doc);
        _profile.save((err, doc) => {
            if (err) reject(err);
            resolve(doc);

        });

    })
}

/*

   Function to rearrange the topics/subtopics in the
   database when items are dragged to refect the changes
   in the backend
 */

async function reArrange(_id1, _id2, p1, p2) {
    return new Promise((resolve, reject) => {
        Topics.updateOne({ _id: _id1 }, { priority: parseInt(p1) }, (err, doc) => {
            if (err) reject(err);
            Topics.updateOne({ _id: _id2 }, { priority: parseInt(p2) }, (err, doc) => {
                if (err) reject(err);
                resolve(doc);

            })
        })
    })

}

/*

   Function to create admin by super admin

 */

async function createAdmin(userName, password, name) {
    return new Promise((resolve, reject) => {
        var _admin = new Admins({
            userName,
            password,
            name

        });
        _admin.save().then((doc) => {
            resolve(doc);


        }).catch((err) => {
            reject(err);
        });

    })
}

/*

   Function to get admin based on username & password
   from super admin table

 */

async function getAdmin(userName, password) {
    return new Promise((resolve, reject) => {
        Admins.find({ userName, password }).then((docs) => {
            resolve(docs);

        }).catch((err) => {
            reject(err);
        })
    })
}

/*

   Function to get all admins from super admin table

 */

async function getAllAdmins() {
    return new Promise((resolve, reject) => {
        Admins.find({}).then((docs) => {
            resolve(docs);

        }).catch((err) => {
            reject(err);
        })
    })

}

/*

   Function to remove admin from super admin table 

 */

async function removeAdmin(userName) {
    return new Promise((resolve, reject) => {
        Admins.deleteOne({ userName }).then((docs) => {
            resolve(docs);

        }).catch((err) => {
            reject(err);
        })
    })

}

/*

   Function to remove profile from profiles table 
   of a particular admin only

 */

async function removeProfile(_id) {

    return new Promise((resolve, reject) => {
        Profiles.deleteOne({ _id }).then((docs) => {
            resolve(docs);

        }).catch((err) => {
            reject(err);
        })
    })

}


module.exports = {
    getContent,
    getTopic,
    getSubtopic,
    saveTopic,
    insertSubtopic,
    removeSubTopic,
    removeTopic,
    updateTopic,
    updateSubtopic,
    getProfiles,
    updateProfile,
    getSingleProfile,
    createProfile,
    reArrange,
    getAdmin,
    createAdmin,
    getAllAdmins,
    removeAdmin,
    removeProfile

}

