const express = require('express')
const router = new express.Router
var db = require("../database")

router.get("/api/courses", (req, res) => {
    db.getAllCourse().then((docs) => {
        res.status(200).json(docs);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.get("/api/course/:id", (req, res) => {
    db.getCourseById(req.params.id).then((docs) => {
        res.status(200).json(docs);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.post("/api/updateCourse/", (req, res) => {
    var data = req.body.data;
    db.updateCourse(data).then((docs) => {
        res.status(200).json(docs);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.get("/api/createCourse/", (req, res) => {
    console.log("lolipop")
    db.saveCourse({}).then((docs) => {
        res.status(200).json(docs);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    })
})
router.post("/api/publishCourse", (req, res) => {
    db.publishCourse(req.body.data).then((docs) => {
        res.status(200).json(docs);
    }).catch((err) => {
        res.status(500).json(err);
    })
})


// router.post("/api/getNotification",(req,res)=>{
//     db.getNotification(req.body.email).then((docs) => {
//         res.status(200).json(docs);
//     }).catch((err) => {
//         res.status(500).json(err);
//     })

// })
// router.post("/api/updateNotification",(req,res)=>{
//     db.updateNotification(req.body.data).then((docs) => {
//         res.status(200).json(docs);
//     }).catch((err) => {
//         res.status(500).json(err);
//     })

// })



module.exports = router