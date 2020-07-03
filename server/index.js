const express = require('express')
var cors = require('cors')
const profileRouter = require("./routes/profileRouter")
const contentRouter = require("./routes/contentRouter");
const loginRouter = require("./routes/loginRouter");
const marksRouter = require('./routes/marking')
const TestRouter = require('./routes/tests');
const CourseRouter = require('./routes/courses')
const CodinTestRouter = require('./routes/codingTestRouter')
const db = require('./database')
var schedule = require('node-schedule');

const app = express()

const port = process.env.PORT || 4000


app.use(cors())
app.use(express.json())


app.use(profileRouter)
app.use(contentRouter)
app.use(loginRouter)
app.use(marksRouter)
app.use(TestRouter)
app.use(CourseRouter)
app.use(CodinTestRouter)

var j = schedule.scheduleJob('0 18 * 1-12 0-6', function () {
    reminder().then((notifications) => {
        db.sendReminder(notifications);
    })
});

async function reminder() {

    return new Promise((resolve, reject) => {
        var date = new Date();
        var today = `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`
        var notifications = [];

        db.getAllCourse().then((courses) => {
            courses.forEach((course) => {
                var events = [];
                course.events.forEach((event) => {
                    var eventDate = new Date(event.start);
                    eventDateFormat = `${eventDate.getDay()}-${eventDate.getMonth()}-${eventDate.getFullYear()}`;
                    if (today === eventDateFormat) {
                        events.push(event);
                    }

                })
                if (events.length !== 0) {
                    notifications.push({
                        events,
                        receivers: course.courseFor,
                        courseId: course._id
                    })
                }
            })
            resolve(notifications);


        }).catch((err) => {
            reject(err);
        })
    })


}


app.get("/api/reminder", (req, res) => {
    reminder().then((notifications) => {
        db.sendReminder(notifications)
        res.json(notifications)
        

    }).catch((err) => {
        res.json(err);
    })

})


app.get('/', (req, res) => {
    res.send("<h1>Api running</h1>")
})

app.listen(port, () => {
    console.log('server up')
});