const express = require('express')
var cors = require('cors')
const profileRouter = require("./routes/profileRouter")
const contentRouter = require("./routes/contentRouter");
const loginRouter = require("./routes/loginRouter");
const marksRouter = require('./routes/marking')
const TestRouter = require('./routes/tests');
const CourseRouter = require('./routes/courses')
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

var j = schedule.scheduleJob('0 18 * 1-12 0-6', function () {
    var date  = new Date();
    var today = `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`

    db.getAllCourse().then((courses)=>{
        courses.forEach((course)=>{
            course.events.forEach((event)=>{
                var eventDate = new Date(event.start);
                eventDateFormat = `${eventDate.getDay()}-${eventDate.getMonth()}-${eventDate.getFullYear()}`;
                if(today === eventDateFormat){
                    // send notification here---

                }

            })
        })
    })


});



app.get('/', (req, res) => {
    res.send("<h1>Api running</h1>")
})

app.listen(port, () => {
    console.log('server up')
});