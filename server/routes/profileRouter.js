/*

   This file contains routes specific to WarmUp Week Task i.e
   Profile Creator .
   These routes will be used to query the database.

 */

const express = require('express')
const profile = require('../models/profile')
const db = require("../database")
const router = new express.Router


router.get("/api/profiles/:id", (req, res) => {
    db.getProfiles(req.params.id).then((docs) => {
        res.status(200).json(docs);
    }).catch((err) => {
        res.status(500).json(err);
    })
})

router.post("/api/updateProfile", (req, res) => {
    var doc = req.body.profileData;
    db.updateProfile(doc).then((docs) => {
        res.status(200).json(docs);
    }).catch((err) => {
        res.status(500).json(err);
    })

})
router.post("/api/createProfile", (req, res) => {
    var doc = req.body.profileData;
    // console.log(doc);
    db.createProfile(doc).then((docs) => {
        console.log(docs);
        res.status(200).json(docs);
    }).catch((err) => {
        res.status(500).json(err);
    })

})



router.get("/api/profile/:id", (req, res) => {
    var _id = req.params.id;
    db.getSingleProfile(_id).then((docs) => {
        res.status(200).json(docs);
    }).catch((err) => {
        res.status(500).json(err);
    })

})

router.post("/api/removeProfile", (req, res) => {
    var _id = req.body.id;
    console.log(_id)
    // console.log(doc);
    db.removeProfile(_id).then((docs) => {
        console.log(docs);
        res.status(200).json(docs);
    }).catch((err) => {
        res.status(500).json(err);
    })

})


module.exports = router