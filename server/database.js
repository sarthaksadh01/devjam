const mongoose = require('mongoose')
var ObjectID = require('mongodb').ObjectID;
var nodemailer = require('nodemailer');

mongoose.connect(require("./config").dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, () => {
    console.log('connected to db')
}).catch((err) => {
    console.log(err)
})




const Topics = require("./models/topic")
const Profiles = require("./models/profile")
const Admins = require("./models/admin")
const Users = require("./models/users")
const Tests = require('./models/test')
const SubmissionsTest = require('./models/testSubmission')
const Notifications = require('./models/notification')
const Courses = require('./models/courses')
const CodingTests = require("./models/codingTestModel");
const CodingTestQuestion = require('./models/codingQuestions')
const codingTestHtml = require('./htmlTemplate').codingTestHtml
const codingTestResultHtml = require('./htmlTemplate').codingTestResultHtml

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cryptxsadh@gmail.com',
        pass: 'sarthak01'
    }
});

// Users.collection.drop();




/* 
  get all the topics for content route

*/

async function getContent(id) {
    return new Promise((resolve, reject) => {
        Topics.find({}).
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

async function removeProfile(_id) {

    return new Promise((resolve, reject) => {
        Profiles.deleteOne({ _id }).then((docs) => {
            resolve(docs);

        }).catch((err) => {
            reject(err);
        })
    })

}

async function registerUser(data) {
    return new Promise((resolve, reject) => {
        var _newUser = Users(data);
        _newUser.save().then((doc) => {
            resolve(doc);

        }).catch((err) => {
            console.log(err)
            reject(err);
        })
    })
}
async function loginUser(email) {
    return new Promise((resolve, reject) => {
        Users.find({ email }).then((users) => {
            resolve(users)

        }).catch((err) => {
            reject(err);
        })

    });
}

async function submitFile(data, email) {
    console.log("lol")
    return new Promise((resolve, reject) => {
        Users.findOneAndUpdate({ email }, {
            $push: {
                submissions: data
            }
        }).then((doc) => {
            console.log(doc);
            resolve(doc)
        }).catch((err) => {
            console.log(err);
            reject(err);
        })
    })

}
async function getSubmissions(email, subTopicId) {
    return new Promise((resolve, reject) => {
        Submissions.find({ email, subTopicId }).then((docs) => {
            resolve(docs);
        }).catch((err) => {
            reject(err);
        })
    })

}


async function getUsers() {
    return new Promise((resolve, reject) => {
        Users.find({}).
            sort({ name: 'asc' }).exec((err, res) => {
                if (err) reject(err);
                resolve(res);
            })
    })

}

async function updateSubmission(email, data) {
    return new Promise((resolve, reject) => {
        loginUser(email).then((users) => {
            for (var i = 0; i < users[0].submissions.length; i++) {
                if (users[0].submissions[i].subTopicId === data.subTopicId) {
                    users[0].submissions[i] = data;
                    break;
                }
            }
            Users.updateOne({ email }, users[0]).then((doc) => {
                resolve(doc);
            })
        })
    })

}

async function updateUser(email, user) {
    return new Promise((resolve, reject) => {
        Users.findOneAndUpdate({ email }, user).then((user) => {
            resolve(user);

        }).catch((err) => {
            reject(err);
        })
    })
}

async function userPagination(pageNumber) {
    return new Promise((resolve, reject) => {
        Users.find({}).limit(3).
            skip(3 * pageNumber).exec((err, doc) => {
                if (err) reject(err);
                resolve(doc);

            })
    })
}
async function getTest(_id) {
    return new Promise((resolve, reject) => {
        Tests.findOne({ _id }).then((test) => {
            resolve(test);
        }).catch((err) => {
            reject(err);
        })
    })

}
async function getAllTest() {
    return new Promise((resolve, reject) => {
        Tests.find({}).then((test) => {
            resolve(test);
        }).catch((err) => {
            reject(err);
        })
    })

}

async function updateTest(data) {
    return new Promise((resolve, reject) => {
        Tests.findOneAndUpdate({ _id: data._id }, data).then((test) => {
            // console.log(test)
            resolve(test);
        }).catch((err) => {
            console.log(err)
            reject(err);
        })
    })


}
async function createTest(data) {
    return new Promise((resolve, reject) => {
        var _test = new Tests(data);
        _test.save().then((doc) => {
            resolve(doc);
        }).catch((err) => {
            reject(err);
        })
    })

}

async function publishTest(data) {
    return new Promise((resolve, reject) => {
        sendMail(data.testFor, data.title, data._id);
        saveNotification(data.testFor, data.title, data._id)
        updateTest(data).then((doc) => {
            resolve(doc);
        }).catch((err) => {
            reject(err);
        })
    })
    s
}
async function saveTestSubmission(data) {
    return new Promise((resolve, reject) => {
        var _submission = new SubmissionsTest(data);
        _submission.save().then((doc) => {
            resolve(doc);
        }).catch((err) => {
            console.log(err)
            reject(err);
        })
    })


}

async function updateTestSubmission(data) {
    return new Promise((resolve, reject) => {
        SubmissionsTest.findOneAndUpdate({ _id: data._id }, data).then((doc) => {
            resolve(doc);

        }).catch((err) => {
            reject(err);
        })
    })


}
async function getTestSubmissions(testId) {
    return new Promise((resolve, reject) => {
        SubmissionsTest.findOne({ testId }).then((doc) => {
            resolve(doc);

        }).catch((err) => {
            reject(err);
        })
    })

}
async function getTestSubmission(email, testId) {
    return new Promise((resolve, reject) => {
        SubmissionsTest.findOne({ email, testId }).then((doc) => {
            resolve(doc);

        }).catch((err) => {
            reject(err);
        })
    })
}
async function getTestSubmissionsAll(email, testId) {
    return new Promise((resolve, reject) => {
        SubmissionsTest.find({}).then((doc) => {
            resolve(doc);

        }).catch((err) => {
            reject(err);
        })
    })
}

async function getTestSubmissionById(_id) {
    return new Promise((resolve, reject) => {
        SubmissionsTest.findOne({ _id }).then((doc) => {
            resolve(doc);

        }).catch((err) => {
            reject(err);
        })
    })
}

async function getTestSubmissionByTestId(id) {
    return new Promise((resolve, reject) => {
        SubmissionsTest.find({ testId: id }).then((doc) => {
            resolve(doc);

        }).catch((err) => {
            reject(err);
        })
    })

}

function releaseResult(test, submissions) {
    resultNotification(test, submissions)
    sendResultMail(submissions, test);
    submissions.forEach((submission) => {

        if (submission.isReleased === false) {
            submission.isReleased = true;
            if (submission.isStarted) {
                updateTestSubmission(submission)

            }
            else {
                saveTestSubmission(submission);
            }


        }

    })
}

function sendMail(users, title, link) {
    const mailOptions = {
        from: 'cryptxsadh@gmail.com', // sender address
        to: users, // list of receivers
        subject: 'New Test Released', // Subject line
        html: `<p>${title}</p><p><a href = "http://hiii-15fdf.web.app/test/${link}">View</a></p>`// plain text body
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });



}

function sendResultMail(submissions, test) {

    submissions.forEach((submission) => {
        var title = `Result Released for test ${test.title}`;
        var text = "You have not submitted the test \n your final score is 0";
        var email = submission.email;
        var isUrl = false;
        var url = ""
        if (submission.isReleased) return;
        if (submission.isStarted === true) {
            text = `Your Test score is ${calculateFinalMarks(submission)}`;
            url = submission._id;
        }
        const mailOptions = {
            from: 'cryptxsadh@gmail.com', // sender address
            to: email, // list of receivers
            subject: 'Test Result', // Subject line
            html: `<p>${title}</p><p>${text}</p><p><a href = "http://hiii-15fdf.web.app/result/${submission._id}">View</a></p>`// plain text body
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });

    })

}
function resultNotification(test, submissions) {
    submissions.forEach((submission) => {
        var title = `Result Released for test ${test.title}`;
        var text = "You have not submitted the test  your final score is 0";
        var email = submission.email;
        var isUrl = false;
        var url = ""
        if (submission.isReleased) return;
        if (submission.isStarted === true) {
            text = `Your Test score is ${calculateFinalMarks(submission)}`;
            url = `/result/${submission._id}`;
        }
        var _notification = new Notifications({
            title,
            text,
            email,
            isUrl,
            url
        });
        _notification.save();

    })

}
function calculateFinalMarks(submission) {
    if (submission.isStarted === false) return 0;
    var marks = 0;
    submission.ans.forEach((ans, index) => {
        marks += ans.finalMakrs;
    })
    return marks
}


function saveNotification(users, title, link) {
    users.forEach((user) => {
        var _notification = Notifications(
            {
                title: "New Test Released",
                email: user,
                text: `New test ${title}`,
                isLink: true,
                url: `/test/${link}`
            }
        );
        _notification.save();
    })

}

async function getNotification(email) {
    return new Promise((resolve, reject) => {
        Notifications.find({ email }).sort({ createdAt: 'desc' }).exec((err, docs) => {
            if (err) reject(err);
            resolve(docs);

        })
    });
}
async function updateNotification(data) {
    return new Promise((resolve, reject) => {
        Notifications.findOneAndUpdate({ _id: data._id }, data).then((notifications) => {
            resolve(notifications);
        }).catch((err) => {
            reject(err);
        })
    })

}

async function saveCourse(data) {
    return new Promise((resolve, reject) => {
        var _course = new Courses(data);
        _course.save().then((doc) => {
            resolve(doc);
        }).catch((err) => {
            console.log(err)
            reject(err);
        })
    })


}
async function getCourseById(_id) {
    return new Promise((resolve, reject) => {
        Courses.findOne({ _id }).then((doc) => {
            resolve(doc);

        }).catch((err) => {
            reject(err);
        })
    })

}
async function getAllCourse() {
    return new Promise((resolve, reject) => {
        Courses.find({}).then((doc) => {
            resolve(doc);

        }).catch((err) => {
            reject(err);
        })
    })

}

async function updateCourse(data) {
    return new Promise((resolve, reject) => {
        Courses.findOneAndUpdate({ _id: data._id }, data).then((doc) => {
            resolve(doc);

        }).catch((err) => {
            reject(err);
        })
    })


}

async function publishCourse(data) {
    sendCourseNotification(data.courseFor, data);
    sendCourseMail(data)
    return new Promise((resolve, reject) => {
        Courses.findOneAndUpdate({ _id: data._id }, data).then((doc) => {
            resolve(doc);

        }).catch((err) => {
            reject(err);
        })
    })

}

async function sendCourseMail(data) {

    data.courseFor.forEach((user) => {

        const mailOptions = {
            from: 'cryptxsadh@gmail.com', // sender address
            to: user, // list of receivers
            subject: 'New Course', // Subject line
            html: `<p>${data.title}</p><p><a href = "http://hiii-15fdf.web.app/course/${data._id}">View</a></p>`// plain text body
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });

    })

}

