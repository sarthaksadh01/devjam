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
  get all the topics for content route

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
  get single topic based on topic Id
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
  get single video based on video Id
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

  function to save topic here the priority of the 
  new topic is  equal to total number of topics till now plus 1
  ie new topic is always added last in the list but can be later rearranged

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

  Function to save new subtopic based on the isDeliverable flag
  the subtopic is saved in respected table [video,deliverable]
  and later the id of that subtopic is saved in the subtopic array
  in topic table

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

   Function to remove  subtopic based on the isDeliverable flag
   the subtopic is removed from the respected table [video,deliverable]
   and later the id of that subtopic is popped from  the subtopic array
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

async function removeTopic(topicId) {
    return new Promise((resolve, reject) => {
        Topics.deleteOne({ _id: topicId }).then((value) => {
            resolve(value);
        }).catch((err) => {
            reject(err);
        })

    });

}

async function updateTopic(topic) {
    return new Promise((resolve, reject) => {
        Topics.findOneAndUpdate({ _id: topic._id }, topic).then((value) => {
            resolve(value);
        }).catch((err) => {
            reject(err);
        })

    });

}
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

async function getProfiles(id) {
    return new Promise((resolve, reject) => {
        Profiles.find({ createdBy: id }).then((doc) => {
            resolve(doc);
        }).catch((err) => {
            reject(err);
        })

    })
}
async function updateProfile(doc) {
    return new Promise((resolve, reject) => {
        Profiles.findOneAndUpdate({ _id: doc._id }, doc).then((doc) => {
            resolve(doc);
        }).catch((err) => {
            reject(err);
        })

    })
}
async function getSingleProfile(_id) {
    return new Promise((resolve, reject) => {
        Profiles.findOne({ _id }).then((doc) => {
            resolve(doc);
        }).catch((err) => {
            reject(err);
        })

    })
}
async function createProfile(doc) {
    return new Promise((resolve, reject) => {
        var _profile = new Profiles(doc);
        _profile.save((err, doc) => {
            if (err) reject(err);
            resolve(doc);

        });

    })
}

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

async function createAdmin(userName, password,name) {
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

async function getAdmin(userName, password) {
    return new Promise((resolve, reject) => {
        Admins.find({ userName, password }).then((docs) => {
            resolve(docs);

        }).catch((err) => {
            reject(err);
        })
    })
}

async function getAllAdmins() {
    return new Promise((resolve, reject) => {
        Admins.find({}).then((docs) => {
            resolve(docs);

        }).catch((err) => {
            reject(err);
        })
    })

}

async function removeAdmin(userName) {
    return new Promise((resolve, reject) => {
        Admins.deleteOne({ userName }).then((docs) => {
            resolve(docs);

        }).catch((err) => {
            reject(err);
        })
    })

}

async function removeProfile(_id){
    
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

