/*

   This file contains routes specific to manage
   Admins & Super Admins.
   These routes will be used to query the database.

 */


const express = require('express')
var encrypt = require("sha256");
const router = new express.Router
var db = require("../database")



var superUser = encrypt("superGuest@zaio.io");
var superPass = encrypt("123456");

router.post("/api/login", (req, res) => {
    var userName = req.body.userName;
    var password = req.body.password;
    db.getAdmin(encrypt(userName), encrypt(password)).then((docs) => {
        console.log(docs);
        if (docs.length == 1) {
            res.status(200).json({
                success: true,
                userName: encrypt(userName),
                password: encrypt(password)

            })
        }
        else {
            res.status(200).json({
                success: false
            })

        }
    }).catch((err) => {
        res.status(500).json(err);
    })


});



router.post("/api/verifyLogin", (req, res) => {
    var userName = req.body.userName;
    var password = req.body.password;
    db.getAdmin(userName, password).then((docs) => {
        if (docs.length == 1) {
            res.status(200).json({
                success: true,
            })
        }
        else {
            res.status(200).json({
                success: false
            })

        }
    }).catch((err) => {
        res.status(500).json(err);
    })

});


router.post("/api/superLogin", (req, res) => {
    var userName = req.body.userName;
    var password = req.body.password;
    console.log(userName);
    console.log(password);
    if (userName === "superGuest@zaio.io" && password == "123456") {
        res.json({
            success: true,
            userName: superUser,
            password: superPass
        });
    }
    else {
        res.json({
            success: false
        })
    }

});

router.post("/api/verifySuperUser", (req, res) => {
    var userName = req.body.userName;
    var password = req.body.password;
    if (userName == superUser && password == superPass) {
        res.json({
            success: true,
        });
    }
    else {
        res.json({
            success: false
        })
    }

});


router.post("/api/registerAdmin", (req, res) => {
    var userName = req.body.userName;
    var password = req.body.password;
    db.createAdmin(encrypt(userName), encrypt(password),userName).then((doc) => {
        res.status(200).json(doc);
    }).catch((err) => {
        res.status(500).json(err);
    })

})

router.get("/api/getAdmins", (req, res) => {
    db.getAllAdmins().then((doc) => {
        res.status(200).json(doc);
    }).catch((err) => {
        res.status(500).json(err);
    })

})

router.post("/api/removeAdmin", (req, res) => {
    var userName = req.body.userName;
    db.removeAdmin(userName).then((doc) => {
        res.status(200).json(doc);
    }).catch((err) => {
        res.status(500).json(err);
    })
})



module.exports = router