function sendCourseNotification(users, data) {
    users.forEach((user) => {
        var _notification = new Notifications({
            title: "New Course Released",
            text: `New Course ${data.title} `,
            email: user,
            isUrl: true,
            url: `/course/${data._id}`
        });
        _notification.save();

    })

}

function sendReminder(notifications) {
    console.log(notifications)
    notifications.forEach((notification) => {
        var html = '';
        var text = ''
        notification.events.forEach((event) => {
            html += `<p>${event.title}</p>`
            text += `${event.title}\n`
            console.log(html)
        });
        html += `<a href = "http://hiii-15fdf.web.app/course/${notification.courseId}">View</a>`
        notification.receivers.forEach((email) => {
            var _notification = new Notifications({
                title: "Reminder",
                text,
                email,
                isUrl: true,
                url: `/course/${notification.courseId}`
            });
            _notification.save();


            const mailOptions = {
                from: 'cryptxsadh@gmail.com', // sender address
                to: email, // list of receivers
                subject: 'Reminder', // Subject line
                html
            };

            transporter.sendMail(mailOptions, function (err, info) {
                if (err)
                    console.log(err)
                else
                    console.log(info);
            });

        })


    })
}

async function testSubmissionPagination(pageNumber) {
    return new Promise((resolve, reject) => {
        SubmissionsTest.find({}).limit(3).
            skip(3 * pageNumber).exec((err, doc) => {
                if (err) reject(err);
                resolve(doc);

            })
    })
}

