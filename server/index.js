/* 

This file is used to set up the server  

*/


const express = require('express')
var cors = require('cors')
const profileRouter = require("./routes/profileRouter")
const contentRouter = require("./routes/contentRouter");
const loginRouter = require("./routes/loginRouter");

const app = express()

const port = process.env.PORT || 3000


app.use(cors())
app.use(express.json())


app.use(profileRouter)
app.use(contentRouter)
app.use(loginRouter)



app.get('/', (req, res) => {
    res.send("<h1>Api running</h1>")
})

app.listen(port, () => {
    console.log('server up')
});