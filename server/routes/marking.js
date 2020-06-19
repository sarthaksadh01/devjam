const express = require('express')
const Topics = require('../models/topic')
const Users = require('../models/users')
const Submissions = require('../models/submission')
const db = require("../database")
const router = new express.Router


router.get("/api/marks",(req,res)=>{
    var result = {};
    db.getContent().then((topics)=>{
        result['topics'] = topics;
        db.getUsers().then((users)=>{
            result['users'] = users;
            res.status(200).json(result);
        })
    })

})

router.get("/api/user/:email",(req,res)=>{
    db.loginUser(req.params.email).then((users)=>{
        res.status(200).json(users[0]);
    })
})

router.get("/api/users",(req,res)=>{
    db.getUsers().then((users)=>{
        res.status(200).json(users);
    })
})

router.post("/api/updateMarks",(req,res)=>{
    const {email,points,subTopicId} = req.body;
     console.log(email)
    db.loginUser(email).then((users)=>{
        console.log(users[0])
        users[0].submissions.forEach((sub)=>{
            if(sub.subTopicId===subTopicId){
                sub['points'] = points;
            }
        })
        db.updateUser(email,users[0]).then((val)=>{
            res.status(200).json(val);

        }).catch((err)=>{
            res.status(500).json(err);

        })
    })
})

router.get("/api/usersPaginaton/:number",(req,res)=>{
    var number = req.params.number;
    number = parseInt(number);
    number = Math.abs(number);
    db.userPagination(req.params.number).then((docs)=>{
        res.status(200).json(docs)
    }).catch((err)=>{
        res.status(500).json(err)
    })
})


module.exports = router