async function getAllcodingTest() {
    return new Promise((resolve, reject) => {
        CodingTests.find({}).then((docs) => {
            resolve(docs);
        }).catch((err) => {
            reject(err);
        })
    })
}
async function getCodingTestById(_id) {
    return new Promise((resolve, reject) => {
        CodingTests.findOne({ _id }).then((docs) => {
            resolve(docs);
        }).catch((err) => {
            reject(err);
        })
    })
}

async function updateCodingTest(data) {
    return new Promise((resolve, reject) => {
        CodingTests.findOneAndUpdate({ _id: data._id }, data).then((docs) => {
            resolve(docs);
        }).catch((err) => {
            reject(err);
        })
    })
}

async function createCodingTest(data) {
    return new Promise((resolve, reject) => {
        var _codingTest = new CodingTests(data);
        _codingTest.save().then((doc) => {
            resolve(doc);
        }).catch((err) => {
            reject(err);
        })
    })
}

async function getAllQuestions() {
    return new Promise((resolve, reject) => {
        CodingTestQuestion.find({}).then((docs) => {
            resolve(docs);
        }).catch((err) => {
            reject(err);
        })
    })

}

async function updateQueston(data) {
    return new Promise((resolve, reject) => {
        CodingTestQuestion.findOneAndUpdate({ _id: data._id }, data).then((docs) => {
            resolve(docs);
        }).catch((err) => {
            reject(err);
        })
    })

}
async function getQuestion(_id) {
    return new Promise((resolve, reject) => {
        CodingTestQuestion.findOne({ _id }).then((docs) => {
            resolve(docs);
        }).catch((err) => {
            reject(err);
        })
    })


}
async function createQuestion(data) {
    return new Promise((resolve, reject) => {
        var _codingTestQuestion = new CodingTestQuestion(data);
        _codingTestQuestion.save().then((doc) => {
            resolve(doc);
        }).catch((err) => {
            reject(err);
        })
    })
}

async function publishCodingTest(data) {
    sendCodingChallengeMail(data);
    return new Promise((resolve, reject) => {
        CodingTests.findOneAndUpdate({ _id: data._id }, data).then((doc) => {
            resolve(doc);

        }).catch((err) => {
            reject(err);

        })
    })

}
function sendCodingChallengeMail(test) {
    test.testFor.forEach((email) => {
        const mailOptions = {
            from: 'cryptxsadh@gmail.com', // sender address
            to: email, // list of receivers
            subject: 'New Coding Test Released', // Subject line
            html: codingTestHtml(`http://hiii-15fdf.web.app/coding-test/${test._id}`)// plain text body
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });
    })


}
function sendCodingChallengeMail2(test,submissions) {
    submissions.forEach((submission) => {
        const mailOptions = {
            from: 'cryptxsadh@gmail.com', // sender address
            to: submission.email, // list of receivers
            subject: `Test Result Released Marks : ${calculateFinalMarks2(submission,test.questions)}`, // Subject line
            html: submission.isStarted?codingTestResultHtml(`http://hiii-15fdf.web.app/coding-test-result/${submission._id}`):codingTestResultHtml(`http://hiii-15fdf.web.app/notifications`)
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });

    })
 

}
function resultNotification2(test, submissions) {
    submissions.forEach((submission) => {
        var title = `Result Released for test ${test.title}`;
        var text = "You have not submitted the test  your final score is 0";
        var email = submission.email;
        var isUrl = false;
        var url = ""
        if (submission.isReleased) return;
        if (submission.isStarted === true) {
            isUrl = true;
            text = `Your Test score is ${calculateFinalMarks2(submission,test.questions)}`;
            url = `/coding-test-result/${submission._id}`;
        }
        var _notification = new Notifications({
            title,
            text,
            email,
            isUrl,
            url
        });
        _notification.save();

    })

}

function calculateFinalMarks2(submission,questions) {
   
    if (submission.isStarted === false) return 0;
    var marks = 0;
    submission.ans.forEach((ans, index) => {
        if (!ans.isSubmitted) return;
        if (ans.questionType === "coding") {
            ans.submission.result.forEach((output, index2) => {
                if (output.stderr === '') {
                    if (output.stdout === questions[index].testCases[index2].output)
                        marks += parseInt(questions[index].testCases[index2].points);
                }
            })

        }
        else {
            marks += parseInt(ans.finalMarks);
        }
    })
    return marks
}

function releaseResult2(test, submissions) {
    resultNotification2(test, submissions)
    sendCodingChallengeMail2(test, submissions);
    submissions.forEach((submission) => {

        if (submission.isReleased === false) {
            submission.isReleased = true;
            if (submission.isStarted) {
                updateTestSubmission(submission)

            }
            else {
                saveTestSubmission(submission);
            }


        }

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
    removeProfile,
    registerUser,
    loginUser,
    submitFile,
    getSubmissions,
    getUsers,
    updateSubmission,
    updateUser,
    userPagination,
    publishTest,
    getAllTest,
    getTest,
    updateTest,
    createTest,
    getTestSubmission,
    getTestSubmissions,
    updateTestSubmission,
    saveTestSubmission,
    getTestSubmissionsAll,
    getTestSubmissionById,
    getNotification,
    updateNotification,
    getTestSubmissionByTestId,
    releaseResult,
    saveCourse,
    getCourseById,
    updateCourse,
    getAllCourse,
    publishCourse,
    sendReminder,
    testSubmissionPagination,
    getAllcodingTest,
    getCodingTestById,
    updateCodingTest,
    createCodingTest,
    createQuestion,
    getQuestion,
    updateQueston,
    getAllQuestions,
    publishCodingTest,
    releaseResult2


}



